# Generic Settings System

The Generic Settings System is a flexible, reusable framework for creating settings panels across different pages in your application. It provides a type-safe, schema-driven approach to building settings interfaces.

## Features

- **Schema-driven**: Define settings using JSON schemas
- **Type-safe**: Full TypeScript support with generic types
- **Reusable**: Use the same components across different pages
- **Flexible**: Support for various field types (text, number, select, switch, color, file, etc.)
- **Validation**: Built-in validation with custom validation support
- **Responsive**: Mobile-friendly design with collapsible sections
- **Accessible**: Proper ARIA labels and keyboard navigation

## Architecture

```
src/
├── types/settings.ts          # Settings type definitions and schemas
├── hooks/useSettings.ts       # Custom hook for managing settings state
├── components/settings/
│   ├── GenericSettingsPanel.tsx    # Main settings panel component
│   ├── GenericSettingsForm.tsx     # Dynamic form renderer
│   ├── SettingsPanel.tsx           # Base panel wrapper
│   └── content/                    # Legacy content components (deprecated)
```

## Quick Start

### 1. Define a Settings Schema

Create a schema that describes your settings structure:

```typescript
import { SettingsSchema } from "@/types/settings";

export const MY_SETTINGS_SCHEMA: SettingsSchema = {
  id: "my-settings",
  title: "My Settings",
  description: "Configure your application settings",
  sections: [
    {
      id: "general",
      title: "General Settings",
      description: "Basic configuration options",
      fields: [
        {
          id: "appName",
          label: "Application Name",
          type: "text",
          required: true,
          placeholder: "Enter application name",
          validation: {
            min: 2,
            max: 50,
          },
        },
        {
          id: "isEnabled",
          label: "Enable Feature",
          type: "switch",
          defaultValue: true,
        },
        {
          id: "theme",
          label: "Theme",
          type: "select",
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "auto", label: "Auto" },
          ],
          defaultValue: "light",
        },
      ],
    },
  ],
  actions: {
    showSave: true,
    showCancel: true,
    showReset: true,
  },
};
```

### 2. Create a Settings Page

Use the `useSettings` hook and `GenericSettingsPanel`:

```typescript
import React, { useState } from "react";
import { GenericSettingsPanel } from "@/components/settings/GenericSettingsPanel";
import { MY_SETTINGS_SCHEMA } from "@/types/settings";
import { useSettings } from "@/hooks/useSettings";

interface MySettingsData {
  appName: string;
  isEnabled: boolean;
  theme: string;
}

export default function MySettingsPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Use the settings hook
  const settings = useSettings<MySettingsData>(MY_SETTINGS_SCHEMA, {
    appName: "My App",
    isEnabled: true,
    theme: "light",
  });

  const handleApplySettings = (data: MySettingsData) => {
    // Save the settings
    console.log("Settings saved:", data);
    setHasUnsavedChanges(true);
    setIsSettingsOpen(false);
  };

  const handleSettingsDataChange = (newData: MySettingsData) => {
    settings.updateOriginalData(newData);
  };

  return (
    <div>
      <button onClick={() => setIsSettingsOpen(true)}>Open Settings</button>

      <GenericSettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApply={handleApplySettings}
        schema={MY_SETTINGS_SCHEMA}
        data={settings.data}
        onDataChange={handleSettingsDataChange}
        title="My Settings"
      />
    </div>
  );
}
```

## Field Types

### Text Fields

```typescript
{
  id: 'name',
  label: 'Name',
  type: 'text',
  required: true,
  placeholder: 'Enter name',
  multiline: false, // Set to true for textarea
  rows: 1,
  validation: {
    min: 2,
    max: 100,
    pattern: '^[a-zA-Z\\s]+$'
  }
}
```

### Number Fields

```typescript
{
  id: 'age',
  label: 'Age',
  type: 'number',
  min: 0,
  max: 120,
  step: 1,
  validation: {
    min: 18,
    max: 65
  }
}
```

### Select Fields

```typescript
{
  id: 'country',
  label: 'Country',
  type: 'select',
  options: [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' }
  ],
  defaultValue: 'US'
}
```

### Switch Fields

```typescript
{
  id: 'notifications',
  label: 'Enable Notifications',
  type: 'switch',
  defaultValue: true
}
```

### Color Fields

```typescript
{
  id: 'primaryColor',
  label: 'Primary Color',
  type: 'color',
  defaultValue: '#3b82f6'
}
```

### File Fields

```typescript
{
  id: 'logo',
  label: 'Logo',
  type: 'file',
  accept: 'image/*',
  multiple: false,
  maxSize: 5 * 1024 * 1024 // 5MB
}
```

### Multiselect Fields

```typescript
{
  id: 'tags',
  label: 'Tags',
  type: 'multiselect',
  options: [
    { value: 'featured', label: 'Featured' },
    { value: 'new', label: 'New' },
    { value: 'popular', label: 'Popular' }
  ],
  maxSelections: 5
}
```

## Validation

The system provides built-in validation for common scenarios:

- **Required fields**: Automatically validated
- **String length**: Min/max character limits
- **Number ranges**: Min/max value limits
- **Pattern matching**: Regular expression validation
- **Custom validation**: User-defined validation functions

```typescript
{
  id: 'email',
  label: 'Email',
  type: 'email',
  required: true,
  validation: {
    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
    custom: (value) => {
      if (value.includes('spam')) {
        return 'Spam emails are not allowed';
      }
      return null; // No error
    }
  }
}
```

## State Management

The `useSettings` hook provides comprehensive state management:

```typescript
const settings = useSettings(MY_SCHEMA, initialData);

// Access current data
console.log(settings.data);

// Update a single field
settings.updateField("appName", "New App Name");

// Update multiple fields
settings.updateSection("general", { appName: "New Name", isEnabled: false });

// Check for changes
if (settings.hasChanges) {
  console.log("Settings have been modified");
}

// Validate data
const validation = settings.validate();
if (!validation.isValid) {
  console.log("Validation errors:", validation.errors);
}

// Reset to defaults
settings.resetToDefaults();

// Reset to original values
settings.resetToOriginal();
```

## Customization

### Panel Appearance

```typescript
<GenericSettingsPanel
  // ... other props
  showSectionHeaders={true}
  collapsibleSections={true}
  title="Custom Title"
/>
```

### Form Behavior

```typescript
<GenericSettingsForm
  // ... other props
  showSectionHeaders={false}
  collapsibleSections={false}
  onReset={() => console.log("Reset clicked")}
/>
```

## Migration from Legacy System

If you're migrating from the old `DynamicSettingsPanel`:

1. **Replace imports**:

   ```typescript
   // Old
   import { DynamicSettingsPanel } from "@/components/settings";

   // New
   import { GenericSettingsPanel } from "@/components/settings/GenericSettingsPanel";
   ```

2. **Define a schema** for your settings

3. **Use the `useSettings` hook** instead of manual state management

4. **Update component props** to match the new interface

## Best Practices

1. **Schema Design**: Keep schemas focused and organized by logical sections
2. **Type Safety**: Always define TypeScript interfaces for your settings data
3. **Validation**: Use built-in validation where possible, add custom validation for complex rules
4. **Defaults**: Provide sensible default values for all fields
5. **User Experience**: Use descriptive labels and helpful placeholder text
6. **Performance**: Avoid complex validation functions that could impact performance

## Examples

See the following files for complete examples:

- `src/app/admin/settings/company-profile/page.tsx` - Company profile settings
- `src/app/admin/settings/header-settings/page.tsx` - Header and navigation settings
- `src/types/settings.ts` - Schema definitions and types

## Troubleshooting

### Common Issues

1. **Type errors**: Ensure your data interface matches your schema
2. **Validation not working**: Check that validation rules are properly defined
3. **Fields not rendering**: Verify field types are supported
4. **State not updating**: Make sure you're using the `onDataChange` callback

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
NEXT_PUBLIC_DEBUG_SETTINGS=true
```

This will log all settings operations to the console.

## Contributing

When adding new field types or features:

1. Update the types in `src/types/settings.ts`
2. Add rendering logic in `src/components/settings/GenericSettingsForm.tsx`
3. Update validation in `src/hooks/useSettings.ts`
4. Add tests for new functionality
5. Update this documentation
