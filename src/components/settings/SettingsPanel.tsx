"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  children: React.ReactNode;
  title?: string;
}

export function SettingsPanel({
  isOpen,
  onClose,
  onApply,
  children,
  title = "Settings Panel",
}: SettingsPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panelDimensions, setPanelDimensions] = useState({
    width: 0,
    height: 0,
  });
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isOpen) {
      // Responsive panel sizing for mobile
      const isMobile = window.innerWidth <= 768;
      const panelWidth = isMobile
        ? Math.min(window.innerWidth - 20, 400)
        : Math.min(600, window.innerWidth - 40);
      const centerX = (window.innerWidth - panelWidth) / 2;
      const centerY = (window.innerHeight - 200) / 2;
      setPosition({
        x: Math.max(0, centerX),
        y: Math.max(0, centerY),
      });

      // Re-center after content renders to get actual panel height
      timer = setTimeout(() => {
        if (panelRef.current) {
          const rect = panelRef.current.getBoundingClientRect();
          const actualHeight = rect.height;
          const actualWidth = rect.width;
          const newCenterX = (window.innerWidth - actualWidth) / 2;
          const newCenterY = (window.innerHeight - actualHeight) / 2;
          setPosition({
            x: Math.max(0, newCenterX),
            y: Math.max(0, newCenterY),
          });
          setPanelDimensions({ width: actualWidth, height: actualHeight });
        }
      }, 150);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("select")
    ) {
      return;
    }
    setIsDragging(true);
    const rect = headerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("select")
    ) {
      return;
    }
    setIsDragging(true);
    const rect = headerRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({
        x: Math.max(
          0,
          Math.min(window.innerWidth - panelDimensions.width, newX)
        ),
        y: Math.max(
          0,
          Math.min(window.innerHeight - panelDimensions.height, newY)
        ),
      });
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const newX = e.touches[0].clientX - dragOffset.x;
      const newY = e.touches[0].clientY - dragOffset.y;
      setPosition({
        x: Math.max(
          0,
          Math.min(window.innerWidth - panelDimensions.width, newX)
        ),
        y: Math.max(
          0,
          Math.min(window.innerHeight - panelDimensions.height, newY)
        ),
      });
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black bg-opacity-50 p-4"
      style={{ zIndex: 99999 }}
    >
      <div
        ref={panelRef}
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all duration-200 ease-out settings-panel"
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          width: "auto",
          minWidth: "500px",
          maxWidth: "90vw",
          maxHeight: "90vh",
          cursor: isDragging ? "grabbing" : "default",
        }}
      >
        {/* Header - Drag Handle */}
        <div
          ref={headerRef}
          className="settings-panel-header"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "16px 16px 0 0",
            padding: "20px 24px",
            borderBottom: "2px solid #2563eb",
            cursor: "grab",
            userSelect: "none",
            boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3 icon-container">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2
                  className="text-xl font-bold text-white"
                  style={{ userSelect: "none" }}
                >
                  {title}
                </h2>
                <p className="text-sm text-white text-opacity-80 mt-1">
                  Drag to move • Click to apply changes
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <Button
                variant="contained"
                onClick={onApply}
                sx={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 25px rgba(16, 185, 129, 0.4)",
                  },
                  minWidth: "44px",
                  width: "44px",
                  height: "44px",
                  padding: 0,
                  boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <CheckIcon sx={{ fontSize: "20px" }} />
              </Button>

              <Button
                variant="contained"
                onClick={onClose}
                sx={{
                  background:
                    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 8px 25px rgba(239, 68, 68, 0.4)",
                  },
                  minWidth: "44px",
                  width: "44px",
                  height: "44px",
                  padding: 0,
                  boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
                  border: "none",
                  borderRadius: "12px",
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <CloseIcon sx={{ fontSize: "20px" }} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="overflow-y-auto design-system"
          style={{
            maxHeight: "calc(90vh - 100px)",
            background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
