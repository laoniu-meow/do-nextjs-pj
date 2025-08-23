# Layout Reversion Documentation

## Overview

This document explains the reversion of the layout system back to using `PageLayout` + `MainContainerBox` for both the company profile and header-main pages, as requested by the user.

## Current Layout System

**After the reversion**, both pages now use the same layout system:

1. **Main Page** (`src/app/page.tsx`): Uses `Header` + `Main` from `@/components/layout`
2. **Company Profile Page**: Uses `PageLayout` + `MainContainerBox` from `@/components/ui` ✅
3. **Header-Main Settings Page**: Uses `PageLayout` + `MainContainerBox` from `@/components/ui` ✅

## Changes Made

### 1. Company Profile Page (`src/features/company-profile/components/CompanyProfilePage.tsx`)

**Reverted to:**

```tsx
import { PageLayout, MainContainerBox } from "@/components/ui";

return (
  <PageLayout
    title="Company Profile"
    description="Configure your company profile..."
    breadcrumbs={[...]}
    maxWidth="xl"
  >
    <MainContainerBox title="Configuration" {...props}>
      {/* content */}
    </MainContainerBox>
  </PageLayout>
);
```

**Removed:**

- `Header` + `Main` components
- Custom header and main settings
- Custom CSS styling for the unified layout

### 2. Header-Main Settings Page (`src/features/header-main/components/HeaderMainPage.tsx`)

**Reverted to:**

```tsx
import { PageLayout, MainContainerBox } from "@/components/ui";

return (
  <PageLayout
    title="Header & Main"
    description="Customize your website header..."
    breadcrumbs={[...]}
    maxWidth="xl"
  >
    <MainContainerBox title="Configuration" {...props}>
      {/* content */}
    </MainContainerBox>
  </PageLayout>
);
```

**Removed:**

- `Header` + `Main` components
- Custom header and main settings
- Custom action button styling
- Custom CSS styling for the unified layout

### 3. CSS Styling (`src/styles/globals.css`)

**Removed all custom styles:**

- Company Profile Page Styles (`.company-profile-page`, `.page-header`, etc.)
- Header Main Page Styles (`.header-main-page`, `.action-buttons`, etc.)
- Custom breadcrumb styling
- Custom content section styling
- Responsive adjustments for the custom layout

## Current Status

| Page Type            | Layout System                 | Components Used                   | Status      |
| -------------------- | ----------------------------- | --------------------------------- | ----------- |
| Main Page            | Header + Main                 | `Header` + `Main`                 | Original    |
| Company Profile      | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | ✅ Reverted |
| Header-Main Settings | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | ✅ Reverted |
| Admin Dashboard      | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Icon Library         | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Hero Page Settings   | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Footer Settings      | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Pages Settings       | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Quick Navigation     | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Menu Navigation      | PageLayout + MainContainerBox | `PageLayout` + `MainContainerBox` | Original    |
| Users Page           | PageLayout                    | `PageLayout` only                 | Original    |

## Benefits of Current System

### 1. **Consistent Admin Experience**

- All admin pages use the same `PageLayout` + `MainContainerBox` system
- Consistent breadcrumb navigation
- Unified admin interface design

### 2. **Maintained Functionality**

- Toggle menu button functionality preserved
- All existing features work as expected
- No disruption to user workflows

### 3. **Clean Codebase**

- Removed unused custom CSS
- Simplified component structure
- Easier maintenance

## Layout Component Details

### PageLayout Component

- **Breadcrumbs**: Consistent navigation across admin pages
- **Page Header**: Professional title and description styling
- **Responsive**: Adapts to different screen sizes
- **Admin Styling**: Consistent with other admin pages

### MainContainerBox Component

- **Action Buttons**: Built-in Build, Save, Upload, Refresh buttons
- **Card Design**: Professional card-based layout
- **Hover Effects**: Interactive design elements
- **Responsive**: Adapts to different screen sizes

## Conclusion

The layout system has been successfully reverted to use `PageLayout` + `MainContainerBox` for both the company profile and header-main pages. This maintains consistency with other admin pages while preserving the toggle menu button functionality and all existing features.

The main page continues to use `Header` + `Main` for its public-facing layout, while all admin pages now consistently use the admin layout system.
