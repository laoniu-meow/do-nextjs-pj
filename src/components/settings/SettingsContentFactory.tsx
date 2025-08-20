"use client";

import React from "react";
import { CompanyProfileSettings } from "./content/CompanyProfileSettings";
import {
  HeaderSettingsForm,
  DEFAULT_HEADER_SETTINGS,
} from "@/features/header-main";
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
      return (
        <HeaderSettingsForm
          initialSettings={DEFAULT_HEADER_SETTINGS}
          onSettingsChange={() => {}}
        />
      );
    case "header-main":
      return (
        <HeaderSettingsForm
          initialSettings={DEFAULT_HEADER_SETTINGS}
          onSettingsChange={() => {}}
        />
      );
    default:
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">No settings available for this page</p>
        </div>
      );
  }
};
