# OpenAI Chat Assistant

A simple conversational AI agent built with Streamlit and OpenAI's GPT-4, demonstrating basic chat functionality with conversation memory.

## 🌟 Features

- Interactive chat interface with Streamlit
- Conversation memory and context retention
- Customizable system prompts and personality
- Real-time streaming responses
- Chat history export functionality

## 🛠️ Tech Stack

- **Frontend**: Streamlit
- **AI Model**: OpenAI GPT-4
- **Language**: Python 3.8+
- **Dependencies**: streamlit, openai, python-dotenv

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Run the application**:
   ```bash
   streamlit run app.py
   ```

4. **Open your browser** and navigate to `http://localhost:8501`

## 📝 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `MODEL_NAME` | GPT model to use (default: gpt-4) | No |
| `MAX_TOKENS` | Maximum response length (default: 1000) | No |

### Customization

You can customize the assistant's behavior by modifying:

- **System prompt**: Edit the `SYSTEM_PROMPT` in `app.py`
- **UI theme**: Modify Streamlit configuration in `.streamlit/config.toml`
- **Response parameters**: Adjust temperature, max_tokens, etc. in the OpenAI client

## 💡 Usage Examples

### Basic Chat
```
User: What's the weather like today?
Assistant: I don't have access to real-time weather data, but I can help you find weather information or discuss weather-related topics!
```

### Code Help
```
User: How do I create a Python list?
Assistant: You can create a Python list in several ways:

1. Empty list: `my_list = []`
2. With items: `my_list = [1, 2, 3, "hello"]`
3. Using list(): `my_list = list()`
```

## 🔧 Advanced Features

- **Conversation Export**: Download chat history as JSON or text
- **Custom Personalities**: Switch between different assistant personalities
- **Token Usage Tracking**: Monitor API usage and costs
- **Response Streaming**: Real-time response generation

## 📊 Performance

- **Response Time**: ~2-5 seconds for typical queries
- **Token Usage**: ~50-200 tokens per exchange
- **Concurrent Users**: Supports multiple simultaneous conversations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
