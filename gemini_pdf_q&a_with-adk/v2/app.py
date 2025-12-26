import streamlit as st 
from utils import process_pdf
from langchain.chains import RetrievalQA

from langchain_groq import ChatGroq
import tempfile

st.set_page_config(page_title="chat W pdf")
st.title("Chat with your pdf using AI")

groq_api_key = st.sidebar.text_input(label="Enter your GROQ API", type="password")

if not groq_api_key:
    st.warning("Please enter your GROQ API key")
    st.stop()
    
    
uploaded_file = st.file_uploader("Upload your PDF here,", type=['pdf'])

user_question = st.text_input("Ask your question about the PDF")


if uploaded_file and user_question:
    with st.spinner("Processing the PDF"):
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(uploaded_file.read())
            tmp_path = tmp.name
            
            
        vectorstore = process_pdf(tmp_path)
        retriever = vectorstore.as_retriever()
        
        
        llm = ChatGroq(model_name="Gemma2-9b-It", groq_api_key=groq_api_key)
        
        
        chain = RetrievalQA.from_chain_type(
            llm = llm,
            retriever = retriever,
            return_source_documents=True,
        )
        
        result = chain.invoke({'query': user_question})
        
        st.subheader("Answer :")
        
        st.success(result['result'])
        
        
        with st.expander("📄 Source Chunks"):
            for doc in result["source_documents"]:
                st.write(doc.page_content)
                
                
                
else :
    st.warning('File and Input cannot be empty')
