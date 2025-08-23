"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { Alert } from "@mui/material";
import { Card, Tabs, Tab, Box, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { alpha } from "@mui/material/styles";
import TaxSettings, {
  TaxRuleRecord,
  TaxRuleInput,
} from "@/components/shop/TaxSettings";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function AdminShopPage() {
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) =>
    setTab(newValue);

  // Local demo state for Tax rules while redoing the section
  const [taxRules, setTaxRules] = React.useState<TaxRuleRecord[]>([]);
  const [isDirty, setIsDirty] = React.useState(false);
  const handleAddTax = React.useCallback((input: TaxRuleInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setTaxRules((prev) => [...prev, { id, ...input }]);
    setIsDirty(true);
  }, []);

  const handleRemoveTax = React.useCallback((id: string) => {
    setTaxRules((prev) => prev.filter((r) => r.id !== id));
    setIsDirty(true);
  }, []);

  const handleEditTax = React.useCallback(
    (id: string) => {
      const found = taxRules.find((r) => r.id === id);
      if (!found) return;
      
      // For now, just update with existing values
      // TODO: Implement proper edit modal instead of browser prompts
      const desc = found.description ?? "";
      const rateStr = found.ratePercent;
      const isInclusive = found.isInclusive;
      const isGST = found.isGST;
      
      setTaxRules((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                description: desc || undefined,
                ratePercent: rateStr,
                isInclusive,
                isGST,
              }
            : r
        )
      );
      setIsDirty(true);
    },
    [taxRules]
  );

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
      const loaded: TaxRuleRecord[] = (json.data || []).map((r: TaxRuleRecord) => ({
        id: r.id,
        description: r.description || undefined,
        ratePercent: String(r.ratePercent),
        isInclusive: Boolean(r.isInclusive),
        isGST: Boolean(r.isGST),
      }));
      setTaxRules(loaded);
      setIsDirty(false);
    } catch (e) {
      console.error("Failed to load staging tax rules", e);
    }
  }, []);

  React.useEffect(() => {
    if (tab === 7) {
      void loadStagingRules();
    }
  }, [tab, loadStagingRules]);

  // Toolbar actions
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
        // TODO: Show error in UI instead of alert
        return;
      }
      setIsDirty(false);
      setHasStagingData(taxRules.length > 0);
    } catch (e) {
      console.error("Failed to save staging tax rules", e);
      // TODO: Show error in UI instead of alert
    }
  }, [taxRules]);
  
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
      // TODO: Show success message in UI
    } catch (e) {
      console.error("Failed to publish to production", e);
    }
  }, []);
  
  const handleRefresh = React.useCallback(() => {
    // TODO: reload data for the active tab
    // TODO: Implement proper refresh functionality
  }, []);

  const [hasStagingData, setHasStagingData] = React.useState(false);

  return (
    <PageLayout
      title="Shop Management"
      description="Manage products, categories, variants, inventory, promotions, suppliers and tax."
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Shop" }]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Configuration"
        showSave
        showUpload
        showRefresh
        saveDisabled={!isDirty}
        onSave={handleSave}
        onUpload={handleUpload}
        onRefresh={handleRefresh}
      >
        <Card>
          <Box sx={{ px: 2, pt: 1 }}>
            {isDirty && (
              <Alert severity="warning" sx={{ mb: 1 }}>
                You have unsaved changes. Click Save to store in staging.
              </Alert>
            )}
            {!isDirty && hasStagingData && (
              <Alert severity="info" sx={{ mb: 1 }}>
                Changes saved to staging. Click Upload to publish to production.
              </Alert>
            )}
            {!isDirty && !hasStagingData && (
              <Alert severity="success" sx={{ mb: 1 }}>
                All data is synchronized with production.
              </Alert>
            )}
          </Box>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="Shop management tabs"
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
              icon={<LocalOfferIcon fontSize="small" />}
              iconPosition="start"
              label="Promotions"
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

          {/* Tab content placeholder with a concrete Tax tab UI */}
          {tab !== 7 ? (
            <Box sx={{ p: 1, pt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                {
                  "This section is intentionally blank. We'll re-do these tabs next."
                }
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 1, pt: 0.5 }}>
              <TaxSettings
                rules={taxRules}
                onAdd={handleAddTax}
                onEdit={handleEditTax}
                onRemove={handleRemoveTax}
              />
            </Box>
          )}
        </Card>
      </MainContainerBox>
    </PageLayout>
  );
}
