#!/usr/bin/env node

/**
 * Script to ensure admin users always exist in the database
 * Run this after any database migrations or schema changes
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function ensureUsers() {
  try {
    console.log('🔐 Ensuring admin users exist...');

    // Check if admin users exist
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: 'admin@company.com' },
          { email: 'admin@example.com' }
        ]
      }
    });

    console.log(`Found ${existingUsers.length} existing users`);

    // Create or update admin@company.com
    const adminCompanyPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminCompanyHash = await bcrypt.hash(adminCompanyPassword, 12);

    const adminCompany = await prisma.user.upsert({
      where: { email: 'admin@company.com' },
      update: {
        password: adminCompanyHash,
        name: 'Admin User',
        role: 'ADMIN'
      },
      create: {
        email: 'admin@company.com',
        password: adminCompanyHash,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    console.log('✅ admin@company.com user ensured');

    // Create or update admin@example.com
    const adminExamplePassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminExampleHash = await bcrypt.hash(adminExamplePassword, 12);

    const adminExample = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {
        password: adminExampleHash,
        name: 'Admin User',
        role: 'ADMIN'
      },
      create: {
        email: 'admin@example.com',
        password: adminExampleHash,
        name: 'Admin User',
        role: 'ADMIN'
      }
    });

    console.log('✅ admin@example.com user ensured');

    // Create sample company if it doesn't exist
    const sampleCompany = await prisma.company.upsert({
      where: { id: 'sample-company-id' },
      update: {},
      create: {
        id: 'sample-company-id',
        name: 'Sample Company',
        description: 'A sample company for demonstration purposes',
        website: process.env.SAMPLE_COMPANY_WEBSITE || 'https://example.com',
        email: process.env.SAMPLE_COMPANY_EMAIL || 'info@example.com',
        phone: process.env.SAMPLE_COMPANY_PHONE || '+1-555-0123',
        address: process.env.SAMPLE_COMPANY_ADDRESS || '123 Sample Street, Sample City, SC 12345'
      }
    });

    console.log('✅ Sample company ensured');

    console.log('\n🎉 All users and sample data ensured!');
    console.log('\n📋 Available login credentials:');
    console.log('   Email: admin@company.com, Password: admin123');
    console.log('   Email: admin@example.com, Password: admin123');

  } catch (error) {
    console.error('❌ Error ensuring users:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
ensureUsers();
