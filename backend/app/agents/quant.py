from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.mcp import MCPTools
from mcp.client.stdio import StdioServerParameters
from app.core.config import settings
import sys
import os

mcp_server_cmd = sys.executable
mcp_server_args = [os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "mcp_financial_server.py")]
mcp_tools = MCPTools(url=settings.MCP_SERVER_URI) if settings.MCP_SERVER_URI else MCPTools(server_params=StdioServerParameters(command=mcp_server_cmd, args=mcp_server_args))

technical_analyst = Agent(
    name="Quant Agent",
    role="Technical Analyst",
    model=Gemini(id=settings.GEMINI_MODEL),
    tools=[mcp_tools],
    instructions=[
        "You are a Technical Analyst.",
        "Use `get_stock_data` to check price history.",
        "Use `calculate_technical_indicators` to get RSI, MACD, and Trends.",
        "Analyze the data and provide a technical verdict (Bullish/Bearish/Neutral) with key levels.",
        "Always cite the indicators you used.",
    ],
    markdown=True,
)
