import React from "react";
import { Box } from "@mui/material";
import { CompanyProfileGridProps } from "../types/companyProfile";
import { CompanyProfileCard } from "./CompanyProfileCard";

export const CompanyProfileGrid: React.FC<CompanyProfileGridProps> = ({
  companies,
  onEditCompany,
  onRemoveCompany,
}) => {
  // Ensure companies is an array and has valid data
  if (!Array.isArray(companies) || companies.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
      {companies.map((company, index) => {
        // Ensure company has required properties
        if (!company || !company.name) {
          return null;
        }

        return (
          <Box
            key={`company-${index}-${company.name}`}
            sx={{
              flex: "1 1 300px",
              minWidth: "300px",
              maxWidth: "400px",
            }}
          >
            <CompanyProfileCard
              company={company}
              index={index}
              onEdit={onEditCompany}
              onRemove={onRemoveCompany}
              isMainCompany={index === 0}
            />
          </Box>
        );
      })}
    </Box>
  );
};

export default CompanyProfileGrid;
