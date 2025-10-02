import streamlit as st
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

st.set_page_config(
    page_title="Google PaLM Chat",
    page_icon="🧠",
    layout="wide"
)

class GooglePaLMChat:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        self.models = {
            "PaLM 2": "models/text-bison-001",
            "Chat Bison": "models/chat-bison-001"
        }
        self.conversation_history = []
        self.current_model = None
        
    def initialize_client(self, api_key):
        try:
            genai.configure(api_key=api_key)
            return True
        except Exception as e:
            st.error(f"Error initializing Google AI client: {str(e)}")
            return False
    
    def send_message(self, message, model="models/text-bison-001", temperature=0.7, max_output_tokens=1000):
        if not self.api_key:
            return None, "API key not configured"
        
        try:
            generation_config = {
                "temperature": temperature,
                "max_output_tokens": max_output_tokens,
            }
            
            if "chat" in model.lower():
                chat_model = genai.GenerativeModel(model)
                
                context = []
                for entry in self.conversation_history[-5:]:  # Last 5 exchanges
                    context.append(f"Human: {entry['user']}")
                    context.append(f"Assistant: {entry['assistant']}")
                
                context.append(f"Human: {message}")
                full_prompt = "\n".join(context) + "\nAssistant:"
                
                response = chat_model.generate_content(
                    full_prompt,
                    generation_config=generation_config
                )
            else:
                text_model = genai.GenerativeModel(model)
                
                context = []
                for entry in self.conversation_history[-5:]:
                    context.append(f"Human: {entry['user']}")
                    context.append(f"Assistant: {entry['assistant']}")
                
                context.append(f"Human: {message}")
                context.append("Assistant:")
                full_prompt = "\n".join(context)
                
                response = text_model.generate_content(
                    full_prompt,
                    generation_config=generation_config
                )
            
            if response and response.text:
                assistant_response = response.text.strip()
                
                conversation_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "user": message,
                    "assistant": assistant_response,
                    "model": model,
                    "temperature": temperature,
                    "usage": {
                        "prompt_tokens": len(message.split()),
                        "completion_tokens": len(assistant_response.split()),
                        "total_tokens": len(message.split()) + len(assistant_response.split())
                    }
                }
                
                self.conversation_history.append(conversation_entry)
                
                return assistant_response, None
            else:
                return None, "No response generated"
                
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def clear_conversation(self):
        self.conversation_history = []
    
    def get_usage_stats(self):
        if not self.conversation_history:
            return {}
        
        total_tokens = sum(entry.get('usage', {}).get('total_tokens', 0) for entry in self.conversation_history)
        total_conversations = len(self.conversation_history)
        
        return {
            'total_conversations': total_conversations,
            'total_tokens': total_tokens,
            'avg_tokens_per_conversation': total_tokens / total_conversations if total_conversations > 0 else 0
        }
    
    def export_conversation(self):
        if not self.conversation_history:
            return None, None
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"palm_conversation_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "usage_stats": self.get_usage_stats(),
            "conversation": self.conversation_history
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🧠 Google PaLM Chat")
    st.caption("Advanced conversation with Google's Pathways Language Model")
    
    if "palm_chat" not in st.session_state:
        st.session_state.palm_chat = GooglePaLMChat()
    
    chat = st.session_state.palm_chat
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "Google API Key",
            value=chat.api_key or "",
            type="password"
        )
        
        if api_key:
            chat.api_key = api_key
            if chat.initialize_client(api_key):
                st.success("✅ Google AI client initialized!")
        
        st.divider()
        
        st.markdown("### 🤖 Model Settings")
        
        selected_model = st.selectbox(
            "Choose PaLM Model",
            list(chat.models.keys()),
            help="Different models offer different capabilities"
        )
        
        model_id = chat.models[selected_model]
        
        model_info = {
            "PaLM 2": "🎯 Latest generation with improved reasoning",
            "Chat Bison": "💬 Optimized for conversations"
        }
        
        st.info(model_info[selected_model])
        
        st.markdown("### 🎛️ Generation Parameters")
        
        temperature = st.slider(
            "Temperature",
            min_value=0.0,
            max_value=1.0,
            value=0.7,
            step=0.1,
            help="Controls response creativity"
        )
        
        max_output_tokens = st.slider(
            "Max Output Tokens",
            min_value=100,
            max_value=2000,
            value=1000,
            step=100,
            help="Maximum response length"
        )
        
        st.divider()
        
        if chat.conversation_history:
            st.markdown("### 📊 Usage Stats")
            
            stats = chat.get_usage_stats()
            
            st.metric("Conversations", stats['total_conversations'])
            st.metric("Total Tokens", stats['total_tokens'])
            st.metric("Avg Tokens/Conv", f"{stats['avg_tokens_per_conversation']:.1f}")
        
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
        
        st.markdown("### 🛡️ Safety Features")
        st.info("Google PaLM includes built-in content filtering and safety measures to ensure responsible AI usage.")
    
    if not api_key:
        st.warning("⚠️ Please enter your Google API key in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get API Key**: Sign up at [Google AI Studio](https://makersuite.google.com/)
            2. **Enter Key**: Add your API key in the sidebar
            3. **Choose Model**: Select the appropriate PaLM model
            4. **Adjust Settings**: Configure temperature and token limits
            5. **Start Chatting**: Begin your conversation with PaLM!
            
            - **PaLM 2**: Latest generation with improved reasoning capabilities
            - **Chat Bison**: Specialized for conversational interactions
            
            - Advanced reasoning and logical thinking
            - Built-in safety and content filtering
            - Efficient token usage and cost management
            - Context-aware conversations
            - Google's latest AI technology
            """)
        
        return
    
    st.header("💬 Chat with PaLM")
    
    for i, entry in enumerate(chat.conversation_history):
        with st.container():
            st.markdown(f"**🙋 You:** {entry['user']}")
            
            st.markdown(f"**🧠 PaLM:** {entry['assistant']}")
            
            usage = entry.get('usage', {})
            model_name = [k for k, v in chat.models.items() if v == entry.get('model', '')][0] if entry.get('model') else 'Unknown'
            
            if usage:
                st.caption(f"Model: {model_name} | Tokens: {usage.get('total_tokens', 0)} | {entry['timestamp']}")
            else:
                st.caption(f"Model: {model_name} | {entry['timestamp']}")
            
            st.divider()
    
    message_input = st.text_area(
        "Type your message:",
        placeholder="Ask PaLM anything...",
        height=100,
        key="message_input"
    )
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🧮 Logical Reasoning"):
            st.session_state.quick_prompt = "Help me solve this logical problem step by step."
    
    with col2:
        if st.button("📚 Educational Help"):
            st.session_state.quick_prompt = "Explain a complex concept in simple terms."
    
    with col3:
        if st.button("💡 Creative Ideas"):
            st.session_state.quick_prompt = "Help me brainstorm creative solutions for my project."
    
    if hasattr(st.session_state, 'quick_prompt'):
        message_input = st.session_state.quick_prompt
        delattr(st.session_state, 'quick_prompt')
        st.rerun()
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        if st.button("🧠 Send to PaLM", type="primary", disabled=not message_input.strip()):
            if message_input.strip():
                with st.spinner("PaLM is thinking..."):
                    response, error = chat.send_message(
                        message_input.strip(),
                        model_id,
                        temperature,
                        max_output_tokens
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
