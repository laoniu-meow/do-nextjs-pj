"use client";

import React from "react";
import { SettingsPanel } from "./SettingsPanel";
import { SettingsContentFactory } from "./SettingsContentFactory";
import { CompanyFormData } from "@/types";

interface DynamicSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onFormDataChange: (data: CompanyFormData) => void;
  title?: string;
  initialData?: CompanyFormData | null;
}

export const DynamicSettingsPanel: React.FC<DynamicSettingsPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  onFormDataChange,
  title,
  initialData,
}) => {
  if (!isOpen) return null;

  const panelTitle = title || "Settings";

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={onClose}
      onApply={onApply}
      title={panelTitle}
    >
      <SettingsContentFactory
        pageType="company-profile"
        onFormDataChange={onFormDataChange}
        initialData={initialData}
      />
    </SettingsPanel>
  );
};
