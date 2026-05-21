# Glazair Research 2026 — Backlog

Open and resolved items for work tracked in this repo.

---

## Backlog

### FEAT: Portal — DE-AT full translation
**Priority:** Low
**Context:** `de/portal.json` in `partners/src/locales/de/` currently contains EN placeholder strings. The portal detects `lang=de` from the token and switches to the `de` namespace, but the text is in English. A native German-Austrian translator needs to provide all strings. No code changes required — only the JSON file.
**Action:** Translate all keys in `de/portal.json` using `en/portal.json` as the source. Replace file, rebuild and deploy.

---

### FEAT: Portal — token generation UI
**Priority:** Medium
**Context:** Partner tokens are currently generated via CLI only: `node scripts/generate-token.js <token_id> <lang>`. An operator UI (even a simple internal page) would let non-technical staff generate and revoke tokens without touching the terminal.
**Action:** Design session required. Decide hosting (operator surface in main app vs standalone internal tool), auth requirements, and whether token revocation is needed.

---

### FEAT: Portal — protected contract view
**Priority:** Low — post-golive
**Context:** The partnership agreement (Section 08) currently contains only placeholder text. Post-golive, the actual agreement PDF should be served behind the token gate — either embedded inline or as a download link that requires token auth.
**Action:** Decide format (inline PDF viewer vs download). Implement authenticated PDF serving endpoint or signed S3 URL. Integrate into `S08Agreement.tsx`.

---

### FEAT: Portal — personalised in-portal contract
**Priority:** Low
**Context:** The token payload already carries `token_id` which maps to a specific partner. The agreement section could pre-fill partner name, entity details, and commercial terms from a lookup rather than showing a generic contract.
**Action:** Design session required. Define the data source (partner registry table or separate config), what fields are pre-filled, and whether the personalised view is for display only or also generates a signable document.

---

## Resolved

### FEAT: Workshop partner onboarding portal — partners.glazair.com
**Status:** Complete — deployed on Cloudflare Pages, analytics pipeline live
**Context:** Single-page partner portal served at a token-gated URL. Partners receive a signed HMAC-SHA256 token encoding `token_id` and `lang` (`en` / `hu` / `de`). The token is verified in-browser via Web Crypto API against `VITE_PORTAL_TOKEN_SECRET`. Eight horizontal scroll-snap sections cover the Glazair pitch, platform overview, roles, quoting, getting started, Q&A, commercial terms, and a final CTA block. The CTA block captures one-way agreement intent (agree / questions / decline) without mailto — state is locked after first click and a `cta_click` event fires to analytics. Fire-and-forget analytics (`session_start`, `section_view`, `language_change`, `cta_click`) post to a Google Apps Script web app via `application/x-www-form-urlencoded` + `mode: no-cors` (CORS simple request — no preflight). The Apps Script appends one row per event to a Google Sheet and sends a `GmailApp` email notification on `cta_click`. Full i18n for EN / HU; DE strings are EN copies pending translation. Token generation is CLI-only (`scripts/generate-token.js`).
**Key files:** `partners/src/`, `scripts/analytics-endpoint.gs`, `scripts/generate-token.js`, `partners/README.md`
