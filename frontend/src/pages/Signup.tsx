import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Sparkles, Star, ArrowRight, Lock, Mail, User } from "lucide-react";
import { api, setAuthToken, setUserInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CelestialBackground } from "@/components/celestial/CelestialBackground";
import { CelestialOrb } from "@/components/celestial/CelestialOrb";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast({
        title: "Missing details",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.signup({ name, username: email, password });
      setAuthToken(response.token);
      setUserInfo(response.user);
      toast({
        title: "Welcome to CodeSmith!",
        description: "Your celestial account has been created successfully",
      });
      navigate("/projects");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CelestialBackground
      className="min-h-screen w-full bg-background text-foreground relative selection:bg-cyan-500/30"
      contentClassName="min-h-screen w-full flex flex-col lg:flex-row items-stretch"
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left panel (>= lg) - Celestial Showcase: exactly 50% width, full height */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen bg-gradient-to-b from-purple-50/70 via-pink-50/30 to-cyan-50/50 dark:from-[#030712] dark:via-[#080c1e] dark:to-[#030712] text-foreground dark:text-white p-10 xl:p-14 flex-col justify-between border-r border-border/80 dark:border-purple-500/20 relative overflow-hidden backdrop-blur-md shrink-0">
        {/* Ambient lighting */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-cyan-300/30 dark:bg-cyan-500/15 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-purple-300/30 dark:bg-purple-600/15 blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <Logo size="default" />
        </div>

        <div className="max-w-md w-full mx-auto space-y-6 my-auto relative z-10 py-6">
          {/* Animated Celestial Orb */}
          <div className="flex justify-center -my-2">
            <CelestialOrb size="lg" glowColor="cyan" />
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 animate-pulse" />
              <span>Cosmic Developer Genesis</span>
            </div>
            <h1 className="font-display text-3xl xl:text-4xl font-semibold tracking-tight leading-tight text-foreground dark:text-white">
              Chart new constellations in software.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground dark:text-zinc-300/90 leading-relaxed">
              Create an account to begin engineering with autonomous AI pair programming, dynamic multi-file synthesis, and instant cloud previews.
            </p>
          </div>

          {/* Celestial Real-time Stream Card */}
          <div className="rounded-xl border border-border/80 dark:border-purple-500/20 bg-card/90 dark:bg-slate-950/70 p-5 space-y-3.5 backdrop-blur-xl shadow-xl dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-[12px]">
                <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 shadow-[0_0_8px_#38bdf8] shrink-0 inline-block animate-pulse" />
                <span className="font-sans font-medium text-foreground dark:text-zinc-200">
                  System Ready: Initializing Project Core
                </span>
              </div>
              <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 uppercase px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                Astral Mesh
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Scaffold</span>
              <span className="px-2.5 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-[11px] flex items-center gap-1.5">
                <Star className="w-2.5 h-2.5 text-purple-500 dark:text-purple-400" />
                package.json
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-medium">Ready</span>
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-[11px] flex items-center gap-1.5">
                <Sparkles className="w-2.5 h-2.5 text-cyan-500 dark:text-cyan-400" />
                App.tsx
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground dark:text-zinc-400 font-mono relative z-10 pt-4 border-t border-border/60 dark:border-white/10">
          <span>CodeSmith Astral Studio</span>
          <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Gateway Online
          </span>
        </div>
      </div>

      {/* Right panel - Registration Form: Exactly half width on lg, centered */}
      <div className="flex-1 min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 lg:p-14 relative z-10">
        <div className="w-full max-w-md mx-auto my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="default" />
          </div>

          <div className="celestial-glass-card p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            {/* Soft decorative star glow in corner */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

            <div className="mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight celestial-gradient-text">
                Create account
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5">
                Embark on your journey with the CodeSmith cosmos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-500" />
                  Explorer Name
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder="Cosmic Voyager"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 text-sm rounded-lg bg-background border-input focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-purple-500/30 transition-all text-foreground"
                    disabled={isLoading}
                    autoComplete="name"
                  />
                </div>
              </div>

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
                    className="h-10 text-sm rounded-lg bg-background border-input focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-purple-500/30 transition-all text-foreground"
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-500" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 text-sm rounded-lg bg-background border-input focus-visible:border-cyan-400 focus-visible:ring-2 focus-visible:ring-purple-500/30 transition-all text-foreground"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-medium rounded-lg text-sm shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Astral Account...</span>
                  </>
                ) : (
                  <>
                    <span>Initialize Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/60 text-center">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 underline underline-offset-4 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </CelestialBackground>
  );
}
