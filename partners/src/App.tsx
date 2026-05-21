import { useState, useEffect } from 'react'
import { verifyToken, extractToken } from './token'
import { initI18n, resolveInitialLang } from './i18n'
import Portal from './Portal'
import * as analytics from './analytics'
import type { TokenPayload } from './token'

type State =
  | { status: 'loading' }
  | { status: 'valid'; payload: TokenPayload }
  | { status: 'invalid' }

export default function App() {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    async function boot() {
      const raw = extractToken()
      if (!raw) { setState({ status: 'invalid' }); return }

      const payload = await verifyToken(raw)
      if (!payload) { setState({ status: 'invalid' }); return }

      const lang = resolveInitialLang(payload.lang)
      await initI18n(lang)
      analytics.init(payload.token_id, lang)
      analytics.post('session_start')
      setState({ status: 'valid', payload: { ...payload, lang } })
    }
    boot()
  }, [])

  if (state.status === 'loading') return null

  if (state.status === 'invalid') {
    return (
      <div className="invalid-screen">
        <main className="invalid-notice" role="status" aria-live="polite">
          <span className="invalid-rule" aria-hidden="true" />
          <p className="invalid-text">This link is not valid or has expired.</p>
        </main>
      </div>
    )
  }

  return <Portal lang={state.payload.lang} tokenId={state.payload.token_id} />
}
