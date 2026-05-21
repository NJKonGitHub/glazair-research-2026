# Glazair Workshop Partner Portal — partners.glazair.com

Invitation-only onboarding portal for Glazair workshop partners. Single-page React app with token-based access control and EN/HU/DE i18n.

## Stack

- **Vite + React + TypeScript** — isolated build in `partners/`
- **react-i18next** — EN (full), HU (full), DE (stub)
- **Web Crypto API** — HMAC-SHA256 token verification in-browser (no backend)

---

## Environment variables

| Variable | Where used | Purpose |
|---|---|---|
| `VITE_PORTAL_TOKEN_SECRET` | `partners/.env` (Vite build) | Browser-side token verification |
| `PORTAL_TOKEN_SECRET` | `.env` in repo root | Token generation CLI |

Both must use the **same secret value**. Neither must be committed.

Copy the examples and fill in your secret:

```sh
cp partners/.env.example partners/.env
cp .env.example .env
# Edit both files — same value for both secrets
```

---

## Token contract

**Format:** `{base64url(payload)}.{base64url(HMAC-SHA256 signature)}`

**Payload shape:**
```json
{ "workshop_id": "string", "lang": "en" | "hu" | "de" }
```

**Signature:** HMAC-SHA256 of the base64url-encoded payload string, keyed with `PORTAL_TOKEN_SECRET`.

**Invitation URL:** `https://partners.glazair.com/{token}`

The portal extracts the token from `window.location.pathname` (first path segment), verifies the HMAC, then renders the portal in the language encoded in the payload. If invalid or absent, a neutral error screen is shown with no Glazair branding.

Language can be overridden at runtime via the language selector; the choice persists in `sessionStorage` under the key `glazair_portal_lang` for the session duration.

---

## Token generation CLI

```sh
node scripts/generate-token.js --token-id=<id> --lang=<en|hu|de>
```

Reads `PORTAL_TOKEN_SECRET` from `.env` in the repo root (or from the environment). Prints the full invitation URL to stdout; nothing else.

**Examples:**
```sh
node scripts/generate-token.js --token-id=HU-DEMO-001 --lang=hu
# → https://partners.glazair.com/eyJ0b2tlbl9pZCI6IkhVLURFTU8tMDAxIiwibGFuZyI6Imh1In0.<sig>

node scripts/generate-token.js --token-id=AT-TEST-007 --lang=de
# → https://partners.glazair.com/...
```

**Error cases** (exit code 1, message to stderr):
- `--token-id` missing
- `--lang` missing or not one of `en`, `hu`, `de`
- `PORTAL_TOKEN_SECRET` not set

The script uses Node.js built-in `crypto` — no extra dependencies needed.

---

## Development

```sh
cd partners
npm install
cp .env.example .env        # add VITE_PORTAL_TOKEN_SECRET
npm run dev
```

Then generate a token and open the URL, replacing the host with `localhost`:

```sh
node scripts/generate-token.js --token-id=LOCAL-001 --lang=en
# → https://partners.glazair.com/<token>
# Open: http://localhost:5173/<token>
```

---

## Build

```sh
cd partners
npm run build
# Output: partners/dist/
```

---

## i18n

Message files live in `partners/src/locales/`:

| File | Status |
|---|---|
| `en/portal.json` | Source language — complete |
| `hu/portal.json` | Hungarian — fully translated |
| `de/portal.json` | German AT — stub, all keys set to EN strings |

The DE file has a `_comment` key at the top: `"DE-AT translation pending"`.

To add a translation: update the corresponding `portal.json` file and add the locale to `partners/src/i18n.ts`.

---

## Deployment

The portal is an isolated SPA. Deploy `partners/dist/` to `partners.glazair.com`.

**Cloudflare Workers (recommended):** Add a new Worker or Pages project pointed at the `partners/dist/` output directory. Configure a catch-all route so all paths (`/*, /<token>`) serve `index.html` — the React app handles routing client-side.

Example `partners/wrangler.jsonc`:
```jsonc
{
  "name": "glazair-partner-portal",
  "compatibility_date": "2026-05-20",
  "assets": {
    "directory": "./dist"
  }
}
```

`VITE_PORTAL_TOKEN_SECRET` must be set as a build-time secret (e.g. via `wrangler secret` or your CI environment), not stored in a committed `.env` file.

`VITE_ANALYTICS_ENDPOINT` should also be set as a build-time secret if analytics are enabled (see below).

---

## Analytics

Portal events are posted fire-and-forget to a Google Apps Script web app. If `VITE_ANALYTICS_ENDPOINT` is not set, analytics calls are silently skipped — the portal works without it.

### Events logged

| Event | Extra fields |
|---|---|
| `session_start` | — |
| `section_view` | `section_id`, `duration_seconds` |
| `language_change` | `from_lang`, `to_lang` |
| `cta_click` | `cta` (`"1"` / `"2"` / `"3"`) |

All events include `token_id` and `lang`.

### Deploying the endpoint

1. Open the target Google Sheet (`1yNMg5d1iofwvo_K_wL63bMPfWAvQ7PDaNSPivgjETjM`)
2. **Extensions → Apps Script** — paste the contents of `scripts/analytics-endpoint.gs`
3. **Deploy → New deployment**: Type = Web app, Execute as = Me, Who has access = Anyone
4. Copy the Web App URL
5. Add it to `partners/.env` (local) and your CI / Cloudflare Pages environment as `VITE_ANALYTICS_ENDPOINT`

The script appends one row per event to Sheet1, auto-creating a header row on first write.

---

## Google Apps Script notes

Lessons learned deploying and debugging `scripts/analytics-endpoint.gs`:

- **302 redirect is normal.** Apps Script web apps respond to every POST with an HTTP 302 redirect to `script.googleusercontent.com/macros/echo?…`. The `doPost()` handler runs on the original POST before the redirect fires; the redirect serves the stored return value. Browsers following the redirect with default `redirect: follow` behaviour receive the JSON response normally. Do not confuse the 302 for an error.
- **Rhino runtime — no `URLSearchParams` or `Object.fromEntries`.** The V8 runtime flag in Apps Script does not guarantee availability in all deployment modes. `URLSearchParams` and `Object.fromEntries` throw `ReferenceError` in the Rhino runtime. Parse `application/x-www-form-urlencoded` bodies with a plain `split('&')` + `decodeURIComponent` loop (see the current implementation in `doPost()`).
- **Updating an existing deployment.** To update the script without changing the Web App URL: **Extensions → Apps Script → Deploy → Manage deployments → pencil icon → Version: New version → Deploy**. Clicking "New deployment" creates a new URL and leaves the old deployment unchanged — the URL in `.env` will still hit the old code.

---

## Future work

- **Token generation UI** — currently CLI-only (`scripts/generate-token.js`)
- **Protected contract view** — post-golive: serve the partnership agreement PDF behind a separate authenticated route
- **Personalised in-portal contract** — token details pre-filled in the agreement section
- **DE-AT full translation** — `de/portal.json` currently contains EN strings; translation pending
