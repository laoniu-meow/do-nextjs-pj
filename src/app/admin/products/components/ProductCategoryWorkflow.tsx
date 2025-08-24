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
  Stack,
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
    // If we have production product categories but no staging, we need to create staging entries
    if (
      stagingProductCategories.length === 0 &&
      productionProductCategories.length > 0
    ) {
      // First, add all production product categories to staging as active
      productionProductCategories.forEach((cat) => {
        addProductCategory({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          categoryId: cat.categoryId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
        });
      });
    }

    // Add the new product category
    addProductCategory(productCategoryData);
    setIsAddModalOpen(false);
  };

  // Handle edit product category
  const handleEditProductCategory = (
    id: string,
    productCategoryData: CreateProductCategoryData
  ) => {
    // If we have production product categories but no staging, we need to create staging entries
    if (
      stagingProductCategories.length === 0 &&
      productionProductCategories.length > 0
    ) {
      // First, add all production product categories to staging as active
      productionProductCategories.forEach((cat) => {
        addProductCategory({
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          categoryId: cat.categoryId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
        });
      });

      // Now find the product category we're editing and update it
      const productCategoryToEdit = productionProductCategories.find(
        (cat) => cat.id === id
      );
      if (productCategoryToEdit) {
        // Find the newly created staging entry and update it
        const newStagingId = `temp-${Date.now()}-${Math.random()}`;
        // We'll use the editProductCategory function after the staging entries are created
        setTimeout(() => {
          editProductCategory(newStagingId, productCategoryData);
        }, 0);
      }
    } else {
      // Normal staging edit
      editProductCategory(id, productCategoryData);
    }

    setIsEditModalOpen(false);
    setEditingProductCategory(null);
  };

  // Handle restore product category
  const handleRestoreProductCategory = (id: string) => {
    // Find the product category to restore
    const productCategoryToRestore = stagingProductCategories.find(
      (cat) => "id" in cat && cat.id === id
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
        // Create a staging entry for deletion
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

  // Render product categories table
  const renderProductCategoriesTable = (
    productCategories: ProductCategoryData[],
    isStaging = false
  ) => {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: isStaging ? "warning.50" : "grey.50" }}>
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
            {productCategories
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((productCategory) => {
                const productCategoryId =
                  "id" in productCategory
                    ? productCategory.id
                    : `temp-${Date.now()}-${Math.random()}`;
                const categoryName =
                  "categoryId" in productCategory && productCategory.categoryId
                    ? getAvailableCategories().find(
                        (cat) => cat.id === productCategory.categoryId
                      )?.name || "Unknown Category"
                    : "No Category";

                return (
                  <TableRow key={productCategoryId} hover>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {isStaging &&
                      "isDeleted" in productCategory &&
                      productCategory.isDeleted ? (
                        <Typography sx={{ textDecoration: "line-through" }}>
                          {productCategory.name}
                        </Typography>
                      ) : (
                        productCategory.name
                      )}
                    </TableCell>
                    <TableCell>
                      {isStaging &&
                      "isDeleted" in productCategory &&
                      productCategory.isDeleted ? (
                        <Typography sx={{ textDecoration: "line-through" }}>
                          /{productCategory.slug}
                        </Typography>
                      ) : (
                        <Typography>/{productCategory.slug}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {isStaging &&
                      "isDeleted" in productCategory &&
                      productCategory.isDeleted ? (
                        <Typography sx={{ textDecoration: "line-through" }}>
                          {productCategory.description || "-"}
                        </Typography>
                      ) : (
                        productCategory.description || "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {isStaging &&
                      "isDeleted" in productCategory &&
                      productCategory.isDeleted ? (
                        <Typography sx={{ textDecoration: "line-through" }}>
                          {categoryName}
                        </Typography>
                      ) : (
                        categoryName
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={productCategory.isActive ? "Active" : "Inactive"}
                        color={productCategory.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {isStaging &&
                      "isDeleted" in productCategory &&
                      productCategory.isDeleted ? (
                        <Typography sx={{ textDecoration: "line-through" }}>
                          {productCategory.sortOrder}
                        </Typography>
                      ) : (
                        productCategory.sortOrder
                      )}
                    </TableCell>
                    <TableCell>
                      {isStaging &&
                      "isDeleted" in productCategory &&
                      productCategory.isDeleted ? (
                        <Button
                          size="small"
                          startIcon={<RestoreIcon />}
                          onClick={() =>
                            handleRestoreProductCategory(productCategoryId)
                          }
                          variant="outlined"
                          color="primary"
                        >
                          Restore
                        </Button>
                      ) : (
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => openEditModal(productCategory)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => openDeleteModal(productCategory)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Product Category Management
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            disabled={loading}
          >
            Add Product Category
          </Button>
        </Stack>
      </Box>

      {/* Product Categories Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Product Categories
          </Typography>

          {stagingProductCategories.length === 0 &&
          productionProductCategories.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No product categories added yet. Click &ldquo;Add Product
              Category&rdquo; to get started.
            </Typography>
          ) : stagingProductCategories.length > 0 ? (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Staging Product Categories (Unsaved Changes)
              </Typography>
              {renderProductCategoriesTable(stagingProductCategories, true)}
            </Box>
          ) : (
            <Box>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1 }}
              >
                Production Product Categories
              </Typography>
              {renderProductCategoriesTable(productionProductCategories, false)}
            </Box>
          )}
        </CardContent>
      </Card>

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
                : `temp-${Date.now()}`,
            name: editingProductCategory.name,
            slug: editingProductCategory.slug,
            description: editingProductCategory.description,
            categoryId: editingProductCategory.categoryId,
            isActive: editingProductCategory.isActive,
            sortOrder: editingProductCategory.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          mode="edit"
        />
      )}

      {/* Delete Product Category Modal */}
      {deletingProductCategory && (
        <ProductCategoryStaging
          open={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProductCategory(null);
          }}
          onDelete={handleDeleteProductCategory}
          productCategories={
            stagingProductCategories.length > 0
              ? stagingProductCategories
              : productionProductCategories
          }
          categories={getAvailableCategories()}
          editingProductCategory={{
            id:
              "id" in deletingProductCategory
                ? deletingProductCategory.id
                : `temp-${Date.now()}`,
            name: deletingProductCategory.name,
            slug: deletingProductCategory.slug,
            description: deletingProductCategory.description,
            categoryId: deletingProductCategory.categoryId,
            isActive: deletingProductCategory.isActive,
            sortOrder: deletingProductCategory.sortOrder,
            createdAt: new Date(),
            updatedAt: new Date(),
          }}
          mode="delete"
          onSave={handleAddProductCategory} // Use the same handler for consistency
        />
      )}
    </Box>
  );
});

ProductCategoryWorkflow.displayName = "ProductCategoryWorkflow";

export default ProductCategoryWorkflow;
