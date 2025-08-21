"use client";

import React from "react";
import { SettingsPanel } from "./SettingsPanel";
import { GenericSettingsForm } from "./GenericSettingsForm";
import { SettingsSchema, SettingsData, SettingField } from "@/types/settings";

interface GenericSettingsPanelProps<T extends SettingsData = SettingsData> {
  isOpen: boolean;
  onClose: () => void;
  onApply: (data: T) => void;
  onCancel?: () => void;
  onReset?: () => void;
  schema: SettingsSchema;
  data: T;
  onDataChange: (data: T) => void;
  title?: string;
  showSectionHeaders?: boolean;
  collapsibleSections?: boolean;
  validationErrors?: { [fieldId: string]: string };
  isLoading?: boolean;
  renderFieldOverride?: (
    field: SettingField,
    value: string | number | boolean | string[] | File | File[] | null,
    onChange: (
      fieldId: string,
      value: string | number | boolean | string[] | File | File[] | null
    ) => void
  ) => React.ReactNode | undefined;
}

export function GenericSettingsPanel<T extends SettingsData = SettingsData>({
  isOpen,
  onClose,
  onApply,
  onCancel,
  onReset,
  schema,
  data,
  onDataChange,
  title,
  showSectionHeaders = true,
  collapsibleSections = true,
  validationErrors = {},
  renderFieldOverride,
}: // isLoading = false,
GenericSettingsPanelProps<T>) {
  if (!isOpen) return null;

  const panelTitle = title || schema.title || "Settings";

  const handleFieldChange = (
    fieldId: string,
    value: string | number | boolean | string[] | File | File[] | null
  ) => {
    const newData = {
      ...data,
      [fieldId]: value,
    };
    onDataChange(newData);
  };

  const handleApply = () => {
    onApply(data);
  };

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={handleClose}
      onApply={handleApply}
      title={panelTitle}
    >
      <GenericSettingsForm
        schema={schema}
        data={data}
        onFieldChange={handleFieldChange}
        errors={validationErrors}
        showSectionHeaders={showSectionHeaders}
        collapsibleSections={collapsibleSections}
        onReset={handleReset}
        renderFieldOverride={renderFieldOverride}
      />
    </SettingsPanel>
  );
}
