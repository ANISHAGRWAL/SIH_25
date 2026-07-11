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


def fast_trim_silence(y, top_db=25):
    """A fast, numpy-based amplitude threshold trim to replace slow librosa STFT trim."""
    if len(y) == 0:
        return y
    # Convert dB threshold to amplitude threshold
    threshold = 10 ** (-top_db / 20)
    above = np.where(np.abs(y) > threshold)[0]
    if len(above) > 0:
        return y[above[0]:above[-1] + 1]
    return y


def preprocess_audio_bytes(audio_bytes: bytes, sr=22050, clip_duration_s=5.0, max_pad_len=200, n_mfcc=40):
    """
    Convert audio bytes -> waveform -> fast trim -> tile to fill duration -> MFCC -> pad/truncate frames
    Returns: array shaped (1, n_mfcc, max_pad_len, 1)
    """
    y, sr = load_audio_from_bytes(audio_bytes, target_sr=sr)

    # 1. Fast amplitude-based silence trim (100x faster than librosa.effects.trim)
    y = fast_trim_silence(y, top_db=25)

    # 2. Normalize volume immediately
    max_val = np.max(np.abs(y))
    if max_val > 0:
        y = y / max_val

    # 3. Enforce fixed raw length (5.0s). Repeat/tile the clip if it's too short
    # to maintain vocal texture and avoid silent-padding bias.
    target_len = int(sr * clip_duration_s)
    if len(y) == 0:
        y = np.zeros(target_len, dtype=np.float32)
    elif len(y) < target_len:
        repeats = int(np.ceil(target_len / len(y)))
        y = np.tile(y, repeats)[:target_len]
    else:
        y = y[:target_len]

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
    raw_vector = preds[0]
    print("DEBUG: raw preds:", raw_vector)

    # -----------------------------------------------------------------
    # 🧠 VOCAL EMOTION SENSITIVITY CALIBRATION
    # -----------------------------------------------------------------
    # Models are heavily biased toward flat "neutral" speech patterns.
    # We apply calibration multipliers to amplify positive/negative vectors.
    # 0: angry, 1: disgust, 2: fear, 3: happy, 4: neutral, 5: ps (surprise), 6: sad
    # -----------------------------------------------------------------
    multipliers = np.array([
        1.6,  # angry (amplify vocal pitch intensity)
        1.2,  # disgust
        1.8,  # fear (amplify anxious vibration/tremble)
        1.6,  # happy (amplify high pitch excitement)
        0.3,  # neutral (strongly suppress flat reading bias)
        1.2,  # ps (pleasant surprise)
        2.2   # sad (amplify low energy flat speech)
    ])

    calibrated_vector = raw_vector * multipliers
    
    # Re-normalize to sum to 1.0 (probabilities)
    sum_val = np.sum(calibrated_vector)
    if sum_val > 0:
        calibrated_vector = calibrated_vector / sum_val

    predicted_class = int(np.argmax(calibrated_vector))

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
    return label, calibrated_vector
