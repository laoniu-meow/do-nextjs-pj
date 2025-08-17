"use client";

import React from "react";
import { SettingsPanel } from "./SettingsPanel";
import { useSettingsContent } from "@/hooks/useSettingsContent";
import { SettingsContentFactory } from "./SettingsContentFactory";

interface DynamicSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const DynamicSettingsPanel: React.FC<DynamicSettingsPanelProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const settingsContent = useSettingsContent();

  // If no settings content is found, show a default message
  if (!settingsContent) {
    return (
      <SettingsPanel isOpen={isOpen} onClose={onClose} onApply={onApply}>
        <div className="text-center py-8">
          <p className="text-gray-500">No settings available for this page</p>
        </div>
      </SettingsPanel>
    );
  }

  return (
    <SettingsPanel isOpen={isOpen} onClose={onClose} onApply={onApply}>
      <SettingsContentFactory
        pageType={settingsContent.pageType}
        onApply={onApply}
        onCancel={onClose}
      />
    </SettingsPanel>
  );
};
