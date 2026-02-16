import os
import pickle
import numpy as np
from app.core.logging import get_logger
from app.core.config import settings

log = get_logger(__name__)


class RAGService:

    def __init__(self):
        self.index = None
        self.chunks: list[str] = []
        self.chunk_metadata: list[dict] = []
        self._index_path = os.path.join(settings.FAISS_INDEX_DIR, "index.faiss")
        self._chunks_path = os.path.join(settings.FAISS_INDEX_DIR, "chunks.pkl")
        self._load_index()

    def _get_embedding(self, text: str) -> list[float]:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        result = genai.embed_content(
            model=settings.GEMINI_EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document",
        )
        return result["embedding"]

    def _get_query_embedding(self, text: str) -> list[float]:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        result = genai.embed_content(
            model=settings.GEMINI_EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_query",
        )
        return result["embedding"]

    def _load_index(self):
        if os.path.exists(self._index_path) and os.path.exists(self._chunks_path):
            try:
                import faiss
                self.index = faiss.read_index(self._index_path)
                with open(self._chunks_path, "rb") as f:
                    data = pickle.load(f)
                    self.chunks = data["chunks"]
                    self.chunk_metadata = data.get("metadata", [])
                log.info(f"Loaded FAISS index with {self.index.ntotal} vectors")
            except Exception as e:
                log.warning(f"Could not load FAISS index: {e}")
        else:
            log.info("No existing FAISS index found. Start by ingesting PDFs.")

    def _save_index(self):
        import faiss
        os.makedirs(settings.FAISS_INDEX_DIR, exist_ok=True)
        faiss.write_index(self.index, self._index_path)
        with open(self._chunks_path, "wb") as f:
            pickle.dump({"chunks": self.chunks, "metadata": self.chunk_metadata}, f)
        log.info(f"Saved FAISS index with {self.index.ntotal} vectors")

    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> list[str]:
        chunks = []
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunk = text[start:end]
            if chunk.strip():
                chunks.append(chunk.strip())
            start += chunk_size - overlap
        return chunks

    def ingest_pdf(self, file_path: str) -> dict:
        import faiss
        from PyPDF2 import PdfReader

        log.info(f"Ingesting PDF: {file_path}")
        try:
            reader = PdfReader(file_path)
            full_text = ""
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    full_text += page_text + "\n"

            if not full_text.strip():
                return {"error": "No text extracted from PDF"}

            new_chunks = self._chunk_text(full_text)
            log.info(f"Created {len(new_chunks)} chunks from {len(reader.pages)} pages")

            embeddings = []
            for i, chunk in enumerate(new_chunks):
                emb = self._get_embedding(chunk)
                embeddings.append(emb)
                if (i + 1) % 10 == 0:
                    log.info(f"  Embedded {i + 1}/{len(new_chunks)} chunks...")

            embedding_matrix = np.array(embeddings, dtype="float32")

            if self.index is None:
                dim = embedding_matrix.shape[1]
                self.index = faiss.IndexFlatL2(dim)

            self.index.add(embedding_matrix)

            filename = os.path.basename(file_path)
            for chunk in new_chunks:
                self.chunks.append(chunk)
                self.chunk_metadata.append({"source": filename})

            self._save_index()

            return {
                "status": "success",
                "file": filename,
                "pages": len(reader.pages),
                "chunks_added": len(new_chunks),
                "total_chunks": len(self.chunks),
            }
        except Exception as e:
            log.error(f"Error ingesting PDF: {e}")
            return {"error": str(e)}

    def query(self, question: str, top_k: int = 5) -> list[dict]:
        if self.index is None or self.index.ntotal == 0:
            log.warning("No documents in FAISS index. Returning empty results.")
            return []

        try:
            query_emb = np.array([self._get_query_embedding(question)], dtype="float32")
            distances, indices = self.index.search(query_emb, min(top_k, self.index.ntotal))

            results = []
            for dist, idx in zip(distances[0], indices[0]):
                if idx < len(self.chunks):
                    results.append({
                        "chunk": self.chunks[idx],
                        "score": round(float(dist), 4),
                        "source": self.chunk_metadata[idx].get("source", "unknown"),
                    })
            log.info(f"RAG query returned {len(results)} results")
            return results
        except Exception as e:
            log.error(f"RAG query failed: {e}")
            return []

    @property
    def is_ready(self) -> bool:
        return self.index is not None and self.index.ntotal > 0


rag_service = RAGService()