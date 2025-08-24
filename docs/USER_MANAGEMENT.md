# User Management Guide

## Overview

This document explains how to manage users in the application and why they might get deleted during development.

## Why Users Get Deleted

### 🔄 **Database Migrations**

Users are often deleted when:

- Running `prisma migrate` or `prisma db push`
- Making changes to the Prisma schema
- Resetting the database during development
- Docker containers being recreated

### 🧪 **Development Environment**

- Development databases are frequently reset for testing
- Schema changes trigger table recreation
- Seed scripts don't run automatically after migrations

## How to Prevent User Loss

### **1. Use the Ensure Users Script**

```bash
# After any database changes, run:
npm run db:ensure-users
```

### **2. Use Development Script with Users**

```bash
# This ensures users exist before starting dev server:
npm run dev:with-users
```

### **3. Manual User Creation**

```bash
# Run the seed script:
npm run db:seed
```

## Available Scripts

### **User Management**

- `npm run db:ensure-users` - Creates/updates admin users
- `npm run db:seed` - Runs the full seed script
- `npm run dev:with-users` - Starts dev server with users ensured

### **Database Management**

- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio

## Default Users

### **Admin Users (Always Available)**

1. **admin@company.com** / admin123
2. **admin@example.com** / admin123

### **Sample Data**

- Sample company with basic information
- These are recreated each time you run the ensure script

## Best Practices

### **During Development**

1. **Always run** `npm run db:ensure-users` after database changes
2. **Use** `npm run dev:with-users` for development
3. **Check** if users exist before testing login functionality

### **Before Committing**

1. **Ensure** users exist in your development environment
2. **Test** login functionality
3. **Update** seed scripts if user structure changes

### **After Pulling Changes**

1. **Run** `npm run db:push` if schema changed
2. **Run** `npm run db:ensure-users` to recreate users
3. **Test** the application functionality

## Troubleshooting

### **Users Still Not Working?**

1. Check if the database is running: `docker ps | grep postgres`
2. Verify database connection in your `.env` file
3. Run `npm run db:ensure-users` to recreate users
4. Check the console for any error messages

### **Login Fails After User Creation?**

1. Ensure the development server is running
2. Check if the database connection is working
3. Verify the user was created: `npm run db:studio`
4. Try both sets of credentials

## Environment Variables

### **Required for User Creation**

```bash
# Database connection
DATABASE_URL="postgresql://username:password@localhost:5432/database"

# Optional: Customize admin credentials
ADMIN_PASSWORD="your-custom-password"
ADMIN_EMAIL="your-custom-email@example.com"
```

### **Sample Company Data**

```bash
SAMPLE_COMPANY_WEBSITE="https://yourcompany.com"
SAMPLE_COMPANY_EMAIL="info@yourcompany.com"
SAMPLE_COMPANY_PHONE="+1-555-0123"
SAMPLE_COMPANY_ADDRESS="123 Your Street, Your City, YC 12345"
```

## Quick Reference

| Command                   | Purpose                   | When to Use          |
| ------------------------- | ------------------------- | -------------------- |
| `npm run db:ensure-users` | Create/update admin users | After any DB changes |
| `npm run dev:with-users`  | Start dev with users      | Daily development    |
| `npm run db:seed`         | Full database seeding     | Initial setup        |
| `npm run db:push`         | Update database schema    | After schema changes |

## Support

If you continue to have issues with user management:

1. Check the console logs for error messages
2. Verify your environment configuration
3. Ensure the database is accessible
4. Contact the development team for assistance
