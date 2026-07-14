# app.py
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np

from model_utils import load_model, model_predict

app = FastAPI(title="Speech Recognition Service")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = None

LABELS_MAP = {
    0: "angry",
    1: "disgust",
    2: "fear",
    3: "happy",
    4: "neutral",
    5: "ps",
    6: "sad",
}


@app.on_event("startup")
def startup_event():
    global MODEL
    MODEL = load_model("models/my_model.h5")

    try:
        print("MODEL input_shape:", MODEL.input_shape)
    except Exception:
        print("Could not read MODEL.input_shape")

    try:
        dummy_input = np.zeros((1, 40, 200, 1), dtype=np.float32)
        MODEL.predict(dummy_input, verbose=0)
        print("MODEL warmed up successfully. Cold-start latency eliminated.")
    except Exception as e_warm:
        print("Could not warm up model:", repr(e_warm))


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    contents = await file.read()  # bytes
    label, vector = model_predict(MODEL, contents)

    # ---- DEBUG: raw probability vector, labeled and sorted ----
    # Temporary logging to diagnose whether the raw model output actually
    # shifts between different emotions, or whether it's stuck near one
    # class regardless of input. Remove once diagnosis is done.
    vector_list = [float(v) for v in vector]
    labeled = {LABELS_MAP[i]: round(vector_list[i], 4) for i in range(len(vector_list))}
    sorted_labeled = dict(sorted(labeled.items(), key=lambda kv: kv[1], reverse=True))

    print("DEBUG: predicted label:", label)
    print("DEBUG: raw probability vector (sorted):", sorted_labeled)
    # -------------------------------------------------------------

    return {
        "label": label,
        "vector": vector_list,
        "probabilities": sorted_labeled,  # labeled + sorted for easy reading
    }


@app.get("/wake-up")
async def wake_up():
    """
    A simple endpoint to wake up the server from a cold start.
    Does nothing but return a success message.
    """
    return {"status": "awake"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)