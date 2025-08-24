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
import { CategoryStaging as CategoryStagingModal } from "./CategoryStaging";
import { useCategoryStaging } from "@/hooks/useCategoryStaging";
import type {
  CreateCategoryData,
  Category,
  CategoryStaging as CategoryStagingType,
} from "@/services/categoryService";

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
      // If we have production categories but no staging, we need to create staging entries
      if (stagingCategories.length === 0 && productionCategories.length > 0) {
        // First, add all production categories to staging as active
        productionCategories.forEach((cat) => {
          addCategory({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            parentId: cat.parentId,
            isActive: cat.isActive,
            sortOrder: cat.sortOrder,
          });
        });
      }

      // Add the new category
      addCategory(categoryData);
      setIsAddModalOpen(false);
    };

    // Handle edit category
    const handleEditCategory = (
      id: string,
      categoryData: CreateCategoryData
    ) => {
      // If we have production categories but no staging, we need to create staging entries
      if (stagingCategories.length === 0 && productionCategories.length > 0) {
        // First, add all production categories to staging as active
        productionCategories.forEach((cat) => {
          addCategory({
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            parentId: cat.parentId,
            isActive: cat.isActive,
            sortOrder: cat.sortOrder,
          });
        });

        // Now find the category we're editing and update it
        const categoryToEdit = productionCategories.find(
          (cat) => cat.id === id
        );
        if (categoryToEdit) {
          // Find the newly created staging entry and update it
          const newStagingId = `temp-${Date.now()}-${Math.random()}`;
          // We'll use the editCategory function after the staging entries are created
          setTimeout(() => {
            editCategory(newStagingId, categoryData);
          }, 0);
        }
      } else {
        // Normal staging edit
        editCategory(id, categoryData);
      }

      setIsEditModalOpen(false);
      setEditingCategory(null);
    };

    // Handle restore category
    const handleRestoreCategory = (id: string) => {
      // Find the category to restore
      const categoryToRestore = stagingCategories.find(
        (cat) => "id" in cat && cat.id === id
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
          // Create a staging entry for deletion
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

    // Get available parent categories (excluding current category and its descendants)
    const getAvailableParentCategories = (excludeId?: string): Category[] => {
      // Use staging categories if available, otherwise use production categories
      const availableCategories =
        stagingCategories.length > 0 ? stagingCategories : productionCategories;

      if (!excludeId) {
        return availableCategories
          .filter((cat) => !("isDeleted" in cat) || !cat.isDeleted)
          .map((cat) => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            parentId: cat.parentId,
            isActive: cat.isActive,
            sortOrder: cat.sortOrder,
            createdAt: cat.createdAt,
            updatedAt: cat.updatedAt,
          }));
      }

      const excludeIds = new Set<string>();
      const addDescendants = (categoryId: string) => {
        excludeIds.add(categoryId);
        availableCategories
          .filter((cat) => cat.parentId === categoryId)
          .forEach((cat) => addDescendants(cat.id));
      };

      addDescendants(excludeId);
      return availableCategories
        .filter(
          (cat) =>
            (!("isDeleted" in cat) || !cat.isDeleted) && !excludeIds.has(cat.id)
        )
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          parentId: cat.parentId,
          isActive: cat.isActive,
          sortOrder: cat.sortOrder,
          createdAt: cat.createdAt,
          updatedAt: cat.updatedAt,
        }));
    };

    // Render categories table
    const renderCategoriesTable = (
      categories: CategoryData[],
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
                <TableCell sx={{ fontWeight: 600 }}>Parent</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Sort Order</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => {
                  const categoryId =
                    "id" in category
                      ? category.id
                      : `temp-${Date.now()}-${Math.random()}`;
                  const parentCategory = categories.find(
                    (cat) => "id" in cat && cat.id === category.parentId
                  );

                  return (
                    <TableRow key={categoryId} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {isStaging &&
                        "isDeleted" in category &&
                        category.isDeleted ? (
                          <Typography sx={{ textDecoration: "line-through" }}>
                            {category.name}
                          </Typography>
                        ) : (
                          category.name
                        )}
                      </TableCell>
                      <TableCell>
                        {isStaging &&
                        "isDeleted" in category &&
                        category.isDeleted ? (
                          <Typography sx={{ textDecoration: "line-through" }}>
                            /{category.slug}
                          </Typography>
                        ) : (
                          <Typography>/{category.slug}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {isStaging &&
                        "isDeleted" in category &&
                        category.isDeleted ? (
                          <Typography sx={{ textDecoration: "line-through" }}>
                            {category.description || "-"}
                          </Typography>
                        ) : (
                          category.description || "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {isStaging &&
                        "isDeleted" in category &&
                        category.isDeleted ? (
                          <Typography sx={{ textDecoration: "line-through" }}>
                            {parentCategory ? parentCategory.name : "None"}
                          </Typography>
                        ) : parentCategory ? (
                          parentCategory.name
                        ) : (
                          "None"
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={category.isActive ? "Active" : "Inactive"}
                          color={category.isActive ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {isStaging &&
                        "isDeleted" in category &&
                        category.isDeleted ? (
                          <Typography sx={{ textDecoration: "line-through" }}>
                            {category.sortOrder}
                          </Typography>
                        ) : (
                          category.sortOrder
                        )}
                      </TableCell>
                      <TableCell>
                        {isStaging &&
                        "isDeleted" in category &&
                        category.isDeleted ? (
                          <Button
                            size="small"
                            startIcon={<RestoreIcon />}
                            onClick={() => handleRestoreCategory(categoryId)}
                            variant="outlined"
                            color="primary"
                          >
                            Restore
                          </Button>
                        ) : (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => openEditModal(category)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => openDeleteModal(category)}
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
            Category Management
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
              disabled={loading}
            >
              Add Category
            </Button>
          </Stack>
        </Box>

        {/* Categories Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Categories
            </Typography>

            {stagingCategories.length === 0 &&
            productionCategories.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No categories added yet. Click &ldquo;Add Category&rdquo; to get
                started.
              </Typography>
            ) : stagingCategories.length > 0 ? (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Staging Categories (Unsaved Changes)
                </Typography>
                {renderCategoriesTable(stagingCategories, true)}
              </Box>
            ) : (
              <Box>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Production Categories
                </Typography>
                {renderCategoriesTable(productionCategories, false)}
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Add Category Modal */}
        <CategoryStagingModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddCategory}
          categories={getAvailableParentCategories()}
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
            onSave={() => {}} // Add empty onSave function for edit mode
            onEdit={handleEditCategory}
            categories={getAvailableParentCategories(
              "id" in editingCategory ? editingCategory.id : undefined
            )}
            editingCategory={{
              id:
                "id" in editingCategory
                  ? editingCategory.id
                  : `temp-${Date.now()}`,
              name: editingCategory.name,
              slug: editingCategory.slug,
              description: editingCategory.description,
              parentId: editingCategory.parentId,
              isActive: editingCategory.isActive,
              sortOrder: editingCategory.sortOrder,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            mode="edit"
          />
        )}

        {/* Delete Category Modal */}
        {deletingCategory && (
          <CategoryStagingModal
            open={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setDeletingCategory(null);
            }}
            onDelete={handleDeleteCategory}
            categories={
              stagingCategories.length > 0
                ? stagingCategories
                : productionCategories
            }
            editingCategory={{
              id:
                "id" in deletingCategory
                  ? deletingCategory.id
                  : `temp-${Date.now()}`,
              name: deletingCategory.name,
              slug: deletingCategory.slug,
              description: deletingCategory.description,
              parentId: deletingCategory.parentId,
              isActive: deletingCategory.isActive,
              sortOrder: deletingCategory.sortOrder,
              createdAt: new Date(),
              updatedAt: new Date(),
            }}
            mode="delete"
            onSave={() => {}} // Add empty onSave function for delete mode
          />
        )}
      </Box>
    );
  }
);

CategoryWorkflow.displayName = "CategoryWorkflow";

export default CategoryWorkflow;
