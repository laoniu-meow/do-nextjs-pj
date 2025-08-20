"use client";

import React, { useState } from "react";
import { Typography, Alert, Box } from "@mui/material";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { HeaderSettingsData } from "../types/headerMain";

interface ColorSettingsProps {
  onFormDataChange?: (data: Partial<HeaderSettingsData>) => void;
  initialData?: HeaderSettingsData;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({
  onFormDataChange,
  initialData,
}) => {
  const [formData, setFormData] = useState<HeaderSettingsData>({
    desktop: {
      height: 64,
      paddingHorizontal: 16,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    tablet: {
      height: 64,
      paddingHorizontal: 16,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    mobile: {
      height: 64,
      paddingHorizontal: 16,
      logoWidth: 40,
      logoHeight: 40,
      quickButtonSize: 40,
      menuButtonSize: 40,
    },
    backgroundColor: "#ffffff",
    pageBackgroundColor: "#ffffff",
    dropShadow: "medium",
    quickButtonBgColor: "#f3f4f6",
    quickButtonIconColor: "#6b7280",
    quickButtonHoverBgColor: "#e5e7eb",
    quickButtonHoverIconColor: "#374151",
    quickButtonShape: "rounded",
    quickButtonShadow: "light",
    quickButtonGap: "8px",
    menuButtonBgColor: "var(--color-neutral-200)",
    menuButtonIconColor: "var(--color-neutral-700)",
    menuButtonHoverBgColor: "var(--color-neutral-300)",
    menuButtonHoverIconColor: "var(--color-neutral-800)",
    menuButtonIconId: "menu",
    menuButtonShape: "rounded",
    menuButtonShadow: "light",
    ...initialData,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleColorChange = (
    key: keyof Omit<HeaderSettingsData, "desktop" | "tablet" | "mobile">,
    color: string
  ) => {
    const newData = { ...formData, [key]: color };
    setFormData(newData);

    // Validate required color fields
    const requiredColors = [
      "backgroundColor",
      "quickButtonBgColor",
      "quickButtonIconColor",
    ];
    const isValid = requiredColors.every(
      (colorKey) =>
        newData[colorKey as keyof typeof newData] &&
        typeof newData[colorKey as keyof typeof newData] === "string" &&
        newData[colorKey as keyof typeof newData] !== ""
    );
    setIsFormValid(isValid);

    // Pass form data to parent component
    if (onFormDataChange) {
      onFormDataChange({ [key]: color });
    }
  };

  return (
    <div className="space-y-3">
      {/* Form Validation Status */}
      {!isFormValid && (
        <Alert severity="warning" className="mb-3" sx={{ borderRadius: "8px" }}>
          <Typography variant="body2" className="text-sm">
            Please configure all required colors before saving.
          </Typography>
        </Alert>
      )}

      {/* Color Form */}
      <Box component="form" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ColorPicker
            label="Background Color"
            color={formData.backgroundColor}
            onChange={(color) => handleColorChange("backgroundColor", color)}
          />

          <ColorPicker
            label="Quick Button Background"
            color={formData.quickButtonBgColor}
            onChange={(color) => handleColorChange("quickButtonBgColor", color)}
          />

          <ColorPicker
            label="Quick Button Icon Color"
            color={formData.quickButtonIconColor}
            onChange={(color) =>
              handleColorChange("quickButtonIconColor", color)
            }
          />

          <ColorPicker
            label="Quick Button Hover Background"
            color={formData.quickButtonHoverBgColor}
            onChange={(color) =>
              handleColorChange("quickButtonHoverBgColor", color)
            }
          />

          <ColorPicker
            label="Quick Button Hover Icon Color"
            color={formData.quickButtonHoverIconColor}
            onChange={(color) =>
              handleColorChange("quickButtonHoverIconColor", color)
            }
          />

          <ColorPicker
            label="Menu Button Background"
            color={formData.menuButtonBgColor}
            onChange={(color) => handleColorChange("menuButtonBgColor", color)}
          />

          <ColorPicker
            label="Menu Button Icon Color"
            color={formData.menuButtonIconColor}
            onChange={(color) =>
              handleColorChange("menuButtonIconColor", color)
            }
          />

          <ColorPicker
            label="Menu Button Hover Background"
            color={formData.menuButtonHoverBgColor}
            onChange={(color) =>
              handleColorChange("menuButtonHoverBgColor", color)
            }
          />

          <ColorPicker
            label="Menu Button Hover Icon Color"
            color={formData.menuButtonHoverIconColor}
            onChange={(color) =>
              handleColorChange("menuButtonHoverIconColor", color)
            }
          />
        </div>
      </Box>
    </div>
  );
};
