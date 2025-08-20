"use client";

import React, { useState, useEffect } from "react";
import { ColorPickerDialog, IconPicker } from "@/components/ui";
import { HeaderSettingsData } from "../types/headerMain";

interface HeaderSettingsFormProps {
  initialSettings: HeaderSettingsData;
  onSettingsChange: (settings: HeaderSettingsData) => void;
}

export function HeaderSettingsForm({
  initialSettings,
  onSettingsChange,
}: HeaderSettingsFormProps) {
  const [settings, setSettings] = useState<HeaderSettingsData>({
    ...initialSettings,
    pageBackgroundColor: initialSettings.pageBackgroundColor || "#ffffff",
  });
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

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

  const handleIconSelect = (icon: { id: string }) => {
    handleGlobalSettingChange("menuButtonIconId", icon.id);
    setIsIconPickerOpen(false);
  };

  const openIconPicker = () => {
    setIsIconPickerOpen(true);
  };

  const closeIconPicker = () => {
    setIsIconPickerOpen(false);
  };

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
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a2 2 0 004 4h4a2 2 0 002-2V5z"
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

      {/* Global Page Settings */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6">
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Global Page Settings
            </h3>
            <p className="text-sm text-gray-600">
              Configure global page appearance
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPickerDialog
            label="Background Color"
            color={settings.pageBackgroundColor || "#ffffff"}
            onChange={(value) =>
              handleColorChange("pageBackgroundColor", value)
            }
          />
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
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
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="text-left">
                <span className="text-sm text-blue-700 block font-bold">
                  Select Icon
                </span>
                <span className="text-xs text-blue-600 font-medium">
                  Click to choose from icon library
                </span>
              </div>
            </button>
          </div>

          {/* Icon Picker */}
          <IconPicker
            open={isIconPickerOpen}
            onClose={closeIconPicker}
            onIconSelect={handleIconSelect}
            selectedIconId={settings.menuButtonIconId}
            title="Select Menu Button Icon"
          />
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
