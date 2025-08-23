"use client";

import React from "react";
import { CompanyProfileSettings } from "./content/CompanyProfileSettings";
import {
  HeaderSettingsForm,
  DEFAULT_HEADER_SETTINGS,
} from "@/features/header-main";
import { HeroSettingsForm } from "@/features/hero-page/components/HeroSettingsForm";
import { CompanyFormData } from "@/types";
import type { HeaderSettingsData } from "@/features/header-main";
import type { Section } from "@/features/hero-page/services/heroPageApi";

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

type HeroPageContentProps = {
  pageType: "hero-page";
  sections: Section[];
  canAddMore: boolean;
  onAddSection: () => void;
  onRemoveSection: (order: number) => void;
  onUpdateSection: (section: Section) => void;
  onReorderSections: (sections: Section[]) => void;
};

type SettingsContentFactoryProps =
  | CompanyProfileContentProps
  | HeaderMainContentProps
  | HeroPageContentProps
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
    case "hero-page":
      return (
        <HeroSettingsForm
          sections={(props as HeroPageContentProps).sections}
          canAddMore={(props as HeroPageContentProps).canAddMore}
          onAddSection={(props as HeroPageContentProps).onAddSection}
          onRemoveSection={(props as HeroPageContentProps).onRemoveSection}
          onUpdateSection={(props as HeroPageContentProps).onUpdateSection}
          onReorderSections={(props as HeroPageContentProps).onReorderSections}
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
