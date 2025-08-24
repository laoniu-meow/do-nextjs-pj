"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type {
  ProductCategory,
  CreateProductCategoryData,
} from "@/services/productCategoryService";
import type { Category } from "@/services/categoryService";

interface ProductCategoryStagingProps {
  open: boolean;
  onClose: () => void;
  onSave: (productCategory: CreateProductCategoryData) => void;
  onEdit?: (id: string, productCategory: CreateProductCategoryData) => void;
  onDelete?: (id: string) => void;
  productCategories: ProductCategory[];
  categories: Category[];
  editingProductCategory?: ProductCategory | null;
  mode: "add" | "edit" | "delete";
}

function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductCategoryStaging({
  open,
  onClose,
  onSave,
  onEdit,
  onDelete,
  productCategories,
  categories,
  editingProductCategory,
  mode,
}: ProductCategoryStagingProps) {
  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<string | "">("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && editingProductCategory) {
        setName(editingProductCategory.name);
        setSlug(editingProductCategory.slug);
        setDescription(editingProductCategory.description || "");
        setCategoryId(editingProductCategory.categoryId || "");
        setIsActive(editingProductCategory.isActive);
        setSortOrder(editingProductCategory.sortOrder);
      } else if (mode === "add") {
        setName("");
        setSlug("");
        setDescription("");
        setCategoryId("");
        setIsActive(true);
        setSortOrder(0);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, mode, editingProductCategory]);

  // Auto-generate slug when name changes
  useEffect(() => {
    if (name) {
      setSlug(generateSlug(name));
    }
  }, [name]);

  // Get available categories for selection
  const getAvailableCategories = (): Category[] => {
    return categories.filter((category) => category.isActive);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // Check for duplicate slug (excluding current product category if editing)
    const existingProductCategory = productCategories.find(
      (cat) => cat.slug === slug && cat.id !== editingProductCategory?.id
    );
    if (existingProductCategory) {
      newErrors.name =
        "A product category with this name already exists (would create duplicate slug)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Always generate slug from name to ensure consistency
      const generatedSlug = generateSlug(name.trim());

      const productCategoryData = {
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim() || undefined,
        categoryId: categoryId || null,
        isActive,
        sortOrder,
      };

      if (mode === "edit" && editingProductCategory && onEdit) {
        // Check if there are actual changes before calling onEdit
        const hasChanges =
          productCategoryData.name !== editingProductCategory.name ||
          productCategoryData.description !==
            editingProductCategory.description ||
          productCategoryData.categoryId !==
            editingProductCategory.categoryId ||
          productCategoryData.isActive !== editingProductCategory.isActive ||
          productCategoryData.sortOrder !== editingProductCategory.sortOrder;

        if (hasChanges) {
          await onEdit(editingProductCategory.id, productCategoryData);
        } else {
          // No changes detected, closing modal without calling onEdit
        }
      } else if (mode === "add") {
        await onSave(productCategoryData);
      }

      handleClose();
    } catch (error) {
      console.error("Error saving product category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!editingProductCategory || !onDelete) return;

    setIsSubmitting(true);
    try {
      await onDelete(editingProductCategory.id);
      handleClose();
    } catch (error) {
      console.error("Error deleting product category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset form
  const handleClose = () => {
    setName("");
    setSlug("");
    setDescription("");
    setCategoryId("");
    setIsActive(true);
    setSortOrder(0);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Render delete confirmation
  if (mode === "delete") {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
            🗑️ Delete Product Category
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
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will mark the product category for deletion. You can
            restore it before uploading to production.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the product category &ldquo;
            {editingProductCategory?.name}&rdquo;?
          </Typography>
          {editingProductCategory && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {editingProductCategory.name}
              </Typography>
              {editingProductCategory.description && (
                <Typography variant="body2" color="text.secondary">
                  Description: {editingProductCategory.description}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={isSubmitting}
            sx={{ minWidth: 100 }}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

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
          {mode === "edit"
            ? "✏️ Edit Product Category"
            : "➕ Add New Product Category"}
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
          {/* Name Field */}
          <TextField
            label="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name}
            disabled={isSubmitting}
          />

          {/* Auto-generated Slug Display */}
          {name && (
            <Box
              sx={{
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 1,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                gutterBottom
              >
                Auto-generated Slug:
              </Typography>
              <Typography
                variant="body2"
                fontFamily="monospace"
                color="primary.main"
              >
                /{slug}
              </Typography>
            </Box>
          )}

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            disabled={isSubmitting}
          />

          {/* Category */}
          <FormControl fullWidth>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              label="Category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isSubmitting}
              error={!!errors.categoryId}
            >
              <MenuItem value="">
                <em>No category (standalone product category)</em>
              </MenuItem>
              {getAvailableCategories()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
            </Select>
            {errors.categoryId && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.categoryId}
              </Typography>
            )}
          </FormControl>

          {/* Active Status and Sort Order Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={isSubmitting}
                />
              }
              label="Active"
              sx={{ flex: 1 }}
            />
            <TextField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
              disabled={isSubmitting}
              sx={{ flex: 1 }}
              inputProps={{ min: 0 }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting
            ? mode === "edit"
              ? "Saving..."
              : "Creating..."
            : mode === "edit"
            ? "Save Changes"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
