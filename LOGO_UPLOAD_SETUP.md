# Logo Upload Setup Guide

## 🎯 **What's Been Implemented**

Your logo upload functionality is now fully implemented and will save files to the `assets/logos` directory as specified in your environment configuration.

## 📁 **Directory Structure**

```
src/
└── assets/
    └── logo/           # Logo files will be saved here
        ├── logo_1234567890.png
        ├── logo_1234567891.jpg
        └── ...
```

## ⚙️ **Environment Configuration**

Create a `.env.development` file in your project root with these settings:

```bash
# File Upload Configuration
MAX_FILE_SIZE=5242880          # 5MB in bytes
UPLOAD_LOGOS_DIR="assets/logos"
UPLOAD_MEDIA_DIR="assets/media"
UPLOAD_DOCS_DIR="assets/docs"

# Other required environment variables...
# (See env.template for complete list)
```

## 🚀 **How It Works**

### 1. **File Upload Process**

- User selects or drags & drops an image file
- File is validated (type, size)
- File is uploaded to `/api/upload/logo` endpoint
- File is saved to `public/assets/logos/` directory
- Unique filename is generated (e.g., `logo_1234567890.png`)
- Public URL is returned (e.g., `/assets/logos/logo_1234567890.png`)

### 2. **File Validation**

- **File Type**: Only images (PNG, JPG, GIF, SVG)
- **File Size**: Maximum 5MB (configurable)
- **Security**: Files are saved with unique names to prevent conflicts

### 3. **Storage Location**

- Files are saved to `src/assets/logo/`
- Files are served via `/api/assets/logo/filename` endpoint
- This provides better security and control over file access

## 🔧 **API Endpoints**

### **POST** `/api/upload/logo`

Uploads a logo file to the server.

**Request:**

```typescript
const formData = new FormData();
formData.append("file", file);

const response = await fetch("/api/upload/logo", {
  method: "POST",
  body: formData,
});
```

**Response:**

```typescript
{
  success: true,
  message: "Logo uploaded successfully",
  data: {
    fileName: "logo_1234567890.png",
    filePath: "/api/assets/logo/logo_1234567890.png",
    fileSize: 12345,
    mimeType: "image/png"
  }
}
```

### **DELETE** `/api/upload/logo`

Deletes a logo file from the server.

**Request:**

```typescript
const response = await fetch("/api/upload/logo", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ fileName: "logo_1234567890.png" }),
});
```

## 🎨 **Component Usage**

The `CompanyLogoUpload` component now automatically handles file uploads:

```typescript
<CompanyLogoUpload
  currentLogo={company.logo}
  onLogoChange={(file, logoUrl) => {
    // file: File object
    // logoUrl: Public URL to the uploaded file
    console.log("Logo uploaded:", logoUrl);
  }}
  required={true}
/>
```

## 📱 **Features**

- ✅ **Drag & Drop** support
- ✅ **File validation** (type, size)
- ✅ **Upload progress** indicator
- ✅ **Error handling** with user feedback
- ✅ **Automatic file naming** (prevents conflicts)
- ✅ **Public URL generation** for easy access
- ✅ **Responsive design** for mobile and desktop

## 🛡️ **Security Features**

- **File type validation**: Only images allowed
- **File size limits**: Configurable maximum size
- **Unique filenames**: Prevents path traversal attacks
- **Public directory**: Files are served statically, not executed

## 🔄 **Data Flow**

1. **User selects file** → Component shows preview
2. **File uploads to server** → Progress indicator shown
3. **Server validates & saves** → File stored in `assets/logos/`
4. **URL returned** → Component updates with new logo
5. **Form data updated** → Parent component receives logo URL

## 📝 **Database Integration**

The `CompanyFormData` interface now includes:

```typescript
export interface CompanyFormData {
  name: string;
  logo?: string; // Original filename
  logoUrl?: string; // Public URL to the uploaded file
  // ... other fields
}
```

## 🚨 **Troubleshooting**

### **Upload Fails**

- Check environment variables are set correctly
- Ensure `public/assets/logos/` directory exists
- Verify file type is an image
- Check file size is under 5MB

### **File Not Displaying**

- Verify the logo URL is correct
- Check if file exists in `src/assets/logo/`
- Ensure the `/api/assets/logo/` endpoint is working

### **Permission Errors**

- Ensure the `src/assets/logo/` directory is writable
- Check file system permissions

## 🔮 **Future Enhancements**

- **Image optimization** with Next.js Image component
- **Multiple file uploads** support
- **File compression** for better performance
- **CDN integration** for production deployments
- **File cleanup** for unused uploads

## 📚 **Related Files**

- `src/app/api/upload/logo/route.ts` - Upload API endpoint
- `src/components/company/CompanyLogoUpload.tsx` - Upload component
- `src/lib/env.ts` - Environment configuration
- `src/types/index.ts` - Type definitions

---

Your logo upload system is now ready to use! 🎉
