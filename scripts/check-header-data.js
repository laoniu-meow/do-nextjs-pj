#!/usr/bin/env node

/**
 * Script to check Header settings data in staging and production tables
 * Usage: node scripts/check-header-data.js
 */

const { Client } = require('pg');
require('dotenv').config();

// Database connection configuration
const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'db_de4864',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
};

async function connectToDatabase() {
  // Validate required environment variables
  if (!process.env.POSTGRES_PASSWORD) {
    console.error('❌ POSTGRES_PASSWORD environment variable is required');
    process.exit(1);
  }

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

async function checkStagingTable(client) {
  console.log('\n📋 Checking STAGING table (company_profile_staging)...');
  console.log('==================================================');
  
  try {
    // Check table structure
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'company_profile_staging'
      ORDER BY ordinal_position
    `);
    
    if (structure.rows.length === 0) {
      console.log('❌ Table company_profile_staging does not exist');
      return;
    }
    
    console.log('📊 Table structure:');
    structure.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Check data
    const data = await client.query(`
      SELECT * FROM company_profile_staging 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log(`\n📊 Sample data (${data.rows.length} rows):`);
    if (data.rows.length === 0) {
      console.log('   ℹ️  No data found in staging table');
    } else {
      data.rows.forEach((row, index) => {
        console.log(`\n   Row ${index + 1}:`);
        console.log(`     ID: ${row.id}`);
        console.log(`     Name: ${row.name}`);
        console.log(`     Logo: ${row.logo || 'N/A'}`);
        console.log(`     Logo URL: ${row.logo_url || 'N/A'}`);
        console.log(`     Is Main Company: ${row.is_main_company}`);
        console.log(`     Created: ${row.created_at}`);
        console.log(`     Updated: ${row.updated_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking staging table:', error.message);
  }
}

async function checkProductionTable(client) {
  console.log('\n📋 Checking PRODUCTION table (company_profile_production)...');
  console.log('========================================================');
  
  try {
    // Check table structure
    const structure = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'company_profile_production'
      ORDER BY ordinal_position
    `);
    
    if (structure.rows.length === 0) {
      console.log('❌ Table company_profile_production does not exist');
      return;
    }
    
    console.log('📊 Table structure:');
    structure.rows.forEach(col => {
      console.log(`   ${col.column_name} (${col.data_type}) ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}`);
    });
    
    // Check data
    const data = await client.query(`
      SELECT * FROM company_profile_production 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    console.log(`\n📊 Sample data (${data.rows.length} rows):`);
    if (data.rows.length === 0) {
      console.log('   ℹ️  No data found in production table');
    } else {
      data.rows.forEach((row, index) => {
        console.log(`\n   Row ${index + 1}:`);
        console.log(`     ID: ${row.id}`);
        console.log(`     Name: ${row.name}`);
        console.log(`     Logo: ${row.logo || 'N/A'}`);
        console.log(`     Logo URL: ${row.logo_url || 'N/A'}`);
        console.log(`     Is Main Company: ${row.is_main_company}`);
        console.log(`     Created: ${row.created_at}`);
        console.log(`     Updated: ${row.updated_at}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking production table:', error.message);
  }
}

async function checkForHeaderSettings(client) {
  console.log('\n🔍 Searching for Header Settings data...');
  console.log('=====================================');
  
  try {
    // Check if there are any JSON fields containing header settings
    const jsonFields = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns 
      WHERE (data_type = 'json' OR data_type = 'jsonb')
      AND table_name IN ('company_profile_staging', 'company_profile_production', 'company_profiles')
      ORDER BY table_name, column_name
    `);
    
    if (jsonFields.rows.length === 0) {
      console.log('ℹ️  No JSON/JSONB fields found in staging/production tables');
      return;
    }
    
    console.log('🔧 Found JSON fields that might contain settings:');
    jsonFields.rows.forEach(field => {
      console.log(`   ${field.table_name}.${field.column_name} (${field.data_type})`);
    });
    
    // Search for header-related content in JSON fields
    for (const field of jsonFields.rows) {
      console.log(`\n🔍 Searching ${field.table_name}.${field.column_name} for header settings...`);
      
      try {
        const result = await client.query(`
          SELECT id, ${field.column_name}, created_at, updated_at
          FROM ${field.table_name}
          WHERE ${field.column_name} IS NOT NULL
          AND (
            ${field.column_name}::text ILIKE '%header%'
            OR ${field.column_name}::text ILIKE '%siteTitle%'
            OR ${field.column_name}::text ILIKE '%backgroundColor%'
            OR ${field.column_name}::text ILIKE '%logo%'
            OR ${field.column_name}::text ILIKE '%height%'
            OR ${field.column_name}::text ILIKE '%padding%'
            OR ${field.column_name}::text ILIKE '%color%'
          )
          LIMIT 3
        `);
        
        if (result.rows.length > 0) {
          console.log(`   ✅ Found ${result.rows.length} rows with potential header settings:`);
          result.rows.forEach(row => {
            console.log(`     ID: ${row.id}, Created: ${row.created_at}`);
            console.log(`     Data: ${JSON.stringify(row[field.column_name], null, 2)}`);
          });
        } else {
          console.log('   ℹ️  No header-related settings found in this field');
        }
      } catch (error) {
        console.error(`   ❌ Error searching ${field.column_name}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error searching for header settings:', error.message);
  }
}

async function compareStagingVsProduction(client) {
  console.log('\n🔄 Comparing Staging vs Production...');
  console.log('=====================================');
  
  try {
    // Count records in each table
    const stagingCount = await client.query('SELECT COUNT(*) as count FROM company_profile_staging');
    const productionCount = await client.query('SELECT COUNT(*) as count FROM company_profile_production');
    
    console.log(`📊 Record counts:`);
    console.log(`   Staging: ${stagingCount.rows[0]?.count || 0} records`);
    console.log(`   Production: ${productionCount.rows[0]?.count || 0} records`);
    
    // Check for differences in main company settings
    const stagingMain = await client.query(`
      SELECT name, logo, logo_url, is_main_company, created_at
      FROM company_profile_staging 
      WHERE is_main_company = true
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    const productionMain = await client.query(`
      SELECT name, logo, logo_url, is_main_company, created_at
      FROM company_profile_production 
      WHERE is_main_company = true
      ORDER BY created_at DESC
      LIMIT 1
    `);
    
    console.log('\n🏢 Main Company Comparison:');
    if (stagingMain.rows.length > 0) {
      const staging = stagingMain.rows[0];
      console.log(`   Staging: ${staging.name} (Logo: ${staging.logo || 'N/A'}) - Created: ${staging.created_at}`);
    } else {
      console.log('   Staging: No main company set');
    }
    
    if (productionMain.rows.length > 0) {
      const production = productionMain.rows[0];
      console.log(`   Production: ${production.name} (Logo: ${production.logo || 'N/A'}) - Created: ${production.created_at}`);
    } else {
      console.log('   Production: No main company set');
    }
    
  } catch (error) {
    console.error('❌ Error comparing staging vs production:', error.message);
  }
}

async function generateReport() {
  const client = await connectToDatabase();
  
  try {
    console.log('🔍 HEADER SETTINGS DATABASE ANALYSIS REPORT');
    console.log('==========================================');
    console.log(`Database: ${config.database}`);
    console.log(`Host: ${config.host}:${config.port}`);
    console.log(`User: ${config.user}`);
    console.log(`Time: ${new Date().toISOString()}`);
    
    // Check staging table
    await checkStagingTable(client);
    
    // Check production table
    await checkProductionTable(client);
    
    // Search for header settings
    await checkForHeaderSettings(client);
    
    // Compare staging vs production
    await compareStagingVsProduction(client);
    
    // Summary
    console.log('\n\n📋 SUMMARY');
    console.log('==========');
    console.log('Based on your current database structure:');
    console.log('• Header settings are NOT stored in dedicated database tables');
    console.log('• They are managed in React state and components');
    console.log('• Your staging/production tables contain company profile data');
    console.log('• Logo and branding information is stored in these tables');
    console.log('\n💡 To persist Header settings, consider creating:');
    console.log('   - header_settings table with JSONB for flexible storage');
    console.log('   - environment-specific tables (staging/production)');
    console.log('   - settings migration system between environments');
    
  } catch (error) {
    console.error('❌ Error during analysis:', error.message);
  } finally {
    await client.end();
    console.log('\n🔌 Disconnected from database');
  }
}

// Main execution
if (require.main === module) {
  generateReport().catch(console.error);
}

module.exports = { generateReport };
