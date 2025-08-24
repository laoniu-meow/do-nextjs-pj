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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
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

    // Expanded categories for tree view
    const [expandedCategoryIds, setExpandedCategoryIds] = useState<string[]>(
      []
    );

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

    // Toggle category expansion
    const toggleCategoryExpansion = (categoryId: string) => {
      setExpandedCategoryIds((prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]
      );
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

    // Render category tree
    const renderCategoryTree = (categories: CategoryData[], depth = 0) => {
      return categories
        .filter((cat) => !cat.parentId) // Only root categories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => {
          const categoryId =
            "id" in category
              ? category.id
              : `temp-${Date.now()}-${Math.random()}`;
          const children = categories.filter(
            (cat) => cat.parentId === categoryId
          );
          const hasChildren = children.length > 0;
          const isExpanded = expandedCategoryIds.includes(categoryId);

          return (
            <Box key={categoryId} sx={{ pl: depth * 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                {hasChildren && (
                  <IconButton
                    size="small"
                    onClick={() => toggleCategoryExpansion(categoryId)}
                  >
                    {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                  </IconButton>
                )}
                {!hasChildren && <Box sx={{ width: 32 }} />}

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" noWrap>
                    {category.name}
                  </Typography>
                </Box>

                <Chip
                  label={category.isActive ? "Active" : "Inactive"}
                  color={category.isActive ? "success" : "default"}
                  size="small"
                />

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

              {hasChildren && isExpanded && (
                <Box sx={{ mt: 1 }}>
                  {renderCategoryTree(children, depth + 1)}
                </Box>
              )}
            </Box>
          );
        });
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

          {/* Status indicators */}
          <Stack direction="row" spacing={2}>
            {isDirty && (
              <Chip label="Unsaved Changes" color="warning" size="small" />
            )}
            {hasStaging && (
              <Chip label="Has Staging Data" color="info" size="small" />
            )}
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
                {renderCategoryTree(stagingCategories)}
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
                {renderCategoryTree(productionCategories)}
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
