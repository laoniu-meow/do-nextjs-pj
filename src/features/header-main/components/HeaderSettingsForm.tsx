"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ColorPickerDialog } from "@/components/ui";
import { iconLibrary } from "@/components/ui/config/iconLibrary";
import { HeaderSettingsData } from "../types/headerMain";
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

  // Create portal for icon picker to render at body level
  useEffect(() => {
    if (isIconPickerOpen) {
      // Ensure body doesn't scroll when picker is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      // Always ensure body overflow is reset when component unmounts
      document.body.style.overflow = "unset";
    };
  }, [isIconPickerOpen]);

  // Safety cleanup - ensure body overflow is reset on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

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
    console.log(
      `handleGlobalSettingChange called with key: ${key}, value: ${value}`
    );
    console.log("Current settings:", settings);
    const newSettings = { ...settings, [key]: value };
    console.log("New settings:", newSettings);
    setSettings(newSettings);
    onSettingsChange(newSettings);
    console.log("Settings updated and onSettingsChange called");
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
    console.log("Opening icon picker...");
    console.log("Current state before:", isIconPickerOpen);
    setIsIconPickerOpen(true);
    console.log("State set to true");
    console.log("Portal should render now");
  };

  const closeIconPicker = () => {
    console.log("Closing icon picker...");
    setIsIconPickerOpen(false);
    setIconSearchQuery("");
    // Reset body overflow to allow scrolling
    document.body.style.overflow = "unset";
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

  // Debug logging
  useEffect(() => {
    if (isIconPickerOpen) {
      console.log("Icon picker is open");
      console.log("Total icons:", iconLibrary.length);
      console.log("Filtered icons:", filteredIcons.length);
      console.log("Current search query:", iconSearchQuery);
      console.log("Current selected icon ID:", settings.menuButtonIconId);
    }
  }, [
    isIconPickerOpen,
    filteredIcons.length,
    iconSearchQuery,
    settings.menuButtonIconId,
  ]);

  // Always log the current state for debugging
  console.log(
    "HeaderSettingsForm render - isIconPickerOpen:",
    isIconPickerOpen
  );

  return (
    <div className="space-y-8 p-6 pb-12 bg-gradient-to-br from-gray-50 to-white design-system">
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
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Header Height
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desktop
                </label>
                <input
                  type="number"
                  value={settings.desktop.height}
                  onChange={(e) =>
                    handleSettingChange(
                      "desktop",
                      "height",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="64"
                  min="40"
                  max="120"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tablet
                </label>
                <input
                  type="number"
                  value={settings.tablet.height}
                  onChange={(e) =>
                    handleSettingChange(
                      "tablet",
                      "height",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="64"
                  min="40"
                  max="120"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mobile
                </label>
                <input
                  type="number"
                  value={settings.mobile.height}
                  onChange={(e) =>
                    handleSettingChange(
                      "mobile",
                      "height",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="64"
                  min="40"
                  max="120"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Height in pixels for each device
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Horizontal Padding
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desktop
                </label>
                <input
                  type="number"
                  value={settings.desktop.paddingHorizontal}
                  onChange={(e) =>
                    handleSettingChange(
                      "desktop",
                      "paddingHorizontal",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="16"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tablet
                </label>
                <input
                  type="number"
                  value={settings.tablet.paddingHorizontal}
                  onChange={(e) =>
                    handleSettingChange(
                      "tablet",
                      "paddingHorizontal",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="16"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mobile
                </label>
                <input
                  type="number"
                  value={settings.mobile.paddingHorizontal}
                  onChange={(e) =>
                    handleSettingChange(
                      "mobile",
                      "paddingHorizontal",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="16"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Left & right padding in pixels
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Logo Width
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desktop
                </label>
                <input
                  type="number"
                  value={settings.desktop.logoWidth}
                  onChange={(e) =>
                    handleSettingChange(
                      "desktop",
                      "logoWidth",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="20"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tablet
                </label>
                <input
                  type="number"
                  value={settings.tablet.logoWidth}
                  onChange={(e) =>
                    handleSettingChange(
                      "tablet",
                      "logoWidth",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="20"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mobile
                </label>
                <input
                  type="number"
                  value={settings.mobile.logoWidth}
                  onChange={(e) =>
                    handleSettingChange(
                      "mobile",
                      "logoWidth",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="20"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Width in pixels for each device
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Logo Height
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desktop
                </label>
                <input
                  type="number"
                  value={settings.desktop.logoHeight}
                  onChange={(e) =>
                    handleSettingChange(
                      "desktop",
                      "logoHeight",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="20"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tablet
                </label>
                <input
                  type="number"
                  value={settings.tablet.logoHeight}
                  onChange={(e) =>
                    handleSettingChange(
                      "tablet",
                      "logoHeight",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="20"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mobile
                </label>
                <input
                  type="number"
                  value={settings.mobile.logoHeight}
                  onChange={(e) =>
                    handleSettingChange(
                      "mobile",
                      "logoHeight",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="20"
                  max="100"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Height in pixels for each device
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Quick Button Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desktop
                </label>
                <input
                  type="number"
                  value={settings.desktop.quickButtonSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "desktop",
                      "quickButtonSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="24"
                  max="80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tablet
                </label>
                <input
                  type="number"
                  value={settings.tablet.quickButtonSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "tablet",
                      "quickButtonSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="24"
                  max="80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mobile
                </label>
                <input
                  type="number"
                  value={settings.mobile.quickButtonSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "mobile",
                      "quickButtonSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="24"
                  max="80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Quick button size in pixels</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Menu Button Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Desktop
                </label>
                <input
                  type="number"
                  value={settings.desktop.menuButtonSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "desktop",
                      "menuButtonSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="24"
                  max="80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Tablet
                </label>
                <input
                  type="number"
                  value={settings.tablet.menuButtonSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "tablet",
                      "menuButtonSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="24"
                  max="80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Mobile
                </label>
                <input
                  type="number"
                  value={settings.mobile.menuButtonSize}
                  onChange={(e) =>
                    handleSettingChange(
                      "mobile",
                      "menuButtonSize",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="40"
                  min="24"
                  max="80"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">Menu button size in pixels</p>
          </div>
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
          <ColorPickerDialog
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
              onChange={(e) => {
                handleGlobalSettingChange("dropShadow", e.target.value);
              }}
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
          <ColorPickerDialog
            label="Background Color"
            color={settings.quickButtonBgColor}
            onChange={(value) => handleColorChange("quickButtonBgColor", value)}
          />

          <ColorPickerDialog
            label="Icon Color"
            color={settings.quickButtonIconColor}
            onChange={(value) =>
              handleColorChange("quickButtonIconColor", value)
            }
          />

          <ColorPickerDialog
            label="Hover Background Color"
            color={settings.quickButtonHoverBgColor}
            onChange={(value) =>
              handleColorChange("quickButtonHoverBgColor", value)
            }
          />

          <ColorPickerDialog
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
              type="number"
              value={settings.quickButtonGap}
              onChange={(e) =>
                handleGlobalSettingChange("quickButtonGap", e.target.value)
              }
              placeholder="8"
              min="0"
              max="32"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
            />
            <p className="text-xs text-gray-500">
              Spacing between quick buttons in pixels
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

        {/* Icon Picker for Menu Button */}
        <div className="mb-6">
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
              type="button"
              className="flex items-center space-x-3 p-4 border-2 border-blue-500 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-all duration-200 group bg-blue-50"
              style={{ borderWidth: "3px" }}
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
                <span className="text-sm text-blue-700 block font-bold">
                  {getSelectedIcon()?.name || "Select Icon"}
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  Click to choose from icon library
                </span>
              </div>
            </button>
          </div>

          {/* Debug indicator */}
          <div className="mt-2 text-xs text-gray-500">
            Icon picker state: {isIconPickerOpen ? "OPEN" : "CLOSED"}
          </div>

          {/* Icon Picker Panel - Full Featured */}
          {isIconPickerOpen &&
            createPortal(
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 999999,
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    width: "100%",
                    maxWidth: "800px",
                    maxHeight: "90vh",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "24px",
                      borderBottom: "1px solid #e5e7eb",
                      background: "linear-gradient(to right, #eff6ff, #dbeafe)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          backgroundColor: "#3b82f6",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "16px",
                        }}
                      >
                        <svg
                          style={{
                            width: "24px",
                            height: "24px",
                            color: "white",
                          }}
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
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: "bold",
                            color: "#1f2937",
                            margin: 0,
                          }}
                        >
                          Select Menu Button Icon
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            margin: "4px 0 0 0",
                          }}
                        >
                          Choose from our icon library
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={closeIconPicker}
                      style={{
                        color: "#9ca3af",
                        background: "none",
                        border: "none",
                        padding: "8px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f3f4f6";
                        e.currentTarget.style.color = "#4b5563";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#9ca3af";
                      }}
                    >
                      <svg
                        style={{ width: "24px", height: "24px" }}
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

                  {/* Search Section */}
                  <div
                    style={{
                      padding: "24px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Search
                    </h5>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          paddingLeft: "16px",
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <svg
                          style={{
                            width: "20px",
                            height: "20px",
                            color: "#9ca3af",
                          }}
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
                        style={{
                          width: "100%",
                          paddingLeft: "48px",
                          paddingRight: "16px",
                          paddingTop: "12px",
                          paddingBottom: "12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "8px",
                          fontSize: "14px",
                          backgroundColor: "white",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Category Section */}
                  <div
                    style={{
                      padding: "24px",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Category
                    </h5>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      <button
                        onClick={() => setIconSearchQuery("")}
                        style={{
                          padding: "8px 16px",
                          fontSize: "14px",
                          borderRadius: "8px",
                          fontWeight: "500",
                          border: "none",
                          cursor: "pointer",
                          backgroundColor:
                            iconSearchQuery === "" ? "#3b82f6" : "#f3f4f6",
                          color: iconSearchQuery === "" ? "white" : "#4b5563",
                          boxShadow:
                            iconSearchQuery === ""
                              ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                              : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (iconSearchQuery !== "") {
                            e.currentTarget.style.backgroundColor = "#e5e7eb";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (iconSearchQuery !== "") {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }
                        }}
                      >
                        All Icons
                      </button>
                      {Array.from(
                        new Set(iconLibrary.map((icon) => icon.category))
                      ).map((category) => (
                        <button
                          key={category}
                          onClick={() => setIconSearchQuery(category)}
                          style={{
                            padding: "8px 16px",
                            fontSize: "14px",
                            borderRadius: "8px",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                            backgroundColor:
                              iconSearchQuery === category
                                ? "#3b82f6"
                                : "#f3f4f6",
                            color:
                              iconSearchQuery === category
                                ? "white"
                                : "#4b5563",
                            boxShadow:
                              iconSearchQuery === category
                                ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                                : "none",
                          }}
                          onMouseEnter={(e) => {
                            if (iconSearchQuery !== category) {
                              e.currentTarget.style.backgroundColor = "#e5e7eb";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (iconSearchQuery !== category) {
                              e.currentTarget.style.backgroundColor = "#f3f4f6";
                            }
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Display Icon Section */}
                  <div
                    style={{
                      padding: "24px",
                      overflowY: "auto",
                      maxHeight: "384px",
                      flex: 1,
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                        margin: "0 0 12px 0",
                      }}
                    >
                      Display Icon
                    </h5>
                    {filteredIcons.length === 0 ? (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "48px 0",
                          color: "#6b7280",
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            margin: "0 auto 16px auto",
                            color: "#d1d5db",
                          }}
                        >
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                        <p
                          style={{
                            fontSize: "18px",
                            fontWeight: "500",
                            color: "#4b5563",
                            margin: "0 0 8px 0",
                          }}
                        >
                          No icons found
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            margin: 0,
                          }}
                        >
                          Try adjusting your search terms or category filter
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Results Count */}
                        <div
                          style={{
                            marginBottom: "16px",
                            fontSize: "14px",
                            color: "#4b5563",
                            backgroundColor: "#f9fafb",
                            padding: "8px 16px",
                            borderRadius: "8px",
                          }}
                        >
                          Showing {filteredIcons.length} of {iconLibrary.length}{" "}
                          icons
                        </div>

                        {/* Icon Grid */}
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fill, minmax(80px, 1fr))",
                            gap: "12px",
                          }}
                        >
                          {filteredIcons.map((icon) => {
                            const IconComponent = icon.icon;
                            return (
                              <button
                                key={icon.id}
                                onClick={() => handleIconSelect(icon.id)}
                                style={{
                                  padding: "16px",
                                  border: "2px solid",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: "8px",
                                  backgroundColor:
                                    settings.menuButtonIconId === icon.id
                                      ? "#eff6ff"
                                      : "white",
                                  borderColor:
                                    settings.menuButtonIconId === icon.id
                                      ? "#3b82f6"
                                      : "#e5e7eb",
                                  boxShadow:
                                    settings.menuButtonIconId === icon.id
                                      ? "0 0 0 3px rgba(59, 130, 246, 0.1)"
                                      : "none",
                                }}
                                onMouseEnter={(e) => {
                                  if (settings.menuButtonIconId !== icon.id) {
                                    e.currentTarget.style.backgroundColor =
                                      "#f0f9ff";
                                    e.currentTarget.style.borderColor =
                                      "#93c5fd";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (settings.menuButtonIconId !== icon.id) {
                                    e.currentTarget.style.backgroundColor =
                                      "white";
                                    e.currentTarget.style.borderColor =
                                      "#e5e7eb";
                                  }
                                }}
                                title={`${icon.name} - ${icon.category}`}
                              >
                                <IconComponent
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    color: "#374151",
                                  }}
                                />
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#4b5563",
                                    textAlign: "center",
                                    fontWeight: "500",
                                  }}
                                >
                                  {icon.name}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      padding: "24px",
                      borderTop: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          color: "#4b5563",
                        }}
                      >
                        💡 Click any icon to select it for your menu button
                      </span>
                      <button
                        onClick={closeIconPicker}
                        style={{
                          padding: "10px 24px",
                          backgroundColor: "#4b5563",
                          color: "white",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#374151";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#4b5563";
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPickerDialog
            label="Background Color"
            color={settings.menuButtonBgColor}
            onChange={(value) => handleColorChange("menuButtonBgColor", value)}
          />

          <ColorPickerDialog
            label="Icon Color"
            color={settings.menuButtonIconColor}
            onChange={(value) =>
              handleColorChange("menuButtonIconColor", value)
            }
          />

          <ColorPickerDialog
            label="Hover Background Color"
            color={settings.menuButtonHoverBgColor}
            onChange={(value) =>
              handleColorChange("menuButtonHoverBgColor", value)
            }
          />

          <ColorPickerDialog
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
      </div>
    </div>
  );
}
