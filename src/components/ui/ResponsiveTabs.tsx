import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Typography } from "@/components/ui";
import ComputerIcon from "@mui/icons-material/Computer";
import TabletIcon from "@mui/icons-material/Tablet";
import SmartphoneIcon from "@mui/icons-material/Smartphone";

export type ResponsiveView = "desktop" | "tablet" | "mobile";

interface ResponsiveTabsProps {
  currentView: ResponsiveView;
  onViewChange: (view: ResponsiveView) => void;
  showIcons?: boolean;
  className?: string;
}

const ResponsiveTabs: React.FC<ResponsiveTabsProps> = ({
  currentView,
  onViewChange,
  showIcons = true,
  className,
}) => {
  const handleChange = (
    event: React.SyntheticEvent,
    newValue: ResponsiveView
  ) => {
    onViewChange(newValue);
  };

  return (
    <Box
      sx={{
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: "12px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        marginBottom: 2,
      }}
      className={className}
    >
      <Tabs
        value={currentView}
        onChange={handleChange}
        variant="fullWidth"
        sx={{
          minHeight: "48px",
          "& .MuiTabs-indicator": {
            height: "3px",
            borderRadius: "3px 3px 0 0",
            background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
          },
          "& .MuiTab-root": {
            minHeight: "48px",
            textTransform: "none",
            fontWeight: 500,
            fontSize: "0.875rem",
            color: "#6b7280",
            "&.Mui-selected": {
              color: "#1f2937",
              fontWeight: 600,
            },
            "&:hover": {
              color: "#374151",
              backgroundColor: "rgba(52, 152, 219, 0.05)",
            },
          },
        }}
      >
        <Tab
          value="desktop"
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {showIcons && <ComputerIcon sx={{ fontSize: "1.2rem" }} />}
              <Typography variant="body2" component="span">
                Desktop
              </Typography>
            </Box>
          }
        />
        <Tab
          value="tablet"
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {showIcons && <TabletIcon sx={{ fontSize: "1.2rem" }} />}
              <Typography variant="body2" component="span">
                Tablet
              </Typography>
            </Box>
          }
        />
        <Tab
          value="mobile"
          label={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              {showIcons && <SmartphoneIcon sx={{ fontSize: "1.2rem" }} />}
              <Typography variant="body2" component="span">
                Mobile
              </Typography>
            </Box>
          }
        />
      </Tabs>
    </Box>
  );
};

export default ResponsiveTabs;
