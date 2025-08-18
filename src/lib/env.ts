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
  UPLOAD_LOGOS_DIR: z.string().min(1).default("assets/logos"),
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
      const missingVars = error.issues.map(err => err.path.join('.'))
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`)
    }
    throw error
  }
}

// Only validate environment variables at runtime, not at build time
let envCache: EnvConfig | null = null

function getEnv(): EnvConfig {
  if (envCache === null) {
    envCache = validateEnv()
  }
  return envCache
}

export const env = new Proxy({} as EnvConfig, {
  get(target, prop) {
    return getEnv()[prop as keyof EnvConfig]
  }
})

// Environment-specific configurations
export const isDevelopment = () => getEnv().NODE_ENV === 'development'
export const isProduction = () => getEnv().NODE_ENV === 'production'
export const isTest = () => getEnv().NODE_ENV === 'test'

// Database configuration
export const dbConfig = {
  get url() { return getEnv().DATABASE_URL },
  get containerName() { return getEnv().POSTGRES_CONTAINER_NAME },
  get database() { return getEnv().POSTGRES_DB },
  get user() { return getEnv().POSTGRES_USER },
  get password() { return getEnv().POSTGRES_PASSWORD },
  get port() { return getEnv().POSTGRES_PORT },
  get authMethod() { return getEnv().POSTGRES_HOST_AUTH_METHOD }
}

// Email configuration
export const emailConfig = {
  get host() { return getEnv().EMAIL_SERVER_HOST },
  get port() { return getEnv().EMAIL_SERVER_PORT },
  get user() { return getEnv().EMAIL_SERVER_USER },
  get password() { return getEnv().EMAIL_SERVER_PASSWORD },
  get encryptionKey() { return getEnv().EMAIL_ENCRYPTION_KEY }
}

// JWT configuration
export const jwtConfig = {
  get secret() { return getEnv().JWT_SECRET },
  get expiresIn() { return getEnv().JWT_EXPIRES_IN }
}

// Upload configuration
export const uploadConfig = {
  get maxFileSize() { return getEnv().MAX_FILE_SIZE },
  get logosDir() { return getEnv().UPLOAD_LOGOS_DIR },
  get mediaDir() { return getEnv().UPLOAD_MEDIA_DIR },
  get docsDir() { return getEnv().UPLOAD_DOCS_DIR }
}

// CORS configuration
export const corsConfig = {
  get origin() { return getEnv().CORS_ORIGIN }
}
