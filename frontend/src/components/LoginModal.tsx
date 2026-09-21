import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { api, setAuthToken, setUserInfo } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

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
        description: "Successfully logged in",
      });
      navigate("/projects");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <div className="fixed top-4 right-4 z-50"><ThemeToggle /></div>
      {/* Left panel (>= lg) */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#111111] dark:bg-[#0c0d12] text-[#FAFAFA] p-12 flex-col justify-between border-r border-[#27272A] relative">
        <Logo size="default" inverted />

        <div className="max-w-md space-y-8 my-auto">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">
              Workspace Access
            </p>
            <h1 className="font-display text-3xl font-medium tracking-tight leading-snug text-white">
              Sign in to continue building.
            </h1>
            <p className="mt-3 text-sm text-zinc-300/90 leading-relaxed">
              Open your projects, view live streaming events, and refine your codebase.
            </p>
          </div>

          {/* Static illustration with real UI vocabulary */}
          <div className="rounded-[6px] border border-white/10 bg-white/[0.04] p-5 space-y-3.5 backdrop-blur-xs">
            <div className="flex items-center gap-2.5 text-[12px]">
              <span className="w-1.5 h-1.5 rounded-full border border-emerald-400/80 bg-emerald-400/30 shrink-0 inline-block" />
              <span className="text-zinc-300 font-sans">Thought: planning project views</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400">Read</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-white/10 border border-white/15 text-zinc-200 text-[11px]">
                App.tsx
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-[10px] uppercase tracking-wider text-signal font-medium">Edited</span>
              <span className="px-2 py-0.5 rounded-[4px] bg-white/10 border border-white/15 text-zinc-200 text-[11px]">
                Index.tsx
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-zinc-500 font-mono">
          CodeSmith Studio
        </div>
      </div>

      {/* Right panel (form) */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Logo size="default" />
          </div>

          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              Sign in
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm rounded-[6px] bg-background border-input focus-visible:ring-signal"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 text-sm rounded-[6px] bg-background border-input focus-visible:ring-signal"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-[6px] text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground underline underline-offset-4 hover:text-signal font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
