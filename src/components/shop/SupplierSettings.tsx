"use client";

import React from "react";
import {
  Box,
  Button,
  Card,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { alpha } from "@mui/material/styles";

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

interface SupplierSettingsProps {
  suppliers: SupplierRecord[];
  onAdd: (input: SupplierInput) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function SupplierSettings({
  suppliers,
  onAdd,
  onEdit,
  onRemove,
}: SupplierSettingsProps) {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addForm, setAddForm] = React.useState<SupplierInput>({
    name: "",
    code: "",
    email: "",
    phone: "",
    notes: "",
    isActive: true,
  });

  const handleAddSupplier = () => {
    onAdd(addForm);
    setAddForm({
      name: "",
      code: "",
      email: "",
      phone: "",
      notes: "",
      isActive: true,
    });
    setIsAddModalOpen(false);
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: "text.primary", fontWeight: 600 }}
        >
          Supplier Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => setIsAddModalOpen(true)}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Add Supplier
        </Button>
      </Box>

      {/* Suppliers Grid */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {suppliers.map((supplier) => (
          <Card
            key={supplier.id}
            sx={{
              width: "280px",
              p: 2,
              borderRadius: 1.5,
              border: "1px solid",
              borderColor: "divider",
              background: `
                linear-gradient(135deg, 
                  rgba(59, 130, 246, 0.05) 0%, 
                  rgba(147, 197, 253, 0.03) 25%, 
                  rgba(219, 234, 254, 0.02) 50%, 
                  rgba(255, 255, 255, 0.95) 100%
                )
              `,
              backdropFilter: "blur(20px)",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (t) =>
                  `0 12px 40px ${alpha(t.palette.primary.main, 0.15)}`,
                background: `
                  linear-gradient(135deg, 
                    rgba(59, 130, 246, 0.08) 0%, 
                    rgba(147, 197, 253, 0.05) 25%, 
                    rgba(219, 234, 254, 0.03) 50%, 
                    rgba(255, 255, 255, 0.98) 100%
                  )
                `,
              },
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                {supplier.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Code: {supplier.code}
              </Typography>
              {supplier.email && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email: {supplier.email}
                </Typography>
              )}
              {supplier.phone && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phone: {supplier.phone}
                </Typography>
              )}
              {supplier.notes && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Notes: {supplier.notes}
                </Typography>
              )}
              <Typography
                variant="body2"
                color={supplier.isActive ? "success.main" : "error.main"}
              >
                Status: {supplier.isActive ? "Active" : "Inactive"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => onEdit(supplier.id)}
                  sx={{
                    color: "primary.main",
                    "&:hover": { bgcolor: alpha("primary.main", 0.1) },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onRemove(supplier.id)}
                  sx={{
                    color: "error.main",
                    "&:hover": { bgcolor: alpha("error.main", 0.1) },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>

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
    </Box>
  );
}
