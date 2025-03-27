import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";
import MessageBoard from "./pages/MessageBoard";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";

export default function App() {
  const [visitorCount, setVisitorCount] = useState(0);
  const isCounted = useRef(false);

  useEffect(() => {
    if (!isCounted.current) {
      setVisitorCount((prev) => prev + 1);
      isCounted.current = true;
    }
  }, []);

  return (
    <Router>
      <div className="w-screen h-screen bg-gray-200">
        {/* 固定導航欄 */}
        <nav className="fixed top-0 left-0 w-full bg-black text-white p-4 flex justify-between">
          <span className="font-bold">網路攻防實習</span>
          <span className="font-bold">Visitor Count: {visitorCount}</span>
          <div>
          <Link to="/" className="text-white mr-4 p-2 rounded">Home</Link>
          <Link to="/about" className="text-white p-2 rounded">About</Link>
          <Link to="/users" className="text-white p-2 rounded">Users</Link>
          <Link to="/createuser" className="text-white p-2 rounded">Create User</Link>
          </div>
        </nav>

        <div className="mt-16">
          <Routes>
            <Route path="/" element={<MessageBoard />} />
            <Route path="/about" element={<About />} />
            <Route path="/users" element={<Users />} />
            <Route path="/createuser" element={<CreateUser />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
