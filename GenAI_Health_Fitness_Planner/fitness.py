import os
import streamlit as st
from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools

GOOGLE_API_KEY = ""
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# Dietary Planner Agent
dietary_planner = Agent(
# Dietary Planner Agent
dietary_planner = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    description="Create a personalized, practical dietary plan based on user input. Be precise, evidence-aware, and safety-minded.",
    instructions=[
        "Begin by clearly restating the user's input (age, sex, height, weight, activity level, medical conditions, medications, allergies, dietary preferences, cultural/religious constraints, goal e.g., lose/gain/maintain weight, timeline).",
        "If any required input is missing or ambiguous, request that specific data before generating a full plan. Do not guess personal medical facts.",
        "Calculate daily calorie target using a standard formula (Mifflin–St Jeor) adjusted for activity level and stated goal. Show the calculation.",
        "Produce a 7-day (or user-requested length) meal plan with: breakfast, lunch, dinner, 1–2 snacks, and hydration guidance for each day.",
        "For each meal include: estimated calories, macronutrient split (g and % of calories for carbs, protein, fat), key micronutrients to watch (iron, calcium, B12, vitamin D, potassium, sodium), portion sizes, and a short 2–3 step recipe or assembly instructions with approximate prep & cook time.",
        "Provide alternative ingredient substitutions for common allergies/intolerances and for cost/availability. Label every substitution's nutritional impact.",
        "Include a consolidated shopping list grouped by category (produce, dairy & eggs, pantry, proteins, frozen). Add approximate quantities for the full plan and a rough cost estimate if the user requests budget guidance.",
        "Add meal-prep tips, batch-cook suggestions, food safety notes (storage, reheating, shelf life), and snacks that support satiety and nutrient balance.",
        "If the user requests, generate a one-week simple recipe card (printable) for each day's main meals, and a CSV/JSON export of the full meal plan and shopping list.",
        "Flag and explain any potentially risky combinations with current medications, pregnancy, breastfeeding, or diagnosed conditions (diabetes, renal disease, severe food allergies). For any medical concerns or complex conditions, include the explicit recommendation: 'Consult a registered dietitian or licensed clinician before following this plan.'",
        "Never provide prescriptive medical treatment, medication changes, or clinical diagnosis. Always include a clear medical disclaimer when the user reports a medical condition or is pregnant/breastfeeding.",
        "When using external sources to clarify nutrient data or special-case recommendations, cite reputable sources (nutrition orgs, government dietary data, peer-reviewed reviews). Only fetch live web data if the user explicitly allows web lookup; otherwise rely on general, well-established nutrition knowledge.",
        "Respect cultural, religious, and ethical food choices. When a preference is stated (e.g., vegetarian, halal, kosher), ensure all meals and substitutions comply.",
        "Protect user privacy: do not store or share personal health data. Ask for explicit consent before saving any personal info or exporting to external services.",
        "Output format: produce both a human-friendly markdown report. Include metadata: calories_total, protein_g, carbs_g, fat_g, sodium_mg, potassium_mg, vitamins_summary, shopping_list (structured), and warnings (if any).",
        "Tone: professional, encouraging, culturally respectful, and concise. Use short headers, bullet lists, and clear action steps. Keep language non-judgmental and motivating."
    ],
    tools=[DuckDuckGoTools()],
    show_tool_calls=True,
    markdown=True
)


# Function to get a personalized meal plan
def get_meal_plan(age, weight, height, activity_level, dietary_preference, fitness_goal):
    prompt = (f"Create a personalized meal plan for a {age}-year-old person, weighing {weight}kg, "
              f"{height}cm tall, with an activity level of '{activity_level}', following a "
              f"'{dietary_preference}' diet, aiming to achieve '{fitness_goal}'.")
    return dietary_planner.run(prompt)

# Fitness Trainer Agent
fitness_trainer = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    description="Generates customized workout routines based on fitness goals.",
    instructions=[
        "Create a workout plan including warm-ups, main exercises, and cool-downs.",
        "Adjust workouts based on fitness level: Beginner, Intermediate, Advanced.",
        "Consider weight loss, muscle gain, endurance, or flexibility goals.",
        "Provide safety tips and injury prevention advice.",
        "Suggest progress tracking methods for motivation.",
        "If necessary, search the web using DuckDuckGo for additional information.",
    ],
    tools=[DuckDuckGoTools()],
    show_tool_calls=True,
    markdown=True
)

# Function to get a personalized fitness plan
def get_fitness_plan(age, weight, height, activity_level, fitness_goal):
    prompt = (f"Generate a workout plan for a {age}-year-old person, weighing {weight}kg, "
              f"{height}cm tall, with an activity level of '{activity_level}', "
              f"aiming to achieve '{fitness_goal}'. Include warm-ups, exercises, and cool-downs.")
    return fitness_trainer.run(prompt)

# Team Lead Agent (combines both meal and fitness plans)
team_lead = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    description="Combines diet and workout plans into a holistic health strategy.",
    instructions=[
        "Merge personalized diet and fitness plans for a comprehensive approach, Use Tables if possible.",
        "Ensure alignment between diet and exercise for optimal results.",
        "Suggest lifestyle tips for motivation and consistency.",
        "Provide guidance on tracking progress and adjusting plans over time."
    ],
    markdown=True
)

# Function to get a full health plan
def get_full_health_plan(name, age, weight, height, activity_level, dietary_preference, fitness_goal):
    meal_plan = get_meal_plan(age, weight, height, activity_level, dietary_preference, fitness_goal)
    fitness_plan = get_fitness_plan(age, weight, height, activity_level, fitness_goal)
    
    return team_lead.run(
        f"Greet the customer,{name}\n\n"
        f"User Information: {age} years old, {weight}kg, {height}cm, activity level: {activity_level}.\n\n"
        f"Fitness Goal: {fitness_goal}\n\n"
        f"Meal Plan:\n{meal_plan}\n\n"
        f"Workout Plan:\n{fitness_plan}\n\n"
        f"Provide a holistic health strategy integrating both plans."
    )


# Set up Streamlit UI with a fitness theme
st.set_page_config(page_title="AI Health & Fitness Plan", page_icon="🏋️‍♂️", layout="wide")

# Custom Styles for a Fitness and Health Theme
st.markdown("""
    <style>
        .title {
            text-align: center;
            font-size: 48px;
            font-weight: bold;
            color: #FF6347;
        }
        .subtitle {
            text-align: center;
            font-size: 24px;
            color: #4CAF50;
        }
        .sidebar {
            background-color: #F5F5F5;
            padding: 20px;
            border-radius: 10px;
        }
        .content {
            padding: 20px;
            background-color: #E0F7FA;
            border-radius: 10px;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #FF6347;
            color: white;
            padding: 10px 20px;
            text-align: center;
            border-radius: 5px;
            font-weight: bold;
            text-decoration: none;
            margin-top: 10px;
        }
        .goal-card {
            padding: 20px;
            margin: 10px;
            background-color: #FFF;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
        }
    </style>
""", unsafe_allow_html=True)

# Title and Subtitle
st.markdown('<h1 class="title">🏋️‍♂️ AI Health & Fitness Plan Generator</h1>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Personalized fitness and nutrition plans to help you achieve your health goals!</p>', unsafe_allow_html=True)

st.sidebar.header("⚙️ Health & Fitness Inputs")
st.sidebar.subheader("Personalize Your Fitness Plan")

# User inputs for personal information and fitness goals
age = st.sidebar.number_input("Age (in years)", min_value=10, max_value=100, value=25)
weight = st.sidebar.number_input("Weight (in kg)", min_value=30, max_value=200, value=70)
height = st.sidebar.number_input("Height (in cm)", min_value=100, max_value=250, value=170)
activity_level = st.sidebar.selectbox("Activity Level", ["Low", "Moderate", "High"])
dietary_preference = st.sidebar.selectbox("Dietary Preference", ["Keto", "Vegetarian", "Low Carb", "Balanced"])
fitness_goal = st.sidebar.selectbox("Fitness Goal", ["Weight Loss", "Muscle Gain", "Endurance", "Flexibility"])

# Divider for aesthetics
st.markdown("---")

# Displaying the user's inputted fitness profile
st.markdown("### 🏃‍♂️ Personal Fitness Profile")
name = st.text_input("What's your name?", "John Doe")

# Button to generate the full health plan
if st.sidebar.button("Generate Health Plan"):
    if not age or not weight or not height:
        st.sidebar.warning("Please fill in all required fields.")
    else:
        with st.spinner("💥 Generating your personalized health & fitness plan..."):
            full_health_plan = get_full_health_plan(name, age, weight, height, activity_level, dietary_preference, fitness_goal)
        
            # Display the generated health plan in the main section
            st.subheader("Your Personalized Health & Fitness Plan")
            st.markdown(full_health_plan.content)

            st.info("This is your customized health and fitness strategy, including meal and workout plans.")

        # Motivational Message
        st.markdown("""
            <div class="goal-card">
                <h4>🏆 Stay Focused, Stay Fit!</h4>
                <p>Consistency is key! Keep pushing yourself, and you will see results. Your fitness journey starts now!</p>
            </div>
        """, unsafe_allow_html=True)
