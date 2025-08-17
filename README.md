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
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   │   ├── MenuItemList.tsx   # Menu navigation component
│   │   └── Drawer.tsx         # Drawer/sidebar component
│   └── examples/          # Component usage examples
├── data/                   # Data structures
│   └── adminPageMenu.ts   # Admin menu configuration
├── styles/                 # CSS stylesheets
│   ├── menu.css           # Menu component styles
│   └── drawer.css         # Drawer component styles
├── lib/                    # Utility libraries
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Database configuration
│   ├── validation.ts      # Input validation schemas
│   ├── api-response.ts    # API response utilities
│   ├── config.ts          # Configuration constants
│   ├── pagination.ts      # Pagination utilities
│   ├── ordering.ts        # Data ordering utilities
│   ├── filtering.ts       # Data filtering utilities
│   ├── sanitization.ts    # Data sanitization utilities
│   ├── db-optimization.ts # Database optimization patterns
│   ├── logger.ts          # Secure logging utility
│   └── utils.ts           # General utility functions
└── middleware.ts           # Route protection middleware
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
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
- Rate limiting and CORS protection
- Secure logging with sensitive data filtering
- Data sanitization for API responses

## 🎨 UI Components

### MenuItemList Component

- **Purpose**: Reusable navigation menu component
- **Features**:
  - Multiple variants (horizontal, vertical, dropdown)
  - Responsive design (Mobile, Tablet, Desktop)
  - Support for nested submenus
  - Customizable styling and behavior
  - Accessibility features (ARIA, keyboard navigation)
- **Usage**: Perfect for admin navigation, sidebar menus, and dropdown navigation

### Drawer Component

- **Purpose**: Slide-out drawer/sidebar component
- **Features**:
  - 4 positions (left, right, top, bottom)
  - 4 sizes (small, medium, large, full)
  - Responsive behavior (auto-adjusts for mobile)
  - Compound component pattern for flexibility
  - Built-in accessibility and animations
- **Usage**: Settings panels, navigation drawers, mobile menus

### AdminPageMenu Data Structure

- **Purpose**: Centralized menu configuration
- **Structure**: Hierarchical menu with 5 main settings categories:
  - Company Profile
  - Header & Main
  - Footer
  - Hero Page
  - Pages
- **Benefits**: Easy to maintain, consistent navigation, reusable across components

## 🛠️ Development Tools & Configuration

### VS Code/Cursor Setup

- **Tailwind CSS Extension**: Official extension for IntelliSense and validation
- **CSS Custom Data**: Proper recognition of Tailwind directives
- **Workspace Settings**: Optimized for Next.js and Tailwind development
- **Extension Recommendations**: Auto-installation of helpful extensions

### CSS & Styling

- **Tailwind CSS v4**: Utility-first CSS framework
- **Custom CSS**: Component-specific stylesheets for complex components
- **Responsive Design**: Mobile-first approach with breakpoint utilities
- **Dark Mode Support**: Automatic theme detection and support

### Testing & Quality

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **ESLint**: Code quality and security scanning
- **TypeScript**: Static type checking and IntelliSense

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS utilities.
- [React Documentation](https://react.dev) - learn about React features and hooks.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
