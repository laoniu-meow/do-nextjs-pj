import React from "react";
import { Box, Typography, Stack, Paper } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
import { designSystem } from "@/styles/design-system";
import { Button } from "./core/Button";

interface MainContainerBoxProps {
  title: string;
  children: React.ReactNode;
  onBuild?: () => void;
  onSave?: () => void;
  onUpload?: () => void;
  onRefresh?: () => void;
  showBuild?: boolean;
  showSave?: boolean;
  showUpload?: boolean;
  showRefresh?: boolean;
  saveDisabled?: boolean;
  uploadDisabled?: boolean;
}

const MainContainerBox: React.FC<MainContainerBoxProps> = ({
  title,
  children,
  onBuild,
  onSave,
  onUpload,
  onRefresh,
  showBuild = false,
  showSave = false,
  showUpload = false,
  showRefresh = false,
  saveDisabled = false,
  uploadDisabled = false,
}) => {
  return (
    <Paper
      elevation={0}
      className="main-container-box card-enhanced page-components"
      sx={{
        background: `linear-gradient(135deg, ${designSystem.colors.surface.primary} 0%, ${designSystem.colors.surface.secondary} 100%)`,
        border: `1px solid ${designSystem.colors.neutral[200]}`,
        borderRadius: designSystem.borderRadius.xl,
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`,
        padding: {
          xs: designSystem.spacing.md, // Reduced from lg
          sm: designSystem.spacing.lg, // Reduced from xl
          md: designSystem.spacing.xl, // Reduced from 2xl
        },
        minHeight: "120px", // Reduced from 200px
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`,
          borderColor: designSystem.colors.neutral[300],
          transform: "translateY(-2px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 25%, ${designSystem.colors.primary[700]} 50%, ${designSystem.colors.primary[600]} 75%, ${designSystem.colors.primary[500]} 100%)`,
          borderRadius: `${designSystem.borderRadius.xl} ${designSystem.borderRadius.xl} 0 0`,
          boxShadow: `0 2px 8px ${designSystem.colors.primary[500]}40`,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at top right, ${designSystem.colors.primary[50]}20 0%, transparent 50%)`,
          pointerEvents: "none",
          borderRadius: designSystem.borderRadius.xl,
        },
      }}
    >
      {/* Enhanced Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          marginBottom: designSystem.spacing.lg, // Reduced from 2xl to lg
          gap: { xs: designSystem.spacing.lg, sm: 0 },
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontSize: designSystem.typography.fontSize.H3,
              lineHeight: 1.3,
              fontWeight: 700,
              color: designSystem.colors.text.primary,
              margin: 0,
              position: "relative",
              letterSpacing: "-0.02em",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-12px",
                left: 0,
                width: "60px",
                height: "3px",
                background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 100%)`,
                borderRadius: designSystem.borderRadius.full,
                boxShadow: `0 2px 8px ${designSystem.colors.primary[500]}40`,
              },
            }}
          >
            {title}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: designSystem.spacing.md,
            "& .MuiButton-root": {
              minWidth: 120,
              height: 32,
              minHeight: 32,
              padding: "6px 14px",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
              },
            },
          }}
        >
          {showBuild && (
            <Button
              variant="primary"
              size="small"
              leftIcon={<BuildIcon />}
              onClick={onBuild}
            >
              Build
            </Button>
          )}

          {showSave && (
            <Button
              variant="success"
              size="small"
              leftIcon={<SaveIcon />}
              onClick={onSave}
              disabled={saveDisabled}
            >
              Save
            </Button>
          )}

          {showUpload && (
            <Button
              variant="secondary"
              size="small"
              leftIcon={<CloudUploadIcon />}
              onClick={onUpload}
              disabled={uploadDisabled}
            >
              Upload
            </Button>
          )}

          {showRefresh && (
            <Button
              variant="warning"
              size="small"
              leftIcon={<ReplayCircleFilledIcon />}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          )}
        </Stack>
      </Box>

      {/* Enhanced Content Section */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          "& > *:first-of-type": {
            marginTop: 0,
          },
          "& > *:last-of-type": {
            marginBottom: 0,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default MainContainerBox;
