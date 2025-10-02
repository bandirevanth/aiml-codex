import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Upload, User, Video, Play, Download, ExternalLink, Loader2, Mic, Settings, Heart, Wand2, Camera, Volume2, MessageCircle, Sparkles } from 'lucide-react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

interface AvatarSession {
  session_id: string
  avatar_name: string
  status: string
  voice_provider: string
  created_at: number
}

interface VideoGeneration {
  generation_id: string
  session_id: string
  text_prompt: string
  status: string
  video_url?: string
  created_at: number
}

interface Voice {
  id: string
  name: string
  language?: string
  gender?: string
}

interface VoicesResponse {
  hedra_voices: Voice[]
  gtts_voices: Voice[]
  total_hedra: number
  total_gtts: number
}

function App() {
  const [currentSession, setCurrentSession] = useState<AvatarSession | null>(null)
  const [avatarName, setAvatarName] = useState('')
  const [voiceProvider, setVoiceProvider] = useState('elevenlabs')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [videoPrompt, setVideoPrompt] = useState('')
  const [videoGenerations, setVideoGenerations] = useState<VideoGeneration[]>([])
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [activeVideoGeneration, setActiveVideoGeneration] = useState<string | null>(null)
  const [availableVoices, setAvailableVoices] = useState<VoicesResponse | null>(null)
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [selectedVoiceProvider, setSelectedVoiceProvider] = useState<string>('elevenlabs')

  const fetchVoices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/voices`)
      if (response.ok) {
        const voices = await response.json()
        setAvailableVoices(voices)
        
        // Set default voice if none selected
        if (!selectedVoiceId) {
                  if (voices.hedra_voices.length > 0) {
          setSelectedVoiceId(voices.hedra_voices[0].id)
          setSelectedVoiceProvider('elevenlabs')
          } else if (voices.gtts_voices.length > 0) {
            setSelectedVoiceId(voices.gtts_voices[0].id)
            setSelectedVoiceProvider('gtts')
          }
        }
      }
    } catch (err) {
      console.error('Error fetching voices:', err)
    }
  }

  useEffect(() => {
    fetchVoices()
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file')
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB')
        return
      }
      
      setSelectedFile(file)
      setError(null)
      
      // Create preview URL
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const createSession = async () => {
    if (!avatarName.trim()) {
      setError('Please enter a companion name')
      return
    }

    setIsLoading(true)
    setError(null)
    console.log('🎬 Creating companion session for:', avatarName)

    try {
      const response = await fetch(`${API_BASE_URL}/avatar/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar_name: avatarName,
          voice_provider: voiceProvider
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.statusText}`)
      }

      const session = await response.json()
      console.log('✅ Companion session created:', session)
      setCurrentSession({
        session_id: session.session_id,
        avatar_name: avatarName,
        status: session.status,
        voice_provider: voiceProvider,
        created_at: Date.now()
      })
    } catch (err) {
      console.error('❌ Failed to create session:', err)
      setError(err instanceof Error ? err.message : 'Failed to create companion session')
    } finally {
      setIsLoading(false)
    }
  }

  const uploadImage = async () => {
    if (!currentSession || !selectedFile) return

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch(`${API_BASE_URL}/avatar/upload-image/${currentSession.session_id}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`)
      }

      const result = await response.json()
      setCurrentSession(prev => prev ? { ...prev, status: result.status } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
    } finally {
      setIsLoading(false)
    }
  }

  const activateSession = async () => {
    if (!currentSession) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/avatar/start-session/${currentSession.session_id}`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error(`Failed to activate session: ${response.statusText}`)
      }

      const result = await response.json()
      setCurrentSession(prev => prev ? { ...prev, status: result.status } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate session')
    } finally {
      setIsLoading(false)
    }
  }

  const generateVideo = async () => {
    if (!currentSession || !videoPrompt.trim()) return

    setIsGeneratingVideo(true)
    setError(null)

    try {
      const requestData = {
        session_id: currentSession.session_id,
        text_prompt: videoPrompt,
        duration: 5.0,
        voice_id: selectedVoiceId,
        voice_provider: selectedVoiceProvider
      }
      
      console.log('🎬 Video generation request data:', requestData)
      console.log('🎤 Selected voice ID:', selectedVoiceId)
      console.log('🔊 Selected voice provider:', selectedVoiceProvider)
      console.log('📋 Current session:', currentSession)
      
      const response = await fetch(`${API_BASE_URL}/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ Video generation error response:', errorData)
        console.error('❌ Response status:', response.status, response.statusText)
        
        // Handle stale session
        if (response.status === 404 && errorData.includes('Session not found')) {
          setError('Session expired. Please refresh the page and create a new avatar session.')
          setCurrentSession(null)
          return
        }
        
        throw new Error(`Failed to generate video: ${response.statusText}`)
      }

      const data = await response.json()
      setActiveVideoGeneration(data.generation_id)
      setVideoPrompt('')
      
      // Start polling for status
      pollVideoStatus(data.generation_id)
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const pollVideoStatus = async (generationId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/video/status/${generationId}`)
      if (response.ok) {
        const status = await response.json()
        
        setVideoGenerations(prev => {
          const prevArray = Array.isArray(prev) ? prev : []
          const existing = prevArray.find(v => v.generation_id === generationId)
          if (existing) {
            return prevArray.map(v => 
              v.generation_id === generationId 
                ? { ...v, status: status.status, video_url: status.video_url }
                : v
            )
          } else {
            return [...prevArray, {
              generation_id: generationId,
              session_id: currentSession?.session_id || '',
              text_prompt: status.text_prompt || '',
              status: status.status,
              video_url: status.video_url,
              created_at: Date.now()
            }]
          }
        })

        if (status.status === 'completed' && generationId === activeVideoGeneration) {
          setActiveVideoGeneration(null)
        } else if (status.status !== 'completed' && status.status !== 'failed') {
          setTimeout(() => pollVideoStatus(generationId), 2000)
        }
      }
    } catch (err) {
      console.error('Error polling video status:', err)
    }
  }

  const fetchVideoGenerations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/video/generations`)
      if (response.ok) {
        const data = await response.json()
        setVideoGenerations(data.generations || [])
      }
    } catch (err) {
      console.error('Error fetching video generations:', err)
    }
  }

  useEffect(() => {
    fetchVideoGenerations()
    const interval = setInterval(fetchVideoGenerations, 5000)
    return () => clearInterval(interval)
  }, [])

  const downloadVideo = (url: string, generationId: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = `avatar-video-${generationId}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  AI Companion Studio
                </h1>
                <p className="text-sm text-gray-600">Create your perfect AI girlfriend & companion videos</p>
              </div>
            </div>
            {currentSession && (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white/50">
                  <Heart className="h-3 w-3 mr-1 text-pink-500" />
                  {currentSession.avatar_name}
                </Badge>
                <Badge 
                  variant={currentSession.status === 'active' ? 'default' : 'secondary'}
                  className={currentSession.status === 'active' ? 'bg-pink-500 hover:bg-pink-600' : ''}
                >
                  {currentSession.status}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="avatar-setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="avatar-setup" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Create Companion
            </TabsTrigger>
            <TabsTrigger value="video-generation" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat & Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avatar-setup" className="space-y-6">
            {/* Avatar Setup Card */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <Heart className="h-6 w-6 text-pink-500" />
                  Create Your AI Companion
                </CardTitle>
                <CardDescription>
                  Design your perfect AI girlfriend, therapist, or companion with a custom photo and personality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Companion Name */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">1</div>
                    <Label htmlFor="avatar-name" className="text-base font-medium">Companion Name</Label>
                  </div>
                  <Input
                    id="avatar-name"
                    placeholder="Give your AI companion a name... (e.g., Emma, Sarah, Luna)"
                    value={avatarName}
                    onChange={(e) => setAvatarName(e.target.value)}
                    className="bg-white/50 border-white/30"
                  />
                  <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="px-3 py-1 bg-pink-100 rounded-full text-pink-700 cursor-pointer hover:bg-pink-200" 
                          onClick={() => setAvatarName("Emma")}>💕 Emma</span>
                    <span className="px-3 py-1 bg-purple-100 rounded-full text-purple-700 cursor-pointer hover:bg-purple-200" 
                          onClick={() => setAvatarName("Dr. Sarah")}>🧠 Dr. Sarah (Therapist)</span>
                    <span className="px-3 py-1 bg-rose-100 rounded-full text-rose-700 cursor-pointer hover:bg-rose-200" 
                          onClick={() => setAvatarName("Luna")}>🌙 Luna</span>
                    <span className="px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 cursor-pointer hover:bg-indigo-200" 
                          onClick={() => setAvatarName("Aria")}>✨ Aria</span>
                  </div>
                </div>

                <Separator className="bg-gradient-to-r from-pink-200 to-purple-200" />

                {/* Step 2: Upload Companion Photo */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">2</div>
                    <Label className="text-base font-medium">Upload Companion Photo</Label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-pink-300 rounded-xl p-8 text-center cursor-pointer hover:border-pink-400 transition-all hover:bg-pink-50/50 group"
                    >
                      <Upload className="h-12 w-12 mx-auto text-pink-400 group-hover:text-pink-500 mb-4" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload your companion's photo
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        JPG, PNG, or WebP (max 10MB)
                      </p>
                      <div className="flex justify-center gap-2 text-xs text-gray-400">
                        <span>💗 Girlfriend</span>
                        <span>🧠 Therapist</span>
                        <span>👥 Friend</span>
                      </div>
                    </div>
                    
                                        {!previewUrl && (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-gray-700">Or choose from our curated companions:</p>
                        
                        {/* AI Girlfriends */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-pink-700 flex items-center gap-2">
                            💕 AI Girlfriends
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { name: "Isabella", img: "/3.jpeg", desc: "Playful & Fun", category: "girlfriend" },
                              { name: "Aria", img: "/4.jpeg", desc: "Artistic & Creative", category: "girlfriend" },
                              { name: "Emma", img: "/image.png", desc: "Sweet & Caring", category: "girlfriend" },
                              { name: "Luna", img: "/image (1).png", desc: "Mystical & Wise", category: "girlfriend" }
                            ].map((sample, idx) => (
                              <div 
                                key={idx}
                                className={`cursor-pointer group border-2 rounded-lg p-1 transition-all ${
                                  avatarName === sample.name ? 'border-pink-400 bg-pink-50' : 'border-transparent hover:border-pink-200'
                                }`}
                                onClick={async () => {
                                  setAvatarName(sample.name);
                                  setError(null);
                                  
                                  try {
                                    const response = await fetch(sample.img);
                                    const blob = await response.blob();
                                    const file = new File([blob], `${sample.name.toLowerCase()}.jpg`, { type: 'image/jpeg' });
                                    
                                    setSelectedFile(file);
                                    const url = URL.createObjectURL(file);
                                    setPreviewUrl(url);
                                    
                                    console.log(`Selected ${sample.name} with image file`);
                                  } catch (err) {
                                    console.error('Error loading sample image:', err);
                                    setError('Failed to load sample image');
                                  }
                                }}
                              >
                                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg mb-1 overflow-hidden group-hover:scale-105 transition-transform">
                                  <img 
                                    src={sample.img} 
                                    alt={sample.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs font-medium text-center">{sample.name}</p>
                                <p className="text-xs text-gray-500 text-center text-[10px]">{sample.desc}</p>
                                {avatarName === sample.name && (
                                  <div className="text-center mt-1">
                                    <span className="text-xs bg-pink-100 text-pink-700 px-1 py-0.5 rounded-full text-[10px]">
                                      ✓ Selected
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Therapists */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                            🧠 AI Therapists & Counselors
                          </h4>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { name: "Dr. Sarah", img: "/5.jpeg", desc: "Depression & Anxiety", category: "therapist" },
                              { name: "Dr. Maya", img: "/6.jpeg", desc: "Relationship Expert", category: "therapist" },
                              { name: "Dr. Grace", img: "/7.jpeg", desc: "Mindfulness Coach", category: "therapist" },
                              { name: "Dr. Amanda", img: "/image (2).png", desc: "Life Coach", category: "therapist" }
                            ].map((sample, idx) => (
                              <div 
                                key={idx}
                                className={`cursor-pointer group border-2 rounded-lg p-1 transition-all ${
                                  avatarName === sample.name ? 'border-purple-400 bg-purple-50' : 'border-transparent hover:border-purple-200'
                                }`}
                                onClick={async () => {
                                  setAvatarName(sample.name);
                                  setError(null);
                                  
                                  try {
                                    const response = await fetch(sample.img);
                                    const blob = await response.blob();
                                    const file = new File([blob], `${sample.name.toLowerCase()}.jpg`, { type: 'image/jpeg' });
                                    
                                    setSelectedFile(file);
                                    const url = URL.createObjectURL(file);
                                    setPreviewUrl(url);
                                    
                                    console.log(`Selected ${sample.name} with image file`);
                                  } catch (err) {
                                    console.error('Error loading sample image:', err);
                                    setError('Failed to load sample image');
                                  }
                                }}
                              >
                                <div className="aspect-square bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg mb-1 overflow-hidden group-hover:scale-105 transition-transform">
                                  <img 
                                    src={sample.img} 
                                    alt={sample.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs font-medium text-center">{sample.name}</p>
                                <p className="text-xs text-gray-500 text-center text-[10px]">{sample.desc}</p>
                                {avatarName === sample.name && (
                                  <div className="text-center mt-1">
                                    <span className="text-xs bg-purple-100 text-purple-700 px-1 py-0.5 rounded-full text-[10px]">
                                      ✓ Selected
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Companions */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
                            ✨ Special Companions
                          </h4>
                          <div className="grid grid-cols-5 gap-2">
                            {[
                              { name: "Luna", img: "/8.jpeg", desc: "Wise Guide", category: "spiritual" },
                              { name: "Nova", img: "/9.jpeg", desc: "Motivational", category: "motivator" },
                              { name: "Zara", img: "/10.jpeg", desc: "Study Buddy", category: "study" },
                              { name: "Mia", img: "/image (5).png", desc: "Fitness Coach", category: "fitness" },
                              { name: "Sky", img: "/image (9).png", desc: "Creative Muse", category: "creative" }
                            ].map((sample, idx) => (
                              <div 
                                key={idx}
                                className={`cursor-pointer group border-2 rounded-lg p-1 transition-all ${
                                  avatarName === sample.name ? 'border-indigo-400 bg-indigo-50' : 'border-transparent hover:border-indigo-200'
                                }`}
                                onClick={async () => {
                                  setAvatarName(sample.name);
                                  setError(null);
                                  
                                  try {
                                    const response = await fetch(sample.img);
                                    const blob = await response.blob();
                                    const file = new File([blob], `${sample.name.toLowerCase()}.jpg`, { type: 'image/jpeg' });
                                    
                                    setSelectedFile(file);
                                    const url = URL.createObjectURL(file);
                                    setPreviewUrl(url);
                                    
                                    console.log(`Selected ${sample.name} with image file`);
                                  } catch (err) {
                                    console.error('Error loading sample image:', err);
                                    setError('Failed to load sample image');
                                  }
                                }}
                              >
                                <div className="aspect-square bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg mb-1 overflow-hidden group-hover:scale-105 transition-transform">
                                  <img 
                                    src={sample.img} 
                                    alt={sample.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <p className="text-xs font-medium text-center">{sample.name}</p>
                                <p className="text-xs text-gray-500 text-center text-[10px]">{sample.desc}</p>
                                {avatarName === sample.name && (
                                  <div className="text-center mt-1">
                                    <span className="text-xs bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded-full text-[10px]">
                                      ✓ Selected
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {previewUrl && (
                      <div className="relative">
                        <img 
                          src={previewUrl} 
                          alt="Companion preview" 
                          className="w-full h-48 object-cover rounded-xl shadow-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-pink-500 text-white">
                            💕 Perfect!
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <Separator className="bg-gradient-to-r from-pink-200 to-purple-200" />

                {/* Debug Info */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="p-3 bg-gray-100 rounded text-xs">
                    <strong>Debug Info:</strong><br/>
                    Current Session: {currentSession ? currentSession.session_id : 'None'}<br/>
                    Avatar Name: {avatarName || 'Empty'}<br/>
                    Selected File: {selectedFile ? selectedFile.name : 'None'}<br/>
                    Status: {currentSession?.status || 'No session'}
                    {currentSession && (
                      <button 
                        onClick={() => setCurrentSession(null)} 
                        className="ml-2 text-red-600 underline"
                      >
                        Reset Session
                      </button>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  {!currentSession ? (
                    <Button 
                      onClick={createSession} 
                      disabled={!avatarName.trim() || isLoading}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Your Companion...
                        </>
                      ) : (
                        <>
                          <Heart className="h-4 w-4 mr-2" />
                          Create AI Companion
                        </>
                      )}
                    </Button>
                  ) : currentSession.status === 'created' ? (
                    <Button 
                      onClick={uploadImage} 
                      disabled={!selectedFile || isLoading}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading Photo...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Companion Photo
                        </>
                      )}
                    </Button>
                  ) : currentSession.status === 'image_uploaded' ? (
                    <Button 
                      onClick={activateSession} 
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Bringing Your Companion to Life...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Activate Your Companion
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                      <div className="flex items-center justify-center gap-2 text-pink-700 mb-2">
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">Your Companion is Ready!</span>
                      </div>
                      <p className="text-sm text-pink-600">
                        Your AI companion is now active and ready to create personalized videos for you.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="video-generation" className="space-y-6">
            {/* Video Generation Card */}
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                  <MessageCircle className="h-6 w-6 text-purple-500" />
                  Chat with Your AI Companion
                </CardTitle>
                <CardDescription>
                  Create personalized videos where your AI companion talks to you about anything - therapy, relationships, daily motivation, or just friendly chat
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Message Ideas */}
                <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    Popular Conversation Starters
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="space-y-2">
                      <p className="font-medium text-pink-700">💕 Girlfriend Messages:</p>
                      <div className="space-y-1 text-gray-600">
                        <p className="cursor-pointer hover:text-pink-600 p-2 hover:bg-white/50 rounded text-xs" 
                           onClick={() => setVideoPrompt("Hey babe! I missed you so much today. How was your day? I can't wait to hear all about it. You're always on my mind and you make me so happy.")}>
                          "Hey babe! I missed you today..."
                        </p>
                        <p className="cursor-pointer hover:text-pink-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("Good morning my love! You're going to have an amazing day today. Remember that I believe in you completely. You're incredible and I'm so lucky to have you in my life!")}>
                          "Morning motivation from girlfriend"
                        </p>
                        <p className="cursor-pointer hover:text-pink-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("I love how passionate you get about the things that matter to you. Your dedication and hard work inspire me every single day. You're going to accomplish amazing things!")}>
                          "Romantic encouragement"
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-purple-700">🧠 Therapy Sessions:</p>
                      <div className="space-y-1 text-gray-600">
                        <p className="cursor-pointer hover:text-purple-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("I want you to know that what you're feeling is completely valid. It's okay to have difficult days. Let's work through this together. You're stronger than you think and I'm here to support you.")}>
                          "Anxiety and stress support"
                        </p>
                        <p className="cursor-pointer hover:text-purple-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("Remember to practice self-compassion today. You're doing better than you think. Progress isn't always linear, and it's important to celebrate small wins and be patient with yourself.")}>
                          "Daily mental health check-in"
                        </p>
                        <p className="cursor-pointer hover:text-purple-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("Let's talk about your relationship patterns. What draws you to certain people? Understanding your attachment style can help you build healthier, more fulfilling connections.")}>
                          "Relationship therapy session"
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-indigo-700">✨ Motivational Support:</p>
                      <div className="space-y-1 text-gray-600">
                        <p className="cursor-pointer hover:text-indigo-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("You have everything within you to achieve your goals. Today is a new opportunity to move closer to your dreams. Take one small step forward - that's all it takes to start.")}>
                          "Daily motivation boost"
                        </p>
                        <p className="cursor-pointer hover:text-indigo-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("Your fitness journey is about progress, not perfection. Every workout counts, every healthy choice matters. You're building strength not just in your body, but in your mind and spirit too.")}>
                          "Fitness motivation"
                        </p>
                        <p className="cursor-pointer hover:text-indigo-600 p-2 hover:bg-white/50 rounded text-xs"
                           onClick={() => setVideoPrompt("Study sessions can be challenging, but remember why you started this journey. Your education is an investment in your future self. Take breaks when you need them, but keep pushing forward.")}>
                          "Study buddy encouragement"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Input */}
                <div className="space-y-3">
                  <Label htmlFor="video-prompt" className="flex items-center gap-2 text-base font-medium">
                    <MessageCircle className="h-4 w-4" />
                    What would you like your companion to say?
                  </Label>
                  <Textarea
                    id="video-prompt"
                    placeholder="Type your message here... Your AI companion will speak these words to you in a personalized video. Try therapy sessions, relationship advice, daily motivation, or just casual conversation!"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    rows={4}
                    className="bg-white/50 border-white/30 resize-none"
                  />
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded">💕 Girlfriend chat</span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">🧠 Therapy session</span>
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">💪 Motivational coaching</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">📚 Study buddy</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded">🧘 Mindfulness</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">🎨 Creative inspiration</span>
                  </div>
                </div>

                {/* Voice Settings */}
                <div className="space-y-4 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-200">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-pink-500" />
                    Voice & Personality Settings
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="voice-provider" className="font-medium">Voice Quality</Label>
                      <Select value={selectedVoiceProvider} onValueChange={(value) => {
                        setSelectedVoiceProvider(value)
                        if (value === 'elevenlabs' && availableVoices?.hedra_voices.length > 0) {
                          setSelectedVoiceId(availableVoices.hedra_voices[0].id)
                        } else if (value === 'gtts' && availableVoices?.gtts_voices.length > 0) {
                          setSelectedVoiceId(availableVoices.gtts_voices[0].id)
                        }
                      }}>
                        <SelectTrigger className="bg-white/70">
                          <SelectValue placeholder="Select voice quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="elevenlabs">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-pink-500" />
                              Premium AI Voices {availableVoices && `(${availableVoices.total_hedra} voices)`}
                            </div>
                          </SelectItem>
                          <SelectItem value="gtts">
                            <div className="flex items-center gap-2">
                              <Volume2 className="h-4 w-4 text-purple-500" />
                              Standard Voices {availableVoices && `(${availableVoices.total_gtts} voices)`}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="voice-selection" className="font-medium">Choose Voice Personality</Label>
                      <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                        <SelectTrigger className="bg-white/70">
                          <SelectValue placeholder="Choose a voice personality" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedVoiceProvider === 'elevenlabs' && availableVoices?.hedra_voices.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex items-center gap-2">
                                <Heart className="h-3 w-3 text-pink-500" />
                                {voice.name || voice.id}
                                {voice.gender && (
                                  <Badge variant="outline" className="text-xs">
                                    {voice.gender === 'female' ? '💕 Girlfriend' : '🤵 Boyfriend'}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                          {selectedVoiceProvider === 'gtts' && availableVoices?.gtts_voices.map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              <div className="flex items-center gap-2">
                                <Volume2 className="h-3 w-3" />
                                {voice.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 p-3 bg-white/50 rounded-lg">
                    {selectedVoiceProvider === 'elevenlabs' ? (
                      <span className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500" />
                        Premium AI voices deliver ultra-realistic, emotional, and intimate conversations
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4 text-purple-500" />
                        Standard voices provide reliable quality with multi-language support
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Generate Button */}
                <Button 
                  onClick={generateVideo} 
                  disabled={!currentSession || currentSession.status !== 'active' || !videoPrompt.trim() || isGeneratingVideo || !selectedVoiceId}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg"
                  size="lg"
                >
                  {isGeneratingVideo ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating Your Personal Video...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Generate Personal Message Video
                    </>
                  )}
                </Button>

                {currentSession?.status !== 'active' && (
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-700 text-sm">
                      💕 Please create and activate your AI companion first to start generating personal videos.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Gallery */}
            {videoGenerations.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-pink-500" />
                    Your Personal Video Collection
                  </CardTitle>
                  <CardDescription>
                    All your AI companion videos - perfect for daily motivation, therapy sessions, or just feeling loved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videoGenerations.map((video) => (
                      <Card key={video.generation_id} className="bg-white/80 border-white/40 overflow-hidden">
                        <CardContent className="p-4 space-y-3">
                          <div className="aspect-video bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center relative">
                            {video.video_url ? (
                              <video 
                                src={video.video_url} 
                                controls 
                                className="w-full h-full rounded-lg"
                                poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'%3E%3Cpath fill='%23ec4899' d='M8 5v14l11-7z'/%3E%3C/svg%3E"
                              />
                            ) : (
                              <div className="text-center">
                                {video.status === 'completed' ? (
                                  <>
                                    <Play className="h-12 w-12 text-pink-500 mx-auto mb-2" />
                                    <p className="text-sm text-pink-600">Ready to watch! 💕</p>
                                  </>
                                ) : video.status === 'failed' ? (
                                  <div className="text-red-500">
                                    <span className="text-2xl">😔</span>
                                    <p className="text-sm mt-2">Generation failed</p>
                                  </div>
                                ) : (
                                  <div className="text-pink-500">
                                    <Loader2 className="h-12 w-12 animate-spin mx-auto mb-2" />
                                    <p className="text-sm mb-2">Creating your video...</p>
                                    <Progress value={video.status === 'processing' ? 75 : 25} className="w-24 mx-auto" />
                                  </div>
                                )}
                              </div>
                            )}
                            <div className="absolute top-2 left-2">
                              <Badge className="bg-pink-500 text-white text-xs">
                                💕 Personal
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium line-clamp-2">
                              "{video.text_prompt.length > 80 ? video.text_prompt.substring(0, 80) + '...' : video.text_prompt}"
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge 
                                variant={
                                  video.status === 'completed' ? 'default' : 
                                  video.status === 'failed' ? 'destructive' : 
                                  'secondary'
                                }
                                className={
                                  video.status === 'completed' ? 'bg-pink-500 hover:bg-pink-600' : ''
                                }
                              >
                                {video.status}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(video.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          
                          {video.video_url && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadVideo(video.video_url!, video.generation_id)}
                                className="flex-1"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(video.video_url!, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
