import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/HomePage.jsx";
import Chat from "./routes/ChatsPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}