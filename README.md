# Admission Management & CRM 🎓

A full-stack, monorepo Admission Management System designed specifically to handle dynamic seat matrices, strict quota allocations, applicant document verification, fee status tracking, and unique admission number generation (e.g. `INST/2026/UG/CSE/KCET/0001`). 

Includes a custom **AI Chat Assistant** powered by LangChain and LangGraph for real-time RAG (retrieval-augmented generation) and live backend data querying.

---

## 🏗️ Architecture

The project consists of three independent microservices:

1. **Frontend** (`/frontend`): Next.js 14, React, Tailwind CSS, TypeScript
2. **Backend** (`/backend`): Node.js, Express, MongoDB, Mongoose, JWT Role-based Auth
3. **AI Service** (`/ai-service`): Python, FastAPI, LangChain, LangGraph, ChromaDB, Google Gemini Embeddings/LLM

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (3.10+) 
- MongoDB (Running locally on `mongodb://localhost:27017` or via MongoDB Atlas string)
- A Google Gemini API Key (or OpenAI API Key — preconfigured for Gemini)

### 1. Backend Setup (Node.js)
```bash
cd backend
npm install

# Make sure you have MongoDB running. If you want to use Atlas, edit .env
# The .env file has been pre-configured with default local values
npm run dev
```
*Backend runs on `http://localhost:5000`*

### 2. AI Microservice Setup (Python)
```bash
cd ai-service

# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Add your Google Gemini API key
# Edit .env and set GOOGLE_API_KEY=your_key_here

# Ingest the BRS document into ChromaDB (Run once)
python ingest.py

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
*AI Service runs on `http://localhost:8000`*

### 3. Frontend Setup (Next.js)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 💻 Working Demo

1. Open `http://localhost:3000/login`
2. **Register a new account** (You can select the Role `Admin` to get full access).
3. Follow the User Journey:
   - Go to **Master Setup** and create an Institution, Campus, Department, Program, and Academic Year.
   - Go to **Seat Matrix** and configure quotas for your program (Ensure your quotas sum exactly equals the Total Intake).
   - Go to **Applicants > New Applicant** and register an applicant.
   - Go to **Allocate Seat** and search for the applicant. Lock the seat (Watch it update the Seat Matrix counters in real time!).
   - Go to **Fee Status** and mark the fee as `Paid`.
   - Go to **Admission Confirmation** and generate the official unique admission number!
4. **AI Chat Assistant**: Click the floating chat widget to ask the AI assistant questions about the workflow, or ask "How many available seats are there in CSE?" to trigger the LangGraph live-data node!

---

## 🤖 AI Assistance Disclosure

**AI Tools Used:** 
This project was developed with the assistance of an advanced AI coding agent (Antigravity).

**How AI Assisted:**
- Scaffolding the entire monorepo structure (Next.js, Express, FastAPI).
- Generating robust Mongoose schemas enforcing the "quota sum = total intake" rules.
- Writing the comprehensive Python LangGraph workflow with ChromaDB RAG and intent classification.
- Generating the Tailwind CSS layouts and Recharts dashboard.
- Resolving TypeScript interface mismatch bugs across Express route handlers. 

All core logic around quotas, seat locking, validations, and AI routing was mapped directly from the provided BRS requirements document into code logic with AI collaboration.
