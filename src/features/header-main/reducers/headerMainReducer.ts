import { HeaderMainState, HeaderMainAction, DEFAULT_HEADER_SETTINGS } from '../types/headerMain';

export const initialState: HeaderMainState = {
  headerSettings: DEFAULT_HEADER_SETTINGS,
  isLoading: false,
  error: null,
  hasUnsavedChanges: false,
  isSettingsOpen: false,
};

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
        hasUnsavedChanges: true,
      };

    case 'SET_HAS_UNSAVED_CHANGES':
      return {
        ...state,
        hasUnsavedChanges: action.payload,
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
