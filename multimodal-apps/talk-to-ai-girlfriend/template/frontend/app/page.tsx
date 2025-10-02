"use client";

import { CloseIcon } from "@components/CloseIcon";
import { NoAgentNotification } from "@components/NoAgentNotification";
import TranscriptionView from "@components/TranscriptionView";
import GirlfriendGallery from "@components/GirlfriendGallery";
import {
  BarVisualizer,
  DisconnectButton,
  RoomAudioRenderer,
  RoomContext,
  VideoTrack,
  VoiceAssistantControlBar,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Room, RoomEvent } from "livekit-client";
import { useCallback, useEffect, useState } from "react";
import type { ConnectionDetails } from "./api/connection-details/route";

interface GirlfriendProfile {
  id: string;
  name: string;
  age: number;
  image: string;
  personality: string;
  interests: string[];
  greeting: string;
}

export default function Page() {
  const [room] = useState(new Room());
  const [selectedGirlfriend, setSelectedGirlfriend] = useState<GirlfriendProfile | null>(null);
  const [showChat, setShowChat] = useState(false);

  const onSelectGirlfriend = useCallback((girlfriend: GirlfriendProfile) => {
    setSelectedGirlfriend(girlfriend);
    setShowChat(true);
  }, []);

  const onBackToGallery = useCallback(() => {
    setShowChat(false);
    setSelectedGirlfriend(null);
    // Disconnect from room if connected
    if (room.state === "connected") {
      room.disconnect();
    }
  }, [room]);

  const onConnectButtonClicked = useCallback(async () => {
    // Generate room connection details for AI companion session
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin
    );
    const response = await fetch(url.toString());
    const connectionDetailsData: ConnectionDetails = await response.json();

    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken);
    await room.localParticipant.setMicrophoneEnabled(true);
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  // Show gallery if no girlfriend is selected
  if (!showChat) {
    return <GirlfriendGallery onSelectGirlfriend={onSelectGirlfriend} />;
  }

  return (
    <main data-lk-theme="default" className="h-full min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Header with selected girlfriend info */}
      <div className="w-full flex flex-col items-center pt-6 pb-4">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-4 mb-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBackToGallery}
              className="bg-white/80 hover:bg-white text-pink-600 px-4 py-2 rounded-full shadow-lg border border-pink-200 transition-all duration-200"
            >
              ← Back to Gallery
            </motion.button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              💕 Chat with {selectedGirlfriend?.name}
            </h1>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="bg-pink-100 px-3 py-1 rounded-full text-sm font-medium">
              Age: {selectedGirlfriend?.age}
            </span>
            <span className="bg-rose-100 px-3 py-1 rounded-full text-sm font-medium">
              {selectedGirlfriend?.personality}
            </span>
          </div>
          {selectedGirlfriend?.interests && (
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {selectedGirlfriend.interests.map((interest) => (
                <span key={interest} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <RoomContext.Provider value={room}>
        <div className="lk-room-container max-w-[1024px] w-[90vw] mx-auto max-h-[80vh] bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-pink-100 p-6">
          <SimpleVoiceAssistant 
            onConnectButtonClicked={onConnectButtonClicked} 
            selectedGirlfriend={selectedGirlfriend}
            onBackToGallery={onBackToGallery}
          />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function SimpleVoiceAssistant(props: { 
  onConnectButtonClicked: () => void;
  selectedGirlfriend: GirlfriendProfile | null;
  onBackToGallery: () => void;
}) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <>
      <AnimatePresence mode="wait">
        {agentState === "disconnected" ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="grid items-center justify-center h-full min-h-[400px]"
          >
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-pink-200 shadow-lg">
                {props.selectedGirlfriend?.image && (
                  <img 
                    src={`/api/avatar/${props.selectedGirlfriend.image}`}
                    alt={props.selectedGirlfriend.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=200&h=200&fit=crop&crop=face`;
                    }}
                  />
                )}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Ready to chat with {props.selectedGirlfriend?.name}?
              </h2>
              <p className="text-gray-600 mb-6 max-w-md">
                {props.selectedGirlfriend?.greeting || "Your AI companion is waiting to talk with you!"}
              </p>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                onClick={() => props.onConnectButtonClicked()}
              >
                💕 Start Our Conversation
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex flex-col items-center gap-6 h-full"
          >
            <AgentVisualizer selectedGirlfriend={props.selectedGirlfriend} />
            <div className="flex-1 w-full">
              <TranscriptionView />
            </div>
            <div className="w-full">
              <ControlBar 
                onConnectButtonClicked={props.onConnectButtonClicked}
                onBackToGallery={props.onBackToGallery}
                selectedGirlfriend={props.selectedGirlfriend}
              />
            </div>
            <RoomAudioRenderer />
            <NoAgentNotification state={agentState} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentVisualizer({ selectedGirlfriend }: { selectedGirlfriend: GirlfriendProfile | null }) {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();
  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-200 bg-gradient-to-br from-pink-100 to-rose-100 relative">
        <VideoTrack trackRef={videoTrack} />
        {/* Girlfriend name overlay */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {selectedGirlfriend?.name}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-3xl p-8 shadow-xl border border-pink-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-100/30 via-transparent to-purple-100/30 pointer-events-none"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-pink-200/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-200/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        {/* Profile section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-3 border-white shadow-lg bg-white p-1">
            {selectedGirlfriend?.image && (
              <img 
                src={`/api/avatar/${selectedGirlfriend.image}`}
                alt={selectedGirlfriend.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&h=100&fit=crop&crop=face`;
                }}
              />
            )}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{selectedGirlfriend?.name}</h3>
          <p className="text-gray-600 text-sm font-medium">is listening to your voice...</p>
        </div>

        {/* Improved voice visualizer */}
        <div className="flex items-center justify-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/40">
            <div className="flex items-end justify-center gap-2 h-16">
              <BarVisualizer
                state={agentState}
                barCount={9}
                trackRef={audioTrack}
                className="agent-visualizer-improved"
                options={{ minHeight: 8, maxHeight: 48 }}
              />
            </div>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500 font-medium">Voice Active</span>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Connection status indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            ✨ Conversation with your AI companion
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlBar(props: { 
  onConnectButtonClicked: () => void;
  onBackToGallery: () => void;
  selectedGirlfriend: GirlfriendProfile | null;
}) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="relative h-[80px] bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-200">
      <AnimatePresence>
        {agentState === "disconnected" && (
          <motion.div
            initial={{ opacity: 0, top: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 1, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3"
          >
            <button
              onClick={props.onBackToGallery}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
            >
              ← Change Companion
            </button>
            <button
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
              onClick={() => props.onConnectButtonClicked()}
            >
              💕 Reconnect with {props.selectedGirlfriend?.name}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, top: "10px" }}
            animate={{ opacity: 1, top: 0 }}
            exit={{ opacity: 0, top: "-10px" }}
            transition={{ duration: 0.4, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="flex h-12 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center gap-4"
          >
            <button
              onClick={props.onBackToGallery}
              className="bg-gray-400 hover:bg-gray-500 text-white rounded-full px-3 py-2 transition-colors duration-200 text-sm"
            >
              ← Gallery
            </button>
            <VoiceAssistantControlBar controls={{ leave: false }} />
            <DisconnectButton className="bg-rose-500 hover:bg-rose-600 text-white rounded-full px-4 py-2 transition-colors duration-200">
              <CloseIcon />
              <span className="ml-2 text-sm">End chat</span>
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function onDeviceFailure(error: Error) {
  console.error(error);
  alert(
    "I need access to your camera and microphone to see and hear you! Please grant permissions and refresh the page so we can chat. 💕"
  );
}
