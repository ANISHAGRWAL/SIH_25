import numpy as np
import pandas as pd
import os
from sentence_transformers import SentenceTransformer
from config import HF_EMBEDDING_MODEL

EMBEDDING_FILE = "data/embeddings.npy"
META_FILE = "data/embedding_meta.csv"

# Load embedding model once
model = SentenceTransformer(HF_EMBEDDING_MODEL)


def embed_entry(entry_id: int, text: str, user_id: str = None, date: str = None):
    """
    Encode a journal entry into vector space and store it with metadata.
    """
    # Generate embedding
    vector = model.encode([text])[0]

    # --- Save embeddings ---
    if os.path.exists(EMBEDDING_FILE):
        embeddings = np.load(EMBEDDING_FILE)
        embeddings = np.vstack([embeddings, vector])
    else:
        embeddings = np.array([vector])

    np.save(EMBEDDING_FILE, embeddings)

    # --- Save metadata ---
    if os.path.exists(META_FILE):
        meta = pd.read_csv(META_FILE)
    else:
        meta = pd.DataFrame(columns=["entry_id", "user_id", "date"])

    meta = pd.concat([meta, pd.DataFrame([{
        "entry_id": entry_id,
        "user_id": user_id,
        "date": date
    }])], ignore_index=True)

    meta.to_csv(META_FILE, index=False)

    print(f"[DEBUG] Embedded entry_id={entry_id}, user={user_id}, date={date}")


def load_embeddings():
    """Load all embeddings + metadata."""
    if not os.path.exists(EMBEDDING_FILE) or not os.path.exists(META_FILE):
        return None, None

    embeddings = np.load(EMBEDDING_FILE)
    meta = pd.read_csv(META_FILE)
    return embeddings, meta
