import { useState } from "react";
import { useTodo } from "@/contexts/TodoContext";
import { useAuth } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TodoList } from "@/components/TodoList";
import { TodoForm } from "@/components/TodoForm";
import { TodoStats } from "@/components/TodoStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Target,
  Calendar,
  Filter
} from "lucide-react";
import logo from "@/assets/logo.png";

const TodoApp = () => {
  const { todos, stats, loading } = useTodo();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'pending') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const pendingTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl transition-all duration-300"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight mb-2">
              Todo Manager
            </h1>
            <p className="text-lg text-muted-foreground font-light">
              Organize your tasks with Apple-inspired simplicity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <TodoStats />
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Todo Form */}
            <div className="lg:col-span-1">
              <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Task</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showForm ? (
                    <TodoForm onClose={() => setShowForm(false)} />
                  ) : (
                    <Button
                      onClick={() => setShowForm(true)}
                      className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Todo
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Todo Lists */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="all" className="w-full">
                <div className="flex items-center justify-between mb-6">
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="all" onClick={() => setFilter('all')}>
                      All ({todos.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending" onClick={() => setFilter('pending')}>
                      Pending ({pendingTodos.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" onClick={() => setFilter('completed')}>
                      Done ({completedTodos.length})
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filter</span>
                  </div>
                </div>

                <TabsContent value="all" className="space-y-4">
                  <TodoList todos={filteredTodos} loading={loading} />
                </TabsContent>

                <TabsContent value="pending" className="space-y-4">
                  <TodoList todos={pendingTodos} loading={loading} />
                </TabsContent>

                <TabsContent value="completed" className="space-y-4">
                  <TodoList todos={completedTodos} loading={loading} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TodoApp;
