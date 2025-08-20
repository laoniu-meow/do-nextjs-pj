import React from "react";
import { Box, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import { Business, Edit } from "@mui/icons-material";
import { CompanyHeaderProps } from "../../types/company";

export const CompanyHeader: React.FC<CompanyHeaderProps> = ({
  companyName,
  logo,
  onLogoClick,
}) => {
  const handleLogoClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Box
        sx={{
          position: "relative",
          cursor: onLogoClick ? "pointer" : "default",
        }}
        onClick={handleLogoClick}
      >
        {logo ? (
          <Avatar
            src={logo}
            alt={`${companyName} logo`}
            sx={{
              width: 56,
              height: 56,
              border: "2px solid",
              borderColor: "primary.main",
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 56,
              height: 56,
              backgroundColor: "primary.main",
              border: "2px solid",
              borderColor: "primary.main",
            }}
          >
            <Business sx={{ fontSize: 32 }} />
          </Avatar>
        )}

        {onLogoClick && (
          <Tooltip title="Change logo">
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                bottom: -4,
                right: -4,
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: "bold",
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          {companyName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Company Dashboard
        </Typography>
      </Box>
    </Box>
  );
};

export default CompanyHeader;
