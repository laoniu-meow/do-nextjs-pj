import { useState, useEffect, useCallback } from "react";
import { logger } from "@/lib/logger";

export interface CompanyProfileData {
  id?: string;
  type: "MAIN" | "REMOTE";
  companyName: string;
  companyRegNumber: string;
  address: string;
  country: string;
  postalCode: string;
  email: string;
  contact: string;
  isActive: boolean;
}

interface UseCompanyProfileReturn {
  profiles: CompanyProfileData[];
  isLoading: boolean;
  hasChanges: boolean;
  saveButtonEnabled: boolean;
  uploadButtonEnabled: boolean;
  loadProfiles: () => Promise<void>;
  saveToStaging: () => Promise<boolean>;
  uploadToProduction: () => Promise<boolean>;
  updateProfile: (index: number, data: Partial<CompanyProfileData>) => void;
  addProfile: (type: "MAIN" | "REMOTE") => void;
  removeProfile: (index: number) => void;
  resetChanges: () => void;
}

export function useCompanyProfile(): UseCompanyProfileReturn {
  const [profiles, setProfiles] = useState<CompanyProfileData[]>([]);
  const [originalProfiles, setOriginalProfiles] = useState<CompanyProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [saveButtonEnabled, setSaveButtonEnabled] = useState(false);
  const [uploadButtonEnabled, setUploadButtonEnabled] = useState(false);

  // Check for changes
  const checkForChanges = useCallback(() => {
    if (profiles.length !== originalProfiles.length) {
      setHasChanges(true);
      setSaveButtonEnabled(true);
      // Keep upload button enabled if there are staging changes
      setUploadButtonEnabled(true);
      return;
    }

    const hasChanges = profiles.some((profile, index) => {
      const original = originalProfiles[index];
      if (!original) return true;
      
      return (
        profile.companyName !== original.companyName ||
        profile.companyRegNumber !== original.companyRegNumber ||
        profile.address !== original.address ||
        profile.country !== original.country ||
        profile.postalCode !== original.postalCode ||
        profile.email !== original.email ||
        profile.contact !== original.contact ||
        profile.isActive !== original.isActive
      );
    });

    setHasChanges(hasChanges);
    setSaveButtonEnabled(hasChanges);
    
    // If there are changes, keep upload button enabled (light pink)
    if (hasChanges) {
      setUploadButtonEnabled(true);
    }
  }, [profiles, originalProfiles]);

  // Load profiles from API
  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/company-profile");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const profileData = result.data || [];
          setProfiles(profileData);
          setOriginalProfiles(profileData);
          setHasChanges(false);
          setSaveButtonEnabled(false);
          
          // Set upload button state based on data source
          // If data is from staging, enable upload button (light pink)
          // If data is from production, disable upload button
          setUploadButtonEnabled(result.source === "staging");
          
          logger.info("Company profiles loaded", { 
            count: profileData.length, 
            source: result.source 
          });
        }
      } else {
        logger.error("Failed to load company profiles");
      }
    } catch (error) {
      logger.error("Error loading company profiles", { error });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to staging
  const saveToStaging = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/company-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profiles }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOriginalProfiles([...profiles]);
          setHasChanges(false);
          setSaveButtonEnabled(false);
          // Keep upload button enabled after saving to staging (light pink)
          setUploadButtonEnabled(true);
          
          logger.info("Company profiles saved to staging", { 
            count: result.count 
          });
          return true;
        }
      }
      
      logger.error("Failed to save company profiles to staging");
      return false;
    } catch (error) {
      logger.error("Error saving company profiles to staging", { error });
      return false;
    }
  }, [profiles]);

  // Upload to production
  const uploadToProduction = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/company-profile", {
        method: "PUT",
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setOriginalProfiles([...profiles]);
          setHasChanges(false);
          setSaveButtonEnabled(false);
          setUploadButtonEnabled(false);
          
          logger.info("Company profiles uploaded to production", { 
            count: result.count 
          });
          return true;
        }
      }
      
      logger.error("Failed to upload company profiles to production");
      return false;
    } catch (error) {
      logger.error("Error uploading company profiles to production", { error });
      return false;
    }
  }, [profiles]);

  // Update profile
  const updateProfile = useCallback((index: number, data: Partial<CompanyProfileData>) => {
    setProfiles(prev => {
      const newProfiles = [...prev];
      newProfiles[index] = { ...newProfiles[index], ...data };
      return newProfiles;
    });
  }, []);

  // Add profile
  const addProfile = useCallback((type: "MAIN" | "REMOTE") => {
    const newProfile: CompanyProfileData = {
      type,
      companyName: "",
      companyRegNumber: "",
      address: "",
      country: "",
      postalCode: "",
      email: "",
      contact: "",
      isActive: true,
    };
    
    setProfiles(prev => [...prev, newProfile]);
  }, []);

  // Remove profile
  const removeProfile = useCallback((index: number) => {
    setProfiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Reset changes
  const resetChanges = useCallback(() => {
    setProfiles([...originalProfiles]);
    setHasChanges(false);
    setSaveButtonEnabled(false);
    // Don't change upload button state when resetting changes
    // It should remain enabled if there are staging changes
  }, [originalProfiles]);

  // Check for changes when profiles change
  useEffect(() => {
    checkForChanges();
  }, [profiles, originalProfiles, checkForChanges]);

  // Load profiles on mount
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  return {
    profiles,
    isLoading,
    hasChanges,
    saveButtonEnabled,
    uploadButtonEnabled,
    loadProfiles,
    saveToStaging,
    uploadToProduction,
    updateProfile,
    addProfile,
    removeProfile,
    resetChanges,
  };
}
