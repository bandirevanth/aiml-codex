import gradio as gr
import os
from llama_cpp import Llama
from datetime import datetime
import json
from dotenv import load_dotenv

load_dotenv()

class LocalLlamaChat:
    def __init__(self):
        self.llm = None
        self.conversation_history = []
        self.model_path = os.getenv("MODEL_PATH", "./models/llama-2-7b-chat.q4_0.bin")
        self.max_tokens = int(os.getenv("MAX_TOKENS", "512"))
        self.temperature = float(os.getenv("TEMPERATURE", "0.7"))
        self.gpu_layers = int(os.getenv("GPU_LAYERS", "0"))
        
    def load_model(self, model_path=None):
        if model_path:
            self.model_path = model_path
            
        if not os.path.exists(self.model_path):
            return f"❌ Model file not found: {self.model_path}"
        
        try:
            self.llm = Llama(
                model_path=self.model_path,
                n_ctx=2048,
                n_threads=4,
                n_gpu_layers=self.gpu_layers,
                verbose=False
            )
            return f"✅ Model loaded successfully: {os.path.basename(self.model_path)}"
        except Exception as e:
            return f"❌ Error loading model: {str(e)}"
    
    def format_prompt(self, message, system_prompt="You are a helpful AI assistant."):
        if not self.conversation_history:
            prompt = f"<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{message} [/INST]"
        else:
            conversation = ""
            for i, (user_msg, assistant_msg) in enumerate(self.conversation_history):
                if i == 0:
                    conversation += f"<s>[INST] <<SYS>>\n{system_prompt}\n<</SYS>>\n\n{user_msg} [/INST] {assistant_msg} </s>"
                else:
                    conversation += f"<s>[INST] {user_msg} [/INST] {assistant_msg} </s>"
            prompt = conversation + f"<s>[INST] {message} [/INST]"
        return prompt
    
    def generate_response(self, message, system_prompt, max_tokens, temperature):
        if not self.llm:
            return "❌ Please load a model first!"
        
        try:
            prompt = self.format_prompt(message, system_prompt)
            
            response = self.llm(
                prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=["</s>", "[INST]"],
                echo=False
            )
            
            assistant_response = response['choices'][0]['text'].strip()
            
            self.conversation_history.append((message, assistant_response))
            
            return assistant_response
            
        except Exception as e:
            return f"❌ Error generating response: {str(e)}"
    
    def clear_conversation(self):
        self.conversation_history = []
        return "🗑️ Conversation history cleared!"
    
    def export_conversation(self):
        if not self.conversation_history:
            return None
        
        export_data = {
            "timestamp": datetime.now().isoformat(),
            "model": os.path.basename(self.model_path),
            "conversation": self.conversation_history
        }
        
        filename = f"conversation_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, 'w') as f:
            json.dump(export_data, f, indent=2)
        
        return filename

def create_interface():
    chat_bot = LocalLlamaChat()
    
    with gr.Blocks(title="Local Llama Chat", theme=gr.themes.Soft()) as interface:
        gr.Markdown("# 🦙 Local Llama Chat Agent")
        gr.Markdown("Privacy-focused AI chat running entirely on your local machine")
        
        with gr.Row():
            with gr.Column(scale=2):
                chatbot = gr.Chatbot(
                    label="Conversation",
                    height=400,
                    show_label=True
                )
                
                with gr.Row():
                    msg = gr.Textbox(
                        label="Your message",
                        placeholder="Type your message here...",
                        lines=2,
                        scale=4
                    )
                    send_btn = gr.Button("Send", variant="primary", scale=1)
                
                with gr.Row():
                    clear_btn = gr.Button("Clear Chat", variant="secondary")
                    export_btn = gr.Button("Export Chat", variant="secondary")
            
            with gr.Column(scale=1):
                gr.Markdown("### ⚙️ Configuration")
                
                model_path = gr.Textbox(
                    label="Model Path",
                    value=chat_bot.model_path,
                    placeholder="Path to your Llama model file"
                )
                
                load_btn = gr.Button("Load Model", variant="primary")
                model_status = gr.Textbox(
                    label="Model Status",
                    value="No model loaded",
                    interactive=False
                )
                
                gr.Markdown("### 🎛️ Generation Settings")
                
                system_prompt = gr.Textbox(
                    label="System Prompt",
                    value="You are a helpful AI assistant.",
                    lines=3
                )
                
                max_tokens = gr.Slider(
                    label="Max Tokens",
                    minimum=50,
                    maximum=2048,
                    value=chat_bot.max_tokens,
                    step=50
                )
                
                temperature = gr.Slider(
                    label="Temperature",
                    minimum=0.0,
                    maximum=1.0,
                    value=chat_bot.temperature,
                    step=0.1
                )
                
                gr.Markdown("### 📊 Stats")
                stats = gr.Textbox(
                    label="Conversation Stats",
                    value="Messages: 0",
                    interactive=False
                )
        
        def respond(message, history, system_prompt, max_tokens, temperature):
            if not message.strip():
                return history, ""
            
            response = chat_bot.generate_response(message, system_prompt, max_tokens, temperature)
            history.append((message, response))
            
            stats_text = f"Messages: {len(chat_bot.conversation_history)}"
            return history, "", stats_text
        
        def clear_chat():
            chat_bot.clear_conversation()
            return [], "Messages: 0"
        
        def load_model_handler(model_path):
            status = chat_bot.load_model(model_path)
            return status
        
        def export_chat():
            filename = chat_bot.export_conversation()
            if filename:
                return f"✅ Exported to {filename}"
            else:
                return "❌ No conversation to export"
        
        send_btn.click(
            respond,
            inputs=[msg, chatbot, system_prompt, max_tokens, temperature],
            outputs=[chatbot, msg, stats]
        )
        
        msg.submit(
            respond,
            inputs=[msg, chatbot, system_prompt, max_tokens, temperature],
            outputs=[chatbot, msg, stats]
        )
        
        clear_btn.click(
            clear_chat,
            outputs=[chatbot, stats]
        )
        
        load_btn.click(
            load_model_handler,
            inputs=[model_path],
            outputs=[model_status]
        )
        
        export_btn.click(
            export_chat,
            outputs=[model_status]
        )
        
        interface.load(
            lambda: chat_bot.load_model(),
            outputs=[model_status]
        )
    
    return interface

if __name__ == "__main__":
    interface = create_interface()
    interface.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True
    )
