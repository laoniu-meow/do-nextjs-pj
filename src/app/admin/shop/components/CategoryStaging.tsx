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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export interface Category {
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

interface CategoryStagingProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void;
  onEdit?: (
    id: string,
    category: Omit<Category, "id" | "createdAt" | "updatedAt">
  ) => void;
  onDelete?: (id: string) => void;
  categories: Category[];
  editingCategory?: Category | null;
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

export function CategoryStaging({
  open,
  onClose,
  onSave,
  onEdit,
  onDelete,
  categories,
  editingCategory,
  mode,
}: CategoryStagingProps) {
  // Form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string | "">("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or mode changes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && editingCategory) {
        setName(editingCategory.name);
        setSlug(editingCategory.slug);
        setDescription(editingCategory.description || "");
        setParentId(editingCategory.parentId || "");
        setIsActive(editingCategory.isActive);
        setSortOrder(editingCategory.sortOrder);
      } else if (mode === "add") {
        setName("");
        setSlug("");
        setDescription("");
        setParentId("");
        setIsActive(true);
        setSortOrder(0);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [open, mode, editingCategory]);

  // Auto-generate slug when name changes
  useEffect(() => {
    if (name) {
      setSlug(generateSlug(name));
    }
  }, [name]);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // Check for duplicate slug (excluding current category if editing)
    const existingCategory = categories.find(
      (cat) => cat.slug === slug && cat.id !== editingCategory?.id
    );
    if (existingCategory) {
      newErrors.name =
        "A category with this name already exists (would create duplicate slug)";
    }

    // Check for circular reference
    if (parentId && editingCategory) {
      const isCircular = checkCircularReference(editingCategory.id, parentId);
      if (isCircular) {
        newErrors.parentId =
          "Cannot set parent to a child category (would create circular reference)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check for circular reference in parent selection
  const checkCircularReference = (
    categoryId: string,
    newParentId: string
  ): boolean => {
    const visited = new Set<string>();

    const checkParent = (id: string): boolean => {
      if (visited.has(id)) return false;
      visited.add(id);

      const category = categories.find((cat) => cat.id === id);
      if (!category) return false;

      if (category.id === newParentId) return true;
      if (category.parentId) {
        return checkParent(category.parentId);
      }

      return false;
    };

    return checkParent(newParentId);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Always generate slug from name to ensure consistency
      const generatedSlug = generateSlug(name.trim());

      const categoryData = {
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim() || undefined,
        parentId: parentId || null,
        isActive,
        sortOrder,
      };

      if (mode === "edit" && editingCategory && onEdit) {
        await onEdit(editingCategory.id, categoryData);
      } else if (mode === "add") {
        await onSave(categoryData);
      }

      handleClose();
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    if (!editingCategory || !onDelete) return;

    setIsSubmitting(true);
    try {
      await onDelete(editingCategory.id);
      handleClose();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal and reset form
  const handleClose = () => {
    setName("");
    setSlug("");
    setDescription("");
    setParentId("");
    setIsActive(true);
    setSortOrder(0);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  // Get available parent categories (excluding current category and its descendants)
  const getAvailableParentCategories = (): Category[] => {
    if (mode !== "edit" || !editingCategory) {
      return categories.filter((cat) => cat.isActive);
    }

    const excludeIds = new Set<string>();
    const addDescendants = (categoryId: string) => {
      excludeIds.add(categoryId);
      categories
        .filter((cat) => cat.parentId === categoryId)
        .forEach((cat) => addDescendants(cat.id));
    };

    addDescendants(editingCategory.id);
    return categories.filter((cat) => cat.isActive && !excludeIds.has(cat.id));
  };

  // Render different content based on mode
  if (mode === "delete") {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: "error.main", fontWeight: 600 }}>
          🗑️ Delete Category
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action will mark the category for deletion in staging. You can
            restore it before uploading to production.
          </Alert>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete the category &ldquo;
            {editingCategory?.name}&rdquo;?
          </Typography>
          {editingCategory && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {editingCategory.name}
              </Typography>
              {editingCategory.description && (
                <Typography variant="body2" color="text.secondary">
                  Description: {editingCategory.description}
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
          {mode === "edit" ? "✏️ Edit Category" : "➕ Add New Category"}
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
            minRows={3}
            maxRows={5}
            disabled={isSubmitting}
          />

          {/* Parent Category and Sort Order Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth error={!!errors.parentId}>
              <InputLabel id="parent-category-label">
                Parent Category
              </InputLabel>
              <Select
                labelId="parent-category-label"
                label="Parent Category"
                value={parentId}
                onChange={(e) => setParentId(e.target.value as string)}
                disabled={isSubmitting}
              >
                <MenuItem value="">
                  <em>No parent (top-level category)</em>
                </MenuItem>
                {getAvailableParentCategories()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
              </Select>
              {errors.parentId && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.parentId}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              fullWidth
              inputProps={{ min: 0 }}
              disabled={isSubmitting}
              helperText="Lower numbers appear first"
            />
          </Box>

          {/* Active Status */}
          <FormControlLabel
            control={
              <Switch
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={isSubmitting}
              />
            }
            label="Active"
          />
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
          disabled={isSubmitting || !name.trim()}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
            ? "Save Changes"
            : "Create Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
