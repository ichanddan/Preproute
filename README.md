# Preproute

A full-stack React application built with [React Router v7](https://reactrouter.com/) (framework mode) and server-side rendering.

## Tech Stack

- **[React Router v7](https://reactrouter.com/)** — framework mode with SSR, loaders/actions, and typed routes
- **[React 19](https://react.dev/)**
- **[Tailwind CSS v4](https://tailwindcss.com/)** — CSS-first configuration (no `tailwind.config.js`)
- **[shadcn/ui](https://ui.shadcn.com/)** — accessible component primitives (Radix UI, `radix-nova` style)
- **[Lucide](https://lucide.dev/)** icons
- **[Zod](https://zod.dev/)** for schema validation
- **[Bun](https://bun.sh/)** as the package manager and runtime
- **TypeScript** + **[Vite](https://vite.dev/)**

## Project Structure

```
app/
├── components/ui/   # shadcn/ui component primitives
├── hooks/           # Reusable React hooks
├── lib/             # `utils.ts` (`cn()` helper) and `fetch.ts` (HTTP client)
├── routes/          # Route modules
├── app.css          # Tailwind v4 + theme configuration
├── root.tsx         # Root layout and error boundary
└── routes.ts        # Route manifest (routes are declared explicitly here)
```

`~/*` maps to `app/*` — prefer `~/components/...`, `~/lib/utils`, `~/hooks/...` over relative imports.
