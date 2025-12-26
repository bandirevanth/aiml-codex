from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_groq import ChatGroq
from app import groq_api_key

bio_prompt = PromptTemplate.from_template("""
You are a helpful assistant. Based on the text below, extract:
1. A short professional bio
2. 5 fun facts
3. 3 interesting conversation starters

Text:
{text}
""")

def run_bio_chain(text: str, groq_api_key: str) -> dict:
    llm = ChatGroq(model_name="Gemma2-9b-It", groq_api_key=groq_api_key)
    chain = LLMChain(prompt=bio_prompt, llm=llm)
    response = chain.invoke({"text": text})
    return response
