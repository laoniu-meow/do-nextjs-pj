import { z } from 'zod'

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  POSTGRES_CONTAINER_NAME: z.string().min(1),
  POSTGRES_DB: z.string().min(1),
  POSTGRES_USER: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_PORT: z.string().regex(/^\d+$/).transform(Number),
  POSTGRES_HOST_AUTH_METHOD: z.string().min(1),

  // NextAuth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Email
  EMAIL_SERVER_HOST: z.string().min(1),
  EMAIL_SERVER_PORT: z.string().regex(/^\d+$/).transform(Number),
  EMAIL_SERVER_USER: z.string().email(),
  EMAIL_SERVER_PASSWORD: z.string().min(1),

  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // File Upload
  MAX_FILE_SIZE: z.string().regex(/^\d+$/).transform(Number).default(5242880),
  UPLOAD_LOGOS_DIR: z.string().min(1).default("assets/logo"),
  UPLOAD_MEDIA_DIR: z.string().min(1).default("assets/media"),
  UPLOAD_DOCS_DIR: z.string().min(1).default("assets/docs"),

  // Email Encryption
  EMAIL_ENCRYPTION_KEY: z.string().length(64),

  // CORS
  CORS_ORIGIN: z.string().min(1),

  // Optional
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEBUG: z.string().optional(),
  BCRYPT_ROUNDS: z.string().regex(/^\d+$/).transform(Number).default(12)
})

type EnvConfig = z.infer<typeof envSchema>

function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = (error as unknown as { errors: Array<{ path: string[] }> }).errors.map(err => err.path.join('.'))
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

export const env = validateEnv()

// Environment-specific configurations
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Database configuration
export const dbConfig = {
  url: env.DATABASE_URL,
  containerName: env.POSTGRES_CONTAINER_NAME,
  database: env.POSTGRES_DB,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  port: env.POSTGRES_PORT,
  authMethod: env.POSTGRES_HOST_AUTH_METHOD
}

// Email configuration
export const emailConfig = {
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  user: env.EMAIL_SERVER_USER,
  password: env.EMAIL_SERVER_PASSWORD,
  encryptionKey: env.EMAIL_ENCRYPTION_KEY
}

// JWT configuration
export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN
}

// Upload configuration
export const uploadConfig = {
  maxFileSize: env.MAX_FILE_SIZE,
  logosDir: env.UPLOAD_LOGOS_DIR,
  mediaDir: env.UPLOAD_MEDIA_DIR,
  docsDir: env.UPLOAD_DOCS_DIR
}

// CORS configuration
export const corsConfig = {
  origin: env.CORS_ORIGIN
}
