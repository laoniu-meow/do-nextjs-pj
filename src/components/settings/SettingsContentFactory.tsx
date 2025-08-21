"use client";

import React from "react";
import { CompanyProfileSettings } from "./content/CompanyProfileSettings";
import {
  HeaderSettingsForm,
  DEFAULT_HEADER_SETTINGS,
} from "@/features/header-main";
import { CompanyFormData } from "@/types";
import type { HeaderSettingsData } from "@/features/header-main";

type CompanyProfileContentProps = {
  pageType: "company-profile";
  onFormDataChange?: (data: CompanyFormData) => void;
  initialData?: CompanyFormData | null;
};

type HeaderMainContentProps = {
  pageType: "header-main" | "header-settings";
  initialSettings: HeaderSettingsData;
  onSettingsChange: (data: HeaderSettingsData) => void;
};

type SettingsContentFactoryProps =
  | CompanyProfileContentProps
  | HeaderMainContentProps
  | { pageType: string };

export const SettingsContentFactory: React.FC<SettingsContentFactoryProps> = (
  props
) => {
  const { pageType } = props;
  switch (pageType) {
    case "company-profile":
      return (
        <CompanyProfileSettings
          onFormDataChange={
            (props as CompanyProfileContentProps).onFormDataChange
          }
          initialData={
            (props as CompanyProfileContentProps).initialData || undefined
          }
        />
      );
    case "header-settings":
      return (
        <HeaderSettingsForm
          initialSettings={
            "initialSettings" in props
              ? props.initialSettings
              : DEFAULT_HEADER_SETTINGS
          }
          onSettingsChange={
            "onSettingsChange" in props ? props.onSettingsChange : () => {}
          }
        />
      );
    case "header-main":
      return (
        <HeaderSettingsForm
          initialSettings={
            "initialSettings" in props
              ? props.initialSettings
              : DEFAULT_HEADER_SETTINGS
          }
          onSettingsChange={
            "onSettingsChange" in props ? props.onSettingsChange : () => {}
          }
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
