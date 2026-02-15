import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), "backend"))

from app.services.rag_service import rag_service
from app.core.config import settings

def ingest_all_pdfs():
    pdf_dir = settings.RAW_PDF_DIR
    if not os.path.exists(pdf_dir):
        print(f"❌ Directory not found: {pdf_dir}")
        return

    files = [f for f in os.listdir(pdf_dir) if f.lower().endswith(".pdf")]
    if not files:
        print(f"⚠️ No PDF files found in {pdf_dir}")
        return

    print(f"📚 Found {len(files)} PDFs. Starting ingestion...")
    
    for filename in files:
        file_path = os.path.join(pdf_dir, filename)
        print(f"Processing: {filename}...")
        try:
            result = rag_service.ingest_pdf(file_path)
            if "error" in result:
                 print(f"❌ Failed: {result['error']}")
            else:
                 print(f"✅ Ingested: {filename} ({result['chunks_added']} chunks)")
        except Exception as e:
            print(f"❌ Error: {e}")

    print("\n🎉 Ingestion Complete!")

if __name__ == "__main__":
    ingest_all_pdfs()
