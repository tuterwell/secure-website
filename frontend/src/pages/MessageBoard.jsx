import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useAuth } from "../context/AuthContext";

export default function MessageBoard() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { isLoggedIn, user } = useAuth();

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load messages');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSendMessage = async () => {
    if (!isLoggedIn) {
      setError('Please login to post messages');
      return;
    }

    if (message.trim() === "") return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to post message');

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setMessage("");
    } catch (err) {
      console.error('Error posting message:', err);
      setError('Failed to post message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!isLoggedIn) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete message');
      }

      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(err.message || 'Failed to delete message');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-center">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold">Message Board</h2>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="space-y-2">
            {posts.map((post) => (
              <div key={post.id} className="p-3 bg-gray-100 rounded-lg text-left relative">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {post.user.avatar ? (
                      <img 
                        src={`${import.meta.env.VITE_API_URL}${post.user.avatar}`}
                        alt={`${post.user.name}'s avatar`}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">
                          {post.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">{post.user.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {isLoggedIn && post.user.id === user?.id && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-500 hover:text-red-700 text-sm p-1"
                          title="Delete message"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="text-gray-600 mt-1">{post.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex space-x-2 mt-4">
            <Input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder={isLoggedIn ? "Leave a message" : "Please login to post"}
              disabled={!isLoggedIn}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!isLoggedIn || isLoading || !message.trim()}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          </div>
          {!isLoggedIn && (
            <p className="text-sm text-gray-500 mt-2">
              Please login to post messages
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}