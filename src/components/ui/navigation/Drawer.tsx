"use client";

/* eslint-disable security/detect-object-injection */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";

// Drawer Context
interface DrawerContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  position: DrawerPosition;
  size: DrawerSize;
  closeOnOverlayClick: boolean;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

// Types
type DrawerPosition = "left" | "right" | "top" | "bottom";
type DrawerSize = "sm" | "md" | "lg" | "full";

// Drawer Root Component
interface DrawerRootProps {
  children: React.ReactNode;
  position?: DrawerPosition;
  size?: DrawerSize;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
}

export function Drawer({
  children,
  position = "left",
  size = "md",
  defaultOpen = false,
  onOpenChange,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  preventScroll = true,
}: DrawerRootProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { isMobile } = useResponsive();

  const open = useCallback(() => {
    setIsOpen(true);
    onOpenChange?.(true);
  }, [onOpenChange]);

  const close = useCallback(() => {
    setIsOpen(false);
    onOpenChange?.(false);
  }, [onOpenChange]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    onOpenChange?.(!isOpen);
  }, [isOpen, onOpenChange]);

  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeOnEscape, isOpen, close]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (!preventScroll) return;

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, preventScroll]);

  // Responsive adjustments
  const responsivePosition =
    isMobile && (position === "left" || position === "right")
      ? "bottom"
      : position;
  const responsiveSize = isMobile && size === "full" ? "lg" : size;

  const contextValue: DrawerContextType = {
    isOpen,
    open,
    close,
    toggle,
    position: responsivePosition,
    size: responsiveSize,
    closeOnOverlayClick,
  };

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
    </DrawerContext.Provider>
  );
}

// Hook to use drawer context
function useDrawer() {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a Drawer component");
  }
  return context;
}

// Drawer Trigger Component
interface DrawerTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

export function DrawerTrigger({
  children,
  asChild = false,
  className,
}: DrawerTriggerProps) {
  const { open } = useDrawer();

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      onClick?: (e: React.MouseEvent) => void;
    };

    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        open();
        if (childProps.onClick) {
          childProps.onClick(e);
        }
      },
    } as React.ComponentProps<React.ElementType>);
  }

  return (
    <button
      type="button"
      onClick={open}
      className={cn("drawer-trigger", className)}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}

// Drawer Content Component
interface DrawerContentProps {
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export function DrawerContent({
  children,
  className,
  overlayClassName,
  contentClassName,
}: DrawerContentProps) {
  const { isOpen, close, position, size, closeOnOverlayClick } = useDrawer();

  // Don't render if not open
  if (!isOpen) return null;

  // Get position styles
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: "fixed",
      zIndex: 50,
      backgroundColor: "white",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      transition: "all 0.3s ease-in-out",
    };

    const sizeStyles = {
      sm: { width: "300px", height: "400px" },
      md: { width: "400px", height: "600px" },
      lg: { width: "600px", height: "800px" },
      full: { width: "100vw", height: "100vh" },
    };

    switch (position) {
      case "left":
        return {
          ...baseStyles,
          ...sizeStyles[size],
          top: 0,
          left: 0,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          borderRight: "1px solid #e5e7eb",
        };

      case "right":
        return {
          ...baseStyles,
          ...sizeStyles[size],
          top: 0,
          right: 0,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          borderLeft: "1px solid #e5e7eb",
        };

      case "top":
        return {
          ...baseStyles,
          ...sizeStyles[size],
          top: 0,
          left: 0,
          right: 0,
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          borderBottom: "1px solid #e5e7eb",
        };

      case "bottom":
        return {
          ...baseStyles,
          ...sizeStyles[size],
          bottom: 0,
          left: 0,
          right: 0,
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          borderTop: "1px solid #e5e7eb",
        };

      default:
        return baseStyles;
    }
  };

  // Get overlay styles
  const getOverlayStyles = (): React.CSSProperties => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 40,
    opacity: isOpen ? 1 : 0,
    transition: "opacity 0.3s ease-in-out",
  });

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      close();
    }
  };

  // Render portal for better z-index handling
  const drawerContent = (
    <div className={cn("drawer-container", className)}>
      {/* Overlay */}
      <div
        className={cn("drawer-overlay", overlayClassName)}
        style={getOverlayStyles()}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn("drawer-content", contentClassName)}
        style={getPositionStyles()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {children}
      </div>
    </div>
  );

  // Use portal for better positioning
  return createPortal(drawerContent, document.body);
}

// Drawer Header Component
interface DrawerHeaderProps {
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
}

export function DrawerHeader({
  children,
  className,
  showCloseButton = true,
}: DrawerHeaderProps) {
  const { close } = useDrawer();

  return (
    <div className={cn("drawer-header", className)}>
      <div className="drawer-header-content">{children}</div>
      {showCloseButton && (
        <button
          type="button"
          onClick={close}
          className="drawer-close-button"
          aria-label="Close drawer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Drawer Body Component
interface DrawerBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerBody({ children, className }: DrawerBodyProps) {
  return <div className={cn("drawer-body", className)}>{children}</div>;
}

// Drawer Footer Component
interface DrawerFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function DrawerFooter({ children, className }: DrawerFooterProps) {
  return <div className={cn("drawer-footer", className)}>{children}</div>;
}

// Compound component exports
Drawer.Trigger = DrawerTrigger;
Drawer.Content = DrawerContent;
Drawer.Header = DrawerHeader;
Drawer.Body = DrawerBody;
Drawer.Footer = DrawerFooter;

// Export types
export type { DrawerPosition, DrawerSize };
