import { Company, CreateCompanyData, UpdateCompanyData } from '../types/company';
import { COMPANY_CONFIG } from '../config/company';

/**
 * Validates company data according to business rules
 */
export const validateCompanyData = (data: CreateCompanyData | UpdateCompanyData): {
  isValid: boolean;
  errors: Partial<Record<keyof CreateCompanyData, string>>;
} => {
  const errors: Partial<Record<keyof CreateCompanyData, string>> = {};

  // Validate name
  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Company name is required';
  } else if (data.name.trim().length < COMPANY_CONFIG.VALIDATION.NAME.MIN_LENGTH) {
    errors.name = `Company name must be at least ${COMPANY_CONFIG.VALIDATION.NAME.MIN_LENGTH} characters`;
  } else if (data.name.trim().length > COMPANY_CONFIG.VALIDATION.NAME.MAX_LENGTH) {
    errors.name = `Company name must be no more than ${COMPANY_CONFIG.VALIDATION.NAME.MAX_LENGTH} characters`;
  } else if (!COMPANY_CONFIG.VALIDATION.NAME.PATTERN.test(data.name.trim())) {
    errors.name = 'Company name contains invalid characters';
  }

  // Validate description
  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'Company description is required';
  } else if (data.description.trim().length < COMPANY_CONFIG.VALIDATION.DESCRIPTION.MIN_LENGTH) {
    errors.description = `Description must be at least ${COMPANY_CONFIG.VALIDATION.DESCRIPTION.MIN_LENGTH} characters`;
  } else if (data.description.trim().length > COMPANY_CONFIG.VALIDATION.DESCRIPTION.MAX_LENGTH) {
    errors.description = `Description must be no more than ${COMPANY_CONFIG.VALIDATION.DESCRIPTION.MAX_LENGTH} characters`;
  }

  // Validate website (optional)
  if (data.website && data.website.trim().length > 0) {
    if (!COMPANY_CONFIG.VALIDATION.WEBSITE.PATTERN.test(data.website.trim())) {
      errors.website = 'Please enter a valid website URL (include http:// or https://)';
    }
  }

  // Validate email (optional)
  if (data.email && data.email.trim().length > 0) {
    if (!COMPANY_CONFIG.VALIDATION.EMAIL.PATTERN.test(data.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Validate phone (optional)
  if (data.phone && data.phone.trim().length > 0) {
    const cleanPhone = data.phone.replace(/[\s\-\(\)]/g, '');
    if (!COMPANY_CONFIG.VALIDATION.PHONE.PATTERN.test(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Formats company data for display
 */
export const formatCompanyData = (company: Company) => {
  return {
    ...company,
    name: company.name.trim(),
    description: company.description.trim(),
    website: company.website?.trim() || '',
    email: company.email?.trim() || '',
    phone: company.phone?.trim() || '',
    address: company.address?.trim() || '',
  };
};

/**
 * Sanitizes company data before sending to API
 */
export const sanitizeCompanyData = (data: CreateCompanyData | UpdateCompanyData) => {
  return {
    ...data,
    name: data.name?.trim() || '',
    description: data.description?.trim() || '',
    website: data.website?.trim() || undefined,
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    address: data.address?.trim() || undefined,
  };
};

/**
 * Generates a unique company ID
 */
export const generateCompanyId = (): string => {
  return `company_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formats company creation date
 */
export const formatCompanyDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats company creation date for relative time
 */
export const formatCompanyRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
};

/**
 * Checks if a company has all required fields
 */
export const isCompanyComplete = (company: Company): boolean => {
  return !!(
    company.name &&
    company.description &&
    company.name.trim().length > 0 &&
    company.description.trim().length > 0
  );
};

/**
 * Gets company status based on completeness
 */
export const getCompanyStatus = (company: Company): 'complete' | 'incomplete' | 'draft' => {
  if (isCompanyComplete(company)) {
    return 'complete';
  } else if (company.name && company.name.trim().length > 0) {
    return 'incomplete';
  } else {
    return 'draft';
  }
};

/**
 * Sorts companies by various criteria
 */
export const sortCompanies = (
  companies: Company[],
  sortBy: 'name' | 'createdAt' | 'updatedAt' = 'name',
  sortOrder: 'asc' | 'desc' = 'asc'
): Company[] => {
  return [...companies].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt).getTime();
        bValue = new Date(b.updatedAt).getTime();
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

/**
 * Filters companies based on search criteria
 */
export const filterCompanies = (
  companies: Company[],
  searchTerm: string,
  filters: {
    status?: 'complete' | 'incomplete' | 'draft';
    hasWebsite?: boolean;
    hasEmail?: boolean;
  } = {}
): Company[] => {
  let filtered = companies;

  // Text search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (company) =>
        company.name.toLowerCase().includes(term) ||
        company.description.toLowerCase().includes(term) ||
        company.email?.toLowerCase().includes(term) ||
        company.website?.toLowerCase().includes(term)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((company) => getCompanyStatus(company) === filters.status);
  }

  // Website filter
  if (filters.hasWebsite !== undefined) {
    filtered = filtered.filter((company) =>
      filters.hasWebsite ? !!company.website : !company.website
    );
  }

  // Email filter
  if (filters.hasEmail !== undefined) {
    filtered = filtered.filter((company) =>
      filters.hasEmail ? !!company.email : !company.email
    );
  }

  return filtered;
};
