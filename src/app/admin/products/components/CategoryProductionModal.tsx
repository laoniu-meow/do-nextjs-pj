"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Button,
  Alert,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";

export interface CategoryProduction {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CategoryProductionProps {
  open: boolean;
  onClose: () => void;
  onViewStaging?: (categoryId: string) => void;
  categories: CategoryProduction[];
  viewingCategory?: CategoryProduction | null;
  mode: "view" | "compare";
}

export function CategoryProduction({
  open,
  onClose,
  onViewStaging,
  categories,
  viewingCategory,
  mode,
}: CategoryProductionProps) {
  // Form state (read-only for production)
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | "">("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Reset form when modal opens/closes or viewing category changes
  useEffect(() => {
    if (open && viewingCategory) {
      setName(viewingCategory.name);
      setSlug(viewingCategory.slug);
      setDescription(viewingCategory.description || "");
      setParentId(viewingCategory.parentId || "");
      setIsActive(viewingCategory.isActive);
      setSortOrder(viewingCategory.sortOrder);
    }
  }, [open, viewingCategory]);

  // Close modal and reset form
  const handleClose = () => {
    setName("");
    setSlug("");
    setDescription("");
    setParentId("");
    setIsActive(true);
    setSortOrder(0);
    onClose();
  };

  // Get parent category name
  const getParentCategoryName = (parentId: string | null): string => {
    if (!parentId) return "No parent (top-level category)";
    const parent = categories.find((cat) => cat.id === parentId);
    return parent ? parent.name : "Unknown parent";
  };

  // Get available parent categories for comparison (currently unused)
  // const getAvailableParentCategories = (): CategoryProduction[] => {
  //   return categories
  //     .filter((cat) => cat.isActive)
  //     .sort((a, b) => a.name.localeCompare(b.name));
  // };

  // Handle view staging
  const handleViewStaging = () => {
    if (viewingCategory && onViewStaging) {
      onViewStaging(viewingCategory.id);
    }
  };

  // Render different content based on mode
  if (mode === "compare") {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            pt: 2,
            px: 3,
          }}
        >
          <Typography variant="h5" component="span" fontWeight="600">
            🔍 Compare Categories
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="body1" color="text.secondary">
              Select categories to compare their configurations and settings.
            </Typography>

            {/* Category Selection */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="category1-label">First Category</InputLabel>
                <Select
                  labelId="category1-label"
                  label="First Category"
                  value=""
                  onChange={() => {}}
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="category2-label">Second Category</InputLabel>
                <Select
                  labelId="category2-label"
                  label="Second Category"
                  value=""
                  onChange={() => {}}
                >
                  <MenuItem value="">
                    <em>Select a category</em>
                  </MenuItem>
                  {categories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {/* Comparison Placeholder */}
            <Box
              sx={{
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 2,
                textAlign: "center",
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Select two categories above to see a detailed comparison
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // View mode (default)
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
          pt: 2,
          px: 3,
        }}
      >
        <Typography variant="h5" component="span" fontWeight="600">
          👁️ View Category
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { backgroundColor: "action.hover" },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Status Chip */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Chip
              label={isActive ? "Active" : "Inactive"}
              color={isActive ? "success" : "default"}
              size="small"
            />
          </Box>

          {/* Name and Slug Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Name"
              value={name}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input.Mui-readOnly": {
                  backgroundColor: "grey.50",
                  color: "text.primary",
                },
              }}
            />
            <TextField
              label="Slug"
              value={slug}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input.Mui-readOnly": {
                  backgroundColor: "grey.50",
                  color: "text.primary",
                },
              }}
            />
          </Box>

          {/* Description */}
          <TextField
            label="Description"
            value={description || "No description provided"}
            fullWidth
            multiline
            minRows={3}
            maxRows={5}
            InputProps={{ readOnly: true }}
            sx={{
              "& .MuiInputBase-input.Mui-readOnly": {
                backgroundColor: "grey.50",
                color: "text.primary",
              },
            }}
          />

          {/* Parent Category and Sort Order Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Parent Category"
              value={getParentCategoryName(parentId)}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input.Mui-readOnly": {
                  backgroundColor: "grey.50",
                  color: "text.primary",
                },
              }}
            />

            <TextField
              label="Sort Order"
              value={sortOrder}
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input.Mui-readOnly": {
                  backgroundColor: "grey.50",
                  color: "text.primary",
                },
              }}
            />
          </Box>

          {/* Active Status */}
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                disabled={true}
                sx={{
                  "& .MuiSwitch-thumb": {
                    backgroundColor: isActive ? "success.main" : "grey.400",
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: isActive ? "success.light" : "grey.300",
                  },
                }}
              />
            }
            label="Active Status"
          />

          {/* Timestamps */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Created At"
              value={
                viewingCategory?.createdAt
                  ? new Date(viewingCategory.createdAt).toLocaleString()
                  : ""
              }
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input.Mui-readOnly": {
                  backgroundColor: "grey.50",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                },
              }}
            />
            <TextField
              label="Last Updated"
              value={
                viewingCategory?.updatedAt
                  ? new Date(viewingCategory.updatedAt).toLocaleString()
                  : ""
              }
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{
                "& .MuiInputBase-input.Mui-readOnly": {
                  backgroundColor: "grey.50",
                  color: "text.secondary",
                  fontSize: "0.875rem",
                },
              }}
            />
          </Box>

          {/* Information Alert */}
          <Alert severity="info" sx={{ mt: 1 }}>
            This is a production category. To make changes, please use the
            staging environment first.
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ minWidth: 100 }}>
          Close
        </Button>
        {onViewStaging && (
          <Button
            onClick={handleViewStaging}
            variant="contained"
            startIcon={<VisibilityIcon />}
            sx={{ minWidth: 120 }}
          >
            View in Staging
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
