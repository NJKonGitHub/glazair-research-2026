/**
 * Glazair Partner Portal — fire-and-forget analytics
 *
 * Call init() once after token verification, then post() anywhere in the app.
 * If VITE_ANALYTICS_ENDPOINT is not set, all calls are silently no-ops.
 */

let _tokenId = ''
let _lang = ''
const _endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined

export function init(tokenId: string, lang: string): void {
  _tokenId = tokenId
  _lang = lang
}

export function post(event: string, payload?: Record<string, unknown>): void {
  if (!_endpoint) return
  // URLSearchParams produces application/x-www-form-urlencoded — a CORS
  // "simple request" that never triggers a preflight. Apps Script web apps
  // do not handle OPTIONS, so this avoids the preflight failure entirely.
  // mode: 'no-cors' means we cannot read the response, but the POST still
  // reaches the script — sufficient for fire-and-forget analytics.
  fetch(_endpoint, {
    method: 'POST',
    mode: 'no-cors',
    body: new URLSearchParams({
      payload: JSON.stringify({ token_id: _tokenId, lang: _lang, event, ...payload }),
    }),
  }).catch(() => {
    /* intentionally silent — analytics must never break the portal */
  })
}
