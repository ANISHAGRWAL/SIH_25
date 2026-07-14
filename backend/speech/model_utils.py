# model_utils.py
from tensorflow import keras
import numpy as np
import io
import time
import librosa
import soundfile as sf

# Try to wire pydub to ffmpeg provided by imageio-ffmpeg (no apt-get needed)
try:
    from pydub import AudioSegment
    from imageio_ffmpeg import get_ffmpeg_exe

    ffmpeg_exe = get_ffmpeg_exe()
    AudioSegment.converter = ffmpeg_exe
    pydub_available = True
    print(f"DEBUG: imageio-ffmpeg ffmpeg_exe = {ffmpeg_exe}")
except Exception as e:
    AudioSegment = None
    pydub_available = False
    print("DEBUG: imageio-ffmpeg or pydub not available:", repr(e))


def load_model(model_path: str):
    """Load and return a Keras model from the given path."""
    return keras.models.load_model(model_path)


def load_audio_from_bytes(audio_bytes: bytes, target_sr=22050, max_seconds=8.0):
    """
    Try to load bytes as WAV using soundfile. If that fails, fall back to pydub (webm/ogg/mp3/etc).

    IMPORTANT SPEED FIX: audio is clamped to `max_seconds` at its NATIVE sample
    rate *before* resampling. The old code resampled the full, untrimmed
    recording first -- if the browser sent a long clip at 44100/48000 Hz,
    librosa's default high-quality resampler could take minutes. Clamping
    first means we only ever resample a few seconds of audio.

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

        # Clamp at native sample rate BEFORE resampling (this is the fix)
        max_native_samples = int(sr * max_seconds)
        if len(y) > max_native_samples:
            y = y[:max_native_samples]

        if sr != target_sr:
            # soxr_qq is a much faster (lower-quality-but-fine-for-MFCCs)
            # resampler than the old default (kaiser_best / soxr_hq).
            y = librosa.resample(y, orig_sr=sr, target_sr=target_sr, res_type="soxr_qq")
            sr = target_sr

        print(f"DEBUG: loaded audio via soundfile (sr={sr}, samples={y.shape[0]})")
        return y.astype(np.float32), sr
    except Exception as e_wav:
        print(f"DEBUG: soundfile failed: {e_wav!r} — falling back to pydub if available")

    # 2) Fallback: pydub (requires imageio-ffmpeg or ffmpeg in PATH)
    if not pydub_available:
        raise RuntimeError("Audio format not recognized and pydub/imageio-ffmpeg not available.")

    audio = None
    last_exc = None
    try:
        audio = AudioSegment.from_file(io.BytesIO(audio_bytes))
        print("DEBUG: pydub autodetected format")
    except Exception as e_auto:
        last_exc = e_auto
        audio = None
        # webm first: this is what browsers (MediaRecorder) send in the vast
        # majority of cases, so try it before burning time on the rest.
        for fmt in ("webm", "ogg", "mp4", "m4a", "mp3"):
            try:
                audio = AudioSegment.from_file(io.BytesIO(audio_bytes), format=fmt)
                print(f"DEBUG: pydub decoded using explicit format='{fmt}'")
                break
            except Exception as e_fmt:
                last_exc = e_fmt

    if audio is None:
        raise RuntimeError(f"pydub failed to decode audio. Last error: {last_exc!r}")

    # Clamp duration BEFORE resampling here too
    if len(audio) > max_seconds * 1000:
        audio = audio[: int(max_seconds * 1000)]

    # convert to mono + target_sr
    audio = audio.set_frame_rate(target_sr).set_channels(1)
    samples = np.array(audio.get_array_of_samples()).astype(np.float32)

    try:
        max_val = np.iinfo(audio.array_type).max
        samples = samples / float(max_val)
    except Exception:
        max_abs = np.abs(samples).max() if samples.size else 1.0
        if max_abs > 0:
            samples = samples / max_abs

    print(f"DEBUG: loaded audio via pydub (sr={target_sr}, samples={samples.shape[0]})")
    return samples.astype(np.float32), target_sr


def preprocess_audio_bytes(audio_bytes: bytes, sr=22050, clip_duration_s=3.0, max_pad_len=200, n_mfcc=40):
    """
    Convert audio bytes -> waveform -> MFCC -> pad/truncate frames.

    IMPORTANT: this mirrors `extract_features` from Cell 15 of the training
    notebook -- the function that actually built X/y and trained the model
    (NOT the later `preprocess_audio` from Cell 25, which was only used for
    ad-hoc testing AFTER training and adds trim/normalize the model never
    saw during training).

    extract_features did:
        y, sr = librosa.load(file_path, duration=3, offset=0.5)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40)
        # zero-pad the MFCC time-frame axis (NOT the raw waveform) if short

    No silence trim, no amplitude normalization -- MFCC's first coefficient
    carries loudness info the model learned to use, so normalizing live
    audio strips out a feature it relies on. Trimming a noisier live mic
    recording can also gut real speech in a way clean studio TESS clips
    never triggered. Both were pushing predictions toward "quiet/flat"
    classes (disgust/sad).

    Returns: array shaped (1, n_mfcc, max_pad_len, 1)
    """
    y, sr = load_audio_from_bytes(audio_bytes, target_sr=sr, max_seconds=max(clip_duration_s + 2.0, 8.0))

    # Match librosa.load(..., duration=3): truncate to clip_duration_s worth
    # of samples. Do NOT trim silence, do NOT normalize amplitude -- neither
    # happened when the training data (X) was actually built in Cell 15's
    # extract_features. Padding, when needed, happens on the MFCC frame axis
    # below (matching extract_features exactly), not on the raw waveform.
    target_len = int(sr * clip_duration_s)
    if len(y) > target_len:
        y = y[:target_len]
    if len(y) == 0:
        y = np.zeros(target_len, dtype=np.float32)

    # Compute MFCCs (shape: (n_mfcc, time_frames))
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)

    # Pad or truncate time frames to max_pad_len
    if mfcc.shape[1] < max_pad_len:
        pad_width = max_pad_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, pad_width=((0, 0), (0, pad_width)), mode="constant")
    else:
        mfcc = mfcc[:, :max_pad_len]

    mfcc = mfcc.reshape(1, n_mfcc, max_pad_len, 1).astype(np.float32)
    print("DEBUG: preprocess result shape:", mfcc.shape)
    return mfcc


def model_predict(model, audio_bytes: bytes):
    """
    Preprocess audio bytes and run model prediction.
    Returns: (label_str, preds_vector)
    """
    # These now match the training pipeline exactly:
    train_sr = 22050
    clip_duration_s = 3.0
    max_pad_len = 200
    n_mfcc = 40

    t0 = time.time()
    x = preprocess_audio_bytes(audio_bytes, sr=train_sr, clip_duration_s=clip_duration_s,
                               max_pad_len=max_pad_len, n_mfcc=n_mfcc)
    print(f"DEBUG: preprocessing took {time.time() - t0:.2f}s")

    t1 = time.time()
    preds = model.predict(x, verbose=0)
    print(f"DEBUG: model.predict took {time.time() - t1:.2f}s")

    raw_vector = preds[0]
    print("DEBUG: raw preds:", raw_vector)

    # NOTE: the old "calibration multipliers" hack (manually boosting
    # angry/fear/sad and suppressing neutral) has been removed. It was
    # very likely compensating for the tiling-vs-zero-padding mismatch
    # above, which biased the model toward "neutral". Now that
    # preprocessing matches training, the raw model output should be
    # used as-is. If you still see a strong neutral bias after this fix,
    # that's a model/data issue (e.g. TESS dataset actor-reading bias)
    # and should be addressed by retraining/fine-tuning, not by
    # multiplying probabilities after the fact.
    predicted_class = int(np.argmax(raw_vector))

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
    return label, raw_vector

