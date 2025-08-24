import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

export interface TaxRuleInput {
  description?: string;
  ratePercent: string;
  isInclusive: boolean;
  isGST: boolean;
}

export interface TaxRuleRecord extends TaxRuleInput {
  id: string;
}

interface TaxSettingsProps {
  rules: TaxRuleRecord[];
  onAdd: (input: TaxRuleInput) => void;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function TaxSettings({
  rules,
  onAdd,
  onEdit,
  onRemove,
}: TaxSettingsProps) {
  const [newRule, setNewRule] = React.useState<TaxRuleInput>({
    description: "",
    ratePercent: "0",
    isInclusive: false,
    isGST: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRule.ratePercent && parseFloat(newRule.ratePercent) >= 0) {
      onAdd(newRule);
      setNewRule({
        description: "",
        ratePercent: "0",
        isInclusive: false,
        isGST: false,
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Tax Rules Configuration
      </Typography>

      <Box
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            background: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <Typography
          variant="subtitle2"
          gutterBottom
          sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
        >
          Add New Tax Rule
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(12, 1fr)" },
              gap: 3,
              alignItems: "end",
            }}
          >
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 4" } }}>
              <TextField
                fullWidth
                label="Description"
                value={newRule.description}
                onChange={(e) =>
                  setNewRule((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="e.g., GST, Provincial Tax"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 2" } }}>
              <TextField
                fullWidth
                label="Rate %"
                type="number"
                value={newRule.ratePercent}
                onChange={(e) =>
                  setNewRule((prev) => ({
                    ...prev,
                    ratePercent: e.target.value,
                  }))
                }
                inputProps={{ min: 0, step: 0.01 }}
                required
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                  },
                }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 3" } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newRule.isInclusive}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        isInclusive: e.target.checked,
                      }))
                    }
                    color="primary"
                  />
                }
                label="Tax Inclusive"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 2" } }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newRule.isGST}
                    onChange={(e) =>
                      setNewRule((prev) => ({
                        ...prev,
                        isGST: e.target.checked,
                      }))
                    }
                    color="info"
                  />
                }
                label="GST"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  },
                }}
              />
            </Box>
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "span 1" } }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={
                  !newRule.ratePercent || parseFloat(newRule.ratePercent) < 0
                }
                sx={{
                  borderRadius: 1.5,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                }}
              >
                Add
              </Button>
            </Box>
          </Box>
        </form>
      </Box>

      {rules.length === 0 ? (
        <Alert severity="info">
          No tax rules configured. Add your first tax rule above.
        </Alert>
      ) : (
        <Box>
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Current Tax Rules ({rules.length})
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, 280px)",
              gap: 2,
              justifyContent: "flex-start",
            }}
          >
            {rules.map((rule, index) => {
              // Define different gradient backgrounds for variety
              const gradientBackgrounds = [
                "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Indigo
                "linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Purple
                "linear-gradient(135deg, rgba(236, 72, 153, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Pink
                "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Blue
                "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Emerald
                "linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Amber
                "linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Red
                "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(255, 255, 255, 0.9) 100%)", // Violet
              ];

              const hoverBackgrounds = [
                "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Indigo hover
                "linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Purple hover
                "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Pink hover
                "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Blue hover
                "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Emerald hover
                "linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Amber hover
                "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Red hover
                "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(255, 255, 255, 0.95) 100%)", // Violet hover
              ];

              const currentGradient =
                gradientBackgrounds[index % gradientBackgrounds.length];
              const currentHoverGradient =
                hoverBackgrounds[index % hoverBackgrounds.length];

              return (
                <Box
                  key={rule.id}
                  sx={{
                    width: "280px",
                    p: 1.5,
                    borderRadius: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "all 0.2s ease-in-out",
                    background: currentGradient,
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
                    cursor: "default",
                    "&:hover": {
                      transform: "translateY(-1px)",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                      background: currentHoverGradient,
                      borderColor: "rgba(99, 102, 241, 0.3)",
                    },
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 500,
                          display: "block",
                          mb: 0.25,
                        }}
                      >
                        Description
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        color="text.primary"
                        sx={{
                          wordBreak: "break-word",
                          fontSize: "0.875rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {rule.description || "No description"}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: "0.65rem",
                          fontWeight: 500,
                          display: "block",
                          mb: 0.25,
                        }}
                      >
                        Rate
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary.main"
                        sx={{ fontSize: "1.25rem", lineHeight: 1.2 }}
                      >
                        {rule.ratePercent}%
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 0.75,
                          backgroundColor: rule.isInclusive
                            ? "success.50"
                            : "warning.50",
                          color: rule.isInclusive
                            ? "success.700"
                            : "warning.700",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {rule.isInclusive ? "Inc" : "Exc"}
                      </Box>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 0.75,
                          backgroundColor: rule.isGST ? "info.50" : "grey.50",
                          color: rule.isGST ? "info.700" : "grey.700",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                        }}
                      >
                        {rule.isGST ? "GST" : "Reg"}
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        justifyContent: "flex-end",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => onEdit(rule.id)}
                        color="primary"
                        sx={{
                          width: 28,
                          height: 28,
                          backgroundColor: "primary.50",
                          "&:hover": {
                            backgroundColor: "primary.100",
                          },
                        }}
                      >
                        <EditIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onRemove(rule.id)}
                        color="error"
                        sx={{
                          width: 28,
                          height: 28,
                          backgroundColor: "error.50",
                          "&:hover": {
                            backgroundColor: "error.100",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
