"use client";

import React from "react";
import { PageLayout } from "@/components/ui";

/**
 * Standardized Page Template
 *
 * This template shows how to create new pages with consistent structure.
 * It's now an alias for PageLayout for backward compatibility.
 *
 * Usage:
 * 1. Use PageLayout directly for new pages
 * 2. This component is maintained for backward compatibility
 * 3. Consider migrating to PageLayout for new development
 */

interface PageTemplateProps {
  title: string;
  description: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
  children?: React.ReactNode;
}

export default function PageTemplate({
  title,
  description,
  breadcrumbs,
  children,
}: PageTemplateProps) {
  return (
    <PageLayout
      title={title}
      description={description}
      breadcrumbs={breadcrumbs}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Content will be added here */}
        {children}
      </div>
    </PageLayout>
  );
}

// Export as alias for backward compatibility
export { PageTemplate as PageTemplate };
