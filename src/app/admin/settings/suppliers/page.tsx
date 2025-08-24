"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import {
  Card,
  CardHeader,
  CardContent,
  Stack,
  Typography,
  Divider,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Box,
  Alert,
} from "@mui/material";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

export default function SupplierSettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  // Suppliers state
  const [suppliers, setSuppliers] = React.useState<Array<{
    id?: string;
    name: string;
    code: string;
    isActive: boolean;
    email: string;
    phone: string;
    notes: string;
  }>>([]);



  async function loadSuppliers() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/api/settings/suppliers", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load suppliers");
      setSuppliers(json.data.suppliers || []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadSuppliers();
  }, []);

  async function saveSuppliers() {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate suppliers
      if (suppliers.length === 0) {
        throw new Error("At least one supplier is required");
      }

      const suppliersToSave = suppliers.map(({ ...supplier }) => ({
        name: supplier.name.trim(),
        code: supplier.code.trim(),
        isActive: supplier.isActive,
        email: supplier.email.trim() || null,
        phone: supplier.phone.trim() || null,
        notes: supplier.notes.trim() || null,
      }));

      // Validate required fields
      for (const supplier of suppliersToSave) {
        if (!supplier.name) throw new Error("Supplier name is required");
        if (!supplier.code) throw new Error("Supplier code is required");
      }

      const res = await fetchWithAuth("/api/settings/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suppliers: suppliersToSave }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to save suppliers");

      setSuccess("Suppliers saved successfully");
      await loadSuppliers(); // Reload to get updated IDs
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function addSupplier() {
    setSuppliers([
      ...suppliers,
      {
        name: "",
        code: "",
        isActive: true,
        email: "",
        phone: "",
        notes: "",
      },
    ]);
  }

  function removeSupplier(index: number) {
    setSuppliers(suppliers.filter((_, i) => i !== index));
  }

  function updateSupplier(index: number, field: string, value: string | boolean) {
    setSuppliers(
      suppliers.map((supplier, i) =>
        i === index ? { ...supplier, [field]: value } : supplier
      )
    );
  }



  return (
    <PageLayout
      title="Supplier Settings"
      description="Manage your product suppliers and their information"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Suppliers" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox title="Supplier Management">
        <Card>
          <CardHeader
            title="Supplier Settings"
            subheader="Manage your product suppliers"
            action={
              <Button
                variant="contained"
                onClick={addSupplier}
                disabled={loading}
                startIcon={<SaveIcon />}
              >
                Add Supplier
              </Button>
            }
          />
          <CardContent>
            <Stack spacing={3}>
              {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              {suppliers.length === 0 ? (
                <Typography variant="body2" color="text.secondary" align="center">
                  No suppliers configured. Click &quot;Add Supplier&quot; to get started.
                </Typography>
              ) : (
                suppliers.map((supplier, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                          alignItems="flex-start"
                        >
                          <TextField
                            label="Supplier Name"
                            value={supplier.name}
                            onChange={(e) =>
                              updateSupplier(index, "name", e.target.value)
                            }
                            disabled={loading}
                            sx={{ flexGrow: 1 }}
                            size="small"
                          />
                          <TextField
                            label="Supplier Code"
                            value={supplier.code}
                            onChange={(e) =>
                              updateSupplier(index, "code", e.target.value)
                            }
                            disabled={loading}
                            sx={{ width: { xs: "100%", sm: 150 } }}
                            size="small"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={supplier.isActive}
                                onChange={(e) =>
                                  updateSupplier(index, "isActive", e.target.checked)
                                }
                                disabled={loading}
                              />
                            }
                            label="Active"
                          />
                        </Stack>

                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={2}
                        >
                          <TextField
                            label="Email"
                            type="email"
                            value={supplier.email}
                            onChange={(e) =>
                              updateSupplier(index, "email", e.target.value)
                            }
                            disabled={loading}
                            sx={{ flexGrow: 1 }}
                            size="small"
                          />
                          <TextField
                            label="Phone"
                            value={supplier.phone}
                            onChange={(e) =>
                              updateSupplier(index, "phone", e.target.value)
                            }
                            disabled={loading}
                            sx={{ flexGrow: 1 }}
                            size="small"
                          />
                        </Stack>

                        <TextField
                          label="Notes"
                          value={supplier.notes}
                          onChange={(e) =>
                            updateSupplier(index, "notes", e.target.value)
                          }
                          disabled={loading}
                          multiline
                          rows={2}
                          size="small"
                        />

                        <Box display="flex" justifyContent="flex-end" gap={1}>
                          <IconButton
                            onClick={() => removeSupplier(index)}
                            disabled={loading}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              )}

              <Divider />

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => setSuppliers([])}
                  disabled={loading || suppliers.length === 0}
                >
                  Clear All
                </Button>
                <Button
                  variant="contained"
                  onClick={saveSuppliers}
                  disabled={loading || suppliers.length === 0}
                  startIcon={<SaveIcon />}
                >
                  Save All Suppliers
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </MainContainerBox>
    </PageLayout>
  );
}
