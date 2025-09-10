import os
import tempfile
from datetime import datetime
from PIL import Image as PILImage
from agno.agent import Agent
from agno.models.google import Gemini
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.media import Image as AgnoImage
import streamlit as st

# -----------------------------
# Environment Setup
# -----------------------------
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
if not GOOGLE_API_KEY:
    st.error("⚠️ Google API key is missing! Please set it in `.env` or your environment variables.")
    st.stop()
os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY

# -----------------------------
# Initialize Medical Agent
# -----------------------------
medical_agent = Agent(
    model=Gemini(id="gemini-2.0-flash-exp"),
    tools=[DuckDuckGoTools()],
    markdown=True,
)

# -----------------------------
# Medical Query Template
# -----------------------------
query = """
You are a highly skilled medical imaging expert with extensive knowledge in radiology and diagnostic imaging. 
Analyze the medical image(s) and structure your response as follows:

### 1. Image Type & Region
- Identify imaging modality (X-ray/MRI/CT/Ultrasound/etc.).
- Specify anatomical region and positioning.
- Evaluate image quality and technical adequacy.

### 2. Key Findings
- Highlight primary observations systematically.
- Identify potential abnormalities with detailed descriptions.
- Include measurements and densities where relevant.

### 3. Diagnostic Assessment
- Provide primary diagnosis with confidence level.
- List differential diagnoses ranked by likelihood.
- Support each diagnosis with observed evidence.
- Highlight critical/urgent findings.

### 4. Patient-Friendly Explanation
- Simplify findings in clear, non-technical language.
- Avoid medical jargon or provide easy definitions.
- Include relatable visual analogies.

### 5. Research Context
- Use DuckDuckGo search to find recent medical literature.
- Search for standard treatment protocols.
- Provide 2-3 key references supporting the analysis.

⚠️ Disclaimer: This is an AI-assisted analysis for **educational and research purposes only**. 
It is **not a substitute for professional medical advice or diagnosis**.
"""

# -----------------------------
# Helper Function
# -----------------------------
def analyze_medical_image(image_path: str) -> str:
    """Processes and analyzes a medical image using AI."""

    try:
        # Open and resize
        image = PILImage.open(image_path)
        width, height = image.size
        aspect_ratio = width / height
        new_width = 500
        new_height = int(new_width / aspect_ratio)
        resized_image = image.resize((new_width, new_height))

        # Save to temp
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
        resized_image.save(temp_file.name)

        # Wrap as AgnoImage
        agno_image = AgnoImage(filepath=temp_file.name)

        # Run analysis
        response = medical_agent.run(query, images=[agno_image])
        return response.content

    except Exception as e:
        return f"⚠️ Analysis error: {e}"
    finally:
        try:
            os.remove(temp_file.name)
        except Exception:
            pass

# -----------------------------
# Streamlit UI
# -----------------------------
st.set_page_config(page_title="Medical Image Analysis", layout="centered")
st.title("🩺 Medical Image Analysis Tool 🔬")
st.markdown(
    """
    Upload a medical image (X-ray, MRI, CT, Ultrasound, etc.) and receive 
    an **AI-powered analysis** including findings, diagnosis, and research context.  
    ⚠️ **Note:** This tool is **not a medical device**. Always consult a healthcare professional.
    """
)

# Sidebar Upload
st.sidebar.header("📤 Upload Medical Images")
uploaded_files = st.sidebar.file_uploader(
    "Choose one or more medical images",
    type=["jpg", "jpeg", "png", "bmp"],
    accept_multiple_files=True,
)

# Session state for reports
if "reports" not in st.session_state:
    st.session_state["reports"] = []

# Analyze button
if uploaded_files and st.sidebar.button("🔍 Analyze Images"):
    for uploaded_file in uploaded_files:
        with st.spinner(f"Analyzing {uploaded_file.name}..."):
            # Save temporarily
            suffix = uploaded_file.type.split("/")[-1]
            temp_path = f"temp_image.{suffix}"
            with open(temp_path, "wb") as f:
                f.write(uploaded_file.getbuffer())

            # Run analysis
            report = analyze_medical_image(temp_path)
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Save to session state
            st.session_state["reports"].append(
                {"filename": uploaded_file.name, "report": report, "timestamp": timestamp}
            )

            os.remove(temp_path)

# Display results
if st.session_state["reports"]:
    for entry in st.session_state["reports"]:
        st.subheader(f"📋 Report for {entry['filename']} ({entry['timestamp']})")
        st.markdown(entry["report"], unsafe_allow_html=True)

        # Download button
        st.download_button(
            label="⬇️ Download Report",
            data=entry["report"],
            file_name=f"{entry['filename']}_report.md",
            mime="text/markdown",
        )

else:
    st.info("👉 Upload an image and click **Analyze Images** to begin.")
