"use client";

import React from "react";
import { Button, ButtonProps } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface PillButtonProps extends Omit<ButtonProps, "children" | "variant"> {
  label: string;
  icon?: React.ReactNode;
  variant?: "contained" | "outlined" | "text";
}

export default function PillButton({
  label,
  icon = <AddIcon />,
  variant = "contained",
  sx,
  ...props
}: PillButtonProps) {
  return (
    <Button
      variant={variant}
      startIcon={icon}
      sx={{
        borderRadius: "50px",
        px: 3,
        py: 1.5,
        textTransform: "none",
        fontWeight: 600,
        fontSize: "0.875rem",
        minHeight: "48px",
        ...sx,
      }}
      {...props}
    >
      {label}
    </Button>
  );
}
