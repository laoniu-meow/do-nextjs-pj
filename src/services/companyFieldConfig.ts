import { prisma } from '@/lib/db';
import { CompanyFormData } from '@/types';
import type { CompanyProfileStaging } from '@prisma/client';

export interface CompanyFieldConfig {
  name: string;
  label: string;
  required: boolean;
  placeholder: string;
  helpText: string;
  multiline: boolean;
  rows: number;
  type: 'text' | 'email' | 'tel' | 'url';
  fullWidth: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
  };
}

export interface CompanyFieldConfigResponse {
  success: boolean;
  data?: CompanyFieldConfig[];
  error?: string;
  source: 'staging' | 'production' | 'default';
}

/**
 * Fetch company field configuration from database
 * Logic: Check staging first, if empty fall back to production
 */
export const companyFieldConfigService = {
  /**
   * Get field configuration with staging vs production logic
   */
  async getFieldConfiguration(): Promise<CompanyFieldConfigResponse> {
    try {
      // First try to get configuration from staging
      const stagingConfig = await this.getStagingFieldConfig();
      if (stagingConfig && stagingConfig.length > 0) {
        return {
          success: true,
          data: stagingConfig,
          source: 'staging'
        };
      }

      // If no staging data, try production
      const productionConfig = await this.getProductionFieldConfig();
      if (productionConfig && productionConfig.length > 0) {
        return {
          success: true,
          data: productionConfig,
          source: 'production'
        };
      }

      // Fallback to default configuration if no database data
      return {
        success: true,
        data: this.getDefaultFieldConfig(),
        source: 'default'
      };
    } catch (error) {
      console.error('Error fetching field configuration:', error);
      return {
        success: false,
        error: 'Failed to fetch field configuration',
        source: 'default'
      };
    }
  },

  /**
   * Get field configuration from staging table
   */
  async getStagingFieldConfig(): Promise<CompanyFieldConfig[]> {
    try {
      const stagingData = await prisma.companyProfileStaging.findMany({
        where: { isMainCompany: true },
        orderBy: { createdAt: "desc" },
        take: 1
      });

      if (stagingData.length === 0) {
        return [];
      }

      const mainCompany = stagingData[0];
      return this.transformCompanyDataToFieldConfig(mainCompany);
    } catch (error) {
      console.error('Error fetching staging field config:', error);
      return [];
    }
  },

  /**
   * Get field configuration from production table
   */
  async getProductionFieldConfig(): Promise<CompanyFieldConfig[]> {
    try {
      const productionData = await prisma.companyProfileProduction.findMany({
        where: { isMainCompany: true },
        orderBy: { createdAt: "desc" },
        take: 1
      });

      if (productionData.length === 0) {
        return [];
      }

      const mainCompany = productionData[0];
      return this.transformCompanyDataToFieldConfig(mainCompany);
    } catch (error) {
      console.error('Error fetching production field config:', error);
      return [];
    }
  },

  /**
   * Transform company data to field configuration
   * Dynamically generates field configuration based on database data
   */
  transformCompanyDataToFieldConfig(companyData?: CompanyFormData | CompanyProfileStaging): CompanyFieldConfig[] {
    if (!companyData) {
      // Fallback to default configuration if no data provided
      return this.getDefaultFieldConfig();
    }

    // Dynamically generate field configuration based on available data
    const dynamicConfig: CompanyFieldConfig[] = [];

    // Company Name - always required
    dynamicConfig.push({
      name: 'name',
      label: 'Company Name *',
      required: true,
      placeholder: 'Enter your company name',
      helpText: companyData.name ? `Current: ${companyData.name}` : '',
      multiline: false,
      rows: 1,
      type: 'text',
      fullWidth: false,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    });

    // Company Registration Number - if exists in data
    if (companyData.companyRegNumber) {
      dynamicConfig.push({
        name: 'companyRegNumber',
        label: 'Company Registration Number',
        required: false,
        placeholder: 'Enter registration number',
        helpText: `Current: ${companyData.companyRegNumber}`,
        multiline: false,
        rows: 1,
        type: 'text',
        fullWidth: false,
        validation: {
          minLength: 1,
          maxLength: 50
        }
      });
    }

    // Email - if exists in data
    if (companyData.email) {
      dynamicConfig.push({
        name: 'email',
        label: 'Email Address',
        required: false,
        placeholder: 'contact@company.com',
        helpText: `Current: ${companyData.email}`,
        multiline: false,
        rows: 1,
        type: 'email',
        fullWidth: false,
        validation: {
          pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
        }
      });
    }

    // Phone - if exists in data (only available in Company type)
    if ('phone' in companyData && companyData.phone) {
      dynamicConfig.push({
        name: 'phone',
        label: 'Phone Number',
        required: false,
        placeholder: '+1 (555) 123-4567',
        helpText: `Current: ${companyData.phone}`,
        multiline: false,
        rows: 1,
        type: 'tel',
        fullWidth: false,
        validation: {
          minLength: 10,
          maxLength: 20
        }
      });
    }

    // Address - if exists in data
    if (companyData.address) {
      dynamicConfig.push({
        name: 'address',
        label: 'Company Address',
        required: false,
        placeholder: 'Enter complete company address',
        helpText: `Current: ${companyData.address}`,
        multiline: true,
        rows: 3,
        type: 'text',
        fullWidth: true,
        validation: {
          minLength: 10,
          maxLength: 500
        }
      });
    }

    // Country - if exists in data
    if (companyData.country) {
      dynamicConfig.push({
        name: 'country',
        label: 'Country',
        required: false,
        placeholder: 'Select or enter country',
        helpText: `Current: ${companyData.country}`,
        multiline: false,
        rows: 1,
        type: 'text',
        fullWidth: false,
        validation: {
          minLength: 2,
          maxLength: 100
        }
      });
    }

    // Postal Code - if exists in data
    if (companyData.postalCode) {
      dynamicConfig.push({
        name: 'postalCode',
        label: 'Postal Code',
        required: false,
        placeholder: 'Enter postal/zip code',
        helpText: `Current: ${companyData.postalCode}`,
        multiline: false,
        rows: 1,
        type: 'text',
        fullWidth: false,
        validation: {
          minLength: 1,
          maxLength: 20
        }
      });
    }

    // Contact - if exists in data
    if (companyData.contact) {
      dynamicConfig.push({
        name: 'contact',
        label: 'Contact Person',
        required: false,
        placeholder: 'Enter contact person name',
        helpText: `Current: ${companyData.contact}`,
        multiline: false,
        rows: 1,
        type: 'text',
        fullWidth: false,
        validation: {
          minLength: 2,
          maxLength: 100
        }
      });
    }

    // Add description field for Company type (not available in CompanyProfileStaging)
    if ('description' in companyData && companyData.description) {
      dynamicConfig.push({
        name: 'description',
        label: 'Company Description',
        required: false,
        placeholder: 'Enter company description',
        helpText: `Current: ${companyData.description}`,
        multiline: true,
        rows: 3,
        type: 'text',
        fullWidth: true,
        validation: {
          minLength: 10,
          maxLength: 500
        }
      });
    }

    // Add website field for Company type (not available in CompanyProfileStaging)
    if ('website' in companyData && companyData.website) {
      dynamicConfig.push({
        name: 'website',
        label: 'Website',
        required: false,
        placeholder: 'https://company.com',
        helpText: `Current: ${companyData.website}`,
        multiline: false,
        rows: 1,
        type: 'url',
        fullWidth: false,
        validation: {
          pattern: '^https?://.+'
        }
      });
    }

    return dynamicConfig.length > 0 ? dynamicConfig : this.getDefaultFieldConfig();
  },

  /**
   * Get default field configuration as fallback
   */
  getDefaultFieldConfig(): CompanyFieldConfig[] {
    return [
      {
        name: 'name',
        label: 'Company Name *',
        required: true,
        placeholder: 'Enter your company name',
        helpText: '',
        multiline: false,
        rows: 1,
        type: 'text',
        fullWidth: false
      },
      {
        name: 'description',
        label: 'Description *',
        required: true,
        placeholder: 'Enter company description',
        helpText: '',
        multiline: true,
        rows: 3,
        type: 'text',
        fullWidth: true
      },
      {
        name: 'website',
        label: 'Website',
        required: false,
        placeholder: 'https://example.com',
        helpText: 'Include http:// or https://',
        multiline: false,
        rows: 1,
        type: 'url',
        fullWidth: false
      },
      {
        name: 'email',
        label: 'Email',
        required: false,
        placeholder: 'contact@company.com',
        helpText: '',
        multiline: false,
        rows: 1,
        type: 'email',
        fullWidth: false
      },
      {
        name: 'phone',
        label: 'Phone',
        required: false,
        placeholder: '+1 (555) 123-4567',
        helpText: '',
        multiline: false,
        rows: 1,
        type: 'tel',
        fullWidth: false
      },
      {
        name: 'address',
        label: 'Address',
        required: false,
        placeholder: '123 Business St, City, State, ZIP',
        helpText: '',
        multiline: true,
        rows: 2,
        type: 'text',
        fullWidth: true
      }
    ];
  }
};
