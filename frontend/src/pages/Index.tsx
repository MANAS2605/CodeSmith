import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/api";
import { Logo } from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/projects");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-5">
        <Logo size="lg" />
        {/* Thin indeterminate progress bar */}
        <div className="w-36 h-[2px] bg-border rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 bg-signal w-1/3 rounded-full animate-[pulse_1.2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
};

export default Index;
