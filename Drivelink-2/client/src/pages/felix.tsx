
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Camera, Video, Send, MessageCircle, ArrowLeft, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Felix() {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [, setLocation] = useLocation();
  const [conversation, setConversation] = useState([
    {
      id: 1,
      type: "felix",
      content: "Hi! I'm Felix, your AI car diagnostic assistant. Tell me what's happening with your Ferrari SF90 Stradale, or ask me anything about your vehicle. You can type, record audio, take a photo, or record a video!",
      timestamp: new Date(),
    }
  ]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setMessage("");

    try {
      // Call the Felix AI API
      const response = await fetch('/api/felix/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation: newConversation
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      const felixResponse = {
        id: Date.now() + 1,
        type: "felix",
        content: data.response,
        timestamp: new Date(),
      };
      
      setConversation(prev => [...prev, felixResponse]);
    } catch (error) {
      console.error('Error calling Felix AI:', error);
      
      // Fallback response if API fails
      const fallbackResponse = {
        id: Date.now() + 1,
        type: "felix",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. In the meantime, you can check your Ferrari's diagnostic systems through the infotainment display.",
        timestamp: new Date(),
      };
      
      setConversation(prev => [...prev, fallbackResponse]);
      
      toast({
        title: "Connection Error",
        description: "Unable to reach Felix AI. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAudioRecord = () => {
    setIsRecording(!isRecording);
    setShowMediaMenu(false);
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Processing your audio message..." : "Speak your question or describe the issue",
    });
  };

  const handlePhotoCapture = () => {
    setShowMediaMenu(false);
    toast({
      title: "Camera opened",
      description: "Take a photo of the issue or component you're asking about",
    });
  };

  const handleVideoRecord = () => {
    setShowMediaMenu(false);
    toast({
      title: "Video recording",
      description: "Record a video showing the problem you're experiencing",
    });
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with Back Button */}
      <div className="px-4 py-4 text-white">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white hover:bg-white/10 p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
            <div className="w-8 h-8 bg-orange-400 rounded-lg flex items-center justify-center relative animate-pulse">
              <div className="w-6 h-6 bg-orange-600 rounded-lg relative">
                {/* Eyes */}
                <div className="w-1 h-1 bg-white rounded-full absolute top-1.5 left-1"></div>
                <div className="w-1 h-1 bg-white rounded-full absolute top-1.5 right-1"></div>
                {/* Smile */}
                <div className="w-3 h-0.5 bg-white rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                {/* Cap/Hair */}
                <div className="w-4 h-1.5 bg-yellow-600 rounded-t-lg absolute -top-0.5 left-1/2 transform -translate-x-1/2"></div>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold">Fix it Felix</h1>
            <p className="text-sm text-white/80">AI Diagnostics Assistant</p>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="space-y-4">
          {conversation.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-2xl",
                  msg.type === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white/90 backdrop-blur border border-white/20 text-gray-900"
                )}
              >
                {msg.type === "felix" && (
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-orange-400 flex items-center justify-center relative">
                      <div className="w-5 h-5 bg-orange-600 rounded-lg relative">
                        {/* Eyes */}
                        <div className="w-1 h-1 bg-white rounded-full absolute top-1 left-1"></div>
                        <div className="w-1 h-1 bg-white rounded-full absolute top-1 right-1"></div>
                        {/* Smile */}
                        <div className="w-2 h-0.5 bg-white rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2"></div>
                        {/* Cap */}
                        <div className="w-3 h-1 bg-yellow-600 rounded-t absolute -top-0.5 left-1/2 transform -translate-x-1/2"></div>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-600">Felix</span>
                  </div>
                )}
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Media Menu Overlay */}
      {showMediaMenu && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowMediaMenu(false)}>
          <div className="absolute bottom-24 left-4 bg-white rounded-xl shadow-lg p-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAudioRecord}
                className={cn(
                  "justify-start space-x-3 h-12",
                  isRecording && "bg-red-50 text-red-600"
                )}
              >
                <Mic className="w-5 h-5" />
                <span>{isRecording ? "Stop Recording" : "Voice Note"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePhotoCapture}
                className="justify-start space-x-3 h-12"
              >
                <Camera className="w-5 h-5" />
                <span>Photo</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVideoRecord}
                className="justify-start space-x-3 h-12"
              >
                <Video className="w-5 h-5" />
                <span>Video</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3">
          <div className="flex items-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMediaMenu(!showMediaMenu)}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            <Textarea
              placeholder="Ask Felix about your Ferrari..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
