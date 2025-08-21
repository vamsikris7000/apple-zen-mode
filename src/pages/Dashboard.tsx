import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LogOut, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl transition-all duration-300"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground tracking-tight mb-4">
              Welcome to Dashboard
            </h1>
            <p className="text-lg text-muted-foreground font-light max-w-2xl mx-auto">
              You've successfully signed in to your secure account. Here's your personalized dashboard.
            </p>
          </div>

          {/* Services Section */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-light text-foreground tracking-tight mb-8 text-center">
              Our Services
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Manage Tasks Service */}
              <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-apple transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all duration-300">
                      <CheckSquare className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground mb-2">
                      Todo
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Organize and track your tasks with our intuitive todo management system.
                    </p>
                    <Button
                      onClick={() => navigate('/todos')}
                      className="w-full h-10 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02]"
                    >
                      Get Started
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Placeholder for future services */}
              <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm opacity-50">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted/50 flex items-center justify-center">
                      <div className="text-muted-foreground text-2xl">+</div>
                    </div>
                    <h3 className="text-xl font-medium text-muted-foreground mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      More services will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
