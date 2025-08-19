import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.error || "Login failed");
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        // Redirect to dashboard on successful login
        navigate('/dashboard');
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        <Card className={`shadow-apple-soft border-border/50 bg-card/50 backdrop-blur-sm ${shake ? 'animate-shake' : ''}`}>
          <CardHeader className="space-y-6 text-center pb-8">
            {/* Logo */}
            <div className="flex justify-center">
              <img 
                src={logo} 
                alt="Company Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl transition-all duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-light text-foreground tracking-tight">
                Welcome Back
              </CardTitle>
              <p className="text-sm text-muted-foreground font-light">
                Sign in to your account
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="pt-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground text-center">
                Demo credentials:
              </p>
              <p className="text-xs text-muted-foreground text-center font-mono">
                pvamsikrisreddy@gmail.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
