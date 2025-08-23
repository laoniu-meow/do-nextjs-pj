"use client";

import { useReducer, useCallback, useEffect } from 'react';
import { headerMainReducer, initialState } from '../reducers/headerMainReducer';
import { notifySuccess } from '@/lib/notifications';
import { HeaderMainApi } from '../services/headerMainApi';
import { HeaderSettingsData, DEFAULT_HEADER_SETTINGS } from '../types/headerMain';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

export const useHeaderMain = () => {
  const [state, dispatch] = useReducer(headerMainReducer, initialState);

  // Fetch header settings from API (staging first, then production)
  const fetchHeaderSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // First try to load from staging
      const stagingResponse = await fetchWithAuth("/api/settings/header-main/staging");
      if (stagingResponse.ok) {
        const stagingData = await stagingResponse.json();
        if (stagingData.success && stagingData.data && stagingData.data.length > 0) {
          // Convert database format back to frontend format
          const stagingSettings = stagingData.data[0];
          const frontendSettings = {
            desktop: {
              height: stagingSettings.desktopHeight,
              paddingHorizontal: stagingSettings.desktopPaddingHorizontal,
              logoWidth: stagingSettings.desktopLogoWidth,
              logoHeight: stagingSettings.desktopLogoHeight,
              quickButtonSize: stagingSettings.desktopQuickButtonSize,
              menuButtonSize: stagingSettings.desktopMenuButtonSize,
            },
            tablet: {
              height: stagingSettings.tabletHeight,
              paddingHorizontal: stagingSettings.tabletPaddingHorizontal,
              logoWidth: stagingSettings.tabletLogoWidth,
              logoHeight: stagingSettings.tabletLogoHeight,
              quickButtonSize: stagingSettings.tabletQuickButtonSize,
              menuButtonSize: stagingSettings.tabletMenuButtonSize,
            },
            mobile: {
              height: stagingSettings.mobileHeight,
              paddingHorizontal: stagingSettings.mobilePaddingHorizontal,
              logoWidth: stagingSettings.mobileLogoWidth,
              logoHeight: stagingSettings.mobileLogoHeight,
              quickButtonSize: stagingSettings.mobileQuickButtonSize,
              menuButtonSize: stagingSettings.mobileMenuButtonSize,
            },
            backgroundColor: stagingSettings.backgroundColor,
            pageBackgroundColor: stagingSettings.pageBackgroundColor,
            dropShadow: stagingSettings.dropShadow.toLowerCase(),
            quickButtonBgColor: stagingSettings.quickButtonBgColor,
            quickButtonIconColor: stagingSettings.quickButtonIconColor,
            quickButtonHoverBgColor: stagingSettings.quickButtonHoverBgColor,
            quickButtonHoverIconColor: stagingSettings.quickButtonHoverIconColor,
            quickButtonShape: stagingSettings.quickButtonShape.toLowerCase(),
            quickButtonShadow: stagingSettings.quickButtonShadow.toLowerCase(),
            quickButtonGap: stagingSettings.quickButtonGap,
            menuButtonBgColor: stagingSettings.menuButtonBgColor,
            menuButtonIconColor: stagingSettings.menuButtonIconColor,
            menuButtonHoverBgColor: stagingSettings.menuButtonHoverBgColor,
            menuButtonHoverIconColor: stagingSettings.menuButtonHoverIconColor,
            menuButtonIconId: stagingSettings.menuButtonIconId,
            menuButtonShape: stagingSettings.menuButtonShape.toLowerCase(),
            menuButtonShadow: stagingSettings.menuButtonShadow.toLowerCase(),
          };
          
          dispatch({ type: 'SET_HEADER_SETTINGS', payload: frontendSettings });
          dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
          dispatch({ type: 'SET_HAS_STAGING_DATA', payload: true });
          return;
        }
      }

      // If no staging data, load from production
      const productionResponse = await fetchWithAuth("/api/settings/header-main/production");
      if (productionResponse.ok) {
        const productionData = await productionResponse.json();
        if (productionData.success && productionData.data && productionData.data.length > 0) {
          // Convert database format back to frontend format
          const productionSettings = productionData.data[0];
          const frontendSettings = {
            desktop: {
              height: productionSettings.desktopHeight,
              paddingHorizontal: productionSettings.desktopPaddingHorizontal,
              logoWidth: productionSettings.desktopLogoWidth,
              logoHeight: productionSettings.desktopLogoHeight,
              quickButtonSize: productionSettings.desktopQuickButtonSize,
              menuButtonSize: productionSettings.desktopMenuButtonSize,
            },
            tablet: {
              height: productionSettings.tabletHeight,
              paddingHorizontal: productionSettings.tabletPaddingHorizontal,
              logoWidth: productionSettings.tabletLogoWidth,
              logoHeight: productionSettings.tabletLogoHeight,
              quickButtonSize: productionSettings.tabletQuickButtonSize,
              menuButtonSize: productionSettings.tabletMenuButtonSize,
            },
            mobile: {
              height: productionSettings.mobileHeight,
              paddingHorizontal: productionSettings.mobilePaddingHorizontal,
              logoWidth: productionSettings.mobileLogoWidth,
              logoHeight: productionSettings.mobileLogoHeight,
              quickButtonSize: productionSettings.mobileQuickButtonSize,
              menuButtonSize: productionSettings.mobileMenuButtonSize,
            },
            backgroundColor: productionSettings.backgroundColor,
            pageBackgroundColor: productionSettings.pageBackgroundColor,
            dropShadow: productionSettings.dropShadow.toLowerCase(),
            quickButtonBgColor: productionSettings.quickButtonBgColor,
            quickButtonIconColor: productionSettings.quickButtonIconColor,
            quickButtonHoverBgColor: productionSettings.quickButtonHoverBgColor,
            quickButtonHoverIconColor: productionSettings.quickButtonHoverIconColor,
            quickButtonShape: productionSettings.quickButtonShape.toLowerCase(),
            quickButtonShadow: productionSettings.quickButtonShadow.toLowerCase(),
            quickButtonGap: productionSettings.quickButtonGap,
            menuButtonIconId: productionSettings.menuButtonIconId,
            menuButtonBgColor: productionSettings.menuButtonBgColor,
            menuButtonIconColor: productionSettings.menuButtonIconColor,
            menuButtonHoverBgColor: productionSettings.menuButtonHoverBgColor,
            menuButtonHoverIconColor: productionSettings.menuButtonHoverIconColor,
            menuButtonShape: productionSettings.menuButtonShape.toLowerCase(),
            menuButtonShadow: productionSettings.menuButtonShadow.toLowerCase(),
          };
          
          dispatch({ type: 'SET_HEADER_SETTINGS', payload: frontendSettings });
          dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
          dispatch({ type: 'SET_HAS_STAGING_DATA', payload: false });
          return;
        }
      }

      // If no data in either staging or production, use defaults
      dispatch({ type: 'SET_HEADER_SETTINGS', payload: DEFAULT_HEADER_SETTINGS });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
      dispatch({ type: 'SET_HAS_STAGING_DATA', payload: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch header settings';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save header settings to staging database
  const saveHeaderSettings = useCallback(async (settings: HeaderSettingsData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const savedSettings = await HeaderMainApi.saveHeaderSettings(settings);
      dispatch({ type: 'SET_HEADER_SETTINGS', payload: savedSettings });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
      dispatch({ type: 'SET_HAS_STAGING_DATA', payload: true });
      
      return savedSettings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save header settings';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Update header settings
  const updateHeaderSettings = useCallback(async (settings: HeaderSettingsData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const updatedSettings = await HeaderMainApi.updateHeaderSettings(settings);
      dispatch({ type: 'SET_HEADER_SETTINGS', payload: updatedSettings });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
      
      return updatedSettings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update header settings';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Reset header settings to defaults
  const resetHeaderSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const defaultSettings = await HeaderMainApi.resetHeaderSettings();
      dispatch({ type: 'SET_HEADER_SETTINGS', payload: defaultSettings });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
      
      return defaultSettings;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset header settings';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Handle settings change (local state update)
  const handleSettingsChange = useCallback((newSettings: HeaderSettingsData) => {
    dispatch({ type: 'SET_HEADER_SETTINGS', payload: newSettings });
    // Mark as having unsaved changes when settings are modified
    dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: true });
  }, []);

  // Open settings panel
  const openSettings = useCallback(() => {
    dispatch({ type: 'SET_IS_SETTINGS_OPEN', payload: true });
  }, []);

  // Close settings panel
  const closeSettings = useCallback(() => {
    dispatch({ type: 'SET_IS_SETTINGS_OPEN', payload: false });
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Upload header settings to production database
  const uploadHeaderSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await HeaderMainApi.uploadHeaderSettings();
      dispatch({ type: 'SET_HAS_STAGING_DATA', payload: false });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
      
      notifySuccess('Header settings uploaded to production successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload header settings';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  // Load initial data on mount
  useEffect(() => {
    fetchHeaderSettings();
  }, [fetchHeaderSettings]);

  return {
    // State
    headerSettings: state.headerSettings,
    isLoading: state.isLoading,
    error: state.error,
    hasUnsavedChanges: state.hasUnsavedChanges,
    hasStagingData: state.hasStagingData,
    isSettingsOpen: state.isSettingsOpen,

    // Actions
    fetchHeaderSettings,
    saveHeaderSettings,
    updateHeaderSettings,
    resetHeaderSettings,
    uploadHeaderSettings,
    handleSettingsChange,
    openSettings,
    closeSettings,
    clearError,
    resetState,
  };
};
