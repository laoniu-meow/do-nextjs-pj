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
  Card,
  CardContent,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { ProductCategoryStaging } from "./ProductCategoryStaging";
import { useProductCategoryStaging } from "@/hooks/useProductCategoryStaging";
import { useCategoryStaging } from "@/hooks/useCategoryStaging";
import type { CreateProductCategoryData } from "@/services/productCategoryService";
import { alpha } from "@mui/material/styles";

export interface ProductCategoryWorkflowRef {
  handleSave: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleRefresh: () => Promise<void>;
}

interface ProductCategoryWorkflowProps {
  onSaveDisabledChange: (disabled: boolean) => void;
  onUploadDisabledChange: (disabled: boolean) => void;
  onMessageChange: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
}

// Type alias for product category data
type ProductCategoryData =
  | CreateProductCategoryData
  | import("@/services/productCategoryService").ProductCategory
  | import("@/services/productCategoryService").ProductCategoryStaging;

const ProductCategoryWorkflow = forwardRef<
  ProductCategoryWorkflowRef,
  ProductCategoryWorkflowProps
>(({ onSaveDisabledChange, onUploadDisabledChange, onMessageChange }, ref) => {
  // Use the product category staging hook
  const {
    stagingProductCategories,
    productionProductCategories,
    loading,
    error,
    success,
    isDirty,
    hasStaging,
    addProductCategory,
    editProductCategory,
    deleteProductCategory,
    saveToStaging,
    uploadToProduction,
    refreshData,
    clearMessages,
  } = useProductCategoryStaging();

  // Use the category staging hook to get available categories
  const { stagingCategories, productionCategories } = useCategoryStaging();

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProductCategory, setEditingProductCategory] =
    useState<ProductCategoryData | null>(null);
  const [deletingProductCategory, setDeletingProductCategory] =
    useState<ProductCategoryData | null>(null);

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

  // Handle add product category
  const handleAddProductCategory = (
    productCategoryData: CreateProductCategoryData
  ) => {
    // Add the new product category directly to staging
    addProductCategory(productCategoryData);
    setIsAddModalOpen(false);
  };

  // Handle edit product category
  const handleEditProductCategory = (
    id: string,
    productCategoryData: CreateProductCategoryData
  ) => {
    // The hook now handles all the logic for production vs staging and change detection
    editProductCategory(id, productCategoryData);
    setIsEditModalOpen(false);
    setEditingProductCategory(null);
  };

  // Handle restore product category
  const handleRestoreProductCategory = (
    productCategory: ProductCategoryData
  ) => {
    // Find the product category to restore
    const productCategoryToRestore = stagingProductCategories.find(
      (cat) =>
        "id" in cat &&
        cat.id === ("id" in productCategory ? productCategory.id : undefined)
    );
    if (productCategoryToRestore) {
      // Remove the isDeleted flag by creating a new staging entry
      addProductCategory({
        name: productCategoryToRestore.name,
        slug: productCategoryToRestore.slug,
        description: productCategoryToRestore.description,
        categoryId:
          "categoryId" in productCategoryToRestore
            ? productCategoryToRestore.categoryId
            : null,
        isActive: productCategoryToRestore.isActive,
        sortOrder: productCategoryToRestore.sortOrder,
      });
    }
  };

  // Handle delete product category
  const handleDeleteProductCategory = (id: string) => {
    // If we're working with production product categories, we need to create a staging entry
    if (
      stagingProductCategories.length === 0 &&
      productionProductCategories.length > 0
    ) {
      const productionProductCategory = productionProductCategories.find(
        (cat) => cat.id === id
      );
      if (productionProductCategory) {
        // Create a staging entry for deletion for this specific product category only
        addProductCategory(
          {
            name: productionProductCategory.name,
            slug: productionProductCategory.slug,
            description: productionProductCategory.description,
            categoryId: productionProductCategory.categoryId,
            isActive: productionProductCategory.isActive,
            sortOrder: productionProductCategory.sortOrder,
          },
          true
        ); // Mark as deleted
      }
    } else {
      // Normal staging deletion
      deleteProductCategory(id);
    }
    setIsDeleteModalOpen(false);
    setDeletingProductCategory(null);
  };

  // Open edit modal
  const openEditModal = (productCategory: ProductCategoryData) => {
    setEditingProductCategory(productCategory);
    setIsEditModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (productCategory: ProductCategoryData) => {
    setDeletingProductCategory(productCategory);
    setIsDeleteModalOpen(true);
  };

  // Get available categories for product categories
  const getAvailableCategories = () => {
    // Use staging categories if available, otherwise use production categories
    return stagingCategories.length > 0
      ? stagingCategories
      : productionCategories;
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
          <Typography variant="h5">Product Category Management</Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
          >
            Add Product Category
          </Button>
        </Box>
      </Box>

      {/* Main Product Categories Table */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product Categories
          </Typography>

          {stagingProductCategories.length === 0 &&
          productionProductCategories.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No product categories added yet. Click &quot;Add Product
              Category&quot; to get started.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Sort Order</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[...stagingProductCategories, ...productionProductCategories]
                    .filter(
                      (productCategory) =>
                        !(
                          "isDeleted" in productCategory &&
                          productCategory.isDeleted
                        )
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((productCategory, index) => {
                      const productCategoryId =
                        "id" in productCategory && productCategory.id
                          ? productCategory.id
                          : `temp-${index}-${
                              productCategory.name
                            }-${Date.now()}`;
                      const categoryName =
                        "categoryId" in productCategory &&
                        productCategory.categoryId
                          ? getAvailableCategories().find(
                              (cat) => cat.id === productCategory.categoryId
                            )?.name || "Unknown Category"
                          : "No Category";

                      return (
                        <TableRow key={productCategoryId} hover>
                          <TableCell sx={{ fontWeight: 500 }}>
                            {productCategory.name}
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontFamily="monospace"
                            >
                              /{productCategory.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {productCategory.description ? (
                              <Typography
                                variant="body2"
                                noWrap
                                sx={{ maxWidth: 200 }}
                              >
                                {productCategory.description}
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
                                productCategory.isActive ? "Active" : "Inactive"
                              }
                              size="small"
                              color={
                                productCategory.isActive ? "success" : "default"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {productCategory.sortOrder}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", gap: 0.5 }}>
                              <IconButton
                                size="small"
                                onClick={() => openEditModal(productCategory)}
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
                                onClick={() => openDeleteModal(productCategory)}
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

      {/* Deleted Product Categories Section */}
      {stagingProductCategories.filter(
        (pc) => "isDeleted" in pc && pc.isDeleted
      ).length > 0 && (
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
              🗑️ Staging Changes - Deleted Product Categories (
              {
                stagingProductCategories.filter(
                  (pc) => "isDeleted" in pc && pc.isDeleted
                ).length
              }
              )
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These product categories are marked for deletion in staging. You
              can restore them before uploading to production.
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "warning.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stagingProductCategories
                    .filter(
                      (productCategory) =>
                        "isDeleted" in productCategory &&
                        productCategory.isDeleted
                    )
                    .map((productCategory, index) => {
                      const productCategoryId =
                        "id" in productCategory && productCategory.id
                          ? productCategory.id
                          : `temp-deleted-${index}-${
                              productCategory.name
                            }-${Date.now()}`;
                      const categoryName =
                        "categoryId" in productCategory &&
                        productCategory.categoryId
                          ? getAvailableCategories().find(
                              (cat) => cat.id === productCategory.categoryId
                            )?.name || "Unknown Category"
                          : "No Category";

                      return (
                        <TableRow key={productCategoryId} hover>
                          <TableCell
                            sx={{
                              fontWeight: 500,
                              textDecoration: "line-through",
                            }}
                          >
                            {productCategory.name}
                          </TableCell>
                          <TableCell sx={{ textDecoration: "line-through" }}>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontFamily="monospace"
                            >
                              /{productCategory.slug}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ textDecoration: "line-through" }}>
                            {productCategory.description || "No description"}
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
                                handleRestoreProductCategory(productCategory)
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

      {/* Add Product Category Modal */}
      <ProductCategoryStaging
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddProductCategory}
        productCategories={
          stagingProductCategories.length > 0
            ? stagingProductCategories
            : productionProductCategories
        }
        categories={getAvailableCategories()}
        mode="add"
      />

      {/* Edit Product Category Modal */}
      {editingProductCategory && (
        <ProductCategoryStaging
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProductCategory(null);
          }}
          onSave={handleAddProductCategory} // Use the same handler for consistency
          onEdit={handleEditProductCategory}
          productCategories={
            stagingProductCategories.length > 0
              ? stagingProductCategories
              : productionProductCategories
          }
          categories={getAvailableCategories()}
          editingProductCategory={{
            id:
              "id" in editingProductCategory
                ? editingProductCategory.id
                : `temp-${Date.now()}-${Math.random()}`,
            name: editingProductCategory.name,
            slug: editingProductCategory.slug,
            description: editingProductCategory.description,
            categoryId:
              "categoryId" in editingProductCategory
                ? editingProductCategory.categoryId
                : null,
            isActive: editingProductCategory.isActive,
            sortOrder: editingProductCategory.sortOrder,
            createdAt:
              "createdAt" in editingProductCategory
                ? editingProductCategory.createdAt
                : new Date(),
            updatedAt:
              "updatedAt" in editingProductCategory
                ? editingProductCategory.updatedAt
                : new Date(),
          }}
          mode="edit"
        />
      )}

      {/* Delete Confirmation Modal */}
      <ProductCategoryStaging
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProductCategory(null);
        }}
        onSave={() => {}} // Dummy function for delete mode
        onDelete={handleDeleteProductCategory}
        productCategories={
          stagingProductCategories.length > 0
            ? stagingProductCategories
            : productionProductCategories
        }
        categories={getAvailableCategories()}
        editingProductCategory={
          deletingProductCategory
            ? {
                id:
                  "id" in deletingProductCategory
                    ? deletingProductCategory.id
                    : `temp-${Date.now()}-${Math.random()}`,
                name: deletingProductCategory.name,
                slug: deletingProductCategory.slug,
                description: deletingProductCategory.description,
                categoryId:
                  "categoryId" in deletingProductCategory
                    ? deletingProductCategory.categoryId
                    : null,
                isActive: deletingProductCategory.isActive,
                sortOrder: deletingProductCategory.sortOrder,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            : null
        }
        mode="delete"
      />
    </Box>
  );
});

ProductCategoryWorkflow.displayName = "ProductCategoryWorkflow";

export default ProductCategoryWorkflow;
