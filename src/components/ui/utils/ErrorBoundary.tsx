"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Typography, Button } from "@mui/material";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to proper logging service in production
    // TODO: Implement production error logging service
    logger.error("Error caught by boundary", {
      error: error.message,
      errorInfo,
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="error" gutterBottom>
            Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            An unexpected error occurred. Please try refreshing the page.
          </Typography>
          <Button variant="contained" onClick={this.handleReset} sx={{ mr: 2 }}>
            Try Again
          </Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}
