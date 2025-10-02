import streamlit as st
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import requests
import openai
import speech_recognition as sr
import io
import base64
from pydub import AudioSegment
from pydub.playback import play
import tempfile

load_dotenv()

st.set_page_config(
    page_title="ElevenLabs Voice Assistant",
    page_icon="🎤",
    layout="wide"
)

class ElevenLabsVoiceAssistant:
    def __init__(self):
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.base_url = "https://api.elevenlabs.io/v1"
        self.voices = {}
        self.conversation_history = []
        self.recognizer = sr.Recognizer()
        
    def get_voices(self):
        if not self.elevenlabs_api_key:
            return None, "ElevenLabs API key not configured"
        
        try:
            headers = {
                "Accept": "application/json",
                "xi-api-key": self.elevenlabs_api_key
            }
            
            response = requests.get(f"{self.base_url}/voices", headers=headers)
            
            if response.status_code == 200:
                voices_data = response.json()
                self.voices = {voice['name']: voice['voice_id'] for voice in voices_data['voices']}
                return self.voices, None
            else:
                return None, f"Error fetching voices: {response.status_code}"
                
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def text_to_speech(self, text, voice_id, stability=0.5, similarity_boost=0.5):
        if not self.elevenlabs_api_key:
            return None, "ElevenLabs API key not configured"
        
        try:
            url = f"{self.base_url}/text-to-speech/{voice_id}"
            
            headers = {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": self.elevenlabs_api_key
            }
            
            data = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": stability,
                    "similarity_boost": similarity_boost
                }
            }
            
            response = requests.post(url, json=data, headers=headers)
            
            if response.status_code == 200:
                return response.content, None
            else:
                return None, f"Error generating speech: {response.status_code}"
                
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def speech_to_text(self, audio_data):
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp_file:
                tmp_file.write(audio_data)
                tmp_file_path = tmp_file.name
            
            with sr.AudioFile(tmp_file_path) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                
            os.unlink(tmp_file_path)
            return text, None
            
        except sr.UnknownValueError:
            return None, "Could not understand audio"
        except sr.RequestError as e:
            return None, f"Error with speech recognition: {str(e)}"
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def chat_with_ai(self, message):
        if not self.openai_api_key:
            return None, "OpenAI API key not configured"
        
        try:
            openai.api_key = self.openai_api_key
            
            messages = [
                {"role": "system", "content": "You are a helpful voice assistant. Keep responses conversational and concise for voice interaction."}
            ]
            
            for entry in self.conversation_history[-5:]:  # Keep last 5 exchanges
                messages.append({"role": "user", "content": entry["user"]})
                messages.append({"role": "assistant", "content": entry["assistant"]})
            
            messages.append({"role": "user", "content": message})
            
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=200  # Keep responses concise for voice
            )
            
            ai_response = response.choices[0].message.content
            
            conversation_entry = {
                "timestamp": datetime.now().isoformat(),
                "user": message,
                "assistant": ai_response
            }
            
            self.conversation_history.append(conversation_entry)
            
            return ai_response, None
            
        except Exception as e:
            return None, f"Error with AI chat: {str(e)}"
    
    def create_audio_player(self, audio_data):
        audio_base64 = base64.b64encode(audio_data).decode()
        audio_html = f"""
        <audio controls autoplay>
            <source src="data:audio/mpeg;base64,{audio_base64}" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
        """
        return audio_html
    
    def export_conversation(self):
        if not self.conversation_history:
            return None, None
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"voice_conversation_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "total_exchanges": len(self.conversation_history),
            "conversation": self.conversation_history
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🎤 ElevenLabs Voice Assistant")
    st.caption("Natural voice conversations with AI using realistic text-to-speech")
    
    if "voice_assistant" not in st.session_state:
        st.session_state.voice_assistant = ElevenLabsVoiceAssistant()
    
    assistant = st.session_state.voice_assistant
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        elevenlabs_key = st.text_input(
            "ElevenLabs API Key",
            value=assistant.elevenlabs_api_key or "",
            type="password"
        )
        assistant.elevenlabs_api_key = elevenlabs_key
        
        openai_key = st.text_input(
            "OpenAI API Key",
            value=assistant.openai_api_key or "",
            type="password"
        )
        assistant.openai_api_key = openai_key
        
        st.divider()
        
        st.markdown("### 🎵 Voice Settings")
        
        if elevenlabs_key and not assistant.voices:
            if st.button("🔄 Load Voices"):
                with st.spinner("Loading available voices..."):
                    voices, error = assistant.get_voices()
                    if voices:
                        st.success(f"✅ Loaded {len(voices)} voices!")
                    else:
                        st.error(f"❌ {error}")
        
        if assistant.voices:
            selected_voice = st.selectbox(
                "Choose Voice",
                list(assistant.voices.keys()),
                help="Select the voice for AI responses"
            )
            
            voice_id = assistant.voices[selected_voice]
        else:
            st.info("Load voices to see available options")
            selected_voice = None
            voice_id = None
        
        stability = st.slider(
            "Stability",
            min_value=0.0,
            max_value=1.0,
            value=0.5,
            step=0.1,
            help="Higher values make voice more stable but less expressive"
        )
        
        similarity_boost = st.slider(
            "Similarity Boost",
            min_value=0.0,
            max_value=1.0,
            value=0.5,
            step=0.1,
            help="Higher values make voice more similar to original"
        )
        
        st.divider()
        
        if assistant.conversation_history:
            st.markdown("### 📥 Export Chat")
            
            if st.button("Export Conversation"):
                filename, content = assistant.export_conversation()
                if content:
                    st.download_button(
                        "📄 Download Chat",
                        content,
                        file_name=filename,
                        mime="application/json"
                    )
        
        if st.button("🗑️ Clear Conversation"):
            assistant.conversation_history = []
            st.rerun()
        
        st.divider()
        
        st.markdown("### 📊 Voice Stats")
        st.metric("Conversations", len(assistant.conversation_history))
        
        if assistant.conversation_history:
            total_words = sum(len(entry["assistant"].split()) for entry in assistant.conversation_history)
            st.metric("Words Spoken", total_words)
    
    if not elevenlabs_key or not openai_key:
        st.warning("⚠️ Please enter both ElevenLabs and OpenAI API keys in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get ElevenLabs API Key**: Sign up at [ElevenLabs](https://elevenlabs.io/)
            2. **Get OpenAI API Key**: Sign up at [OpenAI](https://platform.openai.com/)
            3. **Enter Keys**: Add both API keys in the sidebar
            4. **Load Voices**: Click "Load Voices" to see available options
            5. **Start Talking**: Use text or voice input to chat with AI
            
            - **Realistic Voices**: Choose from various AI voices
            - **Voice Cloning**: Create custom voices (premium feature)
            - **Real-time Chat**: Natural conversation flow
            - **Audio Export**: Save conversations as audio files
            
            - Adjust stability for consistent voice quality
            - Use similarity boost to match original voice characteristics
            - Keep messages concise for better voice synthesis
            """)
        
        return
    
    if not assistant.voices:
        st.warning("⚠️ Please load voices first by clicking 'Load Voices' in the sidebar.")
        return
    
    st.header("🗣️ Voice Conversation")
    
    for i, entry in enumerate(assistant.conversation_history):
        with st.container():
            st.markdown(f"**🙋 You:** {entry['user']}")
            
            st.markdown(f"**🎤 Assistant:** {entry['assistant']}")
            
            if voice_id:
                if st.button(f"🔊 Play Response {i+1}", key=f"play_{i}"):
                    with st.spinner("Generating speech..."):
                        audio_data, error = assistant.text_to_speech(
                            entry['assistant'],
                            voice_id,
                            stability,
                            similarity_boost
                        )
                        
                        if audio_data:
                            audio_html = assistant.create_audio_player(audio_data)
                            st.markdown(audio_html, unsafe_allow_html=True)
                        else:
                            st.error(f"❌ {error}")
            
            st.caption(f"Time: {entry['timestamp']}")
            st.divider()
    
    st.markdown("### 💬 Send Message")
    
    text_input = st.text_area(
        "Type your message:",
        placeholder="Type what you want to say to the AI...",
        height=100
    )
    
    st.markdown("**🎤 Voice Input** (Coming Soon)")
    st.info("Voice input feature requires additional audio recording implementation")
    
    col1, col2 = st.columns([3, 1])
    
    with col1:
        if st.button("💬 Send Message", type="primary", disabled=not text_input.strip()):
            if text_input.strip():
                with st.spinner("AI is thinking..."):
                    ai_response, error = assistant.chat_with_ai(text_input.strip())
                    
                    if ai_response:
                        with st.spinner("Generating voice response..."):
                            audio_data, audio_error = assistant.text_to_speech(
                                ai_response,
                                voice_id,
                                stability,
                                similarity_boost
                            )
                            
                            if audio_data:
                                st.success("✅ Response generated with voice!")
                                audio_html = assistant.create_audio_player(audio_data)
                                st.markdown(audio_html, unsafe_allow_html=True)
                            else:
                                st.warning(f"⚠️ Text response generated, but voice failed: {audio_error}")
                        
                        st.rerun()
                    else:
                        st.error(f"❌ {error}")
    
    with col2:
        if st.button("🔄 New Chat"):
            assistant.conversation_history = []
            st.rerun()
    
    if voice_id:
        st.markdown("### 🧪 Voice Test")
        
        test_text = st.text_input(
            "Test voice with custom text:",
            placeholder="Hello, this is a voice test!",
            value="Hello! I'm your AI voice assistant. How can I help you today?"
        )
        
        if st.button("🎵 Test Voice") and test_text.strip():
            with st.spinner("Generating test audio..."):
                audio_data, error = assistant.text_to_speech(
                    test_text.strip(),
                    voice_id,
                    stability,
                    similarity_boost
                )
                
                if audio_data:
                    audio_html = assistant.create_audio_player(audio_data)
                    st.markdown(audio_html, unsafe_allow_html=True)
                else:
                    st.error(f"❌ {error}")

if __name__ == "__main__":
    main()
