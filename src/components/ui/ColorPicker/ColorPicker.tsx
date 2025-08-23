"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { Box, TextField, IconButton, Popover } from "@mui/material";
import { Typography } from "@/components/ui";
import { Close as CloseIcon } from "@mui/icons-material";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  size?: "small" | "medium" | "large";
}

export function ColorPicker({
  color,
  onChange,
  label,
  className = "",
  disabled = false,
  size = "medium",
}: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  // Update local color when prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Handle click outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen]);

  const handleColorChange = (colorResult: ColorResult) => {
    setLocalColor(colorResult.hex);
    onChange(colorResult.hex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalColor(value);

    // Only update parent if it's a valid hex color
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      onChange(value);
    }
  };

  const handleHexInputBlur = () => {
    // Ensure the color is valid on blur
    if (!/^#[0-9A-Fa-f]{6}$/.test(localColor)) {
      setLocalColor(color);
    }
  };

  const togglePicker = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return { width: 40, height: 32 };
      case "large":
        return { width: 56, height: 48 };
      default:
        return { width: 48, height: 40 };
    }
  };

  return (
    <Box className={`space-y-2 ${className}`}>
      {label && (
        <Typography variant="body2" fontWeight="500" color="text.primary">
          {label}
        </Typography>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {/* Color Box */}
        <IconButton
          ref={anchorRef}
          onClick={togglePicker}
          disabled={disabled}
          sx={{
            ...getSizeStyles(),
            p: 0,
            border: 2,
            borderColor: localColor === "#ffffff" ? "divider" : "transparent",
            backgroundColor: localColor,
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: localColor,
            },
            "&:focus": {
              borderColor: "primary.main",
              outline: "none",
            },
          }}
          aria-label="Choose color"
        />

        {/* Hex Input */}
        <TextField
          size="small"
          value={localColor}
          onChange={handleHexInputChange}
          onBlur={handleHexInputBlur}
          disabled={disabled}
          placeholder="#000000"
          inputProps={{
            maxLength: 7,
            style: {
              fontFamily: "monospace",
              letterSpacing: "0.1em",
            },
          }}
          sx={{
            minWidth: 120,
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
          }}
        />
      </Box>

      {/* Color Picker Popover */}
      <Popover
        open={isOpen}
        anchorEl={anchorRef.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              boxShadow: 3,
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <Box sx={{ p: 2, position: "relative" }}>
          {/* Close Button */}
          <IconButton
            size="small"
            onClick={() => setIsOpen(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.secondary",
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Color Picker */}
          <ChromePicker
            color={localColor}
            onChange={handleColorChange}
            disableAlpha={true}
          />
        </Box>
      </Popover>
    </Box>
  );
}
