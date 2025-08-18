"use client";

import React, { useState } from "react";
import { ColorPicker } from "@/components/ui";
// import { IconSelector } from "@/components/ui/IconSelector";
// import { IconOption } from "@/components/ui/config/iconLibrary";

interface HeaderSettingsData {
  // Responsive settings for Desktop, Tablet, Mobile
  desktop: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  tablet: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  mobile: {
    height: number;
    paddingHorizontal: number;
    paddingVertical: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };

  // Global settings (not device-specific)
  backgroundColor: string;
  dropShadow: "none" | "light" | "medium" | "strong";
  quickButtonBgColor: string;
  quickButtonIconColor: string;
  quickButtonHoverBgColor: string;
  quickButtonHoverIconColor: string;
  quickButtonShape: "rounded" | "circle" | "square";
  quickButtonShadow: "none" | "light" | "medium" | "strong";
  quickButtonGap: string;
  menuButtonBgColor: string;
  menuButtonIconColor: string;
  menuButtonHoverBgColor: string;
  menuButtonHoverIconColor: string;
  menuButtonIconId: string;
  menuButtonShape: "rounded" | "circle" | "square";
  menuButtonShadow: "none" | "light" | "medium" | "strong";
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
  const [currentDevice, setCurrentDevice] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  const handleSettingChange = (
    device: "desktop" | "tablet" | "mobile",
    key: keyof {
      height: number;
      paddingHorizontal: number;
      paddingVertical: number;
      logoWidth: number;
      logoHeight: number;
      quickButtonSize: number;
      menuButtonSize: number;
    },
    value: number
  ) => {
    const newSettings = {
      ...settings,
      [device]: {
        ...settings[device],
        [key]: value,
      },
    };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleGlobalSettingChange = (
    key: keyof Omit<HeaderSettingsData, "desktop" | "tablet" | "mobile">,
    value: string
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleColorChange = (
    key: keyof Omit<HeaderSettingsData, "desktop" | "tablet" | "mobile">,
    value: string
  ) => {
    handleGlobalSettingChange(key, value);
  };

  const handleShapeChange = (
    key: keyof Omit<HeaderSettingsData, "desktop" | "tablet" | "mobile">,
    value: "rounded" | "circle" | "square"
  ) => {
    handleGlobalSettingChange(key, value);
  };

  const NumberInput = ({
    label,
    value,
    onChange,
    placeholder,
    helperText,
    min = 0,
    max = 200,
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    helperText?: string;
    min?: number;
    max?: number;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const numValue = parseInt(e.target.value) || 0;
          if (numValue >= min && numValue <= max) {
            onChange(numValue);
          }
        }}
        onBlur={(e) => {
          const numValue = parseInt(e.target.value) || 0;
          if (numValue < min) {
            onChange(min);
          } else if (numValue > max) {
            onChange(max);
          }
        }}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );

  const ResponsiveSection = ({
    device,
    title,
  }: {
    device: "desktop" | "tablet" | "mobile";
    title: string;
  }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          label="Header Height"
          value={settings[device].height}
          onChange={(value) => handleSettingChange(device, "height", value)}
          placeholder="64"
          helperText="Height in pixels"
          min={40}
          max={120}
        />
        <NumberInput
          label="Horizontal Padding"
          value={settings[device].paddingHorizontal}
          onChange={(value) =>
            handleSettingChange(device, "paddingHorizontal", value)
          }
          placeholder="16"
          helperText="Left & right padding in pixels"
          min={0}
          max={100}
        />
        <NumberInput
          label="Vertical Padding"
          value={settings[device].paddingVertical}
          onChange={(value) =>
            handleSettingChange(device, "paddingVertical", value)
          }
          placeholder="8"
          helperText="Top & bottom padding in pixels"
          min={0}
          max={50}
        />
        <NumberInput
          label="Logo Width"
          value={settings[device].logoWidth}
          onChange={(value) => handleSettingChange(device, "logoWidth", value)}
          placeholder="40"
          helperText="Logo width in pixels"
          min={20}
          max={100}
        />
        <NumberInput
          label="Logo Height"
          value={settings[device].logoHeight}
          onChange={(value) => handleSettingChange(device, "logoHeight", value)}
          placeholder="40"
          helperText="Logo height in pixels"
          min={20}
          max={100}
        />
        <NumberInput
          label="Quick Button Size"
          value={settings[device].quickButtonSize}
          onChange={(value) =>
            handleSettingChange(device, "quickButtonSize", value)
          }
          placeholder="40"
          helperText="Quick button size (40 = 40x40 pixels)"
          min={24}
          max={80}
        />
        <NumberInput
          label="Menu Button Size"
          value={settings[device].menuButtonSize}
          onChange={(value) =>
            handleSettingChange(device, "menuButtonSize", value)
          }
          placeholder="40"
          helperText="Menu button size (40 = 40x40 pixels)"
          min={24}
          max={80}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Device Tabs */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: "desktop", label: "💻 Desktop" },
            { key: "tablet", label: "📱 Tablet" },
            { key: "mobile", label: "📱 Mobile" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                setCurrentDevice(key as "desktop" | "tablet" | "mobile")
              }
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentDevice === key
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Settings */}
      {currentDevice === "desktop" && (
        <ResponsiveSection device="desktop" title="Desktop Settings" />
      )}
      {currentDevice === "tablet" && (
        <ResponsiveSection device="tablet" title="Tablet Settings" />
      )}
      {currentDevice === "mobile" && (
        <ResponsiveSection device="mobile" title="Mobile Settings" />
      )}

      {/* Global Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Global Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ColorPicker
            label="Background Color"
            color={settings.backgroundColor}
            onChange={(value) => handleColorChange("backgroundColor", value)}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Drop Shadow
            </label>
            <select
              value={settings.dropShadow}
              onChange={(e) =>
                handleGlobalSettingChange("dropShadow", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Button Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Quick Button Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Hover Background Color"
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
              Shape
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Shadow
            </label>
            <select
              value={settings.quickButtonShadow}
              onChange={(e) =>
                handleGlobalSettingChange("quickButtonShadow", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
      </div>

      {/* Menu Button Settings */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Menu Button Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            label="Hover Background Color"
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
              Shape
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
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Shadow
            </label>
            <select
              value={settings.menuButtonShadow}
              onChange={(e) =>
                handleGlobalSettingChange("menuButtonShadow", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
