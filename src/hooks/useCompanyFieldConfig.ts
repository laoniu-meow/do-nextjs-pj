import { useState, useEffect, useCallback } from 'react';
import { CompanyFieldConfig } from '@/services/companyFieldConfig';
import { logger } from '@/lib/logger';

interface UseCompanyFieldConfigReturn {
  fieldConfigs: CompanyFieldConfig[];
  isLoading: boolean;
  error: string | null;
  source: 'staging' | 'production' | 'default';
  refreshConfig: () => Promise<void>;
}

export const useCompanyFieldConfig = (): UseCompanyFieldConfigReturn => {
  const [fieldConfigs, setFieldConfigs] = useState<CompanyFieldConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'staging' | 'production' | 'default'>('default');

  const fetchFieldConfig = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/company-profile/field-config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        setFieldConfigs(result.data);
        setSource(result.source);
      } else {
        throw new Error(result.error || 'Failed to load field configuration');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      logger.error('Error fetching field configuration', { error: errorMessage });
      setError(errorMessage);
      
      // Fallback to default configuration
      setFieldConfigs(getDefaultFieldConfig());
      setSource('default');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshConfig = useCallback(async () => {
    await fetchFieldConfig();
  }, [fetchFieldConfig]);

  useEffect(() => {
    fetchFieldConfig();
  }, [fetchFieldConfig]);

  return {
    fieldConfigs,
    isLoading,
    error,
    source,
    refreshConfig,
  };
};

// Fallback default configuration
const getDefaultFieldConfig = (): CompanyFieldConfig[] => [
  {
    name: 'name',
    label: 'Company Name *',
    required: true,
    placeholder: 'Enter your company name',
    helpText: '',
    multiline: false,
    rows: 1,
    type: 'text',
    fullWidth: false,
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
    fullWidth: true,
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
    fullWidth: false,
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
    fullWidth: false,
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
    fullWidth: false,
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
    fullWidth: true,
  },
];
