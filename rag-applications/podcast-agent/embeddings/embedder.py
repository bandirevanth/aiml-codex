from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document

def get_embeddings(text: str):
    embedder = HuggingFaceEmbeddings()
    doc = [Document(page_content=text)]
    db = FAISS.from_documents(doc, embedder)
    return db
