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
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Card as UiCard, CardBody as UiCardBody } from "@/components/ui";

export type TaxRuleInput = {
  description?: string;
  ratePercent: string; // e.g. "9" means 9%
  isInclusive: boolean;
  isGST: boolean;
};

export type TaxRuleRecord = TaxRuleInput & {
  id: string;
};

export interface TaxSettingsProps {
  title?: string;
  rules: TaxRuleRecord[];
  onAdd: (input: TaxRuleInput) => void;
  disabled?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function TaxSettings({
  title = "Tax Settings",
  rules,
  onAdd,
  disabled = false,
  onEdit,
  onRemove,
}: TaxSettingsProps) {
  const theme = useTheme();
  const gradientBg = `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.18
  )} 0%, ${alpha(theme.palette.info.main, 0.18)} 50%, ${alpha(
    theme.palette.secondary.main,
    0.18
  )} 100%)`;
  const [taxDesc, setTaxDesc] = React.useState("");
  const [taxRate, setTaxRate] = React.useState("0"); // percent display
  const [taxInclusiveFlag, setTaxInclusiveFlag] = React.useState(false);
  const [taxIsGst, setTaxIsGst] = React.useState(false);

  const handleAdd = React.useCallback(() => {
    const parsed = parseFloat(taxRate);
    if (Number.isNaN(parsed)) return;
    onAdd({
      description: taxDesc || undefined,
      ratePercent: String(parsed),
      isInclusive: taxInclusiveFlag,
      isGST: taxIsGst,
    });
    setTaxDesc("");
    setTaxRate("0");
    setTaxInclusiveFlag(false);
    setTaxIsGst(false);
  }, [taxDesc, taxRate, taxInclusiveFlag, taxIsGst, onAdd]);

  return (
    <UiCard title={title} variant="outlined" size="sm" compactHeader>
      <UiCardBody padding="sm">
        <Stack spacing={1}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              label="Tax Description"
              size="small"
              value={taxDesc}
              onChange={(e) => setTaxDesc(e.target.value)}
              disabled={disabled}
              sx={{ width: { xs: "100%", sm: 320 } }}
            />
            <TextField
              label="Tax Value (%)"
              type="number"
              size="small"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              disabled={disabled}
              sx={{ width: { xs: "100%", sm: 160 } }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={taxInclusiveFlag}
                  onChange={(e) => setTaxInclusiveFlag(e.target.checked)}
                  disabled={disabled}
                />
              }
              label="Inclusive"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={taxIsGst}
                  onChange={(e) => setTaxIsGst(e.target.checked)}
                  disabled={disabled}
                />
              }
              label="GST"
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleAdd}
              disabled={disabled}
            >
              Add
            </Button>
          </Stack>

          {rules.length === 0 ? (
            <Typography variant="body2">No tax entries.</Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {rules.map((r) => (
                <Box key={r.id} sx={{ width: "100%" }}>
                  <UiCard variant="outlined" size="sm" compactHeader>
                    <UiCardBody padding="sm">
                      <Box
                        sx={{
                          p: 1.25,
                          borderRadius: 2,
                          background: gradientBg,
                          border: `1px solid ${alpha(
                            theme.palette.common.black,
                            0.06
                          )}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <Stack spacing={0.5}>
                            {r.description ? (
                              <Typography variant="body2">
                                Description: {r.description}
                              </Typography>
                            ) : null}
                            <Typography variant="body2">
                              Rate: {r.ratePercent}%
                            </Typography>
                            <Typography variant="body2">
                              Mode: {r.isInclusive ? "Inclusive" : "Exclusive"}
                            </Typography>
                            <Typography variant="body2">
                              GST: {r.isGST ? "Yes" : "No"}
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <IconButton
                              size="small"
                              aria-label="Edit tax"
                              onClick={() =>
                                typeof onEdit === "function"
                                  ? onEdit(r.id)
                                  : undefined
                              }
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              aria-label="Remove tax"
                              color="error"
                              onClick={() =>
                                typeof onRemove === "function"
                                  ? onRemove(r.id)
                                  : undefined
                              }
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </UiCardBody>
                  </UiCard>
                </Box>
              ))}
            </Box>
          )}
        </Stack>
      </UiCardBody>
    </UiCard>
  );
}
