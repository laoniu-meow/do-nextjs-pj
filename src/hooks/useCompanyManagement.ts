import { useState, useCallback } from 'react';
import { useCompany } from '../contexts/CompanyContext';
import { Company, CreateCompanyData, UpdateCompanyData } from '../types/company';

export const useCompanyManagement = () => {
  const { state, createCompany, updateCompany, deleteCompany, setCurrentCompany, setEditing } = useCompany();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleCreateCompany = useCallback(async (data: CreateCompanyData) => {
    try {
      await createCompany(data);
      setIsFormOpen(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create company' 
      };
    }
  }, [createCompany]);

  const handleUpdateCompany = useCallback(async (data: UpdateCompanyData) => {
    try {
      await updateCompany(data);
      setEditingCompany(null);
      setIsFormOpen(false);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update company' 
      };
    }
  }, [updateCompany]);

  const handleDeleteCompany = useCallback(async (id: string) => {
    try {
      await deleteCompany(id);
      if (state.currentCompany?.id === id) {
        setCurrentCompany(null);
      }
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to delete company' 
      };
    }
  }, [deleteCompany, state.currentCompany?.id, setCurrentCompany]);

  const openCreateForm = useCallback(() => {
    setEditingCompany(null);
    setIsFormOpen(true);
    setEditing(false);
  }, [setEditing]);

  const openEditForm = useCallback((company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
    setEditing(true);
  }, [setEditing]);

  const closeForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingCompany(null);
    setEditing(false);
  }, [setEditing]);

  const selectCompany = useCallback((company: Company) => {
    setCurrentCompany(company);
  }, [setCurrentCompany]);

  return {
    // State
    companies: state.companies,
    currentCompany: state.currentCompany,
    isLoading: state.isLoading,
    error: state.error,
    isFormOpen,
    editingCompany,
    
    // Actions
    handleCreateCompany,
    handleUpdateCompany,
    handleDeleteCompany,
    openCreateForm,
    openEditForm,
    closeForm,
    selectCompany,
    
    // Computed
    hasCompanies: state.companies.length > 0,
    canEdit: !!editingCompany,
  };
};
