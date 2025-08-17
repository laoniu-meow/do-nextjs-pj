"use client";

import React from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { CompanyCreateForm } from "./CompanyCreateForm";
import { CompanyFormData } from "@/types";

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  title?: string;
  initialData?: Partial<CompanyFormData>;
  isLoading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  title = "Add New Company",
  initialData = {},
  isLoading = false,
  maxWidth = "md",
}) => {
  const handleSubmit = async (data: CompanyFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the form component
      throw error;
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#6696f5",
          color: "white",
          borderRadius: "12px 12px 0 0",
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box component="h2" className="text-xl font-bold">
          {title}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ padding: "24px", backgroundColor: "#f8fafc" }}>
        <CompanyCreateForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          initialData={initialData}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

// Alternative version that works with your existing SettingsPanel
export const CompanyFormInSettingsPanel: React.FC<{
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CompanyFormData>;
  isLoading?: boolean;
}> = ({ onSubmit, onCancel, initialData, isLoading }) => {
  const handleSubmit = async (data: CompanyFormData) => {
    try {
      await onSubmit(data);
      onCancel();
    } catch (error) {
      throw error;
    }
  };

  return (
    <CompanyCreateForm
      onSubmit={handleSubmit}
      onCancel={onCancel}
      initialData={initialData}
      isLoading={isLoading}
    />
  );
};
