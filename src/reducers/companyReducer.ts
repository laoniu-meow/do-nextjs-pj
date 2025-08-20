import { Company } from '../types/company';

export interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  isEditing: boolean;
}

export type CompanyAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COMPANIES'; payload: Company[] }
  | { type: 'ADD_COMPANY'; payload: Company }
  | { type: 'UPDATE_COMPANY'; payload: Company }
  | { type: 'DELETE_COMPANY'; payload: string }
  | { type: 'SET_CURRENT_COMPANY'; payload: Company | null }
  | { type: 'SET_EDITING'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

export const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  isLoading: false,
  error: null,
  isEditing: false,
};

export const companyReducer = (
  state: CompanyState,
  action: CompanyAction
): CompanyState => {
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
        isLoading: false,
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
        isLoading: false,
        error: null,
      };

    case 'UPDATE_COMPANY':
      return {
        ...state,
        companies: state.companies.map((company) =>
          company.id === action.payload.id ? action.payload : company
        ),
        currentCompany: state.currentCompany?.id === action.payload.id 
          ? action.payload 
          : state.currentCompany,
        isLoading: false,
        error: null,
      };

    case 'DELETE_COMPANY':
      return {
        ...state,
        companies: state.companies.filter((company) => company.id !== action.payload),
        currentCompany: state.currentCompany?.id === action.payload 
          ? null 
          : state.currentCompany,
        isLoading: false,
        error: null,
      };

    case 'SET_CURRENT_COMPANY':
      return {
        ...state,
        currentCompany: action.payload,
      };

    case 'SET_EDITING':
      return {
        ...state,
        isEditing: action.payload,
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
