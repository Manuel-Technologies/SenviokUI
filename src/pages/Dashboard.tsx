import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Mail, Key, LogOut, Copy, Plus, Trash2, Send, RefreshCw, BookOpen, Globe, CheckCircle2, AlertCircle, Loader2, Radio } from "lucide-react";
import { Logo } from "@/components/Logo";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  created_at: string;
  last_used_at: string | null;
}

interface EmailLog {
  id: string;
  recipient: string;
  subject: string;
  status: string;
  created_at: string;
  error_message: string | null;
}

interface DomainItem {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

interface DkimToken {
  name: string;
  value: string;
  type: string;
}

interface WebhookItem {
  id: string;
  url: string;
  secret: string;
  events: string[];
  created_at: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5033";

export default function Dashboard() {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [newKeyName, setNewKeyName] = useState("Default");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<{ startup_name: string | null; startup_slug: string | null } | null>(null);

  // Send test email form
  const [testTo, setTestTo] = useState("");
  const [testSubject, setTestSubject] = useState("Test from Senviok");
  const [testBody, setTestBody] = useState("<h1>Hello!</h1><p>This is a test email from Senviok.</p>");
  const [sending, setSending] = useState(false);

  // Domain states
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [newDomainName, setNewDomainName] = useState("");
  const [addingDomain, setAddingDomain] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<DomainItem | null>(null);
  const [dkimTokens, setDkimTokens] = useState<DkimToken[]>([]);
  const [fetchingDkim, setFetchingDkim] = useState(false);
  const [checkingVerify, setCheckingVerify] = useState(false);

  // Webhook states
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [newWebhookUrl, setNewWebhookUrl] = useState("");
  const [selectedWebhookEvents, setSelectedWebhookEvents] = useState<string[]>(["email.sent", "email.failed"]);
  const [addingWebhook, setAddingWebhook] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookItem | null>(null);
  const [deletingWebhookId, setDeletingWebhookId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setProfile({
        startup_name: user.name || "My Workspace",
        startup_slug: user.tenantId,
      });
      fetchApiKeys();
      fetchEmails();
      fetchDomains();
      fetchWebhooks();
    }
  }, [user]);

  const fetchWebhooks = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/v1/webhooks`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch webhooks");
      const data = await res.json();
      const mapped = (data.data || []).map((w: any) => ({
        id: w.id,
        url: w.url,
        secret: w.secret,
        events: w.events || [],
        created_at: w.createdAt,
      }));
      setWebhooks(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load webhooks");
    }
  };

  const createWebhook = async () => {
    if (!newWebhookUrl) {
      toast.error("Webhook endpoint URL is required");
      return;
    }
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    if (!urlRegex.test(newWebhookUrl)) {
      toast.error("Please enter a valid URL (e.g. https://yourdomain.com/webhook)");
      return;
    }
    if (selectedWebhookEvents.length === 0) {
      toast.error("Please select at least one event subscription");
      return;
    }

    if (!session?.access_token) return;
    setAddingWebhook(true);
    try {
      const res = await fetch(`${API_URL}/v1/webhooks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          Url: newWebhookUrl,
          Events: selectedWebhookEvents,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.Message || errData.message || "Failed to create webhook");
      }
      toast.success("Webhook endpoint successfully registered!");
      setNewWebhookUrl("");
      setSelectedWebhookEvents(["email.sent", "email.failed"]);
      fetchWebhooks();
    } catch (err: any) {
      toast.error(err.message || "Failed to register webhook");
    } finally {
      setAddingWebhook(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!session?.access_token) return;
    setDeletingWebhookId(id);
    try {
      const res = await fetch(`${API_URL}/v1/webhooks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete webhook");
      toast.success("Webhook revoked successfully!");
      if (selectedWebhook?.id === id) {
        setSelectedWebhook(null);
      }
      fetchWebhooks();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete webhook");
    } finally {
      setDeletingWebhookId(null);
    }
  };

  const toggleWebhookEventSelection = (event: string) => {
    setSelectedWebhookEvents(prev => 
      prev.includes(event) ? prev.filter(e => e !== event) : [...prev, event]
    );
  };

  const fetchDomains = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/v1/domains`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch domains");
      const data = await res.json();
      const mapped = (data.data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        status: d.status,
        created_at: d.createdAt,
      }));
      setDomains(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load domains");
    }
  };

  const createDomain = async () => {
    if (!newDomainName) {
      toast.error("Domain name is required");
      return;
    }
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(newDomainName)) {
      toast.error("Please enter a valid domain name (e.g. example.com)");
      return;
    }

    if (!session?.access_token) return;
    setAddingDomain(true);
    try {
      const res = await fetch(`${API_URL}/v1/domains`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ Name: newDomainName }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.Message || errData.message || "Failed to add domain");
      }

      const data = await res.json();
      const newDomain: DomainItem = {
        id: data.id,
        name: data.name,
        status: data.status,
        created_at: data.createdAt,
      };

      setDomains((prev) => [...prev, newDomain]);
      setNewDomainName("");
      toast.success("Domain added! Loading DNS records...");
      
      // Auto select it
      handleSelectDomain(newDomain);
    } catch (err: any) {
      toast.error(err.message || "Failed to add domain");
    }
    setAddingDomain(false);
  };

  const handleSelectDomain = async (domain: DomainItem) => {
    setSelectedDomain(domain);
    setDkimTokens([]);
    if (!session?.access_token) return;
    setFetchingDkim(true);
    try {
      const res = await fetch(`${API_URL}/v1/domains/${domain.id}/dkim`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load DKIM verification records");
      const data = await res.json();
      setDkimTokens(data.tokens || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load DKIM tokens");
    }
    setFetchingDkim(false);
  };

  const checkDomainVerification = async (domainId: string) => {
    if (!session?.access_token) return;
    setCheckingVerify(true);
    try {
      const res = await fetch(`${API_URL}/v1/domains/${domainId}/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to check domain verification status");
      const data = await res.json();
      
      setDomains((prev) =>
        prev.map((d) => (d.id === domainId ? { ...d, status: data.status } : d))
      );
      
      if (selectedDomain && selectedDomain.id === domainId) {
        setSelectedDomain((prev) => prev ? { ...prev, status: data.status } : null);
      }

      if (data.status === "Verified") {
        toast.success("Domain verified successfully!");
      } else {
        toast.info(`Domain status is currently: ${data.status}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to verify domain");
    }
    setCheckingVerify(false);
  };

  const fetchApiKeys = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/v1/api-keys`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch API keys");
      const data = await res.json();
      const mapped = (data.data || []).map((k: any) => ({
        id: k.id,
        name: k.name,
        key_prefix: k.prefix,
        created_at: k.createdAt,
        last_used_at: k.lastUsedAt || null,
      }));
      setApiKeys(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load API keys");
    }
  };

  const fetchEmails = async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/v1/analytics/logs`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch email logs");
      const data = await res.json();
      const mapped = (data.logs || []).map((l: any) => ({
        id: l.id,
        recipient: l.toAddress,
        subject: l.subject || "",
        status: l.status,
        created_at: l.createdAt,
        error_message: l.textBody || null,
      }));
      setEmails(mapped);
    } catch (err: any) {
      toast.error(err.message || "Failed to load email logs");
    }
  };

  const generateApiKey = async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/v1/api-keys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ Name: newKeyName }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.Message || errData.message || "Failed to generate API key");
      }

      const data = await res.json();
      setGeneratedKey(data.token);
      setNewKeyName("Default");
      fetchApiKeys();
      toast.success("API key generated!");
    } catch (err: any) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const deleteApiKey = async (id: string) => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(`${API_URL}/v1/api-keys/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete API key");
      fetchApiKeys();
      toast.success("API key deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const sendTestEmail = async () => {
    if (!testTo) {
      toast.error("Recipient is required");
      return;
    }
    if (!session?.access_token || !user) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/v1/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          from: `noreply@${user.tenantId}.senviok.email`,
          fromName: "Test Sender",
          to: testTo,
          subject: testSubject,
          html: testBody,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.Message || errData.message || "Failed to queue email");
      }

      toast.success("Email queued successfully!");
      setTestTo("");
      fetchEmails();
    } catch (err: any) {
      toast.error(err.message || "Failed to queue email");
    }
    setSending(false);
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
      case "delivered":
        return "bg-green-500/15 text-green-500 border-green-500/30";
      case "failed":
        return "bg-red-500/15 text-red-500 border-red-500/30";
      case "processing":
      case "queued":
        return "bg-yellow-500/15 text-yellow-500 border-yellow-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/docs")}>
              <BookOpen className="h-4 w-4 mr-2" /> API Docs
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {profile?.startup_name ? `${profile.startup_name}'s Workspace` : "Dashboard"}
            </h1>
            {profile?.startup_slug && (
              <p className="text-sm text-muted-foreground mt-1">
                Tenant ID: <code className="font-mono text-foreground">{profile.startup_slug}</code>
              </p>
            )}
          </div>
          {profile?.startup_slug && (
            <Card className="glass-card border-primary/30 bg-primary/5">
              <CardContent className="py-4 px-5 flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Sending address</p>
                  <code className="font-mono text-sm text-primary">
                    noreply@{profile.startup_slug}.senviok.email
                  </code>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(`noreply@${profile.startup_slug}.senviok.email`)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="keys">
              <Key className="h-4 w-4 mr-2" /> API Keys
            </TabsTrigger>
            <TabsTrigger value="domains">
              <Globe className="h-4 w-4 mr-2" /> Domains
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Radio className="h-4 w-4 mr-2" /> Webhooks
            </TabsTrigger>
            <TabsTrigger value="logs">
              <Mail className="h-4 w-4 mr-2" /> Email Logs
            </TabsTrigger>
            <TabsTrigger value="send">
              <Send className="h-4 w-4 mr-2" /> Send Test
            </TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-4">
            {/* Generated key banner */}
            {generatedKey && (
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium mb-2 text-primary">🔑 Your new API key (copy it now — it won't be shown again):</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-card rounded px-3 py-2 text-sm font-mono break-all border border-border">
                      {generatedKey}
                    </code>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedKey)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setGeneratedKey(null)}>
                    Dismiss
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Generate API Key</CardTitle>
                <CardDescription>Create a new key to authenticate your API requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="Key name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button onClick={generateApiKey} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" /> Generate
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Your API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No API keys yet. Generate one above.</p>
                ) : (
                  <div className="space-y-3">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between py-3 px-4 rounded-lg bg-muted/50 border border-border/50">
                        <div>
                          <p className="font-medium text-sm">{key.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{key.key_prefix}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Created {new Date(key.created_at).toLocaleDateString()}
                            {key.last_used_at && ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => deleteApiKey(key.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Side: Register and List Domains */}
              <div className="md:col-span-1 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Domain</CardTitle>
                    <CardDescription>Link your custom domain to send verified emails</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="domainName">Domain Name</Label>
                      <Input
                        id="domainName"
                        placeholder="e.g. startup.com"
                        value={newDomainName}
                        onChange={(e) => setNewDomainName(e.target.value)}
                      />
                    </div>
                    <Button onClick={createDomain} disabled={addingDomain} className="w-full">
                      {addingDomain ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Add Domain
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Domains</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {domains.length === 0 ? (
                      <p className="text-muted-foreground text-sm p-6 text-center">No custom domains added yet.</p>
                    ) : (
                      <div className="divide-y divide-border/40">
                        {domains.map((dom) => (
                          <button
                            key={dom.id}
                            onClick={() => handleSelectDomain(dom)}
                            className={`w-full text-left p-4 transition-colors flex items-center justify-between hover:bg-muted/30 ${
                              selectedDomain?.id === dom.id ? "bg-muted/50 border-r-2 border-primary" : ""
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-sm truncate">{dom.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Added {new Date(dom.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border uppercase tracking-wider shrink-0 ${
                                dom.status.toLowerCase() === "verified"
                                  ? "bg-green-500/15 text-green-500 border-green-500/30"
                                  : "bg-yellow-500/15 text-yellow-500 border-yellow-500/30"
                              }`}
                            >
                              {dom.status}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Side: Selected Domain DNS Details */}
              <div className="md:col-span-2">
                {selectedDomain ? (
                  <Card className="glass-card">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          {selectedDomain.name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Configure your DNS records below to verify ownership and authorize sending.
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => checkDomainVerification(selectedDomain.id)}
                          disabled={checkingVerify}
                        >
                          {checkingVerify ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2" /> Verify Domain
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Verification Status Banner */}
                      <div
                        className={`rounded-lg border p-4 flex items-start gap-3 ${
                          selectedDomain.status.toLowerCase() === "verified"
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {selectedDomain.status.toLowerCase() === "verified" ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold text-sm">
                            Status: {selectedDomain.status === "Verified" ? "Verified" : "Verification Pending"}
                          </p>
                          <p className="text-xs mt-1 text-muted-foreground leading-relaxed">
                            {selectedDomain.status === "Verified"
                              ? `Your domain ${selectedDomain.name} is fully verified. You can now send emails from any address at this domain (e.g. support@${selectedDomain.name}).`
                              : `We're waiting to verify your domain. Please add the CNAME records below to your DNS provider (e.g., Cloudflare, Namecheap, GoDaddy). It can take up to 24 hours for DNS changes to propagate.`}
                          </p>
                        </div>
                      </div>

                      {/* DKIM / CNAME Records Table */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">DKIM (CNAME) Records</h4>
                        {fetchingDkim ? (
                          <div className="py-12 flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <p className="text-xs">Fetching DNS tokens...</p>
                          </div>
                        ) : dkimTokens.length === 0 ? (
                          <p className="text-xs text-muted-foreground bg-muted/30 border rounded p-4">
                            No DKIM records available. Try clicking "Verify Domain" to register the identity again or refresh.
                          </p>
                        ) : (
                          <div className="border border-border/50 rounded-lg overflow-hidden bg-background/50">
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs text-left">
                                <thead>
                                  <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                                    <th className="py-2.5 px-3">Type</th>
                                    <th className="py-2.5 px-3">Name / Hostname</th>
                                    <th className="py-2.5 px-3">Value / Target</th>
                                    <th className="py-2.5 px-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {dkimTokens.map((token, idx) => (
                                    <tr key={idx} className="border-b border-border/40 last:border-0 hover:bg-muted/20">
                                      <td className="py-3 px-3 font-semibold text-primary">{token.type || "CNAME"}</td>
                                      <td className="py-3 px-3 font-mono break-all select-all pr-4 max-w-[200px] md:max-w-none">
                                        {token.name}
                                      </td>
                                      <td className="py-3 px-3 font-mono break-all select-all pr-4 max-w-[200px] md:max-w-none">
                                        {token.value}
                                      </td>
                                      <td className="py-3 px-3 text-right">
                                        <div className="flex justify-end gap-1.5">
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7"
                                            onClick={() => {
                                              navigator.clipboard.writeText(token.name);
                                              toast.success("Name copied!");
                                            }}
                                            title="Copy Hostname"
                                          >
                                            <Copy className="h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-primary"
                                            onClick={() => {
                                              navigator.clipboard.writeText(token.value);
                                              toast.success("Value copied!");
                                            }}
                                            title="Copy Target Value"
                                          >
                                            <Copy className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SPF and DMARC recommendation */}
                      <div className="space-y-3 pt-2 border-t border-border/40">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">SPF & DMARC (Recommended)</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          For best deliverability and to protect your domain name from spoofing, we recommend adding these TXT records:
                        </p>
                        <div className="border border-border/50 rounded-lg overflow-hidden bg-background/50 text-xs">
                          <div className="p-3 border-b border-border/45 flex items-start gap-4">
                            <div className="font-semibold text-primary w-12 shrink-0">SPF</div>
                            <div className="flex-1 space-y-1 font-mono">
                              <div><span className="text-muted-foreground">Host:</span> @</div>
                              <div><span className="text-muted-foreground">Value:</span> v=spf1 include:amazonses.com ~all</div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => {
                                navigator.clipboard.writeText("v=spf1 include:amazonses.com ~all");
                                toast.success("SPF copied!");
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          <div className="p-3 flex items-start gap-4">
                            <div className="font-semibold text-primary w-12 shrink-0">DMARC</div>
                            <div className="flex-1 space-y-1 font-mono">
                              <div><span className="text-muted-foreground">Host:</span> _dmarc</div>
                              <div><span className="text-muted-foreground">Value:</span> v=DMARC1; p=none; rua=mailto:dmarc@{selectedDomain.name}</div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => {
                                navigator.clipboard.writeText(`v=DMARC1; p=none; rua=mailto:dmarc@${selectedDomain.name}`);
                                toast.success("DMARC copied!");
                              }}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-card h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
                    <Globe className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <CardTitle className="text-base font-medium">No Domain Selected</CardTitle>
                    <p className="text-sm mt-1 max-w-sm">
                      Select a domain from the list to view its DNS verification configuration and verify its status.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Left Side: Register and List Webhooks */}
              <div className="md:col-span-1 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Webhook Endpoint</CardTitle>
                    <CardDescription>Receive real-time notifications for email events</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">Endpoint URL</Label>
                      <Input
                        id="webhookUrl"
                        placeholder="https://api.yourdomain.com/webhooks"
                        value={newWebhookUrl}
                        onChange={(e) => setNewWebhookUrl(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Event Subscriptions</Label>
                      <div className="space-y-2 pt-1">
                        {[
                          { id: "email.sent", label: "email.sent", desc: "Sent successfully" },
                          { id: "email.failed", label: "email.failed", desc: "Delivery failed" },
                          { id: "email.opened", label: "email.opened", desc: "Recipient opened (coming soon)" },
                          { id: "email.clicked", label: "email.clicked", desc: "Recipient clicked (coming soon)" }
                        ].map((evt) => (
                          <label
                            key={evt.id}
                            className={`flex items-start gap-3 p-2 rounded-md border border-border/30 hover:bg-muted/30 cursor-pointer transition-colors ${
                              selectedWebhookEvents.includes(evt.id) ? "bg-primary/5 border-primary/30" : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedWebhookEvents.includes(evt.id)}
                              onChange={() => toggleWebhookEventSelection(evt.id)}
                              className="mt-1 rounded border-muted bg-background text-primary focus:ring-primary focus:ring-offset-background"
                            />
                            <div>
                              <p className="text-xs font-semibold">{evt.label}</p>
                              <p className="text-[10px] text-muted-foreground">{evt.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button onClick={createWebhook} disabled={addingWebhook} className="w-full">
                      {addingWebhook ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Register Endpoint
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-lg">Your Webhooks</CardTitle>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={fetchWebhooks}>
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {webhooks.length === 0 ? (
                      <p className="text-muted-foreground text-sm p-6 text-center">No webhook endpoints registered yet.</p>
                    ) : (
                      <div className="divide-y divide-border/40">
                        {webhooks.map((wh) => (
                          <button
                            key={wh.id}
                            onClick={() => setSelectedWebhook(wh)}
                            className={`w-full text-left p-4 transition-colors flex items-center justify-between hover:bg-muted/30 ${
                              selectedWebhook?.id === wh.id ? "bg-muted/50 border-r-2 border-primary" : ""
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-medium text-sm truncate">{wh.url}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {wh.events.length} event{wh.events.length === 1 ? "" : "s"} subscribed
                              </p>
                            </div>
                            <span className="inline-flex items-center rounded-full bg-green-500/15 text-green-500 border border-green-500/30 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider shrink-0">
                              Active
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Side: Selected Webhook Details */}
              <div className="md:col-span-2">
                {selectedWebhook ? (
                  <Card className="glass-card">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Radio className="h-5 w-5 text-muted-foreground" />
                          Webhook Details
                        </CardTitle>
                        <CardDescription className="mt-1 break-all">
                          {selectedWebhook.url}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:bg-destructive/15 hover:text-destructive border-destructive/20"
                        onClick={() => deleteWebhook(selectedWebhook.id)}
                        disabled={deletingWebhookId === selectedWebhook.id}
                      >
                        {deletingWebhookId === selectedWebhook.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Revoking...
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" /> Revoke Endpoint
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Details Summary */}
                      <div className="grid grid-cols-2 gap-4 rounded-lg border border-border/40 p-4 bg-muted/20">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Status</p>
                          <p className="text-sm font-semibold text-green-500 mt-0.5">Active</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">Created At</p>
                          <p className="text-sm font-semibold mt-0.5">
                            {new Date(selectedWebhook.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Signing Secret */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Signing Secret Key</Label>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          This secret is used to sign webhook payloads. You should verify incoming signatures using the <code className="font-mono bg-muted px-1 py-0.5 rounded text-primary">svk-signature</code> header to ensure requests originate from Senviok.
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="flex-1 bg-card rounded px-3 py-2 text-sm font-mono break-all border border-border">
                            {selectedWebhook.secret}
                          </code>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(selectedWebhook.secret)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Subscribed Events */}
                      <div className="space-y-3 pt-4 border-t border-border/45">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Subscribed Events</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedWebhook.events.map((evt) => (
                            <span
                              key={evt}
                              className="inline-flex items-center rounded-full bg-primary/10 text-primary border border-primary/20 px-3 py-1 text-xs font-semibold font-mono"
                            >
                              {evt}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Developer Verification Guidance */}
                      <div className="space-y-3 pt-4 border-t border-border/45">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Signature Verification Example</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          We compute a HMAC SHA256 hex signature using your signing secret key and the raw request body. You can verify it in your backend like this:
                        </p>
                        <pre className="bg-card rounded-lg p-4 text-xs font-mono border border-border/50 overflow-x-auto text-muted-foreground leading-relaxed">
{`// NodeJS Example
const crypto = require('crypto');

function verifyWebhook(requestBody, signatureHeader, signingSecret) {
  const hmac = crypto.createHmac('sha256', signingSecret);
  const digest = hmac.update(requestBody).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signatureHeader)
  );
}`}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="glass-card h-full flex flex-col items-center justify-center p-12 text-center text-muted-foreground border-dashed">
                    <Radio className="h-12 w-12 text-muted-foreground/30 mb-4 animate-pulse" />
                    <CardTitle className="text-base font-medium">No Endpoint Selected</CardTitle>
                    <p className="text-sm mt-1 max-w-sm">
                      Select a webhook endpoint from the list to view its signing secret, subscribed events, and developer implementation details.
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          {/* Email Logs Tab */}
          <TabsContent value="logs">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Email Logs</CardTitle>
                  <CardDescription>Track the status of all your sent emails</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={fetchEmails}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {emails.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No emails sent yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Recipient</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Subject</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {emails.map((email) => (
                          <tr key={email.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-2 font-mono text-xs">{email.recipient}</td>
                            <td className="py-3 px-2">{email.subject}</td>
                            <td className="py-3 px-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${statusColor(email.status)}`}>
                                {email.status}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground text-xs">
                              {new Date(email.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Send Test Tab */}
          <TabsContent value="send">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Send Test Email</CardTitle>
                <CardDescription>Queue a test email through your Senvio pipeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="to">Recipient</Label>
                  <Input id="to" type="email" placeholder="user@example.com" value={testTo} onChange={(e) => setTestTo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={testSubject} onChange={(e) => setTestSubject(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Body (HTML)</Label>
                  <textarea
                    id="body"
                    className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={testBody}
                    onChange={(e) => setTestBody(e.target.value)}
                  />
                </div>
                <Button onClick={sendTestEmail} disabled={sending}>
                  <Send className="h-4 w-4 mr-2" /> {sending ? "Queuing..." : "Send Email"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
