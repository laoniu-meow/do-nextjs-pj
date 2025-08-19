"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Paper,
  Grid,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Save, Palette, Settings, Dashboard } from "@mui/icons-material";
import { designSystem } from "@/styles/design-system";
import { Button } from "@/components/ui/core/Button";

interface HeaderMainSettingsProps {
  onApply: () => void;
  onCancel: () => void;
}

export const HeaderMainSettings: React.FC<HeaderMainSettingsProps> = ({
  onApply,
  onCancel,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteTitle: "Your Website",
    tagline: "Your company tagline here",
    showSearch: true,
    showUserMenu: true,
    stickyHeader: false,
    headerHeight: "64px",
    primaryColor: "#3b82f6",
  });

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Header settings saved:", settings);
      onApply();
    } catch (error) {
      console.error("Error saving header settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Color preview component
  const ColorPreview = ({ color }: { color: string }) => (
    <Box
      sx={{
        width: "24px",
        height: "24px",
        borderRadius: designSystem.borderRadius.md,
        background: color,
        border: `2px solid ${designSystem.colors.neutral[200]}`,
        display: "inline-block",
        marginLeft: designSystem.spacing.sm,
        boxShadow: designSystem.shadows.sm,
      }}
    />
  );

  return (
    <Box sx={{ maxWidth: "100%" }}>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          paddingBottom: designSystem.spacing.xl,
          marginBottom: designSystem.spacing.xl,
          borderBottom: `1px solid ${designSystem.colors.neutral[200]}`,
        }}
      >
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "64px",
            height: "64px",
            borderRadius: designSystem.borderRadius.xl,
            background: designSystem.colors.primary[50],
            color: designSystem.colors.primary[600],
            marginBottom: designSystem.spacing.md,
          }}
        >
          <Dashboard sx={{ fontSize: "32px" }} />
        </Box>

        <Typography
          variant="h4"
          sx={{
            ...designSystem.typography.h4,
            color: designSystem.colors.text.primary,
            marginBottom: designSystem.spacing.sm,
          }}
        >
          Header & Main Layout Settings
        </Typography>

        <Typography
          variant="body2"
          sx={{
            ...designSystem.typography.body2,
            color: designSystem.colors.text.secondary,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          Customize your website header, navigation, and main layout to match
          your brand and user experience requirements.
        </Typography>
      </Box>

      {/* Settings Form */}
      <Box sx={{ maxWidth: "100%" }}>
        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Paper
              elevation={0}
              sx={{
                padding: designSystem.spacing.lg,
                border: `1px solid ${designSystem.colors.neutral[200]}`,
                borderRadius: designSystem.borderRadius.lg,
                background: designSystem.colors.surface.secondary,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: designSystem.spacing.lg,
                }}
              >
                <Settings
                  sx={{
                    color: designSystem.colors.primary[600],
                    marginRight: designSystem.spacing.sm,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    ...designSystem.typography.h6,
                    color: designSystem.colors.text.primary,
                  }}
                >
                  Basic Information
                </Typography>
              </Box>

              <Box sx={{ space: designSystem.spacing.lg }}>
                <TextField
                  label="Site Title"
                  value={settings.siteTitle}
                  onChange={(e) =>
                    handleSettingChange("siteTitle", e.target.value)
                  }
                  fullWidth
                  size="small"
                  sx={{
                    marginBottom: designSystem.spacing.md,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: designSystem.borderRadius.md,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[600],
                      },
                    },
                  }}
                />

                <TextField
                  label="Tagline"
                  value={settings.tagline}
                  onChange={(e) =>
                    handleSettingChange("tagline", e.target.value)
                  }
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  sx={{
                    marginBottom: designSystem.spacing.md,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: designSystem.borderRadius.md,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[600],
                      },
                    },
                  }}
                />

                <TextField
                  label="Header Height"
                  value={settings.headerHeight}
                  onChange={(e) =>
                    handleSettingChange("headerHeight", e.target.value)
                  }
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip
                          label="px"
                          size="small"
                          sx={{
                            background: designSystem.colors.neutral[100],
                            color: designSystem.colors.text.secondary,
                          }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  helperText="e.g., 64px, 80px, 100px"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: designSystem.borderRadius.md,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[600],
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Box>

          {/* Appearance Section */}
          <Box sx={{ width: { xs: "100%", md: "50%" } }}>
            <Paper
              elevation={0}
              sx={{
                padding: designSystem.spacing.lg,
                border: `1px solid ${designSystem.colors.neutral[200]}`,
                borderRadius: designSystem.borderRadius.lg,
                background: designSystem.colors.surface.secondary,
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: designSystem.spacing.lg,
                }}
              >
                <Palette
                  sx={{
                    color: designSystem.colors.primary[600],
                    marginRight: designSystem.spacing.sm,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    ...designSystem.typography.h6,
                    color: designSystem.colors.text.primary,
                  }}
                >
                  Appearance
                </Typography>
              </Box>

              <Box sx={{ space: designSystem.spacing.lg }}>
                <TextField
                  label="Primary Color"
                  value={settings.primaryColor}
                  onChange={(e) =>
                    handleSettingChange("primaryColor", e.target.value)
                  }
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ColorPreview color={settings.primaryColor} />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Hex color code (e.g., #3b82f6)"
                  sx={{
                    marginBottom: designSystem.spacing.lg,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: designSystem.borderRadius.md,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[400],
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: designSystem.colors.primary[600],
                      },
                    },
                  }}
                />

                <Box sx={{ space: designSystem.spacing.md }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showSearch}
                        onChange={(e) =>
                          handleSettingChange("showSearch", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: designSystem.colors.primary[600],
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: designSystem.colors.primary[600],
                            },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ ...designSystem.typography.body2 }}>
                        Show Search Bar
                      </Typography>
                    }
                    sx={{ marginBottom: designSystem.spacing.sm }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.showUserMenu}
                        onChange={(e) =>
                          handleSettingChange("showUserMenu", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: designSystem.colors.primary[600],
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: designSystem.colors.primary[600],
                            },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ ...designSystem.typography.body2 }}>
                        Show User Menu
                      </Typography>
                    }
                    sx={{ marginBottom: designSystem.spacing.sm }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.stickyHeader}
                        onChange={(e) =>
                          handleSettingChange("stickyHeader", e.target.checked)
                        }
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: designSystem.colors.primary[600],
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              backgroundColor: designSystem.colors.primary[600],
                            },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ ...designSystem.typography.body2 }}>
                        Sticky Header
                      </Typography>
                    }
                  />
                </Box>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Box>

      {/* Action Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: designSystem.spacing.md,
          paddingTop: designSystem.spacing.xl,
          marginTop: designSystem.spacing.xl,
          borderTop: `1px solid ${designSystem.colors.neutral[200]}`,
        }}
      >
        <Button
          variant="outline"
          onClick={onCancel}
          sx={{
            borderRadius: designSystem.borderRadius.md,
            borderColor: designSystem.colors.neutral[300],
            color: designSystem.colors.text.secondary,
            textTransform: "none",
            padding: `${designSystem.spacing.sm} ${designSystem.spacing.lg}`,
            "&:hover": {
              borderColor: designSystem.colors.neutral[400],
              background: designSystem.colors.surface.secondary,
            },
          }}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={<Save />}
          sx={{
            background: designSystem.colors.primary[600],
            color: designSystem.colors.text.inverse,
            borderRadius: designSystem.borderRadius.md,
            textTransform: "none",
            padding: `${designSystem.spacing.sm} ${designSystem.spacing.lg}`,
            fontWeight: 600,
            "&:hover": {
              background: designSystem.colors.primary[700],
              transform: "translateY(-1px)",
              boxShadow: designSystem.shadows.lg,
            },
            "&:disabled": {
              background: designSystem.colors.neutral[300],
              color: designSystem.colors.text.disabled,
              transform: "none",
              boxShadow: "none",
            },
            transition: designSystem.transitions.normal,
          }}
        >
          {isLoading ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  );
};
