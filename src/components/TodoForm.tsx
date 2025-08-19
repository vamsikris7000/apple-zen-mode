import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Save, Calendar, Tag } from "lucide-react";

interface TodoFormProps {
  onClose: () => void;
  todo?: any; // For editing existing todos
}

export const TodoForm = ({ onClose, todo }: TodoFormProps) => {
  const { createTodo, updateTodo } = useTodo();
  const [formData, setFormData] = useState({
    title: todo?.title || "",
    description: todo?.description || "",
    priority: todo?.priority || "medium",
    dueDate: todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : "",
    category: todo?.category || "general",
    tags: todo?.tags?.join(", ") || ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const todoData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0)
      };

      if (todo) {
        await updateTodo(todo._id, todoData);
      } else {
        await createTodo(todoData);
      }
      
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save todo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium text-foreground">
          Task Title *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Enter task title"
          className="h-10 rounded-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          required
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium text-foreground">
          Description
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Add a description (optional)"
          className="min-h-[80px] rounded-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
        />
      </div>

      {/* Priority and Due Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="priority" className="text-sm font-medium text-foreground">
            Priority
          </Label>
          <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
            <SelectTrigger className="h-10 rounded-lg border-border/50 bg-background/50 backdrop-blur-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-sm font-medium text-foreground">
            Due Date
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="pl-10 h-10 rounded-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Category and Tags */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium text-foreground">
            Category
          </Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            placeholder="e.g., Work, Personal"
            className="h-10 rounded-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium text-foreground">
            Tags
          </Label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="pl-10 h-10 rounded-lg border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert className="border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20">
          <AlertDescription className="text-red-600 dark:text-red-400 text-sm">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-2">
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {todo ? "Update Task" : "Create Task"}
            </>
          )}
        </Button>
        
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          className="h-10 px-3 rounded-lg border-border/50 hover:bg-muted/50 transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
