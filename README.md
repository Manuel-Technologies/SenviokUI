# SenviokUI Frontend

This repository contains the frontend implementation for `SenviokUI`, a modern React + Vite UI project built with a terminal-style dashboard aesthetic.

## Repository Overview

- **Framework**: React 18
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Tailwind animations
- **UI Primitives**: Radix UI
- **State & Data**: React Router, React Query
- **Testing**: Vitest

## Key Features

- Responsive dashboard UI with terminal-inspired components
- Reusable component library under `src/components/ui`
- Auth context and protected route handling
- Modern form handling and validation
- Charting, tables, modals, alerts, notifications, and mobile-friendly layouts

## Getting Started

### Prerequisites

- Node.js 20+ or compatible runtime
- npm installed
- Optional: `pnpm` or `bun` for alternative package management

### Install dependencies

```bash
cd c:/Users/NWCS/Desktop/senviokFrontend
npm install
```

### Run development server

```bash
npm run dev
```

Open the local URL shown in the terminal to preview the application.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run tests

```bash
npm test
```

## Project Structure

- `src/main.tsx` – frontend application entrypoint
- `src/App.tsx` – main app router and layout
- `src/pages` – page views and routes
- `src/components` – reusable components and UI primitives
- `src/contexts` – app-level React contexts
- `src/hooks` – custom React hooks
- `src/lib` – shared utilities and helpers
- `public` – static assets served by Vite

## Workflow

1. Create or update components under `src/components`
2. Add pages in `src/pages` and wire routes in `App.tsx`
3. Use `npm run dev` for local development
4. Run `npm run build` before deploying

## GitHub Repository

This repository is configured to push to `https://github.com/Manuel-Technologies/SenviokUI.git`.

## Notes

- `.gitignore` excludes `node_modules`, `dist`, build artifacts, logs, and editor settings.
- The current frontend is configured as a private package with `type: module`.
- If your environment requires a `.env` file, create it from any project `.env.example` or add environment variables as needed.

## Contributing

- Make feature branches from `main`
- Open pull requests with clear descriptions
- Add tests for new logic where appropriate

## License

This repository does not include a license file. Add one if required for your project.
