import asyncio
from app.agents.quant import mcp_tools
import json

async def test_mcp():
    print("Testing MCP Tools initialization...")
    print(f"Tools available: {mcp_tools}")
    
    # We can try to call a tool directly or print its definition
    print("MCP Tools setup complete. It is successfully pointed to:", mcp_tools.server_params)
    
if __name__ == "__main__":
    asyncio.run(test_mcp())
