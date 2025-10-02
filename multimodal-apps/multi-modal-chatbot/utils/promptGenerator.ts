import { ChatMode, ChatMessage } from '../types';

export const generateChatPrompt = (
  mode: ChatMode,
  userMessage: string,
  chatHistory: ChatMessage[],
  hasVideoFrames: boolean = false
): string => {
  const baseContext = `You are VideoChat Assistant, an intelligent AI that can analyze videos and engage in conversations. 
You maintain context across the conversation and provide helpful, accurate responses.`;

  const historyContext = chatHistory.length > 0 
    ? `\n\nConversation History:\n${chatHistory.slice(-5).map(msg => 
        `${msg.role}: ${msg.content}`
      ).join('\n')}`
    : '';

  switch (mode) {
    case ChatMode.VIDEO_ANALYSIS:
      return `${baseContext}

You are analyzing video content. Focus on providing detailed insights about what you see in the video frames.
${hasVideoFrames ? 'Analyze the provided video frames and' : ''} respond to: "${userMessage}"

Provide your response in a conversational format that includes:
- Key observations from the video
- Relevant insights or analysis
- Follow-up questions to continue the discussion

${historyContext}

Current user message: ${userMessage}`;

    case ChatMode.CONVERSATION:
      return `${baseContext}

You are having a text-based conversation. Be helpful, engaging, and maintain context from previous messages.
${historyContext}

Current user message: ${userMessage}`;

    case ChatMode.MIXED:
      return `${baseContext}

You can handle both video analysis and general conversation. Adapt your response based on whether video content is provided.
${hasVideoFrames ? 'Video frames are provided for analysis.' : 'No video content in this message.'}

${historyContext}

Current user message: ${userMessage}`;

    default:
      return `${baseContext}\n\nUser: ${userMessage}`;
  }
};

export const generateSystemPrompt = (mode: ChatMode): string => {
  return `You are an advanced multi-modal AI assistant with the following capabilities:

1. Video Analysis: Analyze video frames to understand content, actions, objects, and context
2. Conversational AI: Engage in natural, helpful conversations
3. Context Awareness: Maintain conversation context and build upon previous interactions
4. Adaptive Responses: Adjust communication style based on user needs

Current mode: ${mode}

Always provide helpful, accurate, and engaging responses. When analyzing videos, be specific about what you observe. In conversations, be natural and supportive.`;
};
