"use client";

import { useState, useCallback } from 'react';
import { CompanyFormData } from '@/types';

export type SettingsPageType = 'company-profile' | 'header-main' | 'header-settings' | 'users' | 'generic';

export const useSettingsContent = (pageType: SettingsPageType) => {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    logo: '',
    logoUrl: '',
    companyRegNumber: '',
    address: '',
    country: '',
    postalCode: '',
    email: '',
    contact: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);

  const handleFormChange = useCallback((data: CompanyFormData, isValid: boolean) => {
    setFormData(data);
    setIsFormValid(isValid);
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      logo: '',
      logoUrl: '',
      companyRegNumber: '',
      address: '',
      country: '',
      postalCode: '',
      email: '',
      contact: '',
    });
    setIsFormValid(false);
  }, []);

  return {
    pageType,
    title:
      pageType === 'company-profile'
        ? 'Company Profile Settings'
        : pageType === 'header-main'
        ? 'Header & Main Settings'
        : 'Settings',
    description:
      pageType === 'company-profile'
        ? 'Configure your company profile information and branding.'
        : pageType === 'header-main'
        ? 'Customize the header and main layout of your application.'
        : 'Configure settings for this page.',
    formData,
    isFormValid,
    handleFormChange,
    resetForm,
  };
};
