"use client";

import React from "react";
import { CompanyProfileSettings } from "./content/CompanyProfileSettings";
import { HeaderMainSettings } from "./content/HeaderMainSettings";
import { CompanyFormData } from "@/types";

interface SettingsContentFactoryProps {
  pageType: string;
  onFormDataChange?: (data: CompanyFormData) => void;
  initialData?: CompanyFormData | null;
}

export const SettingsContentFactory: React.FC<SettingsContentFactoryProps> = ({
  pageType,
  onFormDataChange,
  initialData,
}) => {
  switch (pageType) {
    case "company-profile":
      return (
        <CompanyProfileSettings
          onFormDataChange={onFormDataChange}
          initialData={initialData || undefined}
        />
      );
    case "header-settings":
      return <HeaderMainSettings onApply={() => {}} onCancel={() => {}} />;
    case "header-main":
      return <HeaderMainSettings onApply={() => {}} onCancel={() => {}} />;
    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No settings available for this page</p>
        </div>
      );
  }
};
