# 📄 Gemini PDF Q&A Agent  

An AI-powered PDF Question & Answer system built with **Google Gemini**, **Google ADK**, and **Streamlit**.  
Upload a PDF, ask a question, and receive clear, structured answers extracted directly from the document.  

---

## 🚀 Features

- 📂 **Upload PDFs** — processes files securely in-memory (no storage).  
- 🤖 **Gemini AI** — answers user questions based on PDF contents.  
- 🛠️ **Google ADK Agents** — integrates tools for document analysis.  
- ✨ **Structured Answers** — bold key terms, bullet lists, numbered steps, and code blocks for clarity.  
- ⚡ **Fast & Lightweight** — works best with clean, text-based PDFs.  

---

## 🛠️ Installation Guide

### 1️⃣ Clone the Repository

### 2️⃣ Create & Activate a Virtual Environment
```
python -m venv venv
source venv/bin/activate   # macOS/Linux
venv\Scripts\activate      # Windows
```

### 3️⃣ Install Requirements
```pip install -r requirements.txt```

4️⃣ Configure API Key
Create a .env file in the root directory:

```GOOGLE_API_KEY=your_api_key_here```

Or set it directly inside the code if testing:

```os.environ["GOOGLE_API_KEY"] = "your_api_key_here"```

5️⃣ Run the App
```streamlit run app.py```

---

## ⚠️ Disclaimer

- This tool is provided as-is and is not guaranteed to be accurate.
- ❌ It does not replace human expertise.
- ❌ It should not be used for medical, financial, or legal decisions.
- ✅ Use it only as an assistive tool.
- The author assumes no responsibility for any consequences resulting from the use of this software.
