"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { TextField } from "@mui/material";
import { CompanyProfileData } from "@/hooks/useCompanyProfile";

interface CompanyProfileCardProps {
  type: "MAIN" | "BRANCH";
  profile: CompanyProfileData;
  index: number;
  isEditing: boolean;
  onEdit: (index: number) => void;
  onUpdate: (index: number, data: Partial<CompanyProfileData>) => void;
  onRemove?: (index: number) => void;
}

export default function CompanyProfileCard({
  type,
  profile,
  index,
  isEditing,
  onEdit,
  onUpdate,
  onRemove,
}: CompanyProfileCardProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  const isMainCard = type === "MAIN";

  const handleEdit = () => {
    try {
      onEdit(index);
    } catch {
      // Log error to proper logging service in production
      // For now, silently handle errors
    }
  };

  const handleRemove = () => {
    try {
      if (onRemove) {
        onRemove(index);
      }
    } catch {
      // Log error to proper logging service in production
      // For now, silently handle errors
    }
  };

  const handleInputChange = (
    field: keyof CompanyProfileData,
    value: string | boolean
  ) => {
    try {
      onUpdate(index, { [field]: value });
    } catch {
      // Log error to proper logging service in production
      // For now, silently handle errors
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!mounted) {
    return null;
  }

  try {
    const getCardTitle = () => {
      return isMainCard ? "Company Profile" : "Branch";
    };

    const getCardStyles = () => {
      return {
        padding: "1.5rem",
        borderRadius: "16px",
        border: "none",
        backgroundColor: isMainCard ? "#fafbff" : "white",
        boxShadow: isMainCard
          ? "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: isMainCard
            ? "0 20px 40px -10px rgba(59, 130, 246, 0.15), 0 10px 20px -5px rgba(59, 130, 246, 0.1)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        "&::before": isMainCard
          ? {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)",
              borderRadius: "16px 16px 0 0",
            }
          : {},
      };
    };

    return (
      <Paper sx={getCardStyles()} elevation={0}>
        {/* Card Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            gap: { xs: 1.5, sm: 1 },
            mb: { xs: 2.5, sm: 2 },
            pb: { xs: 1.5, sm: 1.5 },
            borderBottom: "none",
            position: "relative",
          }}
        >
          {/* Icon and Title Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: isMainCard
                  ? "rgba(59, 130, 246, 0.1)"
                  : "rgba(0, 0, 0, 0.04)",
                color: isMainCard ? "primary.main" : "grey.600",
              }}
            >
              <BusinessIcon sx={{ fontSize: "1.25rem" }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: isMainCard ? "primary.main" : "grey.900",
                  fontSize: "1.125rem",
                  letterSpacing: "-0.025em",
                }}
              >
                {getCardTitle()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isMainCard ? "primary.600" : "grey.500",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  mt: 0.25,
                }}
              >
                {isMainCard ? "Primary business entity" : "Additional location"}
              </Typography>
            </Box>
          </Box>

          {/* Badge and Action Buttons Section - Stacked below on mobile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              width: "100%",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            {isMainCard && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "16px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  boxShadow: "0 2px 4px rgba(59, 130, 246, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                Main
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 1.5, ml: { xs: 0, sm: "auto" } }}>
              <Tooltip title="Edit">
                <IconButton
                  onClick={handleEdit}
                  color="primary"
                  size="small"
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": { backgroundColor: "primary.dark" },
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>

              {/* Only show remove button for non-main cards */}
              {!isMainCard && (
                <Tooltip title="Remove">
                  <IconButton
                    onClick={handleRemove}
                    color="error"
                    size="small"
                    sx={{
                      backgroundColor: "error.main",
                      color: "white",
                      "&:hover": { backgroundColor: "error.dark" },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        {/* Company Information Fields */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {/* Company Name */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "grey.600",
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Company Name
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={profile.companyName || ""}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              disabled={!isEditing}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isEditing ? "white" : "transparent",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>

          {/* Company Registration Number */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "grey.600",
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Company Reg. Number
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={profile.companyRegNumber || ""}
              onChange={(e) =>
                handleInputChange("companyRegNumber", e.target.value)
              }
              disabled={!isEditing}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isEditing ? "white" : "transparent",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>

          {/* Address */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "grey.600",
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Address
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={profile.address || ""}
              onChange={(e) => handleInputChange("address", e.target.value)}
              disabled={!isEditing}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isEditing ? "white" : "transparent",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>

          {/* Country + Postal Code */}
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "grey.600",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Country
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={profile.country || ""}
                onChange={(e) => handleInputChange("country", e.target.value)}
                disabled={!isEditing}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "white" : "transparent",
                    border: "none",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "grey.600",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  mb: 0.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Postal Code
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={profile.postalCode || ""}
                onChange={(e) =>
                  handleInputChange("postalCode", e.target.value)
                }
                disabled={!isEditing}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isEditing ? "white" : "transparent",
                    border: "none",
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "none",
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Email */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "grey.600",
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Email
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={profile.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={!isEditing}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isEditing ? "white" : "transparent",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>

          {/* Contact */}
          <Box>
            <Typography
              variant="body2"
              sx={{
                color: "grey.600",
                fontSize: "0.8rem",
                fontWeight: 600,
                mb: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Contact
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={profile.contact || ""}
              onChange={(e) => handleInputChange("contact", e.target.value)}
              disabled={!isEditing}
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isEditing ? "white" : "transparent",
                  border: "none",
                  "& fieldset": {
                    border: "none",
                  },
                  "&:hover fieldset": {
                    border: "none",
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                  },
                },
              }}
            />
          </Box>
        </Box>
      </Paper>
    );
  } catch {
    // Log error to proper logging service in production
    // For now, silently handle errors
    return (
      <Paper sx={{ p: 2, border: "1px solid red" }}>
        <Typography color="error">
          Error loading company profile card. Please refresh the page.
        </Typography>
      </Paper>
    );
  }
}
