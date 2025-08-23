"use client";

import React from "react";
import {
  Stack,
  Divider,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Card as UiCard, CardBody as UiCardBody } from "@/components/ui";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

type PromotionRow = {
  id: string;
  name: string;
  code: string | null;
  type: "PERCENT" | "FIXED" | "FREE_SHIPPING";
  value: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  stackingPriority: number;
};

const PromotionsSection: React.FC = () => {
  const [promotions, setPromotions] = React.useState<PromotionRow[]>([]);
  const [promotionsLoading, setPromotionsLoading] = React.useState(false);
  const [promotionsError, setPromotionsError] = React.useState<string | null>(
    null
  );

  const [isAddOpen, setIsAddOpen] = React.useState(false);
  const [promoName, setPromoName] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [promoType, setPromoType] = React.useState<
    "PERCENT" | "FIXED" | "FREE_SHIPPING"
  >("PERCENT");
  const [promoValue, setPromoValue] = React.useState("0");
  const [promoSaving, setPromoSaving] = React.useState(false);

  const loadPromotions = React.useCallback(async () => {
    try {
      setPromotionsLoading(true);
      setPromotionsError(null);
      const res = await fetchWithAuth("/api/admin/shop/promotions", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load promotions");
      setPromotions(json.data as PromotionRow[]);
    } catch (e) {
      setPromotionsError((e as Error).message);
    } finally {
      setPromotionsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadPromotions();
  }, [loadPromotions]);

  const createPromotion = async () => {
    if (!promoName) return;
    try {
      setPromoSaving(true);
      const res = await fetchWithAuth("/api/admin/shop/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: promoName,
          code: promoCode || null,
          type: promoType,
          value: promoType === "FREE_SHIPPING" ? null : Number(promoValue),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create promotion");
      }
      setIsAddOpen(false);
      setPromoName("");
      setPromoCode("");
      setPromoType("PERCENT");
      setPromoValue("0");
      await loadPromotions();
    } catch (e) {
      // TODO: Show error in UI instead of alert
      console.error("Failed to create promotion:", e);
    } finally {
      setPromoSaving(false);
    }
  };

  return (
    <UiCard title="Promotions" variant="outlined" size="md">
      <UiCardBody>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            size="small"
            onClick={() => setIsAddOpen(true)}
          >
            Add Promotion
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={loadPromotions}
            disabled={promotionsLoading}
          >
            Refresh
          </Button>
        </Stack>
        {promotionsError && (
          <Typography variant="body2" color="error" sx={{ mb: 1 }}>
            {promotionsError}
          </Typography>
        )}
        {promotionsLoading ? (
          <Typography variant="body2">Loading...</Typography>
        ) : promotions.length === 0 ? (
          <Typography variant="body2">No promotions yet.</Typography>
        ) : (
          <UiCard variant="outlined" size="sm">
            <UiCardBody>
              <Stack divider={<Divider />} spacing={1}>
                {promotions.map((p) => (
                  <Stack
                    key={p.id}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="subtitle2">{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.code ? `Code: ${p.code} • ` : ""}
                        {p.type}
                        {p.type !== "FREE_SHIPPING"
                          ? ` • Value: ${p.value}`
                          : ""}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {p.startsAt
                          ? new Date(p.startsAt).toLocaleString()
                          : "No start"}{" "}
                        →{" "}
                        {p.endsAt
                          ? new Date(p.endsAt).toLocaleString()
                          : "No end"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        size="small"
                        label={p.isActive ? "Active" : "Inactive"}
                        color={p.isActive ? "success" : "default"}
                      />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={`Prio ${p.stackingPriority}`}
                      />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </UiCardBody>
          </UiCard>
        )}

        {isAddOpen && (
          <UiCard title="New Promotion" variant="outlined" size="sm">
            <UiCardBody>
              <Stack spacing={2}>
                <TextField
                  label="Name"
                  fullWidth
                  size="small"
                  value={promoName}
                  onChange={(e) => setPromoName(e.target.value)}
                />
                <TextField
                  label="Code (optional)"
                  fullWidth
                  size="small"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="promo-type-label">Type</InputLabel>
                    <Select
                      labelId="promo-type-label"
                      label="Type"
                      value={promoType}
                      onChange={(e) =>
                        setPromoType(
                          e.target.value as
                            | "PERCENT"
                            | "FIXED"
                            | "FREE_SHIPPING"
                        )
                      }
                    >
                      <MenuItem value="PERCENT">Percent</MenuItem>
                      <MenuItem value="FIXED">Fixed Amount</MenuItem>
                      <MenuItem value="FREE_SHIPPING">Free Shipping</MenuItem>
                    </Select>
                  </FormControl>
                  {promoType !== "FREE_SHIPPING" && (
                    <TextField
                      label="Value"
                      type="number"
                      fullWidth
                      size="small"
                      value={promoValue}
                      onChange={(e) => setPromoValue(e.target.value)}
                    />
                  )}
                </Stack>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={promoSaving || !promoName}
                    onClick={createPromotion}
                  >
                    Save
                  </Button>
                </Stack>
              </Stack>
            </UiCardBody>
          </UiCard>
        )}
      </UiCardBody>
    </UiCard>
  );
};

export default PromotionsSection;
