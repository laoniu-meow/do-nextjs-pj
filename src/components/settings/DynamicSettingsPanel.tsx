"use client";

import React from "react";
import { SettingsPanel } from "./SettingsPanel";
import { SettingsContentFactory } from "./SettingsContentFactory";
import { CompanyFormData } from "@/types";
import type { HeaderSettingsData } from "@/features/header-main";

type CompanyProfilePanelProps = {
  pageType: "company-profile";
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  title?: string;
  onFormDataChange: (data: CompanyFormData) => void;
  initialData?: CompanyFormData | null;
};

type HeaderMainPanelProps = {
  pageType: "header-main" | "header-settings";
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  title?: string;
  initialSettings: HeaderSettingsData;
  onSettingsChange: (data: HeaderSettingsData) => void;
};

type DynamicSettingsPanelProps =
  | CompanyProfilePanelProps
  | HeaderMainPanelProps;

export const DynamicSettingsPanel: React.FC<DynamicSettingsPanelProps> = (
  props
) => {
  const { isOpen, onClose, onApply, title } = props;
  if (!isOpen) return null;

  const panelTitle = title || "Settings";

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={onClose}
      onApply={onApply}
      title={panelTitle}
    >
      {props.pageType === "company-profile" ? (
        <SettingsContentFactory
          pageType="company-profile"
          onFormDataChange={props.onFormDataChange}
          initialData={props.initialData}
        />
      ) : (
        <SettingsContentFactory
          pageType={props.pageType}
          initialSettings={props.initialSettings}
          onSettingsChange={props.onSettingsChange}
        />
      )}
    </SettingsPanel>
  );
};
