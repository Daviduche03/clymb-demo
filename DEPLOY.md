# try.useclymb.com — going live

Two pieces, one domain.

## The pieces

1. **The demo site** — static files built from `demo/` (`pnpm demo:build`
   produces `demo/dist`). It has no database and no secrets.
2. **The API** — the existing Clymb backend, plus the demo endpoints under
   `/api/v1/demos` (called by Hark to create demos, and by the site to load
   products, orders, chat and payments). Needs `CLYMB_DEMO_API_KEY`,
   `DEMO_APP_URL=https://try.useclymb.com`, and the usual Cloudinary /
   email / Polar keys. The claim flow creates dual-price Polar checkouts
   (USD + the seller's local currency, picked from the country they enter)
   and confirms payment via the Polar API.

## The one hosting rule

Browsers won't let a page on one domain call an API on another domain
without extra setup. So `try.useclymb.com` serves **both** from one address:

- anything starting with `/api/` → forward to the API server
- everything else → serve the static files from `demo/dist`,
  falling back to `index.html` (so `/<brand>?k=<token>` links opened
  from a DM load the right store)

That forwarding rule is the whole "proxy" thing. Examples:

**Caddy**

```caddy
try.useclymb.com {
  reverse_proxy /api/* api-host.internal:3002
  root * /srv/demo/dist
  try_files {path} /index.html
  file_server
}
```

**nginx**

```nginx
location /api/ { proxy_pass http://api-host.internal:3002; }
location / { root /srv/demo/dist; try_files $uri /index.html; }
```

**Vercel** (`vercel.json` in `demo/` — committed)

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.useclymb.com/api/:path*" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The first rule proxies the demo's same-origin `/api/v1/...` calls to the
production API; the second is the SPA fallback so `/<brand>?k=<token>`
links load the app (Vercel still serves real files from `dist` first).

## Local testing (why Vite mentions a proxy)

On your machine the site runs on `:4010` and the API on `:3002` — two
different addresses, same browser rule. So the Vite dev server forwards
`/api/*` to the API for you automatically (`pnpm demo:dev` sets this up).
Nothing to configure; production just needs the equivalent rule above.
