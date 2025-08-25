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
  Chip,
  IconButton,
  Alert,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Product,
  ProductStaging,
  CreateProductData,
  UpdateProductData,
} from "@/types";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateProductData) => void;
  onEdit?: (id: string, data: UpdateProductData) => void;
  onDelete?: (id: string) => void;
  productTypes: { id: string; name: string }[];
  categories: { id: string; name: string }[];
  editingProduct?: Product | ProductStaging | null;
  mode: "add" | "edit" | "delete";
}

export function ProductModal({
  open,
  onClose,
  onSave,
  onEdit,
  onDelete,
  productTypes,
  categories,
  editingProduct,
  mode,
}: ProductModalProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    productCode: "",
    productName: "",
    description: "",
    productTypeId: "",
    sellingPrice: 0,
    status: "DRAFT",
    categoryId: "",
    tags: [],
    stockLevel: 0,
    reorderPoint: 0,
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or editing product changes
  useEffect(() => {
    if (open) {
      if (editingProduct && mode === "edit") {
        setFormData({
          productCode: editingProduct.productCode,
          productName: editingProduct.productName,
          description: editingProduct.description || "",
          productTypeId: editingProduct.productTypeId,
          sellingPrice: editingProduct.sellingPrice,
          status: editingProduct.status,
          categoryId: editingProduct.categoryId || "",
          tags: editingProduct.tags || [],
          stockLevel: editingProduct.stockLevel,
          reorderPoint: editingProduct.reorderPoint,
        });
      } else {
        setFormData({
          productCode: "",
          productName: "",
          description: "",
          productTypeId: "",
          sellingPrice: 0,
          status: "DRAFT",
          categoryId: "",
          tags: [],
          stockLevel: 0,
          reorderPoint: 0,
        });
      }
      setErrors({});
      setTagInput("");
    }
  }, [open, editingProduct, mode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.productCode.trim()) {
      newErrors.productCode = "Product code is required";
    }

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.productTypeId) {
      newErrors.productTypeId = "Product type is required";
    }

    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = "Selling price must be greater than 0";
    }

    if (formData.stockLevel < 0) {
      newErrors.stockLevel = "Stock level cannot be negative";
    }

    if (formData.reorderPoint < 0) {
      newErrors.reorderPoint = "Reorder point cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    if (mode === "add") {
      onSave(formData);
    } else if (mode === "edit" && editingProduct && onEdit) {
      onEdit(editingProduct.id, formData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editingProduct && onDelete) {
      onDelete(editingProduct.id);
      onClose();
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Product";
      case "edit":
        return "Edit Product";
      case "delete":
        return "Delete Product";
      default:
        return "Product";
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case "add":
        return "Add Product";
      case "edit":
        return "Update Product";
      case "delete":
        return "Delete Product";
      default:
        return "Submit";
    }
  };

  if (mode === "delete") {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">{getTitle()}</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Are you sure you want to delete this product? This action will only
            disable the product and cannot be undone.
          </Alert>
          <Typography>
            <strong>Product Code:</strong> {editingProduct?.productCode}
          </Typography>
          <Typography>
            <strong>Product Name:</strong> {editingProduct?.productName}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {getSubmitButtonText()}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{getTitle()}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
            mt: 1,
          }}
        >
          {/* Basic Information */}
          <Box>
            <TextField
              fullWidth
              label="Product Code"
              value={formData.productCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productCode: e.target.value,
                }))
              }
              error={!!errors.productCode}
              helperText={errors.productCode}
              required
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.productName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  productName: e.target.value,
                }))
              }
              error={!!errors.productName}
              helperText={errors.productName}
              required
            />
          </Box>
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              multiline
              rows={3}
            />
          </Box>

          {/* Product Type and Category */}
          <Box>
            <FormControl fullWidth required error={!!errors.productTypeId}>
              <InputLabel>Product Type</InputLabel>
              <Select
                value={formData.productTypeId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    productTypeId: e.target.value,
                  }))
                }
                label="Product Type"
              >
                {productTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {errors.productTypeId && (
              <Typography color="error" variant="caption">
                {errors.productTypeId}
              </Typography>
            )}
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                label="Category"
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Pricing */}
          <Box>
            <TextField
              fullWidth
              label="Selling Price"
              type="number"
              value={formData.sellingPrice}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  sellingPrice: parseFloat(e.target.value) || 0,
                }))
              }
              error={!!errors.sellingPrice}
              helperText={errors.sellingPrice}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as "ACTIVE" | "INACTIVE" | "DRAFT",
                  }))
                }
                label="Status"
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Inventory */}
          <Box>
            <TextField
              fullWidth
              label="Stock Level"
              type="number"
              value={formData.stockLevel}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  stockLevel: parseInt(e.target.value) || 0,
                }))
              }
              error={!!errors.stockLevel}
              helperText={errors.stockLevel}
              inputProps={{ min: 0 }}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              label="Reorder Point"
              type="number"
              value={formData.reorderPoint}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reorderPoint: parseInt(e.target.value) || 0,
                }))
              }
              error={!!errors.reorderPoint}
              helperText={errors.reorderPoint}
              inputProps={{ min: 0 }}
            />
          </Box>

          {/* Tags */}
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <TextField
                size="small"
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="outlined" onClick={handleAddTag}>
                Add
              </Button>
            </Box>
            <Box display="flex" gap={1} flexWrap="wrap">
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
          </Box>

          {/* Note about suppliers */}
          <Box sx={{ gridColumn: { xs: "1", md: "1 / -1" } }}>
            <Alert severity="info">
              Suppliers will be managed separately after the product is created.
              You can assign up to 5 suppliers with individual cost prices.
            </Alert>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {getSubmitButtonText()}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
