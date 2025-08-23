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
} from "@mui/material";
import { Card as UiCard, CardBody as UiCardBody } from "@/components/ui";

type InlineTaxRule = {
  id: string;
  description?: string;
  percentage: string; // decimal string e.g. "0.05" for 5%
  isInclusive: boolean;
  isGST: boolean;
};

const TaxSettingsSection: React.FC = () => {
  // Form state
  const [taxDesc, setTaxDesc] = React.useState("");
  const [taxRate, setTaxRate] = React.useState("0"); // percent display
  const [taxInclusiveFlag, setTaxInclusiveFlag] = React.useState(false);
  const [taxIsGst, setTaxIsGst] = React.useState(false);

  // Data state
  const [inlineTaxRules, setInlineTaxRules] = React.useState<InlineTaxRule[]>(
    []
  );

  // Edit state
  const [editTaxId, setEditTaxId] = React.useState<string | null>(null);
  const [editTaxDesc, setEditTaxDesc] = React.useState("");
  const [editTaxRate, setEditTaxRate] = React.useState("0");
  const [editTaxInclusive, setEditTaxInclusive] = React.useState(false);
  const [editTaxIsGst, setEditTaxIsGst] = React.useState(false);

  const addInlineTaxRule = React.useCallback(() => {
    const parsed = parseFloat(taxRate);
    if (Number.isNaN(parsed)) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    setInlineTaxRules((prev) => [
      ...prev,
      {
        id,
        description: taxDesc || undefined,
        percentage: String(parsed / 100),
        isInclusive: taxInclusiveFlag,
        isGST: taxIsGst,
      },
    ]);
    setTaxDesc("");
    setTaxRate("0");
    setTaxInclusiveFlag(false);
    setTaxIsGst(false);
  }, [taxDesc, taxRate, taxInclusiveFlag, taxIsGst]);

  const removeInlineTaxRule = React.useCallback((id: string) => {
    setInlineTaxRules((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const startEditTaxRule = React.useCallback(
    (id: string) => {
      const rule = inlineTaxRules.find((r) => r.id === id);
      if (!rule) return;
      setEditTaxId(id);
      setEditTaxDesc(rule.description || "");
      setEditTaxRate(String(Number(rule.percentage) * 100));
      setEditTaxInclusive(rule.isInclusive);
      setEditTaxIsGst(rule.isGST);
    },
    [inlineTaxRules]
  );

  const cancelEditTaxRule = React.useCallback(() => {
    setEditTaxId(null);
  }, []);

  const saveEditTaxRule = React.useCallback(() => {
    if (!editTaxId) return;
    const parsed = parseFloat(editTaxRate);
    if (Number.isNaN(parsed)) return;
    const decimal = String(parsed / 100);
    setInlineTaxRules((prev) =>
      prev.map((r) =>
        r.id === editTaxId
          ? {
              ...r,
              description: editTaxDesc || undefined,
              percentage: decimal,
              isInclusive: editTaxInclusive,
              isGST: editTaxIsGst,
            }
          : r
      )
    );
    setEditTaxId(null);
  }, [editTaxId, editTaxDesc, editTaxRate, editTaxInclusive, editTaxIsGst]);

  const InfoRow: React.FC<{
    label: string;
    value: React.ReactNode;
    color: string;
  }> = ({ label, value, color }) => (
    <Box sx={{ borderLeft: `4px solid ${color}`, pl: 1.5 }}>
      <Typography
        variant="caption"
        sx={{
          color: "#4b5563",
          fontWeight: 500,
          fontSize: "12px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#1f2937", fontSize: "14px", mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );

  return (
    <UiCard title="Tax Settings" variant="outlined" size="sm" compactHeader>
      <UiCardBody>
        <Stack spacing={2}>
          <Typography variant="subtitle2">Add Tax</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Tax Description"
              fullWidth
              size="small"
              value={taxDesc}
              onChange={(e) => setTaxDesc(e.target.value)}
            />
            <TextField
              label="Tax Value (%)"
              type="number"
              fullWidth
              size="small"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={taxInclusiveFlag}
                  onChange={(e) => setTaxInclusiveFlag(e.target.checked)}
                />
              }
              label="Inclusive"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={taxIsGst}
                  onChange={(e) => setTaxIsGst(e.target.checked)}
                />
              }
              label="GST"
            />
            <Button
              variant="contained"
              size="small"
              onClick={addInlineTaxRule}
            >
              Add
            </Button>
          </Stack>
          {inlineTaxRules.length === 0 ? (
            <Typography variant="body2">No tax entries.</Typography>
          ) : (
            <Stack spacing={1}>
              {inlineTaxRules.map((r) => (
                <Box
                  key={r.id}
                  sx={{
                    width: "100%",
                    maxWidth: editTaxId === r.id ? 320 : 320,
                    overflow: "hidden",
                  }}
                >
                  <UiCard
                    variant="outlined"
                    size={editTaxId === r.id ? "md" : "sm"}
                    title={r.description || "Tax"}
                    compactHeader
                    headerAction={
                      editTaxId === r.id ? undefined : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => startEditTaxRule(r.id)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="outlined"
                            onClick={() => removeInlineTaxRule(r.id)}
                          >
                            Remove
                          </Button>
                        </Stack>
                      )
                    }
                  >
                    <UiCardBody>
                      {editTaxId === r.id ? (
                        <Stack spacing={1.5}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                            sx={{ minWidth: 0 }}
                          >
                            <TextField
                              label="Description"
                              fullWidth
                              size="small"
                              value={editTaxDesc}
                              onChange={(e) => setEditTaxDesc(e.target.value)}
                            />
                            <TextField
                              label="Rate (%)"
                              type="number"
                              fullWidth
                              size="small"
                              value={editTaxRate}
                              onChange={(e) => setEditTaxRate(e.target.value)}
                            />
                          </Stack>
                          <Box
                            sx={{
                              mt: 1,
                              p: 1.25,
                              borderRadius: 2,
                              background:
                                "linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(124,58,237,0.06) 100%)",
                                border: "1px solid rgba(0,0,0,0.06)",
                                overflow: "hidden",
                              }}
                            >
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                                alignItems={{ xs: "flex-start", sm: "center" }}
                              >
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={editTaxInclusive}
                                      onChange={(e) =>
                                        setEditTaxInclusive(e.target.checked)
                                      }
                                    />
                                  }
                                  label="Inclusive"
                                />
                                <FormControlLabel
                                  control={
                                    <Switch
                                      checked={editTaxIsGst}
                                      onChange={(e) =>
                                        setEditTaxIsGst(e.target.checked)
                                      }
                                    />
                                  }
                                  label="GST"
                                />
                              </Stack>
                              <Stack
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1}
                                justifyContent="flex-end"
                                sx={{ mt: 1 }}
                              >
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={cancelEditTaxRule}
                                  sx={{ width: { xs: "100%", sm: "auto" } }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  onClick={saveEditTaxRule}
                                  sx={{ width: { xs: "100%", sm: "auto" } }}
                                >
                                  Save
                                </Button>
                              </Stack>
                            </Box>
                          </Stack>
                        ) : (
                          <Stack spacing={1.25} sx={{ wordBreak: "break-word" }}>
                            <InfoRow
                              label="Rate"
                              value={`${Number(r.percentage) * 100}%`}
                              color="#bfdbfe"
                            />
                            <InfoRow
                              label="Mode"
                              value={r.isInclusive ? "Inclusive" : "Exclusive"}
                              color="#ddd6fe"
                            />
                            <InfoRow
                              label="GST"
                              value={r.isGST ? "Yes" : "No"}
                              color="#fbbf24"
                            />
                          </Stack>
                        )}
                      </UiCardBody>
                    </UiCard>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </UiCardBody>
      </UiCard>
    );
};

export default TaxSettingsSection;
