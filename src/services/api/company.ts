import { Company, CreateCompanyData, UpdateCompanyData } from '../../types/company';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

class CompanyApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CompanyApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CompanyApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status
    );
  }
  return response.json() as Promise<T>;
};

export const companyApi = {
  getAll: async (): Promise<Company[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      return handleResponse<Company[]>(response);
    } catch (error) {
      if (error instanceof CompanyApiError) {
        throw error;
      }
      throw new CompanyApiError('Failed to fetch companies');
    }
  },

  getById: async (id: string): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      return handleResponse<Company>(response);
    } catch (error) {
      if (error instanceof CompanyApiError) {
        throw error;
      }
      throw new CompanyApiError(`Failed to fetch company with id: ${id}`);
    }
  },

  create: async (data: CreateCompanyData): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      return handleResponse<Company>(response);
    } catch (error) {
      if (error instanceof CompanyApiError) {
        throw error;
      }
      throw new CompanyApiError('Failed to create company');
    }
  },

  update: async (id: string, data: UpdateCompanyData): Promise<Company> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      return handleResponse<Company>(response);
    } catch (error) {
      if (error instanceof CompanyApiError) {
        throw error;
      }
      throw new CompanyApiError(`Failed to update company with id: ${id}`);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new CompanyApiError(
          errorData.message || `HTTP error! status: ${response.status}`,
          response.status
        );
      }
    } catch (error) {
      if (error instanceof CompanyApiError) {
        throw error;
      }
      throw new CompanyApiError(`Failed to delete company with id: ${id}`);
    }
  },

  uploadLogo: async (id: string, file: File): Promise<{ logoUrl: string }> => {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch(`${API_BASE_URL}/companies/${id}/logo`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      return handleResponse<{ logoUrl: string }>(response);
    } catch (error) {
      if (error instanceof CompanyApiError) {
        throw error;
      }
      throw new CompanyApiError(`Failed to upload logo for company with id: ${id}`);
    }
  },
};
