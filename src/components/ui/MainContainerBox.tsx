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
      sx={{
        background: designSystem.colors.surface.primary,
        border: `1px solid ${designSystem.colors.neutral[200]}`,
        borderRadius: designSystem.borderRadius.xl,
        boxShadow: designSystem.shadows.md,
        padding: {
          xs: designSystem.spacing.md,
          sm: designSystem.spacing.lg,
          md: designSystem.spacing.xl,
        },
        minHeight: "200px",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
        transition: designSystem.transitions.normal,
        "&:hover": {
          boxShadow: designSystem.shadows.lg,
          borderColor: designSystem.colors.neutral[300],
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${designSystem.colors.primary[500]} 0%, ${designSystem.colors.primary[600]} 100%)`,
          borderRadius: `${designSystem.borderRadius.xl} ${designSystem.borderRadius.xl} 0 0`,
        },
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          marginBottom: designSystem.spacing.xl,
          gap: { xs: designSystem.spacing.md, sm: 0 },
          paddingTop: designSystem.spacing.sm,
        }}
      >
        <Typography
          variant="h3"
          component="h2"
          sx={{
            ...designSystem.typography.h3,
            color: designSystem.colors.text.primary,
            margin: 0,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: "-8px",
              left: 0,
              width: "40px",
              height: "3px",
              background: designSystem.colors.primary[500],
              borderRadius: designSystem.borderRadius.full,
            },
          }}
        >
          {title}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: designSystem.spacing.sm,
          }}
        >
          {showBuild && (
            <Button
              variant="primary"
              leftIcon={<BuildIcon />}
              onClick={onBuild}
            >
              Build
            </Button>
          )}

          {showSave && (
            <Button
              variant="success"
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
              leftIcon={<ReplayCircleFilledIcon />}
              onClick={onRefresh}
            >
              Refresh
            </Button>
          )}
        </Stack>
      </Box>

      {/* Content Section */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          "& > *:first-of-type": {
            marginTop: 0,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default MainContainerBox;
