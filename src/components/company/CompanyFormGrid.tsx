"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CompanyFormGridProps {
  children: React.ReactNode;
  className?: string;
  spacing?: number;
  columns?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export const CompanyFormGrid: React.FC<CompanyFormGridProps> = ({
  children,
  className,
  spacing = 3,
  columns = {
    xs: 1,
    sm: 2,
    md: 2,
    lg: 2,
    xl: 2,
  },
}) => {
  const gridStyles = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns.md || 2}, 1fr)`,
    gap: `${spacing * 8}px`,
    width: "100%",
  };

  return (
    <div className={cn("company-form-grid", className)} style={gridStyles}>
      {React.Children.map(children, (child, index) => (
        <div key={index}>{child}</div>
      ))}
    </div>
  );
};

// Specialized grid layouts for common company form patterns
/**
 * CompanyBasicInfoGrid - Single column layout for basic company information
 *
 * Responsive behavior:
 * - Mobile (xs): 1 column
 * - Tablet (sm, md): 1 column
 * - Desktop (lg, xl): 1 column
 *
 * Use case: Company name, description, industry, etc.
 */
export const CompanyBasicInfoGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <CompanyFormGrid columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }} spacing={3}>
    {children}
  </CompanyFormGrid>
);

/**
 * CompanyContactGrid - Responsive multi-column layout for contact information
 *
 * Responsive behavior:
 * - Mobile (xs): 1 column (stacked for mobile usability)
 * - Tablet (sm, md): 2 columns (side-by-side on tablets)
 * - Desktop (lg, xl): 3 columns (optimized for wide screens)
 *
 * Use case: Phone, email, website, contact person, etc.
 */
export const CompanyContactGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <CompanyFormGrid columns={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }} spacing={3}>
    {children}
  </CompanyFormGrid>
);

/**
 * CompanyAddressGrid - Single column layout for address information
 *
 * Responsive behavior:
 * - Mobile (xs): 1 column
 * - Tablet (sm, md): 1 column
 * - Desktop (lg, xl): 1 column
 *
 * Use case: Street address, city, state, zip code, country, etc.
 */
export const CompanyAddressGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <CompanyFormGrid columns={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }} spacing={3}>
    {children}
  </CompanyFormGrid>
);
