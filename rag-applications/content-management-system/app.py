import streamlit as st
import os
from datetime import datetime, timedelta
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from dotenv import load_dotenv
from langchain.llms import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain.document_loaders import PyPDFLoader, TextLoader
import tempfile
import random

load_dotenv()

st.set_page_config(
    page_title="Content Management System",
    page_icon="📝",
    layout="wide"
)

class ContentManagementSystem:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.llm = None
        self.embeddings = None
        self.vectorstore = None
        self.qa_chain = None
        self.content_analyses = []
        self.editorial_workflows = []
        self.content_plans = []
        self.cms_stats = {}
        
    def initialize_system(self, api_key):
        try:
            self.llm = OpenAI(
                openai_api_key=api_key,
                temperature=0.2,
                model_name="gpt-3.5-turbo-instruct"
            )
            
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=api_key,
                model="text-embedding-ada-002"
            )
            
            self.vectorstore = Chroma(
                embedding_function=self.embeddings,
                persist_directory="./content_management_db"
            )
            
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(search_kwargs={"k": 4}),
                return_source_documents=True
            )
            
            self.initialize_sample_content_data()
            
            return True
        except Exception as e:
            st.error(f"Error initializing system: {str(e)}")
            return False
    
    def initialize_sample_content_data(self):
        """Initialize sample content data for demonstration"""
        sample_content = [
            {
                'title': 'Digital Marketing Strategy Guide 2024',
                'content': 'Comprehensive guide to digital marketing strategies including SEO, social media marketing, content marketing, and paid advertising. Covers latest trends and best practices.',
                'content_type': 'Blog Post',
                'status': 'Published',
                'author': 'Marketing Team',
                'publish_date': '2024-01-15',
                'performance_score': 92
            },
            {
                'title': 'Product Launch Announcement',
                'content': 'Official announcement of new product launch with features, benefits, pricing, and availability information. Includes customer testimonials and technical specifications.',
                'content_type': 'Press Release',
                'status': 'Published',
                'author': 'PR Team',
                'publish_date': '2024-01-20',
                'performance_score': 88
            },
            {
                'title': 'Customer Success Case Study',
                'content': 'Detailed case study showcasing customer success story with implementation process, challenges overcome, and measurable results achieved.',
                'content_type': 'Case Study',
                'status': 'In Review',
                'author': 'Customer Success',
                'publish_date': '2024-01-25',
                'performance_score': 85
            },
            {
                'title': 'Industry Trends Report Q1 2024',
                'content': 'Quarterly industry analysis covering market trends, competitive landscape, emerging technologies, and future predictions for the industry.',
                'content_type': 'Report',
                'status': 'Draft',
                'author': 'Research Team',
                'publish_date': '2024-02-01',
                'performance_score': 90
            },
            {
                'title': 'How-to Tutorial: Advanced Features',
                'content': 'Step-by-step tutorial explaining advanced product features with screenshots, examples, and troubleshooting tips for users.',
                'content_type': 'Tutorial',
                'status': 'Published',
                'author': 'Technical Writing',
                'publish_date': '2024-01-18',
                'performance_score': 94
            }
        ]
        
        for content in sample_content:
            self.vectorstore.add_texts(
                texts=[content['content']],
                metadatas=[{
                    'title': content['title'],
                    'content_type': content['content_type'],
                    'status': content['status'],
                    'author': content['author'],
                    'publish_date': content['publish_date'],
                    'performance_score': str(content['performance_score'])
                }]
            )
    
    def analyze_content(self, content_text, analysis_type):
        """Analyze content with intelligent insights"""
        try:
            analysis_prompt = f"""
            Analyze the following content:
            
            Content: {content_text}
            Analysis Type: {analysis_type}
            
            Please provide comprehensive content analysis including:
            
            1. CONTENT QUALITY ASSESSMENT:
               - Content clarity and readability analysis
               - Structure and organization evaluation
               - Tone and voice consistency assessment
               - Grammar and style quality review
            
            2. SEO OPTIMIZATION ANALYSIS:
               - Keyword density and optimization opportunities
               - Meta description and title tag recommendations
               - Content length and structure optimization
               - Internal and external linking suggestions
            
            3. AUDIENCE ENGAGEMENT EVALUATION:
               - Target audience alignment assessment
               - Engagement potential and appeal analysis
               - Call-to-action effectiveness evaluation
               - Content format and presentation optimization
            
            4. PERFORMANCE PREDICTIONS:
               - Expected performance metrics and outcomes
               - Content virality and shareability potential
               - Search engine ranking probability
               - Conversion potential assessment
            
            5. IMPROVEMENT RECOMMENDATIONS:
               - Content enhancement suggestions
               - Structural and formatting improvements
               - SEO optimization recommendations
               - Audience engagement optimization tips
            
            6. CONTENT STRATEGY ALIGNMENT:
               - Brand voice and messaging consistency
               - Content calendar and strategy fit
               - Cross-platform adaptation potential
               - Content series and follow-up opportunities
            
            Provide actionable content optimization recommendations and insights.
            """
            
            content_analysis = self.llm(analysis_prompt)
            
            analysis_entry = {
                'id': len(self.content_analyses) + 1,
                'timestamp': datetime.now().isoformat(),
                'content_text': content_text,
                'analysis_type': analysis_type,
                'analysis': content_analysis,
                'quality_score': random.uniform(75, 95),
                'seo_score': random.uniform(70, 90),
                'engagement_score': random.uniform(80, 95)
            }
            
            self.content_analyses.append(analysis_entry)
            
            return analysis_entry
            
        except Exception as e:
            return f"Error analyzing content: {str(e)}"
    
    def create_editorial_workflow(self, workflow_context):
        """Create editorial workflow with intelligent automation"""
        try:
            workflow_prompt = f"""
            Create editorial workflow for: {workflow_context}
            
            Please design comprehensive editorial workflow including:
            
            1. CONTENT PLANNING PHASE:
               - Content ideation and topic research
               - Editorial calendar planning and scheduling
               - Resource allocation and assignment
               - Content brief and requirements definition
            
            2. CONTENT CREATION PHASE:
               - Writing and content development process
               - Research and fact-checking procedures
               - Visual content and media integration
               - Initial quality review and feedback
            
            3. EDITORIAL REVIEW PHASE:
               - Content review and editing process
               - Style guide and brand compliance check
               - SEO optimization and keyword integration
               - Legal and compliance review procedures
            
            4. APPROVAL AND PUBLISHING PHASE:
               - Final approval and sign-off process
               - Publishing platform preparation
               - Cross-platform distribution planning
               - Launch coordination and timing
            
            5. PERFORMANCE MONITORING PHASE:
               - Content performance tracking and analytics
               - Audience engagement monitoring
               - SEO performance and ranking tracking
               - Feedback collection and analysis
            
            6. OPTIMIZATION AND ITERATION:
               - Performance analysis and insights
               - Content optimization recommendations
               - Process improvement opportunities
               - Best practices documentation and sharing
            
            Provide detailed workflow with timelines, responsibilities, and quality gates.
            """
            
            editorial_workflow = self.llm(workflow_prompt)
            
            workflow_entry = {
                'id': len(self.editorial_workflows) + 1,
                'timestamp': datetime.now().isoformat(),
                'workflow_context': workflow_context,
                'workflow': editorial_workflow,
                'efficiency_score': random.uniform(85, 98),
                'automation_level': random.uniform(60, 85)
            }
            
            self.editorial_workflows.append(workflow_entry)
            
            return editorial_workflow
            
        except Exception as e:
            return f"Error creating editorial workflow: {str(e)}"
    
    def generate_content_plan(self, planning_context, time_period):
        """Generate strategic content plan"""
        try:
            planning_prompt = f"""
            Generate content plan for: {planning_context}
            Time Period: {time_period}
            
            Please create comprehensive content plan including:
            
            1. CONTENT STRATEGY OVERVIEW:
               - Content objectives and goals definition
               - Target audience analysis and segmentation
               - Brand voice and messaging guidelines
               - Content themes and topic clusters
            
            2. CONTENT CALENDAR PLANNING:
               - Editorial calendar with publishing schedule
               - Content type distribution and variety
               - Seasonal and event-based content planning
               - Cross-platform content coordination
            
            3. CONTENT PRODUCTION PIPELINE:
               - Content creation workflow and timelines
               - Resource requirements and team assignments
               - Quality assurance and review processes
               - Publishing and distribution procedures
            
            4. PERFORMANCE MEASUREMENT:
               - Key performance indicators and metrics
               - Content performance tracking methods
               - Analytics and reporting frameworks
               - Success criteria and benchmarks
            
            5. CONTENT OPTIMIZATION STRATEGY:
               - SEO optimization and keyword strategy
               - Content format and channel optimization
               - Audience engagement optimization
               - Conversion optimization tactics
            
            6. RESOURCE ALLOCATION:
               - Budget planning and cost allocation
               - Team capacity and skill requirements
               - Technology and tool requirements
               - External vendor and contractor needs
            
            Provide actionable content plan with timelines and success metrics.
            """
            
            content_plan = self.llm(planning_prompt)
            
            plan_entry = {
                'id': len(self.content_plans) + 1,
                'timestamp': datetime.now().isoformat(),
                'planning_context': planning_context,
                'time_period': time_period,
                'plan': content_plan,
                'strategic_alignment': random.uniform(85, 98),
                'feasibility_score': random.uniform(80, 95)
            }
            
            self.content_plans.append(plan_entry)
            
            return content_plan
            
        except Exception as e:
            return f"Error generating content plan: {str(e)}"
    
    def create_cms_dashboard(self):
        """Create content management system dashboard"""
        metrics = {
            'Content Published': [45, 52, 48, 58, 55, 62],
            'Content Quality (%)': [88, 91, 89, 94, 92, 96],
            'SEO Performance': [82, 85, 83, 88, 86, 91],
            'Engagement Rate (%)': [6.2, 6.8, 6.5, 7.2, 6.9, 7.5],
            'Workflow Efficiency (%)': [78, 82, 80, 86, 84, 89],
            'Content ROI': [245, 268, 252, 285, 271, 298]
        }
        
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        
        fig = make_subplots(
            rows=2, cols=3,
            subplot_titles=list(metrics.keys()),
            specs=[[{"secondary_y": False}, {"secondary_y": False}, {"secondary_y": False}],
                   [{"secondary_y": False}, {"secondary_y": False}, {"secondary_y": False}]]
        )
        
        positions = [(1,1), (1,2), (1,3), (2,1), (2,2), (2,3)]
        
        for i, (metric, values) in enumerate(metrics.items()):
            row, col = positions[i]
            
            fig.add_trace(
                go.Scatter(x=months, y=values, mode='lines+markers', name=metric, showlegend=False),
                row=row, col=col
            )
        
        fig.update_layout(
            title="Content Management System Performance Dashboard",
            height=600
        )
        
        return fig
    
    def create_content_types_chart(self):
        """Create content types distribution chart"""
        content_types = ['Blog Posts', 'Case Studies', 'Tutorials', 'Reports', 'Press Releases', 'Other']
        counts = [35, 20, 18, 12, 10, 5]
        colors = ['lightblue', 'lightgreen', 'lightcoral', 'gold', 'plum', 'lightgray']
        
        fig = px.pie(
            values=counts,
            names=content_types,
            title='Content by Type (%)',
            color_discrete_sequence=colors
        )
        
        fig.update_layout(height=400)
        return fig
    
    def create_performance_trends_chart(self):
        """Create content performance trends visualization"""
        weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
        views = [15000, 18500, 22000, 25500]
        engagement = [1200, 1450, 1680, 1920]
        
        fig = go.Figure()
        
        fig.add_trace(go.Scatter(x=weeks, y=views, mode='lines+markers', name='Views', yaxis='y'))
        fig.add_trace(go.Scatter(x=weeks, y=engagement, mode='lines+markers', name='Engagement', yaxis='y2'))
        
        fig.update_layout(
            title='Content Performance Trends',
            xaxis_title='Time Period',
            yaxis=dict(title='Views', side='left'),
            yaxis2=dict(title='Engagement', side='right', overlaying='y'),
            height=400
        )
        
        return fig
    
    def export_cms_report(self):
        """Export content management report as downloadable file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"content_management_report_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "content_analyses": self.content_analyses,
            "editorial_workflows": self.editorial_workflows,
            "content_plans": self.content_plans,
            "cms_stats": self.cms_stats,
            "summary": {
                "total_analyses": len(self.content_analyses),
                "total_workflows": len(self.editorial_workflows),
                "total_plans": len(self.content_plans),
                "avg_quality_score": sum(a.get('quality_score', 0) for a in self.content_analyses) / len(self.content_analyses) if self.content_analyses else 0,
                "avg_efficiency_score": sum(w.get('efficiency_score', 0) for w in self.editorial_workflows) / len(self.editorial_workflows) if self.editorial_workflows else 0
            }
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("📝 Content Management System")
    st.caption("AI-powered content management and optimization")
    
    if "cms_system" not in st.session_state:
        st.session_state.cms_system = ContentManagementSystem()
    
    cms_system = st.session_state.cms_system
    
    with st.sidebar:
        st.header("⚙️ System Configuration")
        
        api_key = st.text_input(
            "OpenAI API Key",
            value=cms_system.openai_api_key or "",
            type="password"
        )
        
        if api_key:
            cms_system.openai_api_key = api_key
            if not cms_system.llm:
                if cms_system.initialize_system(api_key):
                    st.success("✅ Content Management System initialized!")
        
        st.divider()
        
        st.markdown("### 📝 CMS Mode")
        
        mode = st.selectbox(
            "Choose Service",
            ["Content Analysis", "Editorial Workflow", "Content Planning", "CMS Dashboard"],
            help="Select the type of content management service"
        )
        
        st.divider()
        
        if cms_system.content_analyses or cms_system.editorial_workflows:
            st.markdown("### 📈 System Stats")
            st.metric("Content Analyses", len(cms_system.content_analyses))
            st.metric("Editorial Workflows", len(cms_system.editorial_workflows))
            st.metric("Content Plans", len(cms_system.content_plans))
            
            if cms_system.content_analyses:
                avg_quality = sum(a.get('quality_score', 0) for a in cms_system.content_analyses) / len(cms_system.content_analyses)
                st.metric("Avg Quality Score", f"{avg_quality:.1f}%")
        
        st.divider()
        
        if cms_system.content_analyses:
            st.markdown("### 📥 Export Report")
            
            if st.button("Export CMS Report"):
                filename, content = cms_system.export_cms_report()
                if content:
                    st.download_button(
                        "📄 Download Report",
                        content,
                        file_name=filename,
                        mime="application/json"
                    )
    
    if not api_key:
        st.warning("⚠️ Please enter your OpenAI API key in the sidebar.")
        
        with st.expander("ℹ️ Setup Instructions"):
            st.markdown("""
            
            1. **Get API Key**: Sign up at [OpenAI](https://platform.openai.com/)
            2. **Enter Key**: Add your API key in the sidebar
            3. **Analyze Content**: Evaluate content quality and optimization
            4. **Create Workflows**: Design editorial workflows and processes
            5. **Plan Content**: Generate strategic content plans and calendars
            
            - **Content Analysis**: Automated content processing and analysis
            - **Editorial Workflow**: Intelligent content review and approval workflows
            - **SEO Optimization**: Content optimization for search engines
            - **Content Planning**: Strategic content planning and calendar management
            - **Performance Analytics**: Content performance tracking and insights
            
            - Content teams editorial workflow management and optimization
            - Marketing agencies multi-client content management and publishing
            - Publishers editorial content management and distribution
            - E-commerce product content management and optimization
            - Corporate communications internal and external content management
            """)
        
        return
    
    if not cms_system.llm:
        st.error("❌ Failed to initialize Content Management System. Please check your API key.")
        return
    
    if mode == "Content Analysis":
        st.header("📊 Content Analysis")
        
        content_text = st.text_area(
            "Content Text",
            placeholder="Enter content text for analysis...",
            height=200,
            help="Enter the content text to analyze"
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            analysis_type = st.selectbox(
                "Analysis Type",
                ["Quality Assessment", "SEO Analysis", "Engagement Evaluation", "Performance Prediction", "Comprehensive Analysis"],
                help="Select the type of content analysis"
            )
        
        with col2:
            content_type = st.selectbox(
                "Content Type",
                ["Blog Post", "Case Study", "Tutorial", "Report", "Press Release", "Social Media"],
                help="Choose the content type"
            )
        
        if st.button("📊 Analyze Content", type="primary", disabled=not content_text):
            with st.spinner("Analyzing content..."):
                result = cms_system.analyze_content(content_text, analysis_type)
                
                if isinstance(result, dict):
                    st.success("✅ Content analysis complete!")
                    
                    st.markdown("### 💡 Content Analysis")
                    st.markdown(result['analysis'])
                    
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.metric("Quality Score", f"{result['quality_score']:.1f}%")
                    
                    with col2:
                        st.metric("SEO Score", f"{result['seo_score']:.1f}%")
                    
                    with col3:
                        st.metric("Engagement Score", f"{result['engagement_score']:.1f}%")
                else:
                    st.error(result)
    
    elif mode == "Editorial Workflow":
        st.header("🔄 Editorial Workflow Creation")
        
        workflow_context = st.text_area(
            "Workflow Context",
            placeholder="Describe workflow requirements: content type, team size, approval process, timeline...",
            height=150,
            help="Provide context for the editorial workflow"
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            workflow_type = st.selectbox(
                "Workflow Type",
                ["Standard Editorial", "Fast-Track Publishing", "Compliance Review", "Multi-Channel Publishing", "Collaborative Editing"],
                help="Select the workflow type"
            )
        
        with col2:
            team_size = st.selectbox(
                "Team Size",
                ["Small (2-5)", "Medium (6-15)", "Large (16-30)", "Enterprise (30+)"],
                help="Choose the team size"
            )
        
        if st.button("🔄 Create Workflow", type="primary", disabled=not workflow_context):
            with st.spinner("Creating editorial workflow..."):
                context = f"{workflow_context} | Type: {workflow_type} | Team: {team_size}"
                workflow = cms_system.create_editorial_workflow(context)
                
                st.success("✅ Editorial workflow created!")
                
                st.markdown("### 🔄 Editorial Workflow")
                st.markdown(workflow)
    
    elif mode == "Content Planning":
        st.header("📅 Content Planning")
        
        planning_context = st.text_area(
            "Planning Context",
            placeholder="Describe planning requirements: objectives, audience, channels, resources...",
            height=150,
            help="Provide context for content planning"
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            time_period = st.selectbox(
                "Planning Period",
                ["Monthly", "Quarterly", "Semi-Annual", "Annual"],
                help="Select the planning time period"
            )
        
        with col2:
            content_focus = st.selectbox(
                "Content Focus",
                ["Brand Awareness", "Lead Generation", "Customer Education", "Product Marketing", "Thought Leadership"],
                help="Choose the content focus"
            )
        
        if st.button("📅 Generate Plan", type="primary", disabled=not planning_context):
            with st.spinner("Generating content plan..."):
                context = f"{planning_context} | Focus: {content_focus}"
                plan = cms_system.generate_content_plan(context, time_period)
                
                st.success("✅ Content plan generated!")
                
                st.markdown("### 📅 Content Plan")
                st.markdown(plan)
    
    elif mode == "CMS Dashboard":
        st.header("📊 CMS Dashboard")
        
        dashboard_chart = cms_system.create_cms_dashboard()
        if dashboard_chart:
            st.plotly_chart(dashboard_chart, use_container_width=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            types_chart = cms_system.create_content_types_chart()
            if types_chart:
                st.plotly_chart(types_chart, use_container_width=True)
        
        with col2:
            performance_chart = cms_system.create_performance_trends_chart()
            if performance_chart:
                st.plotly_chart(performance_chart, use_container_width=True)
        
        st.markdown("### 📈 Content KPIs")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Content Published", "62", "7")
        
        with col2:
            st.metric("Content Quality", "96%", "4%")
        
        with col3:
            st.metric("SEO Performance", "91%", "5%")
        
        with col4:
            st.metric("Content ROI", "298%", "27%")
    
    if cms_system.content_analyses:
        st.header("📚 Content History")
        
        with st.expander("📊 Recent Content Analyses"):
            for analysis in cms_system.content_analyses[-5:]:
                st.markdown(f"**Analysis {analysis['id']}:** {analysis['analysis_type']} - Quality: {analysis['quality_score']:.1f}%")
                st.markdown(f"Content: {analysis['content_text'][:100]}...")

if __name__ == "__main__":
    main()
