import React from 'react';
import { CheckCircle, Clock, Users, FileText, Search, Edit, Eye } from 'lucide-react';
import { AgentState } from '../types';
import { BLOG_WRITING_AGENTS, AGENT_DESCRIPTIONS, PROCESSING_STAGES } from '../constants';

interface BlogWriterProgressProps {
  agentState: AgentState;
}

const BlogWriterProgress: React.FC<BlogWriterProgressProps> = ({ agentState }) => {
  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case 'Video Analyzer': return Eye;
      case 'Content Planner': return FileText;
      case 'Researcher': return Search;
      case 'Writer': return Edit;
      case 'Editor': return CheckCircle;
      default: return Clock;
    }
  };

  const getAgentStatus = (agentName: string) => {
    const agentKey = agentName.toLowerCase().replace(' ', '') as keyof typeof agentState.agentProgress;
    if (agentState.agentProgress[agentKey]) return 'completed';
    if (agentState.currentAgent === agentName) return 'active';
    return 'pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-gray-400 bg-gray-100';
      default: return 'text-gray-400 bg-gray-100';
    }
  };

  const currentStageIndex = BLOG_WRITING_AGENTS.indexOf(agentState.currentAgent);
  const currentStage = PROCESSING_STAGES[currentStageIndex] || 'Processing...';

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Creating Your Blog Post</h1>
        <p className="text-lg text-gray-600">
          Our AI agents are collaborating to transform your video into an engaging blog post
        </p>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Overall Progress</h2>
          <span className="text-lg font-medium text-blue-600">{Math.round(agentState.progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${agentState.progress}%` }}
          />
        </div>
        
        <p className="text-gray-600 text-center">{currentStage}</p>
      </div>

      {/* Agent Progress */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Collaboration</h2>
        
        <div className="space-y-6">
          {BLOG_WRITING_AGENTS.map((agentName, index) => {
            const IconComponent = getAgentIcon(agentName);
            const status = getAgentStatus(agentName);
            const isActive = agentState.currentAgent === agentName;
            
            return (
              <div key={agentName} className="flex items-start space-x-4">
                {/* Agent Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(status)}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                
                {/* Agent Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-lg font-medium ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                      {agentName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {status === 'completed' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {status === 'active' && (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mt-1">
                    {AGENT_DESCRIPTIONS[agentName as keyof typeof AGENT_DESCRIPTIONS]}
                  </p>
                  
                  {isActive && (
                    <div className="mt-3">
                      <div className="w-full bg-blue-100 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connection Line */}
                {index < BLOG_WRITING_AGENTS.length - 1 && (
                  <div className="absolute left-6 mt-12 w-0.5 h-6 bg-gray-200" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Error Display */}
      {agentState.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-900">Processing Error</h3>
              <p className="text-red-700 mt-1">{agentState.error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Agent Workflow Explanation */}
      <div className="bg-gray-50 rounded-xl p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Our Agents Work Together</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Video Analysis</span>
            </div>
            <p className="text-sm text-gray-600">
              Analyzes video content, extracts key topics, and identifies main themes for blog creation.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="font-medium">Content Planning</span>
            </div>
            <p className="text-sm text-gray-600">
              Creates structured outline and content strategy based on video analysis and target audience.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Search className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Research</span>
            </div>
            <p className="text-sm text-gray-600">
              Gathers additional context, background information, and supporting data for comprehensive content.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Edit className="w-5 h-5 text-orange-600" />
              <span className="font-medium">Writing</span>
            </div>
            <p className="text-sm text-gray-600">
              Crafts engaging blog post content following the outline and incorporating research findings.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium">Editing</span>
            </div>
            <p className="text-sm text-gray-600">
              Reviews, refines, and optimizes the final blog post for quality, SEO, and readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogWriterProgress;
