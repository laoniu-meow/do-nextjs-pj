# Company Project Structure Guide

This document outlines the recommended structure for organizing components and code files in your company web application following enterprise-level best practices.

## 📁 Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, inputs, modals)
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── company/         # Company-specific components
│   ├── navigation/      # Navigation components
│   ├── forms/           # Form components
│   ├── tables/          # Data table components
│   └── charts/          # Data visualization components
├── features/             # Feature-based organization
│   ├── auth/            # Authentication feature
│   ├── dashboard/       # Dashboard feature
│   ├── users/           # User management feature
│   ├── content/         # Content management feature
│   └── settings/        # Settings feature
├── shared/               # Shared utilities and components
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   ├── constants/       # App constants
│   ├── types/           # TypeScript type definitions
│   └── services/        # API services
├── contexts/             # React Context providers
├── reducers/             # State management reducers
├── app/                  # Next.js app router
├── lib/                  # Third-party library configurations
└── styles/               # Global styles
```

## 🏗️ Component Organization Principles

### 1. **Feature-Based Organization**

- Group components by business feature rather than technical type
- Each feature has its own directory with related components
- Example: `src/features/company/` contains all company-related components

### 2. **Component Naming Conventions**

- **Components**: PascalCase (e.g., `CompanyHeader.tsx`)
- **Utilities**: camelCase (e.g., `companyUtils.ts`)
- **Types**: camelCase (e.g., `company.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `COMPANY_CONFIG`)

### 3. **File Structure Standards**

Each component file should include:

```typescript
// ComponentName.tsx
import React from "react";
import { ComponentNameProps } from "./types";

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
}) => {
  // Component logic
};

export default ComponentName;
```

## 🔄 State Management Structure

### Reducer Pattern (Preferred)

```typescript
// reducers/companyReducer.ts
export interface CompanyState {
  companies: Company[];
  currentCompany: Company | null;
  isLoading: boolean;
  error: string | null;
}

export const companyReducer = (state: CompanyState, action: CompanyAction) => {
  // Reducer logic
};
```

### Context Provider

```typescript
// contexts/CompanyContext.tsx
export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  return (
    <CompanyContext.Provider value={{ state, dispatch }}>
      {children}
    </CompanyContext.Provider>
  );
};
```

## 🎣 Custom Hooks Organization

### Hook Naming Convention

- Prefix with `use` (e.g., `useCompanyManagement`)
- Group related functionality
- Return structured data and actions

```typescript
// hooks/useCompanyManagement.ts
export const useCompanyManagement = () => {
  // Hook logic
  return {
    // State
    companies,
    isLoading,
    // Actions
    createCompany,
    updateCompany,
    // Computed
    hasCompanies,
  };
};
```

## 🌐 API Service Layer

### Service Structure

```typescript
// services/api/company.ts
export const companyApi = {
  getAll: async (): Promise<Company[]> => {
    // API call logic
  },
  create: async (data: CreateCompanyData): Promise<Company> => {
    // API call logic
  },
  // ... other methods
};
```

### Error Handling

- Custom error classes for different error types
- Consistent error response format
- Proper HTTP status code handling

## ⚙️ Configuration Management

### Centralized Configuration

```typescript
// config/company.ts
export const COMPANY_CONFIG = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
    TIMEOUT: 30000,
  },
  VALIDATION: {
    NAME: { MIN_LENGTH: 2, MAX_LENGTH: 100 },
  },
  // ... other config
} as const;
```

## 🧪 Testing Structure

### Test Organization

```
src/
├── __tests__/
│   ├── components/       # Component tests
│   ├── hooks/           # Hook tests
│   ├── utils/           # Utility tests
│   └── mocks/           # Test mocks
```

### Test File Naming

- Test files should mirror the source file structure
- Use `.test.tsx` or `.test.ts` extension
- Group related tests in describe blocks

## 📝 Type Definitions

### Type Organization

```typescript
// types/company.ts
export interface Company {
  id: string;
  name: string;
  description: string;
  // ... other properties
}

export interface CompanyHeaderProps {
  companyName: string;
  logo: string;
  onLogoClick?: () => void;
}
```

### Type Export Pattern

```typescript
// types/index.ts
export * from "./company";
export * from "./user";
export * from "./common";
```

## 🎨 Utility Functions

### Utility Organization

```typescript
// utils/companyUtils.ts
export const validateCompanyData = (data: CreateCompanyData) => {
  // Validation logic
};

export const formatCompanyData = (company: Company) => {
  // Formatting logic
};
```

### Utility Categories

- **Validation**: Data validation functions
- **Formatting**: Data display formatting
- **Transformation**: Data transformation utilities
- **Helpers**: Common helper functions

## 📚 Import/Export Patterns

### Clean Imports

```typescript
// components/company/index.ts
export { CompanyHeader } from "./CompanyHeader";
export { CompanyForm } from "./CompanyForm";

// Usage
import { CompanyHeader, CompanyForm } from "@/components/company";
```

### Absolute Imports

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/types/*": ["src/types/*"]
    }
  }
}
```

## 🚀 Best Practices

### 1. **Component Composition**

- Keep components focused and single-purpose
- Use composition over inheritance
- Pass data down, callbacks up

### 2. **Performance Optimization**

- Use `React.memo` for expensive components
- Implement proper dependency arrays in hooks
- Lazy load components when possible

### 3. **Error Boundaries**

- Implement error boundaries for feature sections
- Provide fallback UI for error states
- Log errors appropriately

### 4. **Accessibility**

- Use semantic HTML elements
- Implement proper ARIA labels
- Ensure keyboard navigation support

### 5. **Internationalization**

- Extract text strings to constants
- Use translation keys for multi-language support
- Consider RTL language support

## 🔧 Development Workflow

### 1. **Creating New Components**

1. Create component file in appropriate directory
2. Define TypeScript interfaces
3. Implement component logic
4. Add to index file for exports
5. Write tests
6. Update documentation

### 2. **Adding New Features**

1. Create feature directory
2. Add feature components
3. Create feature-specific hooks
4. Add to routing
5. Update navigation
6. Write integration tests

### 3. **Code Review Checklist**

- [ ] Follows naming conventions
- [ ] Proper TypeScript types
- [ ] Component composition
- [ ] Error handling
- [ ] Test coverage
- [ ] Documentation updated

## 📖 Documentation Standards

### Component Documentation

````typescript
/**
 * CompanyHeader component displays company information in the header
 *
 * @param companyName - The name of the company to display
 * @param logo - URL to the company logo image
 * @param onLogoClick - Optional callback when logo is clicked
 *
 * @example
 * ```tsx
 * <CompanyHeader
 *   companyName="Acme Corp"
 *   logo="/logo.png"
 *   onLogoClick={() => handleLogoClick()}
 * />
 * ```
 */
export const CompanyHeader: React.FC<CompanyHeaderProps> = ({ ... }) => {
  // Component implementation
};
````

## 🎯 Migration Guide

### From Old Structure

1. **Identify components** by feature
2. **Move files** to new directory structure
3. **Update imports** throughout the codebase
4. **Refactor components** to follow new patterns
5. **Add tests** for migrated components
6. **Update documentation**

### Common Migration Patterns

- Move related components to feature directories
- Extract utility functions to utils
- Consolidate types in type files
- Create index files for clean imports

## 🔍 Troubleshooting

### Common Issues

1. **Import errors**: Check index file exports
2. **Type errors**: Verify TypeScript interfaces
3. **Build failures**: Check absolute import paths
4. **Test failures**: Verify test file structure

### Debugging Tips

- Use TypeScript strict mode
- Enable ESLint rules for structure
- Run tests before committing
- Check component prop types

---

This structure provides a scalable, maintainable foundation for your company web application. Follow these patterns consistently to ensure code quality and team productivity.
