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
  title?: string;
  showHeader?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  onApply,
  children,
  title = "Settings Panel",
}) => {
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
        : Math.min(500, window.innerWidth - 40);
      const centerX = (window.innerWidth - panelWidth) / 2;
      const centerY = (window.innerHeight - 200) / 2; // Center vertically
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
          const newCenterY = (window.innerHeight - actualHeight) / 2; // Perfect center
          setPosition({
            x: Math.max(0, newCenterX),
            y: Math.max(0, newCenterY),
          });
          // Cache dimensions for smooth dragging
          setPanelDimensions({ width: actualWidth, height: actualHeight });
        }
      }, 150);
    }

    // Return cleanup function that handles both cases
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only allow dragging from the header area, not from buttons
    const target = e.target as HTMLElement;
    const isButton =
      target.closest("button") || target.closest('[role="button"]');

    if (!isButton && headerRef.current?.contains(target)) {
      e.preventDefault();
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only allow dragging from the header area, not from buttons
    const target = e.target as HTMLElement;
    const isButton =
      target.closest("button") || target.closest('[role="button"]');

    if (!isButton && headerRef.current?.contains(target)) {
      e.preventDefault();
      setIsDragging(true);
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect && e.touches[0]) {
        setDragOffset({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Use cached dimensions for smooth dragging
        const panelWidth = panelDimensions.width || 400;
        const panelHeight = panelDimensions.height || 400;
        const maxX = window.innerWidth - panelWidth;
        const maxY = window.innerHeight - panelHeight;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isDragging && e.touches[0]) {
        e.preventDefault();
        const newX = e.touches[0].clientX - dragOffset.x;
        const newY = e.touches[0].clientY - dragOffset.y;

        // Use cached dimensions for smooth dragging
        const panelWidth = panelDimensions.width || 400;
        const panelHeight = panelDimensions.height || 400;
        const maxX = window.innerWidth - panelWidth;
        const maxY = window.innerHeight - panelHeight;

        setPosition({
          x: Math.max(0, Math.min(newX, maxX)),
          y: Math.max(0, Math.min(newY, maxY)),
        });
      }
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleMouseUp);
      };
    }
    // Return empty cleanup function when not dragging
    return () => {};
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

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
          position: "fixed",
          top: position.y,
          left: position.x,
          backgroundColor: "white",
          borderRadius: "8px 8px 8px 8px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width:
            window.innerWidth <= 768
              ? Math.min(window.innerWidth - 20, 400)
              : Math.min(500, window.innerWidth - 40),
          maxWidth:
            window.innerWidth <= 768
              ? "calc(100vw - 20px)"
              : "calc(100vw - 40px)",
          minWidth: window.innerWidth <= 768 ? "280px" : "320px",
          cursor: isDragging ? "grabbing" : "default",
          transform: "none",
          userSelect: isDragging ? "none" : "auto",
          transition: "all 0.3s ease-in-out",
          zIndex: 9999,
        }}
      >
        {/* Header - Drag Handle */}
        <div
          ref={headerRef}
          className="px-15 py-6 border-b-2 border-blue-600"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "8px 8px 0 0",
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "12px",
            paddingBottom: "12px",
            cursor: "grab",
            userSelect: "none",
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
            <h2
              className="text-xl font-bold text-white"
              style={{ userSelect: "none" }}
            >
              {title}
            </h2>
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
                  },
                  minWidth: "36px",
                  width: "36px",
                  height: "36px",
                  padding: 0,
                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                <CheckIcon sx={{ fontSize: "18px" }} />
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
                  },
                  minWidth: "36px",
                  width: "36px",
                  height: "36px",
                  padding: 0,
                  boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                <CloseIcon sx={{ fontSize: "18px" }} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className="px-15 py-6"
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            paddingTop: "16px",
            paddingBottom: "16px",
            backgroundColor: "#ffffff",
            minHeight: "150px",
            maxHeight: "70vh", // Limit height on mobile
            overflowY: "auto", // Enable scrolling
            WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
