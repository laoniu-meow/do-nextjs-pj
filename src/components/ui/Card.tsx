"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/useResponsive";
import { Container } from "./Container";

interface CardProps {
  variant?: "default" | "elevated" | "outlined" | "filled" | "bordered";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg";
}

export function Card({
  variant = "default",
  children,
  className,
  onClick,
  hover = false,
  padding = "md",
  shadow = "sm",
}: CardProps) {
  const { isMobile } = useResponsive();

  const getPaddingStyles = () => {
    if (padding === "none") return "";

    switch (padding) {
      case "sm":
        return isMobile ? "p-3" : "p-4";
      case "lg":
        return isMobile ? "p-6" : "p-8";
      case "xl":
        return isMobile ? "p-8" : "p-12";
      default:
        return isMobile ? "p-4" : "p-6";
    }
  };

  // Map Card variants to Container variants
  const getContainerVariant = () => {
    switch (variant) {
      case "elevated":
        return "elevated";
      case "outlined":
        return "bordered";
      case "filled":
        return "filled";
      case "bordered":
        return "bordered";
      default:
        return "card";
    }
  };

  const cardStyles = cn(
    getPaddingStyles(),
    hover && "hover:shadow-md hover:scale-[1.02]",
    onClick && "cursor-pointer",
    className
  );

  const Component = onClick ? "button" : "div";
  const componentProps = onClick ? { onClick, type: "button" as const } : {};

  return (
    <Container
      variant={getContainerVariant()}
      shadow={shadow}
      hover={hover}
      className={cardStyles}
      as={Component}
      {...componentProps}
    >
      {children}
    </Container>
  );
}

// Card Header Component
interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function CardHeader({
  children,
  className,
  align = "left",
}: CardHeaderProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={cn("mb-4", alignClasses[align], className)}>{children}</div>
  );
}

// Card Body Component
interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function CardBody({ children, className }: CardBodyProps) {
  return <div className={cn("", className)}>{children}</div>;
}

// Card Footer Component
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
}

export function CardFooter({
  children,
  className,
  align = "left",
}: CardFooterProps) {
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-gray-200 flex",
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// Compound component exports
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
