#!/bin/bash

# Script to check Header settings in staging and production tables
# Usage: ./scripts/check-header.sh

set -e

echo "🔍 Checking Header Settings in Database..."
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ] && [ ! -f ".env.development" ] && [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: No .env file found. Using default database connection values."
    echo "   Make sure your database is running and accessible."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if pg package is installed
if ! node -e "require('pg')" 2>/dev/null; then
    echo "📦 Installing PostgreSQL client..."
    npm install pg dotenv
fi

# Run the check script
echo "🚀 Running Header settings check..."
node scripts/check-header-data.js

echo ""
echo "✅ Header settings check completed!"
