# Corrective Video RAG

Advanced video analysis with corrective retrieval strategies that automatically detects content relevance and applies appropriate correction methods based on three-tier evaluation thresholds.

## Features

- **Three-Tier Evaluation System**: Upper/lower thresholds for automatic correction strategy selection
- **Corrective Actions**: Correct (use video), Incorrect (web search), Ambiguous (hybrid approach)
- **Multi-Modal Analysis**: Evaluation across visual, audio, and transcript modalities
- **Adaptive Strategies**: Dynamic source selection based on relevance evaluation
- **Quality Metrics**: Comprehensive quality assessment and recommendations
- **Source Attribution**: Clear attribution of information sources

## Correction Strategies

1. **Correct Strategy**: High relevance detected - use video content directly
2. **Incorrect Strategy**: Low relevance detected - search external sources  
3. **Ambiguous Strategy**: Moderate relevance - combine video and web sources

## Configuration Options

- **Evaluation Thresholds**: Configurable lower (0.1-0.5) and upper (0.6-0.9) thresholds
- **Evaluation Modes**: Strict, Balanced, or Lenient evaluation approaches
- **Modality Weights**: Adjustable weights for visual, audio, and transcript content
- **Correction Features**: Enable/disable web search, segment combination, context expansion

## Usage

1. Upload a video file (MP4, MOV, AVI, WebM, MKV)
2. Enter your query about the video content
3. Configure query intent (factual, analytical, comparative, procedural)
4. Adjust evaluation thresholds and modality weights
5. Enable desired correction strategies
6. Click "Analyze with Corrective RAG" to start processing

## Technical Implementation

- **CRAG Architecture**: Implements Corrective Retrieval Augmented Generation patterns
- **Relevance Evaluation**: LLM-based scoring of content-query relevance
- **Dynamic Correction**: Automatic strategy selection based on evaluation scores
- **Multi-Source Integration**: Seamless combination of video and web knowledge
- **Quality Assessment**: Real-time quality metrics and performance tracking

## Environment Setup

Create a `.env` file with your Google API key:

```
VITE_GOOGLE_API_KEY=your_google_api_key_here
```

## Development

```bash
npm install
npm run dev
```

## Based On

This application is inspired by the CRAG (Corrective Retrieval Augmented Generation) technique, adapted for video content analysis with unique multi-modal correction strategies and three-tier evaluation system.
