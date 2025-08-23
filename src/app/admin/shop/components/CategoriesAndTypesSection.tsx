"use client";

import React from "react";
import {
  Stack,
  Divider,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Box,
  IconButton,
} from "@mui/material";
import { Card as UiCard, CardBody as UiCardBody } from "@/components/ui";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

type GroupRow = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  groupId?: string;
  parentId?: string | null;
  isActive: boolean;
};

type ProductTypeRow = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCategoryId: string;
  isActive: boolean;
};

function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const CategoriesAndTypesSection: React.FC = () => {
  // Local state mirrors the previous inline structures
  const [productGroups, setProductGroups] = React.useState<GroupRow[]>([]);
  const [categories, setCategories] = React.useState<CategoryRow[]>([]);
  const [productTypes, setProductTypes] = React.useState<ProductTypeRow[]>([]);

  // Inputs
  const [groupName, setGroupName] = React.useState("");
  const [groupDesc, setGroupDesc] = React.useState("");
  const [groupActive, setGroupActive] = React.useState(true);
  const [groupError, setGroupError] = React.useState<string | null>(null);

  const [catName, setCatName] = React.useState("");
  const [catDesc, setCatDesc] = React.useState("");
  const [catGroupId, setCatGroupId] = React.useState<string | "">("");
  const [catActive, setCatActive] = React.useState(true);
  const [catError, setCatError] = React.useState<string | null>(null);

  const [ptName, setPtName] = React.useState("");
  const [ptDesc, setPtDesc] = React.useState("");
  const [ptActive, setPtActive] = React.useState(true);
  const [typeCategoryId, setTypeCategoryId] = React.useState<string | "">("");
  const [expandedCategoryIds, setExpandedCategoryIds] = React.useState<
    string[]
  >([]);

  const addGroup = React.useCallback(() => {
    if (!groupName) return;
    setGroupError(null);
    const slug = generateSlug(groupName);
    if (productGroups.some((g) => g.slug === slug)) {
      setGroupError("Group with the same name already exists.");
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setProductGroups((prev) => [
      ...prev,
      {
        id,
        name: groupName,
        slug,
        description: groupDesc || undefined,
        isActive: groupActive,
      },
    ]);
    setGroupName("");
    setGroupDesc("");
    setGroupActive(true);
  }, [groupName, groupDesc, groupActive, productGroups]);

  const removeGroup = React.useCallback((id: string) => {
    setProductGroups((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const addCategory = React.useCallback(() => {
    if (!catName) return;
    if (!catGroupId) {
      setCatError(
        "Please select a Category to attach this Product Category to."
      );
      return;
    }
    setCatError(null);
    const slug = generateSlug(catName);
    const duplicate = categories.some(
      (c) => c.slug === slug && (c.groupId || null) === catGroupId
    );
    if (duplicate) {
      setCatError(
        "A product category with the same name already exists in this Category."
      );
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setCategories((prev) => [
      ...prev,
      {
        id,
        name: catName,
        slug,
        description: catDesc || undefined,
        parentId: undefined,
        groupId: catGroupId,
        isActive: catActive,
      },
    ]);
    setCatName("");
    setCatDesc("");
    setCatActive(true);
  }, [catName, catDesc, catActive, catGroupId, categories]);

  const removeCategory = React.useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addProductType = React.useCallback(() => {
    if (!ptName) return;
    if (!typeCategoryId) return;
    const slug = generateSlug(ptName);
    if (
      productTypes.some(
        (t) => t.slug === slug && t.productCategoryId === typeCategoryId
      )
    ) {
      return;
    }
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setProductTypes((prev) => [
      ...prev,
      {
        id,
        name: ptName,
        slug,
        description: ptDesc || undefined,
        productCategoryId: typeCategoryId,
        isActive: ptActive,
      },
    ]);
    setPtName("");
    setPtDesc("");
    setTypeCategoryId("");
    setPtActive(true);
  }, [ptName, ptDesc, ptActive, typeCategoryId, productTypes]);

  const removeProductType = React.useCallback((id: string) => {
    setProductTypes((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <UiCard title="Categories & Product Types" variant="outlined" size="md">
      <UiCardBody>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Category</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={groupActive}
                  onChange={(e) => setGroupActive(e.target.checked)}
                />
              }
              label="Active"
            />
            <Button
              variant="contained"
              size="small"
              onClick={addGroup}
              disabled={!groupName}
            >
              Add Group
            </Button>
          </Stack>
          {groupError ? (
            <Typography variant="body2" color="error">
              {groupError}
            </Typography>
          ) : null}
          {productGroups.length === 0 ? (
            <Typography variant="body2">No groups yet.</Typography>
          ) : (
            <UiCard variant="outlined" size="sm">
              <UiCardBody>
                <Stack divider={<Divider />} spacing={1}>
                  {productGroups.map((g) => (
                    <Stack
                      key={g.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack spacing={0.25}>
                        <Typography variant="subtitle2">
                          {g.name} {g.isActive ? "" : "(Inactive)"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{g.slug}
                        </Typography>
                        {g.description ? (
                          <Typography variant="caption" color="text.secondary">
                            {g.description}
                          </Typography>
                        ) : null}
                      </Stack>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => removeGroup(g.id)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </UiCardBody>
            </UiCard>
          )}
          <Divider />
          <Typography variant="subtitle2">Product Category</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
            />
            {catName ? (
              <Box sx={{ minWidth: 200 }}>
                <Typography variant="caption" color="text.secondary">
                  Slug: /{generateSlug(catName)}
                </Typography>
              </Box>
            ) : null}
          </Stack>
          <TextField
            label="Description"
            fullWidth
            size="small"
            multiline
            minRows={2}
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl fullWidth size="small">
              <InputLabel id="cat-group">Category</InputLabel>
              <Select
                labelId="cat-group"
                label="Category"
                value={catGroupId || ""}
                onChange={(e) => setCatGroupId(e.target.value as string)}
              >
                <MenuItem value="">Select Category</MenuItem>
                {productGroups.map((g) => (
                  <MenuItem key={g.id} value={g.id}>
                    {g.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={catActive}
                  onChange={(e) => setCatActive(e.target.checked)}
                />
              }
              label="Active"
            />
            <Button
              variant="contained"
              size="small"
              onClick={addCategory}
              disabled={!catName || !catGroupId}
            >
              Add Category
            </Button>
          </Stack>
          {catError ? (
            <Typography variant="body2" color="error">
              {catError}
            </Typography>
          ) : null}
          {categories.length === 0 ? (
            <Typography variant="body2">No categories added.</Typography>
          ) : (
            <UiCard variant="outlined" size="sm">
              <UiCardBody>
                <Stack divider={<Divider />} spacing={1}>
                  {categories
                    .filter((c) => !c.parentId)
                    .map((root) => {
                      const renderNode = (
                        nodeId: string,
                        depth = 0
                      ): React.ReactNode => {
                        const node = categories.find((c) => c.id === nodeId);
                        if (!node) return null;
                        const children = categories.filter(
                          (c) => c.parentId === nodeId
                        );
                        const hasChildren = children.length > 0;
                        const isExpanded = expandedCategoryIds.includes(nodeId);
                        const toggle = () =>
                          setExpandedCategoryIds((prev) =>
                            prev.includes(nodeId)
                              ? prev.filter((id) => id !== nodeId)
                              : [...prev, nodeId]
                          );
                        return (
                          <Box key={nodeId} sx={{ pl: depth * 2 }}>
                            <Stack
                              direction={{ xs: "column", sm: "row" }}
                              spacing={2}
                              justifyContent="space-between"
                              alignItems={{ xs: "flex-start", sm: "center" }}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                {hasChildren ? (
                                  <IconButton size="small" onClick={toggle}>
                                    {isExpanded ? (
                                      <ExpandMoreIcon />
                                    ) : (
                                      <ChevronRightIcon />
                                    )}
                                  </IconButton>
                                ) : (
                                  <Box sx={{ width: 32 }} />
                                )}
                                <Stack spacing={0.25}>
                                  <Typography variant="subtitle2">
                                    {node.name}{" "}
                                    {node.isActive ? "" : "(Inactive)"}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    /{node.slug}
                                  </Typography>
                                </Stack>
                              </Stack>
                              <Stack spacing={0.25}>
                                {node.description ? (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {node.description}
                                  </Typography>
                                ) : null}
                              </Stack>
                              <Button
                                size="small"
                                color="error"
                                variant="outlined"
                                onClick={() => removeCategory(node.id)}
                              >
                                Remove
                              </Button>
                            </Stack>
                            {hasChildren && isExpanded
                              ? children.map((ch) =>
                                  renderNode(ch.id, depth + 1)
                                )
                              : null}
                          </Box>
                        );
                      };
                      return renderNode(root.id);
                    })}
                </Stack>
              </UiCardBody>
            </UiCard>
          )}
          <Divider />
          <Typography variant="subtitle2">Product Type</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Type Name"
              fullWidth
              size="small"
              value={ptName}
              onChange={(e) => setPtName(e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              size="small"
              value={ptDesc}
              onChange={(e) => setPtDesc(e.target.value)}
            />
            <FormControl fullWidth size="small">
              <InputLabel id="type-pc">Product Category</InputLabel>
              <Select
                labelId="type-pc"
                label="Product Category"
                value={typeCategoryId || ""}
                onChange={(e) => setTypeCategoryId(e.target.value as string)}
              >
                <MenuItem value="">Select Product Category</MenuItem>
                {categories.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={ptActive}
                  onChange={(e) => setPtActive(e.target.checked)}
                />
              }
              label="Active"
            />
            <Button
              variant="contained"
              size="small"
              onClick={addProductType}
              disabled={!ptName || !typeCategoryId}
            >
              Add Type
            </Button>
          </Stack>
          {productTypes.length === 0 ? (
            <Typography variant="body2">No types yet.</Typography>
          ) : (
            <UiCard variant="outlined" size="sm">
              <UiCardBody>
                <Stack divider={<Divider />} spacing={1}>
                  {productTypes.map((t) => (
                    <Stack
                      key={t.id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Stack spacing={0.25}>
                        <Typography variant="subtitle2">
                          {t.name} {t.isActive ? "" : "(Inactive)"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{t.slug}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          In:{" "}
                          {categories.find((c) => c.id === t.productCategoryId)
                            ?.name || "Unknown"}
                        </Typography>
                        {t.description ? (
                          <Typography variant="caption" color="text.secondary">
                            {t.description}
                          </Typography>
                        ) : null}
                      </Stack>
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        onClick={() => removeProductType(t.id)}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}
                </Stack>
              </UiCardBody>
            </UiCard>
          )}
        </Stack>
      </UiCardBody>
    </UiCard>
  );
};

export default CategoriesAndTypesSection;
