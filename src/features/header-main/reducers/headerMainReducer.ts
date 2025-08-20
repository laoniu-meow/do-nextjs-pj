import { HeaderMainState, HeaderMainAction, DEFAULT_HEADER_MAIN_STATE } from '../types/headerMain';

export const initialState: HeaderMainState = DEFAULT_HEADER_MAIN_STATE;

export const headerMainReducer = (
  state: HeaderMainState,
  action: HeaderMainAction
): HeaderMainState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SET_HEADER_SETTINGS':
      return {
        ...state,
        headerSettings: action.payload,
        // Don't automatically set hasUnsavedChanges to true
        // This should be controlled by the calling code
      };

    case 'SET_HAS_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.payload,
      };

    case 'SET_HAS_STAGING_DATA':
      return {
        ...state,
        hasStagingData: action.payload,
      };

    case 'SET_IS_SETTINGS_OPEN':
      return {
        ...state,
        isSettingsOpen: action.payload,
      };

    case 'RESET_STATE':
      return {
        ...initialState,
        headerSettings: state.headerSettings, // Keep current settings
      };

    default:
      return state;
  }
};
