# 📈 AI Investment Strategist

An AI-powered **investment research assistant** built with **Streamlit**, **yfinance**, **Plotly**, and **Google Gemini (via Agno)**.  
It fetches stock market data, analyzes company profiles, summarizes recent news, and generates **investment recommendations** in a structured investor-friendly report.

---

## 🚀 Features
- 📊 Fetch **6-month historical stock performance** from Yahoo Finance
- 📰 Summarize **company profiles & latest news**
- 🤖 AI-powered **stock recommendations** using Google Gemini
- 📈 Interactive **stock performance charts** (Plotly)
- 🔒 API Key management with `.env` file support
- 📝 Final **investment report** combining market trends, company insights, and ranked stock recommendations

---

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-investment-strategist.git
cd ai-investment-strategist
```

### 2. Create and activate a virtual environment
```python -m venv .venv
source .venv/bin/activate   # On Linux / macOS
.venv\Scripts\activate      # On Windows
```

### 3. Install dependencies
```pip install -r requirements.txt```

### 4. 🔑 Environment Variables
Create a .env file in the project root:
```GOOGLE_API_KEY=your_google_api_key_here```

### 5. ▶️ Run the App
```streamlit run app.py```
