# Layout Components

This directory contains the core layout components that work together to create a cohesive, responsive web application layout.

## Components

### Header

The `Header` component provides navigation, branding, and quick access buttons. It automatically adapts to different screen sizes and maintains consistent spacing and alignment.

**Features:**

- Responsive design (Desktop, Tablet, Mobile)
- Customizable logo, colors, and spacing
- Quick action buttons
- Menu button with icon support
- Automatic device detection and responsive settings

**Props:**

- `desktop`, `tablet`, `mobile`: Device-specific settings
- `backgroundColor`: Header background color
- `dropShadow`: Shadow intensity
- `quickButton*`: Quick button styling options
- `menuButton*`: Menu button styling options

### Main

The `Main` component provides a flexible container for page content with responsive design and custom styling options.

**Features:**

- Responsive design (Desktop, Tablet, Mobile)
- Customizable backgrounds and gradients
- Responsive spacing and sizing
- Shadow and border radius options
- Automatic device detection and responsive settings

**Props:**

- `desktop`, `tablet`, `mobile`: Device-specific settings
- `backgroundColor`: Main content background color
- `backgroundImage`: Optional background image
- `backgroundGradient`: Gradient overlay options
- `borderRadius`: Border radius options
- `shadow`: Shadow intensity

### Navigation

The `Navigation` component provides a simple navigation menu with active state indicators.

**Features:**

- Active page highlighting
- Responsive design
- Hover effects and animations
- Clean, accessible design

**Props:**

- `className`: Additional CSS classes

### ResponsiveLayout

The `ResponsiveLayout` component provides responsive layout containers and utilities.

**Components:**

- `ResponsiveLayout`: Main responsive container
- `ResponsiveHeader`: Responsive header container
- `ResponsiveFooter`: Responsive footer container
- `ResponsiveNavigation`: Responsive navigation container

## Usage Examples

### Basic Header + Main Layout

```tsx
import { Header, Main } from "@/components/layout";

export default function MyPage() {
  const headerSettings = {
    desktop: { height: 64, paddingHorizontal: 16 /* ... */ },
    tablet: { height: 64, paddingHorizontal: 16 /* ... */ },
    mobile: { height: 64, paddingHorizontal: 16 /* ... */ },
    backgroundColor: "#ffffff",
    dropShadow: "medium",
    // ... other header props
  };

  const mainSettings = {
    desktop: { paddingHorizontal: 32, paddingVertical: 24 /* ... */ },
    tablet: { paddingHorizontal: 24, paddingVertical: 20 /* ... */ },
    mobile: { paddingHorizontal: 16, paddingVertical: 16 /* ... */ },
    backgroundColor: "#ffffff",
    backgroundGradient: "subtle",
    // ... other main props
  };

  return (
    <div>
      <Header {...headerSettings} />
      <Main {...mainSettings}>
        <h1>My Page Content</h1>
        <p>
          This content will be responsive and styled according to the settings.
        </p>
      </Main>
    </div>
  );
}
```

### With Navigation

```tsx
import { Header, Main, Navigation } from "@/components/layout";

export default function MyPage() {
  return (
    <div>
      <Header {...headerSettings} />
      <Main {...mainSettings}>
        <Navigation />
        <div>Page content here...</div>
      </Main>
    </div>
  );
}
```

## Responsive Design

All components automatically detect the current device type and apply the appropriate settings:

- **Desktop**: Larger screens (1200px+)
- **Tablet**: Medium screens (768px - 1199px)
- **Mobile**: Small screens (< 768px)

Settings are applied automatically based on the `deviceType` from the `useResponsive` hook.

## Styling

Components use CSS custom properties (CSS variables) for consistent theming:

- Spacing: `--spacing-xs`, `--spacing-sm`, `--spacing-md`, etc.
- Colors: `--color-primary-*`, `--color-neutral-*`, etc.
- Border radius: `--radius-sm`, `--radius-md`, `--radius-lg`, etc.
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-lg`, etc.

## Integration with Company Profile

These layout components follow the same architectural patterns as the Company Profile feature:

- **State Management**: Uses React hooks and local state
- **Responsive Design**: Same responsive system and breakpoints
- **Styling**: Consistent with the design system
- **Component Structure**: Similar prop interfaces and patterns
- **Error Handling**: Graceful fallbacks and error states

## File Structure

```
src/components/layout/
├── Header.tsx           # Header component
├── Main.tsx            # Main content component
├── Navigation.tsx      # Navigation component
├── ResponsiveLayout.tsx # Responsive layout utilities
├── index.ts            # Component exports
└── README.md           # This documentation
```

## Dependencies

- `@/hooks/useResponsive`: Device detection
- `@/hooks/useStyling`: Styling utilities
- `@/hooks/useCompanyLogo`: Logo management (Header)
- `@/components/ui/config/iconLibrary`: Icon library (Header)
- `@/components/ui/core/Container`: Container components (ResponsiveLayout)

## Best Practices

1. **Always provide responsive settings** for desktop, tablet, and mobile
2. **Use the same breakpoints** across all components for consistency
3. **Leverage CSS custom properties** for theming and customization
4. **Test on multiple devices** to ensure responsive behavior
5. **Follow the established patterns** from Company Profile components
6. **Use TypeScript interfaces** for prop definitions
7. **Implement proper accessibility** with ARIA labels and semantic HTML
