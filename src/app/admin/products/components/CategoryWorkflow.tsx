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
import { CategoryStaging as CategoryStagingModal } from "./CategoryStaging";
import { useCategoryStaging } from "@/hooks/useCategoryStaging";
import type {
  CreateCategoryData,
  Category,
  CategoryStaging as CategoryStagingType,
} from "@/services/categoryService";
import { alpha } from "@mui/material/styles";

// Type alias for category data
type CategoryData = CreateCategoryData | Category | CategoryStagingType;

export interface CategoryWorkflowRef {
  handleSave: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleRefresh: () => Promise<void>;
}

interface CategoryWorkflowProps {
  onSaveDisabledChange: (disabled: boolean) => void;
  onUploadDisabledChange: (disabled: boolean) => void;
  onMessageChange: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
}

const CategoryWorkflow = forwardRef<CategoryWorkflowRef, CategoryWorkflowProps>(
  ({ onSaveDisabledChange, onUploadDisabledChange, onMessageChange }, ref) => {
    // Use the category staging hook
    const {
      stagingCategories,
      productionCategories,
      loading,
      error,
      success,
      isDirty,
      hasStaging,
      addCategory,
      editCategory,
      deleteCategory,
      saveToStaging,
      uploadToProduction,
      refreshData,
      clearMessages,
    } = useCategoryStaging();

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(
      null
    );
    const [deletingCategory, setDeletingCategory] =
      useState<CategoryData | null>(null);

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

    // Handle add category
    const handleAddCategory = (categoryData: CreateCategoryData) => {
      // Add the new category directly to staging
      addCategory(categoryData);
      setIsAddModalOpen(false);
    };

    // Handle edit category
    const handleEditCategory = (
      id: string,
      categoryData: CreateCategoryData
    ) => {
      // The hook now handles all the logic for production vs staging and change detection
      editCategory(id, categoryData);
      setIsEditModalOpen(false);
      setEditingCategory(null);
    };

    // Handle restore category
    const handleRestoreCategory = (category: CategoryData) => {
      // Find the category to restore
      const categoryToRestore = stagingCategories.find(
        (cat) =>
          "id" in cat && cat.id === ("id" in category ? category.id : undefined)
      );
      if (categoryToRestore) {
        // Remove the isDeleted flag by creating a new staging entry
        addCategory({
          name: categoryToRestore.name,
          slug: categoryToRestore.slug,
          description: categoryToRestore.description,
          parentId: categoryToRestore.parentId,
          isActive: categoryToRestore.isActive,
          sortOrder: categoryToRestore.sortOrder,
        });
      }
    };

    // Handle delete category
    const handleDeleteCategory = (id: string) => {
      // If we're working with production categories, we need to create a staging entry
      if (stagingCategories.length === 0 && productionCategories.length > 0) {
        const productionCategory = productionCategories.find(
          (cat) => cat.id === id
        );
        if (productionCategory) {
          // Create a staging entry for deletion for this specific category only
          addCategory(
            {
              name: productionCategory.name,
              slug: productionCategory.slug,
              description: productionCategory.description,
              parentId: productionCategory.parentId,
              isActive: productionCategory.isActive,
              sortOrder: productionCategory.sortOrder,
            },
            true
          ); // Mark as deleted
        }
      } else {
        // Normal staging deletion
        deleteCategory(id);
      }
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    };

    // Open edit modal
    const openEditModal = (category: CategoryData) => {
      setEditingCategory(category);
      setIsEditModalOpen(true);
    };

    // Open delete modal
    const openDeleteModal = (category: CategoryData) => {
      setDeletingCategory(category);
      setIsDeleteModalOpen(true);
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
            <Typography variant="h5">Category Management</Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
              disabled={loading}
            >
              Add Category
            </Button>
          </Box>
        </Box>

        {/* Main Categories Table */}
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categories
            </Typography>

            {stagingCategories.length === 0 &&
            productionCategories.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No categories added yet. Click &quot;Add Category&quot; to get
                started.
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Sort Order</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[...stagingCategories, ...productionCategories]
                      .filter(
                        (category) =>
                          !("isDeleted" in category && category.isDeleted)
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((category, index) => {
                        const categoryId =
                          "id" in category && category.id
                            ? category.id
                            : `temp-${index}-${category.name}-${Date.now()}`;
                        const parentName =
                          "parentId" in category && category.parentId
                            ? [...stagingCategories, ...productionCategories]
                                .filter((c) => c.id === category.parentId)
                                .find((c) => c.id === category.parentId)
                                ?.name || "Unknown Parent"
                            : "No Parent";

                        return (
                          <TableRow key={categoryId} hover>
                            <TableCell sx={{ fontWeight: 500 }}>
                              {category.name}
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="monospace"
                              >
                                /{category.slug}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {category.description ? (
                                <Typography
                                  variant="body2"
                                  noWrap
                                  sx={{ maxWidth: 200 }}
                                >
                                  {category.description}
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
                                label={parentName}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  category.isActive ? "Active" : "Inactive"
                                }
                                size="small"
                                color={
                                  category.isActive ? "success" : "default"
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {category.sortOrder}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 0.5 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => openEditModal(category)}
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
                                  onClick={() => openDeleteModal(category)}
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

        {/* Deleted Categories Section */}
        {stagingCategories.filter((cat) => "isDeleted" in cat && cat.isDeleted)
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
                🗑️ Staging Changes - Deleted Categories (
                {
                  stagingCategories.filter(
                    (cat) => "isDeleted" in cat && cat.isDeleted
                  ).length
                }
                )
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                These categories are marked for deletion in staging. You can
                restore them before uploading to production.
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ bgcolor: "warning.50" }}>
                      <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Slug</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        Description
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stagingCategories
                      .filter(
                        (category) =>
                          "isDeleted" in category && category.isDeleted
                      )
                      .map((category, index) => {
                        const categoryId =
                          "id" in category && category.id
                            ? category.id
                            : `temp-deleted-${index}-${
                                category.name
                              }-${Date.now()}`;
                        const parentName =
                          "parentId" in category && category.parentId
                            ? [...stagingCategories, ...productionCategories]
                                .filter((c) => c.id === category.parentId)
                                .find((c) => c.id === category.parentId)
                                ?.name || "Unknown Parent"
                            : "No Parent";

                        return (
                          <TableRow key={categoryId} hover>
                            <TableCell
                              sx={{
                                fontWeight: 500,
                                textDecoration: "line-through",
                              }}
                            >
                              {category.name}
                            </TableCell>
                            <TableCell sx={{ textDecoration: "line-through" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontFamily="monospace"
                              >
                                /{category.slug}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ textDecoration: "line-through" }}>
                              {category.description || "No description"}
                            </TableCell>
                            <TableCell sx={{ textDecoration: "line-through" }}>
                              {parentName}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="warning"
                                size="small"
                                startIcon={<RestoreIcon />}
                                onClick={() => handleRestoreCategory(category)}
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

        {/* Add Category Modal */}
        <CategoryStagingModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCategory}
          categories={
            stagingCategories.length > 0
              ? stagingCategories
              : productionCategories
          }
          mode="add"
        />

        {/* Edit Category Modal */}
        {editingCategory && (
          <CategoryStagingModal
            open={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingCategory(null);
            }}
            onSave={handleAddCategory} // Use the same handler for consistency
            onEdit={handleEditCategory}
            categories={
              stagingCategories.length > 0
                ? stagingCategories
                : productionCategories
            }
            editingCategory={{
              id:
                "id" in editingCategory
                  ? editingCategory.id
                  : `temp-${Date.now()}-${Math.random()}`,
              name: editingCategory.name,
              slug: editingCategory.slug,
              description: editingCategory.description,
              parentId:
                "parentId" in editingCategory ? editingCategory.parentId : null,
              isActive: editingCategory.isActive,
              sortOrder: editingCategory.sortOrder,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            mode="edit"
          />
        )}

        {/* Delete Confirmation Modal */}
        <CategoryStagingModal
          open={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingCategory(null);
          }}
          onSave={() => {}} // Dummy function for delete mode
          onDelete={handleDeleteCategory}
          categories={
            stagingCategories.length > 0
              ? stagingCategories
              : productionCategories
          }
          editingCategory={
            deletingCategory
              ? {
                  id:
                    "id" in deletingCategory
                      ? deletingCategory.id
                      : `temp-${Date.now()}-${Math.random()}`,
                  name: deletingCategory.name,
                  slug: deletingCategory.name,
                  description: deletingCategory.description,
                  parentId:
                    "parentId" in deletingCategory
                      ? deletingCategory.parentId
                      : null,
                  isActive: deletingCategory.isActive,
                  sortOrder: deletingCategory.sortOrder,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                }
              : null
          }
          mode="delete"
        />
      </Box>
    );
  }
);

CategoryWorkflow.displayName = "CategoryWorkflow";

export default CategoryWorkflow;
