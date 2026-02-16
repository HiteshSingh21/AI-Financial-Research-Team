import os
import pytest


class TestConfig:

    def test_settings_loads(self):
        from app.core.config import settings
        assert settings.PROJECT_NAME == "Financial AI Analyst"

    def test_database_url_set(self):
        from app.core.config import settings
        assert settings.DATABASE_URL is not None
        assert len(settings.DATABASE_URL) > 0

    def test_faiss_index_dir(self):
        from app.core.config import settings
        assert settings.FAISS_INDEX_DIR is not None
        assert "faiss_index" in settings.FAISS_INDEX_DIR

    def test_raw_pdf_dir(self):
        from app.core.config import settings
        assert settings.RAW_PDF_DIR is not None
        assert "raw_pdfs" in settings.RAW_PDF_DIR

    def test_gemini_model_default(self):
        from app.core.config import settings
        assert settings.GEMINI_MODEL == "gemini-1.5-flash"


class TestDatabase:

    def test_init_db(self, engine):
        from sqlmodel import SQLModel, inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        assert "chathistory" in tables
        assert "analysisreport" in tables

    def test_chat_history_model(self, db_session):
        from app.db.models import ChatHistory
        record = ChatHistory(
            user_id="test_user",
            query="Analyze AAPL",
            response="AAPL looks bullish"
        )
        db_session.add(record)
        db_session.commit()
        db_session.refresh(record)

        assert record.id is not None
        assert record.user_id == "test_user"
        assert record.timestamp is not None

    def test_analysis_report_model(self, db_session):
        from app.db.models import AnalysisReport
        report = AnalysisReport(
            ticker="NVDA",
            verdict="Buy",
            report_content="NVDA shows strong momentum."
        )
        db_session.add(report)
        db_session.commit()
        db_session.refresh(report)

        assert report.id is not None
        assert report.ticker == "NVDA"
        assert report.verdict == "Buy"
        assert report.created_at is not None


class TestLogger:

    def test_get_logger(self):
        from app.core.logging import get_logger
        logger = get_logger("test_module")
        assert logger.name == "test_module"
        assert len(logger.handlers) > 0
