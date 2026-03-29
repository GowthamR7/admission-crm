import os
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

_vectorstore = None

def get_vectorstore() -> Chroma:
    global _vectorstore
    if _vectorstore is None:
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001",
            google_api_key=os.getenv("GOOGLE_API_KEY"),
        )
        _vectorstore = Chroma(
            persist_directory=os.getenv("CHROMA_DB_PATH", "./chroma_db"),
            collection_name=os.getenv("COLLECTION_NAME", "admission_docs"),
            embedding_function=embeddings,
        )
    return _vectorstore

def get_retriever(k: int = 4):
    return get_vectorstore().as_retriever(search_kwargs={"k": k})
