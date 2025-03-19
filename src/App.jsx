import { useState, useEffect, useRef } from "react";
import HomePage from "./pages/HomePage";
import MessageBoard from "./pages/MessageBoard";


export default function App() {
  const [visitorCount, setVisitorCount] = useState(0);
  const [view, setView] = useState("home");
  const isCounted = useRef(false);

  useEffect(() => {
    if (!isCounted.current) {
      setVisitorCount((prev) => prev + 1);
      isCounted.current = true;
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-200">
      {/* 固定導航欄 */}
      <nav className="fixed top-0 left-0 w-full bg-black text-white p-4 flex justify-between">
        <span className="font-bold">網路攻防實習</span>
        <span className="font-bold">Visitor Count: {visitorCount}</span>
        <div>
          <button onClick={() => setView("home")} className="bg-blue-600 mr-4">
            Home
          </button>
          <button onClick={() => setView("chat")} className="bg-blue-600">
            Message Board
          </button>
        </div>
      </nav>

      <div className="mt-16">
        {view === "home" ? <HomePage /> : <MessageBoard />}
      </div>
    </div>
  );
}