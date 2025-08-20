// Header & Main Settings Types
export interface HeaderSettingsData {
  // Responsive settings for Desktop, Tablet, Mobile
  desktop: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  tablet: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  mobile: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };

  // Global settings (not device-specific)
  backgroundColor: string;
  dropShadow: "none" | "light" | "medium" | "strong";
  quickButtonBgColor: string;
  quickButtonIconColor: string;
  quickButtonHoverBgColor: string;
  quickButtonHoverIconColor: string;
  quickButtonShape: "rounded" | "circle" | "square";
  quickButtonShadow: "none" | "light" | "medium" | "strong";
  quickButtonGap: string;
  menuButtonBgColor: string;
  menuButtonIconColor: string;
  menuButtonHoverBgColor: string;
  menuButtonHoverIconColor: string;
  menuButtonIconId: string;
  menuButtonShape: "rounded" | "circle" | "square";
  menuButtonShadow: "none" | "light" | "medium" | "strong";
}

// State Management Types
export interface HeaderMainState {
  headerSettings: HeaderSettingsData;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  isSettingsOpen: boolean;
}

export type HeaderMainAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HEADER_SETTINGS'; payload: HeaderSettingsData }
  | { type: 'SET_HAS_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_IS_SETTINGS_OPEN'; payload: boolean }
  | { type: 'RESET_STATE' };

// Default Settings
export const DEFAULT_HEADER_SETTINGS: HeaderSettingsData = {
  desktop: {
    height: 64,
    paddingHorizontal: 16,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  tablet: {
    height: 64,
    paddingHorizontal: 16,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  mobile: {
    height: 64,
    paddingHorizontal: 16,
    logoWidth: 40,
    logoHeight: 40,
    quickButtonSize: 40,
    menuButtonSize: 40,
  },
  backgroundColor: "#ffffff",
  dropShadow: "medium",
  quickButtonBgColor: "#f3f4f6",
  quickButtonIconColor: "#6b7280",
  quickButtonHoverBgColor: "#e5e7eb",
  quickButtonHoverIconColor: "#374151",
  quickButtonShape: "rounded",
  quickButtonShadow: "light",
  quickButtonGap: "8px",
  menuButtonBgColor: "var(--color-neutral-200)",
  menuButtonIconColor: "var(--color-neutral-700)",
  menuButtonHoverBgColor: "var(--color-neutral-300)",
  menuButtonHoverIconColor: "var(--color-neutral-800)",
  menuButtonIconId: "menu",
  menuButtonShape: "rounded",
  menuButtonShadow: "light",
};
