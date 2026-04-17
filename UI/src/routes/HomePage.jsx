import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ImagePlus, Mic } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [inputValue, setInputValue] = useState("");

  // 🔥 Typing placeholder states
  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const navigate = useNavigate();

  const placeholderTexts = [
    "Ask me anything...",
    "Generate images instantly...",
    "Talk to AI using voice...",
    "Get smart answers in seconds...",
  ];

  // 🔥 Typing effect
  useEffect(() => {
    if (inputValue) return;

    const currentText = placeholderTexts[placeholderIndex];

    if (charIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setPlaceholder((prev) => prev + currentText[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setPlaceholder("");
        setCharIndex(0);
        setPlaceholderIndex(
          (prev) => (prev + 1) % placeholderTexts.length
        );
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, placeholderIndex, inputValue]);

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
    <div className="relative h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#1e1b4b,_#020617)] text-white overflow-hidden">

      {/* Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-10 left-1/2 -translate-x-1/2"></div>

      {/* Main */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl text-center space-y-10 z-10"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          SmartGuru
        </motion.h1>
        <motion.p
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="text-gray-400 text-sm md:text-base"
>
  Your intelligent AI companion for conversations, creativity, and assistance
</motion.p>

        {/* Input Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-xl"
        >
          {/* Input */}
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 caret-white"
          />

          {/* Voice */}
          <button
            onClick={handleVoiceInput}
            className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
          >
            <Mic size={18} />
          </button>

          {/* Image */}
          <button
            onClick={handleCreateImage}
            className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition"
          >
            <ImagePlus size={18} />
          </button>

          {/* Send */}
          <button
            onClick={handleStartConversation}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition"
          >
            <Send size={18} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}