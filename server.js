import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Todo from './models/Todo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Middleware
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());

// Admin credentials from environment variables
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Check credentials against environment variables
    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // For simplicity, we're comparing plain text passwords
    // In production, you should hash the stored password
    if (password !== ADMIN_PASSWORD) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { email: ADMIN_EMAIL, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        email: ADMIN_EMAIL,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Verify token endpoint
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Logout endpoint (client-side token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true });
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user
  });
});

// ===== TODO ROUTES =====

// Get all todos for a user
app.get('/api/todos', authenticateToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userEmail: req.user.email })
      .sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// Create a new todo
app.post('/api/todos', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, dueDate, category, tags } = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = new Todo({
      title: title.trim(),
      description: description?.trim() || '',
      priority: priority || 'medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      category: category?.trim() || 'general',
      tags: tags || [],
      userEmail: req.user.email
    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update a todo
app.put('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, dueDate, category, tags } = req.body;

    const todo = await Todo.findOne({ _id: id, userEmail: req.user.email });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    if (title !== undefined) todo.title = title.trim();
    if (description !== undefined) todo.description = description.trim();
    if (completed !== undefined) todo.completed = completed;
    if (priority !== undefined) todo.priority = priority;
    if (dueDate !== undefined) todo.dueDate = dueDate ? new Date(dueDate) : null;
    if (category !== undefined) todo.category = category.trim();
    if (tags !== undefined) todo.tags = tags;

    todo.updatedAt = new Date();
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete a todo
app.delete('/api/todos/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, userEmail: req.user.email });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Toggle todo completion
app.patch('/api/todos/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOne({ _id: id, userEmail: req.user.email });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.completed = !todo.completed;
    todo.updatedAt = new Date();
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({ error: 'Failed to toggle todo' });
  }
});

// Get todo statistics
app.get('/api/todos/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { userEmail: req.user.email } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          highPriority: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$dueDate', null] }, { $lt: ['$dueDate', new Date()] }, { $eq: ['$completed', false] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    res.json(stats[0] || { total: 0, completed: 0, pending: 0, highPriority: 0, overdue: 0 });
  } catch (error) {
    console.error('Error fetching todo stats:', error);
    res.status(500).json({ error: 'Failed to fetch todo statistics' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin email: ${ADMIN_EMAIL}`);
});
