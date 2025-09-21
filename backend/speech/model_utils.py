# model_utils.py
from tensorflow import keras
import numpy as np
import io
import librosa
import soundfile as sf

# optional pydub fallback
try:
    from pydub import AudioSegment
    pydub_available = True
except Exception:
    AudioSegment = None
    pydub_available = False


def load_model(model_path: str):
    """Load and return a Keras model."""
    return keras.models.load_model(model_path)


def load_audio_from_bytes(audio_bytes: bytes, target_sr=22050):
    """
    Try to load as WAV using soundfile, fallback to pydub for webm/ogg/mp3.
    Returns waveform (float32), sr
    """
    # 1) Try with soundfile
    try:
        y, sr = sf.read(io.BytesIO(audio_bytes), dtype="float32")
        if y.ndim > 1:
            y = np.mean(y, axis=1)  # stereo → mono
        if sr != target_sr:
            y = librosa.resample(y, orig_sr=sr, target_sr=target_sr)
            sr = target_sr
        return y.astype(np.float32), sr
    except Exception:
        pass

    # 2) Fallback with pydub
    if not pydub_available:
        raise RuntimeError("Install pydub + ffmpeg for non-WAV formats")

    audio = None
    last_exc = None
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
    except Exception as e:
        last_exc = e
        for fmt in ("webm", "ogg", "mp4", "m4a", "mp3"):
            try:
                audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=fmt)
                break
            except Exception as e_fmt:
                last_exc = e_fmt
    if audio is None:
        raise RuntimeError(f"pydub could not decode audio: {last_exc!r}")

    audio = audio.set_frame_rate(target_sr).set_channels(1)
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)

    # normalize integer PCM to [-1,1]
    try:
        max_val = np.iinfo(audio.array_type).max
        samples = samples / float(max_val)
    except Exception:
        max_abs = np.abs(samples).max() or 1.0
        samples = samples / max_abs

    return samples.astype(np.float32), target_sr


def preprocess_audio_bytes(audio_bytes: bytes, sr=22050, max_pad_len=200, n_mfcc=40):
    """
    Decode → enforce 5 sec length → trim silence → normalize → MFCC → pad/truncate
    Returns: (1, n_mfcc, max_pad_len, 1)
    """
    y, sr = load_audio_from_bytes(audio_bytes, target_sr=sr)

    # 🔑 Force 5 sec fixed length (110,250 samples at 22050 Hz)
    target_len = sr * 5
    if len(y) < target_len:
        y = np.pad(y, (0, target_len - len(y)))
    else:
        y = y[:target_len]

    # trim silence (same as training)
    y, _ = librosa.effects.trim(y, top_db=25)

    # normalize
    y = librosa.util.normalize(y)

    # MFCC (n_mfcc, time_frames)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)

    # pad/truncate to fixed time frames (200)
    if mfcc.shape[1] < max_pad_len:
        pad_width = max_pad_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode="constant")
    else:
        mfcc = mfcc[:, :max_pad_len]

    return mfcc.reshape(1, n_mfcc, max_pad_len, 1).astype(np.float32)


def model_predict(model, audio_bytes: bytes):
    sr = 22050
    max_pad_len = 200
    n_mfcc = 40

    x = preprocess_audio_bytes(audio_bytes, sr=sr, max_pad_len=max_pad_len, n_mfcc=n_mfcc)
    print("DEBUG: model_predict input shape:", x.shape)

    preds = model.predict(x)
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
