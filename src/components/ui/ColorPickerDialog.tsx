"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { ChromePicker, ColorResult } from "react-color";
import CloseIcon from "@mui/icons-material/Close";

interface ColorPickerDialogProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ColorPickerDialog({
  color,
  onChange,
  label,
  className = "",
  disabled = false,
  open: controlledOpen,
  onOpenChange,
}: ColorPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);

  // Update local color when prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Handle controlled vs uncontrolled open state
  const isDialogOpen = controlledOpen !== undefined ? controlledOpen : isOpen;
  const setIsDialogOpen = (open: boolean) => {
    if (controlledOpen !== undefined) {
      onOpenChange?.(open);
    } else {
      setIsOpen(open);
    }
  };

  const handleColorChange = (colorResult: ColorResult) => {
    setLocalColor(colorResult.hex);
    // Apply color immediately since we removed the action buttons
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

  const handleOpen = () => {
    if (!disabled) {
      setIsDialogOpen(true);
    }
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    // Reset to original color if there were changes
    if (localColor !== color) {
      setLocalColor(color);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center space-x-3">
        {/* Color Box */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled}
          className={`
            w-12 h-10 rounded-lg border-2 border-gray-300 shadow-sm
            transition-all duration-200 ease-in-out
            hover:border-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed
            ${disabled ? "" : "cursor-pointer"}
          `}
          style={{
            backgroundColor: localColor,
            borderColor: localColor === "#ffffff" ? "#d1d5db" : "transparent",
          }}
          aria-label="Choose color"
        />

        {/* Hex Input */}
        <input
          type="text"
          value={localColor}
          onChange={handleHexInputChange}
          disabled={disabled}
          className={`
            flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm
            font-mono tracking-wider
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-blue-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${disabled ? "cursor-not-allowed" : "cursor-text"}
          `}
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {/* Color Picker Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            minWidth: "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 0.5,
            pt: 1.5,
            px: 2,
          }}
        >
          <Typography variant="h6" component="span">
            Choose Color
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 1, pb: 2, px: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ChromePicker
              color={localColor}
              onChange={handleColorChange}
              disableAlpha={true}
              className="!font-sans"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ColorPickerDialog;
