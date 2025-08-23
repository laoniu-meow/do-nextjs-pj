import { CompanyFormData } from "@/types";

// State Management Types
export interface CompanyProfileState {
  companies: CompanyFormData[];
  currentCompany: CompanyFormData | null;
  isLoading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  hasStagingData: boolean;
  isEditMode: boolean;
  editingCompanyIndex: number | null;
  isSettingsOpen: boolean;
}

export type CompanyProfileAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_COMPANIES'; payload: CompanyFormData[] }
  | { type: 'ADD_COMPANY'; payload: CompanyFormData }
  | { type: 'UPDATE_COMPANY'; payload: { company: CompanyFormData; index: number } }
  | { type: 'DELETE_COMPANY'; payload: number }
  | { type: 'SET_CURRENT_COMPANY'; payload: CompanyFormData | null }
  | { type: 'SET_EDITING'; payload: { isEditMode: boolean; index: number | null } }
  | { type: 'SET_SETTINGS_OPEN'; payload: boolean }
  | { type: 'SET_UNSAVED_CHANGES'; payload: boolean }
  | { type: 'SET_STAGING_DATA'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

// Component Props Types
export type CompanyProfilePageProps = Record<string, never>;

export interface CompanyProfileHeaderProps {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
}

export interface CompanyProfileActionsProps {
  hasUnsavedChanges: boolean;
  hasStagingData: boolean;
  isLoading: boolean;
  onBuild: () => void;
  onSave: () => void;
  onUpload: () => void;
  onRefresh: () => void;
}

export interface CompanyProfileGridProps {
  companies: CompanyFormData[];
  onEditCompany: (company: CompanyFormData, index: number) => void;
  onRemoveCompany: (index: number) => void;
}

export interface CompanyProfileCardProps {
  company: CompanyFormData;
  index: number;
  onEdit: (company: CompanyFormData, index: number) => void;
  onRemove: (index: number) => void;
  isMainCompany: boolean;
}

export interface CompanyProfileEmptyStateProps {
  onBuild: () => void;
}

export type CompanyProfileFormModalProps = Record<string, never>;

// API Response Types
export interface CompanyProfileApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface CompanyProfileLoadResult {
  companies: CompanyFormData[];
  hasStagingData: boolean;
  hasUnsavedChanges: boolean;
}

// Form Types
export type CompanyProfileFormData = CompanyFormData;

// Utility Types
export interface CompanyProfileFilters {
  search?: string;
  hasLogo?: boolean;
  hasEmail?: boolean;
  hasContact?: boolean;
}

export interface CompanyProfileSortOptions {
  field: 'name' | 'createdAt' | 'email';
  direction: 'asc' | 'desc';
}
