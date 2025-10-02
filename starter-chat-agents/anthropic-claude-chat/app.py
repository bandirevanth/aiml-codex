import streamlit as st
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import anthropic

load_dotenv()

st.set_page_config(
    page_title="Anthropic Claude Chat",
    page_icon="🧠",
    layout="wide"
)

class AnthropicClaudeChat:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = None
        self.models = {
           "Claude 4 Opus": "claude-opus-4-20250514",
            "Claude 4 Sonnet": "claude-sonnet-4-20250514",
            "Claude 3.7 Sonnet": "claude-3-7-sonnet-20250219",
            "Claude 3.5 Haiku": "claude-3-5-haiku-20241022"
        }
        self.conversation_history = []
        self.system_prompt = "You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest."
        
    def initialize_client(self, api_key):
        try:
            self.client = anthropic.Anthropic(api_key=api_key)
            return True
        except Exception as e:
            st.error(f"Error initializing Claude client: {str(e)}")
            return False
    
    def send_message(self, message, model="claude-3-sonnet-20240229", max_tokens=1000, temperature=0.7):
        if not self.client:
            return None, "Client not initialized"
        
        try:
            messages = []
            
            for entry in self.conversation_history[-10:]:  # Keep last 10 exchanges
                messages.append({"role": "user", "content": entry["user"]})
                messages.append({"role": "assistant", "content": entry["assistant"]})
            
            messages.append({"role": "user", "content": message})
            
            response = self.client.messages.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                system=self.system_prompt,
                messages=messages
            )
            
            assistant_response = response.content[0].text
            
            conversation_entry = {
                "timestamp": datetime.now().isoformat(),
                "user": message,
                "assistant": assistant_response,
                "model": model,
                "temperature": temperature,
                "usage": {
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens
                }
            }
            
            self.conversation_history.append(conversation_entry)
            
            return assistant_response, None
            
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def analyze_document(self, document_text, analysis_type="summary"):
        analysis_prompts = {
            "summary": f"Please provide a comprehensive summary of this document:\n\n{document_text}",
            "key_points": f"Extract the key points from this document:\n\n{document_text}",
            "analysis": f"Provide a detailed analysis of this document, including main themes, arguments, and conclusions:\n\n{document_text}",
            "questions": f"Generate thoughtful questions about this document that would help someone understand it better:\n\n{document_text}"
        }
        
        prompt = analysis_prompts.get(analysis_type, analysis_prompts["summary"])
        return self.send_message(prompt)
    
    def set_system_prompt(self, prompt):
        self.system_prompt = prompt
    
    def clear_conversation(self):
        self.conversation_history = []
    
    def export_conversation(self):
        if not self.conversation_history:
            return None, None
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"claude_conversation_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "system_prompt": self.system_prompt,
            "total_exchanges": len(self.conversation_history),
            "conversation": self.conversation_history
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🧠 Anthropic Claude Chat")
    st.caption("Advanced AI conversation with constitutional AI principles")
    
    if "claude_chat" not in st.session_state:
        st.session_state.claude_chat = AnthropicClaudeChat()
    
    chat = st.session_state.claude_chat
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "Anthropic API Key",
            value=chat.api_key or "",
            type="password"
        )
        
        if api_key:
            chat.api_key = api_key
            if not chat.client:
                if chat.initialize_client(api_key):
                    st.success("✅ Claude client initialized!")
        
        st.divider()
        
        st.markdown("### 🤖 Model Settings")
        
        selected_model = st.selectbox(
            "Choose Claude Model",
            list(chat.models.keys()),
            help="Different Claude models offer different capabilities"
        )
        
        model_id = chat.models[selected_model]
        
        model_info = {
            "Claude 4 Opus": "🎯 Most advanced model with highest capabilities",
            "Claude 4 Sonnet": "⚖️ Excellent performance for most use cases",
            "Claude 3.7 Sonnet": "⚡ Balanced performance and speed",
            "Claude 3.5 Haiku": "💨 Fastest and most compact model"
        }
        
        st.info(model_info[selected_model])
        
        temperature = st.slider(
            "Temperature",
            min_value=0.0,
            max_value=1.0,
            value=0.7,
            step=0.1,
            help="Controls response creativity"
        )
        
        max_tokens = st.slider(
            "Max Tokens",
            min_value=100,
            max_value=4000,
            value=1000,
            step=100,
            help="Maximum response length"
        )
        
        st.divider()
        
        st.markdown("### 📝 System Instructions")
        
        system_prompt = st.text_area(
            "System Prompt",
            value=chat.system_prompt,
            height=100,
            help="Instructions that define Claude's behavior"
        )
        
        if st.button("Update Instructions"):
            chat.set_system_prompt(system_prompt)
            st.success("✅ Instructions updated!")
        
        preset_prompts = {
            "Default": "You are Claude, an AI assistant created by Anthropic. You are helpful, harmless, and honest.",
            "Research Assistant": "You are a research assistant. Provide thorough, well-sourced analysis and maintain academic rigor.",
            "Creative Writer": "You are a creative writing assistant. Help with storytelling, character development, and narrative techniques.",
            "Code Reviewer": "You are an expert code reviewer. Provide detailed feedback on code quality, security, and best practices.",
            "Tutor": "You are a patient tutor. Explain concepts clearly, ask clarifying questions, and adapt to the student's level."
        }
        
        selected_preset = st.selectbox("Quick Presets", list(preset_prompts.keys()))
        
        if st.button("Apply Preset"):
            chat.set_system_prompt(preset_prompts[selected_preset])
            st.success(f"✅ Applied {selected_preset} preset!")
            st.rerun()
        
        st.divider()
        
        st.markdown("### 📄 Document Analysis")
        
        uploaded_file = st.file_uploader(
            "Upload Document",
            type=['txt', 'md', 'py', 'js', 'html', 'css'],
            help="Upload a text file for analysis"
        )
        
        if uploaded_file:
            document_content = uploaded_file.read().decode('utf-8')
            
            analysis_type = st.selectbox(
                "Analysis Type",
                ["summary", "key_points", "analysis", "questions"],
                help="Choose the type of analysis to perform"
            )
            
            if st.button("📊 Analyze Document"):
                with st.spinner("Analyzing document..."):
                    result, error = chat.analyze_document(document_content, analysis_type)
                    if result:
                        st.success("✅ Analysis complete!")
                        st.rerun()
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
            total_input_tokens = sum(entry.get('usage', {}).get('input_tokens', 0) for entry in chat.conversation_history)
            total_output_tokens = sum(entry.get('usage', {}).get('output_tokens', 0) for entry in chat.conversation_history)
            st.metric("Input Tokens", total_input_tokens)
            st.metric("Output Tokens", total_output_tokens)
    
    if not api_key:
        st.warning("⚠️ Please enter your Anthropic API key in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get API Key**: Sign up at [Anthropic Console](https://console.anthropic.com/)
            2. **Enter Key**: Add your API key in the sidebar
            3. **Choose Model**: Select the appropriate Claude model
            4. **Customize**: Adjust system instructions and parameters
            5. **Start Chatting**: Begin your conversation with Claude!
            
            - **Claude 3 Opus**: Best for complex reasoning, analysis, and creative tasks
            - **Claude 3 Sonnet**: Balanced performance for most use cases
            - **Claude 3 Haiku**: Fastest for simple questions and quick responses
            
            - Constitutional AI for safety and helpfulness
            - Long context windows for extended conversations
            - Document analysis and processing
            - Advanced reasoning and analytical capabilities
            - Built-in safety features and ethical guidelines
            """)
        
        return
    
    if not chat.client:
        st.error("❌ Failed to initialize Claude client. Please check your API key.")
        return
    
    st.header("💬 Chat with Claude")
    
    for i, entry in enumerate(chat.conversation_history):
        with st.container():
            st.markdown(f"**🙋 You:** {entry['user']}")
            
            st.markdown(f"**🧠 Claude:** {entry['assistant']}")
            
            usage = entry.get('usage', {})
            model_name = [k for k, v in chat.models.items() if v == entry.get('model', '')][0] if entry.get('model') else 'Unknown'
            
            if usage:
                st.caption(f"Model: {model_name} | Tokens: {usage.get('input_tokens', 0)} → {usage.get('output_tokens', 0)} | {entry['timestamp']}")
            else:
                st.caption(f"Model: {model_name} | {entry['timestamp']}")
            
            st.divider()
    
    message_input = st.text_area(
        "Type your message:",
        placeholder="Ask Claude anything...",
        height=100,
        key="message_input"
    )
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🧮 Analyze Problem"):
            st.session_state.quick_prompt = "Help me break down and analyze this complex problem step by step."
    
    with col2:
        if st.button("📝 Creative Writing"):
            st.session_state.quick_prompt = "Help me write a creative story with interesting characters and plot."
    
    with col3:
        if st.button("🔍 Research Help"):
            st.session_state.quick_prompt = "Help me research this topic thoroughly and provide multiple perspectives."
    
    if hasattr(st.session_state, 'quick_prompt'):
        message_input = st.session_state.quick_prompt
        delattr(st.session_state, 'quick_prompt')
        st.rerun()
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        if st.button("🧠 Send to Claude", type="primary", disabled=not message_input.strip()):
            if message_input.strip():
                with st.spinner("Claude is thinking..."):
                    response, error = chat.send_message(
                        message_input.strip(),
                        model_id,
                        max_tokens,
                        temperature
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
