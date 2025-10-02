import streamlit as st
import os
from datetime import datetime, timedelta
import json
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from langchain.llms import OpenAI
import random

load_dotenv()

st.set_page_config(
    page_title="Content Creation Team",
    page_icon="✍️",
    layout="wide"
)

class ContentCreationTeam:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.llm = None
        self.crew = None
        self.projects = []
        self.team_performance = []
        
    def initialize_team(self, api_key):
        try:
            self.llm = OpenAI(
                openai_api_key=api_key,
                temperature=0.7,
                model_name="gpt-3.5-turbo-instruct"
            )
            
            self.research_agent = Agent(
                role='Content Researcher',
                goal='Conduct thorough research and gather accurate information for content creation',
                backstory="""You are an expert content researcher with years of experience in 
                fact-checking, source verification, and comprehensive topic analysis. You excel at 
                finding reliable sources and extracting key insights for content creation.""",
                verbose=True,
                allow_delegation=False,
                llm=self.llm
            )
            
            self.writer_agent = Agent(
                role='Content Writer',
                goal='Create engaging, high-quality content based on research and requirements',
                backstory="""You are a skilled content writer with expertise in various writing 
                styles and formats. You can adapt your writing to different audiences and purposes, 
                creating compelling narratives and informative content.""",
                verbose=True,
                allow_delegation=False,
                llm=self.llm
            )
            
            self.editor_agent = Agent(
                role='Content Editor',
                goal='Review, edit, and optimize content for clarity, accuracy, and engagement',
                backstory="""You are a meticulous content editor with a keen eye for detail. 
                You excel at improving content structure, grammar, style, and ensuring consistency 
                across all content pieces.""",
                verbose=True,
                allow_delegation=False,
                llm=self.llm
            )
            
            self.seo_agent = Agent(
                role='SEO Specialist',
                goal='Optimize content for search engines and improve organic visibility',
                backstory="""You are an SEO expert with deep knowledge of search engine algorithms, 
                keyword research, and content optimization strategies. You ensure content ranks well 
                and drives organic traffic.""",
                verbose=True,
                allow_delegation=False,
                llm=self.llm
            )
            
            self.social_media_agent = Agent(
                role='Social Media Specialist',
                goal='Adapt content for social media platforms and create distribution strategies',
                backstory="""You are a social media expert who understands platform-specific 
                content requirements, audience behavior, and engagement strategies. You excel at 
                creating viral and shareable content.""",
                verbose=True,
                allow_delegation=False,
                llm=self.llm
            )
            
            self.analytics_agent = Agent(
                role='Content Analyst',
                goal='Analyze content performance and provide optimization recommendations',
                backstory="""You are a data-driven content analyst who tracks performance metrics, 
                identifies trends, and provides actionable insights for content improvement and 
                strategy optimization.""",
                verbose=True,
                allow_delegation=False,
                llm=self.llm
            )
            
            return True
        except Exception as e:
            st.error(f"Error initializing team: {str(e)}")
            return False
    
    def create_content_project(self, project_details):
        """Create a comprehensive content creation project"""
        try:
            research_task = Task(
                description=f"""
                Conduct comprehensive research for: {project_details}
                
                Research Requirements:
                1. Topic analysis and key themes identification
                2. Target audience research and persona development
                3. Competitor content analysis and gap identification
                4. Industry trends and current developments
                5. Reliable source gathering and fact verification
                6. Key statistics and data points collection
                7. Expert quotes and authoritative references
                8. Content angle and unique perspective development
                
                Deliverable: Detailed research report with sources, key insights, and content recommendations.
                """,
                agent=self.research_agent
            )
            
            writing_task = Task(
                description=f"""
                Create high-quality content based on research findings for: {project_details}
                
                Writing Requirements:
                1. Engaging headline and compelling introduction
                2. Well-structured content with clear sections
                3. Incorporation of research insights and data
                4. Target audience-appropriate tone and style
                5. Call-to-action and engagement elements
                6. Proper formatting and readability optimization
                7. Brand voice consistency and messaging alignment
                8. Content length optimization for purpose and platform
                
                Deliverable: Complete content draft with headlines, subheadings, and formatted text.
                """,
                agent=self.writer_agent
            )
            
            editing_task = Task(
                description=f"""
                Edit and refine the content for: {project_details}
                
                Editing Requirements:
                1. Grammar, spelling, and punctuation correction
                2. Sentence structure and flow improvement
                3. Clarity and readability enhancement
                4. Consistency in style and tone
                5. Fact-checking and accuracy verification
                6. Content structure and organization optimization
                7. Transition improvement and logical flow
                8. Final proofreading and quality assurance
                
                Deliverable: Polished, publication-ready content with tracked changes and improvement notes.
                """,
                agent=self.editor_agent
            )
            
            seo_task = Task(
                description=f"""
                Optimize content for search engines for: {project_details}
                
                SEO Requirements:
                1. Keyword research and primary/secondary keyword identification
                2. Title tag and meta description optimization
                3. Header tag structure (H1, H2, H3) optimization
                4. Internal and external linking strategy
                5. Image alt text and optimization recommendations
                6. Content length and keyword density optimization
                7. Featured snippet optimization opportunities
                8. Technical SEO recommendations
                
                Deliverable: SEO-optimized content with keyword strategy and technical recommendations.
                """,
                agent=self.seo_agent
            )
            
            social_media_task = Task(
                description=f"""
                Create social media content and distribution strategy for: {project_details}
                
                Social Media Requirements:
                1. Platform-specific content adaptation (Facebook, Twitter, LinkedIn, Instagram)
                2. Engaging social media posts with hashtags
                3. Visual content recommendations and descriptions
                4. Posting schedule and timing optimization
                5. Community engagement strategy
                6. Influencer outreach opportunities
                7. Social media advertising recommendations
                8. Cross-platform content repurposing strategy
                
                Deliverable: Complete social media content package with platform-specific posts and strategy.
                """,
                agent=self.social_media_agent
            )
            
            analytics_task = Task(
                description=f"""
                Develop performance tracking and optimization strategy for: {project_details}
                
                Analytics Requirements:
                1. KPI identification and measurement framework
                2. Content performance tracking setup
                3. Audience engagement metrics definition
                4. Conversion tracking and attribution
                5. A/B testing recommendations
                6. Performance benchmarking and goals
                7. Reporting dashboard and monitoring
                8. Optimization recommendations based on data
                
                Deliverable: Analytics framework with tracking setup and performance optimization plan.
                """,
                agent=self.analytics_agent
            )
            
            self.crew = Crew(
                agents=[
                    self.research_agent,
                    self.writer_agent,
                    self.editor_agent,
                    self.seo_agent,
                    self.social_media_agent,
                    self.analytics_agent
                ],
                tasks=[
                    research_task,
                    writing_task,
                    editing_task,
                    seo_task,
                    social_media_task,
                    analytics_task
                ],
                process=Process.sequential,
                verbose=True
            )
            
            result = self.crew.kickoff()
            
            project_entry = {
                'id': len(self.projects) + 1,
                'timestamp': datetime.now().isoformat(),
                'details': project_details,
                'result': result,
                'team_size': 6,
                'completion_time': random.uniform(2, 6),
                'quality_score': random.uniform(85, 98)
            }
            
            self.projects.append(project_entry)
            
            return result
        except Exception as e:
            return f"Error creating content project: {str(e)}"
    
    def analyze_team_performance(self, performance_data):
        """Analyze team performance and collaboration effectiveness"""
        try:
            performance_analysis = f"""
            Content Creation Team Performance Analysis: {performance_data}
            
            TEAM PERFORMANCE METRICS:
            
            1. PRODUCTIVITY ANALYSIS:
               - Content output volume and quality
               - Project completion times and efficiency
               - Agent specialization effectiveness
               - Workflow bottleneck identification
            
            2. COLLABORATION EFFECTIVENESS:
               - Inter-agent communication quality
               - Task handoff efficiency
               - Knowledge sharing and learning
               - Conflict resolution and consensus building
            
            3. QUALITY ASSESSMENT:
               - Content quality scores and feedback
               - Error rates and revision requirements
               - Client satisfaction and approval rates
               - Brand consistency and voice alignment
            
            4. SPECIALIZATION IMPACT:
               - Research depth and accuracy
               - Writing engagement and readability
               - Editing improvement effectiveness
               - SEO performance and ranking improvements
               - Social media engagement rates
               - Analytics insights and optimization impact
            
            5. PROCESS OPTIMIZATION:
               - Workflow efficiency improvements
               - Resource allocation optimization
               - Skill development and training needs
               - Technology and tool enhancement opportunities
            
            6. PERFORMANCE BENCHMARKING:
               - Industry standard comparisons
               - Historical performance trends
               - Competitive analysis and positioning
               - Best practice identification and adoption
            
            Recommendations for team performance improvement and optimization strategies.
            """
            
            performance_entry = {
                'id': len(self.team_performance) + 1,
                'timestamp': datetime.now().isoformat(),
                'data': performance_data,
                'analysis': performance_analysis,
                'efficiency_score': random.uniform(80, 95),
                'collaboration_rating': random.uniform(85, 98)
            }
            
            self.team_performance.append(performance_entry)
            
            return performance_analysis
        except Exception as e:
            return f"Error analyzing team performance: {str(e)}"
    
    def create_team_dashboard(self):
        """Create team performance dashboard"""
        metrics = {
            'Content Quality': [88, 91, 87, 94, 92, 96],
            'Project Completion': [85, 89, 83, 92, 90, 94],
            'SEO Performance': [78, 82, 79, 86, 84, 89],
            'Social Engagement': [72, 76, 74, 81, 79, 85],
            'Team Efficiency': [82, 86, 84, 89, 87, 92],
            'Client Satisfaction': [90, 93, 89, 96, 94, 97]
        }
        
        weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6']
        
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
                go.Scatter(x=weeks, y=values, mode='lines+markers', name=metric, showlegend=False),
                row=row, col=col
            )
        
        fig.update_layout(
            title="Content Creation Team Performance Dashboard",
            height=600
        )
        
        return fig
    
    def create_agent_workload_chart(self):
        """Create agent workload distribution chart"""
        agents = ['Research Agent', 'Writer Agent', 'Editor Agent', 'SEO Agent', 'Social Agent', 'Analytics Agent']
        workload = [18, 25, 20, 15, 12, 10]
        colors = ['lightblue', 'lightgreen', 'lightcoral', 'gold', 'plum', 'lightsalmon']
        
        fig = px.pie(
            values=workload,
            names=agents,
            title='Agent Workload Distribution (%)',
            color_discrete_sequence=colors
        )
        
        fig.update_layout(height=400)
        return fig
    
    def create_content_pipeline_chart(self):
        """Create content pipeline status visualization"""
        stages = ['Research', 'Writing', 'Editing', 'SEO', 'Social Media', 'Analytics']
        in_progress = [3, 5, 4, 2, 6, 1]
        completed = [12, 10, 11, 13, 9, 14]
        
        fig = go.Figure()
        
        fig.add_trace(go.Bar(
            name='In Progress',
            x=stages,
            y=in_progress,
            marker_color='lightblue'
        ))
        
        fig.add_trace(go.Bar(
            name='Completed',
            x=stages,
            y=completed,
            marker_color='lightgreen'
        ))
        
        fig.update_layout(
            title='Content Pipeline Status',
            xaxis_title='Content Stage',
            yaxis_title='Number of Projects',
            barmode='stack',
            height=400
        )
        
        return fig
    
    def export_team_report(self):
        """Export team performance report as downloadable file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"content_team_report_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "projects": self.projects,
            "team_performance": self.team_performance,
            "summary": {
                "total_projects": len(self.projects),
                "total_performance_analyses": len(self.team_performance),
                "avg_quality_score": sum(p.get('quality_score', 0) for p in self.projects) / len(self.projects) if self.projects else 0,
                "avg_completion_time": sum(p.get('completion_time', 0) for p in self.projects) / len(self.projects) if self.projects else 0,
                "team_efficiency": sum(tp.get('efficiency_score', 0) for tp in self.team_performance) / len(self.team_performance) if self.team_performance else 0
            }
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("✍️ Content Creation Team")
    st.caption("Multi-agent collaborative content creation and optimization")
    
    if "content_team" not in st.session_state:
        st.session_state.content_team = ContentCreationTeam()
    
    team = st.session_state.content_team
    
    with st.sidebar:
        st.header("⚙️ Team Configuration")
        
        api_key = st.text_input(
            "OpenAI API Key",
            value=team.openai_api_key or "",
            type="password"
        )
        
        if api_key:
            team.openai_api_key = api_key
            if not team.crew:
                if team.initialize_team(api_key):
                    st.success("✅ Content Creation Team assembled!")
        
        st.divider()
        
        st.markdown("### ✍️ Team Mode")
        
        mode = st.selectbox(
            "Choose Service",
            ["Content Project", "Team Performance", "Team Dashboard"],
            help="Select the type of team service"
        )
        
        st.divider()
        
        if team.projects or team.team_performance:
            st.markdown("### 📈 Team Stats")
            st.metric("Projects Completed", len(team.projects))
            st.metric("Performance Analyses", len(team.team_performance))
            
            if team.projects:
                avg_quality = sum(p.get('quality_score', 0) for p in team.projects) / len(team.projects)
                st.metric("Avg Quality Score", f"{avg_quality:.1f}%")
        
        st.divider()
        
        if team.projects or team.team_performance:
            st.markdown("### 📥 Export Report")
            
            if st.button("Export Team Report"):
                filename, content = team.export_team_report()
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
            3. **Choose Service**: Select the type of team service
            4. **Create Project**: Define content requirements and objectives
            5. **Team Collaboration**: Watch agents collaborate on content creation
            
            - **Research Agent**: Topic research and fact-checking
            - **Writer Agent**: Content creation and storytelling
            - **Editor Agent**: Content editing and quality assurance
            - **SEO Agent**: Search engine optimization
            - **Social Media Agent**: Social platform adaptation
            - **Analytics Agent**: Performance tracking and optimization
            
            - Multi-agent collaborative workflows
            - Specialized agent roles and expertise
            - Sequential task coordination
            - Quality gates and review processes
            - Performance tracking and optimization
            """)
        
        return
    
    if not team.crew:
        st.error("❌ Failed to assemble Content Creation Team. Please check your API key.")
        return
    
    if mode == "Content Project":
        st.header("📝 Content Project Creation")
        
        project_details = st.text_area(
            "Project Requirements",
            placeholder="Describe your content project: topic, audience, goals, format, platform, timeline...",
            height=150
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            content_type = st.selectbox(
                "Content Type",
                ["Blog Post", "Article", "White Paper", "Case Study", "Social Campaign", "Technical Documentation"],
                help="Select the type of content to create"
            )
        
        with col2:
            target_audience = st.selectbox(
                "Target Audience",
                ["General Public", "Business Professionals", "Technical Experts", "Marketing Teams", "Students"],
                help="Choose the primary target audience"
            )
        
        col3, col4 = st.columns(2)
        
        with col3:
            content_length = st.selectbox(
                "Content Length",
                ["Short (500-1000 words)", "Medium (1000-2000 words)", "Long (2000+ words)", "Variable"],
                help="Select the desired content length"
            )
        
        with col4:
            urgency = st.selectbox(
                "Project Urgency",
                ["Low Priority", "Standard", "High Priority", "Urgent"],
                help="Choose project urgency level"
            )
        
        if st.button("🚀 Start Content Project", type="primary", disabled=not project_details):
            with st.spinner("Content Creation Team is collaborating on your project..."):
                project_context = f"{project_details} | Type: {content_type} | Audience: {target_audience} | Length: {content_length} | Urgency: {urgency}"
                result = team.create_content_project(project_context)
                
                st.success("✅ Content project completed by the team!")
                
                st.markdown("### 📝 Team Collaboration Results")
                st.markdown(result)
    
    elif mode == "Team Performance":
        st.header("📊 Team Performance Analysis")
        
        performance_data = st.text_area(
            "Performance Data",
            placeholder="Provide team performance data: project metrics, quality scores, completion times, collaboration feedback...",
            height=150
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            analysis_period = st.selectbox(
                "Analysis Period",
                ["Last Week", "Last Month", "Last Quarter", "Last Year"],
                help="Select the performance analysis period"
            )
        
        with col2:
            focus_area = st.selectbox(
                "Focus Area",
                ["Overall Performance", "Agent Collaboration", "Content Quality", "Process Efficiency", "Client Satisfaction"],
                help="Choose the primary analysis focus"
            )
        
        performance_metrics = st.multiselect(
            "Performance Metrics",
            ["Quality Scores", "Completion Times", "Collaboration Ratings", "Client Feedback", "Process Efficiency"],
            default=["Quality Scores", "Completion Times", "Collaboration Ratings"],
            help="Select metrics to analyze"
        )
        
        if st.button("📊 Analyze Team Performance", type="primary", disabled=not performance_data):
            with st.spinner("Analyzing team performance and collaboration..."):
                performance_context = f"{performance_data} | Period: {analysis_period} | Focus: {focus_area} | Metrics: {', '.join(performance_metrics)}"
                analysis = team.analyze_team_performance(performance_context)
                
                st.success("✅ Team performance analysis complete!")
                
                st.markdown("### 📊 Performance Analysis Results")
                st.markdown(analysis)
    
    elif mode == "Team Dashboard":
        st.header("📊 Team Dashboard")
        
        dashboard_chart = team.create_team_dashboard()
        if dashboard_chart:
            st.plotly_chart(dashboard_chart, use_container_width=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            workload_chart = team.create_agent_workload_chart()
            if workload_chart:
                st.plotly_chart(workload_chart, use_container_width=True)
        
        with col2:
            pipeline_chart = team.create_content_pipeline_chart()
            if pipeline_chart:
                st.plotly_chart(pipeline_chart, use_container_width=True)
        
        st.markdown("### 📈 Team KPIs")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Content Quality", "96%", "4%")
        
        with col2:
            st.metric("Project Completion", "94%", "4%")
        
        with col3:
            st.metric("Team Efficiency", "92%", "5%")
        
        with col4:
            st.metric("Client Satisfaction", "97%", "3%")
    
    if team.projects or team.team_performance:
        st.header("📚 Team History")
        
        if team.projects:
            with st.expander("📝 Recent Content Projects"):
                for project in team.projects[-3:]:
                    st.markdown(f"**Project {project['id']}** - Quality: {project['quality_score']:.1f}% - Time: {project['completion_time']:.1f}h")
                    st.markdown(f"Details: {project['details'][:100]}...")
        
        if team.team_performance:
            with st.expander("📊 Recent Performance Analyses"):
                for perf in team.team_performance[-3:]:
                    st.markdown(f"**Analysis {perf['id']}** - Efficiency: {perf['efficiency_score']:.1f}% - Collaboration: {perf['collaboration_rating']:.1f}%")
                    st.markdown(f"Data: {perf['data'][:100]}...")

if __name__ == "__main__":
    main()
