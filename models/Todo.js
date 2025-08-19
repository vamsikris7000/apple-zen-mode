import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    default: null
  },
  userEmail: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    default: 'general',
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
todoSchema.index({ userEmail: 1, completed: 1 });
todoSchema.index({ userEmail: 1, dueDate: 1 });
todoSchema.index({ userEmail: 1, priority: 1 });

// Virtual for formatted due date
todoSchema.virtual('formattedDueDate').get(function() {
  if (!this.dueDate) return null;
  return this.dueDate.toLocaleDateString();
});

// Method to check if todo is overdue
todoSchema.methods.isOverdue = function() {
  if (!this.dueDate || this.completed) return false;
  return new Date() > this.dueDate;
};

// Method to toggle completion
todoSchema.methods.toggleComplete = function() {
  this.completed = !this.completed;
  this.updatedAt = new Date();
  return this.save();
};

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
