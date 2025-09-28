# 🌍 AI-Powered Travel Planner

A **Streamlit web app** that generates personalized travel itineraries using AI, Google Flights, and online research.  
Get flight options, hotel & restaurant recommendations, and activity suggestions tailored to your preferences.

## Features

- ✈️ Fetch the cheapest flights between cities
- 🏨 AI-powered hotel & restaurant recommendations
- 🗺️ Personalised itinerary generation
- 🎒 Packing checklist & travel essentials
- 💰 Budget, flight class, and hotel rating preferences

## Tech Stack
- Python 3.10+
- Streamlit
- SerpAPI / Google Flights API
- AGNO AI Agents (Gemini model)

---

## Installation

### 1. Clone the repo:

```bash
git clone https://github.com/bandirevanth/aiml-codex/tree/main/GenAI_Travel_Panner_AI_Agent
cd GenAI_Travel_Panner_AI_Agent
```

### 2. Create virtual environment:
```
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 3. Install dependencies:

```pip install -r requirements.txt```

### 4. Set environment variables in .env:
```
SERPAPI_KEY=your_serpapi_key
GOOGLE_API_KEY=your_google_api_key
```

### 5. Run the app:

```streamlit run app.py```

### 6. Usage

- Enter departure & destination cities (IATA codes).
- Select trip duration and theme.
- Enter activity preferences and travel dates.
- Click Generate Travel Plan.
- 
