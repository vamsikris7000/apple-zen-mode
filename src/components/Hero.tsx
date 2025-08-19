import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto text-center">
        <div className="space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Logo */}
          <div className="flex justify-center">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain rounded-xl sm:rounded-2xl transition-all duration-300"
            />
          </div>
          
          {/* Tagline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-light text-foreground tracking-tight leading-tight">
              Welcome to Apple Zen Mode
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground font-light leading-relaxed px-2">
              Secure authentication with Apple-inspired design
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col space-y-3 sm:space-y-4 w-full max-w-xs sm:max-w-sm mx-auto">
            <Button 
              onClick={() => navigate('/login')}
              variant="default" 
              className="w-full rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-xl px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};