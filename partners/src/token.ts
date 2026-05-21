export type Lang = 'en' | 'hu' | 'de'

export interface TokenPayload {
  token_id: string
  lang: Lang
}

function base64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + ((4 - (s.length % 4)) % 4), '=')
  return Uint8Array.from(atob(b64), (c) => c.charCodeAt(0))
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  const secret = import.meta.env.VITE_PORTAL_TOKEN_SECRET as string | undefined
  if (!secret) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payloadB64, sigB64] = parts

  let payloadObj: unknown
  try {
    const payloadBytes = base64urlDecode(payloadB64)
    payloadObj = JSON.parse(new TextDecoder().decode(payloadBytes))
  } catch {
    return null
  }

  if (
    typeof payloadObj !== 'object' ||
    payloadObj === null ||
    typeof (payloadObj as Record<string, unknown>)['token_id'] !== 'string' ||
    !['en', 'hu', 'de'].includes((payloadObj as Record<string, unknown>)['lang'] as string)
  ) {
    return null
  }

  try {
    const keyBytes = new TextEncoder().encode(secret)
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    )
    const messageBytes = new TextEncoder().encode(payloadB64)
    const sigBytes = base64urlDecode(sigB64).buffer as ArrayBuffer
    const valid = await crypto.subtle.verify('HMAC', cryptoKey, sigBytes, messageBytes)
    if (!valid) return null
  } catch {
    return null
  }

  return payloadObj as TokenPayload
}

export function extractToken(): string | null {
  const path = window.location.pathname
  const segment = path.split('/').filter(Boolean)[0]
  return segment ?? null
}
