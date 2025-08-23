import { User, Company, Content } from '@prisma/client'

// Optimized sanitization functions using object destructuring for speed
export const sanitizeUser = (user: User) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...sanitizedUser } = user
  return sanitizedUser
}

export const sanitizeCompany = (company: Company) => {
  const { ...sanitizedCompany } = company
  return sanitizedCompany
}

export const sanitizeContent = (content: Content) => {
  const { ...sanitizedContent } = content
  return sanitizedContent
}

// Batch sanitization for arrays (more performant than map)
export const sanitizeUsers = (users: User[]) => {
  const sanitized = new Array(users.length)
  for (let i = 0; i < users.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    const { password, ...sanitizedUser } = users[i]
    // Remove password from the user object
    void password
    // eslint-disable-next-line security/detect-object-injection
    sanitized[i] = sanitizedUser
  }
  return sanitized
}

export const sanitizeCompanies = (companies: Company[]) => {
  const sanitized = new Array(companies.length)
  for (let i = 0; i < companies.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    sanitized[i] = companies[i]
  }
  return sanitized
}

export const sanitizeContents = (contents: Content[]) => {
  const sanitized = new Array(contents.length)
  for (let i = 0; i < contents.length; i++) {
    // eslint-disable-next-line security/detect-object-injection
    sanitized[i] = contents[i]
  }
  return sanitized
}

// Role-based sanitization for different access levels
export const sanitizeUserForRole = (user: User, requesterRole: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...baseUser } = user
  
  if (requesterRole === 'ADMIN') {
    return baseUser
  }
  
  // For non-admin users, hide sensitive fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...publicUser } = baseUser
  return publicUser
}
