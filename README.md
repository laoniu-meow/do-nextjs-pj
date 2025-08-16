# Company WebApp - Next.js Full-Stack Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🏗️ Project Architecture

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL with Docker containerization
- **Authentication**: JWT-based with bcrypt password hashing
- **UI Framework**: Material-UI (MUI) with custom components
- **Validation**: Zod schema validation
- **Security**: Role-based access control, middleware protection

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL database

### Environment Setup

1. Copy `.env.example` to `.env.local` and configure your environment variables
2. Ensure your PostgreSQL database is running

### Database Setup

```bash
# Start PostgreSQL container
docker compose --env-file .env.local up -d db_de4864

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Seed initial data
npm run db:seed
```

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open [http://localhost:3000](http://localhost:3000) with your browser
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── users/         # User authentication
│   │   ├── companies/     # Company management
│   │   ├── contents/      # Content management
│   │   └── admin/         # Admin-only routes
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database configuration
│   ├── validation.ts      # Input validation schemas
│   └── api-response.ts    # API response utilities
└── middleware.ts           # Route protection middleware
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push database schema
npm run db:seed      # Seed database with initial data
npm run db:studio    # Open Prisma Studio
```

## 🔐 Security Features

- JWT-based authentication with configurable expiration
- Role-based access control (ADMIN, USER, EDITOR)
- Secure password hashing with bcrypt
- Input validation with Zod schemas
- Protected API routes with middleware
- Environment variable protection

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
