# 📰 AI-Powered News Aggregator

This project is a **multi-agent news aggregator** built with [Autogen](https://github.com/microsoft/autogen).  
It retrieves fresh news from multiple sources (`NewsAPI` and `Serper.dev`), aggregates them, summarizes key points, and writes everything into a neat **Markdown report**.

## ✨ Features
- 🔎 Retrieve news articles from **NewsAPI** (relevancy-based).
- 🌐 Retrieve news articles from **Serper.dev** (Google-powered search).
- 🤖 AI-powered agents for:
  - News fetching
  - Summarization & aggregation
  - Writing to Markdown
- 📂 Outputs news summaries into a **clean markdown file** (`news.md`).

## Gist of the Process
The app will:
- Fetch news from NewsAPI and Serper.dev.
- Summarize and aggregate results.
- Save output to `news.md`.
---

## ⚙️ Setup

### 1. Clone the repository
```bash
git clone https://github.com/bandirevanth/news-aggregator.git
cd news-aggregator
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate   # On Linux/Mac
venv\Scripts\activate      # On Windows
```

### 3. Install dependencies
```pip install -r requirements.txt```

### 4. Set up environment variables

Add your API keys in the `.env` file:

```
NEWSAPI_API_KEY=your_newsapi_key_here
SERPER_API_KEY=your_serper_api_key_here
```

### 5. 🚀 Usage

Run the script:
```python news_aggregator.py```

---

# ⚠️ Warning & Disclaimer

1. **Informational Purposes Only**  
   This news aggregator is designed for educational and informational purposes. The content retrieved is sourced from third-party news APIs and services. The accuracy, completeness, or timeliness of the information is **not guaranteed**.
   
3. **No Financial, Medical, or Legal Advice**  
   The aggregated news should **not be considered professional advice** (financial, medical, legal, or otherwise). Always verify information from authoritative sources before making decisions.

4. **Third-Party Content**  
   News articles come from external providers (e.g., NewsAPI, Serper.dev). The app **does not modify** the content but summarizes and aggregates it. All copyrights belong to the original publishers.

5. **Use at Your Own Risk**  
   The developers and maintainers of this project are **not responsible for any consequences** arising from the use of this application or its content.

6. **Respect API Terms**  
   Users are responsible for complying with the terms and conditions of the APIs used (NewsAPI, Serper.dev, etc.). Excessive requests or misuse may result in API bans or charges.
