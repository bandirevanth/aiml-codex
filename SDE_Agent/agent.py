import os
import asyncio
import streamlit as st
from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
from cryptography.fernet import Fernet
from github import Github
from agents import (
    Agent, Runner,
    ClaudeChatCompletionsModel,
    set_default_ai_client, set_tracing_disabled
)
import json
import shutil
import tempfile
import subprocess

# ---------------- LOAD ENV & SECURITY ----------------
load_dotenv()
os.environ['ANTHROPIC_API_KEY'] = os.getenv("ANTHROPIC_API_KEY", "")

# Generate encryption key for local code storage
if "ENCRYPTION_KEY" not in st.session_state:
    st.session_state["ENCRYPTION_KEY"] = Fernet.generate_key()
fernet = Fernet(st.session_state["ENCRYPTION_KEY"])

# ---------------- AI CLIENT SETUP ----------------
set_default_ai_client("claude")
set_tracing_disabled(True)

# ---------------- MODELS ----------------
class CodingPlan(BaseModel):
    problem: str
    subtasks: List[str]
    tech_stack: List[str]

class CodeOutput(BaseModel):
    filename: str
    code: str
    explanation: str

class CodeReview(BaseModel):
    suggestions: str
    improvements: Optional[List[str]] = []

# ---------------- AGENTS ----------------
planner_agent = Agent(
    name="Planner",
    instructions="Break requirements into subtasks and tech stack.",
    model=ClaudeChatCompletionsModel(model="claude-v1"),
    output_type=CodingPlan
)

coder_agent = Agent(
    name="Coder",
    instructions="Generate code and explain it in JSON format.",
    model=ClaudeChatCompletionsModel(model="claude-v1"),
    output_type=CodeOutput
)

reviewer_agent = Agent(
    name="Reviewer",
    instructions="Review code, suggest optimizations and improvements.",
    model=ClaudeChatCompletionsModel(model="claude-v1"),
    output_type=CodeReview
)

# ---------------- STREAMLIT UI ----------------
st.set_page_config(page_title="🔒 Secure Claude SDE Assistant", layout="wide")
st.title("🔒 Secure Claude SDE Coding Assistant")

# ---------------- SESSION STATE ----------------
if "code_plan" not in st.session_state:
    st.session_state.code_plan = None
if "generated_code" not in st.session_state:
    st.session_state.generated_code = {}
if "code_review" not in st.session_state:
    st.session_state.code_review = {}

# ---------------- SIDEBAR INPUTS ----------------
with st.sidebar:
    st.header("📥 Problem & Security")
    problem_input = st.text_area("Describe coding problem:")
    
    github_token = st.text_input("GitHub Token (Encrypted)", type="password")
    repo_url = st.text_input("GitHub Repo URL")
    
    if st.button("Plan & Build", disabled=not problem_input):
        st.session_state.generated_code = {}
        st.session_state.code_review = {}

        # ---------------- RUN PLANNER ----------------
        async def run_planner():
            with st.spinner("🧠 Planning..."):
                plan_result = await Runner.run(planner_agent, problem_input)
                st.session_state.code_plan = plan_result.final_output

        asyncio.run(run_planner())

# ---------------- DISPLAY PLAN ----------------
if st.session_state.code_plan:
    plan = st.session_state.code_plan
    st.markdown(f"### 📋 Plan: `{plan.problem}`")
    st.markdown("**Subtasks:**")
    for idx, s in enumerate(plan.subtasks, 1):
        st.markdown(f"{idx}. {s}")
    st.markdown("**Tech Stack:**")
    st.markdown(", ".join(plan.tech_stack))

    selected_task = st.selectbox("Select a subtask:", plan.subtasks)
    if st.button("Generate Code for Task"):
        async def run_coder():
            with st.spinner("🛠️ Generating code..."):
                input_text = f"Task: {selected_task}\nTech stack: {plan.tech_stack}"
                code_result = await Runner.run(coder_agent, input_text)
                result = code_result.final_output
                
                # Encrypt code before saving
                encrypted_code = fernet.encrypt(result.code.encode()).decode()
                result.code = encrypted_code
                st.session_state.generated_code[selected_task] = result

        asyncio.run(run_coder())

# ---------------- DISPLAY CODE ----------------
if st.session_state.generated_code:
    st.subheader("🧾 Generated Code")
    for task, result in st.session_state.generated_code.items():
        decrypted_code = fernet.decrypt(result.code.encode()).decode()
        ext = result.filename.split('.')[-1]
        st.markdown(f"### Task: `{task}` - File: `{result.filename}`")
        st.code(decrypted_code, language=ext)
        st.markdown(f"**Explanation:** {result.explanation}")

        if st.button(f"🔍 Review `{task}`"):
            async def run_reviewer():
                with st.spinner("🔍 Reviewing code..."):
                    review_result = await Runner.run(reviewer_agent, decrypted_code)
                    st.session_state.code_review[task] = review_result.final_output

            asyncio.run(run_reviewer())

# ---------------- DISPLAY REVIEW ----------------
if st.session_state.code_review:
    st.subheader("🛠️ Code Reviews")
    for task, review in st.session_state.code_review.items():
        st.markdown(f"**Task: {task}**")
        st.markdown(review.suggestions)
        if review.improvements:
            st.markdown("💡 Improvements:")
            for imp in review.improvements:
                st.markdown(f"- {imp}")

# ---------------- EXPORT / PROJECT ----------------
if st.session_state.generated_code:
    project_name = st.text_input("Project Folder Name", "secure_project")
    if st.button("📁 Scaffold Project Locally"):
        os.makedirs(project_name, exist_ok=True)
        for task, result in st.session_state.generated_code.items():
            decrypted_code = fernet.decrypt(result.code.encode()).decode()
            filepath = os.path.join(project_name, result.filename)
            with open(filepath, "w") as f:
                f.write(decrypted_code)

        # Generate requirements.txt
        reqs_path = os.path.join(project_name, "requirements.txt")
        with open(reqs_path, "w") as f:
            f.write("\n".join(plan.tech_stack))
        st.success(f"Project scaffolded securely in `{project_name}` with requirements.txt")

    # GitHub push (encrypted token)
    if github_token and repo_url and st.button("🚀 Push to GitHub"):
        g = Github(github_token)
        repo_name = repo_url.split('/')[-1].replace('.git', '')
        repo = g.get_repo(repo_name)
        for task, result in st.session_state.generated_code.items():
            decrypted_code = fernet.decrypt(result.code.encode()).decode()
            repo.create_file(result.filename, f"Add {result.filename}", decrypted_code, branch="main")
        st.success("✅ All files pushed securely to GitHub!")
