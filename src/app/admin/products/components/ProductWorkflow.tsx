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
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useProduct } from "@/hooks/useProduct";
import { useProductTypeStaging } from "@/hooks/useProductTypeStaging";
import { useProductCategoryStaging } from "@/hooks/useProductCategoryStaging";
import { ProductModal } from "./ProductModal";
import { Product, ProductStaging } from "@/types";
import { CreateProductData, UpdateProductData } from "@/types";

export interface ProductWorkflowRef {
  handleSave: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleRefresh: () => Promise<void>;
}

interface ProductWorkflowProps {
  onSaveDisabledChange: (disabled: boolean) => void;
  onUploadDisabledChange: (disabled: boolean) => void;
  onMessageChange: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
}

const ProductWorkflow = forwardRef<ProductWorkflowRef, ProductWorkflowProps>(
  ({ onSaveDisabledChange, onUploadDisabledChange, onMessageChange }, ref) => {
    // Use the product staging hook
    const {
      stagingProducts,
      productionProducts,
      loading,
      error,
      success,
      isDirty,
      hasStaging,
      addProduct,
      editProduct,
      deleteProduct,
      saveToStaging,
      uploadToProduction,
      refreshData,
      clearMessages,
    } = useProduct();

    // Use the product type staging hook to get available product types
    const { stagingProductTypes, productionProductTypes } =
      useProductTypeStaging();

    // Use the product category staging hook to get available product categories
    const { stagingProductCategories, productionProductCategories } =
      useProductCategoryStaging();

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<
      Product | ProductStaging | null
    >(null);
    const [deletingProduct, setDeletingProduct] = useState<
      Product | ProductStaging | null
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

    // Handle add product
    const handleAddProduct = (productData: CreateProductData) => {
      addProduct(productData);
      setIsAddModalOpen(false);
    };

    // Handle edit product
    const handleEditProduct = (id: string, productData: UpdateProductData) => {
      editProduct(id, productData);
      setIsEditModalOpen(false);
      setEditingProduct(null);
    };

    // Handle delete product
    const handleDeleteProduct = (id: string) => {
      deleteProduct(id);
      setIsDeleteModalOpen(false);
      setDeletingProduct(null);
    };

    // Open edit modal
    const openEditModal = (product: Product | ProductStaging) => {
      setEditingProduct(product);
      setIsEditModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (product: Product | ProductStaging) => {
      setDeletingProduct(product);
      setIsDeleteModalOpen(true);
    };

    // Get available product types (staging first, then production)
    const getAvailableProductTypes = () => {
      const types =
        stagingProductTypes.length > 0
          ? stagingProductTypes
          : productionProductTypes;
      return types.map((type) => ({ id: type.id, name: type.name }));
    };

    // Get available product categories (staging first, then production)
    const getAvailableProductCategories = () => {
      const categories =
        stagingProductCategories.length > 0
          ? stagingProductCategories
          : productionProductCategories;
      return categories.map((category) => ({
        id: category.id,
        name: category.name,
      }));
    };

    // Get status color
    const getStatusColor = (status: string) => {
      switch (status) {
        case "ACTIVE":
          return "success";
        case "INACTIVE":
          return "error";
        case "DRAFT":
          return "warning";
        default:
          return "default";
      }
    };

    // Get status display text
    const getStatusText = (status: string) => {
      switch (status) {
        case "ACTIVE":
          return "Active";
        case "INACTIVE":
          return "Inactive";
        case "DRAFT":
          return "Draft";
        default:
          return status;
      }
    };

    // Format price
    const formatPrice = (price: number) => {
      return `$${price.toFixed(2)}`;
    };

    return (
      <Box>
        {/* Header with action buttons */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Product Management</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Product
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Products {hasStaging && "(Staging)"}
            </Typography>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Code</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Selling Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Stock Level</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(hasStaging ? stagingProducts : productionProducts).map(
                    (product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {product.productCode}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {product.productName}
                          </Typography>
                          {product.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.description}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {product.productType?.name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {product.category?.name || "None"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {formatPrice(product.sellingPrice)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(product.status)}
                            color={
                              getStatusColor(product.status) as
                                | "success"
                                | "error"
                                | "warning"
                                | "default"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {product.stockLevel}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5} flexWrap="wrap">
                            {product.tags.slice(0, 3).map((tag) => (
                              <Chip
                                key={tag}
                                label={tag}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                            {product.tags.length > 3 && (
                              <Chip
                                label={`+${product.tags.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" gap={0.5}>
                            <IconButton
                              size="small"
                              onClick={() => openEditModal(product)}
                              sx={{
                                color: "primary.main",
                                "&:hover": {
                                  backgroundColor: alpha("primary.main", 0.1),
                                },
                              }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteModal(product)}
                              sx={{
                                color: "error.main",
                                "&:hover": {
                                  backgroundColor: alpha("error.main", 0.1),
                                },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  )}
                  {(hasStaging ? stagingProducts : productionProducts)
                    .length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          py={4}
                        >
                          {loading
                            ? "Loading products..."
                            : "No products found"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add Product Modal */}
        <ProductModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
          productTypes={getAvailableProductTypes()}
          categories={getAvailableProductCategories()}
          mode="add"
        />

        {/* Edit Product Modal */}
        <ProductModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingProduct(null);
          }}
          onSave={() => {}} // Required prop, but not used in edit mode
          onEdit={handleEditProduct}
          productTypes={getAvailableProductTypes()}
          categories={getAvailableProductCategories()}
          editingProduct={editingProduct}
          mode="edit"
        />

        {/* Delete Product Modal */}
        <ProductModal
          open={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingProduct(null);
          }}
          onSave={() => {}} // Required prop, but not used in delete mode
          onDelete={handleDeleteProduct}
          productTypes={getAvailableProductTypes()}
          categories={getAvailableProductCategories()}
          editingProduct={deletingProduct}
          mode="delete"
        />
      </Box>
    );
  }
);

ProductWorkflow.displayName = "ProductWorkflow";

export default ProductWorkflow;
