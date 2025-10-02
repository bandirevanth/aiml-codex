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
import random
import numpy as np

load_dotenv()

st.set_page_config(
    page_title="Competitive Intelligence Platform",
    page_icon="🎯",
    layout="wide"
)

class CompetitiveIntelligencePlatform:
    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.llm = None
        self.embeddings = None
        self.vectorstore = None
        self.qa_chain = None
        self.competitor_analyses = []
        self.market_reports = []
        self.intelligence_alerts = []
        self.intelligence_stats = {}
        
    def initialize_system(self, api_key):
        try:
            self.llm = OpenAI(
                openai_api_key=api_key,
                temperature=0.1,
                model_name="gpt-3.5-turbo-instruct"
            )
            
            self.embeddings = OpenAIEmbeddings(
                openai_api_key=api_key,
                model="text-embedding-ada-002"
            )
            
            self.vectorstore = Chroma(
                embedding_function=self.embeddings,
                persist_directory="./competitive_intelligence_db"
            )
            
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(search_kwargs={"k": 4}),
                return_source_documents=True
            )
            
            self.initialize_sample_competitive_data()
            
            return True
        except Exception as e:
            st.error(f"Error initializing system: {str(e)}")
            return False
    
    def initialize_sample_competitive_data(self):
        """Initialize sample competitive intelligence data for demonstration"""
        sample_data = [
            {
                'competitor': 'TechCorp Inc.',
                'content': 'Leading technology company with strong market position in cloud services. Revenue: $2.5B, Market share: 15%, Growth rate: 12% YoY. Key strengths: Innovation, brand recognition, customer loyalty.',
                'industry': 'Technology',
                'market_position': 'Leader',
                'threat_level': 'High',
                'revenue': 2500000000,
                'market_share': 15.0
            },
            {
                'competitor': 'InnovateSoft Ltd.',
                'content': 'Emerging software company focusing on AI solutions. Revenue: $800M, Market share: 8%, Growth rate: 25% YoY. Key strengths: Agility, cutting-edge technology, competitive pricing.',
                'industry': 'Software',
                'market_position': 'Challenger',
                'threat_level': 'Medium',
                'revenue': 800000000,
                'market_share': 8.0
            },
            {
                'competitor': 'DataDynamics Corp.',
                'content': 'Data analytics specialist with strong enterprise presence. Revenue: $1.2B, Market share: 10%, Growth rate: 8% YoY. Key strengths: Domain expertise, enterprise relationships, data security.',
                'industry': 'Data Analytics',
                'market_position': 'Specialist',
                'threat_level': 'Medium',
                'revenue': 1200000000,
                'market_share': 10.0
            },
            {
                'competitor': 'CloudFirst Solutions',
                'content': 'Cloud infrastructure provider with global reach. Revenue: $3.1B, Market share: 18%, Growth rate: 15% YoY. Key strengths: Infrastructure scale, global presence, cost efficiency.',
                'industry': 'Cloud Services',
                'market_position': 'Leader',
                'threat_level': 'High',
                'revenue': 3100000000,
                'market_share': 18.0
            },
            {
                'competitor': 'StartupTech Ventures',
                'content': 'Innovative startup with disruptive technology. Revenue: $150M, Market share: 2%, Growth rate: 45% YoY. Key strengths: Innovation, agility, venture backing, emerging technology.',
                'industry': 'Technology',
                'market_position': 'Niche',
                'threat_level': 'Low',
                'revenue': 150000000,
                'market_share': 2.0
            }
        ]
        
        for data in sample_data:
            self.vectorstore.add_texts(
                texts=[data['content']],
                metadatas=[{
                    'competitor': data['competitor'],
                    'industry': data['industry'],
                    'market_position': data['market_position'],
                    'threat_level': data['threat_level'],
                    'revenue': str(data['revenue']),
                    'market_share': str(data['market_share'])
                }]
            )
    
    def analyze_competitor(self, competitor_data, analysis_type):
        """Analyze competitor with intelligent insights"""
        try:
            analysis_prompt = f"""
            Analyze the following competitor data:
            
            Competitor Data: {competitor_data}
            Analysis Type: {analysis_type}
            
            Please provide comprehensive competitive analysis including:
            
            1. COMPETITOR PROFILE ANALYSIS:
               - Company overview and business model assessment
               - Market position and competitive positioning
               - Financial performance and growth trajectory
               - Organizational structure and leadership analysis
            
            2. COMPETITIVE STRENGTHS AND WEAKNESSES:
               - Core competencies and competitive advantages
               - Market strengths and differentiation factors
               - Operational weaknesses and vulnerabilities
               - Strategic gaps and improvement opportunities
            
            3. MARKET STRATEGY EVALUATION:
               - Go-to-market strategy and approach
               - Product and service portfolio analysis
               - Pricing strategy and value proposition
               - Customer acquisition and retention strategies
            
            4. COMPETITIVE THREAT ASSESSMENT:
               - Direct and indirect competitive threats
               - Market disruption potential and innovation capacity
               - Competitive response capabilities and agility
               - Strategic threat level and impact evaluation
            
            5. PERFORMANCE BENCHMARKING:
               - Financial performance comparison and metrics
               - Market share and growth rate analysis
               - Operational efficiency and productivity metrics
               - Customer satisfaction and loyalty indicators
            
            6. STRATEGIC RECOMMENDATIONS:
               - Competitive response strategies and tactics
               - Defensive and offensive strategic options
               - Market positioning and differentiation opportunities
               - Competitive monitoring and intelligence priorities
            
            Provide actionable competitive intelligence insights and strategic recommendations.
            """
            
            competitor_analysis = self.llm(analysis_prompt)
            
            analysis_entry = {
                'id': len(self.competitor_analyses) + 1,
                'timestamp': datetime.now().isoformat(),
                'competitor_data': competitor_data,
                'analysis_type': analysis_type,
                'analysis': competitor_analysis,
                'threat_score': random.uniform(60, 95),
                'competitive_strength': random.uniform(70, 90),
                'market_impact': random.choice(['Low', 'Medium', 'High', 'Critical'])
            }
            
            self.competitor_analyses.append(analysis_entry)
            
            return analysis_entry
            
        except Exception as e:
            return f"Error analyzing competitor: {str(e)}"
    
    def generate_market_intelligence_report(self, market_context, report_scope):
        """Generate comprehensive market intelligence report"""
        try:
            report_prompt = f"""
            Generate market intelligence report for: {market_context}
            Report Scope: {report_scope}
            
            Please provide comprehensive market intelligence including:
            
            1. MARKET LANDSCAPE OVERVIEW:
               - Market size, growth, and dynamics analysis
               - Key market segments and customer demographics
               - Market trends and driving factors
               - Regulatory environment and compliance requirements
            
            2. COMPETITIVE LANDSCAPE ANALYSIS:
               - Major competitors and market leaders identification
               - Competitive positioning and market share analysis
               - Competitive strategies and differentiation approaches
               - New entrants and emerging competitive threats
            
            3. MARKET OPPORTUNITIES AND THREATS:
               - Growth opportunities and market gaps identification
               - Emerging market trends and technology disruptions
               - Competitive threats and market challenges
               - Strategic opportunities for market entry and expansion
            
            4. CUSTOMER AND DEMAND ANALYSIS:
               - Customer needs and preferences assessment
               - Demand patterns and purchasing behavior analysis
               - Customer satisfaction and loyalty evaluation
               - Market demand forecasting and projections
            
            5. TECHNOLOGY AND INNOVATION TRENDS:
               - Technology trends and innovation developments
               - Disruptive technologies and market impact
               - Innovation strategies and R&D investments
               - Technology adoption and market readiness
            
            6. STRATEGIC MARKET INSIGHTS:
               - Market entry and expansion strategies
               - Competitive positioning and differentiation recommendations
               - Partnership and alliance opportunities
               - Market timing and strategic priorities
            
            Provide actionable market intelligence with strategic insights and recommendations.
            """
            
            market_report = self.llm(report_prompt)
            
            report_entry = {
                'id': len(self.market_reports) + 1,
                'timestamp': datetime.now().isoformat(),
                'market_context': market_context,
                'report_scope': report_scope,
                'report': market_report,
                'market_attractiveness': random.uniform(70, 95),
                'competitive_intensity': random.uniform(60, 90)
            }
            
            self.market_reports.append(report_entry)
            
            return market_report
            
        except Exception as e:
            return f"Error generating market intelligence report: {str(e)}"
    
    def create_competitive_dashboard(self):
        """Create comprehensive competitive intelligence dashboard"""
        metrics = {
            'Competitors Monitored': [25, 28, 26, 32, 30, 35],
            'Threat Level (Avg)': [6.8, 7.2, 6.9, 7.5, 7.1, 7.8],
            'Market Share Tracked (%)': [85, 88, 86, 91, 89, 94],
            'Intelligence Alerts': [45, 52, 48, 58, 55, 62],
            'Analysis Accuracy (%)': [88, 91, 89, 94, 92, 96],
            'Strategic Value Score': [8.2, 8.5, 8.3, 8.8, 8.6, 9.1]
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
            title="Competitive Intelligence Platform Performance Dashboard",
            height=600
        )
        
        return fig
    
    def create_threat_level_chart(self):
        """Create competitive threat level distribution chart"""
        threat_levels = ['Low', 'Medium', 'High', 'Critical']
        competitor_counts = [8, 15, 10, 2]
        colors = ['green', 'yellow', 'orange', 'red']
        
        fig = go.Figure(data=[
            go.Bar(x=threat_levels, y=competitor_counts, marker_color=colors)
        ])
        
        fig.update_layout(
            title='Competitive Threat Level Distribution',
            xaxis_title='Threat Level',
            yaxis_title='Number of Competitors',
            height=400
        )
        
        return fig
    
    def create_market_share_chart(self):
        """Create market share analysis visualization"""
        companies = ['Our Company', 'TechCorp Inc.', 'CloudFirst Solutions', 'DataDynamics Corp.', 'InnovateSoft Ltd.', 'Others']
        market_shares = [20, 18, 15, 10, 8, 29]
        colors = ['blue', 'lightcoral', 'lightgreen', 'gold', 'plum', 'lightgray']
        
        fig = px.pie(
            values=market_shares,
            names=companies,
            title='Market Share Distribution (%)',
            color_discrete_sequence=colors
        )
        
        fig.update_layout(height=400)
        return fig
    
    def export_intelligence_report(self):
        """Export competitive intelligence report as downloadable file"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"competitive_intelligence_report_{timestamp}.json"
        
        export_data = {
            "generated_at": datetime.now().isoformat(),
            "competitor_analyses": self.competitor_analyses,
            "market_reports": self.market_reports,
            "intelligence_alerts": self.intelligence_alerts,
            "intelligence_stats": self.intelligence_stats,
            "summary": {
                "total_analyses": len(self.competitor_analyses),
                "total_reports": len(self.market_reports),
                "avg_threat_score": sum(a.get('threat_score', 0) for a in self.competitor_analyses) / len(self.competitor_analyses) if self.competitor_analyses else 0,
                "avg_competitive_strength": sum(a.get('competitive_strength', 0) for a in self.competitor_analyses) / len(self.competitor_analyses) if self.competitor_analyses else 0,
                "avg_market_attractiveness": sum(r.get('market_attractiveness', 0) for r in self.market_reports) / len(self.market_reports) if self.market_reports else 0
            }
        }
        
        return filename, json.dumps(export_data, indent=2)

def main():
    st.title("🎯 Competitive Intelligence Platform")
    st.caption("AI-powered competitive analysis and market intelligence")
    
    if "competitive_intelligence" not in st.session_state:
        st.session_state.competitive_intelligence = CompetitiveIntelligencePlatform()
    
    intelligence_system = st.session_state.competitive_intelligence
    
    with st.sidebar:
        st.header("⚙️ System Configuration")
        
        api_key = st.text_input(
            "OpenAI API Key",
            value=intelligence_system.openai_api_key or "",
            type="password"
        )
        
        if api_key:
            intelligence_system.openai_api_key = api_key
            if not intelligence_system.llm:
                if intelligence_system.initialize_system(api_key):
                    st.success("✅ Competitive Intelligence Platform initialized!")
        
        st.divider()
        
        st.markdown("### 🎯 Intelligence Mode")
        
        mode = st.selectbox(
            "Choose Service",
            ["Competitor Analysis", "Market Intelligence", "Intelligence Dashboard"],
            help="Select the type of competitive intelligence service"
        )
        
        st.divider()
        
        if intelligence_system.competitor_analyses or intelligence_system.market_reports:
            st.markdown("### 📈 System Stats")
            st.metric("Competitor Analyses", len(intelligence_system.competitor_analyses))
            st.metric("Market Reports", len(intelligence_system.market_reports))
            
            if intelligence_system.competitor_analyses:
                avg_threat = sum(a.get('threat_score', 0) for a in intelligence_system.competitor_analyses) / len(intelligence_system.competitor_analyses)
                st.metric("Avg Threat Score", f"{avg_threat:.1f}%")
        
        st.divider()
        
        if intelligence_system.competitor_analyses or intelligence_system.market_reports:
            st.markdown("### 📥 Export Report")
            
            if st.button("Export Intelligence Report"):
                filename, content = intelligence_system.export_intelligence_report()
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
            3. **Analyze Competitors**: Evaluate competitive landscape and threats
            4. **Generate Intelligence**: Create comprehensive market intelligence reports
            5. **Monitor Performance**: Track competitive intelligence metrics and insights
            
            - **Competitor Analysis**: Comprehensive competitor profiling and analysis
            - **Market Intelligence**: Market trends and dynamics analysis
            - **Strategic Insights**: Strategic positioning and opportunity identification
            - **Threat Assessment**: Competitive threat evaluation and monitoring
            - **Performance Benchmarking**: Competitive performance comparison and analysis
            
            - Strategic planning corporate strategic planning and competitive positioning
            - Market research market intelligence and competitive landscape analysis
            - Product management product competitive analysis and positioning
            - Sales intelligence sales competitive intelligence and opportunity identification
            - Business development market opportunity assessment and competitive analysis
            """)
        
        return
    
    if not intelligence_system.llm:
        st.error("❌ Failed to initialize Competitive Intelligence Platform. Please check your API key.")
        return
    
    if mode == "Competitor Analysis":
        st.header("🎯 Competitor Analysis")
        
        competitor_data = st.text_area(
            "Competitor Data",
            placeholder="Enter competitor information: company details, market position, financial data, strategies...",
            height=200,
            help="Enter competitor data for analysis"
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            analysis_type = st.selectbox(
                "Analysis Type",
                ["Comprehensive Analysis", "Threat Assessment", "Strategic Analysis", "Financial Analysis", "Market Position Analysis"],
                help="Select the type of competitor analysis"
            )
        
        with col2:
            competitor_category = st.selectbox(
                "Competitor Category",
                ["Direct Competitor", "Indirect Competitor", "Potential Entrant", "Substitute Provider", "All Categories"],
                help="Choose the competitor category"
            )
        
        if st.button("🎯 Analyze Competitor", type="primary", disabled=not competitor_data):
            with st.spinner("Analyzing competitor data..."):
                result = intelligence_system.analyze_competitor(competitor_data, analysis_type)
                
                if isinstance(result, dict):
                    st.success("✅ Competitor analysis complete!")
                    
                    st.markdown("### 💡 Competitor Analysis")
                    st.markdown(result['analysis'])
                    
                    col1, col2, col3 = st.columns(3)
                    
                    with col1:
                        st.metric("Threat Score", f"{result['threat_score']:.1f}%")
                    
                    with col2:
                        st.metric("Competitive Strength", f"{result['competitive_strength']:.1f}%")
                    
                    with col3:
                        st.metric("Market Impact", result['market_impact'])
                else:
                    st.error(result)
    
    elif mode == "Market Intelligence":
        st.header("📊 Market Intelligence Report")
        
        market_context = st.text_area(
            "Market Context",
            placeholder="Describe market intelligence requirements: industry, market segment, geographic scope, analysis objectives...",
            height=150,
            help="Provide context for market intelligence analysis"
        )
        
        col1, col2 = st.columns(2)
        
        with col1:
            report_scope = st.selectbox(
                "Report Scope",
                ["Market Overview", "Competitive Landscape", "Market Opportunities", "Threat Analysis", "Comprehensive Report"],
                help="Select the market intelligence report scope"
            )
        
        with col2:
            time_horizon = st.selectbox(
                "Time Horizon",
                ["Current State", "6 Month Outlook", "1 Year Forecast", "3 Year Strategic"],
                help="Choose the analysis time horizon"
            )
        
        if st.button("📊 Generate Intelligence Report", type="primary", disabled=not market_context):
            with st.spinner("Generating comprehensive market intelligence report..."):
                context = f"{market_context} | Time Horizon: {time_horizon}"
                report = intelligence_system.generate_market_intelligence_report(context, report_scope)
                
                st.success("✅ Market intelligence report generated!")
                
                st.markdown("### 📊 Market Intelligence Report")
                st.markdown(report)
    
    elif mode == "Intelligence Dashboard":
        st.header("📊 Intelligence Dashboard")
        
        dashboard_chart = intelligence_system.create_competitive_dashboard()
        if dashboard_chart:
            st.plotly_chart(dashboard_chart, use_container_width=True)
        
        col1, col2 = st.columns(2)
        
        with col1:
            threat_chart = intelligence_system.create_threat_level_chart()
            if threat_chart:
                st.plotly_chart(threat_chart, use_container_width=True)
        
        with col2:
            market_share_chart = intelligence_system.create_market_share_chart()
            if market_share_chart:
                st.plotly_chart(market_share_chart, use_container_width=True)
        
        st.markdown("### 📈 Intelligence KPIs")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Competitors Monitored", "35", "5")
        
        with col2:
            st.metric("Threat Level", "7.8/10", "0.7")
        
        with col3:
            st.metric("Market Coverage", "94%", "5%")
        
        with col4:
            st.metric("Strategic Value", "9.1/10", "0.5")
    
    if intelligence_system.competitor_analyses:
        st.header("📚 Intelligence History")
        
        with st.expander("🎯 Recent Competitor Analyses"):
            for analysis in intelligence_system.competitor_analyses[-5:]:
                st.markdown(f"**Analysis {analysis['id']}:** {analysis['analysis_type']} - Threat: {analysis['threat_score']:.1f}% - Impact: {analysis['market_impact']}")
                st.markdown(f"Data: {analysis['competitor_data'][:100]}...")

if __name__ == "__main__":
    main()
