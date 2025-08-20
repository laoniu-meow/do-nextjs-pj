"use client";

import { useReducer, useCallback, useEffect } from 'react';
import { headerMainReducer, initialState } from '../reducers/headerMainReducer';
import { HeaderMainApi } from '../services/headerMainApi';
import { HeaderSettingsData } from '../types/headerMain';

export const useHeaderMain = () => {
  const [state, dispatch] = useReducer(headerMainReducer, initialState);

  // Fetch header settings from API
  const fetchHeaderSettings = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const settings = await HeaderMainApi.fetchHeaderSettings();
      dispatch({ type: 'SET_HEADER_SETTINGS', payload: settings });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch header settings';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save header settings to API
  const saveHeaderSettings = useCallback(async (settings: HeaderSettingsData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const savedSettings = await HeaderMainApi.saveHeaderSettings(settings);
      dispatch({ type: 'SET_HEADER_SETTINGS', payload: savedSettings });
      dispatch({ type: 'SET_HAS_UNSAVED_CHANGES', payload: false });
      
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
    isSettingsOpen: state.isSettingsOpen,

    // Actions
    fetchHeaderSettings,
    saveHeaderSettings,
    updateHeaderSettings,
    resetHeaderSettings,
    handleSettingsChange,
    openSettings,
    closeSettings,
    clearError,
    resetState,
  };
};
