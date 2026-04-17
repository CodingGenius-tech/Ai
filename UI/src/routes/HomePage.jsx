import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ImagePlus, Mic } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleStartConversation = () => {
    if (!inputValue.trim()) return;
    navigate("/chat", { state: { initialMessage: inputValue } });
  };

  const handleCreateImage = () => {
    const imagePrompt = inputValue.trim() || "Create a beautiful image";
    navigate("/chat", {
      state: { initialMessage: imagePrompt, isImageRequest: true },
    });
  };

  const handleVoiceInput = () => {
    navigate("/chat", {
      state: { initialMessage: "Voice input activated!", isVoice: true },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e]">
      <div className="w-full max-w-2xl text-center space-y-8">
        <h1 className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
          SmartGuru
        </h1>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-white"
          />

          <button onClick={handleVoiceInput}>
            <Mic />
          </button>

          <button onClick={handleCreateImage}>
            <ImagePlus />
          </button>

          <button onClick={handleStartConversation}>
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}