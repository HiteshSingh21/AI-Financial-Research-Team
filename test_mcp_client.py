import asyncio
import os
import sys
from mcp import ClientSession
from mcp.client.stdio import stdio_client, StdioServerParameters

async def run():
    server_params = StdioServerParameters(
        command=sys.executable,
        args=[os.path.join(os.getcwd(), "backend", "mcp_financial_server.py")]
    )
    print("Starting client...")
    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("✅ Connected to MCP Server!")
                
                # List tools
                tools = await session.list_tools()
                print("\n✅ Tools available:")
                for tool in tools.tools:
                    print(f" - {tool.name}")
                    if tool.name == "get_company_info":
                        print(f"   Schema: {tool.inputSchema}")
                    
                # Try valid ticker
                print("\n✅ Executing get_company_info with AAPL...")
                result = await session.call_tool("get_company_info", arguments={"ticker": "AAPL"})
                print("Result format:", [r.text[:100] + "..." for r in result.content if hasattr(r, 'text')])
                
                # Try invalid ticker
                print("\n✅ Executing get_company_info with $AAPL (should fail schema validation)...")
                try:
                    result = await session.call_tool("get_company_info", arguments={"ticker": "$AAPL"})
                    print(f"Result is_error: {getattr(result, 'isError', None)}")
                    print(f"Result content: {result.content}")
                    if getattr(result, 'isError', False):
                        print("✅ Schema Validation Worked! The MCP server returned an error flag.")
                    else:
                        print("❌ Error: Schema validation failed to catch the $ sign.")
                except Exception as e:
                    print(f"✅ Schema Validation Worked! Caught error: {e}")
    except Exception as e:
        import traceback
        print(f"Failed to connect to MCP:")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(run())
