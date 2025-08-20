import { useCallback, useEffect, useState } from 'react';
import { CompanyFormData } from '@/types';

// Full state interface with all needed properties
interface CompanyProfileState {
  companies: CompanyFormData[];
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  hasStagingData: boolean;
  isEditMode: boolean;
  editingCompanyIndex: number | null;
  isSettingsOpen: boolean;
  currentCompany: CompanyFormData | null;
}

export const useCompanyProfile = () => {
  const [state, setState] = useState<CompanyProfileState>({
    companies: [],
    isLoading: false,
    error: null,
    hasUnsavedChanges: false,
    hasStagingData: false,
    isEditMode: false,
    editingCompanyIndex: null,
    isSettingsOpen: false,
    currentCompany: null,
  });

  // Load company data from API (staging first, then production)
  const loadCompanyData = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // First try to load from staging
      const stagingResponse = await fetch("/api/company-profile/staging");
      if (stagingResponse.ok) {
        const stagingData = await stagingResponse.json();
        if (stagingData.success && stagingData.data && stagingData.data.length > 0) {
          setState(prev => ({
            ...prev,
            companies: stagingData.data,
            isLoading: false,
            error: null,
            hasUnsavedChanges: true,
            hasStagingData: true,
          }));
          return;
        }
      }

      // If no staging data, load from production
      const productionResponse = await fetch("/api/company-profile/production");
      if (productionResponse.ok) {
        const productionData = await productionResponse.json();
        if (productionData.success && productionData.data && productionData.data.length > 0) {
          setState(prev => ({
            ...prev,
            companies: productionData.data,
            isLoading: false,
            error: null,
            hasUnsavedChanges: false,
            hasStagingData: false,
          }));
          return;
        }
      }

      // No data in either staging or production
      setState(prev => ({
        ...prev,
        companies: [],
        isLoading: false,
        error: null,
        hasUnsavedChanges: false,
        hasStagingData: false,
      }));
    } catch (error) {
      console.error("Error loading company data:", error);
      setState(prev => ({
        ...prev,
        companies: [],
        isLoading: false,
        error: "Failed to load company data",
      }));
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadCompanyData();
  }, [loadCompanyData]);

  // Build/Add new company
  const handleBuild = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSettingsOpen: true,
      isEditMode: false,
      editingCompanyIndex: null,
      currentCompany: null,
    }));
  }, []);

  // Edit existing company
  const handleEditCompany = useCallback((company: CompanyFormData, index: number) => {
    setState(prev => ({
      ...prev,
      currentCompany: company,
      isEditMode: true,
      editingCompanyIndex: index,
      isSettingsOpen: true,
    }));
  }, []);

  // Remove company
  const handleRemoveCompany = useCallback((index: number) => {
    const companyToRemove = state.companies[index];
    
    // Show confirmation dialog
    const isConfirmed = window.confirm(
      `Are you sure you want to remove "${companyToRemove.name}"? This action cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    setState(prev => ({
      ...prev,
      companies: prev.companies.filter((_, i) => i !== index),
      hasUnsavedChanges: true,
      hasStagingData: true,
    }));
  }, [state.companies]);

  // Save to staging
  const handleSave = useCallback(async () => {
    if (state.companies.length === 0) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Call the staging API to save data
      const response = await fetch("/api/company-profile/staging", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companies: state.companies }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasUnsavedChanges: false,
          hasStagingData: true,
          error: null,
        }));
        
        // Show success message
        alert("Data saved to staging successfully!");
      } else {
        throw new Error(result.error || "Failed to save to staging");
      }
    } catch (error) {
      console.error("Error saving to staging:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to save data to staging",
      }));
    }
  }, [state.companies]);

  // Upload to production
  const handleUpload = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Call the production API to upload data from staging
      const response = await fetch("/api/company-profile/production", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          hasStagingData: false,
          hasUnsavedChanges: false,
          error: null,
        }));
        
        // Refresh data to get the production data
        await loadCompanyData();
        
        // Show success message
        alert("Data uploaded to production successfully!");
      } else {
        throw new Error(result.error || "Failed to upload to production");
      }
    } catch (error) {
      console.error("Error uploading to production:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to upload data to production",
      }));
    }
  }, [loadCompanyData]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    loadCompanyData();
  }, [loadCompanyData]);

  // Close settings panel
  const handleCloseSettings = useCallback(() => {
    setState(prev => ({
      ...prev,
      isSettingsOpen: false,
      isEditMode: false,
      editingCompanyIndex: null,
      currentCompany: null,
    }));
  }, []);

  // Apply settings (create/update company)
  const handleApplySettings = useCallback((formData: CompanyFormData) => {
    if (!formData.name.trim()) return;

    if (state.isEditMode && state.editingCompanyIndex !== null) {
      // Update existing company
      setState(prev => ({
        ...prev,
        companies: prev.companies.map((company, index) =>
          index === state.editingCompanyIndex ? formData : company
        ),
        hasUnsavedChanges: true,
        hasStagingData: true,
        isSettingsOpen: false,
        isEditMode: false,
        editingCompanyIndex: null,
        currentCompany: null,
      }));
    } else {
      // Create new company
      setState(prev => ({
        ...prev,
        companies: [...prev.companies, formData],
        hasUnsavedChanges: true,
        hasStagingData: true,
        isSettingsOpen: false,
        isEditMode: false,
        editingCompanyIndex: null,
        currentCompany: null,
      }));
    }
  }, [state.isEditMode, state.editingCompanyIndex]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    handleBuild,
    handleEditCompany,
    handleRemoveCompany,
    handleSave,
    handleUpload,
    handleRefresh,
    handleCloseSettings,
    handleApplySettings,
    clearError,
  };
};
