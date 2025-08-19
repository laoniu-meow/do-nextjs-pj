import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";
import SaveIcon from "@mui/icons-material/Save";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";

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
    <Box
      className="main-container-box"
      sx={{
        background:
          "linear-gradient(135deg, rgba(173, 216, 230, 0.1) 0%, rgba(255, 255, 255, 0.9) 100%)",
        backdropFilter: "blur(10px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        boxShadow: "0 8px 32px rgba(31, 38, 135, 0.15)",
        padding: { xs: 2, sm: 3, md: 4 },
        minHeight: "200px",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        maxWidth: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(45deg, rgba(173, 216, 230, 0.05) 0%, rgba(255, 255, 255, 0.1) 100%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          marginBottom: 3,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 600,
            color: "#2c3e50",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          {title}
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: { xs: 1, sm: 1.5 },
          }}
        >
          {showBuild && (
            <Button
              variant="contained"
              startIcon={<BuildIcon />}
              onClick={onBuild}
              sx={{
                background: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
                minWidth: { xs: "auto", sm: "100px" },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #2980b9 0%, #1f5f8b 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(52, 152, 219, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Build
            </Button>
          )}

          {showSave && (
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={onSave}
              disabled={saveDisabled}
              sx={{
                background: saveDisabled
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                  : "linear-gradient(135deg, #27ae60 0%, #229954 100%)",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "8px 12px", sm: "10px 16px" },
                minWidth: { xs: "80px", sm: "100px" },
                boxShadow: saveDisabled
                  ? "none"
                  : "0 4px 12px rgba(39, 174, 96, 0.3)",
                "&:hover": {
                  background: saveDisabled
                    ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                    : "linear-gradient(135deg, #229954 0%, #1e8449 100%)",
                  transform: saveDisabled ? "none" : "translateY(-2px)",
                  boxShadow: saveDisabled
                    ? "none"
                    : "0 6px 16px rgba(39, 174, 96, 0.4)",
                },
                "&:active": {
                  transform: saveDisabled ? "none" : "translateY(0)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: saveDisabled ? "not-allowed" : "pointer",
                opacity: saveDisabled ? 0.6 : 1,
              }}
            >
              Save
            </Button>
          )}

          {showUpload && (
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={onUpload}
              disabled={uploadDisabled}
              sx={{
                background: uploadDisabled
                  ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                  : "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "8px 12px", sm: "10px 16px" },
                minWidth: { xs: "80px", sm: "100px" },
                boxShadow: uploadDisabled
                  ? "none"
                  : "0 4px 12px rgba(243, 156, 18, 0.3)",
                "&:hover": {
                  background: uploadDisabled
                    ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)"
                    : "linear-gradient(135deg, #e67e22 0%, #d35400 100%)",
                  transform: uploadDisabled ? "none" : "translateY(-2px)",
                  boxShadow: uploadDisabled
                    ? "none"
                    : "0 6px 16px rgba(243, 156, 18, 0.4)",
                },
                "&:active": {
                  transform: uploadDisabled ? "none" : "translateY(0)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: uploadDisabled ? "not-allowed" : "pointer",
                opacity: uploadDisabled ? 0.6 : 1,
              }}
            >
              Upload
            </Button>
          )}

          {showRefresh && (
            <Button
              variant="contained"
              startIcon={<ReplayCircleFilledIcon />}
              onClick={onRefresh}
              sx={{
                background: "linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)",
                color: "white",
                borderRadius: "8px",
                textTransform: "none",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "6px 12px", sm: "8px 16px" },
                minWidth: { xs: "auto", sm: "100px" },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #8e44ad 0%, #7d3c98 100%)",
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(155, 89, 182, 0.3)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Refresh
            </Button>
          )}
        </Stack>
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>{children}</Box>
    </Box>
  );
};

export default MainContainerBox;
