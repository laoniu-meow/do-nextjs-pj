import { HeaderSettingsData } from '../types/headerMain';

// API endpoints
const API_ENDPOINTS = {
  HEADER_SETTINGS: '/api/settings/header-main',
};

// API service for Header & Main settings
export class HeaderMainApi {
  // Fetch header settings from the server
  static async fetchHeaderSettings(): Promise<HeaderSettingsData> {
    try {
      const response = await fetch(API_ENDPOINTS.HEADER_SETTINGS);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.settings || data;
    } catch (error) {
      console.error('Error fetching header settings:', error);
      throw new Error('Failed to fetch header settings');
    }
  }

  // Save header settings to the server
  static async saveHeaderSettings(settings: HeaderSettingsData): Promise<HeaderSettingsData> {
    try {
      const response = await fetch(API_ENDPOINTS.HEADER_SETTINGS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.settings || data;
    } catch (error) {
      console.error('Error saving header settings:', error);
      throw new Error('Failed to save header settings');
    }
  }

  // Update header settings on the server
  static async updateHeaderSettings(settings: HeaderSettingsData): Promise<HeaderSettingsData> {
    try {
      const response = await fetch(API_ENDPOINTS.HEADER_SETTINGS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.settings || data;
    } catch (error) {
      console.error('Error updating header settings:', error);
      throw new Error('Failed to update header settings');
    }
  }

  // Delete header settings from the server
  static async deleteHeaderSettings(): Promise<void> {
    try {
      const response = await fetch(API_ENDPOINTS.HEADER_SETTINGS, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting header settings:', error);
      throw new Error('Failed to delete header settings');
    }
  }

  // Reset header settings to defaults
  static async resetHeaderSettings(): Promise<HeaderSettingsData> {
    try {
      const response = await fetch(`${API_ENDPOINTS.HEADER_SETTINGS}/reset`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.settings || data;
    } catch (error) {
      console.error('Error resetting header settings:', error);
      throw new Error('Failed to reset header settings');
    }
  }
}
