import streamlit as st
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import requests

load_dotenv()

st.set_page_config(
    page_title="studio-chat",
    page_icon="🧠",
    layout="wide"
)

class AI21StudioChat:
    def __init__(self):
        self.api_key = os.getenv("AI21_API_KEY")
        self.base_url = "https://api.ai21.com/studio/v1"
        self.models = {
            "Jurassic-2 Ultra": "j2-ultra",
            "Jurassic-2 Mid": "j2-mid",
            "Jurassic-2 Light": "j2-light"
        }
        self.conversation_history = []
        self.custom_instruction = "You are a helpful AI assistant."
        
    def send_message(self, message, model="j2-mid", temperature=0.7, max_tokens=200, top_p=1.0):
        if not self.api_key:
            return None, "API key not configured", {}
        
        try:
            url = f"{self.base_url}/{model}/complete"
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            prompt_parts = [self.custom_instruction]
            
            for entry in self.conversation_history[-5:]:  # Keep last 5 exchanges
                prompt_parts.append(f"Human: {entry['user']}")
                prompt_parts.append(f"Assistant: {entry['assistant']}")
            
            prompt_parts.append(f"Human: {message}")
            prompt_parts.append("Assistant:")
            
            prompt = "\n\n".join(prompt_parts)
            
            payload = {
                "prompt": prompt,
                "numResults": 1,
                "maxTokens": max_tokens,
                "temperature": temperature,
                "topP": top_p,
                "stopSequences": ["Human:", "\n\nHuman:"]
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                assistant_response = result['completions'][0]['data']['text'].strip()
                
                conversation_entry = {
                    "timestamp": datetime.now().isoformat(),
                    "user": message,
                    "assistant": assistant_response,
                    "model": model,
                    "temperature": temperature,
                    "usage": {
                        "prompt_tokens": len(prompt.split()),
                        "completion_tokens": len(assistant_response.split()),
                        "total_tokens": len(prompt.split()) + len(assistant_response.split())
                    }
                }
                
                self.conversation_history.append(conversation_entry)
                
                return assistant_response, None, conversation_entry["usage"]
            else:
                return None, f"API Error: {response.status_code} - {response.text}", {}
                
        except Exception as e:
            return None, f"Error: {str(e)}", {}
    
    def summarize_text(self, text):
        if not self.api_key:
            return None, "API key not configured"
        
        try:
            url = f"{self.base_url}/summarize"
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "source": text,
                "sourceType": "TEXT"
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                return result['summary'], None
            else:
                return None, f"API Error: {response.status_code} - {response.text}"
                
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def paraphrase_text(self, text, style="general"):
        if not self.api_key:
            return None, "API key not configured"
        
        try:
            url = f"{self.base_url}/paraphrase"
            
            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "text": text,
                "style": style
            }
            
            response = requests.post(url, json=payload, headers=headers)
            
            if response.status_code == 200:
                result = response.json()
                return result['suggestions'], None
            else:
                return None, f"API Error: {response.status_code} - {response.text}"
                
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def set_custom_instruction(self, instruction):
        self.custom_instruction = instruction
    
    def clear_conversation(self):
        self.conversation_history = []
    
    def get_usage_stats(self):
        if not self.conversation_history:
            return {}
        
        total_tokens = sum(entry.get('usage', {}).get('total_tokens', 0) for entry in self.conversation_history)
        total_prompt_tokens = sum(entry.get('usage', {}).get('prompt_tokens', 0) for entry in self.conversation_history)
        total_completion_tokens = sum(entry.get('usage', {}).get('completion_tokens', 0) for entry in self.conversation_history)
        
        return {
            'total_conversations': len(self.conversation_history),
            'total_tokens': total_tokens,
            'total_prompt_tokens': total_prompt_tokens,
            'total_completion_tokens': total_completion_tokens,
            'avg_tokens_per_conversation': total_tokens / len(self.conversation_history) if self.conversation_history else 0
        }
    
    def export_conversation(self):
        if not self.conversation_history:
            return None, None
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"ai21_conversation_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "custom_instruction": self.custom_instruction,
            "usage_stats": self.get_usage_stats(),
            "conversation": self.conversation_history
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🧠 AI21 Studio Chat")
    st.caption("Advanced conversation with Jurassic models")
    
    if "ai21_chat" not in st.session_state:
        st.session_state.ai21_chat = AI21StudioChat()
    
    chat = st.session_state.ai21_chat
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "AI21 API Key",
            value=chat.api_key or "",
            type="password"
        )
        chat.api_key = api_key
        
        st.divider()
        
        st.markdown("### 🤖 Model Settings")
        
        selected_model = st.selectbox(
            "Choose Jurassic Model",
            list(chat.models.keys()),
            help="Different models offer different capabilities"
        )
        
        model_id = chat.models[selected_model]
        
        model_info = {
            "Jurassic-2 Ultra": "🎯 Most capable for complex reasoning",
            "Jurassic-2 Mid": "⚖️ Balanced performance and cost",
            "Jurassic-2 Light": "⚡ Fastest for simple tasks"
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
        
        top_p = st.slider(
            "Top-p",
            min_value=0.1,
            max_value=1.0,
            value=1.0,
            step=0.1,
            help="Controls diversity of token selection"
        )
        
        max_tokens = st.slider(
            "Max Tokens",
            min_value=50,
            max_value=500,
            value=200,
            step=50,
            help="Maximum response length"
        )
        
        st.divider()
        
        st.markdown("### 📝 Custom Instructions")
        
        custom_instruction = st.text_area(
            "System Instruction",
            value=chat.custom_instruction,
            height=100,
            help="Instructions that define the assistant's behavior"
        )
        
        if st.button("Update Instructions"):
            chat.set_custom_instruction(custom_instruction)
            st.success("✅ Instructions updated!")
        
        preset_instructions = {
            "Default": "You are a helpful AI assistant.",
            "Creative Writer": "You are a creative writing assistant. Help with storytelling, character development, and narrative techniques.",
            "Business Assistant": "You are a professional business assistant. Provide clear, concise, and actionable advice.",
            "Language Tutor": "You are a language learning tutor. Help with grammar, vocabulary, and conversation practice.",
            "Technical Expert": "You are a technical expert. Provide detailed, accurate technical information and solutions."
        }
        
        selected_preset = st.selectbox("Quick Presets", list(preset_instructions.keys()))
        
        if st.button("Apply Preset"):
            chat.set_custom_instruction(preset_instructions[selected_preset])
            st.success(f"✅ Applied {selected_preset} preset!")
            st.rerun()
        
        st.divider()
        
        st.markdown("### 🛠️ AI21 Tools")
        
        tool_mode = st.selectbox(
            "Choose Tool",
            ["Chat", "Summarize", "Paraphrase"],
            help="Select AI21 Studio tool to use"
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
    
    if not api_key:
        st.warning("⚠️ Please enter your AI21 API key in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get API Key**: Sign up at [AI21 Studio](https://studio.ai21.com/)
            2. **Enter Key**: Add your API key in the sidebar
            3. **Choose Model**: Select the appropriate Jurassic model
            4. **Customize**: Adjust instructions and parameters
            5. **Start Chatting**: Begin your conversation!
            
            - **Ultra**: Best for complex reasoning and creative tasks
            - **Mid**: Balanced performance for most use cases
            - **Light**: Fastest for simple questions and quick responses
            
            - **Chat**: Natural conversation with context
            - **Summarize**: Automatic text summarization
            - **Paraphrase**: Rewrite text in different styles
            """)
        
        return
    
    if tool_mode == "Chat":
        st.header("💬 Chat with Jurassic")
        
        for i, entry in enumerate(chat.conversation_history):
            with st.container():
                st.markdown(f"**🙋 You:** {entry['user']}")
                
                st.markdown(f"**🧠 Jurassic:** {entry['assistant']}")
                
                usage = entry.get('usage', {})
                model_name = [k for k, v in chat.models.items() if v == entry.get('model', '')][0] if entry.get('model') else 'Unknown'
                
                if usage:
                    st.caption(f"Model: {model_name} | Tokens: {usage.get('total_tokens', 0)} | {entry['timestamp']}")
                else:
                    st.caption(f"Model: {model_name} | {entry['timestamp']}")
                
                st.divider()
        
        message_input = st.text_area(
            "Type your message:",
            placeholder="Ask me anything...",
            height=100,
            key="message_input"
        )
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            if st.button("✍️ Creative Writing"):
                st.session_state.quick_prompt = "Help me write a creative story with interesting characters."
        
        with col2:
            if st.button("💼 Business Help"):
                st.session_state.quick_prompt = "Help me draft a professional business proposal."
        
        with col3:
            if st.button("🌍 Multilingual"):
                st.session_state.quick_prompt = "Can you help me practice Spanish conversation?"
        
        if hasattr(st.session_state, 'quick_prompt'):
            message_input = st.session_state.quick_prompt
            delattr(st.session_state, 'quick_prompt')
            st.rerun()
        
        col1, col2 = st.columns([3, 1])
        
        with col1:
            if st.button("🧠 Send to Jurassic", type="primary", disabled=not message_input.strip()):
                if message_input.strip():
                    with st.spinner("Jurassic is thinking..."):
                        response, error, usage = chat.send_message(
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
    
    elif tool_mode == "Summarize":
        st.header("📄 Text Summarization")
        
        text_to_summarize = st.text_area(
            "Enter text to summarize:",
            placeholder="Paste your text here...",
            height=200
        )
        
        if st.button("📄 Summarize Text", type="primary", disabled=not text_to_summarize.strip()):
            if text_to_summarize.strip():
                with st.spinner("Generating summary..."):
                    summary, error = chat.summarize_text(text_to_summarize.strip())
                    
                    if summary:
                        st.success("✅ Summary generated!")
                        
                        col1, col2 = st.columns([1, 1])
                        
                        with col1:
                            st.markdown("**Original Text:**")
                            st.text_area("", value=text_to_summarize, height=200, disabled=True)
                        
                        with col2:
                            st.markdown("**Summary:**")
                            st.text_area("", value=summary, height=200, disabled=True)
                    else:
                        st.error(f"❌ {error}")
    
    elif tool_mode == "Paraphrase":
        st.header("🔄 Text Paraphrasing")
        
        text_to_paraphrase = st.text_area(
            "Enter text to paraphrase:",
            placeholder="Enter the text you want to rephrase...",
            height=100
        )
        
        paraphrase_style = st.selectbox(
            "Paraphrase Style",
            ["general", "formal", "casual"],
            help="Choose the style for paraphrasing"
        )
        
        if st.button("🔄 Paraphrase Text", type="primary", disabled=not text_to_paraphrase.strip()):
            if text_to_paraphrase.strip():
                with st.spinner("Generating paraphrases..."):
                    suggestions, error = chat.paraphrase_text(text_to_paraphrase.strip(), paraphrase_style)
                    
                    if suggestions:
                        st.success("✅ Paraphrases generated!")
                        
                        st.markdown("**Original Text:**")
                        st.info(text_to_paraphrase)
                        
                        st.markdown("**Paraphrase Suggestions:**")
                        for i, suggestion in enumerate(suggestions):
                            st.markdown(f"**Option {i+1}:** {suggestion['text']}")
                    else:
                        st.error(f"❌ {error}")

if __name__ == "__main__":
    main()
