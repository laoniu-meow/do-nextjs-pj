"use client";

import React from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { Box, Typography, Button, Paper } from "@mui/material";
import Link from "next/link";

export default function AdminPage() {
  return (
    <PageLayout
      title="Dashboard"
      description="Welcome to your admin dashboard. Manage your website, content, and settings from here."
      breadcrumbs={[{ label: "Admin" }]}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Quick Navigation */}
        <MainContainerBox
          title="Quick Navigation"
          showBuild={false}
          showSave={false}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Company Profile
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage company settings and branding
              </Typography>
              <Link href="/admin/settings/company-profile" passHref>
                <Button variant="contained" size="small">
                  Go to Settings
                </Button>
              </Link>
            </Paper>

            <Paper
              sx={{
                p: 3,
                textAlign: "center",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Access all admin settings
              </Typography>
              <Link href="/admin/settings" passHref>
                <Button variant="contained" size="small">
                  Go to Settings
                </Button>
              </Link>
            </Paper>
          </Box>
        </MainContainerBox>
      </div>
    </PageLayout>
  );
}
