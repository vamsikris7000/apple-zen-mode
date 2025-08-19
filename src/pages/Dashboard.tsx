import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LogOut, User, Shield, Calendar, CheckSquare } from "lucide-react";
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
          {/* Welcome Section */}
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

          {/* User Info Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Account Information
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-lg font-medium text-foreground">{user?.email}</p>
                  <p className="text-sm text-muted-foreground mt-2">Role</p>
                  <p className="text-lg font-medium text-foreground capitalize">{user?.role}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Security Status
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Authentication</p>
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">Active</p>
                  <p className="text-sm text-muted-foreground mt-2">Session</p>
                  <p className="text-lg font-medium text-foreground">Valid</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Last Login
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground ml-auto" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="text-lg font-medium text-foreground">
                    {new Date().toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Time</p>
                  <p className="text-lg font-medium text-foreground">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="text-center">
            <Card className="shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => navigate('/todos')}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02]"
                >
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Manage Tasks
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full h-12 rounded-xl border-border/50 hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-all duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
