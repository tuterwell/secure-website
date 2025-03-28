import { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import About from "./pages/About";
import MessageBoard from "./pages/MessageBoard";
import Users from "./pages/Users";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [visitorCount, setVisitorCount] = useState(0);
  const isCounted = useRef(false);
  const { isLoggedIn, user, logout } = useAuth();

  if (!isCounted.current) {
    setVisitorCount((prev) => prev + 1);
    isCounted.current = true;
  }

  return (
    <div className="w-screen h-screen bg-gray-200">
      {/* 固定導航欄 */}
      <nav className="fixed top-0 left-0 w-full bg-black text-white p-4 flex justify-between items-center">
        <span className="font-bold">網路攻防實習</span>
        <span className="font-bold">Visitor Count: {visitorCount}</span>
        <div className="flex items-center">
          <Link to="/" className="text-white mr-4 p-2 rounded hover:bg-gray-700">Home</Link>
          <Link to="/about" className="text-white mr-4 p-2 rounded hover:bg-gray-700">About</Link>
          <Link to="/users" className="text-white mr-4 p-2 rounded hover:bg-gray-700">Users</Link>
          <Link to="/createuser" className="text-white mr-4 p-2 rounded hover:bg-gray-700">Create User</Link>
          {isLoggedIn ? (
            <div className="flex items-center">
              <span className="text-white mr-4">Welcome, {user?.name}</span>
              <button 
                onClick={logout} 
                className="text-white p-2 rounded hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-white p-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="mt-16">
        <Routes>
          <Route path="/" element={<MessageBoard />} />
          <Route path="/about" element={<About />} />
          <Route path="/users" element={<Users />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
