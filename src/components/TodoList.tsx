import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Edit, 
  Calendar,
  Tag,
  AlertTriangle,
  Clock
} from "lucide-react";
import { TodoForm } from "./TodoForm";

interface TodoListProps {
  todos: any[];
  loading: boolean;
}

export const TodoList = ({ todos, loading }: TodoListProps) => {
  const { toggleTodo, deleteTodo } = useTodo();
  const [editingTodo, setEditingTodo] = useState<any>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800';
    }
  };

  const isOverdue = (dueDate: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Loading tasks...</span>
        </div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No tasks found</h3>
        <p className="text-muted-foreground">Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card 
          key={todo._id} 
          className={`shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-apple ${
            todo.completed ? 'opacity-75' : ''
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* Checkbox */}
              <button
                onClick={() => handleToggle(todo._id)}
                className="mt-1 p-1 rounded-full hover:bg-muted/50 transition-colors duration-200"
              >
                {todo.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-medium text-foreground mb-2 ${
                      todo.completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {todo.title}
                    </h3>
                    
                    {todo.description && (
                      <p className={`text-sm text-muted-foreground mb-3 ${
                        todo.completed ? 'line-through' : ''
                      }`}>
                        {todo.description}
                      </p>
                    )}

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {/* Priority Badge */}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(todo.priority)}`}
                      >
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                      </Badge>

                      {/* Category */}
                      {todo.category && todo.category !== 'general' && (
                        <Badge variant="secondary" className="text-xs">
                          {todo.category}
                        </Badge>
                      )}

                      {/* Due Date */}
                      {todo.dueDate && (
                        <div className={`flex items-center space-x-1 text-xs ${
                          isOverdue(todo.dueDate) && !todo.completed 
                            ? 'text-red-600 dark:text-red-400' 
                            : 'text-muted-foreground'
                        }`}>
                          <Calendar className="h-3 w-3" />
                          <span>
                            {isOverdue(todo.dueDate) && !todo.completed && (
                              <AlertTriangle className="h-3 w-3 inline mr-1" />
                            )}
                            {formatDate(todo.dueDate)}
                          </span>
                        </div>
                      )}

                      {/* Tags */}
                      {todo.tags && todo.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <div className="flex flex-wrap gap-1">
                            {todo.tags.slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {todo.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{todo.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Created Date */}
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(todo.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => setEditingTodo(todo)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-muted/50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(todo._id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Edit Modal */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-xl shadow-apple-soft max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Edit Task</h3>
              <TodoForm 
                todo={editingTodo} 
                onClose={() => setEditingTodo(null)} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
