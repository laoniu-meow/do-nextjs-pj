# Company Form Components

A comprehensive set of reusable React components for building company management forms in your Next.js application.

## 🏗️ Architecture

The components are designed with a modular, composable architecture:

```
CompanyFormField (Core input field)
CompanyLogoUpload (Logo upload with preview)
CompanyFormSection (Form section grouping)
CompanyFormGrid (Responsive grid layouts)
CompanyCreateForm (Complete form)
CompanyFormModal (Modal wrapper)
```

## 🚀 Quick Start

### Basic Usage

```tsx
import { CompanyCreateForm } from "@/components/company";

const MyPage = () => {
  const handleSubmit = async (data: CompanyFormData) => {
    // Handle form submission
    console.log(data);
  };

  return (
    <CompanyCreateForm
      onSubmit={handleSubmit}
      onCancel={() => console.log("Cancelled")}
    />
  );
};
```

### Modal Usage

```tsx
import { CompanyFormModal } from "@/components/company";

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Company</Button>

      <CompanyFormModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};
```

### Settings Panel Integration

```tsx
import { SettingsPanel } from "@/components/settings";
import { CompanyFormInSettingsPanel } from "@/components/company";

const MyPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SettingsPanel
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onApply={handleApply}
    >
      <CompanyFormInSettingsPanel
        onSubmit={handleSubmit}
        onCancel={() => setIsOpen(false)}
      />
    </SettingsPanel>
  );
};
```

## 📋 Component Details

### CompanyFormField

A specialized form field component that extends Material-UI's TextField with company-specific styling and validation.

**Props:**

- `label`: Field label
- `name`: Field name
- `error`: Error message
- `required`: Whether field is required
- `disabled`: Whether field is disabled
- All standard TextField props

### CompanyLogoUpload

Drag-and-drop logo upload component with preview functionality.

**Props:**

- `currentLogo`: Current logo URL
- `onLogoChange`: Callback when logo changes
- `required`: Whether logo is required
- `error`: Error message

### CompanyFormSection

Groups related form fields with a title and optional subtitle.

**Props:**

- `title`: Section title
- `subtitle`: Optional section description
- `showDivider`: Whether to show divider below section
- `required`: Whether section contains required fields

### CompanyFormGrid

Responsive grid layout for form fields with predefined layouts.

**Predefined Grids:**

- `CompanyBasicInfoGrid`: 2-column layout for basic info
- `CompanyContactGrid`: 3-column layout for contact info
- `CompanyAddressGrid`: 2-column layout for address

### CompanyCreateForm

Complete company creation form with validation and error handling.

**Props:**

- `onSubmit`: Form submission handler
- `onCancel`: Cancel action handler
- `initialData`: Initial form data
- `isLoading`: Loading state

### CompanyFormModal

Modal wrapper for the company form.

**Props:**

- `open`: Whether modal is open
- `onClose`: Close handler
- `onSubmit`: Submit handler
- `title`: Modal title
- `maxWidth`: Modal width

## 🎨 Customization

### Styling

All components use Tailwind CSS classes and can be customized with:

```tsx
<CompanyFormField
  className="custom-class"
  labelClassName="custom-label-class"
  errorClassName="custom-error-class"
/>
```

### Theme Integration

Components automatically integrate with your Material-UI theme and can be customized via the `sx` prop:

```tsx
<CompanyFormField
  sx={{
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
    },
  }}
/>
```

## 🔧 Form Validation

The form includes built-in validation for:

- **Required fields**: Company name
- **Email format**: When email is provided
- **Website format**: Must start with http:// or https://

Custom validation can be added by extending the `validateForm` function in `CompanyCreateForm`.

## 📱 Responsive Design

All components are fully responsive and work on:

- Mobile devices (xs: 1 column)
- Tablets (sm: 1-2 columns)
- Desktop (md+: 2-3 columns)

## 🚀 Performance Features

- **Lazy loading**: Components only render when needed
- **Memoization**: Form state is optimized for performance
- **Debounced validation**: Form validation is debounced for better UX

## 🔌 API Integration

The form is designed to work with your existing API endpoints:

```tsx
const handleSubmit = async (data: CompanyFormData) => {
  const response = await fetch("/api/companies", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create company");
  }

  return response.json();
};
```

## 🧪 Testing

Components are designed to be easily testable with:

- Semantic class names
- Accessible labels and ARIA attributes
- Clear component boundaries
- Predictable prop interfaces

## 📚 Examples

See the individual component files for complete usage examples including:

- Basic form usage
- Modal integration
- Settings panel integration
- Error handling
- Loading states

## 🤝 Contributing

When extending these components:

1. Maintain the existing API patterns
2. Use consistent styling with Tailwind CSS
3. Follow the component composition pattern
4. Add proper TypeScript types
5. Include accessibility features
