# Dynamic Settings Panel System

A smart, route-aware settings panel that automatically shows different content based on the current page/route in your Next.js admin application.

## 🎯 Overview

The Dynamic Settings Panel system automatically detects which page you're on and shows the appropriate settings content. When you navigate to Company Profile, it shows company settings. When you go to Header & Main, it shows layout settings. And so on.

## 🏗️ Architecture

```
useSettingsContent Hook → SettingsContentFactory → DynamicSettingsPanel
         ↓                        ↓                      ↓
   Detects current route    Renders appropriate    Shows settings in
   and page type           content component      draggable panel
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { DynamicSettingsPanel } from "@/components/settings";

const MyPage = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsSettingsOpen(true)}>Open Settings</Button>

      <DynamicSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApply={() => {
          // Handle settings application
          setIsSettingsOpen(false);
        }}
      />
    </>
  );
};
```

### Automatic Content Detection

The system automatically detects your current page and shows appropriate settings:

- **Company Profile** (`/admin/settings/company-profile`) → Company form settings
- **Header & Main** (`/admin/settings/header-main`) → Layout settings
- **Users** (`/admin/users`) → User management settings
- **Dashboard** (`/admin/dashboard`) → Dashboard settings
- **Other pages** → Placeholder content

## 📋 Components

### Core Components

1. **`DynamicSettingsPanel`** - Main component that automatically shows the right content
2. **`SettingsContentFactory`** - Factory that renders content based on page type
3. **`useSettingsContent`** - Hook that detects current page and returns settings info

### Settings Content Components

1. **`CompanyProfileSettings`** - Company form with logo upload
2. **`HeaderMainSettings`** - Header layout and styling options
3. **`FooterSettings`** - Footer configuration (placeholder)
4. **`HeroPageSettings`** - Hero section settings (placeholder)
5. **`PagesSettings`** - Page management (placeholder)
6. **`UsersSettings`** - User management (placeholder)

## 🔧 How It Works

### 1. Route Detection

The `useSettingsContent` hook uses Next.js `usePathname()` to detect the current route:

```tsx
const pathname = usePathname(); // e.g., "/admin/settings/company-profile"
const pathSegments = pathname.split("/").filter(Boolean);
// ["admin", "settings", "company-profile"]
```

### 2. Content Selection

Based on the route, it returns the appropriate settings configuration:

```tsx
case 'company-profile':
  return {
    title: "Company Profile Settings",
    description: "Configure your company profile, branding, and company-specific settings.",
    pageType: "company-profile",
    content: null, // Will be set by the component
  };
```

### 3. Content Rendering

The `SettingsContentFactory` renders the right component:

```tsx
switch (pageType) {
  case "company-profile":
    return <CompanyProfileSettings onApply={onApply} onCancel={onCancel} />;
  case "header-main":
    return <HeaderMainSettings onApply={onApply} onCancel={onCancel} />;
  // ... other cases
}
```

## 🎨 Customization

### Adding New Settings Pages

1. **Create the content component:**

```tsx
// src/components/settings/content/NewPageSettings.tsx
export const NewPageSettings: React.FC<NewPageSettingsProps> = ({
  onApply,
  onCancel,
}) => {
  return <Box>{/* Your settings content */}</Box>;
};
```

2. **Add to the factory:**

```tsx
// In SettingsContentFactory.tsx
case "new-page":
  return (
    <NewPageSettings
      onApply={onApply}
      onCancel={onCancel}
    />
  );
```

3. **Update the hook:**

```tsx
// In useSettingsContent.ts
case 'new-page':
  return {
    title: "New Page Settings",
    description: "Configure your new page settings.",
    pageType: "new-page",
    content: null,
  };
```

### Custom Page Types

Add new page types to the `SettingsPageType` union:

```tsx
export type SettingsPageType =
  | "company-profile"
  | "header-main"
  | "new-page" // Add your new type
  | "default";
```

## 📱 Responsive Design

All settings components are fully responsive and work on:

- **Mobile**: Single column layout
- **Tablet**: Optimized spacing
- **Desktop**: Multi-column layouts where appropriate

## 🔌 Integration Examples

### With Company Form Components

```tsx
import { CompanyFormInSettingsPanel } from "@/components/company";

export const CompanyProfileSettings = ({ onApply, onCancel }) => {
  return (
    <CompanyFormInSettingsPanel
      onSubmit={handleSubmit}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
};
```

### With Existing SettingsPanel

```tsx
import { SettingsPanel } from "@/components/settings";

// Use the original SettingsPanel for custom content
<SettingsPanel
  isOpen={isOpen}
  onClose={onClose}
  onApply={onApply}
  title="Custom Settings"
>
  <CustomSettingsContent />
</SettingsPanel>;
```

## 🧪 Testing

### Testing Different Routes

Navigate to different admin pages to test the dynamic behavior:

```bash
# Company Profile Settings
/admin/settings/company-profile

# Header & Main Settings
/admin/settings/header-main

# User Management Settings
/admin/users

# Dashboard Settings
/admin/dashboard
```

### Testing Content Rendering

Use the `DynamicSettingsExample` component to see how content changes:

```tsx
import { DynamicSettingsExample } from "@/components/settings";

// This will show the current page's settings content
<DynamicSettingsExample />;
```

## 🚀 Performance Features

- **Route-based content loading**: Only loads content for the current page
- **Memoized route detection**: Prevents unnecessary re-renders
- **Lazy content rendering**: Content components render only when needed
- **Efficient state management**: Minimal state updates

## 🔒 Security Considerations

- **Route validation**: Only shows settings for valid admin routes
- **Content isolation**: Each settings component is isolated
- **Permission-based access**: Can be extended with role-based content

## 📚 Examples

See the following files for complete examples:

- `DynamicSettingsExample.tsx` - Comprehensive demo
- `CompanyProfileSettings.tsx` - Company form integration
- `HeaderMainSettings.tsx` - Layout settings example
- Updated page files showing integration

## 🤝 Contributing

When adding new settings content:

1. Follow the existing component patterns
2. Use consistent styling with Material-UI and Tailwind
3. Include proper TypeScript types
4. Add accessibility features
5. Test on different screen sizes
6. Update the factory and hook accordingly

## 🔮 Future Enhancements

Potential improvements:

- **Settings persistence**: Save settings to localStorage/API
- **Settings validation**: Form validation for settings
- **Settings search**: Search across all settings
- **Settings import/export**: Backup and restore settings
- **Settings templates**: Pre-configured settings presets
- **Real-time preview**: Live preview of setting changes
