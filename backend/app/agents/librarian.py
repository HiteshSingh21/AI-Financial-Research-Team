from agno.agent import Agent
from agno.models.google import Gemini
from app.core.config import settings
from app.services.rag_service import rag_service

def search_documents(query: str, top_k: int = 5) -> list[dict]:
    return rag_service.query(query, top_k)

fundamental_analyst = Agent(
    name="Librarian Agent",
    role="Fundamental Analyst",
    model=Gemini(id=settings.GEMINI_MODEL),
    tools=[search_documents],
    instructions=[
        "You are a Fundamental Analyst.",
        "Use `search_documents` to find facts in internal files (10-K, 10-Q).",
        "Focus on Revenue, Profit Margins, Debt, and Risks.",
        "If no documents are found, state that clearly.",
        "Provide a fundamental assessment based ONLY on the retrieved context.",
    ],
    markdown=True,
)
