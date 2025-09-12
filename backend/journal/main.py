from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from journal_manager import save_journal_entry, load_journal_entries
from embedding_manager import embed_entry
from report_generator import generate_weekly_report

app = FastAPI()

# ✅ Allow frontend (React/Next.js) to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # change to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JournalEntry(BaseModel):
    user_id: str
    date: str  # YYYY-MM-DD
    entry: str


# ✅ Add a single entry (daily journaling)
@app.post("/add_entry/")
def add_entry(data: JournalEntry):
    # Save journal entry (and get scores)
    scores = save_journal_entry(data.user_id, data.date, data.entry)
    
    # Save embeddings
    embed_entry(data.user_id, data.entry)
    
    return {"message": "Entry saved successfully", "scores": scores}


# ✅ Add multiple entries at once (batch upload for 7 days testing)
@app.post("/add_entries/")
def add_entries(data: List[JournalEntry]):
    results = []
    for entry in data:
        scores = save_journal_entry(entry.user_id, entry.date, entry.entry)
        embed_entry(entry.user_id, entry.entry)
        results.append({"date": entry.date, "scores": scores})
    
    return {"message": f"{len(data)} entries saved successfully", "details": results}


# ✅ Get all user entries (for frontend diary view)
@app.get("/get_entries/{user_id}")
def get_entries(user_id: str):
    entries = load_journal_entries(user_id)
    return {"entries": entries}


@app.get("/weekly_report/{user_id}")
def weekly_report(user_id: str, start_date: Optional[str] = None, end_date: Optional[str] = None):
    return generate_weekly_report(user_id, start_date=start_date, end_date=end_date)


# ✅ Health check route (optional but useful)
@app.get("/")
def root():
    return {"message": "Journal API running 🚀"}
