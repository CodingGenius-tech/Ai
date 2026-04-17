import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function App() {
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      content:
        "Hello! I'm SmartGuru, your AI assistant. How can I help you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  
  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);

    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: currentPrompt }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "ai", content: data.reply },
      ]);

      if (isVoiceMode) {
        speakText(data.reply);
        setIsVoiceMode(false);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const generateImage = async () => {
  const lastUserMessage = [...messages]
    .reverse()
    .find((msg) => msg.role === "user");

  if (!lastUserMessage) return;

  
  
   // Limit to 50 chars for better results
  const imagePrompt = `Detailed digital art of ${lastUserMessage.content.slice(0, 50)}`;
  setLoading(true);

  try {
    const res = await fetch("http://localhost:5000/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: imagePrompt   }),
    });

    const data = await res.json();

    console.log("IMAGE URL:", data.image);

    if (!data.image) {
      console.error("No image returned", data);
      setLoading(false);
      return;
    }

    const imageSrc = data.isBase64
      ? `data:image/png;base64,${data.image}`
      : data.image;

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        image: imageSrc,
      },
    ]);

  } catch (err) {
    console.error(err);
  }

  setLoading(false);
};

  

  // 🎤 VOICE INPUT
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.start();

    setIsVoiceMode(true);

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setPrompt(text);
    };
  };

  // 🔊 SPEAK TEXT
  const speakText = (text) => {
    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="h-screen w-full flex flex-col items-center justify-between text-white bg-gradient-to-br from-[#0f0c29] via-[#1a1a40] to-[#24243e]">

      {/* Header */}
      <div className="mt-10 text-center">
        <h1 className="text-3xl font-semibold text-purple-400">
          SmartGuru
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Your intelligent AI companion
        </p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 w-full  max-w-3xl px-4 py-6 overflow-y-auto space-y-5">

        {messages.map((msg, i) => (
          <div
  key={i}
  className={`px-4 py-3 rounded-2xl ${
    msg.role === "user"
      ? "ml-auto bg-blue-600 text-white max-w-[75%]"
      : `mr-auto bg-white/10 backdrop-blur-md border border-white/20 ${
          msg.image ? "max-w-[90%]" : "max-w-[75%]"
        }`
  }`}
>
            {/* TEXT */}
            {msg.content && (
              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>
            )}

            {/* IMAGE (FIXED RENDER) */}
            {msg.image && (
              <img
                src={msg.image}
                alt="generated"
                className="w-full max-h-[400px] object-contai "
                onError={(e) => {
                  console.error("Image failed to load:", msg.image);
                  e.target.style.display = `msg.image`
                  ;
                }}
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 flex gap-1">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse delay-100">●</span>
            <span className="animate-pulse delay-200">●</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="w-full max-w-3xl mb-6 px-4">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-3 shadow-lg">

          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          <div className="flex gap-2">
            <button
              onClick={startVoice}
              className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500"
            >
              🎤
            </button>

            <button
              onClick={generateImage}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500"
            >
              🖼️
            </button>

            <button
              onClick={sendPrompt}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}