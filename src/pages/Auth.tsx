import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Github } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = isSignUp
      ? "Sign Up for Senviok | Developer-First Email & SMS"
      : "Sign In to Senviok | Developer-First Email & SMS";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        isSignUp
          ? "Create a Senviok account and start sending transactional emails and SMS notifications. Low latency, NDPR compliance, developer-first tooling."
          : "Access your Senviok developer dashboard. Manage verified sending domains, API keys, webhook configurations, and track analytics."
      );
    }
  }, [isSignUp]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    
    if (code) {
      // Clean query parameters from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const handleOAuthCallback = async () => {
        setLoading(true);
        const toastId = toast.loading("Authenticating with GitHub...");
        try {
          const API_URL = import.meta.env.VITE_API_URL || "https://api.senviok.live";
          const res = await fetch(`${API_URL}/v1/auth/github/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Code: code, RedirectUri: "http://localhost:5173/auth" })
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.Message || errData.message || "GitHub OAuth failed.");
          }

          const data = await res.json();
          localStorage.setItem("senviok_token", data.token);
          
          toast.success("Successfully logged in with GitHub!", { id: toastId });
          window.location.href = "/dashboard";
        } catch (err: any) {
          console.error(err);
          toast.error(err.message || "Failed to authenticate with GitHub.", { id: toastId });
        } finally {
          setLoading(false);
        }
      };
      handleOAuthCallback();
    }
  }, [navigate]);

  const handleGithubLogin = () => {
    const clientId = "Ov23liH8eYp70IFiCLGn";
    const redirectUri = encodeURIComponent("http://localhost:5173/auth");
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password, name)
      : await signIn(email, password);

    if (error) {
      toast.error(error.message);
    } else if (isSignUp) {
      toast.success("Check your email to confirm your account!");
    } else {
      navigate("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="relative w-full max-w-md">
        <Link 
          id="auth-back-to-home"
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="glass-card shadow-elegant">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Logo size="md" />
            </div>
            <CardTitle>{isSignUp ? "Create your account" : "Welcome back"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Start sending emails in minutes" : "Sign in to your dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="auth-name">Your Name</Label>
                  <Input
                    id="auth-name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="auth-email">Email Address</Label>
                <Input
                  id="auth-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <Button 
                id="auth-submit-btn"
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#050b07] px-2.5 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              id="auth-github-btn"
              variant="outline"
              type="button"
              className="w-full bg-card hover:bg-muted/40 border-border/50 text-foreground py-5 flex items-center justify-center"
              onClick={handleGithubLogin}
              disabled={loading}
            >
              <Github className="mr-2 h-4.5 w-4.5" />
              GitHub
            </Button>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                id="auth-toggle-mode-btn"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:underline font-medium"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
