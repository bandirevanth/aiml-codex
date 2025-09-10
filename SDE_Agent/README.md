# 🤖 Claude SDE Coding Assistant

A secure, AI-powered development assistant using Claude for **planning, coding, reviewing, and scaffolding projects**.  
Generate multi-file projects, review code, and optionally push to GitHub – all securely.

---

## Features

- AI-powered **planning** of coding tasks.
- Generate **Python (and other language) code** with explanations.
- **Code review** and improvement suggestions.
- **Project scaffolding** with multiple files.
- **GitHub integration** – push files securely.
- Encrypted local storage and token handling.
- Auto-generate `requirements.txt` for dependencies.
- Optional **linting and test scaffolding**.

---

## Installation

### 1. Clone the repository:

```bash
git clone https://github.com/bandirevanth/aiml-codex/tree/main/SDE_Agent
cd SDE_Agent
```

### 2. Create a virtual environment and activate it:

```bash
python -m venv venv
source venv/bin/activate  # Linux / Mac
venv\Scripts\activate     # Windows
```

### 3. Install dependencies:

```bash
pip install -r requirements.txt
```

### 4. Add your Anthropic API key in .env:

```ANTHROPIC_API_KEY=your_api_key_here```
