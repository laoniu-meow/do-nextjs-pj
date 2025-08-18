# Company Profile System - Complete Logic & Design Guide

## 🎯 **System Overview**
This guide documents the complete company profile system implementation that can be replicated for other pages requiring similar CRUD operations with staging/production workflow.

---

## 🏗️ **Architecture & Data Flow**

### **1. Database Schema (Prisma)**
```prisma
// Staging Table - For temporary data storage
model CompanyProfileStaging {
  id                String   @id @default(cuid())
  name              String
  companyRegNumber  String?
  email             String?
  address           String?
  country           String?
  postalCode        String?
  contact           String?
  logo              String?
  isMainCompany     Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("company_profile_staging")
}

// Production Table - For final, published data
model CompanyProfileProduction {
  id                String   @id @default(cuid())
  name              String
  companyRegNumber  String?
  email             String?
  address           String?
  country           String?
  postalCode        String?
  contact           String?
  logo              String?
  isMainCompany     Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("company_profile_production")
}
```

### **2. API Endpoints Structure**
```
/api/[page-name]/staging/route.ts     - Staging operations (GET, POST, DELETE)
/api/[page-name]/production/route.ts  - Production operations (GET, POST, DELETE)
```

---

## 🔄 **Core Workflow Logic**

### **1. Data Loading Priority**
```typescript
const loadData = async () => {
  // 1. Try to load from staging first
  const stagingResponse = await fetch("/api/[page-name]/staging");
  if (stagingResponse.ok && stagingData.length > 0) {
    setData(stagingData);
    setHasUnsavedChanges(true);
    setHasStagingData(true);
    return;
  }

  // 2. If no staging data, load from production
  const productionResponse = await fetch("/api/[page-name]/production");
  if (productionResponse.ok && productionData.length > 0) {
    setData(productionData);
    setHasUnsavedChanges(false);
    setHasStagingData(false);
  }
};
```

### **2. Button State Management**
```typescript
// State Variables
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [hasStagingData, setHasStagingData] = useState(false);
const [isLoading, setIsLoading] = useState(false);

// Button States
<MainContainerBox
  saveDisabled={!hasUnsavedChanges || isLoading}    // Enabled when changes exist
  uploadDisabled={!hasStagingData || isLoading}     // Enabled when data in staging
/>
```

### **3. CRUD Operations Flow**
```
Add/Edit → Local State → Save Button Enabled
    ↓
Save → Staging Table → Save Disabled, Upload Enabled
    ↓
Upload → Production Table → Both Buttons Disabled
    ↓
Page Reload → Check Staging → Production (if no staging)
```

---

## 🎨 **UI Design Patterns**

### **1. Main Container Structure**
```tsx
<PageLayout title="Page Title" description="Page description">
  <MainContainerBox
    title="Configuration"
    showBuild={true}
    showSave={true}
    showUpload={true}
    showRefresh={true}
    onBuild={handleBuild}
    onSave={handleSave}
    onUpload={handleUpload}
    onRefresh={handleRefresh}
    saveDisabled={!hasUnsavedChanges || isLoading}
    uploadDisabled={!hasStagingData || isLoading}
  >
    {/* Page Content */}
  </MainContainerBox>
</PageLayout>
```

### **2. Card Grid Layout**
```tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  }}
>
  {items.map((item, index) => (
    <Card key={index} item={item} onEdit={handleEdit} onRemove={handleRemove} />
  ))}
</div>
```

### **3. Card Design Pattern**
```tsx
<div style={{
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  border: "2px solid #e5e7eb",
  padding: "24px",
  minHeight: "280px",
  position: "relative",
}}>
  {/* Header with gradient background */}
  <div style={{
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "-24px",
    marginLeft: "-24px",
    marginRight: "-24px",
    marginBottom: "20px",
  }}>
    {/* Title + Action Buttons */}
  </div>
  
  {/* Content Fields */}
  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {/* Field items with colored left borders */}
  </div>
</div>
```

---

## ⚙️ **State Management Pattern**

### **1. Required State Variables**
```typescript
// Core Data
const [data, setData] = useState<DataType[]>([]);
const [currentFormData, setCurrentFormData] = useState<DataType | null>(null);

// UI State
const [isSettingsOpen, setIsSettingsOpen] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [editingIndex, setEditingIndex] = useState<number | null>(null);

// Button States
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const [hasStagingData, setHasStagingData] = useState(false);
const [isLoading, setIsLoading] = useState(false);
```

### **2. State Update Patterns**
```typescript
// Adding/Editing
const handleApply = () => {
  if (isEditMode) {
    setData(prev => prev.map((item, i) => 
      i === editingIndex ? currentFormData : item
    ));
  } else {
    setData(prev => [...prev, currentFormData]);
  }
  setHasUnsavedChanges(true);
  setHasStagingData(false);
};

// Removing
const handleRemove = async (index: number) => {
  const isConfirmed = window.confirm("Are you sure?");
  if (!isConfirmed) return;
  
  // Remove from database + local state
  setData(prev => prev.filter((_, i) => i !== index));
  setHasUnsavedChanges(true);
  setHasStagingData(false);
};
```

---

## 🔌 **API Implementation Pattern**

### **1. Staging API Route**
```typescript
// GET - Load staging data
export async function GET() {
  const data = await prisma.[tableName]Staging.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ success: true, data });
}

// POST - Save data to staging
export async function POST(request: NextRequest) {
  const { items } = await request.json();
  
  // Clear existing staging data
  await prisma.[tableName]Staging.deleteMany();
  
  // Insert new staging data
  const result = await prisma.[tableName]Staging.createMany({
    data: items,
  });
  
  return NextResponse.json({ success: true, count: result.count });
}

// DELETE - Remove specific item
export async function DELETE(request: NextRequest) {
  const { item } = await request.json();
  
  const result = await prisma.[tableName]Staging.deleteMany({
    where: { /* match item fields */ },
  });
  
  return NextResponse.json({ success: true, count: result.count });
}
```

### **2. Production API Route**
```typescript
// GET - Load production data
export async function GET() {
  const data = await prisma.[tableName]Production.findMany({
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ success: true, data });
}

// POST - Move from staging to production
export async function POST() {
  // Get staging data
  const stagingData = await prisma.[tableName]Staging.findMany();
  
  // Clear existing production data
  await prisma.[tableName]Production.deleteMany();
  
  // Insert staging data into production
  const result = await prisma.[tableName]Production.createMany({
    data: stagingData,
  });
  
  // Clear staging data
  await prisma.[tableName]Staging.deleteMany();
  
  return NextResponse.json({ success: true, count: result.count });
}
```

---

## 🎭 **Component Architecture**

### **1. Page Component Structure**
```typescript
export default function [PageName]Page() {
  // State declarations
  // Data loading effect
  // Event handlers
  
  return (
    <PageLayout>
      <MainContainerBox>
        {/* Configuration content */}
        {/* Data cards grid */}
      </MainContainerBox>
      
      <DynamicSettingsPanel
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        onApply={handleApplySettings}
        onFormDataChange={handleFormDataChange}
        title={isEditMode ? "Edit [Item]" : "Add [Item]"}
        initialData={currentFormData}
      />
    </PageLayout>
  );
}
```

### **2. Settings Panel Integration**
```typescript
// DynamicSettingsPanel automatically handles:
// - Panel open/close
// - Form data changes
// - Apply/cancel actions
// - Dynamic content based on page type
```

---

## 🎨 **Visual Design Elements**

### **1. Color Scheme**
```css
/* Primary Colors */
--primary-blue: #3b82f6
--primary-purple: #8b5cf6
--primary-green: #27ae60
--primary-orange: #f39c12

/* Border Colors */
--border-blue: #bfdbfe
--border-green: #bbf7d0
--border-purple: #ddd6fe
--border-yellow: #fbbf24

/* Background Colors */
--bg-white: #ffffff
--bg-gray-50: #f9fafb
--bg-gray-100: #f3f4f6
```

### **2. Spacing System**
```css
/* Margins & Padding */
--spacing-xs: 4px   (0.25rem)
--spacing-sm: 8px   (0.5rem)
--spacing-md: 16px  (1rem)
--spacing-lg: 24px  (1.5rem)
--spacing-xl: 32px  (2rem)
--spacing-2xl: 48px (3rem)

/* Gaps */
--gap-sm: 8px
--gap-md: 16px
--gap-lg: 24px
```

### **3. Shadow System**
```css
/* Box Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05)
--shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
```

---

## 🚀 **Implementation Checklist**

### **For New Pages:**
- [ ] **Database Schema**: Create staging and production tables
- [ ] **API Routes**: Implement staging and production endpoints
- [ ] **State Management**: Add required state variables
- [ ] **Event Handlers**: Implement CRUD operations
- [ ] **UI Components**: Create card layout and forms
- [ ] **Button States**: Configure Save/Upload button logic
- [ ] **Data Loading**: Implement staging → production priority
- [ ] **Error Handling**: Add proper error states and fallbacks
- [ ] **Confirmation Dialogs**: Add for destructive actions
- [ ] **Loading States**: Show during async operations

### **Required Files:**
```
src/app/admin/settings/[page-name]/page.tsx
src/app/api/[page-name]/staging/route.ts
src/app/api/[page-name]/production/route.ts
prisma/schema.prisma (add new models)
```

---

## 🔧 **Customization Points**

### **1. Data Fields**
- Modify the data interface to match your content
- Adjust card layout for different field types
- Customize field validation rules

### **2. Visual Styling**
- Change color schemes for different page types
- Adjust card dimensions and spacing
- Modify button styles and interactions

### **3. Business Logic**
- Customize the staging → production workflow
- Add page-specific validation rules
- Implement custom error handling

---

## 📝 **Example: User Management Page**

### **Database Schema**
```prisma
model UserStaging {
  id       String   @id @default(cuid())
  name     String
  email    String   @unique
  role     UserRole
  isActive Boolean  @default(true)
  // ... other fields
}

model UserProduction {
  id       String   @id @default(cuid())
  name     String
  email    String   @unique
  role     UserRole
  isActive Boolean  @default(true)
  // ... other fields
}
```

### **API Endpoints**
```
/api/users/staging/route.ts
/api/users/production/route.ts
```

### **Page Component**
```typescript
export default function UsersPage() {
  // Same state management pattern
  // Same CRUD operations
  // Same UI structure
  // Customized for user data
}
```

---

## 🎯 **Key Benefits of This System**

1. **Consistent UX**: Same workflow across all pages
2. **Data Safety**: Staging → production workflow prevents data loss
3. **Scalable**: Easy to add new pages with same pattern
4. **Maintainable**: Centralized logic and reusable components
5. **User-Friendly**: Clear button states and confirmation dialogs
6. **Professional**: Modern design with proper loading states

---

## 🔄 **Next Steps for Implementation**

1. **Choose your page type** (e.g., Products, Services, Blog Posts)
2. **Define your data structure** (fields, validation rules)
3. **Create database schema** (staging + production tables)
4. **Implement API endpoints** (copy the pattern)
5. **Build the page component** (follow the structure)
6. **Customize the UI** (adjust colors, spacing, layout)
7. **Test the workflow** (add, edit, save, upload, remove)
8. **Deploy and iterate** (refine based on user feedback)

This system provides a solid foundation for building consistent, professional admin interfaces across your application! 🚀✨
