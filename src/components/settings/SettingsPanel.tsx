"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  children?: React.ReactNode;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Center the panel when it opens
      const panelWidth = Math.min(450, window.innerWidth - 40);
      const panelHeight = Math.min(400, window.innerHeight - 40);
      const centerX = (window.innerWidth - panelWidth) / 2;
      const centerY = (window.innerHeight - panelHeight) / 2;
      setPosition({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
      });
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging && panelRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Keep panel within viewport bounds
        const panelWidth =
          panelRef.current.offsetWidth || Math.min(450, window.innerWidth - 40);
        const panelHeight =
          panelRef.current.offsetHeight ||
          Math.min(400, window.innerHeight - 40);
        const maxX = window.innerWidth - panelWidth;
        const maxY = window.innerHeight - panelHeight;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect((): (() => void) | void => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <div
        ref={panelRef}
        className="bg-white shadow-2xl overflow-hidden border-2 border-gray-300"
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          backgroundColor: "white",
          borderRadius: "20px !important",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: Math.min(450, window.innerWidth - 40),
          maxWidth: "calc(100vw - 40px)",
          maxHeight: "calc(100vh - 40px)",
          minWidth: "280px",
          cursor: isDragging ? "grabbing" : "default",
          transform: "none",
        }}
      >
        {/* Header - Drag Handle */}
        <div
          className="px-15 py-6 border-b-2 border-blue-600"
          style={{
            backgroundColor: "#6696f5",
            paddingLeft: "10px",
            paddingRight: "10px",
            borderRadius: "20px !important",
            cursor: "grab",
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h2 className="text-xl font-bold text-white">Settings Panel</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Button
                variant="contained"
                onClick={onApply}
                sx={{
                  backgroundColor: "#10b981",
                  "&:hover": {
                    backgroundColor: "#059669",
                  },
                  minWidth: "32px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  padding: 0,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              >
                <CheckIcon sx={{ fontSize: "16px" }} />
              </Button>
              <Button
                variant="outlined"
                onClick={onClose}
                sx={{
                  borderColor: "#ec4899",
                  color: "#ec4899",
                  backgroundColor: "#fdf2f8",
                  "&:hover": {
                    borderColor: "#be185d",
                    color: "#be185d",
                    backgroundColor: "#fce7f3",
                  },
                  minWidth: "32px",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  padding: 0,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              >
                <CloseIcon sx={{ fontSize: "16px" }} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="px-15 py-6 overflow-y-auto"
          style={{
            paddingLeft: "10px",
            paddingRight: "10px",
            backgroundColor: "#f8fafc",
            minHeight: "150px",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
