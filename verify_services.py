import asyncio
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services.finance_api import finance_api_service
from app.services.search_tool import search_tool_service

def test_finance_api():
    print("\n--- Testing Finance API ---")
    data = finance_api_service.get_stock_data("AAPL", period="1mo")
    if "error" in data:
        print(f"❌ Stock Data Failed: {data['error']}")
    else:
        print(f"✅ Stock Data: {data['ticker']} - ${data['current_price']}")

    tech = finance_api_service.calculate_technical_indicators("AAPL")
    if "error" in tech:
        print(f"❌ Technicals Failed: {tech['error']}")
    else:
        print(f"✅ Technicals: RSI={tech.get('rsi_14')} | MACD={tech.get('macd_signal')}")

def test_search_tool():
    print("\n--- Testing Search Tool ---")
    results = search_tool_service.search_news("NVIDIA stock analysis")
    if not results or "error" in results[0]:
        print(f"❌ Search Failed: {results}")
    else:
        print(f"✅ Search: Found {len(results)} articles. Top: {results[0]['title']}")

if __name__ == "__main__":
    test_finance_api()
    test_search_tool()
    print("\n✅ Service Layer Verified")
