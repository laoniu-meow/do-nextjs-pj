import { NextRequest } from 'next/server'
import { extractTokenFromRequest } from './auth-shared'
import type { JWTPayload } from '@/types'

function base64UrlToArrayBuffer(base64Url: string): ArrayBuffer {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  const normalized = base64 + pad
  const binary = atob(normalized)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

function stringToArrayBuffer(value: string): ArrayBuffer {
  return new TextEncoder().encode(value).buffer
}

// Edge Runtime compatible JWT (HS256) verification using WebCrypto
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret || secret.length < 32) return null

    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, encodedSignature] = parts
    const data = `${encodedHeader}.${encodedPayload}`

    const headerJson = atob(encodedHeader.replace(/-/g, '+').replace(/_/g, '/'))
    const header = JSON.parse(headerJson)
    if (header.alg !== 'HS256' || header.typ !== 'JWT') return null

    const key = await crypto.subtle.importKey(
      'raw',
      stringToArrayBuffer(secret),
      { name: 'HMAC', hash: { name: 'SHA-256' } },
      false,
      ['verify']
    )

    const verified = await crypto.subtle.verify(
      'HMAC',
      key,
      base64UrlToArrayBuffer(encodedSignature),
      stringToArrayBuffer(data)
    )
    if (!verified) return null

    const payloadJson = atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(payloadJson)

    if (!payload.userId || !payload.email || !payload.role) return null

    // Optional: Validate exp claim if present
    if (typeof payload.exp === 'number' && Date.now() >= payload.exp * 1000) {
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export async function authenticateRequestEdge(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const token = extractTokenFromRequest(request)
    if (!token) return null
    return await verifyTokenEdge(token)
  } catch {
    return null
  }
}
