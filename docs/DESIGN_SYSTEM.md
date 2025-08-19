# Design System Documentation

This document explains how to use the design system values and utilities in your Next.js application.

## Overview

The design system provides consistent spacing, colors, typography, shadows, and other design tokens that are used throughout the application. These values are defined in both CSS custom properties and TypeScript constants, ensuring consistency between styles and code.

## Core Values

### Spacing

- **Base Unit**: 4px
- **Scale**: xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (48px), 3xl (64px), 4xl (80px)

### Colors

- **Primary**: Blue scale (50-900)
- **Neutral**: Gray scale (50-900)
- **Semantic**: Success (green), Warning (yellow), Error (red)
- **Background**: Primary, Secondary, Tertiary
- **Surface**: Primary, Secondary, Tertiary, Elevated
- **Text**: Primary, Secondary, Tertiary, Disabled, Inverse

### Typography

- **Font Families**: Base (system fonts), Mono (monospace)
- **Font Sizes**: h1 (2.5rem) through caption (0.75rem)
- **Font Weights**: 400 (normal), 600 (semibold), 700 (bold)
- **Line Heights**: Optimized for each font size

### Border Radius

- **Scale**: none (0), sm (4px), md (8px), lg (12px), xl (16px), 2xl (20px), 3xl (24px), full (9999px)

### Shadows

- **Scale**: none, sm, md, lg, xl, 2xl
- **Usage**: Elevation levels for components

### Transitions

- **Durations**: fast (150ms), normal (200ms), slow (300ms)
- **Easing**: ease-in-out

## Usage

### 1. Using the Hook

```tsx
import { useDesignSystem } from "@/components/ui";

function MyComponent() {
  const { colors, spacing, typography, shadows } = useDesignSystem();

  return (
    <div
      style={{
        backgroundColor: colors.background.primary,
        padding: spacing.md,
        fontSize: typography.fontSize.h3,
        boxShadow: shadows.md,
      }}
    >
      Content
    </div>
  );
}
```

### 2. Using Individual Hooks

```tsx
import { useColors, useSpacing } from "@/components/ui";

function MyComponent() {
  const colors = useColors();
  const spacing = useSpacing();

  return (
    <div
      style={{
        backgroundColor: colors.primary[500],
        margin: spacing.lg,
      }}
    >
      Content
    </div>
  );
}
```

### 3. Using Constants Directly

```tsx
import { COLORS, SPACING, TYPOGRAPHY } from "@/components/ui/constants/theme";

function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: COLORS.PRIMARY[500],
        padding: SPACING.MD,
        fontSize: TYPOGRAPHY.FONT_SIZE.H3,
      }}
    >
      Content
    </div>
  );
}
```

### 4. Using CSS Custom Properties

```tsx
function MyComponent() {
  return (
    <div
      style={{
        backgroundColor: "var(--color-primary-500)",
        padding: "var(--spacing-md)",
        fontSize: "var(--font-size-h3)",
      }}
    >
      Content
    </div>
  );
}
```

## Utility Functions

### Spacing Utilities

```tsx
import { createSpacing, getResponsiveSpacing } from "@/utils/designSystemUtils";

// Create custom spacing
const customSpacing = createSpacing(6); // 24px

// Get responsive spacing
const responsiveSpacing = getResponsiveSpacing("md");
// Returns: { mobile: '12px', tablet: '16px', desktop: '20px', largeDesktop: '24px' }
```

### Color Utilities

```tsx
import {
  getColorWithOpacity,
  getContrastColor,
} from "@/utils/designSystemUtils";

// Add opacity to colors
const semiTransparent = getColorWithOpacity("#3b82f6", 0.5); // rgba(59, 130, 246, 0.5)

// Get contrast color
const textColor = getContrastColor("#ffffff"); // Returns dark text for light background
```

### Typography Utilities

```tsx
import {
  createTypographyScale,
  getLineHeight,
} from "@/utils/designSystemUtils";

// Create custom typography scale
const customScale = createTypographyScale(18); // Base size 18px

// Calculate line height
const lineHeight = getLineHeight("16px", 1.6); // 25.6px
```

### Shadow Utilities

```tsx
import {
  createCustomShadow,
  getElevationShadow,
} from "@/utils/designSystemUtils";

// Create custom shadow
const customShadow = createCustomShadow(0, 2, 8, 0, "rgba(0, 0, 0, 0.15)");

// Get elevation shadow
const elevationShadow = getElevationShadow(3); // Returns large shadow
```

### Layout Utilities

```tsx
import { createContainer, createGrid } from "@/utils/designSystemUtils";

// Create responsive container
const containerStyles = createContainer("1200px");

// Create grid layout
const gridStyles = createGrid(3, "lg"); // 3 columns with large gap
```

## Best Practices

### 1. Use Design System Values

Always use design system values instead of hardcoded values:

```tsx
// ✅ Good
<div style={{ padding: spacing.md, backgroundColor: colors.primary[500] }}>

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: '#3b82f6' }}>
```

### 2. Use Semantic Colors

Use semantic color names instead of specific hex values:

```tsx
// ✅ Good
<div style={{ backgroundColor: colors.background.primary }}>

// ❌ Bad
<div style={{ backgroundColor: '#f8fafc' }}>
```

### 3. Use Responsive Utilities

Use responsive utilities for different screen sizes:

```tsx
// ✅ Good
const responsivePadding = getResponsiveSpacing("lg");

// ❌ Bad
const padding = "24px"; // Fixed value
```

### 4. Use CSS Custom Properties for Styling

Use CSS custom properties when writing CSS:

```css
/* ✅ Good */
.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-md);
}

/* ❌ Bad */
.my-component {
  background-color: #3b82f6;
  padding: 16px;
}
```

## Examples

### Button Component

```tsx
import { useDesignSystem } from "@/components/ui";

function Button({ children, variant = "primary", size = "md" }) {
  const { colors, spacing, typography, borderRadius, shadows, transitions } =
    useDesignSystem();

  const buttonStyles = {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.fontSize.body2,
    fontWeight: typography.fontWeight.h6,
    borderRadius: borderRadius.md,
    border: "none",
    cursor: "pointer",
    transition: transitions.normal,
    boxShadow: shadows.sm,
    backgroundColor:
      variant === "primary" ? colors.primary[500] : colors.neutral[200],
    color: variant === "primary" ? colors.text.inverse : colors.text.primary,
  };

  return <button style={buttonStyles}>{children}</button>;
}
```

### Card Component

```tsx
import { useDesignSystem } from "@/components/ui";

function Card({ children, elevation = 1 }) {
  const { colors, spacing, borderRadius, shadows } = useDesignSystem();

  const cardStyles = {
    backgroundColor: colors.surface.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    boxShadow: shadows[elevation === 1 ? "sm" : "md"],
    border: `1px solid ${colors.neutral[200]}`,
  };

  return <div style={cardStyles}>{children}</div>;
}
```

## Migration Guide

If you're updating existing components to use the design system:

1. **Replace hardcoded values** with design system constants
2. **Use semantic color names** instead of hex values
3. **Apply consistent spacing** using the spacing scale
4. **Use typography scale** for font sizes
5. **Apply consistent shadows** and border radius

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure you're importing from the correct paths
2. **Missing values**: Check that the design system constant exists
3. **CSS custom properties**: Verify the CSS file is imported

### Getting Help

- Check the constants file for available values
- Use the utility functions for common patterns
- Refer to the CSS custom properties for styling
- Use the hook for dynamic access to values

## Future Enhancements

- Dark mode support
- Theme switching
- Custom theme creation
- Design token export for design tools
- Accessibility contrast checking
- Performance optimizations
