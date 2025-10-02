import streamlit as st
import openai
from datetime import datetime
import json
import os
from dotenv import load_dotenv

load_dotenv()

st.set_page_config(
    page_title="OpenAI Chat Assistant",
    page_icon="🤖",
    layout="wide"
)

SYSTEM_PROMPT = """You are a helpful, knowledgeable, and friendly AI assistant. 
You provide clear, accurate, and helpful responses while maintaining a conversational tone.
You can help with a wide variety of tasks including answering questions, writing, coding, analysis, and creative tasks."""

def initialize_session_state():
    if "messages" not in st.session_state:
        st.session_state.messages = []
    if "api_key" not in st.session_state:
        st.session_state.api_key = os.getenv("OPENAI_API_KEY", "")
    if "model" not in st.session_state:
        st.session_state.model = "gpt-4"

def get_openai_response(messages, api_key, model="gpt-4"):
    try:
        client = openai.OpenAI(api_key=api_key)
        
        system_message = {"role": "system", "content": SYSTEM_PROMPT}
        full_messages = [system_message] + messages
        
        response = client.chat.completions.create(
            model=model,
            messages=full_messages,
            max_tokens=1000,
            temperature=0.7,
            stream=True
        )
        
        return response
    except Exception as e:
        st.error(f"Error calling OpenAI API: {str(e)}")
        return None

def export_chat_history():
    if st.session_state.messages:
        chat_data = {
            "timestamp": datetime.now().isoformat(),
            "model": st.session_state.model,
            "messages": st.session_state.messages
        }
        return json.dumps(chat_data, indent=2)
    return None

def main():
    initialize_session_state()
    
    st.title("🤖 OpenAI Chat Assistant")
    st.caption("A simple conversational AI powered by OpenAI's GPT models")
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "OpenAI API Key",
            value=st.session_state.api_key,
            type="password",
            help="Enter your OpenAI API key"
        )
        st.session_state.api_key = api_key
        
        model_options = ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"]
        st.session_state.model = st.selectbox(
            "Model",
            model_options,
            index=model_options.index(st.session_state.model)
        )
        
        st.divider()
        
        if st.button("🗑️ Clear Chat History"):
            st.session_state.messages = []
            st.rerun()
        
        if st.session_state.messages:
            chat_export = export_chat_history()
            if chat_export:
                st.download_button(
                    "📥 Export Chat",
                    chat_export,
                    file_name=f"chat_history_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json",
                    mime="application/json"
                )
        
        st.divider()
        st.markdown("### 📊 Chat Stats")
        st.metric("Messages", len(st.session_state.messages))
        if st.session_state.messages:
            total_chars = sum(len(msg["content"]) for msg in st.session_state.messages)
            st.metric("Total Characters", total_chars)
    
    if not api_key:
        st.warning("⚠️ Please enter your OpenAI API key in the sidebar to start chatting.")
        st.info("You can get your API key from [OpenAI's website](https://platform.openai.com/api-keys)")
        return
    
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    if prompt := st.chat_input("Type your message here..."):
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        with st.chat_message("user"):
            st.markdown(prompt)
        
        with st.chat_message("assistant"):
            message_placeholder = st.empty()
            full_response = ""
            
            response_stream = get_openai_response(
                st.session_state.messages,
                api_key,
                st.session_state.model
            )
            
            if response_stream:
                for chunk in response_stream:
                    if chunk.choices[0].delta.content is not None:
                        full_response += chunk.choices[0].delta.content
                        message_placeholder.markdown(full_response + "▌")
                
                message_placeholder.markdown(full_response)
                st.session_state.messages.append({"role": "assistant", "content": full_response})

if __name__ == "__main__":
    main()
