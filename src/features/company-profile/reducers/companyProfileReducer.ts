import { CompanyProfileState, CompanyProfileAction } from "../types/companyProfile";

export const initialState: CompanyProfileState = {
  companies: [],
  currentCompany: null,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
  hasStagingData: false,
  isEditMode: false,
  editingCompanyIndex: null,
  isSettingsOpen: false,
};

export const companyProfileReducer = (
  state: CompanyProfileState,
  action: CompanyProfileAction
): CompanyProfileState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_COMPANIES':
      return {
        ...state,
        companies: action.payload,
        isLoading: false,
        error: null,
      };

    case 'ADD_COMPANY':
      return {
        ...state,
        companies: [...state.companies, action.payload],
        hasUnsavedChanges: true,
        hasStagingData: false,
        isLoading: false,
        error: null,
      };

    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map((company, index) =>
          index === action.payload.index ? action.payload.company : company
        ),
        hasUnsavedChanges: true,
        hasStagingData: false,
        isLoading: false,
        error: null,
      };

    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter((_, index) => index !== action.payload),
        hasUnsavedChanges: true,
        hasStagingData: false,
        isLoading: false,
        error: null,
        // Reset editing state if the deleted company was being edited
        ...(state.editingCompanyIndex === action.payload && {
          isEditMode: false,
          editingCompanyIndex: null,
          currentCompany: null,
        }),
      };

    case 'SET_CURRENT_COMPANY':
      return {
        ...state,
        currentCompany: action.payload,
      };

    case 'SET_EDITING':
      return {
        ...state,
        isEditMode: action.payload.isEditMode,
        editingCompanyIndex: action.payload.index,
        currentCompany: action.payload.index !== null 
          ? state.companies[action.payload.index] || null 
          : null,
      };

    case 'SET_SETTINGS_OPEN':
      return {
        ...state,
        isSettingsOpen: action.payload,
        // Reset editing state when closing settings
        ...(action.payload === false && {
          isEditMode: false,
          editingCompanyIndex: null,
          currentCompany: null,
        }),
      };

    case 'SET_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.payload,
      };

    case 'SET_STAGING_DATA':
      return {
        ...state,
        hasStagingData: action.payload,
        hasUnsavedChanges: false, // Clear unsaved changes when data is staged
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
