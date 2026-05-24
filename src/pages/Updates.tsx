import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Shield,
  Zap,
  Globe,
  Coins,
  Database,
  Calendar,
  MessageSquare,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Mail,
  Network
} from "lucide-react";

export default function Updates() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // SEO Page Title & Meta Tags
  useEffect(() => {
    document.title = "Why Senviok — Modern Messaging Infrastructure vs Resend, Mailgun & Mailchimp";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Compare Senviok with Resend, Mailgun, and Mailchimp. Discover why our unified Email & SMS API, local Naira pricing, tenant isolation, and African regional nodes are built for startups."
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground pb-12">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-radial-glow" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />

      {/* Nav */}
      <nav className="relative border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            {user ? (
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
              </Button>
            ) : (
              <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Home
              </Button>
            )}
            {!user && (
              <Button size="sm" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                <Link to="/auth">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12 max-w-5xl relative space-y-12">
        {/* Header */}
        <header className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary mb-2 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Product Insights & Comparisons
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Why developers choose <span className="gradient-text">Senviok</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Legacy email delivery platforms were built a decade ago for Western markets. 
            Senviok is engineered ground-up for high-deliverability, localized control, and multi-channel simplicity.
          </p>
        </header>

        {/* Tab Selection */}
        <Tabs defaultValue="comparisons" className="w-full">
          <TabsList className="grid grid-cols-2 max-w-md mx-auto mb-10 border border-border/50 bg-muted/20 p-1">
            <TabsTrigger value="comparisons" className="font-medium text-sm py-2">
              <TrendingUp className="h-4 w-4 mr-2" /> Why We Excel
            </TabsTrigger>
            <TabsTrigger value="changelog" className="font-medium text-sm py-2">
              <Calendar className="h-4 w-4 mr-2" /> Updates & Changelog
            </TabsTrigger>
          </TabsList>

          {/* Comparisons Tab Content */}
          <TabsContent value="comparisons" className="space-y-12 outline-none">
            {/* Direct Core Advantages (Grids) */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Card 1: Unified Multi-channel */}
              <Card className="glass-card hover:border-primary/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Unified Multi-channel API</CardTitle>
                    <CardDescription>Email & SMS in a single pipeline</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Traditional platforms force you to maintain separate SDKs and vendors for different channels. You use Resend for beautiful HTML transactional emails, but then hook up Twilio or Termii for one-time passcodes (OTPs).
                  </p>
                  <p>
                    Senviok unifies both. Send transaction confirmations via email and immediate authentication PINs via SMS using the same API keys, dashboard analytics, and billing portal.
                  </p>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-primary font-mono font-medium">
                    <span>Email & SMS Unified</span>
                    <span>No separate vendors</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Local Naira Pricing */}
              <Card className="glass-card hover:border-primary/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Coins className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Predictable Naira Billing (₦)</CardTitle>
                    <CardDescription>No FX fluctuations or dollar cards</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    Paying for services like Mailgun or Mailchimp in USD from Nigeria comes with massive exchange rate volatility and arbitrary dollar-card transaction limits. Startups frequently face service suspension due to failed USD billing.
                  </p>
                  <p>
                    Senviok bills directly in local currency (Naira). Our subscription plans are fixed in local denomination, letting you accurately project infrastructure cost month-over-month.
                  </p>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-primary font-mono font-medium">
                    <span>₦ Naira Billing</span>
                    <span>Stable infrastructure costs</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: High-Isolation Tenant Partitioning */}
              <Card className="glass-card hover:border-primary/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Noisy-Neighbor Protection</CardTitle>
                    <CardDescription>Isolated sending queues per tenant</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    On generic email delivery services, you share sending queues with thousands of other startups. If a noisy neighbor runs a spam campaign, the shared IP or routing queue takes a hit, slowing down your critical payment alerts.
                  </p>
                  <p>
                    Senviok assigns dedicated isolation partitions. Every tenant gets separate, sandboxed queues. Your transactional delivery times remain independent of other customers' sending volume.
                  </p>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-primary font-mono font-medium">
                    <span>Isolated DB & Ingestion Queues</span>
                    <span>Dedicated Domain Segregation</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Localized Low-Latency Routing */}
              <Card className="glass-card hover:border-primary/20 transition-all duration-300">
                <CardHeader className="flex flex-row items-center gap-4 pb-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Cape Town Regional Nodes</CardTitle>
                    <CardDescription>Sub-20ms ingestion for local servers</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-3">
                  <p>
                    When your application server makes API calls to servers in northern Virginia or Ireland, the network latency overhead adds 150-250ms per call. This adds up, slowing down checkout actions and webhook deliveries.
                  </p>
                  <p>
                    Senviok targets African infrastructure using regional nodes hosted in Cape Town (af-south-1). Enjoy ultra-low latency response times of under 20ms for ingestion requests.
                  </p>
                  <div className="pt-2 border-t border-border/40 flex items-center justify-between text-xs text-primary font-mono font-medium">
                    <span>Cape Town af-south-1 Hosting</span>
                    <span>Local regulatory (NDPR) compliance</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deep Comparison Table Matrix */}
            <section className="space-y-6 pt-6">
              <div className="text-center space-y-2 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold tracking-tight">Feature Comparison Matrix</h2>
                <p className="text-xs text-muted-foreground">
                  See how Senviok stacks up against traditional email delivery platforms.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden shadow-elegant backdrop-blur-sm">
                <Table>
                  <TableHeader className="bg-muted/40 font-mono text-[11px] uppercase tracking-wider">
                    <TableRow>
                      <TableHead className="w-[200px] font-bold">Capabilities</TableHead>
                      <TableHead className="text-primary font-bold bg-primary/5 border-x border-primary/20">Senviok</TableHead>
                      <TableHead>Resend</TableHead>
                      <TableHead>Mailgun</TableHead>
                      <TableHead>Mailchimp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs font-medium">
                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Multi-channel Support</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Email & SMS</div>
                      </TableCell>
                      <TableCell>Email Only</TableCell>
                      <TableCell>Email Only</TableCell>
                      <TableCell>Email Only (Marketing Focus)</TableCell>
                    </TableRow>
                    
                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Regional Nodes Latency</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Sub-20ms (Cape Town)</div>
                      </TableCell>
                      <TableCell>~180ms (US/EU)</TableCell>
                      <TableCell>~220ms (US/EU)</TableCell>
                      <TableCell>~250ms (US/EU)</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Billing Currency</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Local Naira (₦)</div>
                      </TableCell>
                      <TableCell>USD ($)</TableCell>
                      <TableCell>USD ($)</TableCell>
                      <TableCell>USD ($)</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Tenant Isolation</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Dedicated sandboxes</div>
                      </TableCell>
                      <TableCell>Shared queues</TableCell>
                      <TableCell>Shared (Premium Dedicated)</TableCell>
                      <TableCell>Shared queues</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Local Compliance</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> NDPR Compliant</div>
                      </TableCell>
                      <TableCell>GDPR/CCPA Only</TableCell>
                      <TableCell>GDPR/CCPA Only</TableCell>
                      <TableCell>GDPR/CCPA Only</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Free Tier Volume</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> 1,000 email + 100 SMS</div>
                      </TableCell>
                      <TableCell>3,000 email /mo</TableCell>
                      <TableCell>Sandsbox testing only</TableCell>
                      <TableCell>500 email /mo</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="font-semibold text-foreground">Async Queue Buffering</TableCell>
                      <TableCell className="bg-primary/[0.02] border-x border-primary/10 text-primary font-semibold">
                        <div className="flex items-center gap-1"><Check className="h-4 w-4 text-primary" /> Automatic DLQ</div>
                      </TableCell>
                      <TableCell>Standard retries</TableCell>
                      <TableCell>Standard retries</TableCell>
                      <TableCell><X className="h-4 w-4 text-muted-foreground/60 inline mr-1" /> None (Instant fail)</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </section>
          </TabsContent>

          {/* Changelog Tab Content */}
          <TabsContent value="changelog" className="space-y-8 outline-none">
            
            {/* Timeline of releases */}
            <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 before:w-[2px] before:bg-border/60">
              
              {/* Release 1 */}
              <div className="relative pl-10 space-y-2">
                {/* Node icon */}
                <div className="absolute left-[7px] top-1.5 h-[20px] w-[20px] rounded-full border border-primary bg-background flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">May 24, 2026</span>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400 border border-green-500/20">Active</Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground">Multi-Language API snippets & Webhook Guides</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We've rolled out complete, copy-pasteable snippets for integrations across 9 programming languages, including C# (.NET HttpClient), PHP (Guzzle HTTP), and Ruby (Net::HTTP). 
                  Along with it, we published our Webhooks Specification page, allowing you to configure endpoints and sign payloads using SHA256 HMAC for absolute security.
                </p>
                <div className="flex gap-2">
                  <Button variant="link" size="sm" asChild className="p-0 text-primary hover:text-primary/80">
                    <Link to="/docs">View developer docs <ArrowRight className="h-3 w-3 ml-1" /></Link>
                  </Button>
                </div>
              </div>

              {/* Release 2 */}
              <div className="relative pl-10 space-y-2">
                {/* Node icon */}
                <div className="absolute left-[7px] top-1.5 h-[20px] w-[20px] rounded-full border border-border/80 bg-background flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-border" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">April 12, 2026</span>
                  <Badge variant="outline" className="text-muted-foreground border-border/80">Closed</Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground">Async Ingestion & Dead-Letter Queues</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To protect downstream provider APIs from rate limits and network degradation, we implemented RabbitMQ-driven ingestion queues. 
                  Incoming API payloads are immediately acknowledged within 15ms. In case of provider drops, events are systematically retried or sent to your Dead-Letter Queue (DLQ).
                </p>
              </div>

              {/* Release 3 */}
              <div className="relative pl-10 space-y-2">
                {/* Node icon */}
                <div className="absolute left-[7px] top-1.5 h-[20px] w-[20px] rounded-full border border-border/80 bg-background flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-border" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">March 28, 2026</span>
                  <Badge variant="outline" className="text-muted-foreground border-border/80">Closed</Badge>
                </div>
                <h3 className="text-lg font-bold text-foreground">Interactive Audience List & Contact Manager</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Create and slice contact lists right from the dashboard. This allows seamless targeted campaign dispatches, custom template variables, and instant recipient list cleaning.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer info CTA */}
        <section className="pt-6">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card p-8 text-center backdrop-blur-xl">
            <h2 className="text-xl font-bold tracking-tight">Ready to experience low-latency deliverability?</h2>
            <p className="text-xs text-muted-foreground mt-2 max-w-sm mx-auto">
              Get started with 1,000 free emails and 100 free SMS every single month.
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <Button size="sm" asChild className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
                <Link to="/auth">Create Account</Link>
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to="/docs">Integrate Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/40 mt-12 pt-8" role="contentinfo">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="text-xs text-muted-foreground">© 2026 Senviok. Infrastructure built for developers.</div>
        </div>
      </footer>
    </div>
  );
}
