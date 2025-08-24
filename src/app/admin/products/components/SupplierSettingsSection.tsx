"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Alert,
  Stack,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { useStagingWorkflow } from "@/hooks/useStagingWorkflow";

interface Supplier {
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

interface SupplierSettingsSectionProps {
  onDataChange?: (hasChanges: boolean) => void;
  onStagingChange?: (hasStaging: boolean) => void;
}

export interface SupplierSettingsSectionRef {
  moveStagingToProduction: () => Promise<boolean>;
  refreshData: () => Promise<void>;
  getStagingState: () => { isDirty: boolean; hasStagingSuppliers: boolean };
  saveToStaging: () => Promise<boolean>;
}

const SupplierSettingsSection = forwardRef<
  SupplierSettingsSectionRef,
  SupplierSettingsSectionProps
>(({ onDataChange, onStagingChange }, ref) => {
  // Use the reusable staging workflow hook
  const {
    items: suppliers,
    isDirty,
    hasStaging: hasStagingSuppliers,
    loading,
    error,
    success,
    addItem: addSupplier,
    editItem: editSupplierItem,
    deleteItem: deleteSupplier,
    saveToStaging: saveToStagingHook,
    uploadToProduction: uploadToProductionHook,
    refreshData: refreshDataHook,
    clearMessages,
  } = useStagingWorkflow<Supplier>({
    type: "supplier",
    apiEndpoints: {
      staging: "/api/admin/products/suppliers/staging",
      production: "/api/admin/products/suppliers/production",
      loadFrom: "/api/admin/products/suppliers",
    },
  });

  // Form state for adding new supplier
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    notes: "",
    isActive: true,
  });

  // Form state for editing supplier
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editSupplier, setEditSupplier] = useState({
    name: "",
    code: "",
    email: "",
    phone: "",
    notes: "",
    isActive: true,
  });

  const loadSuppliers = useCallback(async () => {
    await refreshDataHook();
  }, [refreshDataHook]);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    supplierId: string | null;
  }>({ open: false, supplierId: null });

  const handleDelete = async (supplierId: string) => {
    setDeleteConfirm({ open: true, supplierId });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm.supplierId) return;

    console.warn(
      "Supplier Settings: Confirm delete for ID:",
      deleteConfirm.supplierId
    );

    try {
      // Remove from local state (staging)
      await deleteSupplier(deleteConfirm.supplierId);
      console.warn("Supplier Settings: Delete completed successfully");
      setDeleteConfirm({ open: false, supplierId: null });
    } catch (err) {
      console.error("Supplier Settings: Delete failed:", err);
    }
  };

  const handleToggleActive = async (supplierId: string, isActive: boolean) => {
    try {
      // Update in local state (staging)
      editSupplierItem(supplierId, {
        isActive,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to update supplier status:", err);
    }
  };

  // Function to add new supplier to staging
  const handleAddSupplier = useCallback(async () => {
    // Validate required fields
    if (!newSupplier.name.trim() || !newSupplier.code.trim()) {
      return;
    }

    // Add to local state (staging)
    const newSupplierData: Supplier = {
      id: `temp-${Date.now()}`, // Temporary ID for staging
      name: newSupplier.name.trim(),
      code: newSupplier.code.trim(),
      email: newSupplier.email.trim() || undefined,
      phone: newSupplier.phone.trim() || undefined,
      notes: newSupplier.notes.trim() || undefined,
      isActive: newSupplier.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addSupplier(newSupplierData);

    // Reset form and close dialog
    setNewSupplier({
      name: "",
      code: "",
      email: "",
      phone: "",
      notes: "",
      isActive: true,
    });
    setIsAddDialogOpen(false);
  }, [newSupplier, addSupplier]);

  // Function to handle editing supplier
  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setEditSupplier({
      name: supplier.name,
      code: supplier.code,
      email: supplier.email || "",
      phone: supplier.phone || "",
      notes: supplier.notes || "",
      isActive: supplier.isActive,
    });
    setIsEditDialogOpen(true);
  };

  // Function to save edited supplier to staging
  const handleSaveEditSupplier = useCallback(async () => {
    if (!editingSupplier) return;

    // Validate required fields
    if (!editSupplier.name.trim() || !editSupplier.code.trim()) {
      return;
    }

    // Update in local state (staging)
    editSupplierItem(editingSupplier.id, {
      name: editSupplier.name.trim(),
      code: editSupplier.code.trim(),
      email: editSupplier.email.trim() || undefined,
      phone: editSupplier.phone.trim() || undefined,
      notes: editSupplier.notes.trim() || undefined,
      isActive: editSupplier.isActive,
      updatedAt: new Date().toISOString(),
    });

    // Close dialog
    setIsEditDialogOpen(false);
    setEditingSupplier(null);
  }, [editingSupplier, editSupplier, editSupplierItem]);

  // Function to refresh supplier data (called by refresh button)
  const refreshData = useCallback(async () => {
    await refreshDataHook();
  }, [refreshDataHook]);

  // Function to move staging suppliers to production
  const moveStagingToProduction = useCallback(async () => {
    return await uploadToProductionHook();
  }, [uploadToProductionHook]);

  // Expose the functions to parent component
  useImperativeHandle(ref, () => ({
    moveStagingToProduction,
    refreshData,
    getStagingState: () => ({ isDirty, hasStagingSuppliers }),
    saveToStaging: saveToStagingHook,
  }));

  // Load suppliers on component mount
  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Notify parent component about data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(isDirty);
    }
  }, [onDataChange, isDirty]);

  // Notify parent component about staging state changes
  useEffect(() => {
    if (onStagingChange) {
      onStagingChange(hasStagingSuppliers);
    }
  }, [onStagingChange, hasStagingSuppliers]);

  return (
    <div>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">Supplier Management</Typography>
          {hasStagingSuppliers && (
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                bgcolor: "warning.light",
                color: "warning.contrastText",
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              Staging Mode
            </Box>
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => setIsAddDialogOpen(true)}
            disabled={loading}
          >
            Add Supplier
          </Button>
        </Box>
      </Box>

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}

      {/* Suppliers Table */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Suppliers
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" color="text.secondary">
                      {loading ? "Loading..." : "No suppliers found"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                suppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {supplier.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {supplier.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {supplier.phone || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {supplier.email || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200 }}>
                        {supplier.notes || "—"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={supplier.isActive}
                            onChange={(e) =>
                              handleToggleActive(supplier.id, e.target.checked)
                            }
                            disabled={loading}
                            size="small"
                          />
                        }
                        label={supplier.isActive ? "Active" : "Inactive"}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditSupplier(supplier)}
                          disabled={loading}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(supplier.id)}
                          disabled={loading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Supplier Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Supplier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Name *"
                value={newSupplier.name}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Code *"
                value={newSupplier.code}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, code: e.target.value }))
                }
                required
                disabled={loading}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newSupplier.email}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone"
                value={newSupplier.phone}
                onChange={(e) =>
                  setNewSupplier((prev) => ({ ...prev, phone: e.target.value }))
                }
                disabled={loading}
              />
            </Box>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={newSupplier.notes}
              onChange={(e) =>
                setNewSupplier((prev) => ({ ...prev, notes: e.target.value }))
              }
              disabled={loading}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newSupplier.isActive}
                  onChange={(e) =>
                    setNewSupplier((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  disabled={loading}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleAddSupplier}
            variant="contained"
            disabled={
              loading || !newSupplier.name.trim() || !newSupplier.code.trim()
            }
          >
            Add Supplier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Supplier Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Supplier</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Name *"
                value={editSupplier.name}
                onChange={(e) =>
                  setEditSupplier((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Code *"
                value={editSupplier.code}
                onChange={(e) =>
                  setEditSupplier((prev) => ({ ...prev, code: e.target.value }))
                }
                required
                disabled={loading}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editSupplier.email}
                onChange={(e) =>
                  setEditSupplier((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Phone"
                value={editSupplier.phone}
                onChange={(e) =>
                  setEditSupplier((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                disabled={loading}
              />
            </Box>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={editSupplier.notes}
              onChange={(e) =>
                setEditSupplier((prev) => ({ ...prev, notes: e.target.value }))
              }
              disabled={loading}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editSupplier.isActive}
                  onChange={(e) =>
                    setEditSupplier((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  disabled={loading}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEditSupplier}
            variant="contained"
            disabled={
              loading || !editSupplier.name.trim() || !editSupplier.code.trim()
            }
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, supplierId: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this supplier? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirm({
                open: false,
                supplierId: null,
              })
            }
          >
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

SupplierSettingsSection.displayName = "SupplierSettingsSection";

export default SupplierSettingsSection;
