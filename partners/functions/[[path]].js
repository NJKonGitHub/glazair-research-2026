/**
 * Glazair Partner Portal — edge gate (Cloudflare Pages Function)
 *
 * Intercepts every request to a token-shaped path and enforces:
 *   1. Token expiry   — decoded from the payload (no HMAC needed at the edge)
 *   2. Use-count cap  — MAX_USES per token, tracked in Cloudflare KV
 *
 * Full HMAC verification + expiry re-check is performed in the browser (token.ts).
 * This layer prevents the SPA from loading at all for blocked or expired tokens.
 *
 * Required KV binding — configure in Cloudflare Pages dashboard:
 *   Pages → <project> → Settings → Functions → KV namespace bindings
 *   Variable name : PORTAL_USE_COUNTS
 *   KV namespace  : create one named "portal-use-counts" under Workers & Pages → KV
 *
 * Local dev:
 *   vite dev  (no function — gate is skipped; fine for portal development)
 *   wrangler pages dev dist --kv PORTAL_USE_COUNTS  (full stack with gate)
 */

const MAX_USES = 3

// Matches the token format: {base64url payload}.{base64url sig (43 chars for SHA-256)}
const TOKEN_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]{43}$/

function decodePayload(payloadB64) {
  try {
    const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64.padEnd(b64.length + ((4 - (b64.length % 4)) % 4), '=')
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

async function tokenHash(tokenStr) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(tokenStr))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const BLOCKED_HTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Glazair</title>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{min-height:100dvh;display:flex;align-items:center;justify-content:center;
         background:#0a0a0a;color:#e5e5e5;font-family:system-ui,sans-serif}
    .wrap{text-align:center;padding:2rem}
    .rule{display:block;width:2rem;height:2px;background:#e5e5e5;margin:0 auto 1.5rem}
    p{font-size:0.9375rem;opacity:0.7;letter-spacing:0.01em}
  </style>
</head>
<body>
  <main class="wrap" role="status" aria-live="polite">
    <span class="rule" aria-hidden="true"></span>
    <p>This link is not valid or has expired.</p>
  </main>
</body>
</html>`

const BLOCKED_RESPONSE = () => new Response(BLOCKED_HTML, {
  status: 200,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  },
})

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const segment = url.pathname.split('/').filter(Boolean)[0] ?? ''

  // Pass through anything that is not a token-shaped path
  // (static assets, root, etc.)
  if (!TOKEN_RE.test(segment)) {
    return next()
  }

  const payloadB64 = segment.split('.')[0]
  const payload = decodePayload(payloadB64)

  // 1. Expiry check — runs before KV to avoid an unnecessary read
  if (payload && typeof payload.exp === 'number') {
    if (Math.floor(Date.now() / 1000) > payload.exp) {
      return BLOCKED_RESPONSE()
    }
  }

  // 2. Use-count check
  // If the KV binding is absent (local vite dev), skip silently.
  if (env.PORTAL_USE_COUNTS) {
    const key = await tokenHash(segment)
    const countStr = await env.PORTAL_USE_COUNTS.get(key)
    const count = countStr ? parseInt(countStr, 10) : 0

    if (count >= MAX_USES) {
      return BLOCKED_RESPONSE()
    }

    // Increment — TTL aligned to token lifetime so KV self-cleans
    const remainingSec = (payload && typeof payload.exp === 'number')
      ? Math.max(86400, payload.exp - Math.floor(Date.now() / 1000) + 86400)
      : 8 * 86400
    await env.PORTAL_USE_COUNTS.put(key, String(count + 1), { expirationTtl: remainingSec })
  }

  return next()
}
