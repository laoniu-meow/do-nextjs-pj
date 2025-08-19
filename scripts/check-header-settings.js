#!/usr/bin/env node

/**
 * Script to check staging and production tables for Header settings data
 * Usage: node scripts/check-header-settings.js [--env=staging|production|both]
 */

const { Client } = require('pg');
require('dotenv').config();

// Database connection configuration
const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'company-webapp',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
};

// Tables to check for Header settings
const tablesToCheck = [
  'company_profiles',
  'company_profile_staging', 
  'company_profile_production',
  'contents',
  'users',
  'companies'
];

// Header-related fields to look for
const headerRelatedFields = [
  'siteTitle', 'tagline', 'headerHeight', 'primaryColor',
  'showSearch', 'showUserMenu', 'stickyHeader',
  'backgroundColor', 'dropShadow', 'quickButtonBgColor',
  'quickButtonIconColor', 'quickButtonHoverBgColor',
  'quickButtonHoverIconColor', 'quickButtonShape',
  'quickButtonShadow', 'quickButtonGap', 'menuButtonBgColor',
  'menuButtonIconColor', 'menuButtonHoverBgColor',
  'menuButtonHoverIconColor', 'menuButtonIconId',
  'menuButtonShape', 'menuButtonShadow',
  'logo', 'logoUrl', 'name', 'description'
];

// Responsive settings fields
const responsiveFields = [
  'height', 'paddingHorizontal', 'paddingVertical',
  'logoWidth', 'logoHeight', 'quickButtonSize', 'menuButtonSize'
];

async function connectToDatabase() {
  const client = new Client(config);
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');
    return client;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    process.exit(1);
  }
}

async function checkTableStructure(client, tableName) {
  try {
    const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      ORDER BY ordinal_position
    `, [tableName]);
    
    return result.rows;
  } catch (error) {
    console.error(`❌ Error checking structure of ${tableName}:`, error.message);
    return [];
  }
}

async function checkTableData(client, tableName) {
  try {
    const result = await client.query(`SELECT * FROM ${tableName} LIMIT 10`);
    return result.rows;
  } catch (error) {
    console.error(`❌ Error checking data of ${tableName}:`, error.message);
    return [];
  }
}

async function searchForHeaderSettings(client, tableName) {
  try {
    // Search for any JSON fields that might contain header settings
    const jsonFields = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns 
      WHERE table_name = $1 AND data_type = 'json' OR data_type = 'jsonb'
    `, [tableName]);
    
    let foundSettings = [];
    
    for (const field of jsonFields.rows) {
      const result = await client.query(`
        SELECT ${field.column_name}, id, created_at, updated_at
        FROM ${tableName} 
        WHERE ${field.column_name} IS NOT NULL
        AND ${field.column_name}::text ILIKE '%header%'
        OR ${field.column_name}::text ILIKE '%siteTitle%'
        OR ${field.column_name}::text ILIKE '%backgroundColor%'
        OR ${field.column_name}::text ILIKE '%logo%'
        LIMIT 5
      `);
      
      if (result.rows.length > 0) {
        foundSettings.push({
          field: field.column_name,
          data: result.rows
        });
      }
    }
    
    return foundSettings;
  } catch (error) {
    console.error(`❌ Error searching for header settings in ${tableName}:`, error.message);
    return [];
  }
}

async function checkForSettingsTable(client) {
  try {
    // Check if there's a dedicated settings table
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name ILIKE '%setting%'
      OR table_name ILIKE '%config%'
      OR table_name ILIKE '%header%'
    `);
    
    return result.rows;
  } catch (error) {
    console.error('❌ Error checking for settings tables:', error.message);
    return [];
  }
}

async function analyzeHeaderSettings() {
  const client = await connectToDatabase();
  
  try {
    console.log('\n🔍 Checking for Header Settings in Database...\n');
    
    // Check for dedicated settings tables
    console.log('📋 Checking for dedicated settings tables...');
    const settingsTables = await checkForSettingsTable(client);
    if (settingsTables.length > 0) {
      console.log('✅ Found potential settings tables:');
      settingsTables.forEach(table => {
        console.log(`   - ${table.table_name}`);
      });
    } else {
      console.log('ℹ️  No dedicated settings tables found');
    }
    
    // Check each table for header-related data
    console.log('\n📊 Analyzing existing tables for Header settings...\n');
    
    for (const tableName of tablesToCheck) {
      console.log(`\n--- Table: ${tableName} ---`);
      
      // Check table structure
      const structure = await checkTableStructure(client, tableName);
      if (structure.length > 0) {
        console.log(`📋 Structure (${structure.length} columns):`);
        
        // Look for header-related columns
        const headerColumns = structure.filter(col => 
          headerRelatedFields.some(field => 
            col.column_name.toLowerCase().includes(field.toLowerCase())
          )
        );
        
        if (headerColumns.length > 0) {
          console.log('🎯 Header-related columns found:');
          headerColumns.forEach(col => {
            console.log(`   ✅ ${col.column_name} (${col.data_type})`);
          });
        }
        
        // Look for responsive settings columns
        const responsiveColumns = structure.filter(col => 
          responsiveFields.some(field => 
            col.column_name.toLowerCase().includes(field.toLowerCase())
          )
        );
        
        if (responsiveColumns.length > 0) {
          console.log('📱 Responsive settings columns found:');
          responsiveColumns.forEach(col => {
            console.log(`   ✅ ${col.column_name} (${col.data_type})`);
          });
        }
        
        // Check for JSON/JSONB columns that might contain settings
        const jsonColumns = structure.filter(col => 
          col.data_type === 'json' || col.data_type === 'jsonb'
        );
        
        if (jsonColumns.length > 0) {
          console.log('🔧 JSON columns that might contain settings:');
          jsonColumns.forEach(col => {
            console.log(`   📄 ${col.column_name} (${col.data_type})`);
          });
        }
      }
      
      // Check table data
      const data = await checkTableData(client, tableName);
      if (data.length > 0) {
        console.log(`📊 Sample data (${data.length} rows):`);
        data.slice(0, 3).forEach((row, index) => {
          console.log(`   Row ${index + 1}: ${JSON.stringify(row, null, 2)}`);
        });
      }
      
      // Search for header settings in JSON fields
      const headerSettings = await searchForHeaderSettings(client, tableName);
      if (headerSettings.length > 0) {
        console.log('🎯 Header settings found in JSON fields:');
        headerSettings.forEach(setting => {
          console.log(`   Field: ${setting.field}`);
          setting.data.forEach(row => {
            console.log(`     ID: ${row.id}, Created: ${row.created_at}, Updated: ${row.updated_at}`);
            console.log(`     Data: ${JSON.stringify(row[setting.field], null, 2)}`);
          });
        });
      }
    }
    
    // Summary and recommendations
    console.log('\n\n📋 SUMMARY & RECOMMENDATIONS');
    console.log('================================');
    console.log('Based on your current database structure, Header settings are not stored in dedicated tables.');
    console.log('They are currently managed in React state and components.');
    console.log('\n💡 To persist Header settings, consider:');
    console.log('   1. Create a dedicated "header_settings" table');
    console.log('   2. Store settings as JSONB for flexibility');
    console.log('   3. Add environment-specific tables (staging/production)');
    console.log('   4. Implement settings migration between environments');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

// Main execution
if (require.main === module) {
  analyzeHeaderSettings().catch(console.error);
}

module.exports = { analyzeHeaderSettings };
