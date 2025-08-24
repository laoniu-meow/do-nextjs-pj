"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Typography } from "@mui/material";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement | null {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated (but wait for auth check to complete)
  React.useEffect(() => {
    // Only redirect if we're not loading AND not authenticated
    if (!isLoading && !isAuthenticated && typeof window !== "undefined") {
      // Add a small delay to ensure auth check is complete
      const timer = setTimeout(() => {
        router.push("/login");
      }, 100);

      return () => clearTimeout(timer);
    }

    // Return undefined for the case when no redirect is needed
    return undefined;
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="admin-layout">
        <main className="admin-content">
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <Typography variant="h6">Loading...</Typography>
          </div>
        </main>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="admin-layout">
      {/* Page Content */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
