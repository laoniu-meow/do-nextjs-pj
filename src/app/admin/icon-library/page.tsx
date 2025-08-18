"use client";

import React, { useState } from "react";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { IconSelector } from "@/components/ui/IconSelector";
import { IconOption } from "@/components/ui/config/iconLibrary";

export default function IconLibraryPage() {
  const [selectedIcon, setSelectedIcon] = useState<IconOption | null>(null);

  return (
    <PageLayout
      title="Icon Library"
      description="Browse and select from our comprehensive collection of Material-UI icons for your website design."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Icon Library" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Icon Selection"
        showBuild={false}
        showSave={false}
        showUpload={false}
        showRefresh={false}
      >
        <div className="space-y-6">
          {/* Icon Selector Demo */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Icon Selector Demo
            </h3>
            <p className="text-gray-600 mb-4">
              Use the icon selector below to browse and select icons. You can
              search by name, filter by category, and see a preview of the
              selected icon.
            </p>

            <IconSelector
              selectedIconId={selectedIcon?.id}
              onIconSelect={setSelectedIcon}
              placeholder="Search for icons..."
              maxHeight="400px"
            />
          </div>

          {/* Selected Icon Preview */}
          {selectedIcon && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Selected Icon Preview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Icon Details
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedIcon.name}
                    </div>
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {selectedIcon.category}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      {selectedIcon.description}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {selectedIcon.id}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Icon Preview
                  </h4>
                  <div className="flex items-center gap-4">
                    <selectedIcon.icon
                      sx={{ fontSize: 48, color: "primary.main" }}
                    />
                    <div>
                      <p className="text-sm text-gray-600">Large (48px)</p>
                      <p className="text-sm text-gray-600">Primary color</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <selectedIcon.icon
                      sx={{ fontSize: 24, color: "text.secondary" }}
                    />
                    <div>
                      <p className="text-sm text-gray-600">Medium (24px)</p>
                      <p className="text-sm text-gray-600">Secondary color</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <selectedIcon.icon
                      sx={{ fontSize: 16, color: "error.main" }}
                    />
                    <div>
                      <p className="text-sm text-gray-600">Small (16px)</p>
                      <p className="text-sm text-gray-600">Error color</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Instructions */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              How to Use Icons
            </h3>
            <div className="space-y-3 text-blue-700">
              <p>
                <strong>1. Import:</strong> Import the icon you want to use from
                @mui/icons-material
              </p>
              <p>
                <strong>2. Usage:</strong> Use the icon component in your JSX
                with appropriate styling
              </p>
              <p>
                <strong>3. Customization:</strong> Apply colors, sizes, and
                other styles using the sx prop
              </p>
              <p>
                <strong>4. Integration:</strong> Use the IconSelector component
                in your settings forms
              </p>
            </div>
          </div>
        </div>
      </MainContainerBox>
    </PageLayout>
  );
}
