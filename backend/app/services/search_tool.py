"""
Search Tool Service — Web search for latest news and headlines.
Supports DuckDuckGo (free, no key) and Tavily (optional, better quality).
"""
from duckduckgo_search import DDGS
from app.core.logging import get_logger
from app.core.config import settings

log = get_logger(__name__)


class SearchToolService:
    """Searches the web for real-time news about a stock or financial topic."""

    def search_news(self, query: str, max_results: int = 8) -> list[dict]:
        """
        Search for recent news articles.
        Tries Tavily first (if API key available), falls back to DuckDuckGo.
        Returns list of {title, url, snippet, source}.
        """
        if settings.TAVILY_API_KEY:
            return self._search_tavily(query, max_results)
        return self._search_duckduckgo(query, max_results)

    def _search_tavily(self, query: str, max_results: int) -> list[dict]:
        """Search using Tavily API (higher quality, requires key)."""
        log.info(f"Searching Tavily for: {query}")
        try:
            from tavily import TavilyClient
            client = TavilyClient(api_key=settings.TAVILY_API_KEY)
            response = client.search(
                query=query,
                search_depth="basic",
                max_results=max_results,
                include_answer=False,
            )
            results = []
            for r in response.get("results", []):
                results.append({
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "snippet": r.get("content", "")[:300],
                    "source": "tavily",
                })
            log.info(f"Tavily returned {len(results)} results")
            return results
        except Exception as e:
            log.warning(f"Tavily search failed: {e}. Falling back to DuckDuckGo.")
            return self._search_duckduckgo(query, max_results)

    def _search_duckduckgo(self, query: str, max_results: int) -> list[dict]:
        """Search using DuckDuckGo (free, no API key needed)."""
        log.info(f"Searching DuckDuckGo for: {query}")
        try:
            results = []
            with DDGS() as ddgs:
                for r in ddgs.news(query, max_results=max_results):
                    results.append({
                        "title": r.get("title", ""),
                        "url": r.get("url", ""),
                        "snippet": r.get("body", "")[:300],
                        "source": r.get("source", "duckduckgo"),
                        "date": r.get("date", ""),
                    })
            log.info(f"DuckDuckGo returned {len(results)} results")
            return results
        except Exception as e:
            log.error(f"DuckDuckGo search failed: {e}")
            return [{"error": str(e)}]


# Singleton instance
search_tool_service = SearchToolService()
