# model_utils.py
from tensorflow import keras
import numpy as np
import io
import librosa
import soundfile as sf

# Try to wire pydub to ffmpeg provided by imageio-ffmpeg (no apt-get needed)
try:
    from pydub import AudioSegment
    from imageio_ffmpeg import get_ffmpeg_exe

    ffmpeg_exe = get_ffmpeg_exe()
    AudioSegment.converter = ffmpeg_exe
    # pydub might also try ffprobe; imageio-ffmpeg does not provide ffprobe,
    # but pydub usually works for decoding via ffmpeg alone.
    pydub_available = True
    print(f"DEBUG: imageio-ffmpeg ffmpeg_exe = {ffmpeg_exe}")
except Exception as e:
    AudioSegment = None
    pydub_available = False
    print("DEBUG: imageio-ffmpeg or pydub not available:", repr(e))


def load_model(model_path: str):
    """Load and return a Keras model from the given path."""
    return keras.models.load_model(model_path)


def load_audio_from_bytes(audio_bytes: bytes, target_sr=22050):
    """
    Try to load bytes as WAV using soundfile. If that fails, fall back to pydub (webm/ogg/mp3/etc).
    Returns: (waveform_float32, sr)
    Raises RuntimeError on failure.
    """
    # 1) Try soundfile (fast, no ffmpeg)
    try:
        y, sr = sf.read(io.BytesIO(audio_bytes), dtype="float32")
        if y is None:
            raise RuntimeError("soundfile returned None")
        if y.ndim > 1:
            y = np.mean(y, axis=1)
        if sr != target_sr:
            y = librosa.resample(y, orig_sr=sr, target_sr=target_sr)
            sr = target_sr
        print(f"DEBUG: loaded audio via soundfile (sr={sr}, samples={y.shape[0]})")
        return y.astype(np.float32), sr
    except Exception as e_wav:
        print(f"DEBUG: soundfile failed: {e_wav!r} — falling back to pydub if available")

    # 2) Fallback: pydub (requires imageio-ffmpeg or ffmpeg in PATH)
    if not pydub_available:
        raise RuntimeError("Audio format not recognized and pydub/imageio-ffmpeg not available.")

    # Try autodetect; if fails, try explicit formats
    audio = None
    last_exc = None
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
        print("DEBUG: pydub autodetected format")
    except Exception as e_auto:
        last_exc = e_auto
        audio = None
        for fmt in ("webm", "ogg", "mp4", "m4a", "mp3"):
            try:
                audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=fmt)
                print(f"DEBUG: pydub decoded using explicit format='{fmt}'")
                break
            except Exception as e_fmt:
                last_exc = e_fmt

    if audio is None:
        raise RuntimeError(f"pydub failed to decode audio. Last error: {last_exc!r}")

    # convert to mono + target_sr
    audio = audio.set_frame_rate(target_sr).set_channels(1)
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)

    # normalize integer PCM to float32 [-1,1]
    try:
        max_val = np.iinfo(audio.array_type).max
        samples = samples / float(max_val)
    except Exception:
        max_abs = np.abs(samples).max() if samples.size else 1.0
        if max_abs > 0:
            samples = samples / max_abs

    print(f"DEBUG: loaded audio via pydub (sr={target_sr}, samples={samples.shape[0]})")
    return samples.astype(np.float32), target_sr


def preprocess_audio_bytes(audio_bytes: bytes, sr=22050, clip_duration_s=5.0, max_pad_len=200, n_mfcc=40):
    """
    Convert audio bytes -> waveform -> enforce fixed duration -> trim/normalize -> MFCC -> pad/truncate frames
    Returns: array shaped (1, n_mfcc, max_pad_len, 1)
    """
    y, sr = load_audio_from_bytes(audio_bytes, target_sr=sr)

    # Enforce fixed raw length (e.g., 5 seconds used in training)
    target_len = int(sr * clip_duration_s)
    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)), mode="constant")
    else:
        y = y[:target_len]

    # Trim silence (if you used this in training)
    y, _ = librosa.effects.trim(y, top_db=25)

    # Normalize (same as training)
    y = librosa.util.normalize(y)

    # Compute MFCCs (shape: (n_mfcc, time_frames))
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)

    # Pad or truncate time frames to max_pad_len
    if mfcc.shape[1] < max_pad_len:
        pad_width = max_pad_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode="constant")
    else:
        mfcc = mfcc[:, :max_pad_len]

    # Reshape to (1, n_mfcc, max_pad_len, 1) for your CNN
    mfcc = mfcc.reshape(1, n_mfcc, max_pad_len, 1).astype(np.float32)
    print("DEBUG: preprocess result shape:", mfcc.shape)
    return mfcc


def model_predict(model, audio_bytes: bytes):
    """
    Preprocess audio bytes and run model prediction.
    Returns: (label_str, preds_vector)
    """
    # Ensure these match what you used during training:
    train_sr = 22050
    clip_duration_s = 5.0
    max_pad_len = 200
    n_mfcc = 40

    x = preprocess_audio_bytes(audio_bytes, sr=train_sr, clip_duration_s=clip_duration_s,
                               max_pad_len=max_pad_len, n_mfcc=n_mfcc)

    preds = model.predict(x)
    print("DEBUG: raw preds:", preds[0])

    predicted_class = int(np.argmax(preds, axis=1)[0])

    labels_map = {
        0: "angry",
        1: "disgust",
        2: "fear",
        3: "happy",
        4: "neutral",
        5: "ps",
        6: "sad",
    }

    label = labels_map.get(predicted_class, str(predicted_class))
    return label, preds[0]
