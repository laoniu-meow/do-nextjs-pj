"use client";

import React from "react";
import { PageLayout, MainContainerBox, Typography } from "@/components/ui";
import { Box, Button, Paper } from "@mui/material";
import Link from "next/link";

export default function SettingsPage() {
  const settingsPages = [
    {
      title: "Company Profile",
      description: "Manage company settings and branding",
      href: "/admin/settings/company-profile",
      icon: "🏢",
    },
    {
      title: "Header & Main",
      description: "Customize website header and navigation",
      href: "/admin/settings/header-settings",
      icon: "🔝",
    },
    {
      title: "Hero Page",
      description: "Configure hero sections and main banner",
      href: "/admin/settings/hero-page",
      icon: "⭐",
    },
    {
      title: "Donations",
      description: "Manage donation campaigns and settings",
      href: "/admin/settings/donations",
      icon: "💝",
    },
    {
      title: "Footer",
      description: "Configure website footer and links",
      href: "/admin/settings/footer",
      icon: "🔽",
    },
    {
      title: "Pages",
      description: "Manage website pages and content structure",
      href: "/admin/settings/pages",
      icon: "📄",
    },
    {
      title: "Suppliers",
      description: "Manage supplier information and settings",
      href: "/admin/settings/suppliers",
      icon: "🚚",
    },
  ];

  return (
    <PageLayout
      title="Settings"
      description="Configure your website settings, content, and preferences. Choose a category below to get started."
      breadcrumbs={[{ label: "Admin", href: "/admin" }, { label: "Settings" }]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="All Settings"
        showBuild={false}
        showSave={false}
        showUpload={false}
        showRefresh={false}
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
          {settingsPages.map((page) => (
            <Paper
              key={page.href}
              sx={{
                p: 3,
                textAlign: "center",
                height: "150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition:
                  "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 3,
                },
              }}
            >
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                {page.icon}
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: 1 }}>
                {page.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginBottom: 2 }}
              >
                {page.description}
              </Typography>
              <Link href={page.href} passHref>
                <Button variant="contained" size="small">
                  Configure
                </Button>
              </Link>
            </Paper>
          ))}
        </Box>
      </MainContainerBox>
    </PageLayout>
  );
}
