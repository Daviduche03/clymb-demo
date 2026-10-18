# Clymb demo

Public, shareable walkthrough of the Clymb product — the dashboard, store,
team, orders and site views — behind a per-demo link. Buyers open
`/<brand>?k=<token>` from a DM and walk through a live, seeded storefront
backed by the Clymb API.

Built with Vite, React 19, Tailwind v4 and React Router. No database and no
secrets of its own; all data comes from the Clymb backend under `/api/v1/demos`.

## Local development

```bash
pnpm install
BACKEND_URL=http://localhost:3002 pnpm dev
```

The dev server runs on `:4010` and proxies `/api/*` to `BACKEND_URL`
(default `http://localhost:3000`).

## Build

```bash
pnpm build      # emits demo/dist
pnpm preview
```

## Deploy

See [DEPLOY.md](./DEPLOY.md). Production is served at `try.useclymb.com`,
where `/api/*` is proxied to the API host and everything else serves
`demo/dist` with an `index.html` fallback.
