import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from dotenv import load_dotenv
from .retriever import get_retriever

load_dotenv()

PROMPT_TEMPLATE = """You are an expert AI assistant for an Admission Management System.
Use the following retrieved context to answer the user's question accurately.
If the answer is not in the context, say "I don't have enough information about that, 
but I can help with admission rules, seat quotas, and application procedures."

Context:
{context}

Question: {question}

Answer (be concise and helpful):"""

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

class LegacyRAGWrapper:
    def __init__(self, chain):
        self.chain = chain
    
    def invoke(self, inputs):
        question = inputs.get("query", "")
        result = self.chain.invoke(question)
        return {"result": result}

def get_rag_chain():
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.3,
    )
    prompt = PromptTemplate.from_template(PROMPT_TEMPLATE)
    retriever = get_retriever(k=4)
    
    rag_chain = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    
    return LegacyRAGWrapper(rag_chain)
