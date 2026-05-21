import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Shield, BarChart3, ArrowRight, Code, Mail, Globe, Lock, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      {/* Nav */}
      <nav className="relative border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#code" className="hover:text-foreground transition-colors">Developers</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div>
            {user ? (
              <Button asChild size="sm">
                <Link to="/dashboard">Dashboard <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                  <Link to="/auth">Get started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative container mx-auto px-4 pt-24 pb-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8 backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5" />
          Built for African startups · Low-latency · NDPR-ready
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.05]">
          Email & SMS <br />
          <span className="gradient-text">infrastructure</span>
          <br />for developers
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-8 leading-relaxed">
          Senviok is the developer-first delivery platform for transactional email,
          OTPs, and notifications — with queuing, retries, and real-time analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-8">
            <Link to="/auth">Start sending free <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="h-12 px-8">
            <Link to="/docs">Read the docs</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 10K free emails/mo</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card</div>
          <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 5-minute setup</div>
        </div>

        {/* Code snippet */}
        <div id="code" className="mt-20 max-w-3xl mx-auto">
          <div className="rounded-2xl border border-border bg-card/80 overflow-hidden text-left shadow-elegant backdrop-blur-xl">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-destructive/60" />
                <div className="h-3 w-3 rounded-full bg-warning/60" />
                <div className="h-3 w-3 rounded-full bg-primary/80" />
              </div>
              <div className="flex-1 text-center text-xs font-mono text-muted-foreground">~/senviok-quickstart</div>
              <Code className="h-4 w-4 text-muted-foreground" />
            </div>
            <pre className="p-6 text-sm font-mono overflow-x-auto leading-relaxed">
<span className="text-muted-foreground"># Send your first email in 30 seconds</span>{"\n"}
<span className="text-primary">curl</span> -X POST https://api.senviok.dev/v1/emails \{"\n"}
  -H <span className="text-primary-glow">"Authorization: Bearer sk_live_••••••"</span> \{"\n"}
  -H <span className="text-primary-glow">"Content-Type: application/json"</span> \{"\n"}
  -d <span className="text-primary-glow">{`'{
    "from": "team@yourdomain.com",
    "to": "user@example.com",
    "subject": "Welcome to Senviok",
    "html": "<h1>You're in!</h1>"
  }'`}</span>
            </pre>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Engineered for production</h2>
          <p className="text-muted-foreground mt-4">Every feature you'd build yourself, ready out of the box.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Async queueing", desc: "BullMQ-powered queue with exponential backoff retries and DLQ. Spikes? Handled." },
            { icon: Shield, title: "Domain authentication", desc: "Automated SPF, DKIM, and DMARC verification for maximum inbox placement." },
            { icon: BarChart3, title: "Real-time analytics", desc: "Bounces, opens, clicks, complaints — streamed live to your dashboard." },
            { icon: Lock, title: "Hashed API keys", desc: "SHA-256 hashed keys with per-user scoping. Rotate anytime, zero downtime." },
            { icon: Globe, title: "af-south-1 region", desc: "Low-latency delivery from Cape Town. Built for the African internet." },
            { icon: Mail, title: "Multi-channel", desc: "Email today, SMS tomorrow. One API for all your transactional comms." },
          ].map((f) => (
            <div key={f.title} className="group relative rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl hover:border-primary/40 transition-all duration-300">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent transition-opacity" />
              <div className="relative">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative container mx-auto px-4 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-card p-12 md:p-16 text-center backdrop-blur-xl">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
              Ship your first email <span className="gradient-text">today</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              Free tier includes 10,000 emails per month. No credit card required.
            </p>
            <Button size="lg" asChild className="mt-8 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-8">
              <Link to="/auth">Create your account <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-sm text-muted-foreground">© 2026 Senviok. Built for developers in Africa.</div>
        </div>
      </footer>
    </div>
  );
}
