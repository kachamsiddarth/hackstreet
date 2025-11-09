import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { format, subDays } from "date-fns";

interface DailyProgress {
  date: string;
  bonus_points: number;
  xp: number;
}

const Progress = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<DailyProgress[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        fetchProgress(session.user.id);
      }
    });
  }, [navigate]);

  const fetchProgress = async (userId: string) => {
    const startDate = format(subDays(new Date(), 6), "yyyy-MM-dd");
    
    const { data, error } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("user_id", userId)
      .gte("date", startDate)
      .order("date", { ascending: true });

    if (!error && data) {
      // Fill in missing days with zero values
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = format(subDays(new Date(), 6 - i), "yyyy-MM-dd");
        const existing = data.find((d) => d.date === date);
        return existing || { date, bonus_points: 0, xp: 0 };
      });
      setProgress(last7Days);
    }
  };

  return (
    <div className="min-h-screen p-6 relative overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="max-w-6xl mx-auto pt-20 relative z-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-glow">Quest Progress</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Bonus Points Chart */}
          <Card className="p-6 glass-effect border-primary/30">
            <h2 className="text-2xl font-bold mb-6 text-primary">Daily Bonus Points</h2>
            <div className="space-y-4">
              {progress.map((day) => (
                <div key={`bp-${day.date}`} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{format(new Date(day.date), "MMM dd")}</span>
                    <span className="text-primary font-bold">{day.bonus_points} BP</span>
                  </div>
                  <div className="h-8 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${Math.min((day.bonus_points / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* XP Chart */}
          <Card className="p-6 glass-effect border-accent/30">
            <h2 className="text-2xl font-bold mb-6 text-accent">Daily XP</h2>
            <div className="space-y-4">
              {progress.map((day) => (
                <div key={`xp-${day.date}`} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{format(new Date(day.date), "MMM dd")}</span>
                    <span className="text-accent font-bold">{day.xp} XP</span>
                  </div>
                  <div className="h-8 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-secondary transition-all duration-500"
                      style={{ width: `${Math.min((day.xp / 100) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Progress;
