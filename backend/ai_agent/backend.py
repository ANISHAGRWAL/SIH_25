from pydantic import BaseModel
from typing import List
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from ai_agent import get_response_from_ai_agent

app = FastAPI(title="LangGraph AI Agent")

# ✅ Only allow these providers
DEFAULT_MODELS = {
    "Gemini": "gemini-2.5-flash",
    "Groq": "llama-3.3-70b-versatile"
}

# ✅ Enable CORS for frontend (adjust origins if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # your frontend dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RequestState(BaseModel):
    model_provider: str       # "Gemini" or "Groq"
    messages: List[str]       # chat messages
    allow_search: bool = True # always true by default
    crisis_detection: bool = True  # always true by default


@app.post("/chat")
def chat_endpoint(request: RequestState):
    """
    API Endpoint to interact with the AI Agent.
    Crisis detection is handled inside the AI agent itself.
    """

    provider = request.model_provider
    query = request.messages

    if provider not in DEFAULT_MODELS:
        return {"error": "Invalid provider. Choose 'Gemini' or 'Groq'."}

    llm_id = DEFAULT_MODELS[provider]

    response = get_response_from_ai_agent(
        llm_id=llm_id,
        query=query,
        allow_search=request.allow_search,
        style_choice=None,   # style is fixed in ai_agent.py
        provider=provider
    )

    return {"response": response}


# Step3: Run app & Explore Swagger UI Docs
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
