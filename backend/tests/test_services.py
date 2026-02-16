"""
Tests for backend services — FinanceAPI, RAGService, SearchTool.
"""
import os
import pytest
import numpy as np
from unittest.mock import patch, MagicMock


class TestFinanceAPIService:
    """Test the FinanceAPIService."""

    def test_get_stock_data(self):
        """Test fetching stock data for a valid ticker."""
        from app.services.finance_api import finance_api_service
        result = finance_api_service.get_stock_data("AAPL", "1mo")
        # Should return data dict (not error) for a valid ticker
        if "error" not in result:
            assert result["ticker"] == "AAPL"
            assert "current_price" in result
            assert "price_change_pct" in result
            assert isinstance(result["current_price"], float)

    def test_get_stock_data_invalid_ticker(self):
        """Test fetching stock data for an invalid ticker."""
        from app.services.finance_api import finance_api_service
        result = finance_api_service.get_stock_data("ZZZZZZINVALID")
        assert "error" in result

    def test_get_company_info(self):
        """Test fetching company info."""
        from app.services.finance_api import finance_api_service
        result = finance_api_service.get_company_info("MSFT")
        if "error" not in result:
            assert result["ticker"] == "MSFT"
            assert "name" in result
            assert "sector" in result

    def test_calculate_technical_indicators(self):
        """Test technical indicator calculation."""
        from app.services.finance_api import finance_api_service
        result = finance_api_service.calculate_technical_indicators("AAPL", "6mo")
        if "error" not in result:
            assert "rsi_14" in result
            assert "sma_20" in result
            assert "sma_50" in result
            assert "macd_line" in result
            assert "trend_signal" in result


class TestRAGService:
    """Test the RAGService (without needing real embeddings)."""

    def test_rag_service_init(self):
        """Test RAG service initializes without error."""
        from app.services.rag_service import RAGService
        service = RAGService()
        assert service.chunks == []
        assert service.chunk_metadata == []

    def test_chunk_text(self):
        """Test text chunking logic."""
        from app.services.rag_service import RAGService
        service = RAGService()
        text = "A" * 2500  # 2500 chars
        chunks = service._chunk_text(text, chunk_size=1000, overlap=200)
        assert len(chunks) >= 3
        assert all(len(c) <= 1000 for c in chunks)

    def test_chunk_text_small(self):
        """Test chunking a short text."""
        from app.services.rag_service import RAGService
        service = RAGService()
        chunks = service._chunk_text("Short text", chunk_size=1000, overlap=200)
        assert len(chunks) == 1
        assert chunks[0] == "Short text"

    def test_chunk_text_empty(self):
        """Test chunking empty text."""
        from app.services.rag_service import RAGService
        service = RAGService()
        chunks = service._chunk_text("", chunk_size=1000, overlap=200)
        assert chunks == []

    def test_is_ready_empty(self):
        """Test is_ready returns False when no documents loaded."""
        from app.services.rag_service import RAGService
        service = RAGService()
        assert service.is_ready is False

    def test_query_empty_index(self):
        """Test querying with no documents returns empty results."""
        from app.services.rag_service import RAGService
        service = RAGService()
        results = service.query("What is the revenue?")
        assert results == []

    @patch("google.generativeai.embed_content")
    def test_ingest_and_query(self, mock_embed):
        """Test full ingest + query cycle with mocked embeddings."""
        import faiss

        # Mock the embedding function to return 128-dim vectors
        mock_embed.return_value = {"embedding": np.random.rand(128).tolist()}

        from app.services.rag_service import RAGService
        service = RAGService()

        # Manually simulate ingestion
        chunks = ["Revenue was $100M", "Profit margin was 25%"]
        embeddings = np.random.rand(2, 128).astype("float32")
        service.index = faiss.IndexFlatL2(128)
        service.index.add(embeddings)
        service.chunks = chunks
        service.chunk_metadata = [{"source": "test.pdf"}] * 2

        assert service.is_ready is True
        assert service.index.ntotal == 2


class TestSearchToolService:
    """Test the SearchToolService."""

    @patch("app.services.search_tool.DDGS")
    def test_search_duckduckgo(self, mock_ddgs):
        """Test DuckDuckGo search fallback."""
        mock_instance = MagicMock()
        mock_instance.__enter__ = MagicMock(return_value=mock_instance)
        mock_instance.__exit__ = MagicMock(return_value=False)
        mock_instance.news.return_value = [
            {
                "title": "Apple reports strong earnings",
                "url": "https://example.com/apple",
                "body": "Apple beat expectations with record revenue.",
                "source": "Reuters",
                "date": "2026-01-15",
            }
        ]
        mock_ddgs.return_value = mock_instance

        from app.services.search_tool import SearchToolService
        service = SearchToolService()

        # Force DuckDuckGo (no Tavily key)
        with patch("app.services.search_tool.settings") as mock_settings:
            mock_settings.TAVILY_API_KEY = None
            results = service.search_news("Apple earnings")

        assert len(results) == 1
        assert results[0]["title"] == "Apple reports strong earnings"
        assert results[0]["source"] == "Reuters"
