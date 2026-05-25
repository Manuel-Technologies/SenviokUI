import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { ArrowLeft, Copy, LogOut } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const API_URL = import.meta.env.VITE_API_URL || "https://api.senviok.live";
const ENDPOINT = `${API_URL}/v1/emails`;

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "your-startup";
};

const langMap: Record<string, string> = {
  curl: "bash",
  js: "javascript",
  ts: "typescript",
  csharp: "csharp",
  python: "python",
  go: "go",
  rust: "rust",
  php: "php",
  ruby: "ruby",
};

const highlighterStyle = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: "transparent",
    margin: 0,
    padding: 0,
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: "transparent",
    fontSize: "0.75rem",
    lineHeight: "1.625",
  },
};

export default function ApiDocs() {
  const { user, session, signOut } = useAuth();
  const navigate = useNavigate();
  const [keyPrefix, setKeyPrefix] = useState<string>("svk_live_xxxxxxxx...");
  const [tenantSlug, setTenantSlug] = useState<string>("your-startup");

  useEffect(() => {
    if (user) {
      setTenantSlug(generateSlug(user.name || "your-startup"));
      (async () => {
        if (!session?.access_token) return;
        try {
          const res = await fetch(`${API_URL}/v1/api-keys`, {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.data && data.data.length > 0) {
              setKeyPrefix(data.data[0].prefix);
            }
          }
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [user, session]);

  const apiKeyPlaceholder = "YOUR_API_KEY";

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const snippets: Record<string, string> = {
    curl: `curl -X POST ${ENDPOINT} \\
  -H "Authorization: Bearer ${apiKeyPlaceholder}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "from": "noreply@${tenantSlug}.mail.senviok.live",
    "subject": "Welcome to Senviok",
    "html": "<h1>Hello!</h1><p>Sent via Senviok.</p>"
  }'`,
    js: `// Node.js / Browser (fetch)
const res = await fetch("${ENDPOINT}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${apiKeyPlaceholder}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    to: "user@example.com",
    from: "noreply@${tenantSlug}.mail.senviok.live",
    subject: "Welcome to Senviok",
    html: "<h1>Hello!</h1><p>Sent via Senviok.</p>",
  }),
});

const data = await res.json();
console.log(data);`,
    ts: `// TypeScript SDK-style helper
interface SendEmailInput {
  to: string;
  from?: string;
  fromName?: string;
  subject: string;
  html?: string;
  text?: string;
}

interface SendEmailResponse {
  id: string;
}

export async function sendEmail(
  apiKey: string,
  input: SendEmailInput
): Promise<SendEmailResponse> {
  const res = await fetch("${ENDPOINT}", {
    method: "POST",
    headers: {
      Authorization: \`Bearer \${apiKey}\`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error(\`Senviok error: \${res.status}\`);
  return res.json();
}

await sendEmail("${apiKeyPlaceholder}", {
  to: "user@example.com",
  subject: "Welcome",
  html: "<h1>Hello!</h1>",
});`,
    csharp: `// C# (.NET HttpClient)
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

public class SenviokClient
{
    private static readonly HttpClient client = new HttpClient();

    public static async Task SendEmailAsync()
    {
        var payload = new
        {
            to = "user@example.com",
            from = "noreply@${tenantSlug}.mail.senviok.live",
            subject = "Welcome to Senviok",
            html = "<h1>Hello!</h1><p>Sent via Senviok C# HttpClient.</p>"
        };

        var request = new HttpRequestMessage(HttpMethod.Post, "${ENDPOINT}");
        request.Headers.Add("Authorization", "Bearer ${apiKeyPlaceholder}");
        request.Content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );

        var response = await client.SendAsync(request);
        string responseString = await response.Content.ReadAsStringAsync();
        Console.WriteLine($"Status: {response.StatusCode}");
        Console.WriteLine($"Body: {responseString}");
    }
}`,
    python: `# Python (requests)
import requests

resp = requests.post(
    "${ENDPOINT}",
    headers={
        "Authorization": "Bearer ${apiKeyPlaceholder}",
        "Content-Type": "application/json",
    },
    json={
        "to": "user@example.com",
        "from": "noreply@${tenantSlug}.mail.senviok.live",
        "subject": "Welcome to Senviok",
        "html": "<h1>Hello!</h1><p>Sent via Senviok.</p>",
    },
    timeout=15,
)

print(resp.status_code, resp.json())`,
    go: `// Go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]string{
		"to":      "user@example.com",
		"from":    "noreply@${tenantSlug}.mail.senviok.live",
		"subject": "Welcome to Senviok",
		"html":    "<h1>Hello!</h1>",
	})

	req, _ := http.NewRequest("POST", "${ENDPOINT}", bytes.NewBuffer(payload))
	req.Header.Set("Authorization", "Bearer ${apiKeyPlaceholder}")
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("status:", resp.Status)
}`,
    rust: `// Rust (reqwest + tokio)
use reqwest::Client;
use serde_json::json;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::new();
    let res = client
        .post("${ENDPOINT}")
        .bearer_auth("${apiKeyPlaceholder}")
        .json(&json!({
            "to": "user@example.com",
            "from": "noreply@${tenantSlug}.mail.senviok.live",
            "subject": "Welcome to Senviok",
            "html": "<h1>Hello!</h1>"
        }))
        .send()
        .await?;

    println!("status: {}", res.status());
    println!("body: {}", res.text().await?);
    Ok(())
}`,
    php: `// PHP (Guzzle HTTP Client)
<?php
require 'vendor/autoload.php';

use GuzzleHttp\\Client;

$client = new Client();
$response = $client->post('${ENDPOINT}', [
    'headers' => [
        'Authorization' => 'Bearer ${apiKeyPlaceholder}',
        'Content-Type' => 'application/json',
    ],
    'json' => [
        'to' => 'user@example.com',
        'from' => 'noreply@${tenantSlug}.mail.senviok.live',
        'subject' => 'Welcome to Senviok',
        'html' => '<h1>Hello!</h1><p>Sent via Guzzle.</p>',
    ]
]);

echo $response->getBody();`,
    ruby: `# Ruby (Net::HTTP)
require 'net/http'
require 'uri'
require 'json'

uri = URI.parse("${ENDPOINT}")
header = {
  'Content-Type' => 'application/json',
  'Authorization' => 'Bearer ${apiKeyPlaceholder}'
}
payload = {
  to: "user@example.com",
  from: "noreply@${tenantSlug}.mail.senviok.live",
  subject: "Welcome to Senviok",
  html: "<h1>Hello!</h1>"
}

http = Net::HTTP.new(uri.host, uri.port)
request = Net::HTTP::Post.new(uri.request_uri, header)
request.body = payload.to_json

response = http.request(request)
puts "Response #{response.code}: #{response.body}"`,
  };

  const tabs: { value: string; label: string }[] = [
    { value: "curl", label: "cURL" },
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "csharp", label: "C# (.NET)" },
    { value: "python", label: "Python" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Dashboard
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
        <header className="space-y-2">
          <Badge variant="secondary" className="mb-2">v1 · Stable</Badge>
          <h1 className="text-4xl font-bold tracking-tight">API Documentation</h1>
          <p className="text-muted-foreground max-w-2xl">
            Send transactional emails programmatically from any language. All requests are
            authenticated with a Bearer API key from your dashboard.
          </p>
        </header>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Endpoint</CardTitle>
            <CardDescription>Base URL for all API requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/15 text-green-500 border border-green-500/30 hover:bg-green-500/15">POST</Badge>
              <code className="flex-1 bg-muted/50 rounded px-3 py-2 text-sm font-mono break-all border border-border">
                {ENDPOINT}
              </code>
              <Button size="sm" variant="outline" onClick={() => copy(ENDPOINT)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Authentication: <code className="font-mono">Authorization: Bearer {keyPrefix}</code>
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-primary/30">
          <CardHeader>
            <CardTitle>Your Sending Address</CardTitle>
            <CardDescription>
              Every tenant gets an isolated subdomain. All emails you send are From this address by default.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/15">FROM</Badge>
              <code className="flex-1 bg-muted/50 rounded px-3 py-2 text-sm font-mono break-all border border-border">
                noreply@{tenantSlug}.mail.senviok.live
              </code>
              <Button size="sm" variant="outline" onClick={() => copy(`noreply@${tenantSlug}.mail.senviok.live`)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              You can override <code className="font-mono">from</code> with any address on{" "}
              <code className="font-mono">@{tenantSlug}.mail.senviok.live</code> (e.g.{" "}
              <code className="font-mono">support@{tenantSlug}.mail.senviok.live</code>). Other domains are rejected.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Request Body</CardTitle>
            <CardDescription>JSON payload schema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Field</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Required</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  <tr className="border-b border-border/50"><td className="py-2 px-2">to</td><td>string</td><td>Yes</td><td className="font-sans">Recipient email address</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2">from</td><td>string</td><td>Yes</td><td className="font-sans">Sender email address (must end with your tenant subdomain)</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2">fromName</td><td>string</td><td>No</td><td className="font-sans">Name displayed as the sender</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2">subject</td><td>string</td><td>Yes</td><td className="font-sans">Email subject line</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2">html</td><td>string</td><td>No</td><td className="font-sans">HTML body content (specify either html or text)</td></tr>
                  <tr><td className="py-2 px-2">text</td><td>string</td><td>No</td><td className="font-sans">Plain text body content</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Code Examples</CardTitle>
            <CardDescription>Drop-in snippets for popular languages</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="curl">
              <TabsList className="grid grid-cols-3 md:grid-cols-9 w-full">
                {tabs.map((t) => (
                  <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>
                ))}
              </TabsList>
              {tabs.map((t) => (
                <TabsContent key={t.value} value={t.value} className="mt-4">
                  <div className="relative bg-[#1e1e1e] border border-border rounded-lg overflow-hidden">
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
                      onClick={() => copy(snippets[t.value])}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                    </Button>
                    <SyntaxHighlighter
                      language={langMap[t.value] || "text"}
                      style={highlighterStyle}
                      customStyle={{ padding: "1rem", paddingRight: "6rem", margin: 0, background: "transparent" }}
                      showLineNumbers={false}
                    >
                      {snippets[t.value]}
                    </SyntaxHighlighter>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>Successful 200 response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-[#1e1e1e] border border-border rounded-lg overflow-hidden">
              <SyntaxHighlighter
                language="json"
                style={highlighterStyle}
                customStyle={{ padding: "1rem", margin: 0, background: "transparent" }}
              >
                {`{
  "id": "em_01HZ8X9K2P7ABCDEF"
}`}
              </SyntaxHighlighter>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Error Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Code</th>
                    <th className="text-left py-2 px-2 font-medium text-muted-foreground">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono">400</td><td className="font-mono text-xs">invalid_request</td><td>Missing or malformed fields</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono">401</td><td className="font-mono text-xs">unauthorized</td><td>Invalid or missing API key</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono">403</td><td className="font-mono text-xs">forbidden</td><td>Access denied (e.g. invalid tenant subdomain)</td></tr>
                  <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono">429</td><td className="font-mono text-xs">rate_limited</td><td>Too many requests</td></tr>
                  <tr><td className="py-2 px-2 font-mono">500</td><td className="font-mono text-xs">server_error</td><td>Internal error — retry with backoff</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Webhooks</CardTitle>
            <CardDescription>Receive real-time HTTPS callbacks for message delivery events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Senviok can send POST payloads to your registered endpoints when messages are processed. Webhook callbacks include security signatures and timestamps to allow verification of origin.
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Supported Events</h4>
              <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                <li><code className="font-mono text-primary text-xs">message.sent</code>: Triggered immediately when an email or SMS is successfully dispatched.</li>
                <li><code className="font-mono text-primary text-xs">message.failed</code>: Triggered when email/SMS transmission fails after provider retries.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Webhook HTTP Headers</h4>
              <p className="text-xs text-muted-foreground">Every webhook request contains the following headers:</p>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-medium text-muted-foreground">
                      <th className="py-2 px-2">Header Name</th>
                      <th className="py-2 px-2">Description / Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono font-semibold text-primary">svk-signature</td><td className="font-sans">HMAC SHA256 signature computed using your webhook signing secret key and the raw JSON request body</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono font-semibold text-primary">svk-event-id</td><td className="font-sans">The unique identifier of the event callback</td></tr>
                    <tr className="border-b border-border/50"><td className="py-2 px-2 font-mono font-semibold text-primary">svk-timestamp</td><td className="font-sans">Unix epoch timestamp (seconds) indicating when the webhook was dispatched</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Example Event Payload</h4>
              <div className="bg-[#1e1e1e] border border-border rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="json"
                  style={highlighterStyle}
                  customStyle={{ padding: "1rem", margin: 0, background: "transparent" }}
                >
                  {`{
  "eventId": "evt_47cba8b1e92d41ba95e0",
  "tenantId": "${tenantSlug}",
  "eventType": "message.sent",
  "createdAt": "${new Date().toISOString()}",
  "data": {
    "messageId": "msg_89f074d2eb349a...",
    "providerMessageId": "ses-a9f82-29fa3-10d...",
    "channel": "Email",
    "status": "Sent"
  }
}`}
                </SyntaxHighlighter>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Verify Signatures (C# example)</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                To guarantee webhooks originate from Senviok, compute the SHA256 HMAC of the raw request payload using your signing secret key and compare it to the <code className="font-mono bg-muted px-1 rounded text-primary">svk-signature</code> header:
              </p>
              <div className="bg-[#1e1e1e] border border-border rounded-lg overflow-hidden">
                <SyntaxHighlighter
                  language="csharp"
                  style={highlighterStyle}
                  customStyle={{ padding: "1rem", margin: 0, background: "transparent" }}
                >
                  {`using System.Security.Cryptography;
using System.Text;

public static bool VerifyWebhookSignature(string rawJsonBody, string signatureHeader, string signingSecret)
{
    var keyBytes = Encoding.UTF8.GetBytes(signingSecret);
    var payloadBytes = Encoding.UTF8.GetBytes(rawJsonBody);

    using var hmac = new HMACSHA256(keyBytes);
    var hashBytes = hmac.ComputeHash(payloadBytes);
    
    // Convert hash bytes to a lower-case hexadecimal string
    var computedSignature = Convert.ToHexString(hashBytes).ToLowerInvariant();

    return CryptographicOperations.FixedTimeEquals(
        Encoding.UTF8.GetBytes(computedSignature),
        Encoding.UTF8.GetBytes(signatureHeader)
    );
}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
