"use client";

import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
  alpha,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from "@mui/icons-material";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

// TypeScript interfaces
export interface PromotionRecord {
  id: string;
  name: string;
  code?: string | null;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: string; // Decimal as string
  isActive: boolean;
  startsAt?: string | null; // ISO string
  endsAt?: string | null; // ISO string
  allowStacking: boolean;
  stackingPriority: number;
  maxUses?: number | null;
  maxUsesPerUser?: number | null;
}

export interface PromotionInput {
  name: string;
  code: string;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
  allowStacking: boolean;
  stackingPriority: string;
  maxUses: string;
  maxUsesPerUser: string;
}

// Interface for API response data
interface PromotionApiData {
  id: string;
  name?: string;
  code?: string | null;
  type: string;
  value: number | string;
  isActive?: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  allowStacking?: boolean;
  stackingPriority?: number | string;
  maxUses?: number | string | null;
  maxUsesPerUser?: number | string | null;
}

export interface PromotionWorkflowRef {
  handleSave: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleRefresh: () => void;
}

interface PromotionWorkflowProps {
  onSaveDisabledChange: (disabled: boolean) => void;
  onUploadDisabledChange: (disabled: boolean) => void;
  onMessageChange: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
}

const PromotionWorkflow = React.forwardRef<
  PromotionWorkflowRef,
  PromotionWorkflowProps
>(({ onSaveDisabledChange, onUploadDisabledChange, onMessageChange }, ref) => {
  // State management (same pattern as Tax and Supplier)
  const [promotions, setPromotions] = React.useState<PromotionRecord[]>([]);
  const [originalPromotions, setOriginalPromotions] = React.useState<
    PromotionRecord[]
  >([]);
  const [deletedPromotions, setDeletedPromotions] = React.useState<
    PromotionRecord[]
  >([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const [hasStagingData, setHasStagingData] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasUploadedToProduction, setHasUploadedToProduction] =
    React.useState(false);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [editingPromotion, setEditingPromotion] =
    React.useState<PromotionRecord | null>(null);
  const [deletingPromotion, setDeletingPromotion] =
    React.useState<PromotionRecord | null>(null);

  // Form state
  const [promotionForm, setPromotionForm] = React.useState<PromotionInput>({
    name: "",
    code: "",
    type: "PERCENT",
    value: "0",
    isActive: true,
    startsAt: "",
    endsAt: "",
    allowStacking: true,
    stackingPriority: "0",
    maxUses: "",
    maxUsesPerUser: "",
  });

  // Check if data is dirty (same pattern as Tax workflow)
  const checkIfDirty = React.useCallback(
    (currentPromotions: PromotionRecord[]) => {
      if (currentPromotions.length !== originalPromotions.length) {
        return true;
      }

      for (const current of currentPromotions) {
        const original = originalPromotions.find(
          (orig) => orig.id === current.id
        );
        if (!original) {
          return true;
        }

        if (
          current.name !== original.name ||
          current.code !== original.code ||
          current.type !== original.type ||
          current.value !== original.value ||
          current.isActive !== original.isActive ||
          current.startsAt !== original.startsAt ||
          current.endsAt !== original.endsAt ||
          current.allowStacking !== original.allowStacking ||
          current.stackingPriority !== original.stackingPriority ||
          current.maxUses !== original.maxUses ||
          current.maxUsesPerUser !== original.maxUsesPerUser
        ) {
          return true;
        }
      }

      return false;
    },
    [originalPromotions]
  );

  // Save deleted promotions to localStorage
  const saveDeletedPromotionsToStorage = React.useCallback(
    (deleted: PromotionRecord[]) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            "promotionDeletedRules",
            JSON.stringify(deleted)
          );
        } catch (error) {
          console.error(
            "Failed to save deleted promotions to localStorage:",
            error
          );
        }
      }
    },
    []
  );

  // Load promotion data (staging first, then production)
  const loadPromotionData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // If we've successfully uploaded to production, skip staging completely
      if (hasUploadedToProduction) {
        console.warn(
          "Skipping staging check - loading directly from production"
        );
        const productionRes = await fetchWithAuth(
          "/api/shop/promotions/active",
          {
            cache: "no-store",
          }
        );

        if (!productionRes.ok) {
          throw new Error(`Production API error: ${productionRes.status}`);
        }

        const productionJson = await productionRes.json();
        if (productionJson.success) {
          const loaded: PromotionRecord[] = (productionJson.data || []).map(
            (p: PromotionApiData) => ({
              id: p.id,
              name: p.name || "",
              code: p.code || null,
              type: p.type,
              value: String(p.value),
              isActive: Boolean(p.isActive),
              startsAt: p.startsAt || null,
              endsAt: p.endsAt || null,
              allowStacking: Boolean(p.allowStacking),
              stackingPriority: Number(p.stackingPriority || 0),
              maxUses: p.maxUses || null,
              maxUsesPerUser: p.maxUsesPerUser || null,
            })
          );
          setPromotions(loaded);
          setOriginalPromotions(loaded);
          setIsDirty(false);
          setHasStagingData(false);
          setDeletedPromotions([]);

          // Clear localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("promotionDeletedRules");
          }
        }
        return;
      }

      // Step 1: Check staging table first
      const stagingRes = await fetchWithAuth(
        "/api/admin/products/promotions/staging",
        {
          cache: "no-store",
        }
      );

      if (!stagingRes.ok) {
        throw new Error(`Staging API error: ${stagingRes.status}`);
      }

      const stagingJson = await stagingRes.json();

      if (
        stagingJson.success &&
        stagingJson.data &&
        (stagingJson.data.length > 0 ||
          (stagingJson.deletedRules && stagingJson.deletedRules.length > 0))
      ) {
        // Load from staging
        const loaded: PromotionRecord[] = stagingJson.data.map(
          (p: PromotionApiData) => ({
            id: p.id,
            name: p.name || "",
            code: p.code || null,
            type: p.type,
            value: String(p.value),
            isActive: Boolean(p.isActive),
            startsAt: p.startsAt || null,
            endsAt: p.endsAt || null,
            allowStacking: Boolean(p.allowStacking),
            stackingPriority: Number(p.stackingPriority || 0),
            maxUses: p.maxUses || null,
            maxUsesPerUser: p.maxUsesPerUser || null,
          })
        );
        setPromotions(loaded);
        setOriginalPromotions(loaded);
        setHasStagingData(true);

        // Load deleted promotions from staging
        let stagingDeletedPromotions: PromotionRecord[] = [];
        if (
          stagingJson.deletedRules &&
          Array.isArray(stagingJson.deletedRules)
        ) {
          stagingDeletedPromotions = stagingJson.deletedRules.map(
            (p: PromotionApiData) => ({
              id: p.id,
              name: p.name || "",
              code: p.code || null,
              type: p.type,
              value: String(p.value),
              isActive: Boolean(p.isActive),
              startsAt: p.startsAt || null,
              endsAt: p.endsAt || null,
              allowStacking: Boolean(p.allowStacking),
              stackingPriority: Number(p.stackingPriority || 0),
              maxUses: p.maxUses || null,
              maxUsesPerUser: p.maxUsesPerUser || null,
            })
          );
        }

        // Fallback to localStorage if no deleted rules from API
        if (
          stagingDeletedPromotions.length === 0 &&
          typeof window !== "undefined"
        ) {
          try {
            const saved = localStorage.getItem("promotionDeletedRules");
            if (saved) {
              const restored = JSON.parse(saved);
              if (Array.isArray(restored) && restored.length > 0) {
                stagingDeletedPromotions = restored;
              }
            }
          } catch (error) {
            console.error(
              "Failed to restore deleted promotions from localStorage:",
              error
            );
          }
        }

        setDeletedPromotions(stagingDeletedPromotions);

        // Update localStorage
        if (
          typeof window !== "undefined" &&
          stagingDeletedPromotions.length > 0
        ) {
          localStorage.setItem(
            "promotionDeletedRules",
            JSON.stringify(stagingDeletedPromotions)
          );
        }
      } else {
        // Step 2: Load from production
        const productionRes = await fetchWithAuth(
          "/api/shop/promotions/active",
          {
            cache: "no-store",
          }
        );

        if (!productionRes.ok) {
          throw new Error(`Production API error: ${productionRes.status}`);
        }

        const productionJson = await productionRes.json();
        if (productionJson.success) {
          const loaded: PromotionRecord[] = (productionJson.data || []).map(
            (p: PromotionApiData) => ({
              id: p.id,
              name: p.name || "",
              code: p.code || null,
              type: p.type,
              value: String(p.value),
              isActive: Boolean(p.isActive),
              startsAt: p.startsAt || null,
              endsAt: p.endsAt || null,
              allowStacking: Boolean(p.allowStacking),
              stackingPriority: Number(p.stackingPriority || 0),
              maxUses: p.maxUses || null,
              maxUsesPerUser: p.maxUsesPerUser || null,
            })
          );
          setPromotions(loaded);
          setOriginalPromotions(loaded);
          setIsDirty(false);
          setHasStagingData(false);
          setDeletedPromotions([]);

          // Clear localStorage
          if (typeof window !== "undefined") {
            localStorage.removeItem("promotionDeletedRules");
          }
        } else {
          // No data found
          setPromotions([]);
          setOriginalPromotions([]);
          setIsDirty(false);
          setHasStagingData(false);
          setDeletedPromotions([]);
        }
      }
    } catch (error) {
      console.error("Failed to load promotion data:", error);
      onMessageChange({
        type: "error",
        text: `Failed to load promotion data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
      setPromotions([]);
      setOriginalPromotions([]);
      setIsDirty(false);
      setHasStagingData(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasUploadedToProduction, onMessageChange]);

  // Load data on component mount
  React.useEffect(() => {
    loadPromotionData();
  }, [loadPromotionData]);

  // Update button states when data changes
  React.useEffect(() => {
    const saveDisabled = !isDirty || isLoading;
    const uploadDisabled = !hasStagingData || isLoading;

    onSaveDisabledChange(saveDisabled);
    onUploadDisabledChange(uploadDisabled);
  }, [
    isDirty,
    hasStagingData,
    isLoading,
    onSaveDisabledChange,
    onUploadDisabledChange,
  ]);

  // Handle add promotion
  const handleAddPromotion = React.useCallback(() => {
    setPromotionForm({
      name: "",
      code: "",
      type: "PERCENT",
      value: "0",
      isActive: true,
      startsAt: "",
      endsAt: "",
      allowStacking: true,
      stackingPriority: "0",
      maxUses: "",
      maxUsesPerUser: "",
    });
    setIsAddModalOpen(true);
  }, []);

  // Handle edit promotion
  const handleEditPromotion = React.useCallback(
    (promotion: PromotionRecord) => {
      setEditingPromotion(promotion);
      setPromotionForm({
        name: promotion.name,
        code: promotion.code || "",
        type: promotion.type,
        value: promotion.value,
        isActive: promotion.isActive,
        startsAt: promotion.startsAt || "",
        endsAt: promotion.endsAt || "",
        allowStacking: promotion.allowStacking,
        stackingPriority: String(promotion.stackingPriority),
        maxUses: promotion.maxUses ? String(promotion.maxUses) : "",
        maxUsesPerUser: promotion.maxUsesPerUser
          ? String(promotion.maxUsesPerUser)
          : "",
      });
      setIsEditModalOpen(true);
    },
    []
  );

  // Handle save promotion (add/edit)
  const handleSavePromotion = React.useCallback(() => {
    try {
      // Validation
      if (!promotionForm.name.trim()) {
        onMessageChange({ type: "error", text: "Promotion name is required" });
        return;
      }

      const value = parseFloat(promotionForm.value);
      if (isNaN(value) || value < 0) {
        onMessageChange({
          type: "error",
          text: "Value must be a positive number",
        });
        return;
      }

      if (promotionForm.type === "PERCENT" && value > 100) {
        onMessageChange({
          type: "error",
          text: "Percentage value cannot exceed 100%",
        });
        return;
      }

      const stackingPriority = parseInt(promotionForm.stackingPriority);
      if (isNaN(stackingPriority)) {
        onMessageChange({
          type: "error",
          text: "Stacking priority must be a number",
        });
        return;
      }

      const newPromotion: PromotionRecord = {
        id: editingPromotion?.id || `temp-${Date.now()}`,
        name: promotionForm.name.trim(),
        code: promotionForm.code.trim() || null,
        type: promotionForm.type,
        value: promotionForm.value,
        isActive: promotionForm.isActive,
        startsAt: promotionForm.startsAt || null,
        endsAt: promotionForm.endsAt || null,
        allowStacking: promotionForm.allowStacking,
        stackingPriority: stackingPriority,
        maxUses: promotionForm.maxUses ? parseInt(promotionForm.maxUses) : null,
        maxUsesPerUser: promotionForm.maxUsesPerUser
          ? parseInt(promotionForm.maxUsesPerUser)
          : null,
      };

      let newPromotions: PromotionRecord[];
      if (editingPromotion) {
        // Edit existing
        newPromotions = promotions.map((p) =>
          p.id === editingPromotion.id ? newPromotion : p
        );
      } else {
        // Add new
        newPromotions = [...promotions, newPromotion];
      }

      setPromotions(newPromotions);
      setIsDirty(checkIfDirty(newPromotions));

      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setEditingPromotion(null);

      onMessageChange({
        type: "success",
        text: editingPromotion
          ? "Promotion updated successfully"
          : "Promotion added successfully",
      });
      setTimeout(() => onMessageChange(null), 2000);
    } catch (error) {
      onMessageChange({
        type: "error",
        text: `Failed to save promotion: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }, [
    promotionForm,
    editingPromotion,
    promotions,
    checkIfDirty,
    onMessageChange,
  ]);

  // Handle cancel edit/add
  const handleCancelEdit = React.useCallback(() => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingPromotion(null);
  }, []);

  // Handle remove promotion
  const handleRemovePromotion = React.useCallback(
    (promotion: PromotionRecord) => {
      setDeletingPromotion(promotion);
      setIsDeleteModalOpen(true);
    },
    []
  );

  // Handle confirm delete
  const handleConfirmDelete = React.useCallback(() => {
    if (!deletingPromotion) return;

    const newPromotions = promotions.filter(
      (p) => p.id !== deletingPromotion.id
    );
    const newDeletedPromotions = [...deletedPromotions, deletingPromotion];

    setPromotions(newPromotions);
    setDeletedPromotions(newDeletedPromotions);
    setIsDirty(checkIfDirty(newPromotions));

    // Save to localStorage
    saveDeletedPromotionsToStorage(newDeletedPromotions);

    setIsDeleteModalOpen(false);
    setDeletingPromotion(null);

    onMessageChange({
      type: "success",
      text: `Promotion "${deletingPromotion.name}" marked for deletion. Click Save to stage changes.`,
    });
    setTimeout(() => onMessageChange(null), 4000);
  }, [
    deletingPromotion,
    promotions,
    deletedPromotions,
    checkIfDirty,
    saveDeletedPromotionsToStorage,
    onMessageChange,
  ]);

  // Handle cancel delete
  const handleCancelDelete = React.useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingPromotion(null);
  }, []);

  // Handle restore promotion
  const handleRestorePromotion = React.useCallback(
    (promotion: PromotionRecord) => {
      const newDeletedPromotions = deletedPromotions.filter(
        (p) => p.id !== promotion.id
      );
      const newPromotions = [...promotions, promotion];

      setDeletedPromotions(newDeletedPromotions);
      setPromotions(newPromotions);
      setIsDirty(checkIfDirty(newPromotions));

      // Update localStorage
      saveDeletedPromotionsToStorage(newDeletedPromotions);

      onMessageChange({
        type: "success",
        text: `Promotion "${promotion.name}" restored successfully`,
      });
      setTimeout(() => onMessageChange(null), 3000);
    },
    [
      deletedPromotions,
      promotions,
      checkIfDirty,
      saveDeletedPromotionsToStorage,
      onMessageChange,
    ]
  );

  // Handle save to staging
  const handleSave = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // Prepare payload
      const payload = {
        promotions: promotions.map((p) => ({
          name: p.name,
          code: p.code || null,
          type: p.type,
          value: parseFloat(p.value),
          isActive: p.isActive,
          startsAt: p.startsAt || null,
          endsAt: p.endsAt || null,
          allowStacking: p.allowStacking,
          stackingPriority: p.stackingPriority,
          maxUses: p.maxUses,
          maxUsesPerUser: p.maxUsesPerUser,
        })),
        deletedPromotions: deletedPromotions.map((p) => ({
          name: p.name,
          code: p.code || null,
          type: p.type,
          value: parseFloat(p.value),
          isActive: p.isActive,
          startsAt: p.startsAt || null,
          endsAt: p.endsAt || null,
          allowStacking: p.allowStacking,
          stackingPriority: p.stackingPriority,
          maxUses: p.maxUses,
          maxUsesPerUser: p.maxUsesPerUser,
        })),
      };

      const response = await fetchWithAuth(
        "/api/admin/products/promotions/staging",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Staging API error: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to save to staging");
      }

      // Update state
      setOriginalPromotions([...promotions]);
      setIsDirty(false);
      setHasStagingData(true);

      const successMessage = `Staging updated successfully: ${
        promotions.length
      } active promotions${
        deletedPromotions.length > 0
          ? `, ${deletedPromotions.length} deleted`
          : ""
      }`;

      onMessageChange({ type: "success", text: successMessage });
      setTimeout(() => onMessageChange(null), 3000);
    } catch (error) {
      console.error("Save to staging failed:", error);
      onMessageChange({
        type: "error",
        text: `Failed to save to staging: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [promotions, deletedPromotions, onMessageChange]);

  // Handle upload to production
  const handleUpload = React.useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetchWithAuth(
        "/api/admin/products/promotions/publish",
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Publish API error: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to publish to production");
      }

      // Update state
      setHasStagingData(false);
      setIsDirty(false);
      setHasUploadedToProduction(true);
      setDeletedPromotions([]);

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("promotionDeletedRules");
      }

      const successMessage = `Successfully published ${
        result.publishedCount || 0
      } promotions to production`;
      onMessageChange({ type: "success", text: successMessage });
      setTimeout(() => onMessageChange(null), 3000);
    } catch (error) {
      console.error("Upload to production failed:", error);
      onMessageChange({
        type: "error",
        text: `Failed to upload to production: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [onMessageChange]);

  // Handle refresh
  const handleRefresh = React.useCallback(() => {
    setDeletedPromotions([]);
    setHasUploadedToProduction(false);

    // Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("promotionDeletedRules");
      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes("promotionDeletedRules") ||
          key.includes("deletedPromotions")
        ) {
          localStorage.removeItem(key);
        }
      });
    }

    loadPromotionData();
  }, [loadPromotionData]);

  // Expose methods to parent component
  React.useImperativeHandle(
    ref,
    () => ({
      handleSave,
      handleUpload,
      handleRefresh,
    }),
    [handleSave, handleUpload, handleRefresh]
  );

  // Format promotion type for display
  const formatPromotionType = (type: string) => {
    switch (type) {
      case "PERCENT":
        return "Percentage";
      case "FIXED":
        return "Fixed Amount";
      case "FREE_SHIPPING":
        return "Free Shipping";
      default:
        return type;
    }
  };

  // Format promotion value for display
  const formatPromotionValue = (type: string, value: string) => {
    switch (type) {
      case "PERCENT":
        return `${value}%`;
      case "FIXED":
        return `$${value}`;
      case "FREE_SHIPPING":
        return "Free";
      default:
        return value;
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No limit";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Box sx={{ p: 1, pt: 0.5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Promotions Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddPromotion}
          sx={{ borderRadius: 2 }}
        >
          Add Promotion
        </Button>
      </Box>

      {/* Active Promotions Table */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            Active Promotions ({promotions.length})
          </Typography>
          {promotions.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No active promotions. Click &quot;Add Promotion&quot; to create
              one.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Valid From</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Valid Until</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {promotions.map((promotion) => (
                    <TableRow key={promotion.id} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {promotion.name}
                      </TableCell>
                      <TableCell>
                        {promotion.code ? (
                          <Chip
                            label={promotion.code}
                            size="small"
                            variant="outlined"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No code
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatPromotionType(promotion.type)}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 500, color: "primary.main" }}
                      >
                        {formatPromotionValue(promotion.type, promotion.value)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={promotion.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={promotion.isActive ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell>{formatDate(promotion.startsAt)}</TableCell>
                      <TableCell>{formatDate(promotion.endsAt)}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditPromotion(promotion)}
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
                          onClick={() => handleRemovePromotion(promotion)}
                          sx={{
                            "&:hover": {
                              bgcolor: (theme) =>
                                alpha(theme.palette.error.main, 0.1),
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Deleted Promotions Section */}
      {deletedPromotions.length > 0 && (
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
              🗑️ Staging Changes - Deleted Promotions (
              {deletedPromotions.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These promotions are marked for deletion in staging. You can
              restore them before uploading to production.
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "warning.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deletedPromotions.map((promotion) => (
                    <TableRow key={promotion.id} hover>
                      <TableCell
                        sx={{ fontWeight: 500, textDecoration: "line-through" }}
                      >
                        {promotion.name}
                      </TableCell>
                      <TableCell sx={{ textDecoration: "line-through" }}>
                        {promotion.code || "No code"}
                      </TableCell>
                      <TableCell sx={{ textDecoration: "line-through" }}>
                        {formatPromotionType(promotion.type)}
                      </TableCell>
                      <TableCell sx={{ textDecoration: "line-through" }}>
                        {formatPromotionValue(promotion.type, promotion.value)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<RestoreIcon />}
                          onClick={() => handleRestorePromotion(promotion)}
                        >
                          Restore
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Promotion Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onClose={handleCancelEdit}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPromotion ? "Edit Promotion" : "Add New Promotion"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Promotion Name"
              value={promotionForm.name}
              onChange={(e) =>
                setPromotionForm((prev) => ({ ...prev, name: e.target.value }))
              }
              fullWidth
              required
            />
            <TextField
              label="Promotion Code"
              value={promotionForm.code}
              onChange={(e) =>
                setPromotionForm((prev) => ({ ...prev, code: e.target.value }))
              }
              fullWidth
              helperText="Optional unique code for customers to use"
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={promotionForm.type}
                  label="Type"
                  onChange={(e) =>
                    setPromotionForm((prev) => ({
                      ...prev,
                      type: e.target.value as
                        | "PERCENT"
                        | "FIXED"
                        | "FREE_SHIPPING",
                    }))
                  }
                >
                  <MenuItem value="PERCENT">Percentage Discount</MenuItem>
                  <MenuItem value="FIXED">Fixed Amount Discount</MenuItem>
                  <MenuItem value="FREE_SHIPPING">Free Shipping</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={
                  promotionForm.type === "PERCENT"
                    ? "Percentage (%)"
                    : promotionForm.type === "FIXED"
                    ? "Amount ($)"
                    : "Value"
                }
                value={promotionForm.value}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                type="number"
                inputProps={{
                  min: 0,
                  max: promotionForm.type === "PERCENT" ? 100 : undefined,
                }}
                disabled={promotionForm.type === "FREE_SHIPPING"}
                fullWidth
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Valid From"
                type="datetime-local"
                value={promotionForm.startsAt}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    startsAt: e.target.value,
                  }))
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Valid Until"
                type="datetime-local"
                value={promotionForm.endsAt}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    endsAt: e.target.value,
                  }))
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Max Uses"
                value={promotionForm.maxUses}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    maxUses: e.target.value,
                  }))
                }
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                helperText="Leave empty for unlimited"
              />
              <TextField
                label="Max Uses Per User"
                value={promotionForm.maxUsesPerUser}
                onChange={(e) =>
                  setPromotionForm((prev) => ({
                    ...prev,
                    maxUsesPerUser: e.target.value,
                  }))
                }
                type="number"
                inputProps={{ min: 0 }}
                fullWidth
                helperText="Leave empty for unlimited"
              />
            </Box>
            <TextField
              label="Stacking Priority"
              value={promotionForm.stackingPriority}
              onChange={(e) =>
                setPromotionForm((prev) => ({
                  ...prev,
                  stackingPriority: e.target.value,
                }))
              }
              type="number"
              fullWidth
              helperText="Higher numbers have higher priority when stacking"
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={promotionForm.isActive}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={promotionForm.allowStacking}
                    onChange={(e) =>
                      setPromotionForm((prev) => ({
                        ...prev,
                        allowStacking: e.target.checked,
                      }))
                    }
                  />
                }
                label="Allow Stacking"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelEdit}>Cancel</Button>
          <Button onClick={handleSavePromotion} variant="contained">
            {editingPromotion ? "Update" : "Add"} Promotion
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will mark the promotion for deletion in staging. You can
            restore it before uploading to production.
          </Alert>
          <Typography>
            Are you sure you want to delete the promotion &quot;
            {deletingPromotion?.name}&quot;?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="warning"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

PromotionWorkflow.displayName = "PromotionWorkflow";

export default PromotionWorkflow;
