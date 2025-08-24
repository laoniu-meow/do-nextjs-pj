"use client";

import React from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";
import AddIcon from "@mui/icons-material/Add";
import { alpha } from "@mui/material/styles";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface SupplierRecord {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierInput {
  name: string;
  code: string;
  email: string;
  phone: string;
  notes: string;
  isActive: boolean;
}

interface SupplierWorkflowProps {
  onSaveDisabledChange: (disabled: boolean) => void;
  onUploadDisabledChange: (disabled: boolean) => void;
  onMessageChange: (
    message: { type: "success" | "error"; text: string } | null
  ) => void;
}

export interface SupplierWorkflowRef {
  handleSave: () => Promise<void>;
  handleUpload: () => Promise<void>;
  handleRefresh: () => void;
}

const SupplierWorkflow = React.forwardRef<
  SupplierWorkflowRef,
  SupplierWorkflowProps
>(({ onSaveDisabledChange, onUploadDisabledChange, onMessageChange }, ref) => {
  // Supplier state management
  const [suppliers, setSuppliers] = React.useState<SupplierRecord[]>([]);
  const [originalSuppliers, setOriginalSuppliers] = React.useState<
    SupplierRecord[]
  >([]);
  const [deletedSuppliers, setDeletedSuppliers] = React.useState<
    SupplierRecord[]
  >([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const [hasStagingData, setHasStagingData] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasUploadedToProduction, setHasUploadedToProduction] =
    React.useState(false);
  // Message state is now handled by parent component

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [editingSupplier, setEditingSupplier] =
    React.useState<SupplierRecord | null>(null);
  const [deletingSupplier, setDeletingSupplier] =
    React.useState<SupplierRecord | null>(null);

  const [addForm, setAddForm] = React.useState<SupplierInput>({
    name: "",
    code: "",
    email: "",
    phone: "",
    notes: "",
    isActive: true,
  });

  const [editForm, setEditForm] = React.useState<SupplierInput>({
    name: "",
    code: "",
    email: "",
    phone: "",
    notes: "",
    isActive: true,
  });

  // Save deleted suppliers to localStorage
  const saveDeletedSuppliersToStorage = React.useCallback(
    (deleted: SupplierRecord[]) => {
      if (typeof window !== "undefined") {
        if (deleted.length > 0) {
          localStorage.setItem("supplierDeletedRules", JSON.stringify(deleted));
        } else {
          localStorage.removeItem("supplierDeletedRules");
        }
      }
    },
    []
  );

  // Check if data has changed from original
  const checkIfDirty = React.useCallback(
    (currentSuppliers: SupplierRecord[]) => {
      if (currentSuppliers.length !== originalSuppliers.length) return true;

      // Use find() instead of array indexing to avoid object injection
      return currentSuppliers.some((current) => {
        const original = originalSuppliers.find(
          (orig) => orig.id === current.id
        );
        if (!original) return true;

        return (
          current.name !== original.name ||
          current.code !== original.code ||
          current.email !== original.email ||
          current.phone !== original.phone ||
          current.notes !== original.notes ||
          current.isActive !== original.isActive
        );
      });
    },
    [originalSuppliers]
  );

  // Load supplier data using hybrid method: check staging first, then production
  const loadSupplierData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      // If we've successfully uploaded to production, skip staging completely
      if (hasUploadedToProduction) {
        console.warn(
          "Skipping staging check - loading suppliers directly from production (deleted suppliers are gone forever)"
        );
        // Load directly from production
        const productionRes = await fetchWithAuth(
          "/api/shop/suppliers/production",
          {
            cache: "no-store",
          }
        );

        if (!productionRes.ok) {
          throw new Error(`Production API error: ${productionRes.status}`);
        }

        const productionText = await productionRes.text();
        if (!productionText.trim()) {
          throw new Error("Empty response from production API");
        }
        const productionJson = JSON.parse(productionText);

        if (productionJson.success) {
          const loaded: SupplierRecord[] = (productionJson.data || []).map(
            (s: Record<string, unknown>) => ({
              id: s.id as string,
              name: s.name as string,
              code: s.code as string,
              email: s.email as string | undefined,
              phone: s.phone as string | undefined,
              notes: s.notes as string | undefined,
              isActive: Boolean(s.isActive),
              createdAt: s.createdAt as string,
              updatedAt: s.updatedAt as string,
            })
          );
          setSuppliers(loaded);
          setOriginalSuppliers(loaded);
          setIsDirty(false);
          setHasStagingData(false);
          setDeletedSuppliers([]);

          // Force clear localStorage completely when loading from production
          if (typeof window !== "undefined") {
            localStorage.removeItem("supplierDeletedRules");
            localStorage.removeItem("supplierDeletedRules_backup");
          }

          return; // Exit early, don't check staging
        }
      }

      // Step 1: Check if staging table has data
      const stagingRes = await fetchWithAuth(
        "/api/admin/shop/suppliers/staging",
        {
          cache: "no-store",
        }
      );

      if (!stagingRes.ok) {
        throw new Error(`Staging API error: ${stagingRes.status}`);
      }

      const stagingText = await stagingRes.text();
      if (!stagingText.trim()) {
        throw new Error("Empty response from staging API");
      }
      const stagingJson = JSON.parse(stagingText);

      if (
        stagingJson.success &&
        stagingJson.data &&
        (stagingJson.data.length > 0 ||
          (stagingJson.deletedRules && stagingJson.deletedRules.length > 0))
      ) {
        // Step 2: If staging has data, fetch from staging and enable upload button
        const loaded: SupplierRecord[] = stagingJson.data.map(
          (s: Record<string, unknown>) => ({
            id: s.id as string,
            name: s.name as string,
            code: s.code as string,
            email: s.email as string | undefined,
            phone: s.phone as string | undefined,
            notes: s.notes as string | undefined,
            isActive: Boolean(s.isActive),
            createdAt: s.createdAt as string,
            updatedAt: s.updatedAt as string,
          })
        );
        setSuppliers(loaded);
        setOriginalSuppliers(loaded);
        setHasStagingData(true);

        // Get deleted suppliers from API response
        let stagingDeletedSuppliers: SupplierRecord[] = [];
        if (
          stagingJson.deletedRules &&
          Array.isArray(stagingJson.deletedRules)
        ) {
          stagingDeletedSuppliers = stagingJson.deletedRules.map(
            (s: Record<string, unknown>) => ({
              id: s.id as string,
              name: s.name as string,
              code: s.code as string,
              email: s.email as string | undefined,
              phone: s.phone as string | undefined,
              notes: s.notes as string | undefined,
              isActive: Boolean(s.isActive),
              createdAt: s.createdAt as string,
              updatedAt: s.updatedAt as string,
            })
          );
        }

        // If no deleted suppliers from API, try localStorage as fallback
        if (
          stagingDeletedSuppliers.length === 0 &&
          typeof window !== "undefined"
        ) {
          try {
            const saved = localStorage.getItem("supplierDeletedRules");
            if (saved) {
              const restored = JSON.parse(saved);
              if (Array.isArray(restored) && restored.length > 0) {
                stagingDeletedSuppliers = restored;
              }
            }
          } catch (error) {
            console.error(
              "Failed to restore deleted suppliers from localStorage:",
              error
            );
          }
        }

        setDeletedSuppliers(stagingDeletedSuppliers);

        // Update localStorage to match what we loaded
        if (
          typeof window !== "undefined" &&
          stagingDeletedSuppliers.length > 0
        ) {
          localStorage.setItem(
            "supplierDeletedRules",
            JSON.stringify(stagingDeletedSuppliers)
          );
        }
      } else {
        // Step 3: If no staging data, fetch from production table
        const productionRes = await fetchWithAuth(
          "/api/shop/suppliers/production",
          {
            cache: "no-store",
          }
        );

        if (!productionRes.ok) {
          throw new Error(`Production API error: ${productionRes.status}`);
        }

        const productionText = await productionRes.text();
        if (!productionText.trim()) {
          throw new Error("Empty response from production API");
        }
        const productionJson = JSON.parse(productionText);

        if (productionJson.success) {
          const loaded: SupplierRecord[] = (productionJson.data || []).map(
            (s: Record<string, unknown>) => ({
              id: s.id as string,
              name: s.name as string,
              code: s.code as string,
              email: s.email as string | undefined,
              phone: s.phone as string | undefined,
              notes: s.notes as string | undefined,
              isActive: Boolean(s.isActive),
              createdAt: s.createdAt as string,
              updatedAt: s.updatedAt as string,
            })
          );
          setSuppliers(loaded);
          setOriginalSuppliers(loaded);
          setIsDirty(false);
          setHasStagingData(false);
          setDeletedSuppliers([]);

          // Force clear localStorage completely when loading from production
          if (typeof window !== "undefined") {
            localStorage.removeItem("supplierDeletedRules");
            localStorage.removeItem("supplierDeletedRules_backup");
          }
        } else {
          console.warn(
            "Failed to load production suppliers:",
            productionJson.error
          );
          setSuppliers([]);
          setOriginalSuppliers([]);
          setIsDirty(false);
          setHasStagingData(false);
          setDeletedSuppliers([]);

          // Force clear localStorage completely on error
          if (typeof window !== "undefined") {
            localStorage.removeItem("supplierDeletedRules");
            localStorage.removeItem("supplierDeletedRules_backup");
          }
        }
      }
    } catch (e) {
      console.error("Failed to load supplier data:", e);
      onMessageChange({
        type: "error",
        text: `Failed to load supplier data: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      });
      setSuppliers([]);
      setOriginalSuppliers([]);
      setIsDirty(false);
      setHasStagingData(false);
    } finally {
      setIsLoading(false);
    }
  }, [hasUploadedToProduction, onMessageChange]);

  // Load supplier data on component mount
  React.useEffect(() => {
    loadSupplierData();
  }, [loadSupplierData]);

  // Notify parent about button states
  React.useEffect(() => {
    onSaveDisabledChange(!isDirty || isLoading);
  }, [isDirty, isLoading, onSaveDisabledChange]);

  React.useEffect(() => {
    onUploadDisabledChange(!hasStagingData || isLoading);
  }, [hasStagingData, isLoading, onUploadDisabledChange]);

  // Handle save to staging
  const handleSave = React.useCallback(async () => {
    try {
      setIsLoading(true);
      console.warn(
        "Starting supplier save operation with",
        suppliers.length,
        "suppliers"
      );

      // Validate input data - allow empty array for deletion scenario
      if (!Array.isArray(suppliers)) {
        throw new Error("Invalid supplier data");
      }

      // Save suppliers to staging
      const res = await fetchWithAuth("/api/admin/shop/suppliers/staging", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ suppliers, deletedSuppliers }),
      });

      if (!res.ok) {
        throw new Error(
          `HTTP error ${res.status}: ${res.statusText || "Unknown error"}`
        );
      }

      const responseText = await res.text();
      if (!responseText.trim()) {
        throw new Error("Server returned empty response");
      }

      const json = JSON.parse(responseText);
      if (!json.success) {
        const errorMsg = json.error || json.message || "Unknown server error";
        throw new Error(`Save failed: ${errorMsg}`);
      }

      // Success - update supplier state
      setOriginalSuppliers([...suppliers]);
      setIsDirty(false);
      setHasStagingData(true);

      const successMessage =
        suppliers.length === 0
          ? "Successfully saved supplier deletions to staging. Click Upload to apply to production."
          : "Successfully saved supplier changes to staging. Click Upload to apply to production.";
      onMessageChange({ type: "success", text: successMessage });
      setTimeout(() => onMessageChange(null), 3000);
    } catch (e) {
      console.error("Failed to save to staging:", e);
      onMessageChange({
        type: "error",
        text: `Failed to save to staging: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [suppliers, deletedSuppliers, onMessageChange]);

  // Handle upload to production
  const handleUpload = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetchWithAuth("/api/admin/shop/suppliers/publish", {
        method: "POST",
      });

      // Read response body once and handle both success and error cases
      let responseText;
      try {
        responseText = await res.text();
      } catch {
        throw new Error("Failed to read server response");
      }

      if (!responseText.trim()) {
        throw new Error("Server returned empty response");
      }

      let json;
      try {
        json = JSON.parse(responseText);
      } catch {
        throw new Error("Server returned invalid JSON response");
      }

      if (!res.ok) {
        const errorMsg = json?.error || json?.message || `HTTP ${res.status}`;
        throw new Error(`Upload failed: ${errorMsg}`);
      }

      if (!json.success) {
        throw new Error(json.error || "Publish operation failed");
      }

      // Successfully published to production
      setHasStagingData(false);
      setIsDirty(false);
      setHasUploadedToProduction(true);
      setDeletedSuppliers([]);

      // Force clear localStorage completely - no more deleted suppliers
      if (typeof window !== "undefined") {
        localStorage.removeItem("supplierDeletedRules");
        localStorage.removeItem("supplierDeletedRules_backup");
      }

      // Reload data from production to get the latest state
      await loadSupplierData();

      // Final safety check: ensure localStorage is empty after reload
      if (typeof window !== "undefined") {
        localStorage.removeItem("supplierDeletedRules");
      }

      onMessageChange({
        type: "success",
        text: "Successfully published to production. All changes including deletions are now permanent.",
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => onMessageChange(null), 3000);
    } catch (e) {
      console.error("Failed to publish to production:", e);
      onMessageChange({
        type: "error",
        text: `Failed to publish to production: ${
          e instanceof Error ? e.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [loadSupplierData, onMessageChange]);

  // Handle refresh
  const handleRefresh = React.useCallback(() => {
    // Clear deleted suppliers state
    setDeletedSuppliers([]);
    setHasUploadedToProduction(false); // Reset flag on manual refresh

    // Force clear localStorage completely on refresh
    if (typeof window !== "undefined") {
      localStorage.removeItem("supplierDeletedRules");
      localStorage.removeItem("supplierDeletedRules_backup");
      // Clear any other potential variations
      Object.keys(localStorage).forEach((key) => {
        if (
          key.includes("supplierDeletedRules") ||
          key.includes("deletedSuppliers")
        ) {
          localStorage.removeItem(key);
        }
      });
    }

    loadSupplierData();
  }, [loadSupplierData]);

  // Handler functions
  const handleAddSupplier = React.useCallback(() => {
    if (!addForm.name.trim() || !addForm.code.trim()) {
      onMessageChange({
        type: "error",
        text: "Name and code are required",
      });
      setTimeout(() => onMessageChange(null), 3000);
      return;
    }

    const newSupplier: SupplierRecord = {
      id: `temp-${Date.now()}`,
      name: addForm.name.trim(),
      code: addForm.code.trim(),
      email: addForm.email.trim() || undefined,
      phone: addForm.phone.trim() || undefined,
      notes: addForm.notes.trim() || undefined,
      isActive: addForm.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newSuppliers = [...suppliers, newSupplier];
    setSuppliers(newSuppliers);
    setIsDirty(checkIfDirty(newSuppliers));
    setHasUploadedToProduction(false); // Reset flag when changes are made

    setAddForm({
      name: "",
      code: "",
      email: "",
      phone: "",
      notes: "",
      isActive: true,
    });
    setIsAddModalOpen(false);
  }, [addForm, suppliers, checkIfDirty, onMessageChange]);

  const handleEditSupplier = React.useCallback(
    (id: string) => {
      const supplier = suppliers.find((s) => s.id === id);
      if (supplier) {
        setEditingSupplier(supplier);
        setEditForm({
          name: supplier.name,
          code: supplier.code,
          email: supplier.email || "",
          phone: supplier.phone || "",
          notes: supplier.notes || "",
          isActive: supplier.isActive,
        });
        setIsEditModalOpen(true);
      }
    },
    [suppliers]
  );

  const handleSaveEdit = React.useCallback(() => {
    if (!editingSupplier) return;

    if (!editForm.name.trim() || !editForm.code.trim()) {
      onMessageChange({
        type: "error",
        text: "Name and code are required",
      });
      setTimeout(() => onMessageChange(null), 3000);
      return;
    }

    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === editingSupplier.id
        ? {
            ...supplier,
            name: editForm.name.trim(),
            code: editForm.code.trim(),
            email: editForm.email.trim() || undefined,
            phone: editForm.phone.trim() || undefined,
            notes: editForm.notes.trim() || undefined,
            isActive: editForm.isActive,
            updatedAt: new Date().toISOString(),
          }
        : supplier
    );

    setSuppliers(updatedSuppliers);
    setIsDirty(checkIfDirty(updatedSuppliers));
    setHasUploadedToProduction(false); // Reset flag when changes are made
    setIsEditModalOpen(false);
    setEditingSupplier(null);
  }, [editingSupplier, editForm, suppliers, checkIfDirty, onMessageChange]);

  const handleCancelEdit = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingSupplier(null);
  }, []);

  const handleRemoveSupplier = React.useCallback(
    (id: string) => {
      const supplier = suppliers.find((s) => s.id === id);
      if (supplier) {
        setDeletingSupplier(supplier);
        setIsDeleteModalOpen(true);
      }
    },
    [suppliers]
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (!deletingSupplier) return;

    // Remove from active suppliers
    const newSuppliers = suppliers.filter((s) => s.id !== deletingSupplier.id);
    setSuppliers(newSuppliers);

    // Add to deleted suppliers
    const newDeletedSuppliers = [...deletedSuppliers, deletingSupplier];
    setDeletedSuppliers(newDeletedSuppliers);
    saveDeletedSuppliersToStorage(newDeletedSuppliers);

    setIsDirty(checkIfDirty(newSuppliers));
    setHasUploadedToProduction(false); // Reset flag when changes are made
    setIsDeleteModalOpen(false);
    setDeletingSupplier(null);

    // Show success message
    onMessageChange({
      type: "success",
      text: "Supplier marked for deletion. Click Save to update staging.",
    });
    setTimeout(() => onMessageChange(null), 3000);
  }, [
    deletingSupplier,
    suppliers,
    deletedSuppliers,
    checkIfDirty,
    saveDeletedSuppliersToStorage,
    onMessageChange,
  ]);

  const handleCancelDelete = React.useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingSupplier(null);
  }, []);

  const handleRestoreSupplier = React.useCallback(
    (deletedSupplier: SupplierRecord) => {
      // Remove from deleted suppliers
      const newDeletedSuppliers = deletedSuppliers.filter(
        (s) => s.id !== deletedSupplier.id
      );
      setDeletedSuppliers(newDeletedSuppliers);
      saveDeletedSuppliersToStorage(newDeletedSuppliers);

      // Add back to active suppliers
      const newSuppliers = [...suppliers, deletedSupplier];
      setSuppliers(newSuppliers);
      setIsDirty(checkIfDirty(newSuppliers));
      setHasUploadedToProduction(false); // Reset flag when changes are made

      // Show success message
      onMessageChange({
        type: "success",
        text: "Supplier restored successfully. Click Save to update staging.",
      });
      setTimeout(() => onMessageChange(null), 3000);
    },
    [
      deletedSuppliers,
      suppliers,
      checkIfDirty,
      saveDeletedSuppliersToStorage,
      onMessageChange,
    ]
  );

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

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: "text.primary" }}>
          Supplier Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddModalOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Add Supplier
        </Button>
      </Box>

      {/* Active Suppliers Table */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            Active Suppliers ({suppliers.length})
          </Typography>
          {suppliers.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 4 }}
            >
              No active suppliers. Click &quot;Add Supplier&quot; to create one.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Notes</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {suppliers.map((supplier) => (
                    <TableRow key={supplier.id} hover>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {supplier.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {supplier.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {supplier.email ? (
                          <Typography variant="body2" color="text.secondary">
                            {supplier.email}
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            fontStyle="italic"
                          >
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.phone ? (
                          <Typography variant="body2" color="text.secondary">
                            {supplier.phone}
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            fontStyle="italic"
                          >
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {supplier.notes ? (
                          <Typography variant="body2" color="text.secondary">
                            {supplier.notes}
                          </Typography>
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.disabled"
                            fontStyle="italic"
                          >
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={supplier.isActive ? "Active" : "Inactive"}
                          size="small"
                          color={supplier.isActive ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditSupplier(supplier.id)}
                            sx={(theme) => ({
                              color: "primary.main",
                              "&:hover": {
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                              },
                            })}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSupplier(supplier.id)}
                            sx={(theme) => ({
                              color: "error.main",
                              "&:hover": {
                                bgcolor: alpha(theme.palette.error.main, 0.1),
                              },
                            })}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Deleted Suppliers Section */}
      {deletedSuppliers.length > 0 && (
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
              🗑️ Staging Changes - Deleted Suppliers ({deletedSuppliers.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              These suppliers are marked for deletion in staging. You can
              restore them before uploading to production.
            </Typography>
            <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: "warning.50" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Code</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {deletedSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} hover>
                      <TableCell
                        sx={{ fontWeight: 500, textDecoration: "line-through" }}
                      >
                        {supplier.name}
                      </TableCell>
                      <TableCell sx={{ textDecoration: "line-through" }}>
                        {supplier.code || "No code"}
                      </TableCell>
                      <TableCell sx={{ textDecoration: "line-through" }}>
                        {supplier.email || "Not specified"}
                      </TableCell>
                      <TableCell sx={{ textDecoration: "line-through" }}>
                        {supplier.phone || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          startIcon={<RestoreIcon />}
                          onClick={() => handleRestoreSupplier(supplier)}
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

      {/* Add Supplier Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Supplier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Name *"
                value={addForm.name}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Code *"
                value={addForm.code}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, code: e.target.value }))
                }
                required
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={addForm.email}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, email: e.target.value }))
                }
                size="small"
              />
              <TextField
                fullWidth
                label="Phone"
                value={addForm.phone}
                onChange={(e) =>
                  setAddForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                size="small"
              />
            </Box>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={addForm.notes}
              onChange={(e) =>
                setAddForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={addForm.isActive}
                  onChange={(e) =>
                    setAddForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setIsAddModalOpen(false)}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddSupplier}
            variant="contained"
            disabled={!addForm.name.trim() || !addForm.code.trim()}
            sx={{ minWidth: 100 }}
          >
            Add Supplier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Supplier Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Edit Supplier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Name *"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                size="small"
              />
              <TextField
                fullWidth
                label="Code *"
                value={editForm.code}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, code: e.target.value }))
                }
                required
                size="small"
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                size="small"
              />
              <TextField
                fullWidth
                label="Phone"
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, phone: e.target.value }))
                }
                size="small"
              />
            </Box>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={editForm.notes}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              size="small"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editForm.isActive}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCancelEdit}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!editForm.name.trim() || !editForm.code.trim()}
            sx={{ minWidth: 100 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCancelDelete}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, color: "error.main" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to delete this supplier?
          </Typography>
          {deletingSupplier && (
            <Box sx={{ p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {deletingSupplier.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Code: {deletingSupplier.code}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            This action will mark the supplier for deletion. You can restore it
            before uploading to production.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCancelDelete}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            sx={{ minWidth: 100 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message handling moved to parent component */}
    </Box>
  );
});

SupplierWorkflow.displayName = "SupplierWorkflow";

export default SupplierWorkflow;
