# ElevenLabs Voice Assistant

An advanced voice-enabled AI assistant using ElevenLabs' realistic text-to-speech technology, enabling natural voice conversations with AI models.

## 🌟 Features

- **Realistic Voice Synthesis**: High-quality, natural-sounding AI voices
- **Multiple Voice Options**: Choose from various voice personalities and accents
- **Voice Cloning**: Create custom voices from audio samples
- **Real-Time Conversation**: Seamless voice-to-voice AI interaction
- **Emotion Control**: Adjust voice emotion and speaking style
- **Audio Export**: Save conversations as high-quality audio files

## 🛠️ Tech Stack

- **Voice AI**: ElevenLabs Text-to-Speech API
- **Speech Recognition**: OpenAI Whisper for voice input
- **AI Model**: OpenAI GPT-4 for conversation
- **Frontend**: Streamlit with audio components
- **Audio Processing**: PyAudio and wave libraries

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Add your ElevenLabs and OpenAI API keys
   ```

3. **Run the application**:
   ```bash
   streamlit run app.py
   ```

## 💡 Voice Options

### Pre-built Voices
- **Rachel**: Professional female voice
- **Drew**: Casual male voice
- **Clyde**: Warm male voice
- **Bella**: Friendly female voice

### Custom Voices
- Upload audio samples to create personalized voices
- Fine-tune voice characteristics and emotions
- Save and reuse custom voice profiles

## 🎯 Use Cases

- **Accessibility**: Voice interface for visually impaired users
- **Language Learning**: Practice conversations with native-sounding voices
- **Content Creation**: Generate voiceovers and audio content
- **Customer Service**: Voice-enabled support systems
- **Entertainment**: Interactive storytelling and gaming
