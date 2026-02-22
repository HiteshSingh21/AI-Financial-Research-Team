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

fundamental_analyst = Agent(
    name="Librarian Agent",
    role="Fundamental Analyst",
    model=Gemini(id=settings.GEMINI_MODEL),
    tools=[mcp_tools],
    instructions=[
        "You are a Fundamental Analyst.",
        "Use `search_documents` to find facts in internal files (10-K, 10-Q).",
        "Focus on Revenue, Profit Margins, Debt, and Risks.",
        "If no documents are found, state that clearly.",
        "Provide a fundamental assessment based ONLY on the retrieved context.",
    ],
    markdown=True,
)
