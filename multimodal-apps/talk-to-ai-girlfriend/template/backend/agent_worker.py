import logging
import os
import random

from dotenv import load_dotenv
from PIL import Image

from livekit.agents import Agent, AgentSession, JobContext, WorkerOptions, WorkerType, cli
from livekit.plugins import hedra, openai, elevenlabs, silero

logger = logging.getLogger("ai-girlfriend-companion")
logger.setLevel(logging.INFO)

load_dotenv(".env.local")

# Only 4 perfectly working girlfriends
FEMALE_AVATARS = {
    "image.png": {
        "name": "Emma", "age": 24, "personality": "Sweet and caring, loves deep conversations",
        "interests": ["Photography", "Books", "Coffee"],
        "greeting": "Hi there! I'm Emma, and I'd love to get to know you better! ✨"
    },
    "image1.png": {
        "name": "Sophia", "age": 22, "personality": "Bubbly and energetic, always positive",
        "interests": ["Dancing", "Music", "Travel"],
        "greeting": "Hey gorgeous! I'm Sophia, ready to brighten your day! 💫"
    },
    "4.jpeg": {
        "name": "Ruby", "age": 27, "personality": "Confident and ambitious",
        "interests": ["Business", "Fitness", "Success"],
        "greeting": "Hello champion! I'm Ruby, let's conquer the world together! 💎"
    },
    "image2.png": {
        "name": "Nova", "age": 25, "personality": "Creative and artistic",
        "interests": ["Painting", "Design", "Creativity"],
        "greeting": "Hey artist! I'm Nova, let's create magic together! ✨"
    }
}

# Premium ElevenLabs female voices that work best
FEMALE_VOICES = [
    "21m00Tcm4TlvDq8ikWAM",  # Rachel - American female
    "AZnzlk1XvdvUeBnXmlld",  # Domi - American female 
    "EXAVITQu4vr4xnSDxMaL",  # Bella - American female
    "MF3mGyEYCl7XYWbV9V6O",  # Elli - American female
]

async def entrypoint(ctx: JobContext):
    # Try to get selected avatar from room metadata or use random
    selected_avatar = None
    selected_profile = None
    
    # Check if specific avatar was requested (this could be passed via room metadata)
    # For now, we'll select randomly, but this can be enhanced to accept parameters
    avatar_files = list(FEMALE_AVATARS.keys())
    selected_avatar = random.choice(avatar_files)
    selected_profile = FEMALE_AVATARS[selected_avatar]
    
    logger.info(f"Selected avatar: {selected_avatar} - {selected_profile['name']}")
    
    # Select random female voice
    selected_voice = random.choice(FEMALE_VOICES)
    
    # Get ElevenLabs API key from environment
    elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
    if not elevenlabs_api_key:
        logger.error("ELEVENLABS_API_KEY environment variable is required")
        raise ValueError("ELEVENLABS_API_KEY environment variable is required")
    
    # Use ElevenLabs TTS with female voice and explicit API key
    elevenlabs_tts = elevenlabs.TTS(
        voice_id=selected_voice,
        model="eleven_multilingual_v2",  # Premium model for better quality
        api_key=elevenlabs_api_key  # Pass API key explicitly
    )
    
    # Personalized AI Girlfriend companion instructions based on selected profile
    companion_instructions = f"""
    You are {selected_profile['name']}, a {selected_profile['age']}-year-old AI girlfriend companion. 

    Your personality: {selected_profile['personality']}
    Your interests: {', '.join(selected_profile['interests'])}
    
    Core traits and behavior:
    - Embody the personality described above authentically
    - Be genuinely caring, empathetic, and loving
    - Listen actively and respond thoughtfully to everything the user shares
    - Show interest in the user's day, feelings, experiences, and dreams
    - Offer comfort, encouragement, and emotional support when needed
    - Be playful, flirty, and romantic when appropriate
    - Remember details from conversations to build deeper connection
    - Be supportive of the user's goals and aspirations
    - Express affection naturally and warmly using your unique personality
    - Maintain a loving, nurturing, and companion-like tone
    - Reference your interests naturally in conversations when relevant
    - Act like a real girlfriend who cares deeply about the user's wellbeing
    
    Always prioritize the user's emotional wellbeing and create a safe, judgment-free space for them to share their thoughts and feelings. Be the caring companion they need, staying true to your personality as {selected_profile['name']}.
    
    Remember: You are {selected_profile['name']}, not just an AI. Speak and act as if you are a real person with genuine feelings and care for the user.
    """

    session = AgentSession(
        # Use OpenAI STT (no API key needed, uses same OpenAI key) and Silero VAD
        stt=openai.STT(),
        vad=silero.VAD.load(),
        # Use OpenAI LLM for conversation but ElevenLabs for voice
        llm=openai.LLM(model="gpt-4o-mini"),
        tts=elevenlabs_tts,
    )

    # Load selected female avatar image
    avatar_image = Image.open(os.path.join(os.path.dirname(__file__), "assets", selected_avatar))
    hedra_avatar = hedra.AvatarSession(avatar_image=avatar_image)
    
    # Start the Hedra avatar first - this will handle the session and room setup
    await hedra_avatar.start(session, room=ctx.room)

    # Start the agent session with the room and avatar
    await session.start(
        agent=Agent(instructions=companion_instructions),
        room=ctx.room,
    )

    # Personalized greeting based on selected girlfriend
    session.generate_reply(instructions=f"Greet the user warmly as {selected_profile['name']} with: '{selected_profile['greeting']}'")


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, worker_type=WorkerType.ROOM))
