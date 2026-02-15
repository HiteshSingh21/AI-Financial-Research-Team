"""
The Journalist Agent — Sentiment Analyst.
Uses Agno framework to wrap SearchTool.
"""
from agno.agent import Agent
from agno.models.google import Gemini
from app.core.config import settings
from app.services.search_tool import search_tool_service

def search_news(query: str, max_results: int = 5) -> list[dict]:
    """Search for recent news articles."""
    return search_tool_service.search_news(query, max_results)

sentiment_analyst = Agent(
    name="Journalist Agent",
    role="Sentiment Analyst",
    model=Gemini(id=settings.GEMINI_MODEL),
    tools=[search_news],
    instructions=[
        "You are a Sentiment Analyst.",
        "Use `search_news` to find the latest articles about the company.",
        "Analyze the headlines and snippets to determine market sentiment.",
        "Categorize sentiment as Positive, Negative, or Neutral.",
        "Highlight any major events (earnings, lawsuits, product launches).",
    ],
    markdown=True,
)
