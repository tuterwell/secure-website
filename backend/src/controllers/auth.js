import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

export const register = async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log('Register attempt for user:', name);

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { name }
    });

    if (existingUser) {
      console.log('User already exists:', name);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle avatar upload
    let avatarPath = null;
    if (req.file) {
      // Store relative path in database
      avatarPath = `/uploads/avatars/${req.file.filename}`;
      console.log('Avatar uploaded:', avatarPath);
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        avatar: avatarPath
      }
    });

    console.log('User created successfully:', user.id);

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log('Login attempt for user:', name);

    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { name }
    });

    if (!user) {
      console.log('User not found:', name);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log('Invalid password for user:', name);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', name);
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
}; 