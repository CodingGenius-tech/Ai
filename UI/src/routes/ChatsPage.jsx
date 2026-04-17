import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, Home as HomeIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialMessage = location.state?.initialMessage;

  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm SmartGuru. How can I help you?",
      isUser: false,
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const hassent = useRef(false);
  const bottomRef = useRef(null);

  useEffect(() => {
  if (initialMessage && !hassent.current) {
    sendMessage(initialMessage);
    hassent.current = true;
  }
}, [initialMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (msg) => {
    const text = msg || inputValue;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { text, isUser: true }]);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.reply, isUser: false },
      ]);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="relative h-screen flex flex-col bg-[radial-gradient(circle_at_top,_#1e1b4b,_#020617)] text-white overflow-hidden">

      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full top-10 left-1/2 -translate-x-1/2"></div>

      {/* Header */}
      <div className="p-4 flex justify-between items-center backdrop-blur-md bg-white/5 border-b border-white/10 z-10">
        <h1 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          SmartGuru
        </h1>

        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <HomeIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.isUser
                ? "ml-auto bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "mr-auto bg-gradient-to-r from-[#1e293b] to-[#334155] text-gray-200 shadow-md border border-white/10"
            }`}
          >
            {msg.text}
          </motion.div>
        ))}

        {/* Loading Animation */}
        {loading && (
          <div className="flex gap-1 text-gray-400">
            <span className="animate-bounce">●</span>
            <span className="animate-bounce delay-100">●</span>
            <span className="animate-bounce delay-200">●</span>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 z-10">
        <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <button
            onClick={() => sendMessage()}
            className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 hover:scale-105 transition"
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}