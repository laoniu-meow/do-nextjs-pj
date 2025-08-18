"use client";

import React, { useState } from "react";
import { ColorPicker } from "@/components/ui";

interface HeaderSettingsData {
  // Header appearance
  height: string;
  backgroundColor: string;
  dropShadow: string;

  // Logo settings
  logoWidth: string;
  logoHeight: string;

  // Quick button settings
  quickButtonSize: string;
  quickButtonBgColor: string;
  quickButtonIconColor: string;
  quickButtonHoverBgColor: string;
  quickButtonHoverIconColor: string;
  quickButtonShape: "rounded" | "circle" | "square";
  quickButtonShadow: string;
  quickButtonGap: string;

  // Menu button settings
  menuButtonWidth: string;
  menuButtonHeight: string;
  menuButtonBgColor: string;
  menuButtonIconColor: string;
  menuButtonHoverBgColor: string;
  menuButtonHoverIconColor: string;
  menuButtonShape: "rounded" | "circle" | "square";
  menuButtonShadow: string;
}

interface HeaderSettingsFormProps {
  initialSettings: HeaderSettingsData;
  onSettingsChange: (settings: HeaderSettingsData) => void;
}

export function HeaderSettingsForm({
  initialSettings,
  onSettingsChange,
}: HeaderSettingsFormProps) {
  const [settings, setSettings] = useState<HeaderSettingsData>(initialSettings);

  const handleSettingChange = (
    key: keyof HeaderSettingsData,
    value: string
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleColorChange = (key: keyof HeaderSettingsData, value: string) => {
    handleSettingChange(key, value);
  };

  const handleShapeChange = (
    key: keyof HeaderSettingsData,
    value: "rounded" | "circle" | "square"
  ) => {
    handleSettingChange(key, value);
  };

  const TextInput = ({
    label,
    value,
    onChange,
    placeholder,
    helperText,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    helperText?: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Appearance Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Header Appearance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Header Height"
            value={settings.height}
            onChange={(value) => handleSettingChange("height", value)}
            placeholder="64px"
            helperText="e.g., 64px, 80px, 100px"
          />
          <ColorPicker
            label="Background Color"
            color={settings.backgroundColor}
            onChange={(value) => handleColorChange("backgroundColor", value)}
          />
          <ColorPicker
            label="Drop Shadow"
            color={settings.dropShadow}
            onChange={(value) => handleSettingChange("dropShadow", value)}
          />
        </div>
      </div>

      {/* Logo Settings Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Logo Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Logo Width"
            value={settings.logoWidth}
            onChange={(value) => handleSettingChange("logoWidth", value)}
            placeholder="120px"
            helperText="e.g., 80px, 120px, 160px"
          />
          <TextInput
            label="Logo Height"
            value={settings.logoHeight}
            onChange={(value) => handleSettingChange("logoHeight", value)}
            placeholder="40px"
            helperText="e.g., 32px, 40px, 48px"
          />
          <div className="md:col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Logo is automatically fetched from your
                Company Profile. Upload or update your logo in the Company
                Profile settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Button Settings Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Button Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Button Size"
            value={settings.quickButtonSize}
            onChange={(value) => handleSettingChange("quickButtonSize", value)}
            placeholder="40px"
            helperText="e.g., 32px, 40px, 48px"
          />
          <ColorPicker
            label="Background Color"
            color={settings.quickButtonBgColor}
            onChange={(value) => handleColorChange("quickButtonBgColor", value)}
          />
          <ColorPicker
            label="Icon Color"
            color={settings.quickButtonIconColor}
            onChange={(value) =>
              handleColorChange("quickButtonIconColor", value)
            }
          />
          <ColorPicker
            label="Hover Background"
            color={settings.quickButtonHoverBgColor}
            onChange={(value) =>
              handleColorChange("quickButtonHoverBgColor", value)
            }
          />
          <ColorPicker
            label="Hover Icon Color"
            color={settings.quickButtonHoverIconColor}
            onChange={(value) =>
              handleColorChange("quickButtonHoverIconColor", value)
            }
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Button Shape
            </label>
            <select
              value={settings.quickButtonShape}
              onChange={(e) =>
                handleShapeChange(
                  "quickButtonShape",
                  e.target.value as "rounded" | "circle" | "square"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>
          <TextInput
            label="Button Shadow"
            value={settings.quickButtonShadow}
            onChange={(value) =>
              handleSettingChange("quickButtonShadow", value)
            }
            placeholder="0 1px 3px rgba(0, 0, 0, 0.1)"
            helperText="CSS box-shadow value"
          />
          <TextInput
            label="Button Gap"
            value={settings.quickButtonGap}
            onChange={(value) => handleSettingChange("quickButtonGap", value)}
            placeholder="0px"
            helperText="e.g., 0px, 8px, 16px"
          />
        </div>
      </div>

      {/* Menu Button Settings Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Menu Button Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Button Width"
            value={settings.menuButtonWidth}
            onChange={(value) => handleSettingChange("menuButtonWidth", value)}
            placeholder="40px"
            helperText="e.g., 32px, 40px, 48px"
          />
          <TextInput
            label="Button Height"
            value={settings.menuButtonHeight}
            onChange={(value) => handleSettingChange("menuButtonHeight", value)}
            placeholder="40px"
            helperText="e.g., 32px, 40px, 48px"
          />
          <ColorPicker
            label="Background Color"
            color={settings.menuButtonBgColor}
            onChange={(value) => handleColorChange("menuButtonBgColor", value)}
          />
          <ColorPicker
            label="Icon Color"
            color={settings.menuButtonIconColor}
            onChange={(value) =>
              handleColorChange("menuButtonIconColor", value)
            }
          />
          <ColorPicker
            label="Hover Background"
            color={settings.menuButtonHoverBgColor}
            onChange={(value) =>
              handleColorChange("menuButtonHoverBgColor", value)
            }
          />
          <ColorPicker
            label="Hover Icon Color"
            color={settings.menuButtonHoverIconColor}
            onChange={(value) =>
              handleColorChange("menuButtonHoverIconColor", value)
            }
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Button Shape
            </label>
            <select
              value={settings.menuButtonShape}
              onChange={(e) =>
                handleShapeChange(
                  "menuButtonShape",
                  e.target.value as "rounded" | "circle" | "square"
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>
          <TextInput
            label="Button Shadow"
            value={settings.menuButtonShadow}
            onChange={(value) => handleSettingChange("menuButtonShadow", value)}
            placeholder="0 1px 3px rgba(0, 0, 0, 0.1)"
            helperText="CSS box-shadow value"
          />
        </div>
      </div>
    </div>
  );
}
