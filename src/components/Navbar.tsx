import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Trophy, TrendingUp, Flame, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
    } else {
      toast.success("Logged out successfully");
      navigate("/");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 right-0 p-6 z-50">
      <div className="flex gap-3 glass-effect px-6 py-3 rounded-2xl border border-primary/30">
        <Button
          variant="ghost"
          size="sm"
          className={`transition-all ${isActive("/rewards") ? "bg-primary/20 text-primary" : "hover:bg-primary/10"}`}
          onClick={() => navigate("/rewards")}
        >
          <Trophy className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`transition-all ${isActive("/progress") ? "bg-secondary/20 text-secondary" : "hover:bg-secondary/10"}`}
          onClick={() => navigate("/progress")}
        >
          <TrendingUp className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`transition-all ${isActive("/streak") ? "bg-accent/20 text-accent" : "hover:bg-accent/10"}`}
          onClick={() => navigate("/streak")}
        >
          <Flame className="w-5 h-5" />
        </Button>
        <div className="w-px bg-border" />
        <Button
          variant="ghost"
          size="sm"
          className="hover:bg-destructive/10 hover:text-destructive transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
