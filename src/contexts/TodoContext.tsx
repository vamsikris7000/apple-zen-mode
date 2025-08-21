import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/api';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  category: string;
  tags: string[];
  userEmail: string;
  createdAt: string;
  updatedAt: string;
}

interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
  overdue: number;
}

interface TodoContextType {
  todos: Todo[];
  stats: TodoStats;
  loading: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  createTodo: (todoData: Partial<Todo>) => Promise<Todo>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<Todo>;
  deleteTodo: (id: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<Todo>;
  fetchStats: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [stats, setStats] = useState<TodoStats>({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0,
    overdue: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { token, user } = useAuth();

  const API_BASE = API_BASE_URL;

  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error('No authentication token');
    }

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      // Fallback to localStorage if MongoDB is not available
      console.warn('MongoDB not available, using localStorage fallback:', error);
      return handleLocalStorageRequest(endpoint, options);
    }
  };

  const handleLocalStorageRequest = async (endpoint: string, options: RequestInit = {}) => {
    const storageKey = `todos_${user?.email || 'default'}`;
    
    switch (endpoint) {
      case '/todos':
        if (options.method === 'GET') {
          const stored = localStorage.getItem(storageKey);
          return stored ? JSON.parse(stored) : [];
        } else if (options.method === 'POST') {
          const newTodo = JSON.parse(options.body as string);
          const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const todoWithId = { ...newTodo, _id: Date.now().toString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          stored.unshift(todoWithId);
          localStorage.setItem(storageKey, JSON.stringify(stored));
          return todoWithId;
        } else if (options.method === 'PUT') {
          const updates = JSON.parse(options.body as string);
          const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const updated = stored.map((todo: any) => 
            todo._id === updates._id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo
          );
          localStorage.setItem(storageKey, JSON.stringify(updated));
          return updated.find((todo: any) => todo._id === updates._id);
        } else if (options.method === 'DELETE') {
          const id = endpoint.split('/').pop();
          const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const filtered = stored.filter((todo: any) => todo._id !== id);
          localStorage.setItem(storageKey, JSON.stringify(filtered));
          return { message: 'Todo deleted successfully' };
        } else if (options.method === 'PATCH' && endpoint.includes('/toggle')) {
          const id = endpoint.split('/')[2];
          const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
          const updated = stored.map((todo: any) => 
            todo._id === id ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() } : todo
          );
          localStorage.setItem(storageKey, JSON.stringify(updated));
          return updated.find((todo: any) => todo._id === id);
        }
        break;
      case '/todos/stats':
        const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const total = stored.length;
        const completed = stored.filter((todo: any) => todo.completed).length;
        const pending = total - completed;
        const highPriority = stored.filter((todo: any) => todo.priority === 'high').length;
        const overdue = stored.filter((todo: any) => {
          if (!todo.dueDate || todo.completed) return false;
          return new Date(todo.dueDate) < new Date();
        }).length;
        return { total, completed, pending, highPriority, overdue };
    }
    
    throw new Error('Endpoint not supported in localStorage fallback');
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await makeRequest('/todos');
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await makeRequest('/todos/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const createTodo = async (todoData: Partial<Todo>): Promise<Todo> => {
    try {
      setError(null);
      const newTodo = await makeRequest('/todos', {
        method: 'POST',
        body: JSON.stringify(todoData),
      });
      setTodos(prev => [newTodo, ...prev]);
      await fetchStats();
      return newTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    try {
      setError(null);
      const updatedTodo = await makeRequest(`/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      await fetchStats();
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      setError(null);
      await makeRequest(`/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(prev => prev.filter(todo => todo._id !== id));
      await fetchStats();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const toggleTodo = async (id: string): Promise<Todo> => {
    try {
      setError(null);
      const updatedTodo = await makeRequest(`/todos/${id}/toggle`, {
        method: 'PATCH',
      });
      setTodos(prev => prev.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
      await fetchStats();
      return updatedTodo;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle todo';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Fetch todos when user is authenticated
  useEffect(() => {
    if (token) {
      fetchTodos();
      fetchStats();
    } else {
      setTodos([]);
      setStats({ total: 0, completed: 0, pending: 0, highPriority: 0, overdue: 0 });
    }
  }, [token]);

  const value: TodoContextType = {
    todos,
    stats,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    fetchStats,
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};
