"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import {
  Card,
  Tabs,
  Tab,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { alpha } from "@mui/material/styles";
import TaxSettings, {
  TaxRuleRecord,
  TaxRuleInput,
} from "@/components/shop/TaxSettings";
import SupplierSettingsSection from "./components/SupplierSettingsSection";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function AdminShopPage() {
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  // Local demo state for Tax rules while redoing the section
  const [taxRules, setTaxRules] = React.useState<TaxRuleRecord[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const [hasStagingData, setHasStagingData] = React.useState(false);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<TaxRuleRecord | null>(
    null
  );
  const [editForm, setEditForm] = React.useState<TaxRuleInput>({
    description: "",
    ratePercent: "0",
    isInclusive: false,
    isGST: false,
  });

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [deletingRule, setDeletingRule] = React.useState<TaxRuleRecord | null>(
    null
  );

  const handleAddTax = React.useCallback((input: TaxRuleInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setTaxRules((prev) => [...prev, { id, ...input }]);
    setIsDirty(true);
  }, []);

  const handleRemoveTax = React.useCallback(
    (id: string) => {
      const found = taxRules.find((r) => r.id === id);
      if (!found) return;

      // Show delete confirmation dialog
      setDeletingRule(found);
      setIsDeleteModalOpen(true);
    },
    [taxRules]
  );

  const handleConfirmDelete = React.useCallback(() => {
    if (!deletingRule) return;

    // Actually delete the rule
    setTaxRules((prev) => prev.filter((r) => r.id !== deletingRule.id));
    setIsDirty(true);

    // Close modal and reset state
    setIsDeleteModalOpen(false);
    setDeletingRule(null);
  }, [deletingRule]);

  const handleCancelDelete = React.useCallback(() => {
    setIsDeleteModalOpen(false);
    setDeletingRule(null);
  }, []);

  const handleEditTax = React.useCallback(
    (id: string) => {
      const found = taxRules.find((r) => r.id === id);
      if (!found) return;

      // Open edit modal with current values
      setEditingRule(found);
      setEditForm({
        description: found.description || "",
        ratePercent: found.ratePercent,
        isInclusive: found.isInclusive,
        isGST: found.isGST,
      });
      setIsEditModalOpen(true);
    },
    [taxRules]
  );

  const handleSaveEdit = React.useCallback(() => {
    if (!editingRule) return;

    // Update the rule with edited values
    setTaxRules((prev) =>
      prev.map((r) =>
        r.id === editingRule.id
          ? {
              ...r,
              description: editForm.description || undefined,
              ratePercent: editForm.ratePercent,
              isInclusive: editForm.isInclusive,
              isGST: editForm.isGST,
            }
          : r
      )
    );

    setIsDirty(true);
    setIsEditModalOpen(false);
    setEditingRule(null);
    setEditForm({
      description: "",
      ratePercent: "0",
      isInclusive: false,
      isGST: false,
    });
  }, [editingRule, editForm]);

  const handleCancelEdit = React.useCallback(() => {
    setIsEditModalOpen(false);
    setEditingRule(null);
    setEditForm({
      description: "",
      ratePercent: "0",
      isInclusive: false,
      isGST: false,
    });
  }, []);

  // Load existing staging rules when Tax tab is opened
  const loadStagingRules = React.useCallback(async () => {
    try {
      const res = await fetchWithAuth("/api/admin/shop/tax/staging", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.warn(
          "Load staging tax rules failed:",
          json.error || res.status
        );
        return;
      }
      const loaded: TaxRuleRecord[] = (json.data || []).map(
        (r: TaxRuleRecord) => ({
          id: r.id,
          description: r.description || undefined,
          ratePercent: String(r.ratePercent),
          isInclusive: Boolean(r.isInclusive),
          isGST: Boolean(r.isGST),
        })
      );
      setTaxRules(loaded);
      setIsDirty(false);
      setHasStagingData(loaded.length > 0);
    } catch (e) {
      console.error("Failed to load staging tax rules", e);
    }
  }, []);

  // Load tax rules when Tax tab is selected
  React.useEffect(() => {
    if (tab === 6) {
      // Tax tab
      loadStagingRules();
    }
  }, [tab, loadStagingRules]);

  // Handle save to staging
  const handleSave = React.useCallback(async () => {
    try {
      // Normalize payload and persist using bulk replace
      const normalized = taxRules.map((r) => ({
        description: r.description ?? null,
        ratePercent: Number.parseFloat(String(r.ratePercent)) || 0,
        isInclusive: Boolean(r.isInclusive),
        isGST: Boolean(r.isGST),
      }));
      const res = await fetchWithAuth("/api/admin/shop/tax/staging", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rules: normalized }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.warn("Save staging failed:", json.error || res.status);
        return;
      }
      setIsDirty(false);
      setHasStagingData(taxRules.length > 0);
    } catch (e) {
      console.error("Failed to save staging tax rules", e);
    }
  }, [taxRules]);

  // Handle upload to production
  const handleUpload = React.useCallback(async () => {
    try {
      const res = await fetchWithAuth("/api/admin/shop/tax/publish", {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        console.warn("Publish tax rules failed:", json.error || res.status);
        return;
      }
      setHasStagingData(false);
      // TODO: Show success message in UI
    } catch (e) {
      console.error("Failed to publish to production", e);
    }
  }, []);

  // Handle refresh
  const handleRefresh = React.useCallback(() => {
    if (tab === 6) {
      // Tax tab
      loadStagingRules();
    }
    // TODO: Implement refresh for other tabs
  }, [tab, loadStagingRules]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          linear-gradient(135deg, 
            rgba(99, 102, 241, 0.05) 0%, 
            rgba(168, 85, 247, 0.03) 25%, 
            rgba(236, 72, 153, 0.02) 50%, 
            rgba(59, 130, 246, 0.03) 75%, 
            rgba(16, 185, 129, 0.05) 100%
          ),
          linear-gradient(45deg, 
            rgba(255, 255, 255, 0.9) 0%, 
            rgba(248, 250, 252, 0.95) 100%
          )
        `,
        backdropFilter: "blur(10px)",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)
          `,
          pointerEvents: "none",
          zIndex: 0,
        },
      }}
    >
      <PageLayout
        title="Shop Management"
        description="Manage products, categories, variants, inventory, suppliers and tax settings."
        breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Shop" }]}
        maxWidth="xl"
      >
        <MainContainerBox
          title="Configuration"
          showSave={true}
          showUpload={true}
          showRefresh={true}
          saveDisabled={!isDirty}
          uploadDisabled={!hasStagingData}
          onSave={handleSave}
          onUpload={handleUpload}
          onRefresh={handleRefresh}
        >
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: (t) =>
                `0 8px 32px ${alpha(t.palette.common.black, 0.12)}`,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 1,
                borderBottom: (t) => `1px solid ${t.palette.divider}`,
                "& .MuiTabs-flexContainer": { gap: 0.5 },
              }}
              TabIndicatorProps={{
                sx: (t) => ({
                  height: 3,
                  borderRadius: 2,
                  background: `linear-gradient(90deg, ${t.palette.primary.main}, ${t.palette.primary.dark})`,
                }),
              }}
            >
              <Tab
                icon={<InventoryIcon fontSize="small" />}
                iconPosition="start"
                label="Variants & Inventory"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<Inventory2Icon fontSize="small" />}
                iconPosition="start"
                label="Products"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<CategoryIcon fontSize="small" />}
                iconPosition="start"
                label="Product Type"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<CategoryIcon fontSize="small" />}
                iconPosition="start"
                label="Product Category"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<CategoryIcon fontSize="small" />}
                iconPosition="start"
                label="Category"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />

              <Tab
                icon={<LocalShippingIcon fontSize="small" />}
                iconPosition="start"
                label="Suppliers"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
              <Tab
                icon={<ReceiptLongIcon fontSize="small" />}
                iconPosition="start"
                label="Tax"
                sx={(t) => ({
                  textTransform: "none",
                  fontWeight: 600,
                  minHeight: 44,
                  px: 1.5,
                  borderRadius: 1,
                  color: t.palette.text.secondary,
                  "&.Mui-selected": { color: t.palette.primary.main },
                  "&:hover": { bgcolor: alpha(t.palette.primary.main, 0.08) },
                })}
              />
            </Tabs>

            {/* Tab content based on selected tab */}
            {tab === 5 ? (
              // Suppliers tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <SupplierSettingsSection />
              </Box>
            ) : tab === 6 ? (
              // Tax tab
              <Box sx={{ p: 1, pt: 0.5 }}>
                <TaxSettings
                  rules={taxRules}
                  onAdd={handleAddTax}
                  onEdit={handleEditTax}
                  onRemove={handleRemoveTax}
                />
              </Box>
            ) : (
              // Other tabs placeholder
              <Box sx={{ p: 1, pt: 0.5 }}>
                <Typography variant="body2" color="text.secondary">
                  {
                    "This section is intentionally blank. We'll re-do these tabs next."
                  }
                </Typography>
              </Box>
            )}
          </Card>
        </MainContainerBox>

        {/* Edit Tax Rule Modal */}
        <Dialog
          open={isEditModalOpen}
          onClose={handleCancelEdit}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: "primary.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ✏️ Edit Tax Rule
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}
            >
              <TextField
                fullWidth
                label="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="e.g., GST, Provincial Tax"
                size="small"
              />
              <TextField
                fullWidth
                label="Rate %"
                type="number"
                value={editForm.ratePercent}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    ratePercent: e.target.value,
                  }))
                }
                inputProps={{ min: 0, step: 0.01 }}
                required
                size="small"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isInclusive}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isInclusive: e.target.checked,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Tax Inclusive"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isGST}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isGST: e.target.checked,
                      }))
                    }
                    color="info"
                  />
                }
                label="GST"
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
              sx={{ minWidth: 100 }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Tax Rule Confirmation Modal */}
        <Dialog
          open={isDeleteModalOpen}
          onClose={handleCancelDelete}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              color: "error.main",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            ⚠️ Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Box sx={{ py: 1 }}>
              <Typography variant="body1" gutterBottom>
                Are you sure you want to delete this tax rule?
              </Typography>
              {deletingRule && (
                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Rule Details:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    Description: {deletingRule.description || "No description"}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    Rate: {deletingRule.ratePercent}%
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    Mode: {deletingRule.isInclusive ? "Inclusive" : "Exclusive"}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    Type: {deletingRule.isGST ? "GST" : "Regular"}
                  </Typography>
                </Box>
              )}
              <Typography
                variant="body2"
                color="error.main"
                sx={{ mt: 2, fontWeight: 500 }}
              >
                This action cannot be undone.
              </Typography>
            </Box>
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
              color="error"
              variant="contained"
              sx={{ minWidth: 100 }}
            >
              Delete Rule
            </Button>
          </DialogActions>
        </Dialog>
      </PageLayout>
    </Box>
  );
}
