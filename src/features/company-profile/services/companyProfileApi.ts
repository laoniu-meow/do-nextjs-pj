import { CompanyFormData } from "@/types";
import { CompanyProfileApiResponse, CompanyProfileLoadResult } from "../types/companyProfile";

class CompanyProfileApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CompanyProfileApiError';
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new CompanyProfileApiError(
      errorData.error || errorData.message || `HTTP error! status: ${response.status}`,
      response.status
    );
  }
  return response.json();
};

export const companyProfileApi = {
  // Load company data (staging first, then production)
  loadCompanyData: async (): Promise<CompanyProfileLoadResult> => {
    try {
      // TEMPORARY: Return mock data until API endpoints are created
      // TODO: Remove this when actual API endpoints are implemented
      return {
        companies: [
          {
            name: "Sample Company",
            logo: "",
            logoUrl: "",
            companyRegNumber: "REG123456",
            address: "123 Sample Street",
            country: "Sample Country",
            postalCode: "12345",
            email: "sample@company.com",
            contact: "+1-555-123-4567"
          }
        ],
        hasStagingData: false,
        hasUnsavedChanges: false,
      };

      // COMMENTED OUT UNTIL API ENDPOINTS ARE CREATED
      /*
      // First try to load from staging
      const stagingResponse = await fetch("/api/company-profile/staging");
      if (stagingResponse.ok) {
        const stagingData: CompanyProfileApiResponse<CompanyFormData[]> = await stagingResponse.json();
        if (stagingData.success && stagingData.data && stagingData.data.length > 0) {
          return {
            companies: stagingData.data,
            hasStagingData: true,
            hasUnsavedChanges: true,
          };
        }
      }

      // If no staging data, load from production
      const productionResponse = await fetch("/api/company-profile/production");
      if (productionResponse.ok) {
        const productionData: CompanyProfileApiResponse<CompanyFormData[]> = await productionResponse.json();
        if (productionData.success && productionData.data && productionData.data.length > 0) {
          return {
            companies: productionData.data,
            hasStagingData: false,
            hasUnsavedChanges: false,
          };
        }
      }

      // No data in either staging or production
      return {
        companies: [],
        hasStagingData: false,
        hasUnsavedChanges: false,
      };
      */
    } catch (error) {
      console.warn("CompanyProfileApi: Using fallback data due to error:", error);
      // Return safe fallback data instead of throwing
      return {
        companies: [],
        hasStagingData: false,
        hasUnsavedChanges: false,
      };
    }
  },

  // Staging operations
  saveToStaging: async (companies: CompanyFormData[]): Promise<void> => {
    try {
      const response = await fetch("/api/company-profile/staging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companies }),
      });

      await handleResponse<CompanyProfileApiResponse>(response);
    } catch (error) {
      if (error instanceof CompanyProfileApiError) {
        throw error;
      }
      throw new CompanyProfileApiError('Failed to save data to staging');
    }
  },

  deleteFromStaging: async (company: CompanyFormData): Promise<void> => {
    try {
      const response = await fetch("/api/company-profile/staging", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company }),
      });

      await handleResponse<CompanyProfileApiResponse>(response);
    } catch (error) {
      if (error instanceof CompanyProfileApiError) {
        throw error;
      }
      throw new CompanyProfileApiError('Failed to remove company from staging');
    }
  },

  // Production operations
  uploadToProduction: async (): Promise<void> => {
    try {
      const response = await fetch("/api/company-profile/production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await handleResponse<CompanyProfileApiResponse>(response);
    } catch (error) {
      if (error instanceof CompanyProfileApiError) {
        throw error;
      }
      throw new CompanyProfileApiError('Failed to upload data to production');
    }
  },

  // Utility methods
  refreshData: async (): Promise<CompanyProfileLoadResult> => {
    // Force reload by clearing cache and reloading
    return companyProfileApi.loadCompanyData();
  },
};
