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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Tabs,
  Tab,
} from "@mui/material";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

export default function TaxSettingsPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState(0);
  const handleTabChange = (_: React.SyntheticEvent, v: number) => setTab(v);

  // Settings state
  const [priceIncludesTax, setPriceIncludesTax] = React.useState(false);
  const [roundingStrategy, setRoundingStrategy] = React.useState<
    "LINE" | "TOTAL"
  >("LINE");
  const [defaultPriceMode, setDefaultPriceMode] = React.useState<
    "INCLUSIVE" | "EXCLUSIVE"
  >("EXCLUSIVE");
  const [defaultTaxClassCode, setDefaultTaxClassCode] = React.useState("");
  const [shippingTaxClassCode, setShippingTaxClassCode] = React.useState("");

  // Lists
  type TaxClassRow = { id: string; name: string; code: string };
  type TaxRuleRow = {
    id: string;
    classId: string;
    percentage: string;
    priority: number;
  };
  const [classes, setClasses] = React.useState<TaxClassRow[]>([]);
  const [rules, setRules] = React.useState<TaxRuleRow[]>([]);

  // Quick rule add
  const [quickClassCode, setQuickClassCode] = React.useState("");
  const [quickRatePercent, setQuickRatePercent] = React.useState("");

  async function loadAll() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/api/settings/tax", {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to load tax settings");
      const d = json.data;
      setClasses(d.classes || []);
      setRules(d.rules || []);
      if (d.settings) {
        setPriceIncludesTax(d.settings.priceIncludesTax);
        setRoundingStrategy(d.settings.roundingStrategy);
        setDefaultPriceMode(d.settings.defaultPriceMode);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadAll();
  }, []);

  async function saveSettings() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/api/settings/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            priceIncludesTax,
            roundingStrategy,
            defaultPriceMode,
            defaultTaxClassCode: defaultTaxClassCode || null,
            shippingTaxClassCode: shippingTaxClassCode || null,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to save tax settings");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function seedSG() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth("/api/settings/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: "SG_BASIC" }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to seed SG");
      await loadAll();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function addOrUpdateQuickRule() {
    try {
      setLoading(true);
      setError(null);
      if (!quickClassCode || !quickRatePercent) {
        throw new Error("Class and Rate are required");
      }
      const percentNum = Number(quickRatePercent);
      if (!Number.isFinite(percentNum) || percentNum < 0) {
        throw new Error("Invalid rate");
      }
      const percentage = (percentNum / 100).toFixed(4);
      const res = await fetchWithAuth("/api/settings/tax", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          replace: false,
          rules: [
            {
              taxClassCode: quickClassCode,
              percentage,
            },
          ],
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to add rule");
      await loadAll();
      setQuickRatePercent("");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout
      title="Tax Settings"
      description="Configure tax classes, zones, rules, and default price mode."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Tax" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Configuration"
        showSave
        showRefresh
        onSave={saveSettings}
        onRefresh={loadAll}
      >
        <Card>
          <CardHeader
            title="Tax Settings"
            action={
              <Button size="small" onClick={seedSG} disabled={loading}>
                Seed SG 9%
              </Button>
            }
          />
          <CardContent>
            {error && (
              <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={priceIncludesTax}
                    onChange={(e) => setPriceIncludesTax(e.target.checked)}
                  />
                }
                label="Prices include tax by default"
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="rounding-label">Rounding Strategy</InputLabel>
                  <Select
                    labelId="rounding-label"
                    label="Rounding Strategy"
                    value={roundingStrategy}
                    onChange={(e) => setRoundingStrategy(e.target.value as "LINE" | "TOTAL")}
                  >
                    <MenuItem value="LINE">By Line</MenuItem>
                    <MenuItem value="TOTAL">By Total</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small">
                  <InputLabel id="price-mode-label">
                    Default Price Mode
                  </InputLabel>
                  <Select
                    labelId="price-mode-label"
                    label="Default Price Mode"
                    value={defaultPriceMode}
                    onChange={(e) => setDefaultPriceMode(e.target.value as "EXCLUSIVE" | "INCLUSIVE")}
                  >
                    <MenuItem value="EXCLUSIVE">Exclusive</MenuItem>
                    <MenuItem value="INCLUSIVE">Inclusive</MenuItem>
                  </Select>
                </FormControl>
              </Stack>

              <Tabs
                value={tab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="Classes" />
                <Tab label="Rules" />
              </Tabs>

              {tab === 0 && (
                <Card variant="outlined">
                  <CardHeader title="Tax Classes" />
                  <CardContent>
                    <Stack spacing={2}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <TextField
                          label="Default Class Code"
                          fullWidth
                          size="small"
                          value={defaultTaxClassCode}
                          onChange={(e) =>
                            setDefaultTaxClassCode(e.target.value)
                          }
                        />
                        <TextField
                          label="Shipping Class Code"
                          fullWidth
                          size="small"
                          value={shippingTaxClassCode}
                          onChange={(e) =>
                            setShippingTaxClassCode(e.target.value)
                          }
                        />
                      </Stack>
                      <Divider />
                      {classes.length === 0 ? (
                        <Typography variant="body2">No classes.</Typography>
                      ) : (
                        <Stack divider={<Divider />}>
                          {classes.map((c) => (
                            <Stack
                              key={c.id}
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography variant="body2">{c.name}</Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {c.code}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {tab === 1 && (
                <Card variant="outlined">
                  <CardHeader title="Tax Rules" />
                  <CardContent>
                    <Stack spacing={2} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">
                        Quick Add Rule
                      </Typography>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                      >
                        <FormControl fullWidth size="small">
                          <InputLabel id="quick-class-label">
                            Tax Class
                          </InputLabel>
                          <Select
                            labelId="quick-class-label"
                            label="Tax Class"
                            value={quickClassCode}
                            onChange={(e) => setQuickClassCode(e.target.value)}
                          >
                            {classes.map((c) => (
                              <MenuItem key={c.code} value={c.code}>
                                {c.name} ({c.code})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <TextField
                          label="Rate (%)"
                          type="number"
                          fullWidth
                          size="small"
                          value={quickRatePercent}
                          onChange={(e) => setQuickRatePercent(e.target.value)}
                        />
                        <FormControl fullWidth size="small">
                          <InputLabel id="quick-inclusive-label">
                            Default Price Mode
                          </InputLabel>
                          <Select
                            labelId="quick-inclusive-label"
                            label="Default Price Mode"
                            value={defaultPriceMode}
                            onChange={(e) =>
                              setDefaultPriceMode(e.target.value as "EXCLUSIVE" | "INCLUSIVE")
                            }
                          >
                            <MenuItem value="EXCLUSIVE">Exclusive</MenuItem>
                            <MenuItem value="INCLUSIVE">Inclusive</MenuItem>
                          </Select>
                        </FormControl>
                        <Button
                          variant="contained"
                          onClick={addOrUpdateQuickRule}
                          disabled={loading}
                        >
                          Add/Update
                        </Button>
                      </Stack>
                    </Stack>
                    {rules.length === 0 ? (
                      <Typography variant="body2">No rules.</Typography>
                    ) : (
                      <Stack divider={<Divider />}>
                        {rules.map((r) => (
                          <Card key={r.id} variant="outlined">
                            <CardContent>
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                              >
                                <Stack>
                                  <Typography variant="subtitle2">
                                    {Number(r.percentage) * 100}%
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Priority {r.priority} • class:{r.classId}
                                  </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1}>
                                  <Button size="small" variant="outlined">
                                    Edit
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                  >
                                    Remove
                                  </Button>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                </Card>
              )}
            </Stack>
          </CardContent>
        </Card>
      </MainContainerBox>
    </PageLayout>
  );
}
