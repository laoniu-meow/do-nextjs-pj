"use client";

import React from "react";
import { Alert } from "@mui/material";
import { PageLayout, MainContainerBox } from "@/components/ui";
import { DynamicSettingsPanel } from "@/components/settings";
// Settings form is rendered inside DynamicSettingsPanel factory
import { HeroPreview } from "./HeroPreview";
import { useHeroPage } from "../hooks/useHeroPage";
import { Section } from "../services/heroPageApi";

export const HeroPage: React.FC = () => {
  const {
    sections,
    draftSections,
    isLoading,
    error,
    hasUnsavedChanges,
    hasStagingData,
    isSettingsOpen,
    canAddMore,
    addSection,
    removeSection,
    editSection,
    updateSection,
    reorderSections,
    beginDraft,
    applyDraft,
    closeSettings,
    saveToStaging,
    uploadToProduction,
  } = useHeroPage();

  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<Section[]>;
      if (Array.isArray(custom.detail)) {
        reorderSections(custom.detail);
      }
    };
    window.addEventListener("hero:reorder", handler as EventListener);
    return () =>
      window.removeEventListener("hero:reorder", handler as EventListener);
  }, [reorderSections]);

  const handleAddSection = () => {
    if (!canAddMore) return;
    const nextOrder = sections.length + (draftSections?.length ?? 0) + 1;
    const newSection: Section = {
      order: nextOrder,
      templateType: "HERO",
      templateData: {
        name: `Section ${nextOrder}`,
        mediaType: "image",
        mediaUrl: "",
        showDescription: false,
        showButton: false,
        buttonShape: "ROUNDED",
      },
    } as Section;
    addSection(newSection);
  };

  // Apply handled by applyDraft via DynamicSettingsPanel

  const handleSave = async () => {
    await saveToStaging();
  };

  const handleUpload = async () => {
    await uploadToProduction();
  };

  return (
    <PageLayout
      title="Hero Page"
      description="Configure your website hero section, main banner, and hero-specific settings."
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Settings", href: "/admin/settings" },
        { label: "Hero Page" },
      ]}
      maxWidth="xl"
    >
      <MainContainerBox
        title="Configuration"
        showBuild={true}
        showSave={true}
        showUpload={true}
        showRefresh={true}
        onBuild={beginDraft}
        onSave={handleSave}
        onUpload={handleUpload}
        onRefresh={() => window.location.reload()}
        saveDisabled={isLoading || !hasUnsavedChanges}
        uploadDisabled={isLoading || !hasStagingData}
      >
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Live Preview */}
        <HeroPreview
          sections={sections}
          onEditSection={(order) => editSection(order)}
        />

        {/* Action buttons are provided by MainContainerBox props above */}
      </MainContainerBox>

      {/* Settings Panel - render outside the preview container for correct overlay behavior */}
      <DynamicSettingsPanel
        pageType="hero-page"
        isOpen={isSettingsOpen}
        onClose={closeSettings}
        onApply={applyDraft}
        title="Hero Page Settings"
        sections={draftSections ?? sections}
        canAddMore={canAddMore}
        onAddSection={handleAddSection}
        onRemoveSection={removeSection}
        onUpdateSection={updateSection}
        onReorderSections={reorderSections}
      />
    </PageLayout>
  );
};

export default HeroPage;
