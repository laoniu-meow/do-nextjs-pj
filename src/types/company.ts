export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyRegNumber?: string;
  country?: string;
  postalCode?: string;
  contact?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyData {
  name: string;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  companyRegNumber?: string;
  country?: string;
  postalCode?: string;
  contact?: string;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  id: string;
}

export interface CompanyHeaderProps {
  companyName: string;
  logo: string;
  onLogoClick?: () => void;
}

export interface CompanyLogoProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export interface CompanyInfoProps {
  company: Company;
  isEditable?: boolean;
  onEdit?: (company: Company) => void;
}

export interface CompanyFormProps {
  company?: Company;
  onSubmit: (data: CreateCompanyData | UpdateCompanyData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}
