// Generic Settings System Types
import { ReactNode, createElement } from 'react';

// Optional icons for example schemas
import InfoIcon from '@mui/icons-material/Info';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import PaletteIcon from '@mui/icons-material/Palette';
import TuneIcon from '@mui/icons-material/Tune';
import NotificationsIcon from '@mui/icons-material/Notifications';
import BrushIcon from '@mui/icons-material/Brush';
import SecurityIcon from '@mui/icons-material/Security';

export interface BaseSettingField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'switch' | 'color' | 'file' | 'multiselect';
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: string | number | boolean | string[] | File | File[] | null;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: string | number | boolean | string[] | File | File[] | null) => string | null;
  };
}

export interface TextSettingField extends BaseSettingField {
  type: 'text' | 'email' | 'password';
  multiline?: boolean;
  rows?: number;
}

export interface NumberSettingField extends BaseSettingField {
  type: 'number';
  min?: number;
  max?: number;
  step?: number;
}

export interface TextareaSettingField extends BaseSettingField {
  type: 'textarea';
  rows?: number;
  maxLength?: number;
}

export interface SelectSettingField extends BaseSettingField {
  type: 'select';
  options: Array<{
    value: string | number;
    label: string;
  }>;
}

export interface SwitchSettingField extends BaseSettingField {
  type: 'switch';
}

export interface ColorSettingField extends BaseSettingField {
  type: 'color';
}

export interface FileSettingField extends BaseSettingField {
  type: 'file';
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
}

export interface MultiselectSettingField extends BaseSettingField {
  type: 'multiselect';
  options: Array<{
    value: string | number;
    label: string;
  }>;
  maxSelections?: number;
}

export type SettingField = 
  | TextSettingField 
  | NumberSettingField 
  | TextareaSettingField 
  | SelectSettingField 
  | SwitchSettingField 
  | ColorSettingField 
  | FileSettingField 
  | MultiselectSettingField;

export interface SettingsSection {
  id: string;
  title: string;
  description?: string;
  fields: SettingField[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
  icon?: ReactNode;
}

export interface SettingsSchema {
  id: string;
  title: string;
  description?: string;
  sections: SettingsSection[];
  actions?: {
    showSave?: boolean;
    showCancel?: boolean;
    showReset?: boolean;
    customActions?: Array<{
      id: string;
      label: string;
      variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
      onClick: () => void;
    }>;
  };
}

export interface SettingsData {
  [key: string]: string | number | boolean | string[] | File | File[] | null;
}

export interface SettingsValidationResult {
  isValid: boolean;
  errors: {
    [fieldId: string]: string;
  };
}

// Company Profile Settings Schema (example)
export const COMPANY_PROFILE_SETTINGS_SCHEMA: SettingsSchema = {
  id: 'company-profile',
  title: 'Company Profile Settings',
  description: 'Configure your company information and branding',
  sections: [
    {
      id: 'basic-info',
      title: 'Basic Information',
      description: 'Company name and registration details',
      icon: createElement(InfoIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'name',
          label: 'Company Name',
          type: 'text',
          required: true,
          placeholder: 'Enter company name',
          validation: {
            min: 2,
            max: 100
          }
        },
        {
          id: 'logoUrl',
          label: 'Company Logo URL',
          type: 'text',
          placeholder: '/logos/company.png'
        },
        {
          id: 'companyRegNumber',
          label: 'Registration Number',
          type: 'text',
          placeholder: 'Enter registration number'
        },
        {
          id: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'company@example.com',
          validation: {
            pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
          }
        }
      ]
    },
    {
      id: 'contact',
      title: 'Contact Information',
      description: 'Address and contact details',
      icon: createElement(ContactPhoneIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'contact',
          label: 'Contact Person',
          type: 'text',
          placeholder: 'Enter contact person name'
        },
        {
          id: 'address',
          label: 'Address',
          type: 'textarea',
          rows: 3,
          placeholder: 'Enter company address'
        },
        {
          id: 'country',
          label: 'Country',
          type: 'select',
          options: [
            { value: 'US', label: 'United States' },
            { value: 'CA', label: 'Canada' },
            { value: 'UK', label: 'United Kingdom' },
            { value: 'AU', label: 'Australia' },
            { value: 'DE', label: 'Germany' },
            { value: 'FR', label: 'France' },
            { value: 'JP', label: 'Japan' },
            { value: 'CN', label: 'China' },
            { value: 'IN', label: 'India' },
            { value: 'BR', label: 'Brazil' }
          ]
        },
        {
          id: 'postalCode',
          label: 'Postal Code',
          type: 'text',
          placeholder: 'Enter postal code'
        }
      ]
    }
  ],
  actions: {
    showSave: true,
    showCancel: true,
    showReset: true
  }
};

// Header Settings Schema (example)
export const HEADER_SETTINGS_SCHEMA: SettingsSchema = {
  id: 'header-settings',
  title: 'Header & Navigation Settings',
  description: 'Customize your website header and navigation',
  sections: [
    {
      id: 'branding',
      title: 'Branding',
      description: 'Site title and tagline',
      icon: createElement(BrandingWatermarkIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'siteTitle',
          label: 'Site Title',
          type: 'text',
          required: true,
          placeholder: 'Your Website',
          defaultValue: 'Your Website'
        },
        {
          id: 'tagline',
          label: 'Tagline',
          type: 'textarea',
          rows: 2,
          placeholder: 'Your company tagline here',
          defaultValue: 'Your company tagline here'
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Visual settings for the header',
      icon: createElement(PaletteIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'headerHeight',
          label: 'Header Height',
          type: 'text',
          placeholder: '64px',
          defaultValue: '64px',
          helperText: 'e.g., 64px, 80px, 100px'
        },
        {
          id: 'primaryColor',
          label: 'Primary Color',
          type: 'color',
          defaultValue: '#3b82f6'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      description: 'Enable or disable header features',
      icon: createElement(TuneIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'showSearch',
          label: 'Show Search Bar',
          type: 'switch',
          defaultValue: true
        },
        {
          id: 'showUserMenu',
          label: 'Show User Menu',
          type: 'switch',
          defaultValue: true
        },
        {
          id: 'stickyHeader',
          label: 'Sticky Header',
          type: 'switch',
          defaultValue: false
        }
      ]
    }
  ],
  actions: {
    showSave: true,
    showCancel: true,
    showReset: true
  }
};

// User Preferences Settings Schema (example)
export const USER_PREFERENCES_SETTINGS_SCHEMA: SettingsSchema = {
  id: 'user-preferences',
  title: 'User Preferences',
  description: 'Customize your personal user experience and preferences',
  sections: [
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'Configure how and when you receive notifications',
      icon: createElement(NotificationsIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'emailNotifications',
          label: 'Email Notifications',
          type: 'switch',
          defaultValue: true
        },
        {
          id: 'pushNotifications',
          label: 'Push Notifications',
          type: 'switch',
          defaultValue: true
        },
        {
          id: 'notificationFrequency',
          label: 'Notification Frequency',
          type: 'select',
          options: [
            { value: 'immediate', label: 'Immediate' },
            { value: 'hourly', label: 'Hourly Digest' },
            { value: 'daily', label: 'Daily Digest' },
            { value: 'weekly', label: 'Weekly Digest' }
          ],
          defaultValue: 'immediate'
        }
      ]
    },
    {
      id: 'appearance',
      title: 'Appearance',
      description: 'Customize the look and feel of your interface',
      icon: createElement(BrushIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'theme',
          label: 'Theme',
          type: 'select',
          options: [
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'auto', label: 'Auto (System)' }
          ],
          defaultValue: 'auto'
        },
        {
          id: 'accentColor',
          label: 'Accent Color',
          type: 'color',
          defaultValue: '#3b82f6'
        },
        {
          id: 'fontSize',
          label: 'Font Size',
          type: 'select',
          options: [
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          defaultValue: 'medium'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      description: 'Manage your privacy and security preferences',
      icon: createElement(SecurityIcon, { fontSize: 'small' }),
      fields: [
        {
          id: 'dataCollection',
          label: 'Allow Data Collection',
          type: 'switch',
          defaultValue: false
        },
        {
          id: 'analytics',
          label: 'Enable Analytics',
          type: 'switch',
          defaultValue: true
        },
        {
          id: 'twoFactorAuth',
          label: 'Two-Factor Authentication',
          type: 'switch',
          defaultValue: false
        }
      ]
    }
  ],
  actions: {
    showSave: true,
    showCancel: true,
    showReset: true
  }
};

// Generic Settings Context
export interface SettingsContextValue<T = SettingsData> {
  data: T;
  updateField: (fieldId: string, value: string | number | boolean | string[] | File | File[] | null) => void;
  updateSection: (sectionId: string, data: Partial<T>) => void;
  resetToDefaults: () => void;
  validate: () => SettingsValidationResult;
  hasChanges: boolean;
  isDirty: (fieldId?: string) => boolean;
}
