"""
Ingest BRS documents into ChromaDB for RAG.
Run this once: python ingest.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
COLLECTION = os.getenv("COLLECTION_NAME", "admission_docs")

# Admission Management BRS content as text (embedded directly for portability)
BRS_TEXT = """
Admission Management & CRM - Business Requirements Specification

OBJECTIVE:
Build a web-based Admission Management system for colleges with the following capabilities:
- Configure programs and quotas
- Manage applicants
- Allocate seats without quota violations
- Generate admission numbers
- Track documents and fees
- View basic dashboards

The system must ensure no seat overbooking, quota-wise control, and a simple admission workflow.

SEAT MATRIX & QUOTA RULES:
- Total base quota must equal intake
- Real-time seat counter per quota
- Block allocation if quota is full
- Supernumerary seats (SNQ) have separate counter
- Quota types: KCET, COMEDK, Management, SNQ
- Each program has a defined total intake (e.g., 100 seats)
- Seats are allocated per quota type

ADMISSION WORKFLOW:
Government Flow:
1. Enter allotment number
2. Select quota (KCET/COMEDK)
3. System checks availability
4. Seat locked on availability confirmation

Management Flow:
1. Create applicant manually
2. Select program & quota
3. Allocate if available

ADMISSION CONFIRMATION:
- Admission Number Format: INST/2026/UG/CSE/KCET/0001
- Admission numbers are unique and immutable
- Seat confirmed only after fee is paid
- Admission number generated only once

USER ROLES:
- Admin: Setup masters, configure quotas
- Admission Officer: Create applicants, allocate seats, verify documents, confirm admission
- Management: View-only dashboard

DOCUMENT CHECKLIST:
Each applicant must provide: Photo, 10th Certificate, 12th Certificate, Category Certificate, Transfer Certificate
Status: Pending / Submitted / Verified

FEE STATUS:
- Pending: Default state
- Paid: Required for admission confirmation
- Seat confirmed only when Fee = Paid

MASTER SETUP:
Admin creates: Institution, Campus, Department, Program/Branch, Academic Year
Course Types: UG, PG
Entry Types: Regular, Lateral
Admission Modes: Government, Management, Both

KEY SYSTEM RULES:
1. Quota seats cannot exceed intake
2. No seat allocation if quota full
3. Admission number generated only once
4. Admission confirmed only if fee paid
5. Seat counters update in real time

OUT OF SCOPE:
Payment gateway, SMS/WhatsApp, Advanced CRM, AI prediction, Multi-college complexity, Marketing automation
"""

def ingest():
    print("🔄 Starting document ingestion...")
    
    # Write BRS to temp file
    with open("/tmp/admission_brs.txt", "w") as f:
        f.write(BRS_TEXT)
    
    loader = TextLoader("/tmp/admission_brs.txt")
    documents = loader.load()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)
    print(f"📄 Split into {len(chunks)} chunks")
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PATH,
        collection_name=COLLECTION,
    )
    vectorstore.persist()
    print(f"✅ Ingested {len(chunks)} chunks into ChromaDB at {CHROMA_PATH}")

if __name__ == "__main__":
    ingest()
