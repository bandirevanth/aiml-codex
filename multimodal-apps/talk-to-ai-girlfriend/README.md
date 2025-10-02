# AI Avatar Girlfriend

Get up and running with AI Avatar Girlfriend in minutes. This tool creates a complete customizable application with both frontend and backend components for building interactive AI girlfriend avatar experiences.

## Prerequisites

Before you begin, you'll need to set up API keys for the following services:

### 1. Livekit Project Setup

1. Create a [Livekit](https://livekit.io/) account
2. Create a project through your [Livekit dashboard](https://cloud.livekit.io/projects)
3. Navigate to Settings → API Keys and copy your project credentials

### 2. Hedra API Access

1. Create a [Hedra](https://www.hedra.com/) account
2. [Subscribe to a paid plan](https://www.hedra.com/plans) to gain API access
3. Navigate to your [API profile page](https://www.hedra.com/api-profile) to generate an API key

### 3. OpenAI API Access

1. Go to [OpenAI](https://platform.openai.com/) and follow instructions for generating an API key ([must be linked to a paid account](https://openai.com/index/introducing-the-realtime-api/?utm_source=chatgpt.com))

### 4. System Requirements

- **Node.js**: Version >=16 required
- **pnpm**: Package manager used by the project:
  ```sh
  # Install pnpm globally
  npm install -g pnpm
  # or via Homebrew
  brew install pnpm
  ```
- **Python**: Version >3.10 required for backend dependencies

## Installation

**Create your AI Avatar Girlfriend application** using npx (replace `<app-name>` with your desired name):

```sh
npx @hedra/create-ai-avatar-girlfriend <app-name>
```

The creation script will:
- Copy the template files to your project directory
- Install frontend dependencies using pnpm
- Install backend Python dependencies using pip
- Set up the basic project structure

## Configuration

After creating your application:

1. **Navigate to your application directory**:
   ```sh
   cd <app-name>
   ```

2. **Set up environment variables**:
   
   The project will have `.env.local` files in both frontend and backend directories that need to be configured with your API keys:

   **Frontend (`.env.local` in the root directory)**:
   ```env
   LIVEKIT_URL="wss://<project_name>.livekit.cloud"
   LIVEKIT_API_KEY="<livekit_api_key>"
   LIVEKIT_API_SECRET="<livekit_api_secret>"
   HEDRA_API_KEY="<hedra_api_key>"
   OPENAI_API_KEY="<openai_api_key>"
   ```

   **Backend (`.env.local` in the backend directory)**:
   ```env
   LIVEKIT_URL="wss://<project_name>.livekit.cloud"
   LIVEKIT_API_KEY="<livekit_api_key>"
   LIVEKIT_API_SECRET="<livekit_api_secret>"
   HEDRA_API_KEY="<hedra_api_key>"
   OPENAI_API_KEY="<openai_api_key>"
   ```

## Running the Application

The project includes convenient npm scripts to start both components:

1. **Start the backend agent** (in your first terminal):
   ```sh
   npm run start-agent
   ```
   This will:
   - Install Python dependencies if needed
   - Start the Python agent worker

2. **Start the frontend application** (in a new terminal):
   ```sh
   npm run start-app
   ```
   This will:
   - Install frontend dependencies if needed
   - Start the Next.js development server

Your AI Avatar Girlfriend application will be available at **http://localhost:3000** once both services are running.

## Project Structure

After creation, your project will have the following structure:

```
<app-name>/
├── frontend/          # Next.js React application
│   ├── app/          # Next.js app router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom React hooks
│   └── package.json  # Frontend dependencies
├── backend/          # Python backend
│   ├── assets/       # Avatar image assets
│   ├── agent_worker.py # Main agent worker
│   └── requirements.txt # Python dependencies
└── package.json      # Root scripts for easy startup
```

## Customization

### Changing Avatars

You can customize the avatar by:

1. Adding your image assets to the `backend/assets` directory
2. Updating `backend/agent_worker.py` to point to your desired image file

The system supports direct image file paths, so you can easily swap between different avatar appearances to create your perfect AI girlfriend.

## Troubleshooting

- **Installation fails**: Ensure you have Node.js >=16 and Python >3.10 installed
- **pnpm not found**: Install pnpm globally with `npm install -g pnpm`
- **Python dependencies fail**: Make sure you have Python >3.10 and pip installed
- **API key errors**: Double-check that all API keys are correctly set in the `.env.local` files
- **Port conflicts**: The frontend runs on port 3000 by default; make sure it's available

## Development

The project uses:
- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: Python with LiveKit agents, OpenAI integration, and Hedra avatar generation
- **Package Management**: pnpm for frontend, pip for backend

For development, you can run each component separately or use the provided npm scripts for convenience.
