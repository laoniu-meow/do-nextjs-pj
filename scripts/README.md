# Database Header Settings Check Scripts

This directory contains scripts to check your staging and production database tables for Header settings data.

## 📁 Files

- **`check-header-data.js`** - Main Node.js script to analyze Header settings in database
- **`check-header-settings.js`** - Comprehensive analysis script for all Header-related data
- **`check-header.sh`** - Shell script wrapper for easy execution

## 🚀 Quick Start

### Option 1: Using the shell script (Recommended)

```bash
# Make sure you're in the project root directory
cd /path/to/your/project

# Run the check script
./scripts/check-header.sh
```

### Option 2: Direct Node.js execution

```bash
# Install dependencies first (if not already installed)
npm install pg dotenv

# Run the script
node scripts/check-header-data.js
```

## 🔧 Prerequisites

1. **Database running**: Make sure your PostgreSQL database is running
2. **Environment variables**: Set up your database connection in `.env` file
3. **Dependencies**: The script will automatically install required packages

## 📊 What the Scripts Check

### Staging Table (`company_profile_staging`)

- Table structure and columns
- Sample data (up to 5 rows)
- Logo and branding information
- Main company settings

### Production Table (`company_profile_production`)

- Table structure and columns
- Sample data (up to 5 rows)
- Logo and branding information
- Main company settings

### Header Settings Search

- JSON/JSONB fields that might contain settings
- Search for header-related keywords
- Responsive design settings
- Color and styling configurations

### Comparison Analysis

- Record counts between staging and production
- Main company differences
- Data synchronization status

## 🌍 Environment Variables

The scripts use these environment variables (with defaults):

```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=company-webapp
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## 📋 Sample Output

```
🔍 HEADER SETTINGS DATABASE ANALYSIS REPORT
==========================================
Database: company-webapp
Host: localhost:5432
User: postgres
Time: 2024-01-15T10:30:00.000Z

📋 Checking STAGING table (company_profile_staging)...
==================================================
📊 Table structure:
   id (uuid) NOT NULL
   name (character varying) NOT NULL
   logo (character varying) NULL
   logo_url (character varying) NULL
   is_main_company (boolean) NOT NULL
   created_at (timestamp with time zone) NOT NULL
   updated_at (timestamp with time zone) NOT NULL

📊 Sample data (2 rows):
   Row 1:
     ID: abc123...
     Name: Company Name
     Logo: logo.png
     Logo URL: /logos/logo.png
     Is Main Company: true
     Created: 2024-01-15T10:00:00.000Z
     Updated: 2024-01-15T10:00:00.000Z
```

## 🔍 What You'll Learn

After running the scripts, you'll understand:

1. **Current State**: What Header settings data exists in your database
2. **Table Structure**: How your staging and production tables are organized
3. **Data Differences**: Variations between staging and production environments
4. **Missing Data**: What Header settings are not currently persisted
5. **Recommendations**: How to improve Header settings storage

## 💡 Important Notes

- **Header settings are NOT currently stored in database tables** - they're managed in React state
- Your staging/production tables contain company profile data (logos, names, etc.)
- To persist Header settings, you'll need to create dedicated tables
- Consider using JSONB for flexible settings storage

## 🛠️ Troubleshooting

### Connection Issues

```bash
# Check if database is running
docker ps | grep company-webapp

# Check environment variables
cat .env | grep POSTGRES
```

### Permission Issues

```bash
# Make script executable
chmod +x scripts/check-header.sh
```

### Missing Dependencies

```bash
# Install manually if needed
npm install pg dotenv
```

## 🔄 Next Steps

After running the scripts, consider:

1. **Creating Header Settings Tables**: Design schema for persistent storage
2. **Environment Management**: Set up staging/production data synchronization
3. **Migration System**: Implement settings migration between environments
4. **API Integration**: Connect your React components to database storage

## 📞 Support

If you encounter issues:

1. Check the error messages in the script output
2. Verify your database connection settings
3. Ensure all required dependencies are installed
4. Check that your database is running and accessible
