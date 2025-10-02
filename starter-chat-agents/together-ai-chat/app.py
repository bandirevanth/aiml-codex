import streamlit as st
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import requests

load_dotenv()

st.set_page_config(
    page_title="Together AI Chat",
    page_icon="🤝",
    layout="wide"
)

class TogetherAIChat:
    def __init__(self):
        self.api_key = os.getenv("TOGETHER_API_KEY")
        self.base_url = "https://api.together.xyz/v1/chat/completions"
        self.models = {
            "Llama 2 70B Chat": "meta-llama/Llama-2-70b-chat-hf",
            "Llama 2 13B Chat": "meta-llama/Llama-2-13b-chat-hf",
            "Llama 2 7B Chat": "meta-llama/Llama-2-7b-chat-hf",
            "CodeLlama 34B": "codellama/CodeLlama-34b-Instruct-hf",
            "CodeLlama 13B": "codellama/CodeLlama-13b-Instruct-hf",
            "CodeLlama 7B": "codellama/CodeLlama-7b-Instruct-hf",
            "Mistral 7B": "mistralai/Mistral-7B-Instruct-v0.1",
            "Mixtral 8x7B": "mistralai/Mixtral-8x7B-Instruct-v0.1"
        }
        self.conversation_history = []
        
    def send_message(self, message, model, temperature=0.7, max_tokens=1000, top_p=0.9):
        if not self.api_key:
            return None, "API key not configured"
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            messages = []
            
            for entry in self.conversation_history[-10:]:  # Keep last 10 exchanges
                messages.append({"role": "user", "content": entry["user"]})
                messages.append({"role": "assistant", "content": entry["assistant"]})
            
            messages.append({"role": "user", "content": message})
            
            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "top_p": top_p,
                "stream": False
            }
            
            response = requests.post(self.base_url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                assistant_response = result['choices'][0]['message']['content']
                
                conversation_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "user": message,
                    "assistant": assistant_response,
                    "model": model,
                    "temperature": temperature,
                    "top_p": top_p
                }
                
                self.conversation_history.append(conversation_entry)
                
                return assistant_response, None
            else:
                return None, f"API Error: {response.status_code} - {response.text}"
                
        except Exception as e:
            return None, f"Error sending message: {str(e)}"
    
    def get_model_info(self):
        if not self.api_key:
            return None, "API key not configured"
        
        try:
            headers = {
                "Authorization": f"Bearer {self.api_key}",
            }
            
            response = requests.get("https://api.together.xyz/v1/models", headers=headers)
            
            if response.status_code == 200:
                return response.json(), None
            else:
                return None, f"Error fetching models: {response.status_code}"
                
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def clear_conversation(self):
        self.conversation_history = []
    
    def export_conversation(self):
        if not self.conversation_history:
            return None, None
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"together_ai_chat_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "total_exchanges": len(self.conversation_history),
            "conversation": self.conversation_history
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🤝 Together AI Chat")
    st.caption("High-performance chat with open-source models")
    
    if "together_chat" not in st.session_state:
        st.session_state.together_chat = TogetherAIChat()
    
    chat = st.session_state.together_chat
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "Together AI API Key",
            value=chat.api_key or "",
            type="password"
        )
        chat.api_key = api_key
        
        st.divider()
        
        st.markdown("### 🤖 Model Settings")
        
        selected_model = st.selectbox(
            "Choose Model",
            list(chat.models.keys()),
            help="Different models optimized for different tasks"
        )
        
        model_id = chat.models[selected_model]
        
        model_categories = {
            "Code Models": ["CodeLlama 34B", "CodeLlama 13B", "CodeLlama 7B"],
            "Chat Models": ["Llama 2 70B Chat", "Llama 2 13B Chat", "Llama 2 7B Chat"],
            "Efficient Models": ["Mistral 7B", "Mixtral 8x7B"]
        }
        
        for category, models in model_categories.items():
            if selected_model in models:
                st.info(f"Category: {category}")
                break
        
        st.markdown("### 🎛️ Generation Parameters")
        
        temperature = st.slider(
            "Temperature",
            min_value=0.0,
            max_value=1.0,
            value=0.7,
            step=0.1,
            help="Controls randomness in responses"
        )
        
        top_p = st.slider(
            "Top-p",
            min_value=0.1,
            max_value=1.0,
            value=0.9,
            step=0.1,
            help="Controls diversity of token selection"
        )
        
        max_tokens = st.slider(
            "Max Tokens",
            min_value=100,
            max_value=2000,
            value=1000,
            step=100,
            help="Maximum response length"
        )
        
        st.divider()
        
        st.markdown("### 📊 Model Comparison")
        
        if st.button("Compare Models"):
            if api_key:
                with st.spinner("Fetching model information..."):
                    models_info, error = chat.get_model_info()
                    if models_info:
                        st.success("✅ Model info loaded!")
                        available_models = [m['id'] for m in models_info.get('data', [])]
                        st.write(f"Available models: {len(available_models)}")
                    else:
                        st.error(f"❌ {error}")
        
        st.divider()
        
        if chat.conversation_history:
            st.markdown("### 📥 Export Chat")
            
            if st.button("Export Conversation"):
                filename, content = chat.export_conversation()
                if content:
                    st.download_button(
                        "📄 Download Chat",
                        content,
                        file_name=filename,
                        mime="application/json"
                    )
        
        if st.button("🗑️ Clear Chat"):
            chat.clear_conversation()
            st.rerun()
        
        st.divider()
        
        st.markdown("### 📊 Chat Stats")
        st.metric("Messages Sent", len(chat.conversation_history))
        
        if chat.conversation_history:
            models_used = set(entry.get('model', 'unknown') for entry in chat.conversation_history)
            st.metric("Models Used", len(models_used))
    
    if not api_key:
        st.warning("⚠️ Please enter your Together AI API key in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get API Key**: Sign up at [Together AI](https://api.together.xyz/)
            2. **Enter Key**: Add your API key in the sidebar
            3. **Choose Model**: Select the appropriate model for your task
            4. **Adjust Parameters**: Fine-tune temperature and other settings
            5. **Start Chatting**: Begin your conversation!
            
            
            **Code Models (CodeLlama)**
            - Best for programming tasks, code generation, and debugging
            - Supports multiple programming languages
            
            **Chat Models (Llama 2)**
            - General conversation and reasoning tasks
            - 70B model for complex tasks, 7B/13B for faster responses
            
            **Efficient Models (Mistral)**
            - Fast inference with good performance
            - Great for production applications
            
            - Use CodeLlama models for programming tasks
            - Higher temperature for creative tasks, lower for factual responses
            - Adjust top-p to control response diversity
            """)
        
        return
    
    st.header("💬 Chat Interface")
    
    for i, entry in enumerate(chat.conversation_history):
        with st.container():
            st.markdown(f"**🙋 You:** {entry['user']}")
            
            st.markdown(f"**🤝 Assistant:** {entry['assistant']}")
            
            model_name = [k for k, v in chat.models.items() if v == entry.get('model', '')][0] if entry.get('model') else 'Unknown'
            st.caption(f"Model: {model_name} | Temp: {entry.get('temperature', 'N/A')} | {entry['timestamp']}")
            
            st.divider()
    
    message_input = st.text_area(
        "Type your message:",
        placeholder="Ask me anything...",
        height=100,
        key="message_input"
    )
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("💻 Code Help"):
            st.session_state.quick_prompt = "Help me write a Python function to"
    
    with col2:
        if st.button("📝 Writing"):
            st.session_state.quick_prompt = "Help me write a professional email about"
    
    with col3:
        if st.button("🧠 Explain"):
            st.session_state.quick_prompt = "Explain the concept of"
    
    if hasattr(st.session_state, 'quick_prompt'):
        message_input = st.session_state.quick_prompt
        delattr(st.session_state, 'quick_prompt')
        st.rerun()
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        if st.button("🚀 Send Message", type="primary", disabled=not message_input.strip()):
            if message_input.strip():
                with st.spinner("Generating response..."):
                    response, error = chat.send_message(
                        message_input.strip(),
                        model_id,
                        temperature,
                        max_tokens,
                        top_p
                    )
                    
                    if response:
                        st.success("✅ Response generated!")
                        st.rerun()
                    else:
                        st.error(f"❌ {error}")
    
    with col2:
        if st.button("🔄 New Chat"):
            chat.clear_conversation()
            st.rerun()

if __name__ == "__main__":
    main()
