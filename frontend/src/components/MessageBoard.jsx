import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function MessageBoard() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages');
      console.error('Error fetching messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newMessage })
      });

      if (!response.ok) {
        throw new Error('Failed to post message');
      }

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to post message');
      console.error('Error posting message:', err);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }

      setMessages(messages.filter(msg => msg.id !== messageId));
    } catch (err) {
      setError('Failed to delete message');
      console.error('Error deleting message:', err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading messages...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Message Board</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Write your message..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                {message.user.avatar ? (
                  <img 
                    src={`${import.meta.env.VITE_API_URL}${message.user.avatar}`}
                    alt={`${message.user.name}'s avatar`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">
                      {message.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{message.user.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {user && user.id === message.userId && (
                    <button
                      onClick={() => handleDelete(message.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MessageBoard;


