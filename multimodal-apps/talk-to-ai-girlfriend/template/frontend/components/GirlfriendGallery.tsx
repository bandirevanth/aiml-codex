import { motion } from "framer-motion";
import { useState } from "react";

interface GirlfriendProfile {
  id: string;
  name: string;
  age: number;
  image: string;
  personality: string;
  interests: string[];
  greeting: string;
}

// Only 4 perfectly working girlfriends that match the backend
const girlfriendProfiles: GirlfriendProfile[] = [
  {
    id: "emma",
    name: "Emma",
    age: 24,
    image: "image.png",
    personality: "Sweet and caring, loves deep conversations",
    interests: ["Photography", "Books", "Coffee"],
    greeting: "Hi there! I'm Emma, and I'd love to get to know you better! ✨"
  },
  {
    id: "sophia",
    name: "Sophia",
    age: 22,
    image: "image1.png",
    personality: "Bubbly and energetic, always positive",
    interests: ["Dancing", "Music", "Travel"],
    greeting: "Hey gorgeous! I'm Sophia, ready to brighten your day! 💫"
  },
  {
    id: "ruby",
    name: "Ruby",
    age: 27,
    image: "4.jpeg",
    personality: "Confident and ambitious",
    interests: ["Business", "Fitness", "Success"],
    greeting: "Hello champion! I'm Ruby, let's conquer the world together! 💎"
  },
  {
    id: "nova",
    name: "Nova",
    age: 25,
    image: "image2.png",
    personality: "Creative and artistic",
    interests: ["Painting", "Design", "Creativity"],
    greeting: "Hey artist! I'm Nova, let's create magic together! ✨"
  }
];

interface GirlfriendGalleryProps {
  onSelectGirlfriend: (girlfriend: GirlfriendProfile) => void;
}

export default function GirlfriendGallery({ onSelectGirlfriend }: GirlfriendGalleryProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-4"
        >
          💕 Choose Your AI Companion
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Meet our beautiful AI companions, each with unique personalities and interests. 
          Choose the one that speaks to your heart! 💖
        </motion.p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {girlfriendProfiles.map((girlfriend, index) => (
            <motion.div
              key={girlfriend.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              onHoverStart={() => setHoveredCard(girlfriend.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group cursor-pointer"
              onClick={() => onSelectGirlfriend(girlfriend)}
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-pink-100 transition-all duration-300 group-hover:shadow-2xl group-hover:border-pink-200">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={`/api/avatar/${girlfriend.image}`}
                    alt={girlfriend.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      // Fallback to a placeholder if image fails to load
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face`;
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Age Badge */}
                  <div className="absolute top-4 right-4 bg-pink-500/90 text-white px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm">
                    {girlfriend.age}
                  </div>

                  {/* Hover Content */}
                  <motion.div 
                    className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ y: 20 }}
                    animate={{ y: hoveredCard === girlfriend.id ? 0 : 20 }}
                  >
                    <p className="text-sm font-medium mb-2">{girlfriend.personality}</p>
                    <div className="flex flex-wrap gap-1">
                      {girlfriend.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {girlfriend.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {girlfriend.greeting}
                  </p>
                  
                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-all duration-300"
                  >
                    💕 Chat with {girlfriend.name}
                  </motion.button>
                </div>
              </div>

              {/* Floating Hearts Animation */}
              {hoveredCard === girlfriend.id && (
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-pink-400 text-xl"
                      initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: "100%", 
                        opacity: 0 
                      }}
                      animate={{ 
                        y: "-20px", 
                        opacity: [0, 1, 0],
                        rotate: 360
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: i * 0.3,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      💖
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-16"
      >
        <p className="text-gray-600 text-lg mb-4">
          Can't decide? Let us surprise you with a random companion! 🎲
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const randomGirlfriend = girlfriendProfiles[Math.floor(Math.random() * girlfriendProfiles.length)];
            onSelectGirlfriend(randomGirlfriend);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full shadow-lg transition-all duration-300"
        >
          🎯 Surprise Me!
        </motion.button>
      </motion.div>
    </div>
  );
} 