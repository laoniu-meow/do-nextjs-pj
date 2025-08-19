"use client";

import React, { useState } from "react";
import { ColorPicker } from "@/components/ui";
import { iconLibrary } from "@/components/ui/config/iconLibrary";

interface HeaderSettingsData {
  // Responsive settings for Desktop, Tablet, Mobile
  desktop: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  tablet: {
    height: number;
    paddingHorizontal: number;
    logoWidth: number;
    logoHeight: number;
    quickButtonSize: number;
    menuButtonSize: number;
  };
  mobile: {
    height: number;
    paddingHorizontal: number;
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
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [iconSearchQuery, setIconSearchQuery] = useState("");

  const handleSettingChange = (
    device: "desktop" | "tablet" | "mobile",
    key: keyof {
      height: number;
      paddingHorizontal: number;
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

  const handleIconSelect = (iconId: string) => {
    handleGlobalSettingChange("menuButtonIconId", iconId);
    setIsIconPickerOpen(false);
    setIconSearchQuery("");
  };

  const openIconPicker = () => {
    setIsIconPickerOpen(true);
  };

  const closeIconPicker = () => {
    setIsIconPickerOpen(false);
    setIconSearchQuery("");
  };

  const getSelectedIcon = () => {
    return (
      iconLibrary.find((icon) => icon.id === settings.menuButtonIconId) ||
      iconLibrary.find((icon) => icon.id === "menu")
    );
  };

  // Filter icons based on search query
  const filteredIcons = iconLibrary.filter(
    (icon) =>
      icon.name.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
      icon.description.toLowerCase().includes(iconSearchQuery.toLowerCase()) ||
      icon.category.toLowerCase().includes(iconSearchQuery.toLowerCase())
  );

  // Enhanced Responsive Input Group with better styling and cross-platform support
  const ResponsiveInputGroup = ({
    label,
    desktopValue,
    tabletValue,
    mobileValue,
    onChange,
    placeholder,
    helperText,
    min = 0,
    max = 200,
    unit = "px",
  }: {
    label: string;
    desktopValue: number;
    tabletValue: number;
    mobileValue: number;
    onChange: (device: "desktop" | "tablet" | "mobile", value: number) => void;
    placeholder?: string;
    helperText?: string;
    min?: number;
    max?: number;
    unit?: string;
  }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-800 mb-3">
        {label}
      </label>
      <div className="grid grid-cols-3 gap-4">
        {/* Desktop Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Desktop
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={desktopValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value === "-") {
                  onChange("desktop", 0);
                } else {
                  const numValue = parseInt(value.replace(/\D/g, "")) || 0;
                  if (numValue >= min && numValue <= max) {
                    onChange("desktop", numValue);
                  }
                }
              }}
              onBlur={(e) => {
                const numValue =
                  parseInt(e.target.value.replace(/\D/g, "")) || 0;
                if (numValue < min) {
                  onChange("desktop", min);
                } else if (numValue > max) {
                  onChange("desktop", max);
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-medium">
              {unit}
            </span>
          </div>
        </div>

        {/* Tablet Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Tablet
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={tabletValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value === "-") {
                  onChange("tablet", 0);
                } else {
                  const numValue = parseInt(value.replace(/\D/g, "")) || 0;
                  if (numValue >= min && numValue <= max) {
                    onChange("tablet", numValue);
                  }
                }
              }}
              onBlur={(e) => {
                const numValue =
                  parseInt(e.target.value.replace(/\D/g, "")) || 0;
                if (numValue < min) {
                  onChange("tablet", min);
                } else if (numValue > max) {
                  onChange("tablet", max);
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-medium">
              {unit}
            </span>
          </div>
        </div>

        {/* Mobile Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              Mobile
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              value={mobileValue}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || value === "-") {
                  onChange("mobile", 0);
                } else {
                  const numValue = parseInt(value.replace(/\D/g, "")) || 0;
                  if (numValue >= min && numValue <= max) {
                    onChange("mobile", numValue);
                  }
                }
              }}
              onBlur={(e) => {
                const numValue =
                  parseInt(e.target.value.replace(/\D/g, "")) || 0;
                if (numValue < min) {
                  onChange("mobile", min);
                } else if (numValue > max) {
                  onChange("mobile", max);
                }
              }}
              placeholder={placeholder}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                WebkitAppearance: "none",
                MozAppearance: "textfield",
              }}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-medium">
              {unit}
            </span>
          </div>
        </div>
      </div>
      {helperText && (
        <p className="text-xs text-gray-500 mt-2 text-center">{helperText}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-white design-system">
      {/* Header Layout Settings */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Header Layout Settings
            </h3>
            <p className="text-sm text-gray-600">
              Configure responsive dimensions for different devices
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ResponsiveInputGroup
            label="Header Height"
            desktopValue={settings.desktop.height}
            tabletValue={settings.tablet.height}
            mobileValue={settings.mobile.height}
            onChange={(device, value) =>
              handleSettingChange(device, "height", value)
            }
            placeholder="64"
            helperText="Height in pixels for each device"
            min={40}
            max={120}
          />

          <ResponsiveInputGroup
            label="Horizontal Padding"
            desktopValue={settings.desktop.paddingHorizontal}
            tabletValue={settings.tablet.paddingHorizontal}
            mobileValue={settings.mobile.paddingHorizontal}
            onChange={(device, value) =>
              handleSettingChange(device, "paddingHorizontal", value)
            }
            placeholder="16"
            helperText="Left & right padding in pixels"
            min={0}
            max={100}
          />

          <ResponsiveInputGroup
            label="Logo Width"
            desktopValue={settings.desktop.logoWidth}
            tabletValue={settings.tablet.logoWidth}
            mobileValue={settings.mobile.logoWidth}
            onChange={(device, value) =>
              handleSettingChange(device, "logoWidth", value)
            }
            placeholder="40"
            helperText="Width in pixels for each device"
            min={20}
            max={100}
          />

          <ResponsiveInputGroup
            label="Logo Height"
            desktopValue={settings.desktop.logoHeight}
            tabletValue={settings.tablet.logoHeight}
            mobileValue={settings.mobile.logoHeight}
            onChange={(device, value) =>
              handleSettingChange(device, "logoHeight", value)
            }
            placeholder="40"
            helperText="Height in pixels for each device"
            min={20}
            max={100}
          />

          <ResponsiveInputGroup
            label="Quick Button Size"
            desktopValue={settings.desktop.quickButtonSize}
            tabletValue={settings.tablet.quickButtonSize}
            mobileValue={settings.mobile.quickButtonSize}
            onChange={(device, value) =>
              handleSettingChange(device, "quickButtonSize", value)
            }
            placeholder="40"
            helperText="Quick button size in pixels"
            min={24}
            max={80}
          />

          <ResponsiveInputGroup
            label="Menu Button Size"
            desktopValue={settings.desktop.menuButtonSize}
            tabletValue={settings.tablet.menuButtonSize}
            mobileValue={settings.mobile.menuButtonSize}
            onChange={(device, value) =>
              handleSettingChange(device, "menuButtonSize", value)
            }
            placeholder="40"
            helperText="Menu button size in pixels"
            min={24}
            max={80}
          />
        </div>
      </div>

      {/* Global Header Settings */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Global Header Settings
            </h3>
            <p className="text-sm text-gray-600">
              Configure appearance and behavior across all devices
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker
            label="Background Color"
            color={settings.backgroundColor}
            onChange={(value) => handleColorChange("backgroundColor", value)}
          />

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Drop Shadow
            </label>
            <select
              value={settings.dropShadow}
              onChange={(e) =>
                handleGlobalSettingChange("dropShadow", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
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
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Quick Button Settings
            </h3>
            <p className="text-sm text-gray-600">
              Customize the appearance of quick action buttons
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label className="block text-sm font-semibold text-gray-700">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
            >
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Shadow
            </label>
            <select
              value={settings.quickButtonShadow}
              onChange={(e) =>
                handleGlobalSettingChange("quickButtonShadow", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Button Gap
            </label>
            <input
              type="text"
              value={settings.quickButtonGap}
              onChange={(e) =>
                handleGlobalSettingChange("quickButtonGap", e.target.value)
              }
              placeholder="8px"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
            />
            <p className="text-xs text-gray-500">
              Spacing between quick buttons (e.g., 8px, 1rem)
            </p>
          </div>
        </div>
      </div>

      {/* Menu Button Settings */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Menu Button Settings
            </h3>
            <p className="text-sm text-gray-600">
              Customize the main navigation menu button
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label className="block text-sm font-semibold text-gray-700">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
            >
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Shadow
            </label>
            <select
              value={settings.menuButtonShadow}
              onChange={(e) =>
                handleGlobalSettingChange("menuButtonShadow", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>

        {/* Icon Picker for Menu Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                />
              </svg>
            </div>
            <label className="block text-lg font-semibold text-gray-800">
              Menu Button Icon
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={openIconPicker}
              className="flex items-center space-x-3 p-4 border-2 border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg border group-hover:bg-blue-100 transition-colors">
                {(() => {
                  const selectedIcon = getSelectedIcon();
                  const IconComponent = selectedIcon?.icon;
                  return IconComponent ? (
                    <IconComponent className="w-6 h-6 text-gray-600" />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  );
                })()}
              </div>
              <div className="text-left">
                <span className="text-sm font-medium text-gray-700 block">
                  {getSelectedIcon()?.name || "Select Icon"}
                </span>
                <span className="text-xs text-gray-500">
                  Click to choose from icon library
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Icon Picker Dialog */}
      {isIconPickerOpen && (
        <div
          className="fixed inset-0 icon-picker-dialog flex items-center justify-center bg-black bg-opacity-50 p-4"
          style={{ zIndex: 9998 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden transform transition-all duration-200 ease-out">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Select Menu Button Icon
                  </h3>
                  <p className="text-sm text-gray-600">
                    Choose from our extensive icon library
                  </p>
                </div>
              </div>
              <button
                onClick={closeIconPicker}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search and Category Tabs */}
            <div className="p-6 border-b border-gray-200 space-y-4">
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search icons by name, description, or category..."
                    value={iconSearchQuery}
                    onChange={(e) => setIconSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setIconSearchQuery("")}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                    iconSearchQuery === ""
                      ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 hover:shadow-sm"
                  }`}
                >
                  All Icons
                </button>
                {Array.from(
                  new Set(iconLibrary.map((icon) => icon.category))
                ).map((category) => (
                  <button
                    key={category}
                    onClick={() => setIconSearchQuery(category)}
                    className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                      iconSearchQuery === category
                        ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Grid */}
            <div className="p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
              {filteredIcons.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-gray-600 mb-2">
                    No icons found
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search terms or category filter
                  </p>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-6 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                    Showing{" "}
                    <span className="font-semibold">
                      {filteredIcons.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">{iconLibrary.length}</span>{" "}
                    icons
                  </div>

                  {/* Responsive Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-3 sm:gap-4">
                    {filteredIcons.map((icon) => {
                      const IconComponent = icon.icon;
                      return (
                        <button
                          key={icon.id}
                          onClick={() => handleIconSelect(icon.id)}
                          className={`p-3 sm:p-4 border-2 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 ${
                            settings.menuButtonIconId === icon.id
                              ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200 shadow-md"
                              : "border-gray-200 hover:shadow-sm"
                          }`}
                          title={`${icon.name} - ${icon.category}`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                            <span className="text-xs text-gray-600 text-center leading-tight hidden sm:block font-medium">
                              {icon.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">💡 Tip:</span> Click any icon
                  to select it for your menu button
                </div>
                <button
                  onClick={closeIconPicker}
                  className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
