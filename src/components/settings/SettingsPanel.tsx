"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  DragIndicator as DragIcon,
} from "@mui/icons-material";

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
  title = "Settings",
}: SettingsPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panelDimensions, setPanelDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isOpen) {
      setIsVisible(true);

      // Responsive panel sizing
      const panelWidth = isMobile
        ? Math.min(window.innerWidth - 32, 520)
        : Math.min(800, window.innerWidth - 64);

      // Center the panel
      const centerX = (window.innerWidth - panelWidth) / 2;
      const centerY = Math.max(32, (window.innerHeight - 600) / 2);

      setPosition({
        x: Math.max(16, centerX),
        y: centerY,
      });

      // Re-center after content renders
      timer = setTimeout(() => {
        if (panelRef.current) {
          const rect = panelRef.current.getBoundingClientRect();
          const actualHeight = rect.height;
          const actualWidth = rect.width;

          const newCenterX = (window.innerWidth - actualWidth) / 2;
          const newCenterY = Math.max(
            32,
            (window.innerHeight - actualHeight) / 2
          );

          setPosition({
            x: Math.max(16, newCenterX),
            y: newCenterY,
          });
          setPanelDimensions({ width: actualWidth, height: actualHeight });
        }
      }, 200);
    } else {
      setIsVisible(false);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isOpen, isMobile]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle if we're clicking on the draggable area
    if (
      headerRef.current &&
      headerRef.current.contains(e.target as HTMLElement)
    ) {
      setIsDragging(true);
      const rect = headerRef.current.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setPosition({
        x: Math.max(
          16,
          Math.min(window.innerWidth - panelDimensions.width - 16, newX)
        ),
        y: Math.max(
          16,
          Math.min(window.innerHeight - panelDimensions.height - 16, newY)
        ),
      });
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Only handle if we're touching the draggable area
    if (
      headerRef.current &&
      headerRef.current.contains(e.target as HTMLElement)
    ) {
      setIsDragging(true);
      const rect = headerRef.current.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        });
      }
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;

      e.preventDefault();
      const newX = e.touches[0].clientX - dragOffset.x;
      const newY = e.touches[0].clientY - dragOffset.y;
      setPosition({
        x: Math.max(
          16,
          Math.min(window.innerWidth - panelDimensions.width - 16, newX)
        ),
        y: Math.max(
          16,
          Math.min(window.innerHeight - panelDimensions.height - 16, newY)
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

  // Only add event listeners when actually dragging
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
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          zIndex: 999,
          pointerEvents: "none",
          isolation: "isolate",
        }}
      >
        <Box sx={{ pointerEvents: "auto" }}>
          <Slide
            direction="up"
            in={isVisible}
            timeout={400}
            mountOnEnter
            unmountOnExit
          >
            <Paper
              ref={panelRef}
              elevation={0}
              className="settings-panel"
              sx={{
                position: "fixed",
                left: position.x,
                top: position.y,
                width: isMobile ? "calc(100% - 32px)" : "auto",
                minWidth: isMobile ? "auto" : 520,
                maxWidth: isMobile ? "calc(100% - 32px)" : 800,
                maxHeight: isMobile
                  ? "calc(100vh - 80px)"
                  : "calc(100vh - 64px)",
                cursor: isDragging ? "grabbing" : "default",
                zIndex: 1000,
                borderRadius: isMobile ? "20px" : "24px",
                overflow: "hidden",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.15),
                  0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04),
                  0 0 0 1px rgba(255, 255, 255, 0.8) inset
                `,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: "auto",
                isolation: "isolate",
                transform: "translateZ(0)",
                backdropFilter: "blur(20px)",
                "&:hover": {
                  boxShadow: `
                    0 32px 64px -12px rgba(0, 0, 0, 0.2),
                    0 25px 32px -5px rgba(0, 0, 0, 0.15),
                    0 12px 16px -5px rgba(0, 0, 0, 0.08),
                    0 0 0 1px rgba(255, 255, 255, 0.9) inset
                  `,
                  transform: "translateY(-2px) scale(1.005)",
                },
              }}
            >
              {/* Professional Header */}
              <Box
                sx={{
                  background:
                    "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)",
                  borderBottom: "1px solid #e2e8f0",
                  padding: "0",
                  position: "relative",
                  zIndex: 1001,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                  isolation: "isolate",
                }}
              >
                {/* Top Bar - Draggable Area with Icon + Title */}
                <Box
                  ref={headerRef}
                  sx={{
                    cursor: "grab",
                    userSelect: "none",
                    position: "relative",
                    zIndex: 1002,
                    padding: isMobile ? "20px 24px 16px" : "28px 36px 20px",
                    background: "transparent",
                    borderBottom: "none",
                    isolation: "isolate",
                    "&:active": {
                      cursor: "grabbing",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)",
                      borderRadius: "0 0 2px 2px",
                    },
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  {/* Drag Handle Indicator */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: isMobile ? "8px" : "12px",
                      right: isMobile ? "16px" : "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      color: "#64748b",
                      fontSize: isMobile ? "11px" : "12px",
                      fontWeight: 500,
                      background: "rgba(255, 255, 255, 0.9)",
                      padding: isMobile ? "6px 10px" : "8px 12px",
                      borderRadius: "24px",
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                      zIndex: 1003,
                      backdropFilter: "blur(8px)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        background: "rgba(255, 255, 255, 1)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <DragIcon sx={{ fontSize: isMobile ? 12 : 14 }} />
                    <span>Drag to move</span>
                  </Box>

                  {/* Content Area */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: isMobile ? "18px" : "24px",
                      maxWidth: "100%",
                      position: "relative",
                      zIndex: 1004,
                    }}
                  >
                    {/* Settings Icon Container */}
                    <Box
                      sx={{
                        width: isMobile ? 44 : 52,
                        height: isMobile ? 44 : 52,
                        borderRadius: isMobile ? "14px" : "16px",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                        position: "relative",
                        zIndex: 1005,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                          boxShadow:
                            "0 6px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)",
                        },
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: isMobile ? "14px" : "16px",
                          background:
                            "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                        },
                        "&:hover::before": {
                          opacity: 1,
                        },
                      }}
                    >
                      <SettingsIcon
                        sx={{
                          color: "#475569",
                          fontSize: isMobile ? 20 : 24,
                          transition: "color 0.2s ease",
                        }}
                      />
                    </Box>

                    {/* Title Section */}
                    <Box sx={{ flex: 1, minWidth: 0, zIndex: 1006 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#1e293b",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.2,
                          marginBottom: isMobile ? "6px" : "8px",
                          fontSize: isMobile ? "1.25rem" : "1.375rem",
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          fontSize: isMobile ? "0.875rem" : "0.9375rem",
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}
                      >
                        Configure your preferences and settings
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Bottom Bar - Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: isMobile ? "10px" : "14px",
                    padding: isMobile ? "0 24px 20px" : "0 36px 24px",
                    background: "transparent",
                    borderTop: "none",
                    boxShadow: "none",
                    zIndex: 1007,
                    isolation: "isolate",
                  }}
                >
                  {/* Apply Button */}
                  <IconButton
                    onClick={onApply}
                    data-testid="apply-button"
                    sx={{
                      width: isMobile ? 44 : 48,
                      height: isMobile ? 44 : 48,
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      borderRadius: isMobile ? "12px" : "14px",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      boxShadow:
                        "0 4px 12px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      zIndex: 1008,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #059669 0%, #047857 100%)",
                        transform: "translateY(-2px)",
                        boxShadow:
                          "0 6px 20px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    <CheckIcon sx={{ fontSize: isMobile ? 20 : 22 }} />
                  </IconButton>

                  {/* Close Button */}
                  <IconButton
                    onClick={onClose}
                    data-testid="close-button"
                    sx={{
                      width: isMobile ? 44 : 48,
                      height: isMobile ? 44 : 48,
                      background:
                        "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                      color: "#64748b",
                      borderRadius: isMobile ? "12px" : "14px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      zIndex: 1009,
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                        color: "#475569",
                        transform: "translateY(-2px)",
                        boxShadow:
                          "0 6px 16px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 1)",
                      },
                      "&:active": {
                        transform: "translateY(0)",
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Content Area */}
              <Box
                sx={{
                  height: "auto",
                  maxHeight: isMobile
                    ? "calc(90vh - 140px)"
                    : "calc(90vh - 220px)",
                  minHeight: isMobile ? 320 : 420,
                  background:
                    "linear-gradient(135deg, #fafbfc 0%, #f8fafc 100%)",
                  padding: isMobile ? "24px" : "36px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  scrollbarWidth: "thin",
                  scrollbarColor: "#cbd5e1 #f1f5f9",
                  "&::-webkit-scrollbar": {
                    width: "10px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#f1f5f9",
                    borderRadius: "8px",
                    margin: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background:
                      "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)",
                    borderRadius: "6px",
                    border: "2px solid #f1f5f9",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
                    },
                  },
                  position: "relative",
                }}
              >
                {children}
              </Box>
            </Paper>
          </Slide>
        </Box>
      </Box>
    </Fade>
  );
}
