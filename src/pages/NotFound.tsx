import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>
      
      <div className="text-center relative z-10 animate-slide-up">
        <h1 className="mb-4 text-8xl font-bold text-glow">404</h1>
        <p className="mb-8 text-2xl text-muted-foreground">Quest not found</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-primary to-secondary neon-glow"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
