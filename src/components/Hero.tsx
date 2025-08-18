import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 sm:px-8 bg-background">
      <div className="max-w-md mx-auto text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <img 
            src={logo} 
            alt="Company Logo" 
            className="w-16 h-16 object-contain rounded-2xl"
          />
        </div>
        
        {/* Tagline */}
        <div className="space-y-4">
          <h1 className="text-2xl font-light text-foreground tracking-tight">
            Welcome to Our Project
          </h1>
          <p className="text-muted-foreground font-light">
            Built step by step, deployed with care
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="default" className="rounded-xl px-8 py-3 font-medium">
            Login
          </Button>
          <Button variant="outline" className="rounded-xl px-8 py-3 font-medium">
            Sign Up
          </Button>
        </div>
      </div>
    </section>
  );
};