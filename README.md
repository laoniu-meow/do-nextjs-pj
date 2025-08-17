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
│   └── admin/             # Admin page
├── components/             # React components
│   ├── ui/                # Reusable UI components
│   │   ├── AdminMenuButton.tsx    # Admin menu toggle button
│   │   ├── MenuItemList.tsx       # Configurable menu list component
│   │   ├── Button.tsx             # Base button component
│   │   ├── ResponsiveButton.tsx   # Responsive button with breakpoints
│   │   ├── Container.tsx          # Responsive container component
│   │   ├── Drawer.tsx             # Drawer/sidebar component
│   │   ├── config/                # Component configuration
│   │   │   └── menuConfig.ts      # Menu configuration system
│   │   ├── constants/             # Theme and styling constants
│   │   │   └── theme.ts           # Admin menu theme constants
│   │   └── hooks/                 # Custom React hooks
│   │       └── useMenuState.ts    # Menu state management hook
│   ├── layout/             # Layout components
│   │   └── ResponsiveLayout.tsx   # Responsive layout system
│   └── examples/           # Component usage examples
├── data/                   # Data structures
│   └── adminPageMenu.ts   # Admin menu configuration
├── hooks/                  # Custom React hooks
│   ├── useResponsive.ts   # Responsive breakpoint hook
│   └── useAuth.ts         # Authentication hook
├── styles/                 # CSS stylesheets
│   ├── globals.css        # Global styles and Tailwind
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
│   ├── breakpoints.ts     # Responsive breakpoint utilities
│   ├── cache.ts           # Caching utilities
│   ├── env.ts             # Environment configuration
│   ├── rate-limit.ts      # Rate limiting utilities
│   └── utils.ts           # General utility functions
├── types/                  # TypeScript type definitions
│   └── index.ts           # Core application types
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

### AdminMenuButton Component

- **Purpose**: Reusable admin menu toggle button with drawer
- **Features**:
  - Fixed positioning (top-right corner)
  - Configurable positioning via props
  - Right-side drawer menu
  - Responsive design for all screen sizes
  - Customizable menu configuration
  - Type-safe with TypeScript interfaces
- **Usage**: Admin pages, dashboard navigation, settings access

### MenuItemList Component

- **Purpose**: Configurable menu list component
- **Features**:
  - Configuration-driven menu structure
  - Support for nested submenus (Settings → Company Profile, etc.)
  - Material-UI icons and styling
  - Expandable/collapsible sections
  - Customizable actions and styling
  - Type-safe configuration system
- **Usage**: Admin navigation, settings menus, nested navigation

### Button Components

- **Base Button**: Simple, customizable button with variants
- **ResponsiveButton**: Breakpoint-aware button with responsive sizing
- **Features**: Multiple variants, sizes, loading states, responsive design

### Container & Layout Components

- **Container**: Responsive container with breakpoint-aware sizing
- **ResponsiveLayout**: Flexible layout system (grid, sidebar, stack, masonry)
- **GridContainer**: CSS Grid-based responsive container
- **FlexContainer**: Flexbox-based responsive container

### Drawer Component

- **Purpose**: Slide-out drawer/sidebar component
- **Features**:
  - 4 positions (left, right, top, bottom)
  - 4 sizes (small, medium, large, full)
  - Responsive behavior (auto-adjusts for mobile)
  - Compound component pattern for flexibility
  - Built-in accessibility and animations
- **Usage**: Settings panels, navigation drawers, mobile menus

## ⚙️ Configuration System

### Menu Configuration

- **Centralized Configuration**: All menu items defined in `menuConfig.ts`
- **Type Safety**: Full TypeScript interfaces for menu structure
- **Flexible Actions**: Customizable click handlers for each menu item
- **Icon System**: Material-UI icon integration
- **Easy Maintenance**: Single source of truth for menu structure

### Theme Constants

- **Consistent Styling**: Centralized theme values in `theme.ts`
- **Responsive Design**: Breakpoint-aware spacing and sizing
- **Maintainable**: Easy to update colors, spacing, and dimensions
- **Type Safe**: Const assertions for compile-time safety

### Custom Hooks

- **useMenuState**: Menu open/close state management
- **useResponsive**: Responsive breakpoint detection
- **useAuth**: Authentication state management

## 🎯 Admin Features

### Admin Menu Structure

- **Dashboard**: Main admin overview
- **Users**: User management
- **Settings**: Configurable settings with sub-items:
  - Company Profile
  - Header & Main
  - Footer
  - Hero Page
  - Pages
- **Logout**: Secure session termination

### Responsive Design

- **Mobile-First**: Optimized for all device sizes
- **Breakpoint System**: Consistent responsive behavior
- **Touch-Friendly**: Optimized for mobile interactions
- **Accessibility**: ARIA labels and keyboard navigation

## 🛠️ Development Tools & Configuration

### Code Quality

- **ESLint**: Code quality and security scanning
- **TypeScript**: Static type checking and IntelliSense
- **Prettier**: Code formatting (if configured)
- **Husky**: Git hooks for quality assurance

### Testing & Quality

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **Type Checking**: Compile-time error detection
- **Linting**: Runtime error prevention

### VS Code/Cursor Setup

- **Tailwind CSS Extension**: Official extension for IntelliSense
- **TypeScript Support**: Full type checking and IntelliSense
- **ESLint Integration**: Real-time error detection
- **Component Navigation**: Easy component discovery

## 🚀 Recent Refactoring Improvements

### Code Quality Enhancements

- ✅ **Removed unused variables** and imports
- ✅ **Fixed all linting warnings** and errors
- ✅ **Improved TypeScript compliance** with proper interfaces
- ✅ **Enhanced component reusability** with configuration system
- ✅ **Centralized styling** with theme constants
- ✅ **Improved accessibility** with semantic HTML
- ✅ **Better error handling** and type safety

### Architecture Improvements

- ✅ **Configuration-driven components** for easy customization
- ✅ **Custom hooks** for reusable logic
- ✅ **Type-safe interfaces** throughout the system
- ✅ **Modular component structure** for maintainability
- ✅ **Consistent theming system** for design consistency

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - learn about Tailwind CSS utilities.
- [React Documentation](https://react.dev) - learn about React features and hooks.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Material-UI Documentation](https://mui.com/material-ui/) - learn about MUI components.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
