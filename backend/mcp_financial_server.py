from typing import Annotated
from pydantic import Field
from mcp.server.fastmcp import FastMCP

from app.services.finance_api import finance_api_service
from app.services.rag_service import rag_service

# Initialize FastMCP Server
mcp = FastMCP("Financial Research Server")

# Define strict types for input validation
TickerStr = Annotated[
    str,
    Field(
        pattern=r"^[^$]*$",
        description="The stock ticker symbol (e.g., AAPL). MUST NOT contain $."
    )
]

@mcp.tool()
def get_stock_data(ticker: TickerStr, period: str = "6mo") -> dict:
    """Get historical stock price data."""
    clean = ticker.strip().upper()
    return finance_api_service.get_stock_data(clean, period)

@mcp.tool()
def get_company_info(ticker: TickerStr) -> dict:
    """Get fundamental company information."""
    clean = ticker.strip().upper()
    return finance_api_service.get_company_info(clean)

@mcp.tool()
def calculate_technical_indicators(ticker: TickerStr, period: str = "6mo") -> dict:
    """Calculate technical indicators like RSI, MACD, and SMA."""
    clean = ticker.strip().upper()
    return finance_api_service.calculate_technical_indicators(clean, period)

@mcp.tool()
def search_documents(query: str, top_k: int = 5) -> list[dict]:
    """Search internal financial documents (10-K, 10-Q) using RAG."""
    return rag_service.query(query, top_k)

if __name__ == "__main__":
    mcp.run()
