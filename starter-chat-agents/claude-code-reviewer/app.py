import streamlit as st
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import anthropic
from pygments import highlight
from pygments.lexers import get_lexer_by_name, guess_lexer
from pygments.formatters import HtmlFormatter
import re

load_dotenv()

st.set_page_config(
    page_title="Claude Code Reviewer",
    page_icon="🔍",
    layout="wide"
)

class ClaudeCodeReviewer:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self.client = None
        self.review_history = []
        
    def initialize_client(self, api_key):
        try:
            self.client = anthropic.Anthropic(api_key=api_key)
            return True
        except Exception as e:
            st.error(f"Error initializing Claude client: {str(e)}")
            return False
    
    def detect_language(self, code):
        try:
            lexer = guess_lexer(code)
            return lexer.name.lower()
        except:
            return "text"
    
    def highlight_code(self, code, language="python"):
        try:
            lexer = get_lexer_by_name(language)
            formatter = HtmlFormatter(style='github', noclasses=True)
            return highlight(code, lexer, formatter)
        except:
            return f"<pre><code>{code}</code></pre>"
    
    def review_code(self, code, language, review_type="comprehensive"):
        if not self.client:
            return "Please initialize Claude client first."
        
        review_prompts = {
            "quick": f"""
            Please provide a quick code review for this {language} code:
            
            ```{language}
            {code}
            ```
            
            Focus on:
            1. Major issues or bugs
            2. Basic best practices
            3. Quick improvement suggestions
            
            Keep the review concise and actionable.
            """,
            
            "comprehensive": f"""
            Please provide a comprehensive code review for this {language} code:
            
            ```{language}
            {code}
            ```
            
            Analyze the following aspects:
            1. **Code Quality**: Readability, maintainability, structure
            2. **Performance**: Efficiency, optimization opportunities
            3. **Security**: Potential vulnerabilities or security issues
            4. **Best Practices**: Language-specific conventions and standards
            5. **Bugs**: Logic errors, edge cases, potential runtime issues
            6. **Refactoring**: Specific suggestions for improvement
            
            Provide specific examples and actionable recommendations.
            """,
            
            "security": f"""
            Please conduct a security-focused code review for this {language} code:
            
            ```{language}
            {code}
            ```
            
            Focus specifically on:
            1. **Security Vulnerabilities**: SQL injection, XSS, CSRF, etc.
            2. **Input Validation**: Proper sanitization and validation
            3. **Authentication/Authorization**: Access control issues
            4. **Data Handling**: Sensitive data exposure or mishandling
            5. **Cryptography**: Proper use of encryption and hashing
            6. **Dependencies**: Known vulnerabilities in libraries
            
            Provide severity levels and remediation steps for each issue found.
            """,
            
            "performance": f"""
            Please conduct a performance-focused code review for this {language} code:
            
            ```{language}
            {code}
            ```
            
            Analyze:
            1. **Time Complexity**: Algorithm efficiency and Big O analysis
            2. **Space Complexity**: Memory usage optimization
            3. **Resource Usage**: CPU, memory, I/O efficiency
            4. **Scalability**: How the code performs under load
            5. **Optimization Opportunities**: Specific improvements
            6. **Profiling Suggestions**: Areas to monitor and measure
            
            Provide concrete optimization recommendations with examples.
            """
        }
        
        try:
            prompt = review_prompts.get(review_type, review_prompts["comprehensive"])
            
            message = self.client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                temperature=0.1,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            review_result = message.content[0].text
            
            review_entry = {
                "timestamp": datetime.now().isoformat(),
                "language": language,
                "review_type": review_type,
                "code": code,
                "review": review_result
            }
            
            self.review_history.append(review_entry)
            return review_result
            
        except Exception as e:
            return f"Error during code review: {str(e)}"
    
    def export_reviews(self):
        if not self.review_history:
            return None, None
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"code_reviews_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "total_reviews": len(self.review_history),
            "reviews": self.review_history
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🔍 Claude Code Reviewer")
    st.caption("Intelligent code analysis powered by Anthropic Claude")
    
    if "code_reviewer" not in st.session_state:
        st.session_state.code_reviewer = ClaudeCodeReviewer()
    
    reviewer = st.session_state.code_reviewer
    
    with st.sidebar:
        st.header("⚙️ Configuration")
        
        api_key = st.text_input(
            "Anthropic API Key",
            value=reviewer.api_key or "",
            type="password"
        )
        
        if api_key:
            reviewer.api_key = api_key
            if not reviewer.client:
                if reviewer.initialize_client(api_key):
                    st.success("✅ Claude client initialized!")
        
        st.divider()
        
        st.markdown("### 🎛️ Review Settings")
        
        review_type = st.selectbox(
            "Review Type",
            ["quick", "comprehensive", "security", "performance"],
            index=1
        )
        
        language = st.selectbox(
            "Programming Language",
            ["python", "javascript", "typescript", "java", "cpp", "go", "rust", "php", "ruby", "swift"],
            index=0
        )
        
        st.divider()
        
        if reviewer.review_history:
            st.markdown("### 📥 Export Reviews")
            
            if st.button("Export Reviews"):
                filename, content = reviewer.export_reviews()
                if content:
                    st.download_button(
                        "📄 Download Reviews",
                        content,
                        file_name=filename,
                        mime="application/json"
                    )
        
        st.divider()
        
        st.markdown("### 📊 Review Stats")
        st.metric("Total Reviews", len(reviewer.review_history))
        
        if reviewer.review_history:
            languages_used = set(r['language'] for r in reviewer.review_history)
            st.metric("Languages Reviewed", len(languages_used))
    
    if not api_key:
        st.warning("⚠️ Please enter your Anthropic API key in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get API Key**: Sign up at [Anthropic Console](https://console.anthropic.com/)
            2. **Enter Key**: Add your API key in the sidebar
            3. **Paste Code**: Enter your code in the text area below
            4. **Select Options**: Choose review type and programming language
            5. **Get Review**: Click "Review Code" for detailed analysis
            
            - **Quick**: Fast overview with major issues
            - **Comprehensive**: Detailed analysis of all aspects
            - **Security**: Focus on vulnerabilities and security
            - **Performance**: Optimization and efficiency analysis
            """)
        
        return
    
    if not reviewer.client:
        st.error("❌ Failed to initialize Claude client. Please check your API key.")
        return
    
    st.header("📝 Code Input")
    
    code_input = st.text_area(
        "Paste your code here:",
        placeholder="Enter your code for review...",
        height=300
    )
    
    col1, col2, col3 = st.columns([2, 1, 1])
    
    with col1:
        if st.button("🔍 Review Code", type="primary", disabled=not code_input.strip()):
            if code_input.strip():
                with st.spinner(f"Claude is analyzing your {language} code..."):
                    review_result = reviewer.review_code(code_input.strip(), language, review_type)
                    st.rerun()
    
    with col2:
        if st.button("🗑️ Clear History"):
            reviewer.review_history = []
            st.rerun()
    
    with col3:
        auto_detect = st.checkbox("Auto-detect language", value=True)
        if auto_detect and code_input.strip():
            detected_lang = reviewer.detect_language(code_input.strip())
            st.caption(f"Detected: {detected_lang}")
    
    if reviewer.review_history:
        st.header("📋 Code Review Results")
        
        for i, review in enumerate(reversed(reviewer.review_history)):
            with st.expander(f"🔍 Review {len(reviewer.review_history) - i} - {review['language'].title()} ({review['review_type'].title()})"):
                
                st.markdown("**📝 Code:**")
                highlighted_code = reviewer.highlight_code(review['code'], review['language'])
                st.markdown(highlighted_code, unsafe_allow_html=True)
                
                st.divider()
                
                st.markdown("**🔍 Claude's Review:**")
                st.markdown(review['review'])
                
                st.caption(f"Reviewed: {review['timestamp']} | Type: {review['review_type'].title()}")

if __name__ == "__main__":
    main()
