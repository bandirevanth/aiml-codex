# 🏋️‍♂️ AI Health & Fitness Plan Generator

An AI-powered **personalized health assistant** that generates **meal plans, fitness routines, and holistic lifestyle strategies** tailored to your age, weight, height, activity level, dietary preferences, and fitness goals.  
Built with **Streamlit**, **Agno Agents**, and **Google Gemini**.

---

## 🚀 Features

- 🥗 **Dietary Planner Agent**  
  Creates evidence-based 7-day (or custom) meal plans:
  - Calorie targets (Mifflin–St Jeor formula)  
  - Macronutrient breakdowns  
  - Micronutrient highlights  
  - Recipes with prep time & substitutions  
  - Shopping list with categories & optional cost estimates  

- 🏋️ **Fitness Trainer Agent**  
  Generates tailored workout routines:
  - Warm-ups, exercises, and cool-downs  
  - Beginner, Intermediate, or Advanced levels  
  - Goals: weight loss, muscle gain, endurance, flexibility  
  - Safety tips and progress tracking advice  

- 🔗 **Team Lead Agent**  
  Combines **meal + workout** plans into a **holistic health strategy** with lifestyle tips, motivation, and consistency guidance.  

- 🌐 **Web Search Integration**  
  Uses **DuckDuckGoTools** for optional, real-time nutrition/fitness lookups.  

- 🎨 **UI/UX**  
  - Interactive **Streamlit dashboard**  
  - Fitness-inspired theme with styled cards, sections, and motivational messages  
  - Responsive, clean layout  

---

### 🛠️ Tech Stack
- Frontend/UI: Streamlit
- AI Agents: Agno
- LLM: Google Gemini (gemini-2.0-flash-exp)
- Web Tools: DuckDuckGo Search

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/ai-health-fitness-plan.git
cd ai-health-fitness-plan
```

2️⃣ Create a Virtual Environment (recommended)
```bash
python -m venv venv
source venv/bin/activate   # Mac/Linux
venv\Scripts\activate      # Windows
```

3️⃣ Install Dependencies
```pip install -r requirements.txt```

4️⃣ Add API Keys
Create a .env file in the root directory:
```GOOGLE_API_KEY=your_google_api_key_here```

▶️ Run the App
streamlit run app.py

---

### 🧪 Example Usage

Input your age, weight, height, activity level, dietary preferences, and fitness goal.
Click Generate Health Plan.

Receive:
- 📊 A 7-day meal plan with recipes, nutrition breakdown, and shopping list.
- 💪 A personalized workout routine.
- 🔗 A holistic health strategy aligning diet + exercise.

---

## ⚠️ Disclaimer

This app is for educational and informational purposes only.  
It does not replace professional medical advice.  
For any health conditions, pregnancy, or medical concerns:  
👉 Always consult a registered dietitian or licensed clinician before following the plan.

---

### ✨ Future Improvements

- 📝 Export plans to CSV, JSON, or printable recipe cards
- 📈 Progress tracking & history
- 🔔 Reminders & notifications
- 📊 Dashboard with charts for macros & calorie intake
- 🧬 More health parameters (sleep, stress, blood markers)
