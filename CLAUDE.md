# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a modern blog application built with Next.js 15 (App Router), TypeScript, and Prisma. The application features a dual database setup (SQLite for development, Supabase for production), NextAuth.js authentication, and a rich markdown editor with image upload capabilities.

## Key Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

### Database
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database (development)
npx prisma studio    # Open Prisma Studio
node scripts/create-admin.js  # Create admin user
```

## Architecture

### Tech Stack
- **Next.js 15** with App Router and React 19
- **Database**: SQLite (development) + Supabase (production) via Prisma
- **Authentication**: NextAuth.js with credentials provider and bcrypt
- **UI**: shadcn/ui components with Tailwind CSS 4
- **Editor**: Custom markdown editor with syntax highlighting
- **File Upload**: Environment-aware system (local/temp storage)

### Database Models
The schema defines four main entities:
- **User**: Admin authentication with email/password
- **Post**: Blog posts with title, content, slug, published status
- **Tag**: Categorization system with many-to-many relationship to posts
- **PostTag**: Junction table for post-tag relationships

### Key Architectural Patterns

#### Database Abstraction
The `src/lib/prisma.ts` file provides a unified interface that works with both SQLite (dev) and Supabase (production), wrapping the Supabase client to maintain Prisma-like syntax.

#### Authentication Flow
- Admin-only system using NextAuth.js
- Protected routes use `AdminAuthGuard` component
- Credentials provider with bcrypt password hashing
- Session management with proper type definitions

#### File Upload System
- Development: Files stored in `public/uploads/`
- Production: Files stored in `/tmp/uploads/` and served via API route
- Validation: File type, size limits (5MB), unique naming with nanoid
- Security: Path traversal protection, content type validation

#### Component Architecture
- **Reusable UI components** in `src/components/ui/` (shadcn/ui)
- **Feature components** in `src/components/` (Navbar, Footer, etc.)
- **Page components** follow Next.js App Router conventions
- **Consistent error handling** with error.tsx and loading.tsx

### API Routes Structure
```
/api/auth/[...nextauth]  # NextAuth.js authentication
/api/upload              # File upload handling
/api/uploads/[filename]  # File serving (production only)
/api/posts              # CRUD operations for posts
/api/tags               # Tag management
```

### Important Utilities

#### Database Connection (`src/lib/prisma.ts`)
Handles environment-specific database connections and provides a unified interface for both development and production databases.

#### Authentication Config (`src/lib/auth.ts`)
NextAuth.js configuration with credentials provider, session management, and type definitions.

#### Validation Schemas (`src/lib/validations.ts`)
Zod schemas for form validation and type safety across the application.

#### Markdown Processing
- Editor with formatting toolbar and live preview
- Syntax highlighting for code blocks
- Image upload integration within editor
- Copy-to-clipboard functionality for code blocks

### Environment Configuration

#### Development
- Uses SQLite database (`dev.db`)
- Files uploaded to `public/uploads/`
- Local authentication with seeded admin user

#### Production
- Connects to Supabase PostgreSQL
- Files stored in `/tmp/uploads/` (serverless constraints)
- Environment variables for database and auth configuration

## Component Patterns

### Page Components
- Use async components for data fetching
- Implement proper loading and error states
- Follow consistent layout patterns with Navbar/Footer

### Form Components
- Integrate with react-hook-form and Zod validation
- Use shadcn/ui form components for consistency
- Implement proper error handling and user feedback

### Editor Components
- Custom markdown editor with toolbar
- Real-time preview functionality
- Image upload integration
- Keyboard shortcuts for common formatting

### Admin Components
- Protected by `AdminAuthGuard`
- Consistent styling and layout
- Proper CRUD operations with optimistic updates

## Deployment Considerations

### Serverless Constraints
- File uploads use temporary storage in production
- Database operations optimized for connection pooling
- Static assets properly configured for CDN delivery

### Environment Variables
Required environment variables for production:
- `DATABASE_URL` (Supabase connection)
- `NEXTAUTH_SECRET` (authentication)
- `NEXTAUTH_URL` (deployment URL)

### Build Optimization
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Optimized bundle size with proper imports

## Development Workflow

### Creating Admin User
Use the provided script to create an admin user:
```bash
node scripts/create-admin.js
```

### Adding New Features
- Follow existing component patterns
- Use TypeScript throughout
- Implement proper error handling
- Add loading states for async operations
- Test with both development and production database setups

### Database Changes
- Update Prisma schema
- Run `npx prisma generate` to update client
- Use `npx prisma db push` for development
- Consider migration strategy for production

This architecture provides a solid foundation for a modern blog application with proper separation of concerns, type safety, and deployment flexibility.