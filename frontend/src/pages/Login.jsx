import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import '../App.css';

function Login() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        if (!recaptchaValue) {
          setError('Please complete the reCAPTCHA verification');
          setIsLoading(false);
          return;
        }

        // For login, use JSON format
        const loginData = { 
          name, 
          password,
          recaptchaToken: recaptchaValue 
        };
        console.log('Attempting login with:', { name, password: '***' });
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        });

        console.log('Login response status:', response.status);
        const data = await response.json();
        console.log('Login response data:', data);

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update auth context
        login(data.token, data.user);
        
        // Redirect to home page
        navigate('/');
      } else {
        // For registration, use FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);
        
        if (avatar) {
          formData.append('avatar', avatar);
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update auth context
        login(data.token, data.user);
        
        // Redirect to home page
        navigate('/');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    console.log('reCAPTCHA value:', value);
    setRecaptchaValue(value);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.match('image/(jpeg|png)')) {
        setError('Only .jpg and .png files are allowed');
        return;
      }
      setAvatar(file);
      setError('');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        {isLogin && (
          <div className="form-group">
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              theme="light"
            />
          </div>
        )}
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="avatar">Avatar (optional):</label>
            <input
              type="file"
              id="avatar"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              disabled={isLoading}
            />
            <p className="text-sm text-gray-500 mt-1">
              Max file size: 5MB. Supported formats: JPG, PNG
            </p>
          </div>
        )}
        <button 
          type="submit" 
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
        <button 
          type="button" 
          className="toggle-button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setAvatar(null);
            setRecaptchaValue(null);
          }}
          disabled={isLoading}
        >
          {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  );
}

export default Login; 