"""
Tests for API endpoints — health, analyze, ingest, history.
"""
import pytest
from unittest.mock import patch, MagicMock


class TestHealthEndpoint:
    """Test the /health endpoint."""

    def test_health_check(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "active"
        assert "version" in data


class TestAnalyzeEndpoint:
    """Test the /api/v1/analyze endpoint."""

    @patch("app.api.v1.endpoints.supervisor_agent")
    def test_analyze_stock_success(self, mock_supervisor, client):
        """Test successful stock analysis."""
        mock_response = MagicMock()
        mock_response.content = "## AAPL Analysis\n**Verdict: BUY**\nStrong fundamentals."
        mock_supervisor.run.return_value = mock_response

        response = client.post(
            "/api/v1/analyze",
            params={"query": "Analyze AAPL", "user_id": "test_user"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "response" in data
        assert "AAPL" in data["response"]
        mock_supervisor.run.assert_called_once_with("Analyze AAPL")

    @patch("app.api.v1.endpoints.supervisor_agent")
    def test_analyze_stock_error(self, mock_supervisor, client):
        """Test analyze endpoint error handling."""
        mock_supervisor.run.side_effect = Exception("LLM API limit reached")

        response = client.post(
            "/api/v1/analyze",
            params={"query": "Analyze TSLA", "user_id": "test_user"}
        )
        assert response.status_code == 500

    def test_analyze_missing_query(self, client):
        """Test analyze endpoint without query parameter."""
        response = client.post("/api/v1/analyze")
        assert response.status_code == 422  # Unprocessable Entity


class TestIngestEndpoint:
    """Test the /api/v1/ingest endpoint."""

    @patch("app.api.v1.endpoints.rag_service")
    def test_ingest_pdf_success(self, mock_rag, client, tmp_path):
        """Test successful PDF ingestion."""
        mock_rag.ingest_pdf.return_value = {
            "status": "success",
            "file": "test_10k.pdf",
            "pages": 50,
            "chunks_added": 75,
            "total_chunks": 75,
        }

        # Create a fake PDF file
        fake_pdf = b"%PDF-1.4 fake content"
        response = client.post(
            "/api/v1/ingest",
            files={"file": ("test_10k.pdf", fake_pdf, "application/pdf")}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["chunks_added"] == 75

    def test_ingest_no_file(self, client):
        """Test ingest endpoint without a file."""
        response = client.post("/api/v1/ingest")
        assert response.status_code == 422


class TestHistoryEndpoint:
    """Test the /api/v1/history endpoint."""

    def test_get_history_empty(self, client):
        """Test getting history for a user with no entries."""
        response = client.get("/api/v1/history/new_user")
        assert response.status_code == 200
        assert response.json() == []

    @patch("app.api.v1.endpoints.supervisor_agent")
    def test_get_history_after_analysis(self, mock_supervisor, client):
        """Test that analysis results appear in history."""
        mock_response = MagicMock()
        mock_response.content = "Test analysis result"
        mock_supervisor.run.return_value = mock_response

        # Create an analysis
        client.post(
            "/api/v1/analyze",
            params={"query": "Test query", "user_id": "history_test_user"}
        )

        # Check history
        response = client.get("/api/v1/history/history_test_user")
        assert response.status_code == 200
        data = response.json()
        assert len(data) >= 1
        assert data[0]["query"] == "Test query"
        assert data[0]["response"] == "Test analysis result"
