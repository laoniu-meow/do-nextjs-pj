import React from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import { Edit, Delete, Business } from "@mui/icons-material";
import Image from "next/image";
import { CompanyProfileCardProps } from "../types/companyProfile";

export const CompanyProfileCard: React.FC<CompanyProfileCardProps> = ({
  company,
  index,
  onEdit,
  onRemove,
  isMainCompany,
}) => {
  // Safety check - ensure company has required properties
  if (!company || !company.name) {
    return null;
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(company, index);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
        overflow: "hidden",
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "white",
          padding: "16px 20px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Company Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flex: 1,
            }}
          >
            {/* Logo or Business Icon */}
            {company.logoUrl ? (
              <Image
                src={company.logoUrl}
                alt={`${company.name} logo`}
                width={32}
                height={32}
                style={{
                  borderRadius: "4px",
                  objectFit: "cover",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              />
            ) : (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <Business sx={{ fontSize: 18 }} />
              </Avatar>
            )}

            {/* Company Name and Status */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  lineHeight: 1.2,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {company.name}
              </Typography>

              <Chip
                label={isMainCompany ? "Main Company" : "Remote"}
                size="small"
                sx={{
                  backgroundColor: isMainCompany
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(255, 255, 255, 0.15)",
                  color: "white",
                  fontSize: "11px",
                  height: "20px",
                  mt: 0.5,
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: "8px", ml: 1 }}>
            <IconButton
              onClick={handleEdit}
              size="small"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "white",
                width: 32,
                height: 32,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <Edit sx={{ fontSize: 16 }} />
            </IconButton>

            {index > 0 && (
              <IconButton
                onClick={handleRemove}
                size="small"
                sx={{
                  backgroundColor: "rgba(239, 68, 68, 0.8)",
                  color: "white",
                  width: 32,
                  height: 32,
                  "&:hover": {
                    backgroundColor: "rgba(239, 68, 68, 1)",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      {/* Company Details */}
      <Box
        sx={{
          padding: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Email */}
        {company.email && (
          <Box
            sx={{
              borderLeft: "4px solid #bfdbfe",
              paddingLeft: "12px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontWeight: "500",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Email
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#1f2937",
                fontSize: "14px",
                mt: 0.5,
                wordBreak: "break-word",
              }}
            >
              {company.email}
            </Typography>
          </Box>
        )}

        {/* Contact */}
        {company.contact && (
          <Box
            sx={{
              borderLeft: "4px solid #bbf7d0",
              paddingLeft: "12px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontWeight: "500",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Contact
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#1f2937",
                fontSize: "14px",
                mt: 0.5,
                wordBreak: "break-word",
              }}
            >
              {company.contact}
            </Typography>
          </Box>
        )}

        {/* Address */}
        {company.address && (
          <Box
            sx={{
              borderLeft: "4px solid #ddd6fe",
              paddingLeft: "12px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontWeight: "500",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Address
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#1f2937",
                fontSize: "14px",
                mt: 0.5,
                wordBreak: "break-word",
              }}
            >
              {company.address}
              {company.country && `, ${company.country}`}
              {company.postalCode && ` ${company.postalCode}`}
            </Typography>
          </Box>
        )}

        {/* Registration Number */}
        {company.companyRegNumber && (
          <Box
            sx={{
              borderLeft: "4px solid #fbbf24",
              paddingLeft: "12px",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: "#4b5563",
                fontWeight: "500",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Registration Number
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#1f2937",
                fontSize: "14px",
                mt: 0.5,
                fontFamily: "monospace",
              }}
            >
              {company.companyRegNumber}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CompanyProfileCard;
