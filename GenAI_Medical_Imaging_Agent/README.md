# 🩺 Medical Image Analysis Tool 🔬

An AI-powered **medical imaging assistant** that analyzes X-rays, MRIs, CT scans, and ultrasound images.  
It provides structured findings, diagnostic assessments, patient-friendly explanations, and references to medical literature.

---

## ✨ Features
- 📸 Upload one or multiple medical images
- 🤖 AI-powered image analysis using Google Gemini
- 🔎 Key findings, diagnoses, and differential diagnoses
- 🧑‍⚕️ Patient-friendly explanations
- 📚 References from DuckDuckGo search
- 📂 Downloadable reports (Markdown format)
- ⏳ Session history (analyze multiple images in one session)
- ⚠️ Built-in medical disclaimer

---

## 🚀 Setup & Installation

### 1. Clone Repo
```bash
git clone https://github.com/bandirevanth/aiml-codex/tree/main/GenAI_Medical_Imaging_Agent
cd GenAI_Medical_Imaging_Agent
```

### 2. Create Virtual Environment
```
python -m venv .venv
source .venv/bin/activate   # On macOS/Linux
.venv\Scripts\activate      # On Windows
```

### 3. Install Dependencies
```pip install -r requirements.txt```

### 4. Set API Key
Create a .env file in the project root:

```GOOGLE_API_KEY=your_api_key_here```

### 5. Run App
```streamlit run app.py```
