"""
The Aggregator Agent — Synthesis Engine.
Uses Agno framework to synthesize reports from other agents.
"""
from agno.agent import Agent
from agno.models.google import Gemini
from app.core.config import settings

aggregator_agent = Agent(
    name="Aggregator Agent",
    role="Lead Editor",
    model=Gemini(id=settings.GEMINI_MODEL),
    instructions=[
        "You are the Lead Editor and Financial Strategist.",
        "You receive reports from the Fundamental (Librarian), Technical (Quant), and Sentiment (Journalist) analysts.",
        "Your job is to synthesize these into a single, cohesive Investment Report.",
        "1. Start with an Executive Summary (Buy/Sell/Hold verdict).",
        "2. Dedicate a section to each analyst's findings.",
        "3. Resolve any contradictions (e.g., strong fundamentals but weak technicals).",
        "4. Be professional, clear, and action-oriented.",
    ],
    show_tool_calls=False,
    markdown=True,
)
