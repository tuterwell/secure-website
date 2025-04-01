import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import { PrismaClient } from '@prisma/client';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration for cloud deployment
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));

// CSRF Protection with cloud deployment settings
const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: true, // 在生產環境中必須使用 HTTPS
    sameSite: 'none', // 允許跨域 cookie
    domain: process.env.COOKIE_DOMAIN || 'localhost' // 設置 cookie 域名
  }
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);

// Apply CSRF protection to all routes except auth routes
app.use('/api', csrfProtection);
app.use('/api/posts', postsRoutes);

// CSRF token route
app.get('/api/csrf-token', (req, res) => {
  // Generate a new CSRF token
  const token = req.csrfToken();
  // Set the token in a cookie
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    domain: process.env.COOKIE_DOMAIN || '.your-domain.com'
  });
  // Send the token in the response
  res.json({ csrfToken: token });
});

// Database connection check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ message: 'Invalid CSRF token' });
  }
  console.error('Global error:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message 
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit();
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});