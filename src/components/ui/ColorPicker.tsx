"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChromePicker, ColorResult } from "react-color";
import CloseIcon from "@mui/icons-material/Close";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function ColorPicker({
  color,
  onChange,
  label,
  className = "",
  disabled = false,
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localColor, setLocalColor] = useState(color);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Update local color when prop changes
  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // Handle click outside to close picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          ref={buttonRef}
          type="button"
          onClick={togglePicker}
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
          onBlur={handleHexInputBlur}
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

      {/* Color Picker Popup */}
      {isOpen && (
        <div
          ref={pickerRef}
          className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
          style={{
            // Position the picker below the color box
            top: buttonRef.current
              ? buttonRef.current.offsetTop + buttonRef.current.offsetHeight + 8
              : 0,
            left: buttonRef.current ? buttonRef.current.offsetLeft : 0,
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 
                     transition-colors duration-200 rounded-full hover:bg-gray-100"
            aria-label="Close color picker"
          >
            <CloseIcon />
          </button>

          {/* Color Picker */}
          <ChromePicker
            color={localColor}
            onChange={handleColorChange}
            disableAlpha={true}
            className="!font-sans"
          />
        </div>
      )}
    </div>
  );
}

export default ColorPicker;
