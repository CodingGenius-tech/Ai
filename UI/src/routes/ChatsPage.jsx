import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, ImagePlus, Mic, Home as HomeIcon } from "lucide-react";

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

  const bottomRef = useRef();

  useEffect(() => {
    if (initialMessage) {
      sendMessage(initialMessage);
    }
  }, []);

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
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#0a0a1a] via-[#1a1a2e] to-[#16213e] text-white">

      {/* Header */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="text-xl">SmartGuru</h1>
        <button onClick={() => navigate("/")}>
          <HomeIcon />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[70%] p-3 rounded-xl ${
              msg.isUser
                ? "ml-auto bg-blue-600"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && <p>Thinking...</p>}

        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 p-2 bg-white/10 rounded"
        />

        <button onClick={() => sendMessage()}>
          <Send />
        </button>
      </div>
    </div>
  );
}