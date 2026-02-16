from agno.agent import Agent
from agno.models.google import Gemini
from app.core.config import settings
from app.services.finance_api import finance_api_service

def get_stock_data(ticker: str, period: str = "6mo") -> dict:
    return finance_api_service.get_stock_data(ticker, period)

def get_company_info(ticker: str) -> dict:
    return finance_api_service.get_company_info(ticker)

def calculate_technical_indicators(ticker: str, period: str = "6mo") -> dict:
    return finance_api_service.calculate_technical_indicators(ticker, period)

technical_analyst = Agent(
    name="Quant Agent",
    role="Technical Analyst",
    model=Gemini(id=settings.GEMINI_MODEL),
    tools=[get_stock_data, get_company_info, calculate_technical_indicators],
    instructions=[
        "You are a Technical Analyst.",
        "Use `get_stock_data` to check price history.",
        "Use `calculate_technical_indicators` to get RSI, MACD, and Trends.",
        "Analyze the data and provide a technical verdict (Bullish/Bearish/Neutral) with key levels.",
        "Always cite the indicators you used.",
    ],
    markdown=True,
)
