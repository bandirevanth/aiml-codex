# Hedra Live Avatars Demo - Setup Instructions

## Overview
This demo showcases Hedra's Live Avatars API with both real-time avatar chat and video generation capabilities.

## Features
- **Live Avatar Chat**: Real-time interactive conversations with AI avatars
- **Video Generation**: Create avatar videos from text prompts
- **Custom Avatar Images**: Upload your own images to personalize avatars
- **Tabbed Interface**: Easy switching between live chat and video generation

## Prerequisites
- Node.js (v18 or higher)
- Python 3.8+
- Poetry (for Python dependency management)
- Hedra API Key

## Setup Instructions

### 1. Extract the Project
```bash
unzip hedra-live-avatars-demo.zip
cd hedra-live-avatars-demo
```

### 2. Backend Setup
```bash
cd hedra-avatar-backend

# Install dependencies
poetry install

# Configure environment
# Edit .env file and add your Hedra API key:
# HEDRA_API_KEY=your_hedra_api_key_here
# LIVEKIT_URL=wss://***********.livekit.cloud
# LIVEKIT_API_KEY=
# LIVEKIT_API_SECRET=********

# Start the backend server
poetry run fastapi dev app/main.py --port 8000
```

### 3. Frontend Setup (in a new terminal)
```bash
cd hedra-avatar-frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- Open your browser and navigate to: `http://localhost:5173`
- The backend API will be running on: `http://localhost:8000`

## Usage Guide

### Live Avatar Chat
1. Click on the "Live Avatar Chat" tab
2. Create a new avatar session
3. Upload an avatar image (PNG/JPG)
4. Start chatting with your avatar in real-time

### Video Generation
1. Click on the "Video Generation" tab
2. Ensure you have an avatar session with an uploaded image
3. Enter a text prompt describing what you want your avatar to say
4. Click "Generate Video" and wait for processing
5. View the generated video once complete

## API Integration
- The demo uses Hedra's API endpoints for avatar creation and video generation
- Credits will be consumed from your Hedra account when generating videos
- All API calls are logged in the backend console for debugging

## Troubleshooting

### Backend Issues
- Ensure your Hedra API key is correctly set in the `.env` file
- Check the backend console for API error messages
- Verify you have sufficient credits in your Hedra account

### Frontend Issues
- Make sure the backend is running on port 8000
- Check browser console for any JavaScript errors
- Ensure all dependencies are installed with `npm install`

### API Integration
- Video generation requires both an image and audio input
- The demo automatically creates silent audio files as required by Hedra's API
- Monitor the backend logs to see API request/response details

## File Structure
```
hedra-live-avatars-demo/
├── hedra-avatar-backend/     # FastAPI backend
│   ├── app/
│   │   └── main.py          # Main backend application
│   ├── .env                 # Environment variables (add your API key here)
│   └── pyproject.toml       # Python dependencies
└── hedra-avatar-frontend/    # React frontend
    ├── src/
    │   └── App.tsx          # Main frontend application
    ├── package.json         # Node.js dependencies
    └── .env                 # Frontend environment variables
```

## Support
- Check the backend console logs for detailed error messages
- Ensure your Hedra API key has sufficient credits
- Verify network connectivity to Hedra's API endpoints

## Notes
- The demo is configured for local development only
- Both servers need to be running simultaneously
- The frontend automatically connects to the backend on localhost:8000
