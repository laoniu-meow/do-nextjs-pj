"use client";

import React from "react";
import { useDesignSystem } from "@/components/ui";

export default function TestPage() {
  const { colors, spacing, typography } = useDesignSystem();

  return (
    <div
      style={{
        padding: spacing.LG,
        backgroundColor: colors.BACKGROUND.PRIMARY,
        color: colors.TEXT.PRIMARY,
        fontFamily: typography.FONT_FAMILY.BASE,
      }}
    >
      <h1
        style={{
          fontSize: typography.FONT_SIZE.H1,
          fontWeight: typography.FONT_WEIGHT.H1,
          marginBottom: spacing.MD,
        }}
      >
        Design System Test Page
      </h1>

      <p
        style={{
          fontSize: typography.FONT_SIZE.BODY1,
          lineHeight: typography.LINE_HEIGHT.BODY1,
          marginBottom: spacing.MD,
        }}
      >
        This is a test page to verify the design system is working correctly.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: spacing.MD,
          marginTop: spacing.LG,
        }}
      >
        <div
          style={{
            padding: spacing.MD,
            backgroundColor: colors.SURFACE.PRIMARY,
            borderRadius: "8px",
            border: `1px solid ${colors.NEUTRAL[200]}`,
          }}
        >
          <h3
            style={{
              fontSize: typography.FONT_SIZE.H3,
              marginBottom: spacing.SM,
              color: colors.PRIMARY[600],
            }}
          >
            Colors
          </h3>
          <p>Primary: {colors.PRIMARY[500]}</p>
          <p>Neutral: {colors.NEUTRAL[500]}</p>
        </div>

        <div
          style={{
            padding: spacing.MD,
            backgroundColor: colors.SURFACE.SECONDARY,
            borderRadius: "8px",
            border: `1px solid ${colors.NEUTRAL[200]}`,
          }}
        >
          <h3
            style={{
              fontSize: typography.FONT_SIZE.H3,
              marginBottom: spacing.SM,
              color: colors.PRIMARY[600],
            }}
          >
            Spacing
          </h3>
          <p>Small: {spacing.SM}</p>
          <p>Medium: {spacing.MD}</p>
          <p>Large: {spacing.LG}</p>
        </div>

        <div
          style={{
            padding: spacing.MD,
            backgroundColor: colors.SURFACE.TERTIARY,
            borderRadius: "8px",
            border: `1px solid ${colors.NEUTRAL[200]}`,
          }}
        >
          <h3
            style={{
              fontSize: typography.FONT_SIZE.H3,
              marginBottom: spacing.SM,
              color: colors.PRIMARY[600],
            }}
          >
            Typography
          </h3>
          <p>H1: {typography.FONT_SIZE.H1}</p>
          <p>Body: {typography.FONT_SIZE.BODY1}</p>
          <p>Caption: {typography.FONT_SIZE.CAPTION}</p>
        </div>
      </div>
    </div>
  );
}
