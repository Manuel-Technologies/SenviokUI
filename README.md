# Senvio Mail Relay

Senvio is a fast, secure, and reliable transactional mail relay infrastructure tailored for developers. It offers a developer-first email API with queuing, automatic retries, and real-time logs.

## Features

- **Async Queue Processing**: Emails are queued and processed asynchronously with automatic retries and exponential backoff.
- **RESTful API**: Easily integrate with any language or framework using simple HTTP requests.
- **API Key Authentication**: Secure, hashed API keys with per-user isolation.
- **Real-Time Logs**: Track every email — queued, sent, or failed.

## Quick Start

```bash
curl -X POST https://api.senvio.dev/send-email \
  -H "Authorization: Bearer sv_live_xxxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello from Senvio",
    "body": "<h1>Welcome!</h1>"
  }'
```

## Dashboard & Setup

Senvio comes with a built-in highly stylized dashboard mimicking terminal aesthetics to manage your API keys, monitor email queues, and check delivery status.

1. Clone the repository.
2. Run `npm install`.
3. Create your `.env` file (see `.env.example`).
4. Start the frontend development server: `npm run dev`.

## Modern Terminal UI
Senvio's UI is designed to give you a modern, terminal hacker aesthetic with neon green styling and space-mono typography, reducing eye strain and putting performance first.
