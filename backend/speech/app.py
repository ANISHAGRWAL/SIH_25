# app.py (only the relevant parts shown)
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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

@app.on_event("startup")
def startup_event():
    global MODEL
    MODEL = load_model("backend/speech/models/my_model.h5")
    # optional: print model input shape / summary for debugging
    try:
        print("MODEL input_shape:", MODEL.input_shape)
    except Exception:
        print("Could not read MODEL.input_shape")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    contents = await file.read()  # bytes
    # call model_predict which expects raw audio bytes
    label, vector = model_predict(MODEL, contents)
    # return class label and probability vector
    return {"label": label, "vector": vector.tolist()}

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
