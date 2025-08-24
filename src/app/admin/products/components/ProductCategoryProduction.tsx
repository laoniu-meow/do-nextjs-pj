"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import type { ProductCategory } from "@/services/productCategoryService";

interface ProductCategoryProductionProps {
  open: boolean;
  onClose: () => void;
  productCategories: ProductCategory[];
  mode: "view" | "compare";
}

export function ProductCategoryProduction({
  open,
  onClose,
  productCategories,
  mode,
}: ProductCategoryProductionProps) {
  // Helper function to get category name
  const getCategoryName = (categoryId: string | null | undefined): string => {
    if (!categoryId) return "No category assigned";
    const category = productCategories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Unknown category";
  };

  // Render different content based on mode
  if (mode === "compare") {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
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
            🔍 Compare Product Categories
          </Typography>
          <IconButton
            onClick={onClose}
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
            <Typography variant="body1" color="text.secondary">
              Select product categories to compare their configurations and
              settings.
            </Typography>

            {/* Product Category Selection */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="product-category1-label">
                  First Product Category
                </InputLabel>
                <Select
                  labelId="product-category1-label"
                  label="First Product Category"
                  value=""
                  onChange={() => {}}
                >
                  <MenuItem value="">
                    <em>Select a product category</em>
                  </MenuItem>
                  {productCategories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((productCategory) => (
                      <MenuItem
                        key={productCategory.id}
                        value={productCategory.id}
                      >
                        {productCategory.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="product-category2-label">
                  Second Product Category
                </InputLabel>
                <Select
                  labelId="product-category2-label"
                  label="Second Product Category"
                  value=""
                  onChange={() => {}}
                >
                  <MenuItem value="">
                    <em>Select a product category</em>
                  </MenuItem>
                  {productCategories
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((productCategory) => (
                      <MenuItem
                        key={productCategory.id}
                        value={productCategory.id}
                      >
                        {productCategory.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            {/* Comparison Placeholder */}
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "2px dashed",
                borderColor: "grey.300",
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Comparison View
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select two product categories above to compare their
                configurations.
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
          📋 Production Product Categories
        </Typography>
        <IconButton
          onClick={onClose}
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
          <Typography variant="body1" color="text.secondary">
            These are the current production product categories. To make
            changes, please use the staging workflow.
          </Typography>

          {/* Product Categories List */}
          {productCategories.length === 0 ? (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No product categories found in production.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
              }}
            >
              {productCategories
                .sort(
                  (a, b) =>
                    a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)
                )
                .map((productCategory) => (
                  <Card
                    key={productCategory.id}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover": {
                        boxShadow: 4,
                        transform: "translateY(-2px)",
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          noWrap
                          sx={{ flex: 1, mr: 1 }}
                        >
                          {productCategory.name}
                        </Typography>
                        <Chip
                          label={
                            productCategory.isActive ? "Active" : "Inactive"
                          }
                          color={
                            productCategory.isActive ? "success" : "default"
                          }
                          size="small"
                        />
                      </Box>

                      {productCategory.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {productCategory.description}
                        </Typography>
                      )}

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Slug: /{productCategory.slug}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Category:{" "}
                          {getCategoryName(productCategory.categoryId)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Sort Order: {productCategory.sortOrder}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created:{" "}
                          {new Date(
                            productCategory.createdAt
                          ).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
