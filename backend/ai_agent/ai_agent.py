import os
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage

# Load env
load_dotenv()
GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
TAVILY_API_KEY = os.environ.get("TAVILY_API_KEY")
GOOGLE_GEMINI_API_KEY = os.environ.get("GOOGLE_GEMINI_API_KEY")

BASE_SYSTEM_PROMPT = """
You are an AI best-friend motivator whose mission is to lift people’s moods and support their mental health. 
You can switch styles:
- Funny Bestie → silly jokes, playful sarcasm, short and warm replies.  
- Tough-Love Coach → blunt but caring, direct push to take small action.  
- Cute Comfort Bot → gentle, wholesome, supportive, with emojis and soft tone.  
- Roast + Hype Friend → loving roasts, hype energy, like a friend who clowns but uplifts.  

Rules:
1. Always validate the user’s feelings first.  
2. Suggest ONE small, doable action (drink water, stretch, text a friend, breathe, tidy a corner).  
3. Keep responses short (2–4 sentences).  
4. Never be cruel, shaming, or medical.  
5. If user expresses self-harm or crisis → STOP jokes/roasts. Respond calmly, urge them to contact a hotline, local emergency services, or a trusted person.
"""

# 🔹 Crisis detection helper
def check_crisis_with_ai(llm, user_text: str) -> bool:
    """
    Ask the LLM to classify whether the text shows suicidal/self-harm intent.
    Returns True if crisis detected.
    """
    crisis_prompt = """
    You are a mental health safety classifier. 
    Your task: Read the user's message and ONLY answer with "YES" if it indicates suicidal thoughts, self-harm, 
    or wanting to end life. Otherwise, ONLY answer "NO".
    Do not give explanations.
    """
    messages = [
        SystemMessage(content=crisis_prompt),
        HumanMessage(content=user_text)
    ]
    resp = llm.invoke(messages)
    answer = resp.content.strip().lower()
    return "yes" in answer


# 🔹 Main agent
def get_response_from_ai_agent(llm_id, query, allow_search=True, style_choice=None, provider="Gemini"):
    """
    llm_id: Model name (auto set in backend)
    query: List of user messages
    allow_search: Always True unless overridden
    style_choice: Optional (can be ignored if you want hard-coded styles per provider)
    provider: "Groq" or "Gemini"
    """

    # Force backend defaults here instead of frontend needing to send them
    if provider == "Groq":
        llm = ChatGroq(model=llm_id, api_key=GROQ_API_KEY)
        style_prompt = (
            "You speak like a boy/man talking to their friend when they are struggling "
            "with their mental health. You should use a 'Tough-Love Coach' style."
        )
    elif provider == "Gemini":
        llm = ChatGoogleGenerativeAI(model=llm_id, google_api_key=GOOGLE_GEMINI_API_KEY)
        style_prompt = (
            "You speak like a caring, cute girl helping a friend with their mental health. "
            "You should use a 'Cute Comfort Bot' style."
        )
    else:
        raise ValueError("Provider must be 'Groq' or 'Gemini'")

    # ✅ Crisis check (always enforced — frontend does not control this)
    latest_message = query[-1] if query else ""
    if latest_message and check_crisis_with_ai(llm, latest_message):
        print("🚨 Crisis detected! (Email alert would be sent here)")
        return (
            "I hear you. You’re not alone. 💙 "
            "Please reach out to a trusted person or a helpline immediately."
        )

    # Normal agent setup
    final_system_prompt = f"{BASE_SYSTEM_PROMPT}\n\n{style_prompt}"

    tools = (
        [TavilySearchResults(max_results=2, tavily_api_key=TAVILY_API_KEY)]
        if allow_search
        else []
    )

    from langgraph.prebuilt import create_react_agent
    agent = create_react_agent(model=llm, tools=tools)

    message_history = [SystemMessage(content=final_system_prompt)]
    message_history.extend([HumanMessage(content=msg) for msg in query])

    initial_state = {"messages": message_history}
    response = agent.invoke(initial_state)

    messages = response.get("messages")
    ai_messages = [message.content for message in messages if isinstance(message, AIMessage)]

    return ai_messages[-1] if ai_messages else "No response generated."
