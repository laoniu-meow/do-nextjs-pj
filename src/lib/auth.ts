import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { jwtConfig } from './env'
import { NextRequest } from 'next/server'
import { extractTokenFromRequest } from './auth-shared'
import type { JWTPayload } from '@/types'

// JWTPayload type is defined centrally in src/types

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12')
  return bcrypt.hash(password, saltRounds)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: JWTPayload): string {
  const secret = jwtConfig.secret
  return jwt.sign(payload, secret, {
    expiresIn: jwtConfig.expiresIn
  } as jwt.SignOptions)
}

export function verifyToken(token: string): JWTPayload {
  const secret = jwtConfig.secret
  return jwt.verify(token, secret) as JWTPayload
}

export function authenticateRequest(request: NextRequest): JWTPayload | null {
  try {
    const token = extractTokenFromRequest(request)
    if (!token) return null
    
    return verifyToken(token)
  } catch {
    return null
  }
}
