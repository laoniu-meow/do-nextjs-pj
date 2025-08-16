import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create default admin user
  const adminPassword = await hashPassword('admin123')
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create sample company
  const sampleCompany = await prisma.company.upsert({
    where: { id: 'sample-company-id' },
    update: {},
    create: {
      id: 'sample-company-id',
      name: 'Sample Company',
      description: 'A sample company for demonstration purposes',
      website: 'https://example.com',
      email: 'info@example.com',
      phone: '+1-555-0123',
      address: '123 Sample Street, Sample City, SC 12345'
    }
  })

  console.log('✅ Sample company created:', sampleCompany.name)

  // Create sample content
  const sampleContent = await prisma.content.upsert({
    where: { id: 'sample-content-id' },
    update: {},
    create: {
      id: 'sample-content-id',
      title: 'Welcome to Our Company',
      content: 'This is a sample welcome message for our company website. Feel free to customize this content according to your needs.',
      type: 'PAGE',
      status: 'PUBLISHED'
    }
  })

  console.log('✅ Sample content created:', sampleContent.title)

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
