# Blog Video Writer

An AI-powered multi-agent system that transforms video content into engaging blog posts using collaborative AI agents.

## Features

- **Multi-Agent Collaboration**: Five specialized AI agents work together to create high-quality blog posts
- **Video Analysis**: Advanced video content analysis and topic extraction
- **Content Planning**: Structured outline creation based on target audience and style
- **Research Integration**: Background research and context gathering
- **Professional Writing**: AI-powered blog post creation with proper structure
- **Editorial Review**: Quality assurance and SEO optimization

## Agents

1. **Video Analyzer**: Analyzes video content and extracts key information
2. **Content Planner**: Creates structured outlines and content strategy
3. **Researcher**: Gathers supporting information and context
4. **Writer**: Crafts engaging blog post content
5. **Editor**: Reviews, refines, and optimizes the final output

## Configuration Options

- **Target Audience**: General, Technical, Academic, Business
- **Blog Style**: Informative, Narrative, Analytical, Tutorial
- **Content Depth**: Basic, Intermediate, Advanced
- **Word Count**: Short (500-800), Medium (800-1500), Long (1500+)
- **Advanced Options**: Transcript inclusion, technical details, call-to-action

## Technology Stack

- React 18 with TypeScript
- Google Gemini AI for video analysis and content generation
- Tailwind CSS for styling
- Vite for development and building

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Google API key in `.env`
4. Start the development server: `npm run dev`

## Usage

1. Upload a video file (MP4, WebM, AVI)
2. Configure your blog preferences
3. Watch as AI agents collaborate to create your blog post
4. Download or copy the final blog post

## Architecture

Based on OpenAI Swarm multi-agent pattern with sequential agent collaboration:
- Linear workflow with agent handoffs
- Context preservation across agents
- Specialized role-based processing
- Quality assurance through editorial review

## License

MIT License
