import { z } from 'zod'

// User validation schemas
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const userCreateSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['ADMIN', 'USER', 'EDITOR']).optional()
})

export const userUpdateSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['ADMIN', 'USER', 'EDITOR']).optional()
})

// Company validation schemas
export const companyCreateSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters'),
  description: z.string().optional(),
  logo: z.string().url('Invalid logo URL').optional(),
  website: z.string().url('Invalid website URL').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().optional(),
  address: z.string().optional()
})

export const companyUpdateSchema = companyCreateSchema.partial()

// Content validation schemas
export const contentCreateSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  type: z.enum(['PAGE', 'BLOG', 'NEWS', 'ANNOUNCEMENT']),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional()
})

export const contentUpdateSchema = contentCreateSchema.partial()

// Generic validation function
export async function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err) => err.message)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}
