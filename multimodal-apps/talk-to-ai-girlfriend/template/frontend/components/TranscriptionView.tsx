import useCombinedTranscriptions from "@hooks/useCombinedTranscriptions";
import * as React from "react";

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions();
  const containerRef = React.useRef<HTMLDivElement>(null);

  // scroll to bottom when new transcription is added
  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [combinedTranscriptions]);

  return (
    <div className="relative h-[300px] w-full max-w-[90vw] mx-auto bg-gradient-to-br from-pink-50/50 to-rose-50/50 rounded-2xl border border-pink-100 backdrop-blur-sm">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-pink-100 to-rose-100 rounded-t-2xl border-b border-pink-200 p-3 z-20">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">💕 Conversation with your AI companion</span>
        </div>
      </div>

      {/* Fade-out gradient masks */}
      <div className="absolute top-16 left-0 right-0 h-6 bg-gradient-to-b from-pink-50/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-pink-50/80 to-transparent z-10 pointer-events-none" />

      {/* Scrollable content */}
      <div 
        ref={containerRef} 
        className="h-full flex flex-col gap-3 overflow-y-auto px-4 py-20 lk-transcription-container"
        style={{ scrollBehavior: 'smooth' }}
      >
        {combinedTranscriptions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">💬</div>
            <p className="text-sm">Your conversation will appear here...</p>
          </div>
        ) : (
          combinedTranscriptions.map((segment, index) => (
            <div
              id={segment.id}
              key={segment.id}
              className={`flex ${segment.role === "assistant" ? "justify-start" : "justify-end"} mb-2`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                  segment.role === "assistant"
                    ? "bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 text-gray-800 rounded-bl-md"
                    : "bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-br-md"
                }`}
              >
                {/* Avatar indicator */}
                <div className="flex items-start gap-2">
                  {segment.role === "assistant" && (
                    <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      💕
                    </div>
                  )}
                  <div className="flex-1">
                    <div className={`text-sm leading-relaxed ${segment.role === "assistant" ? "text-gray-800" : "text-white"}`}>
                      {segment.text}
                    </div>
                    {/* Timestamp */}
                    <div className={`text-xs mt-1 ${segment.role === "assistant" ? "text-gray-500" : "text-blue-100"}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  {segment.role === "user" && (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                      👤
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator when AI is responding */}
        {/* This could be enhanced with actual typing state from the voice assistant */}
        <div className="flex justify-start mb-2 opacity-0 transition-opacity duration-300" id="typing-indicator">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200 p-3 rounded-2xl rounded-bl-md shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                💕
              </div>
              <div className="thinking-dots flex gap-1">
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
