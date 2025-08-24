"use client";

import React from "react";
import {
  Stack,
  TextField,
  Typography,
  Button,
  FormControlLabel,
  Switch,
  Box,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Card as UiCard, CardBody as UiCardBody } from "@/components/ui";

export type SupplierInput = {
  name: string;
  code: string;
  isActive: boolean;
  email?: string;
  phone?: string;
  notes?: string;
};

export type SupplierRecord = SupplierInput & {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export interface SupplierSettingsProps {
  title?: string;
  suppliers: SupplierRecord[];
  onAdd?: (supplier: SupplierInput) => void;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onUpdate?: (suppliers: SupplierRecord[]) => void;
  disabled?: boolean;
  showActions?: boolean;
}

export default function SupplierSettings({
  title = "Supplier Settings",
  suppliers,
  onAdd,
  onEdit,
  onRemove,
  onUpdate,
  disabled = false,
  showActions = true,
}: SupplierSettingsProps) {
  const theme = useTheme();
  const gradientBg = `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.18
  )} 0%, ${alpha(theme.palette.info.main, 0.18)} 50%, ${alpha(
    theme.palette.secondary.main,
    0.18
  )} 100%)`;

  // Form state for adding new supplier
  const [supplierName, setSupplierName] = React.useState("");
  const [supplierCode, setSupplierCode] = React.useState("");
  const [supplierEmail, setSupplierEmail] = React.useState("");
  const [supplierPhone, setSupplierPhone] = React.useState("");
  const [supplierNotes, setSupplierNotes] = React.useState("");
  const [supplierIsActive, setSupplierIsActive] = React.useState(true);

  const handleAdd = React.useCallback(() => {
    if (!supplierName.trim() || !supplierCode.trim()) return;
    
    onAdd?.({
      name: supplierName.trim(),
      code: supplierCode.trim(),
      isActive: supplierIsActive,
      email: supplierEmail.trim() || undefined,
      phone: supplierPhone.trim() || undefined,
      notes: supplierNotes.trim() || undefined,
    });

    // Reset form
    setSupplierName("");
    setSupplierCode("");
    setSupplierEmail("");
    setSupplierPhone("");
    setSupplierNotes("");
    setSupplierIsActive(true);
  }, [supplierName, supplierCode, supplierEmail, supplierPhone, supplierNotes, supplierIsActive, onAdd]);

  const handleRemove = React.useCallback((id: string) => {
    if (onRemove) {
      onRemove(id);
    } else if (onUpdate) {
      onUpdate(suppliers.filter(s => s.id !== id));
    }
  }, [suppliers, onRemove, onUpdate]);

  return (
    <UiCard title={title} variant="outlined" size="sm" compactHeader>
      <UiCardBody padding="sm">
        <Stack spacing={2}>
          {/* Add new supplier form */}
          {onAdd && (
            <Box sx={{ background: gradientBg, p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Add New Supplier
              </Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Supplier Name"
                    size="small"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    disabled={disabled}
                    sx={{ flexGrow: 1 }}
                    required
                  />
                  <TextField
                    label="Supplier Code"
                    size="small"
                    value={supplierCode}
                    onChange={(e) => setSupplierCode(e.target.value)}
                    disabled={disabled}
                    sx={{ width: { xs: "100%", sm: 150 } }}
                    required
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={supplierIsActive}
                        onChange={(e) => setSupplierIsActive(e.target.checked)}
                        disabled={disabled}
                      />
                    }
                    label="Active"
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    size="small"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                    disabled={disabled}
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Phone"
                    size="small"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    disabled={disabled}
                    sx={{ flexGrow: 1 }}
                  />
                </Stack>

                <TextField
                  label="Notes"
                  size="small"
                  value={supplierNotes}
                  onChange={(e) => setSupplierNotes(e.target.value)}
                  disabled={disabled}
                  multiline
                  rows={2}
                />

                <Button
                  variant="contained"
                  size="small"
                  onClick={handleAdd}
                  disabled={disabled || !supplierName.trim() || !supplierCode.trim()}
                  startIcon={<SaveIcon />}
                >
                  Add Supplier
                </Button>
              </Stack>
            </Box>
          )}

          {/* Existing suppliers list */}
          {suppliers.length === 0 ? (
            <Typography variant="body2" color="text.secondary" align="center">
              No suppliers configured.
            </Typography>
          ) : (
            <Stack spacing={2}>
              <Typography variant="subtitle2">Current Suppliers</Typography>
              {suppliers.map((supplier) => (
                <Card key={supplier.id} variant="outlined">
                  <CardContent sx={{ p: 1.5 }}>
                    <Stack spacing={1}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        alignItems="center"
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle2">
                            {supplier.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Code: {supplier.code}
                          </Typography>
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={supplier.isActive}
                              disabled={true}
                              size="small"
                            />
                          }
                          label="Active"
                        />
                        {showActions && (
                          <Stack direction="row" spacing={1}>
                            {onEdit && (
                              <IconButton
                                size="small"
                                onClick={() => onEdit(supplier.id)}
                                disabled={disabled}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                            {(onRemove || onUpdate) && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRemove(supplier.id)}
                                disabled={disabled}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Stack>
                        )}
                      </Stack>

                      {(supplier.email || supplier.phone) && (
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                          {supplier.email && (
                            <Typography variant="body2" color="text.secondary">
                              📧 {supplier.email}
                            </Typography>
                          )}
                          {supplier.phone && (
                            <Typography variant="body2" color="text.secondary">
                              📞 {supplier.phone}
                            </Typography>
                          )}
                        </Stack>
                      )}

                      {supplier.notes && (
                        <Typography variant="body2" color="text.secondary">
                          📝 {supplier.notes}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Stack>
      </UiCardBody>
    </UiCard>
  );
}
