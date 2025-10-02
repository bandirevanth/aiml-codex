import os
import uuid
import asyncio
import logging
from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from PIL import Image
import io
import wave
import numpy as np
from gtts import gTTS
import tempfile
from dotenv import load_dotenv
from elevenlabs import ElevenLabs

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Hedra Avatar API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
HEDRA_API_BASE = "https://api.hedra.com/web-app/public"
HEDRA_API_KEY = os.getenv("HEDRA_API_KEY")
ELEVENLABS_API_KEY = "sk_ef8d62e320691f36097e9bf922c25c572fd20c1d0c853dc2"

if not HEDRA_API_KEY:
    logger.error("HEDRA_API_KEY environment variable is not set")
    raise ValueError("HEDRA_API_KEY is required")

# Initialize ElevenLabs client
elevenlabs_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# In-memory storage
avatar_sessions: Dict[str, Dict[str, Any]] = {}
video_generations: Dict[str, Dict[str, Any]] = {}

# Pydantic models
class AvatarSession(BaseModel):
    avatar_name: str
    voice_provider: str = "elevenlabs"

class VideoGeneration(BaseModel):
    session_id: str
    text_prompt: str
    duration: Optional[float] = None
    voice_id: Optional[str] = None
    voice_provider: Optional[str] = "elevenlabs"

class ChatMessage(BaseModel):
    session_id: str
    message: str

# Helper functions
async def get_elevenlabs_voices():
    """Get available voices from ElevenLabs API"""
    try:
        logger.info("🎤 Fetching ElevenLabs voices...")
        response = elevenlabs_client.voices.search()
        
        elevenlabs_voices = []
        for voice in response.voices:
            # Add companion-friendly descriptions
            gender = "female" if "female" in voice.labels.get("gender", "").lower() else "male" if "male" in voice.labels.get("gender", "").lower() else "neutral"
            
            # Create companion-friendly names
            companion_type = "💕 Girlfriend" if gender == "female" else "🤵 Boyfriend" if gender == "male" else "👤 Companion"
            
            elevenlabs_voices.append({
                "id": voice.voice_id,
                "name": f"{voice.name} - {companion_type}",
                "gender": gender,
                "language": "en",
                "accent": voice.labels.get("accent", "american"),
                "description": voice.labels.get("description", "Premium AI voice"),
                "use_case": voice.labels.get("use_case", "companion"),
                "original_name": voice.name
            })
        
        logger.info(f"✅ Loaded {len(elevenlabs_voices)} ElevenLabs voices")
        return elevenlabs_voices
        
    except Exception as e:
        logger.error(f"❌ Error fetching ElevenLabs voices: {str(e)}")
        # Return some default voices if API fails
        return [
            {"id": "21m00Tcm4TlvDq8ikWAM", "name": "Rachel - 💕 Girlfriend", "gender": "female", "language": "en", "accent": "american"},
            {"id": "AZnzlk1XvdvUeBnXmlld", "name": "Domi - 💕 Girlfriend", "gender": "female", "language": "en", "accent": "american"},
            {"id": "EXAVITQu4vr4xnSDxMaL", "name": "Bella - 💕 Girlfriend", "gender": "female", "language": "en", "accent": "american"},
            {"id": "ErXwobaYiN019PkySvjV", "name": "Antoni - 🤵 Boyfriend", "gender": "male", "language": "en", "accent": "american"},
            {"id": "VR6AewLTigWG4xSOukaG", "name": "Arnold - 🤵 Boyfriend", "gender": "male", "language": "en", "accent": "american"},
        ]

def get_gtts_voices():
    """Get available gTTS voices"""
    return [
        {"id": "en-us", "name": "English (US) - Standard Female", "language": "en", "tld": "com"},
        {"id": "en-uk", "name": "English (UK) - Standard Female", "language": "en", "tld": "co.uk"},
        {"id": "en-au", "name": "English (Australia) - Standard Female", "language": "en", "tld": "com.au"},
        {"id": "en-ca", "name": "English (Canada) - Standard Female", "language": "en", "tld": "ca"},
        {"id": "fr-fr", "name": "French (France) - Standard Female", "language": "fr", "tld": "fr"},
        {"id": "es-es", "name": "Spanish (Spain) - Standard Female", "language": "es", "tld": "es"},
        {"id": "de-de", "name": "German - Standard Female", "language": "de", "tld": "de"},
        {"id": "it-it", "name": "Italian - Standard Female", "language": "it", "tld": "it"},
        {"id": "pt-br", "name": "Portuguese (Brazil) - Standard Female", "language": "pt", "tld": "com.br"},
        {"id": "ja-jp", "name": "Japanese - Standard Female", "language": "ja", "tld": "co.jp"},
        {"id": "ko-kr", "name": "Korean - Standard Female", "language": "ko", "tld": "co.kr"},
        {"id": "zh-cn", "name": "Chinese (Mandarin) - Standard Female", "language": "zh", "tld": "cn"},
    ]

def create_audio_from_text_elevenlabs(text: str, voice_id: str) -> bytes:
    """Create audio from text using ElevenLabs API"""
    try:
        logger.info(f"🎤 Creating ElevenLabs audio: '{text[:50]}...' with voice: {voice_id}")
        
        # Generate audio using ElevenLabs new API
        audio = elevenlabs_client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2",  # High quality model
            output_format="mp3_44100_128"
        )
        
        # Convert audio response to bytes
        audio_data = b"".join(audio)
        
        logger.info(f"✅ ElevenLabs audio created: {len(audio_data)} bytes")
        return audio_data
        
    except Exception as e:
        logger.error(f"❌ ElevenLabs audio generation failed: {str(e)}")
        # Fallback to silent audio
        logger.info("🔄 Falling back to silent audio...")
        return create_silent_audio(duration=len(text.split()) * 0.5)

def create_audio_from_text_gtts(text: str, voice_id: Optional[str] = None) -> bytes:
    """Create audio from text using Google TTS"""
    try:
        logger.info(f"🎵 Creating gTTS audio: '{text[:50]}...' with voice: {voice_id}")
        
        # Parse voice_id to extract language and tld
        voice_info = next((v for v in get_gtts_voices() if v["id"] == voice_id), None)
        if voice_info:
            tts = gTTS(text=text, lang=voice_info["language"], tld=voice_info["tld"], slow=False)
        else:
            # Default to English US
            tts = gTTS(text=text, lang='en', tld='com', slow=False)
        
        # Create temporary file for MP3
        with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_mp3:
            tts.save(temp_mp3.name)
        
        # Read the MP3 file
        with open(temp_mp3.name, 'rb') as f:
            audio_data = f.read()
        
        # Clean up temp file
        os.unlink(temp_mp3.name)
        
        logger.info(f"✅ gTTS audio created: {len(audio_data)} bytes")
        return audio_data
        
    except Exception as e:
        logger.error(f"❌ gTTS audio generation failed: {str(e)}")
        return create_silent_audio(duration=len(text.split()) * 0.5)

def create_audio_from_text(text: str, voice_id: Optional[str] = None, voice_provider: str = "elevenlabs") -> bytes:
    """Create audio from text using specified voice provider"""
    try:
        if voice_provider == "elevenlabs" and voice_id:
            return create_audio_from_text_elevenlabs(text, voice_id)
        elif voice_provider == "gtts":
            return create_audio_from_text_gtts(text, voice_id)
        else:
            # Default fallback
            logger.info(f"🔄 Unknown provider {voice_provider}, falling back to silent audio")
            return create_silent_audio(duration=len(text.split()) * 0.5)
        
    except Exception as e:
        logger.error(f"❌ Audio generation failed: {str(e)}")
        return create_silent_audio(duration=len(text.split()) * 0.5)

def create_silent_audio(duration: float = 3.0) -> bytes:
    """Create silent audio file"""
    sample_rate = 44100
    samples = int(sample_rate * duration)
    audio_data = np.zeros(samples, dtype=np.int16)
    
    # Create WAV file in memory
    buffer = io.BytesIO()
    with wave.open(buffer, 'wb') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(sample_rate)
        wav_file.writeframes(audio_data.tobytes())
    
    return buffer.getvalue()

# API Routes
@app.get("/")
async def root():
    return {
        "message": "AI Companion Studio API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "voices": "/voices",
            "create_session": "/avatar/session",
            "upload_image": "/avatar/upload-image/{session_id}",
            "start_session": "/avatar/start-session/{session_id}",
            "generate_video": "/video/generate",
            "get_video_status": "/video/status/{generation_id}",
            "list_generations": "/video/generations"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "hedra_api_configured": bool(HEDRA_API_KEY),
        "elevenlabs_api_configured": bool(ELEVENLABS_API_KEY)
    }

@app.get("/voices")
async def get_available_voices():
    """Get all available voice options"""
    try:
        elevenlabs_voices = await get_elevenlabs_voices()
        gtts_voices = get_gtts_voices()
        
        return {
            "hedra_voices": elevenlabs_voices,  # For backward compatibility with frontend
            "elevenlabs_voices": elevenlabs_voices,
            "gtts_voices": gtts_voices,
            "total_hedra": len(elevenlabs_voices),
            "total_elevenlabs": len(elevenlabs_voices),
            "total_gtts": len(gtts_voices)
        }
    except Exception as e:
        logger.error(f"❌ Error fetching voices: {str(e)}")
        return {
            "hedra_voices": [],
            "elevenlabs_voices": [],
            "gtts_voices": get_gtts_voices(),
            "total_hedra": 0,
            "total_elevenlabs": 0,
            "total_gtts": len(get_gtts_voices()),
            "error": "Failed to fetch ElevenLabs voices"
        }

@app.post("/avatar/session")
async def create_avatar_session(session: AvatarSession):
    """Create a new avatar session"""
    try:
        session_id = str(uuid.uuid4())
        avatar_sessions[session_id] = {
            "session_id": session_id,
            "avatar_name": session.avatar_name,
            "voice_provider": session.voice_provider,
            "status": "created",
            "image_uploaded": False,
            "created_at": asyncio.get_event_loop().time()
        }
        
        logger.info(f"💕 Created companion session: {session_id} ({session.avatar_name})")
        return {
            "session_id": session_id,
            "status": "created",
            "message": "Companion session created successfully"
        }
    except Exception as e:
        logger.error(f"❌ Error creating session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@app.post("/avatar/upload-image/{session_id}")
async def upload_avatar_image(session_id: str, file: UploadFile = File(...)):
    """Upload avatar image for a session"""
    try:
        if session_id not in avatar_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Read and process the image
        image_data = await file.read()
        image = Image.open(io.BytesIO(image_data))
        
        logger.info(f"📷 Uploading companion photo for {session_id}: {file.filename}")
        logger.info(f"📊 Image data: {len(image_data)} bytes, mode={image.mode}, size={image.size}")
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
            logger.info("🎨 Converted image to RGB mode")
        
        # Resize to 512x512 for optimal processing
        image = image.resize((512, 512), Image.Resampling.LANCZOS)
        logger.info("📐 Resized image to 512x512")
        
        # Save processed image
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG', quality=95)
        processed_image_data = buffer.getvalue()
        
        # Store in session
        avatar_sessions[session_id]["image_data"] = processed_image_data
        avatar_sessions[session_id]["image_uploaded"] = True
        avatar_sessions[session_id]["original_filename"] = file.filename
        avatar_sessions[session_id]["status"] = "image_uploaded"
        
        logger.info(f"✅ Companion photo uploaded successfully for {session_id}")
        return {
            "session_id": session_id,
            "status": "image_uploaded",
            "message": "Companion photo uploaded successfully",
            "image_size": len(processed_image_data)
        }
    except Exception as e:
        logger.error(f"❌ Error uploading image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

@app.post("/avatar/start-session/{session_id}")
async def start_avatar_session(session_id: str):
    """Start the avatar session"""
    try:
        if session_id not in avatar_sessions:
            raise HTTPException(status_code=404, detail="Session not found")
        
        session = avatar_sessions[session_id]
        
        if not session["image_uploaded"]:
            raise HTTPException(status_code=400, detail="Companion photo not uploaded")
        
        # Update session status
        avatar_sessions[session_id]["status"] = "active"
        
        logger.info(f"💕 Activated companion session: {session_id}")
        return {
            "session_id": session_id,
            "status": "active",
            "message": "Your AI companion is now active and ready to create personal videos!"
        }
        
    except Exception as e:
        logger.error(f"❌ Error starting session: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to start session: {str(e)}")

@app.get("/debug/sessions")
async def debug_sessions():
    """Debug endpoint to see all current sessions"""
    return {
        "total_sessions": len(avatar_sessions),
        "sessions": {
            session_id: {
                "status": session.get("status"),
                "avatar_name": session.get("avatar_name"),
                "image_uploaded": session.get("image_uploaded"),
                "created_at": session.get("created_at")
            }
            for session_id, session in avatar_sessions.items()
        }
    }

@app.post("/video/generate")
async def generate_video(video_request: VideoGeneration):
    """Generate a video using Hedra API with ElevenLabs voices"""
    try:
        logger.info(f"🎬 Starting companion video generation for: {video_request.session_id}")
        logger.info(f"💬 Message: '{video_request.text_prompt[:100]}...'")
        logger.info(f"🎤 Voice: {video_request.voice_id} ({video_request.voice_provider})")
        
        # Check if session exists
        if video_request.session_id not in avatar_sessions:
            logger.error(f"❌ Companion session not found: {video_request.session_id}")
            raise HTTPException(status_code=404, detail="Companion session not found")
        
        session = avatar_sessions[video_request.session_id]
        
        # Check if session is active
        if session.get("status") != "active":
            logger.error(f"❌ Companion not active: {session.get('status')}")
            raise HTTPException(status_code=400, detail="Your AI companion is not active. Please complete setup first.")
        
        # Check if image is uploaded
        if not session.get("image_uploaded"):
            logger.error(f"❌ No companion photo uploaded for: {video_request.session_id}")
            raise HTTPException(status_code=400, detail="No companion photo uploaded")
        
        logger.info(f"🎵 Creating audio with {video_request.voice_provider}...")
        
        # Create audio from text
        try:
            audio_data = create_audio_from_text(
                video_request.text_prompt, 
                video_request.voice_id, 
                video_request.voice_provider or "elevenlabs"
            )
            logger.info(f"✅ Audio created: {len(audio_data)} bytes")
        except Exception as audio_error:
            logger.error(f"❌ Failed to create audio: {str(audio_error)}")
            raise HTTPException(status_code=500, detail=f"Failed to create audio: {str(audio_error)}")
        
        headers = {
            "X-API-Key": HEDRA_API_KEY
        }
        
        logger.info("🔄 Starting Hedra API integration...")
        
        async with httpx.AsyncClient() as client:
            try:
                # Upload image to Hedra
                logger.info("📤 Uploading companion photo to Hedra...")
                image_response = await client.post(
                    f"{HEDRA_API_BASE}/assets",
                    json={"name": f"companion_{video_request.session_id}.jpg", "type": "image"},
                    headers=headers,
                    timeout=30.0
                )
                
                if image_response.status_code != 200:
                    logger.error(f"❌ Failed to create image asset: {image_response.status_code}")
                    raise HTTPException(status_code=image_response.status_code, 
                                      detail=f"Failed to create image asset: {image_response.text}")
                
                image_id = image_response.json()["id"]
                logger.info(f"✅ Image asset created: {image_id}")
                
                # Upload image data
                logger.info("📤 Uploading image data...")
                image_upload_response = await client.post(
                    f"{HEDRA_API_BASE}/assets/{image_id}/upload",
                    files={"file": session["image_data"]},
                    headers=headers,
                    timeout=30.0
                )
                
                if image_upload_response.status_code != 200:
                    logger.error(f"❌ Failed to upload image: {image_upload_response.status_code}")
                    raise HTTPException(status_code=image_upload_response.status_code,
                                      detail=f"Failed to upload image: {image_upload_response.text}")
                
                logger.info("✅ Companion photo uploaded to Hedra")
                
                # Upload audio to Hedra
                logger.info("📤 Uploading companion audio...")
                audio_response = await client.post(
                    f"{HEDRA_API_BASE}/assets",
                    json={"name": f"companion_audio_{video_request.session_id}.mp3", "type": "audio"},
                    headers=headers,
                    timeout=30.0
                )
                
                if audio_response.status_code != 200:
                    logger.error(f"❌ Failed to create audio asset: {audio_response.status_code}")
                    raise HTTPException(status_code=audio_response.status_code,
                                      detail=f"Failed to create audio asset: {audio_response.text}")
                
                audio_id = audio_response.json()["id"]
                logger.info(f"✅ Audio asset created: {audio_id}")
                
                # Upload audio data
                logger.info("📤 Uploading audio data...")
                audio_upload_response = await client.post(
                    f"{HEDRA_API_BASE}/assets/{audio_id}/upload",
                    files={"file": audio_data},
                    headers=headers,
                    timeout=30.0
                )
                
                if audio_upload_response.status_code != 200:
                    logger.error(f"❌ Failed to upload audio: {audio_upload_response.status_code}")
                    raise HTTPException(status_code=audio_upload_response.status_code,
                                      detail=f"Failed to upload audio: {audio_upload_response.text}")
                
                logger.info("✅ Companion audio uploaded to Hedra")
                
                # Get model ID
                model_id = "d1dd37a3-e39a-4854-a298-6510289f9cf2"
                
                # Create video generation request
                generation_data = {
                    "type": "video",
                    "ai_model_id": model_id,
                    "start_keyframe_id": image_id,
                    "audio_id": audio_id,
                    "generated_video_inputs": {
                        "text_prompt": video_request.text_prompt,
                        "resolution": "540p",
                        "aspect_ratio": "1:1",
                    }
                }
                
                if video_request.duration:
                    generation_data["generated_video_inputs"]["duration_ms"] = int(video_request.duration * 1000)
                
                logger.info(f"🎬 Starting companion video generation...")
                
                # Start generation
                generation_response = await client.post(
                    f"{HEDRA_API_BASE}/generations",
                    json=generation_data,
                    headers=headers,
                    timeout=30.0
                )
                
                if generation_response.status_code != 200:
                    logger.error(f"❌ Failed to start generation: {generation_response.status_code}")
                    raise HTTPException(status_code=generation_response.status_code,
                                      detail=f"Failed to start generation: {generation_response.text}")
                
                result = generation_response.json()
                generation_id = result["id"]
                logger.info(f"🎉 Companion video generation started: {generation_id}")
                
                # Store generation info
                video_generations[generation_id] = {
                    "generation_id": generation_id,
                    "session_id": video_request.session_id,
                    "text_prompt": video_request.text_prompt,
                    "status": "queued",
                    "created_at": asyncio.get_event_loop().time(),
                    "image_id": image_id,
                    "audio_id": audio_id,
                    "voice_id": video_request.voice_id,
                    "voice_provider": video_request.voice_provider
                }
                
                logger.info(f"✅ Generation stored: {generation_id}")
                return {
                    "generation_id": generation_id,
                    "status": "queued",
                    "message": "Your personal companion video is being created..."
                }
                
            except httpx.RequestError as http_error:
                logger.error(f"❌ HTTP Request error: {str(http_error)}")
                raise HTTPException(status_code=500, detail=f"HTTP request failed: {str(http_error)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Unexpected error in video generation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to generate companion video: {str(e)}")

@app.get("/video/status/{generation_id}")
async def get_video_status(generation_id: str):
    """Check video generation status"""
    try:
        if generation_id not in video_generations:
            raise HTTPException(status_code=404, detail="Generation not found")
        
        headers = {
            "X-API-Key": HEDRA_API_KEY
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{HEDRA_API_BASE}/generations/{generation_id}/status",
                headers=headers,
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=f"Hedra API error: {response.text}")
            
            result = response.json()
            status = result.get("status")
            
            # Update stored generation info
            video_generations[generation_id]["status"] = status
            
            # Check for completion
            if status == "complete" and result.get("url"):
                video_generations[generation_id]["video_url"] = result.get("url")
                status = "completed"
                logger.info(f"💕 Companion video completed: {generation_id}")
            elif status == "completed" and result.get("asset_id"):
                video_generations[generation_id]["video_url"] = f"{HEDRA_API_BASE}/assets/{result['asset_id']}"
            
            return {
                "generation_id": generation_id,
                "status": status,
                "video_url": video_generations[generation_id].get("video_url"),
                "text_prompt": video_generations[generation_id]["text_prompt"],
                "progress": result.get("progress", 0)
            }
            
    except Exception as e:
        logger.error(f"❌ Error checking video status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to check video status: {str(e)}")

@app.get("/video/generations")
async def list_video_generations():
    """List all video generations"""
    try:
        generations = []
        for gen_id, gen_data in video_generations.items():
            generations.append({
                "generation_id": gen_id,
                "session_id": gen_data["session_id"],
                "text_prompt": gen_data["text_prompt"],
                "status": gen_data["status"],
                "video_url": gen_data.get("video_url"),
                "created_at": gen_data["created_at"]
            })
        
        return {"generations": generations}
        
    except Exception as e:
        logger.error(f"❌ Error listing generations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to list generations: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
