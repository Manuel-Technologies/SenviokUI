import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Shield, 
  BarChart3, 
  ArrowRight, 
  Code, 
  Mail, 
  Globe, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  Terminal, 
  Copy, 
  Check, 
  Activity, 
  FileText, 
  ArrowRightLeft,
  Server
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

type LangKey = "curl" | "node" | "python" | "go" | "dotnet";

export default function Landing() {
  const { user } = useAuth();
  const [activeLang, setActiveLang] = useState<LangKey>("curl");
  const [copied, setCopied] = useState(false);
  const [emailsSent, setEmailsSent] = useState(482590);
  const [avgLatency, setAvgLatency] = useState(14);

  // Dynamic metrics ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setEmailsSent((prev) => prev + Math.floor(Math.random() * 2) + 1);
      // Small fluctuation in latency to make it look live
      setAvgLatency((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        const next = prev + delta;
        return next >= 11 && next <= 18 ? next : prev;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // SEO Page Title & Meta Tags
  useEffect(() => {
    document.title = "Senviok — Developer-First Email & SMS Infrastructure";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Senviok is a developer-first email and SMS infrastructure platform. High deliverability, low latency, and NDPR compliance. Built for African startups."
      );
    }
  }, []);

  const codeSnippets: Record<LangKey, string> = {
    curl: `curl -X POST https://api.senviok.com/v1/emails \\
  -H "Authorization: Bearer sk_live_••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "from": "notifications@yourdomain.com",
    "to": "customer@example.com",
    "subject": "Payment Confirmation",
    "html": "<h1>Your payment was successful!</h1>"
  }'`,
    node: `import { Senviok } from '@senviok/node';

const client = new Senviok({ apiKey: 'sk_live_••••••' });

await client.emails.send({
  from: 'notifications@yourdomain.com',
  to: 'customer@example.com',
  subject: 'Payment Confirmation',
  html: '<h1>Your payment was successful!</h1>'
});`,
    python: `from senviok import Senviok

client = Senviok(api_key="sk_live_••••••")

response = client.emails.send(
    sender="notifications@yourdomain.com",
    to="customer@example.com",
    subject="Payment Confirmation",
    html="<h1>Your payment was successful!</h1>"
)`,
    go: `package main

import (
	"context"
	"github.com/senviok/senviok-go"
)

func main() {
	client := senviok.NewClient("sk_live_••••••")
	
	_, err := client.Emails.Send(context.Background(), &senviok.EmailRequest{
		From:    "notifications@yourdomain.com",
		To:      "customer@example.com",
		Subject: "Payment Confirmation",
		Html:    "<h1>Your payment was successful!</h1>",
	})
}`,
    dotnet: `using Senviok.Client;

var client = new SenviokClient("sk_live_••••••");

var response = await client.Emails.SendAsync(new EmailRequest 
{
    From = "notifications@yourdomain.com",
    To = "customer@example.com",
    Subject = "Payment Confirmation",
    Html = "<h1>Your payment was successful!</h1>"
});`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />

      {/* Nav */}
      <nav id="main-navigation" className="relative border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo size="sm" />
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors font-medium">Features</a>
            <a href="#lifecycle" className="hover:text-foreground transition-colors font-medium">How it Works</a>
            <a href="#code-quickstart" className="hover:text-foreground transition-colors font-medium">Developer SDKs</a>
            <a href="#metrics" className="hover:text-foreground transition-colors font-medium">System Status</a>
          </div>
          <div>
            {user ? (
              <Button asChild size="sm" id="nav-dashboard-btn">
                <Link to="/dashboard">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild id="nav-signin-btn">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button size="sm" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow" id="nav-signup-btn">
                  <Link to="/auth">Get started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main id="main-content">
        {/* Hero */}
        <section className="relative container mx-auto px-4 pt-20 pb-20 text-center" aria-labelledby="hero-title">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-8 backdrop-blur-sm shadow-sm animate-pulse-slow">
            <Sparkles className="h-3.5 w-3.5" />
            Built for African Startups · Low-latency Nodes · NDPR Compliant
          </div>
          <h1 id="hero-title" className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.05] mb-6">
            Email & SMS <br />
            <span className="gradient-text">infrastructure</span>
            <br />engineered for developers
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6 leading-relaxed">
            Deliver transactional alerts, verification codes, and emails with reliable ingestion queues, automated deliverability monitoring, and real-time event logs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-8" id="hero-cta-get-started">
              <Link to="/auth">Start sending free <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8" id="hero-cta-docs">
              <Link to="/docs">Read the docs</Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 10,000 free emails/mo</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> No credit card required</div>
            <div className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" /> 5-minute setup</div>
          </div>
        </section>

        {/* Live Lifecycle Flow (Interactive architecture visualizer) */}
        <section id="lifecycle" className="relative container mx-auto px-4 py-16 border-t border-border/20" aria-labelledby="lifecycle-title">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 id="lifecycle-title" className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-muted-foreground">A secure, transparent path from API request to delivery.</p>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-6 relative">
            {/* Connecting lines for desktop */}
            <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 -z-10" />
            
            {[
              {
                step: "01",
                title: "API Trigger",
                desc: "Your app calls our low-latency regional nodes in af-south-1.",
                icon: Terminal,
              },
              {
                step: "02",
                title: "Ingestion Queue",
                desc: "Requests enter the queue. Never lose an email due to provider outages.",
                icon: ArrowRightLeft,
              },
              {
                step: "03",
                title: "Authentication",
                desc: "We process DKIM/SPF parameters for maximum deliverability.",
                icon: Shield,
              },
              {
                step: "04",
                title: "Inbox Delivery",
                desc: "Emails are delivered via trusted paths. Success is logged in real-time.",
                icon: Mail,
              },
            ].map((s, idx) => (
              <div key={s.title} className="glass-card rounded-xl p-6 border border-border/50 text-center relative group hover:border-primary/30 transition-all duration-300">
                <div className="absolute top-3 right-3 text-xs font-mono text-primary/40 group-hover:text-primary transition-colors">{s.step}</div>
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/10 group-hover:border-primary/40 transition-colors">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Developer Tabbed Code SDK & Quickstart */}
        <section id="code-quickstart" className="relative container mx-auto px-4 py-20 border-t border-border/20" aria-labelledby="code-title">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 id="code-title" className="text-3xl font-bold tracking-tight mb-4">Integrate in 30 seconds</h2>
            <p className="text-muted-foreground">Standardized SDKs for your stack. Copy, paste, and run.</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl border border-border bg-card/80 overflow-hidden text-left shadow-elegant backdrop-blur-xl">
              {/* Tab Selector */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                <div className="flex gap-2 items-center">
                  <div className="flex gap-1.5 mr-4">
                    <div className="h-3 w-3 rounded-full bg-destructive/60" />
                    <div className="h-3 w-3 rounded-full bg-warning/60" />
                    <div className="h-3 w-3 rounded-full bg-primary/80" />
                  </div>
                  <div className="flex gap-1 overflow-x-auto">
                    {(["curl", "node", "python", "go", "dotnet"] as LangKey[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => { setActiveLang(lang); setCopied(false); }}
                        className={`text-xs px-2.5 py-1 rounded-md transition-all font-mono capitalize ${
                          activeLang === lang
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        id={`code-tab-${lang}`}
                      >
                        {lang === "dotnet" ? ".NET (C#)" : lang === "node" ? "Node.js" : lang}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors font-mono py-1 px-2.5 bg-muted/40 border border-border rounded-md"
                  id="code-copy-btn"
                  aria-label="Copy code snippet"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-primary">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Panel */}
              <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-muted-foreground whitespace-pre">
                  {codeSnippets[activeLang]}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Spacious Features Section (Not cramped) */}
        <section id="features" className="relative container mx-auto px-4 py-24 border-t border-border/20" aria-labelledby="features-title">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 id="features-title" className="text-3xl md:text-4xl font-bold tracking-tight">Engineered for deliverability</h2>
            <p className="text-muted-foreground mt-4">Every feature you need to scale, engineered with high availability and resilience.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Features Listing (Left) */}
            <div className="space-y-12">
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Async Ingestion Queue</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Our multi-channel backend queues delivery requests instantly. Even during server failures or API rate limits, transactions are buffered and re-tried with exponential backoff.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Auto-retries with Jitter</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Dead-Letter Queues (DLQ) for failed payloads</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">DKIM & Domain Authentication</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Verify custom sending domains directly in your developer dashboard. Senviok auto-generates DKIM DNS parameters to satisfy SPF and DMARC checks.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Triple-CNAME verification records</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Real-time DNS propagation checking</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Low-Latency African Routing</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Hosted primarily in Cape Town regional nodes (af-south-1). Built to dramatically decrease connection overheads for African engineering teams.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Sub-20ms API response latency</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Strict compliance with NDPR policies</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2">Secured Credentials</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                    Credentials and API keys are protected using secure SHA-256 hashing. Control key permissions or roll them instantly without downtime.
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> Live credentials rotation</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary/70" /> REST API rate-limiting guardrails</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interactive Live Metrics Ticker & Analytics Card (Right) */}
            <div id="metrics" className="glass-card rounded-2xl p-6 border border-border/50 relative overflow-hidden shadow-elegant" aria-label="System Metrics Summary">
              <div className="absolute top-0 right-0 h-40 w-40 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-4.5 w-4.5 text-primary animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider font-mono">live_network_status</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary font-mono font-medium">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Operational
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 border border-border/40 rounded-xl p-4">
                  <span className="text-xs text-muted-foreground block mb-1">Messages Dispatched</span>
                  <span className="text-2xl font-bold font-mono tracking-tight">{emailsSent.toLocaleString()}</span>
                </div>
                <div className="bg-muted/30 border border-border/40 rounded-xl p-4">
                  <span className="text-xs text-muted-foreground block mb-1">Avg Ingestion Latency</span>
                  <span className="text-2xl font-bold font-mono tracking-tight text-primary">{avgLatency}ms</span>
                </div>
              </div>

              {/* Mock event stream logs */}
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground block mb-2 font-mono">recent_events</span>
                <div className="bg-background/80 border border-border/50 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="text-primary">POST /v1/emails</span>
                    <span>201 Created</span>
                  </div>
                  <div className="text-[10px] text-primary/60 mt-1">recipient: u***@domain.com · delay: 8ms</div>
                </div>
                <div className="bg-background/80 border border-border/50 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
                  <div className="flex justify-between">
                    <span className="text-primary">POST /v1/sms</span>
                    <span>201 Created</span>
                  </div>
                  <div className="text-[10px] text-primary/60 mt-1">recipient: +234803***** · route: priority_sms</div>
                </div>
                <div className="bg-background/80 border border-border/50 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-muted-foreground opacity-60">
                  <div className="flex justify-between">
                    <span className="text-primary">POST /v1/domains/verify</span>
                    <span>200 Success</span>
                  </div>
                  <div className="text-[10px] text-primary/60 mt-1">domain: app.yourdomain.com · identity: verified</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Summary (Adds detail, establishes transparency) */}
        <section id="pricing" className="relative container mx-auto px-4 py-20 border-t border-border/20" aria-labelledby="pricing-title">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 id="pricing-title" className="text-3xl font-bold tracking-tight mb-4">Simple, predictable pricing</h2>
            <p className="text-muted-foreground">Start free, upgrade as you grow. No hidden platform fees.</p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="glass-card rounded-2xl border border-border/60 p-8 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2">Free</h3>
                <p className="text-xs text-muted-foreground mb-6">Perfect for building, sandbox testing, and launching small scale projects.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-mono text-foreground">₦0</span>
                  <span className="text-muted-foreground text-xs">/ month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 1,000 emails/month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 100 SMS/month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Basic analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 2 custom domains</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 1 workspace</li>
                </ul>
              </div>
              <Button variant="outline" asChild className="w-full mt-8" id="pricing-cta-free">
                <Link to="/auth">Start sending free</Link>
              </Button>
            </div>

            {/* Starter Tier */}
            <div className="glass-card rounded-2xl border border-primary/30 bg-primary/[0.01] p-8 flex flex-col justify-between hover:border-primary/45 transition-all duration-300">
              <div>
                <h3 className="text-xl font-bold mb-2">Starter</h3>
                <p className="text-xs text-muted-foreground mb-6">Ideal for growing startups needing higher dispatch limits and webhooks.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-mono text-foreground">₦9,999</span>
                  <span className="text-muted-foreground text-xs">/ month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 30,000 emails/month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 2,000 SMS/month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Full analytics</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 5 team members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Webhooks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Unlimited custom domain</li>
                </ul>
              </div>
              <Button asChild className="w-full mt-8 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant" id="pricing-cta-starter">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>

            {/* Growth Tier */}
            <div className="glass-card rounded-2xl border border-primary/30 bg-primary/[0.03] p-8 flex flex-col justify-between relative shadow-glow-subtle hover:border-primary/50 transition-all duration-300">
              <div className="absolute top-4 right-4 bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase font-mono tracking-wider font-semibold py-1 px-2.5 rounded-full">
                Popular
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Growth</h3>
                <p className="text-xs text-muted-foreground mb-6">Designed for scaling applications needing large sending limits and priority support.</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold font-mono text-foreground">₦29,999</span>
                  <span className="text-muted-foreground text-xs">/ month</span>
                </div>
                <ul className="space-y-3.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 100,000 emails/month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> 10,000 SMS/month</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Custom domain</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Unlimited members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> Priority support</li>
                </ul>
              </div>
              <Button asChild className="w-full mt-8 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant" id="pricing-cta-growth">
                <Link to="/auth">Choose Growth</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative container mx-auto px-4 py-20" aria-labelledby="cta-title">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-card p-12 md:p-16 text-center backdrop-blur-xl shadow-elegant">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary/20 blur-3xl -z-10" />
            <div className="relative">
              <h2 id="cta-title" className="text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mx-auto">
                Ship your transactional messages <span className="gradient-text">today</span>
              </h2>
              <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                Sign up and configure your SMTP credentials or API key in under five minutes.
              </p>
              <Button size="lg" asChild className="mt-8 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant h-12 px-8" id="bottom-cta-signup">
                <Link to="/auth">Create free account <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/50 py-10" role="contentinfo">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-sm text-muted-foreground">© 2026 Senviok. Infrastructure built for developers.</div>
        </div>
      </footer>
    </div>
  );
}
