# Local Llama Chat Agent

A privacy-focused conversational AI agent that runs entirely offline using local Llama models, demonstrating how to build AI applications without cloud dependencies.

## 🌟 Features

- **Complete Privacy**: All processing happens locally, no data sent to external APIs
- **Offline Operation**: Works without internet connection after initial setup
- **Multiple Models**: Support for various Llama model sizes (7B, 13B, 70B)
- **Fast Inference**: Optimized for local hardware with GPU acceleration
- **Conversation Memory**: Maintains context across chat sessions
- **Custom System Prompts**: Configurable AI personality and behavior

## 🛠️ Tech Stack

- **Frontend**: Gradio for interactive web interface
- **AI Model**: Local Llama models via llama-cpp-python
- **Language**: Python 3.8+
- **Hardware**: CPU/GPU inference with automatic detection

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Download a Llama model** (choose one):
   ```bash
   # Small model (4GB) - Good for testing
   wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGML/resolve/main/llama-2-7b-chat.q4_0.bin
   
   # Medium model (8GB) - Better quality
   wget https://huggingface.co/TheBloke/Llama-2-13B-Chat-GGML/resolve/main/llama-2-13b-chat.q4_0.bin
   ```

3. **Set up configuration**:
   ```bash
   cp .env.example .env
   # Edit .env and set MODEL_PATH to your downloaded model
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Open your browser** and navigate to the displayed local URL

## 📝 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MODEL_PATH` | Path to your Llama model file | `./models/llama-2-7b-chat.q4_0.bin` |
| `MAX_TOKENS` | Maximum response length | `512` |
| `TEMPERATURE` | Response creativity (0.0-1.0) | `0.7` |
| `GPU_LAYERS` | Number of layers to run on GPU | `0` (CPU only) |

### Hardware Requirements

- **Minimum**: 8GB RAM, 4GB free disk space
- **Recommended**: 16GB RAM, GPU with 6GB+ VRAM
- **Optimal**: 32GB RAM, GPU with 12GB+ VRAM

### Model Selection Guide

| Model Size | RAM Required | Quality | Speed | Use Case |
|------------|--------------|---------|-------|----------|
| 7B (4GB) | 8GB | Good | Fast | Testing, basic chat |
| 13B (8GB) | 16GB | Better | Medium | General use |
| 70B (40GB) | 64GB | Best | Slow | Professional use |

## 💡 Usage Examples

### Basic Chat
```
User: What's the capital of France?
Assistant: The capital of France is Paris. It's a beautiful city known for its art, culture, and iconic landmarks like the Eiffel Tower and the Louvre Museum.
```

### Code Help
```
User: Write a Python function to calculate fibonacci numbers
Assistant: Here's a Python function to calculate Fibonacci numbers:

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

### Creative Writing
```
User: Write a short story about a robot learning to paint
Assistant: In a small workshop filled with gears and circuits, R0B-3RT discovered an old paintbrush...
```

## 🔧 Advanced Features

- **Model Switching**: Change models without restarting the application
- **Conversation Export**: Save chat history as text or JSON
- **Custom Prompts**: Load different AI personalities from files
- **Performance Monitoring**: Real-time inference speed and memory usage
- **Batch Processing**: Process multiple prompts simultaneously

## ⚡ Performance Optimization

### GPU Acceleration
```bash
# Install CUDA support (NVIDIA GPUs)
pip install llama-cpp-python[cuda]

# Install Metal support (Apple Silicon)
pip install llama-cpp-python[metal]
```

### Memory Optimization
- Use quantized models (Q4, Q5, Q8) for lower memory usage
- Adjust `n_ctx` parameter for longer conversations
- Enable memory mapping for faster model loading

## 🔒 Privacy Benefits

- **No Data Collection**: Conversations never leave your device
- **No Internet Required**: Works completely offline
- **No API Keys**: No external service dependencies
- **Full Control**: You own and control the AI model

## 🎯 Use Cases

- **Sensitive Data**: Legal, medical, or confidential document analysis
- **Offline Environments**: Air-gapped systems or remote locations
- **Privacy-Conscious Users**: Personal assistant without data sharing
- **Development**: AI application prototyping and testing
- **Education**: Learning about AI without cloud dependencies

## 🤝 Contributing

1. Fork the repository
2. Add support for new model formats
3. Implement performance optimizations
4. Add new interface features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Llama models by Meta AI
- llama-cpp-python by Andrei Betlen
- Gradio for the user interface
