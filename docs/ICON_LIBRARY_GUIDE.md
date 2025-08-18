# Icon Library Guide

## Overview

The Icon Library is a comprehensive collection of MUI icons organized by categories, specifically designed for NGO and social impact applications. It provides an intuitive interface for selecting icons with search functionality and category organization.

## Features

### ✅ **Core Requirements Met**

1. **Icon Box + Icon Name**: Clickable icon boxes that open a selection dialog
2. **Default Black Color**: All icons display in black by default
3. **No Icon Names Displayed**: Clean interface without text labels in the grid
4. **Category Grouping**: Icons organized by functional categories
5. **NGO Icons**: Extensive collection focused on social impact and NGO work

### 🎨 **Additional Features**

- **Search Functionality**: Find icons by name or tags
- **Responsive Design**: Works on all device sizes
- **Hover Effects**: Interactive feedback on icon selection
- **Tag System**: Icons categorized with relevant keywords
- **Export Ready**: Easy integration with other components

## Available Categories

### 🏠 **NGO & Social (10 icons)**

- Community, volunteer, diversity, accessibility
- Social impact, inclusion, equality
- Children, elderly, pets, mental health

### 🏥 **Healthcare (5 icons)**

- Medical, emergency, safety
- Hospital, pharmacy, ambulance
- Health and safety protocols

### 🌱 **Environment (6 icons)**

- Eco, nature, sustainability
- Forest, water, recycling
- Solar power, agriculture

### 🎓 **Education (3 icons)**

- School, library, science
- Learning, research, innovation
- Knowledge sharing

### 🏘️ **Community (6 icons)**

- Home, work, business
- Celebration, security, public spaces
- Community development

### 🚗 **Transportation (10 icons)**

- Various transport modes
- Public transit, mobility
- Logistics and delivery

### 🏗️ **Infrastructure (4 icons)**

- Construction, emergency services
- Police, fire, safety
- Public infrastructure

### 🎭 **Culture & Arts (4 icons)**

- Sports, music, theater
- Arts, culture, recreation
- Food and nutrition

## Usage

### 1. **Basic Icon Library Dialog**

```tsx
import { IconLibrary } from "@/components/ui";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const handleIconSelect = (
    iconName: string,
    iconComponent: React.ComponentType<any>
  ) => {
    console.log("Selected:", iconName, iconComponent);
    // Use the selected icon
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Icon Library</Button>

      <IconLibrary
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onIconSelect={handleIconSelect}
      />
    </>
  );
}
```

### 2. **IconSelector Component**

```tsx
import { IconSelector } from "@/components/ui";

function MyForm() {
  const [selectedIcon, setSelectedIcon] = useState<React.ComponentType<any>>();
  const [selectedIconName, setSelectedIconName] = useState<string>();

  const handleIconSelect = (
    iconName: string,
    iconComponent: React.ComponentType<any>
  ) => {
    setSelectedIcon(iconComponent);
    setSelectedIconName(iconName);
  };

  return (
    <IconSelector
      selectedIcon={selectedIcon}
      selectedIconName={selectedIconName}
      onIconSelect={handleIconSelect}
      label="Choose an icon for your button"
      size="medium"
      variant="outlined"
    />
  );
}
```

### 3. **Custom Icon Integration**

```tsx
import { Favorite as FavoriteIcon } from "@mui/icons-material";

function MyButton() {
  return (
    <Button startIcon={<FavoriteIcon />} variant="contained">
      Like
    </Button>
  );
}
```

## Component Props

### IconLibrary Props

| Prop           | Type                                           | Required | Description                    |
| -------------- | ---------------------------------------------- | -------- | ------------------------------ |
| `open`         | `boolean`                                      | ✅       | Controls dialog visibility     |
| `onClose`      | `() => void`                                   | ✅       | Callback when dialog closes    |
| `onIconSelect` | `(name: string, component: Component) => void` | ✅       | Callback when icon is selected |

### IconSelector Props

| Prop               | Type                                           | Default            | Description                                 |
| ------------------ | ---------------------------------------------- | ------------------ | ------------------------------------------- |
| `selectedIcon`     | `React.ComponentType<any>`                     | `undefined`        | Currently selected icon component           |
| `selectedIconName` | `string`                                       | `undefined`        | Name of selected icon                       |
| `onIconSelect`     | `(name: string, component: Component) => void` | -                  | Callback when icon is selected              |
| `label`            | `string`                                       | `"Select Icon"`    | Label text above the selector               |
| `placeholder`      | `string`                                       | `"Choose an icon"` | Placeholder text (unused in current design) |
| `size`             | `"small" \| "medium" \| "large"`               | `"medium"`         | Size of the icon display                    |
| `variant`          | `"outlined" \| "contained" \| "text"`          | `"outlined"`       | Button variant style                        |

## Styling

### Default Colors

- **Icons**: Black (`#000000`)
- **Borders**: Divider color from theme
- **Background**: Paper background from theme
- **Hover**: Primary color with scale effect

### Customization

The Icon Library uses MUI's theme system, so you can customize:

- Colors through theme overrides
- Spacing and typography
- Border radius and shadows
- Hover effects and transitions

## Best Practices

### 1. **Icon Selection**

- Choose icons that clearly represent their purpose
- Use consistent icon styles within your application
- Consider accessibility and recognition

### 2. **Performance**

- Icons are loaded on-demand
- Large icon libraries are efficiently rendered
- Search functionality is optimized for performance

### 3. **User Experience**

- Provide clear labels for icon selectors
- Use appropriate icon sizes for different contexts
- Maintain consistent icon usage patterns

## Examples

### Header Settings Integration

```tsx
// In HeaderSettingsForm.tsx
<IconSelector
  label="Quick Button Icon"
  selectedIcon={quickButtonIcon}
  selectedIconName={quickButtonIconName}
  onIconSelect={(name, component) => {
    setQuickButtonIcon(component);
    setQuickButtonIconName(name);
  }}
  size="small"
/>
```

### Navigation Menu

```tsx
// In navigation components
<IconSelector
  label="Menu Icon"
  selectedIcon={menuIcon}
  selectedIconName={menuIconName}
  onIconSelect={handleMenuIconSelect}
  variant="contained"
/>
```

## Troubleshooting

### Common Issues

1. **Icons not displaying**: Ensure MUI icons are properly imported
2. **Dialog not opening**: Check if `open` prop is properly controlled
3. **Icon selection not working**: Verify `onIconSelect` callback is provided
4. **Styling issues**: Check theme configuration and CSS overrides

### Performance Tips

1. **Lazy loading**: Icons are loaded only when needed
2. **Search optimization**: Use tags for better search results
3. **Category filtering**: Navigate categories for faster icon discovery

## Future Enhancements

- [ ] Icon favorites system
- [ ] Custom icon upload
- [ ] Icon color customization
- [ ] Bulk icon selection
- [ ] Icon usage analytics
- [ ] More NGO-specific icon categories

## Support

For questions or issues with the Icon Library:

1. Check this documentation
2. Review the component source code
3. Check MUI documentation for icon usage
4. Contact the development team

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**MUI Version**: Compatible with latest MUI v5+
