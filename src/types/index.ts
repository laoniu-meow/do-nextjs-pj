// Core application types
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export interface Company {
  id: string
  name: string
  description?: string
  logo?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}

export interface Content {
  id: string
  title: string
  content: string
  type: ContentType
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
}

// Enums
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EDITOR = 'EDITOR'
}

export enum ContentType {
  PAGE = 'PAGE',
  BLOG = 'BLOG',
  NEWS = 'NEWS',
  ANNOUNCEMENT = 'ANNOUNCEMENT'
}

export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: PaginationMeta
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  email: string
  password: string
  name: string
  role?: UserRole
}

export interface ContentFormData {
  title: string
  content: string
  type: ContentType
  status?: ContentStatus
}

export interface CompanyFormData {
  name: string
  logo?: string
  logoUrl?: string
  companyRegNumber?: string
  address?: string
  country?: string
  postalCode?: string
  email?: string
  contact?: string
  phone?: string
}

// Filter and search types
export interface ContentFilters {
  type?: ContentType
  status?: ContentStatus
  search?: string
}

export interface PaginationParams {
  page: number
  limit: number
}

export interface OrderingParams {
  field: string
  direction: 'asc' | 'desc'
}

// Authentication types
export interface JWTPayload {
  userId: string
  email: string
  role: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Component props types
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

// Error types
export interface ApiError {
  message: string
  status: number
  code?: string
}

// Utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
