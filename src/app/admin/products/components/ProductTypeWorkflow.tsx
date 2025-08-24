"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useProductTypeStaging } from "@/hooks/useProductTypeStaging";
import { useProductCategoryStaging } from "@/hooks/useProductCategoryStaging";
import { ProductTypeModal } from "./ProductTypeModal";
import { ProductType, ProductTypeStaging } from "@/types";
import { alpha } from "@mui/material/styles";
import { Restore as RestoreIcon } from "@mui/icons-material";
import { CreateProductTypeData, UpdateProductTypeData } from "@/types";

export interface ProductTypeWorkflowRef {
  handleSave: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleRefresh: () => Promise<void>;
}

interface ProductTypeWorkflowProps {
  onSaveDisabledChange: (disabled: boolean) => void;
  onUploadDisabledChange: (disabled: boolean) => void;
  onMessageChange: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
}

const ProductTypeWorkflow = forwardRef<
  ProductTypeWorkflowRef,
  ProductTypeWorkflowProps
>(({ onSaveDisabledChange, onUploadDisabledChange, onMessageChange }, ref) => {
  // Use the product type staging hook
  const {
    stagingProductTypes,
    productionProductTypes,
    loading,
    error,
    success,
    isDirty,
    hasStaging,
    addProductType,
    editProductType,
    deleteProductType,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
  } = useProductTypeStaging();

  // Use the product category staging hook to get available product categories
  const { stagingProductCategories, productionProductCategories } =
    useProductCategoryStaging();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProductType, setEditingProductType] = useState<
    ProductType | ProductTypeStaging | null
  >(null);
  const [deletingProductType, setDeletingProductType] = useState<
    ProductType | ProductTypeStaging | null
  >(null);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleSave: saveToStaging,
    handleUpload: uploadToProduction,
    handleRefresh: refreshData,
  }));

  // Update parent component state
  useEffect(() => {
    onSaveDisabledChange(!isDirty);
    onUploadDisabledChange(!hasStaging);
  }, [isDirty, hasStaging, onSaveDisabledChange, onUploadDisabledChange]);

  // Handle messages
  useEffect(() => {
    if (error) {
      onMessageChange({ type: "error", text: error });
      clearMessages();
    }
  }, [error, onMessageChange, clearMessages]);

  useEffect(() => {
    if (success) {
      onMessageChange({ type: "success", text: success });
      clearMessages();
    }
  }, [success, onMessageChange, clearMessages]);

  // Handle add product type
  const handleAddProductType = (productTypeData: CreateProductTypeData) => {
    addProductType(productTypeData);
    setIsAddModalOpen(false);
  };

  // Handle edit product type
  const handleEditProductType = (
    id: string,
    productTypeData: UpdateProductTypeData
  ) => {
    editProductType(id, productTypeData);
    setIsEditModalOpen(false);
    setEditingProductType(null);
  };

  // Handle delete product type
  const handleDeleteProductType = (id: string) => {
    deleteProductType(id);
    setIsDeleteModalOpen(false);
    setDeletingProductType(null);
  };

  // Handle restore product type
  const handleRestoreProductType = (
    productType: ProductType | ProductTypeStaging
  ) => {
    editProductType(productType.id, { isDeleted: false });
  };

  // Handle edit button click
  const handleEditClick = (productType: ProductType | ProductTypeStaging) => {
    setEditingProductType(productType);
    setIsEditModalOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (productType: ProductType | ProductTypeStaging) => {
    setDeletingProductType(productType);
    setIsDeleteModalOpen(true);
  };

  // Get available product categories (combine staging and production)
  const getAvailableProductCategories = () => {
    const allProductCategories = [
      ...stagingProductCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
      })),
      ...productionProductCategories.map((cat) => ({
        id: cat.id,
        name: cat.name,
      })),
    ];

    // Remove duplicates based on ID
    return allProductCategories.filter(
      (cat, index, self) => index === self.findIndex((c) => c.id === cat.id)
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5">Product Type Management</Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
          >
            Add Product Type
          </Button>
        </Box>
      </Box>

      {/* Main Product Types Table */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product Types
          </Typography>

          {stagingProductTypes.length === 0 &&
          productionProductTypes.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No product types added yet. Click &quot;Add Product Type&quot; to
              get started.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Product Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Sort Order</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...stagingProductTypes, ...productionProductTypes]
                    .filter(
                      (productType) =>
                        !("isDeleted" in productType && productType.isDeleted)
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((productType) => {
                      const categoryName = productType.productCategoryId
                        ? getAvailableProductCategories().find(
                            (cat) => cat.id === productType.productCategoryId
                          )?.name || "Unknown Category"
                        : "No Category";

                      return (
                        <TableRow key={productType.id} hover>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {productType.name}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontFamily="monospace"
                            >
                              /{productType.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {productType.description ? (
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ maxWidth: 200 }}
                              >
                                {productType.description}
                              </Typography>
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No description
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={categoryName}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                productType.isActive ? "Active" : "Inactive"
                              }
                              size="small"
                              color={
                                productType.isActive ? "success" : "default"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {productType.sortOrder}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(productType)}
                                sx={{
                                  mr: 1,
                                  "&:hover": {
                                    bgcolor: (theme) =>
                                      alpha(theme.palette.primary.main, 0.1),
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(productType)}
                                sx={{
                                  "&:hover": {
                                    bgcolor: (theme) =>
                                      alpha(theme.palette.error.main, 0.1),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Deleted Product Types Section */}
      {stagingProductTypes.filter((pt) => "isDeleted" in pt && pt.isDeleted)
        .length > 0 && (
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "warning.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              🗑️ Staging Changes - Deleted Product Types (
              {
                stagingProductTypes.filter(
                  (pt) => "isDeleted" in pt && pt.isDeleted
                ).length
              }
              )
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These product types are marked for deletion in staging. You can
              restore them before uploading to production.
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "warning.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      Product Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stagingProductTypes
                    .filter(
                      (productType) =>
                        "isDeleted" in productType && productType.isDeleted
                    )
                    .map((productType) => {
                      const categoryName = productType.productCategoryId
                        ? getAvailableProductCategories().find(
                            (cat) => cat.id === productType.productCategoryId
                          )?.name || "Unknown Category"
                        : "No Category";

                      return (
                        <TableRow key={productType.id} hover>
                          <TableCell
                            sx={{
                              fontWeight: 500,
                              textDecoration: "line-through",
                            }}
                          >
                            {productType.name}
                          </TableCell>
                          <TableCell sx={{ textDecoration: "line-through" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontFamily="monospace"
                            >
                              /{productType.slug}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textDecoration: "line-through" }}>
                            {productType.description || "No description"}
                          </TableCell>
                          <TableCell sx={{ textDecoration: "line-through" }}>
                            {categoryName}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="warning"
                              size="small"
                              startIcon={<RestoreIcon />}
                              onClick={() =>
                                handleRestoreProductType(productType)
                              }
                            >
                              Restore
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Product Type Modal */}
      <ProductTypeModal
        open={isAddModalOpen || isEditModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setEditingProductType(null);
        }}
        onSave={handleAddProductType}
        onEdit={handleEditProductType}
        productTypes={[...stagingProductTypes, ...productionProductTypes]}
        categories={getAvailableProductCategories()}
        editingProductType={editingProductType}
        mode={isAddModalOpen ? "add" : "edit"}
      />

      {/* Delete Confirmation Modal */}
      <ProductTypeModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProductType(null);
        }}
        onSave={() => {}} // Dummy function for delete mode
        onDelete={handleDeleteProductType}
        productTypes={[...stagingProductTypes, ...productionProductTypes]}
        categories={getAvailableProductCategories()}
        editingProductType={deletingProductType}
        mode="delete"
      />
    </Box>
  );
});

ProductTypeWorkflow.displayName = "ProductTypeWorkflow";

export default ProductTypeWorkflow;
