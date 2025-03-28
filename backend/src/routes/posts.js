import express from 'express';
import { getPosts, createPost, deletePost } from '../controllers/posts.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Get all posts (public)
router.get('/', getPosts);

// Create a new post (requires authentication)
router.post('/', auth, createPost);

// Delete a post (requires authentication and ownership)
router.delete('/:id', auth, deletePost);

export default router; 