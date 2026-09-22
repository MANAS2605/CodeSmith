import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Sparkles, Star, ArrowRight, Lock, Mail } from "lucide-react";
import { api, setAuthToken, setUserInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CelestialBackground } from "@/components/celestial/CelestialBackground";
import { CelestialOrb } from "@/components/celestial/CelestialOrb";

export function LoginModal() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.login({ username: email, password });
      setAuthToken(response.token);
      if (response.user) {
        setUserInfo(response.user);
      }
      toast({
        title: "Welcome back!",
        description: "Successfully connected to the celestial workspace",
      });
      navigate("/projects");
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CelestialBackground
      className="min-h-screen w-full bg-background text-foreground relative selection:bg-purple-500/30"
      contentClassName="min-h-screen w-full flex flex-col lg:flex-row items-stretch"
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel (>= lg) - Celestial Showcase: exactly 50% width, full height */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-b from-purple-50/70 via-pink-50/30 to-cyan-50/50 dark:from-[#0B071E] dark:via-[#2D1B4E]/90 dark:to-[#0B071E] text-foreground dark:text-white p-10 xl:p-14 flex-col justify-between border-r border-border/80 dark:border-[#6D28D9]/30 relative overflow-hidden backdrop-blur-md shrink-0">
        {/* Ambient lighting */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-purple-300/30 dark:bg-[#6D28D9]/20 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 rounded-full bg-cyan-300/30 dark:bg-[#06B6D4]/20 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <Logo size="default" />
        </div>

        <div className="max-w-md w-full mx-auto space-y-6 my-auto relative z-10 py-6">
          {/* Animated Celestial Orb */}
          <div className="flex justify-center -my-2">
            <CelestialOrb size="lg" glowColor="purple" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#6D28D9]/40 bg-[#6D28D9]/15 text-[#06B6D4] text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899] animate-pulse" />
              <span>Celestial Code Forge</span>
            </div>
            <h1 className="font-display text-3xl xl:text-4xl font-semibold tracking-tight leading-tight text-foreground dark:text-white">
              Forge intelligent applications across the cosmos.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground dark:text-zinc-300/90 leading-relaxed">
              Step into your celestial workspace. Stream live generative modifications, navigate file architectures, and deploy prototypes instantly.
            </p>
          </div>

          {/* Celestial Live Stream Illustration Card */}
          <div className="rounded-xl border border-border/80 dark:border-[#6D28D9]/40 bg-card/90 dark:bg-[#2D1B4E]/75 p-5 space-y-3.5 backdrop-blur-xl shadow-xl dark:shadow-[0_8px_32px_rgba(11,7,30,0.8)] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#06B6D4] shadow-[0_0_8px_#06B6D4] shrink-0 inline-block animate-pulse" />
                <span className="font-sans font-medium text-foreground dark:text-zinc-200">
                  Neural Engine: Synthesizing Components
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#06B6D4] uppercase px-2 py-0.5 rounded bg-[#06B6D4]/15 border border-[#06B6D4]/30">
                Live Cosmos
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-[#EC4899] font-medium">Read</span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#6D28D9]/15 border border-[#6D28D9]/30 text-[#EC4899] text-[11px] flex items-center gap-1.5">
                <Star className="w-2.5 h-2.5 text-[#EC4899]" />
                src/App.tsx
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-[#06B6D4] font-medium">Edited</span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-[#06B6D4] text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5 text-[#06B6D4]" />
                src/pages/Index.tsx
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-zinc-400 font-mono relative z-10 pt-4 border-t border-border/60 dark:border-white/10">
          <span>CodeSmith Astral Studio</span>
          <span className="text-[#06B6D4] flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-ping" />
            Connected to Orbit
          </span>
        </div>
      </div>

      {/* Right panel - Form Card: Centered on all screens, exactly half width on lg */}
      <div className="flex-1 min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10">
        <div className="w-full max-w-md mx-auto my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="default" />
          </div>

          <div className="celestial-glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Soft decorative star glow in corner */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight celestial-gradient-text">
                Welcome back
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Enter your credentials to enter your celestial workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-500" />
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="explorer@cosmos.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 text-sm rounded-lg bg-background border-input focus-visible:border-[#06B6D4] focus-visible:ring-2 focus-visible:ring-[#EC4899]/30 transition-all text-foreground"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#6D28D9]" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 text-sm rounded-lg bg-background border-input focus-visible:border-[#06B6D4] focus-visible:ring-2 focus-visible:ring-[#EC4899]/30 transition-all text-foreground"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-3 bg-gradient-to-r from-[#6D28D9] via-[#EC4899] to-[#06B6D4] hover:opacity-95 text-white font-medium rounded-lg text-sm shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all duration-300 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to Orbit...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/60 text-center">
              <p className="text-xs text-muted-foreground">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#06B6D4] hover:text-[#EC4899] underline underline-offset-4 transition-colors"
                >
                  Create Astral Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CelestialBackground>
  );
}
