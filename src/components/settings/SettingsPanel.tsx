"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Fade,
  Slide,
  Tooltip,
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
  description?: string;
  // Optional: force panel width to match a preview size
  preferredWidth?: "auto" | "mobile" | "tablet" | "desktop";
}

export function SettingsPanel({
  isOpen,
  onClose,
  onApply,
  children,
  title = "Settings",
  description,
  preferredWidth = "auto",
}: SettingsPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [panelDimensions, setPanelDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [panelWidth, setPanelWidth] = useState<number | undefined>(undefined);

  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const dragHandleRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingPositionRef = useRef<{ x: number; y: number } | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isOpen) {
      setIsVisible(true);

      // Responsive panel sizing
      const previewToPx: Record<string, number> = {
        mobile: 360,
        tablet: 768,
        desktop: 1024,
      };
      const baseWidth =
        preferredWidth === "auto"
          ? isMobile
            ? Math.min(window.innerWidth - 32, 480)
            : Math.min(560, window.innerWidth - 64)
          : Math.min(previewToPx[preferredWidth], window.innerWidth - 64);
      setPanelWidth(baseWidth);

      // Position: center on desktop, slightly below the top toggle on mobile
      const centerX = (window.innerWidth - baseWidth) / 2;
      const initialY = isMobile
        ? 104
        : Math.max(32, (window.innerHeight - 600) / 2);

      setPosition({
        x: Math.max(16, centerX),
        y: initialY,
      });

      // Re-center after content renders
      timer = setTimeout(() => {
        if (panelRef.current) {
          const rect = panelRef.current.getBoundingClientRect();
          const actualHeight = rect.height;
          const actualWidth = rect.width;

          const newCenterX = (window.innerWidth - actualWidth) / 2;
          const newCenterY = isMobile
            ? 104
            : Math.max(32, (window.innerHeight - actualHeight) / 2);

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
  }, [isOpen, isMobile, preferredWidth]);

  // Recompute width on window resize to keep preview sizing responsive
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      const previewToPx: Record<string, number> = {
        mobile: 360,
        tablet: 768,
        desktop: 1024,
      };
      const baseWidth =
        preferredWidth === "auto"
          ? isMobile
            ? Math.min(window.innerWidth - 32, 480)
            : Math.min(560, window.innerWidth - 64)
          : Math.min(previewToPx[preferredWidth], window.innerWidth - 64);
      setPanelWidth(baseWidth);
      // recentre horizontally with new width
      const centerX = (window.innerWidth - baseWidth) / 2;
      setPosition((prev) => ({ ...prev, x: Math.max(16, centerX) }));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, isMobile, preferredWidth]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Start dragging only when clicking the drag handle
    if (
      dragHandleRef.current &&
      dragHandleRef.current.contains(e.target as HTMLElement)
    ) {
      e.preventDefault();
      setIsDragging(true);
      const panelRect = panelRef.current?.getBoundingClientRect();
      if (panelRect) {
        // Ensure we have up-to-date dimensions for clamping
        setPanelDimensions({
          width: panelRect.width,
          height: panelRect.height,
        });
        setDragOffset({
          x: e.clientX - panelRect.left,
          y: e.clientY - panelRect.top,
        });
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      const clamped = {
        x: Math.max(
          16,
          Math.min(window.innerWidth - panelDimensions.width - 16, newX)
        ),
        y: Math.max(
          16,
          Math.min(window.innerHeight - panelDimensions.height - 16, newY)
        ),
      };

      pendingPositionRef.current = clamped;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingPositionRef.current) {
            setPosition(pendingPositionRef.current);
          }
          rafRef.current = null;
        });
      }
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Start dragging only when touching the drag handle
    if (
      dragHandleRef.current &&
      dragHandleRef.current.contains(e.target as HTMLElement)
    ) {
      e.preventDefault();
      setIsDragging(true);
      const panelRect = panelRef.current?.getBoundingClientRect();
      if (panelRect) {
        // Ensure we have up-to-date dimensions for clamping
        setPanelDimensions({
          width: panelRect.width,
          height: panelRect.height,
        });
        setDragOffset({
          x: e.touches[0].clientX - panelRect.left,
          y: e.touches[0].clientY - panelRect.top,
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
      const clamped = {
        x: Math.max(
          16,
          Math.min(window.innerWidth - panelDimensions.width - 16, newX)
        ),
        y: Math.max(
          16,
          Math.min(window.innerHeight - panelDimensions.height - 16, newY)
        ),
      };

      pendingPositionRef.current = clamped;
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingPositionRef.current) {
            setPosition(pendingPositionRef.current);
          }
          rafRef.current = null;
        });
      }
    },
    [isDragging, dragOffset, panelDimensions]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingPositionRef.current = null;
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingPositionRef.current = null;
  }, []);

  // Cancel any pending RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pendingPositionRef.current = null;
    };
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
                width: isMobile
                  ? "calc(100% - 32px)"
                  : panelWidth || "clamp(320px, 90vw, 560px)",
                minWidth: "auto",
                maxWidth: isMobile
                  ? "calc(100% - 32px)"
                  : panelWidth || "560px",
                maxHeight: isMobile
                  ? "calc(100dvh - 140px)"
                  : "calc(100vh - 94px)",
                cursor: isDragging ? "grabbing" : "default",
                zIndex: 1000,
                borderRadius: isMobile ? "16px" : "18px",
                overflow: "visible",
                background: "linear-gradient(180deg, #ffffff 0%, #e7efff 100%)",
                border: "1.5px solid #d9e5ff",
                boxShadow: `
                  0 25px 50px -12px rgba(0, 0, 0, 0.15),
                  0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04),
                  0 0 0 1px rgba(255, 255, 255, 0.8) inset
                `,
                transition: isDragging
                  ? "none"
                  : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                pointerEvents: "auto",
                isolation: "isolate",
                transform: "translateZ(0)",
                willChange: "left, top",
                userSelect: isDragging ? "none" : "auto",
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
                    "linear-gradient(135deg, #93c5fd 0%, #818cf8 45%, #60a5fa 100%)",
                  borderBottom: "1px solid #7aa2f8",
                  padding: "0",
                  position: "relative",
                  zIndex: 1001,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "visible",
                  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                  isolation: "isolate",
                }}
              >
                {/* Top Bar: [Icon] [Title + Description] [Apply, Close, Drag] */}
                <Box
                  ref={headerRef}
                  sx={{
                    position: "relative",
                    zIndex: 1002,
                    padding: isMobile ? "12px 16px 10px" : "16px 20px 12px",
                  }}
                >
                  <Box
                    className="settings-panel-header"
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      columnGap: isMobile ? "12px" : "16px",
                      rowGap: isMobile ? "6px" : "8px",
                      background: "transparent",
                      border: "none",
                      borderRadius: 0,
                      p: 0,
                      mb: 0,
                      boxShadow: "none",
                    }}
                  >
                    {/* Icon */}
                    <Box
                      sx={{
                        width: isMobile ? 36 : 40,
                        height: isMobile ? 36 : 40,
                        borderRadius: isMobile ? "10px" : "12px",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #e2e8f0",
                        boxShadow:
                          "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      <SettingsIcon
                        sx={{ color: "#475569", fontSize: isMobile ? 18 : 20 }}
                      />
                    </Box>

                    {/* Title + Description */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0,
                        gap: isMobile ? 0.25 : 0.5,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: "#0f172a",
                          fontWeight: 700,
                          letterSpacing: "-0.02em",
                          lineHeight: 1.25,
                          fontSize: isMobile ? "1.0625rem" : "1.1875rem",
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#64748b",
                          fontSize: isMobile ? "0.8125rem" : "0.875rem",
                          lineHeight: 1.4,
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {description ||
                          "Configure your preferences and settings"}
                      </Typography>
                    </Box>

                    {/* Actions - Apply, Close, Drag & Move */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: isMobile ? "6px" : "8px",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                      }}
                    >
                      <Tooltip title="Apply" arrow>
                        <IconButton
                          aria-label="apply settings"
                          onClick={onApply}
                          sx={{
                            border: "1.5px solid #c7d2fe",
                            color: "#1d4ed8",
                            background:
                              "linear-gradient(180deg,#ffffff 0%,#f0f5ff 100%)",
                            boxShadow: "0 2px 10px rgba(29,78,216,0.12)",
                            "&:hover": { background: "#eef2ff" },
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Close" arrow>
                        <IconButton
                          aria-label="close settings"
                          onClick={onClose}
                          sx={{
                            border: "1.5px solid #e2e8f0",
                            color: "#334155",
                            background:
                              "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
                            boxShadow: "0 2px 8px rgba(15,23,42,0.08)",
                            "&:hover": { background: "#f1f5f9" },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Tooltip>
                      {!isPhone && (
                        <Tooltip title="Drag & Move" arrow>
                          <Box
                            ref={dragHandleRef}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleTouchStart}
                            sx={{ display: "flex", touchAction: "none" }}
                          >
                            <IconButton
                              size={isMobile ? "small" : "medium"}
                              aria-label="drag and move"
                              sx={{
                                border: "1px solid #e2e8f0",
                                background: "#fff",
                                cursor: isDragging ? "grabbing" : "grab",
                                "&:hover": { background: "#f8fafc" },
                              }}
                            >
                              <DragIcon
                                fontSize={isMobile ? "small" : "medium"}
                              />
                            </IconButton>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* Content */}
              <Box
                sx={{
                  padding: isMobile
                    ? "12px 16px calc(env(safe-area-inset-bottom, 0px) + 24px)"
                    : "16px 24px 24px",
                  maxHeight: isMobile
                    ? "calc(100dvh - 220px)"
                    : "calc(100vh - 200px)",
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                  overscrollBehavior: "contain",
                  background:
                    "linear-gradient(180deg, #ffffff 0%, #eef2ff 100%)",
                  borderTop: "1px solid #d9e5ff",
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
