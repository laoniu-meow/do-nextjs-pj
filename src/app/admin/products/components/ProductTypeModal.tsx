"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  ProductType,
  ProductTypeStaging,
  CreateProductTypeData,
  UpdateProductTypeData,
} from "@/types";

interface ProductTypeModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateProductTypeData) => void;
  onEdit?: (id: string, data: UpdateProductTypeData) => void;
  onDelete?: (id: string) => void;
  productTypes: (ProductType | ProductTypeStaging)[];
  categories: { id: string; name: string }[];
  editingProductType?: ProductType | ProductTypeStaging | null;
  mode: "add" | "edit" | "delete";
}

export function ProductTypeModal({
  open,
  onClose,
  onSave,
  onEdit,
  onDelete,
  productTypes,
  categories,
  editingProductType,
  mode,
}: ProductTypeModalProps) {
  // Form state
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [productCategoryId, setProductCategoryId] = React.useState<string>("");
  const [isActive, setIsActive] = React.useState(true);
  const [sortOrder, setSortOrder] = React.useState(0);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    if (open) {
      if (mode === "edit" && editingProductType) {
        setName(editingProductType.name);
        setDescription(editingProductType.description || "");
        setProductCategoryId(editingProductType.productCategoryId || "");
        setIsActive(editingProductType.isActive);
        setSortOrder(editingProductType.sortOrder);
      } else {
        setName("");
        setDescription("");
        setProductCategoryId("");
        setIsActive(true);
        setSortOrder(0);
      }
      setErrors({});
    }
  }, [open, mode, editingProductType]);

  // Auto-generate slug from name
  const generateSlug = (input: string): string => {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!productCategoryId) {
      newErrors.productCategoryId = "Product Category is required";
    }

    // Check for duplicate slug within the same category
    const slug = generateSlug(name);
    const hasDuplicate = productTypes.some(
      (pt) =>
        pt.id !== editingProductType?.id &&
        generateSlug(pt.name) === slug &&
        pt.productCategoryId === productCategoryId
    );

    if (hasDuplicate) {
      newErrors.name =
        "A product type with this name already exists in the selected category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formData = {
        name: name.trim(),
        description: description.trim() || undefined,
        productCategoryId,
        isActive,
        sortOrder,
      };

      if (mode === "add") {
        onSave(formData);
      } else if (mode === "edit" && editingProductType) {
        onEdit?.(editingProductType.id, formData);
      }

      handleClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Handle delete confirmation
  const handleDelete = () => {
    if (editingProductType && onDelete) {
      onDelete(editingProductType.id);
      handleClose();
    }
  };

  // Render delete confirmation
  if (mode === "delete") {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            color: "error.main",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          🗑️ Delete Product Type
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this product type?
          </Typography>
          {editingProductType && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {editingProductType.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Slug: /{generateSlug(editingProductType.name)}
              </Typography>
              {editingProductType.description && (
                <Typography variant="body2" color="text.secondary">
                  Description: {editingProductType.description}
                </Typography>
              )}
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action will mark the product type for deletion. You can restore
            it before uploading to production.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Delete
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
          {mode === "edit" ? "✏️ Edit Product Type" : "➕ Add New Product Type"}
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
          {/* Name and Slug Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              error={!!errors.name}
              helperText={errors.name || "Product type name"}
              disabled={isSubmitting}
            />
            <TextField
              label="Slug (Auto-generated)"
              value={generateSlug(name)}
              fullWidth
              disabled
              helperText="URL-friendly identifier (auto-generated from name)"
              sx={{ "& .MuiInputBase-input": { color: "text.secondary" } }}
            />
          </Box>

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
            helperText="Optional description for the product type"
          />

          {/* Product Category and Sort Order Row */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl fullWidth error={!!errors.productCategoryId}>
              <InputLabel id="product-category-label">
                Product Category *
              </InputLabel>
              <Select
                labelId="product-category-label"
                label="Product Category *"
                value={productCategoryId}
                onChange={(e) => setProductCategoryId(e.target.value)}
                disabled={isSubmitting}
              >
                <MenuItem value="">
                  <em>Select a product category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.productCategoryId && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  {errors.productCategoryId}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              fullWidth
              disabled={isSubmitting}
              helperText="Display order (lower numbers appear first)"
              inputProps={{ min: 0 }}
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
          disabled={isSubmitting}
          sx={{ minWidth: 100 }}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "edit"
            ? "Save Changes"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
