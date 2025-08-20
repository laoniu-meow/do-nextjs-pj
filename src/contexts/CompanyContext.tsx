import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";
import {
  CompanyState,
  CompanyAction,
  companyReducer,
  initialState,
} from "../reducers/companyReducer";
import {
  Company,
  CreateCompanyData,
  UpdateCompanyData,
} from "../types/company";
import { companyApi } from "../services/api/company";

interface CompanyContextType {
  state: CompanyState;
  dispatch: React.Dispatch<CompanyAction>;
  fetchCompanies: () => Promise<void>;
  createCompany: (data: CreateCompanyData) => Promise<void>;
  updateCompany: (data: UpdateCompanyData) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  setCurrentCompany: (company: Company | null) => void;
  setEditing: (isEditing: boolean) => void;
  clearError: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  const fetchCompanies = useCallback(async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const companies = await companyApi.getAll();
      dispatch({ type: "SET_COMPANIES", payload: companies });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to fetch companies",
      });
    }
  }, []);

  const createCompany = useCallback(async (data: CreateCompanyData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const newCompany = await companyApi.create(data);
      dispatch({ type: "ADD_COMPANY", payload: newCompany });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to create company",
      });
    }
  }, []);

  const updateCompany = useCallback(async (data: UpdateCompanyData) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const updatedCompany = await companyApi.update(data.id, data);
      dispatch({ type: "UPDATE_COMPANY", payload: updatedCompany });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to update company",
      });
    }
  }, []);

  const deleteCompany = useCallback(async (id: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      await companyApi.delete(id);
      dispatch({ type: "DELETE_COMPANY", payload: id });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload:
          error instanceof Error ? error.message : "Failed to delete company",
      });
    }
  }, []);

  const setCurrentCompany = useCallback((company: Company | null) => {
    dispatch({ type: "SET_CURRENT_COMPANY", payload: company });
  }, []);

  const setEditing = useCallback((isEditing: boolean) => {
    dispatch({ type: "SET_EDITING", payload: isEditing });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" });
  }, []);

  const value: CompanyContextType = {
    state,
    dispatch,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    setCurrentCompany,
    setEditing,
    clearError,
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
};

export const useCompany = (): CompanyContextType => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return context;
};
