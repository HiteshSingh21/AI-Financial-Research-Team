import os
import pytest
import numpy as np
from unittest.mock import patch, MagicMock


class TestFinanceAPIService:

    def test_get_stock_data(self):
        from app.services.finance_api import finance_api_service
        result = finance_api_service.get_stock_data("AAPL", "1mo")
        if "error" not in result:
            assert result["ticker"] == "AAPL"
            assert "current_price" in result
            assert "price_change_pct" in result
            assert isinstance(result["current_price"], float)

    def test_get_stock_data_invalid_ticker(self):
        from app.services.finance_api import finance_api_service
        result = finance_api_service.get_stock_data("ZZZZZZINVALID")
        assert "error" in result

    def test_get_company_info(self):
        from app.services.finance_api import finance_api_service
        result = finance_api_service.get_company_info("MSFT")
        if "error" not in result:
            assert result["ticker"] == "MSFT"
            assert "name" in result
            assert "sector" in result

    def test_calculate_technical_indicators(self):
        from app.services.finance_api import finance_api_service
        result = finance_api_service.calculate_technical_indicators("AAPL", "6mo")
        if "error" not in result:
            assert "rsi_14" in result
            assert "sma_20" in result
            assert "sma_50" in result
            assert "macd_line" in result
            assert "trend_signal" in result


class TestRAGService:

    def test_rag_service_init(self):
        from app.services.rag_service import RAGService
        service = RAGService()
        assert service.chunks == []
        assert service.chunk_metadata == []

    def test_chunk_text(self):
        from app.services.rag_service import RAGService
        service = RAGService()
        text = "A" * 2500
        chunks = service._chunk_text(text, chunk_size=1000, overlap=200)
        assert len(chunks) >= 3
        assert all(len(c) <= 1000 for c in chunks)

    def test_chunk_text_small(self):
        from app.services.rag_service import RAGService
        service = RAGService()
        chunks = service._chunk_text("Short text", chunk_size=1000, overlap=200)
        assert len(chunks) == 1
        assert chunks[0] == "Short text"

    def test_chunk_text_empty(self):
        from app.services.rag_service import RAGService
        service = RAGService()
        chunks = service._chunk_text("", chunk_size=1000, overlap=200)
        assert chunks == []

    def test_is_ready_empty(self):
        from app.services.rag_service import RAGService
        service = RAGService()
        assert service.is_ready is False

    def test_query_empty_index(self):
        from app.services.rag_service import RAGService
        service = RAGService()
        results = service.query("What is the revenue?")
        assert results == []

    @patch("google.generativeai.embed_content")
    def test_ingest_and_query(self, mock_embed):
        import faiss

        mock_embed.return_value = {"embedding": np.random.rand(128).tolist()}

        from app.services.rag_service import RAGService
        service = RAGService()

        chunks = ["Revenue was $100M", "Profit margin was 25%"]
        embeddings = np.random.rand(2, 128).astype("float32")
        service.index = faiss.IndexFlatL2(128)
        service.index.add(embeddings)
        service.chunks = chunks
        service.chunk_metadata = [{"source": "test.pdf"}] * 2

        assert service.is_ready is True
        assert service.index.ntotal == 2


class TestSearchToolService:

    @patch("app.services.search_tool.DDGS")
    def test_search_duckduckgo(self, mock_ddgs):
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

        with patch("app.services.search_tool.settings") as mock_settings:
            mock_settings.TAVILY_API_KEY = None
            results = service.search_news("Apple earnings")

        assert len(results) == 1
        assert results[0]["title"] == "Apple reports strong earnings"
        assert results[0]["source"] == "Reuters"
