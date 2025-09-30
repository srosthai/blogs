# SrosThaiDev Blog - Project Documentation

## 📋 Project Overview

**SrosThaiDev Blog** is a modern, full-stack blog application built with Next.js 15, featuring a complete content management system with authentication, file uploads, and SEO optimization. The project uses a hybrid database approach combining Prisma schema with Supabase backend.

### 🔗 Domain
- **Production URL**: [blog.srosthai.dev](https://blog.srosthai.dev)
- **Tech Stack**: Next.js 15, TypeScript, TailwindCSS, Supabase, NextAuth.js

---

## 🏗️ Architecture Overview

### Technology Stack
```
Frontend: Next.js 15 + React 19 + TypeScript
Styling: TailwindCSS v4 + Radix UI + Framer Motion
Backend: Next.js API Routes + Supabase PostgreSQL
Auth: NextAuth.js v4 (Credentials Provider)
Database: Hybrid Prisma Schema + Supabase Client
Deployment: Vercel Ready
```

### Key Features
- ✅ Complete CMS with rich markdown editor
- ✅ Authentication system with admin protection
- ✅ Category and tag management
- ✅ File upload system with image optimization
- ✅ SEO optimization with meta tags and structured data
- ✅ Dark/light theme support
- ✅ Responsive design with mobile-first approach
- ✅ Search functionality
- ✅ Dynamic sitemap generation

---

## 📁 Project Structure

```
/home/dev/Native-Project/blogs/
├── 📂 src/
│   ├── 📂 app/                          # Next.js App Router
│   │   ├── 📂 (public)/                 # Public routes (no auth required)
│   │   │   ├── 📄 page.tsx              # Homepage - Blog listing with search
│   │   │   ├── 📄 layout.tsx            # Public layout with navbar/footer
│   │   │   ├── 📂 blog/[slug]/          # Individual blog post pages
│   │   │   │   ├── 📄 page.tsx          # Dynamic blog post with SEO
│   │   │   │   └── 📄 not-found.tsx     # 404 for invalid posts
│   │   │   ├── 📂 auth/                 # Authentication pages
│   │   │   │   ├── 📂 signin/           # Login page
│   │   │   │   └── 📂 signup/           # Registration page
│   │   │   └── 📂 tags/                 # Tags listing page
│   │   ├── 📂 admin/                    # Protected admin routes
│   │   │   ├── 📄 page.tsx              # Admin dashboard
│   │   │   ├── 📄 layout.tsx            # Admin layout with sidebar
│   │   │   ├── 📂 new/                  # Create new post
│   │   │   ├── 📂 edit/[id]/            # Edit existing post
│   │   │   └── 📂 categories/           # Category management
│   │   │       ├── 📄 page.tsx          # Categories list
│   │   │       ├── 📂 new/              # Create category
│   │   │       └── 📂 edit/[id]/        # Edit category
│   │   ├── 📂 api/                      # API Routes
│   │   │   ├── 📂 auth/                 # Authentication endpoints
│   │   │   │   ├── 📂 [...nextauth]/    # NextAuth handler
│   │   │   │   ├── 📂 signup/           # User registration
│   │   │   │   └── 📂 logout/           # Logout handler
│   │   │   ├── 📂 admin/                # Admin CRUD operations
│   │   │   │   ├── 📂 posts/            # Posts management
│   │   │   │   └── 📂 categories/       # Categories management
│   │   │   ├── 📂 posts/                # Public posts API
│   │   │   ├── 📂 upload/               # File upload handler
│   │   │   └── 📂 uploads/[filename]/   # Static file serving
│   │   ├── 📄 layout.tsx                # Root layout with providers
│   │   ├── 📄 globals.css               # Global styles
│   │   ├── 📄 loading.tsx               # Global loading component
│   │   ├── 📄 not-found.tsx             # Global 404 page
│   │   ├── 📄 error.tsx                 # Error boundary
│   │   ├── 📄 global-error.tsx          # Global error handler
│   │   └── 📄 sitemap.ts                # Dynamic sitemap generation
│   ├── 📂 components/                   # Reusable React components
│   │   ├── 📂 ui/                       # Base UI components (shadcn/ui)
│   │   │   ├── 📄 button.tsx            # Button component
│   │   │   ├── 📄 card.tsx              # Card layouts
│   │   │   ├── 📄 input.tsx             # Form inputs
│   │   │   ├── 📄 badge.tsx             # Badge/tag components
│   │   │   ├── 📄 floating-dock.tsx     # Navigation dock
│   │   │   └── 📄 sonner.tsx            # Toast notifications
│   │   ├── 📄 PostEditor.tsx            # Rich markdown editor
│   │   ├── 📄 PostCard.tsx              # Blog post preview cards
│   │   ├── 📄 Navbar.tsx                # Main navigation
│   │   ├── 📄 Footer.tsx                # Site footer
│   │   ├── 📄 admin-sidebar.tsx         # Admin navigation sidebar
│   │   ├── 📄 CodeBlock.tsx             # Syntax-highlighted code blocks
│   │   ├── 📄 CategorySelect.tsx        # Category picker
│   │   ├── 📄 NavbarSearch.tsx          # Search functionality
│   │   ├── 📄 ThemeProvider.tsx         # Theme context provider
│   │   ├── 📄 ThemeToggle.tsx           # Dark/light mode toggle
│   │   ├── 📄 ScrollToTop.tsx           # Scroll to top button
│   │   └── 📄 SessionProvider.tsx       # NextAuth session provider
│   ├── 📂 lib/                          # Utility libraries
│   │   ├── 📄 auth.ts                   # NextAuth configuration
│   │   ├── 📄 prisma.ts                 # Database adapter (Supabase)
│   │   ├── 📄 utils.ts                  # Utility functions
│   │   └── 📄 admin-auth.tsx            # Admin route protection
│   └── 📂 types/                        # TypeScript definitions
│       └── 📄 next-auth.d.ts            # NextAuth type extensions
├── 📂 prisma/
│   └── 📄 schema.prisma                 # Database schema definition
├── 📂 public/                           # Static assets
│   ├── 📄 robots.txt                    # SEO robots directives
│   ├── 📄 manifest.json                 # PWA manifest
│   ├── 📄 me-fav.png                    # Site favicon/logo
│   └── 📂 uploads/                      # User uploaded files
├── 📂 scripts/
│   └── 📄 create-admin.js               # Admin user creation script
├── 📄 supabase-schema.sql               # Supabase database setup
├── 📄 package.json                      # Dependencies and scripts
├── 📄 next.config.ts                    # Next.js configuration
├── 📄 tailwind.config.js                # TailwindCSS configuration
├── 📄 tsconfig.json                     # TypeScript configuration
└── 📄 .env.local                        # Environment variables
```

---

## 🔄 Application Flow

### 1. Public User Flow
```
🌐 Homepage (/) 
├── Search & Filter Posts
├── Browse by Categories
├── View Individual Posts (/blog/[slug])
└── Authentication (/auth/signin, /auth/signup)
```

### 2. Content Consumer Journey
```
🔍 Discovery → 📖 Reading → 🔗 Sharing → 👤 Account Creation (Optional)
```

### 3. Admin Content Management Flow
```
🔐 Admin Login → 📊 Dashboard → ➕ Create/Edit Posts → 🗂️ Manage Categories → 📤 Publish
```

### 4. Content Creation Workflow
```
📝 Draft Creation → 🖼️ Image Upload → 🏷️ Tag Assignment → 🗂️ Category Selection → 📋 Preview → 🚀 Publish
```

---

## 🗄️ Database Schema

### Models
```typescript
User {
  id: String (Primary Key)
  email: String (Unique)
  name: String?
  image: String?
  password: String
  createdAt: DateTime
  updatedAt: DateTime
  posts: Post[] (One-to-Many)
}

Post {
  id: String (Primary Key)
  title: String
  content: String (Markdown)
  slug: String (Unique)
  tags: String? (Comma-separated)
  image: String? (Featured image URL)
  published: Boolean
  authorId: String (Foreign Key)
  categoryId: String? (Foreign Key)
  createdAt: DateTime
  updatedAt: DateTime
  author: User (Many-to-One)
  category: Category? (Many-to-One)
}

Category {
  id: String (Primary Key)
  name: String
  description: String?
  status: Boolean (Active/Inactive)
  createdAt: DateTime
  updatedAt: DateTime
  posts: Post[] (One-to-Many)
}
```

### Database Features
- 🔒 Row Level Security (RLS) policies
- 🔄 Automated timestamp triggers
- 📊 Indexed fields for performance
- 🔗 Foreign key constraints with CASCADE delete
- 🆔 UUID primary keys with custom generation

---

## 🔐 Authentication System

### Implementation
- **Provider**: NextAuth.js Credentials
- **Password Security**: bcryptjs hashing
- **Session Management**: JWT tokens
- **Route Protection**: Middleware + component guards

### Auth Flow
```
📧 Email/Password → 🔐 Validation → 🎫 JWT Token → 🏠 Session Storage → 🛡️ Route Access
```

### Protected Routes
- `/admin/*` - Requires authentication
- `/api/admin/*` - Admin API endpoints
- `/api/upload` - File upload (authenticated users only)

---

## 📝 Content Management Features

### Post Editor Capabilities
- 📝 Rich markdown editor with live preview
- 🖼️ Drag-and-drop image uploads
- 🏷️ Tag and category management
- 🔗 Auto-slug generation
- 👁️ Draft/publish toggle
- 📱 Mobile-responsive editing

### Admin Dashboard
- 📊 Posts overview with statistics
- 🔍 Search and filter functionality
- 📋 Bulk operations (publish/unpublish)
- 🗂️ Category management
- 👀 View modes (grid/table)

---

## 🎨 UI/UX Features

### Design System
- 🎨 Modern component library (Radix UI + shadcn/ui)
- 🌓 Dark/light theme support
- 📱 Mobile-first responsive design
- ✨ Smooth animations (Framer Motion)
- 🔤 Typography system (Geist fonts)

### Navigation
- 🚢 Floating dock navigation
- 🔍 Global search functionality
- 🌙 Theme toggle
- 👤 Session-aware user menu
- 📱 Mobile hamburger menu

---

## 🚀 SEO & Performance

### SEO Features
- 📊 Dynamic meta tags (title, description, keywords)
- 📱 Open Graph tags for social sharing
- 🐦 Twitter Card optimization
- 🔗 Canonical URLs
- 🗺️ Dynamic XML sitemap generation
- 🤖 robots.txt configuration
- 📋 JSON-LD structured data

### Performance Optimizations
- ⚡ Next.js App Router architecture
- 🖼️ Image optimization with Next.js Image
- 📦 Automatic code splitting
- 💾 HTTP caching headers
- 🏃‍♂️ Static generation for public pages

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint

# Database schema generation
npm run postinstall
```

---

## 📁 File Upload System

### Storage Strategy
- **Development**: Local filesystem (`/public/uploads/`)
- **Production**: Temporary filesystem (`/tmp/`)
- **Supported Formats**: JPEG, PNG, WebP, GIF
- **Size Limit**: 5MB maximum
- **Security**: File type validation + unique naming

### Upload Flow
```
📎 File Selection → ✅ Validation → 🔄 Upload to Server → 🔗 URL Generation → 💾 Database Storage
```

---

## 🔌 API Endpoints

### Public APIs
```
GET /api/posts - Fetch published posts
GET /api/uploads/[filename] - Serve uploaded files
```

### Authentication APIs
```
POST /api/auth/signup - User registration
POST /api/auth/[...nextauth] - NextAuth handlers
POST /api/auth/logout - Session logout
```

### Admin APIs
```
GET/POST/PUT/DELETE /api/admin/posts - Post CRUD
GET/POST/PUT/DELETE /api/admin/categories - Category CRUD
POST /api/upload - File upload handler
```

---

## 🧩 Key Components

### Core Components
- **PostEditor**: Rich markdown editor with preview
- **PostCard**: Blog post preview with responsive design
- **Navbar**: Floating dock navigation with search
- **AdminSidebar**: Dashboard navigation
- **CodeBlock**: Syntax-highlighted code display
- **CategorySelect**: Category picker with async loading

### UI Components
- **Button**: Customizable button variants
- **Card**: Flexible card layouts
- **Badge**: Tag/status indicators
- **Input/Textarea**: Form components
- **FloatingDock**: Modern navigation dock

---

## 🌟 Advanced Features

### Search & Filtering
- 🔍 Real-time search across posts
- 🗂️ Category-based filtering
- 🏷️ Tag-based discovery
- 📊 Results pagination

### Content Features
- 📝 Markdown with GitHub Flavored Markdown (GFM)
- 🎨 Syntax highlighting for 20+ languages
- 📋 One-click code copying
- 🖼️ Responsive image handling
- 🔗 Auto-linking and preview generation

### Admin Features
- 📊 Dashboard analytics
- 🔄 Bulk operations
- 👀 Preview before publish
- 📱 Mobile admin interface
- 🗂️ Category management with status toggle

---

## 🛡️ Security Features

### Data Protection
- 🔐 Password hashing with bcryptjs
- 🎫 JWT token authentication
- 🛡️ Route-level protection
- 📝 Input validation and sanitization
- 🔒 Row Level Security (RLS) in database

### File Security
- ✅ File type validation
- 📏 Size limitations
- 🔒 Secure file serving
- 🚫 Prevention of directory traversal

---

## 📈 Monitoring & Analytics

### Built-in Monitoring
- 🚨 Error boundaries for graceful error handling
- 📊 Build-time performance metrics
- 🔍 Development error reporting
- 📝 Console logging for debugging

### Extensibility Points
- 📊 Ready for Google Analytics integration
- 📈 Placeholder for performance monitoring
- 🔔 Toast notification system for user feedback

---

## 🚀 Deployment Configuration

### Vercel Ready
- ✅ Optimized for Vercel deployment
- 🌐 Edge runtime compatibility
- 📊 Automatic performance monitoring
- 🔄 Environment variable management

### Environment Variables
```bash
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://blog.srosthai.dev
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
```

---

## 🎯 Future Enhancement Opportunities

### Feature Roadmap
- 👥 Multi-user support with role management
- 💬 Comment system with moderation
- 📧 Email newsletter integration
- 📅 Content scheduling system
- 🌍 Internationalization (i18n)
- 📊 Advanced analytics dashboard
- 🔔 Real-time notifications
- 🔍 Full-text search with Elasticsearch
- 📱 PWA capabilities
- 🤖 AI-powered content suggestions

### Technical Improvements
- 🧪 Test coverage implementation
- 📚 API documentation with OpenAPI
- 🌐 CDN integration for file uploads
- 🔄 Real-time collaboration
- 📊 Performance monitoring
- 🛠️ Admin API rate limiting
- 🔐 OAuth provider integration

---

## 💡 Development Notes

### Code Quality
- ✅ Full TypeScript implementation
- 📏 ESLint configuration
- 🎨 Consistent code formatting
- 🏗️ Modular component architecture
- 📚 Self-documenting code patterns

### Best Practices
- 🔒 Security-first development
- 📱 Mobile-first responsive design
- ♿ Accessibility considerations
- ⚡ Performance optimization
- 🧩 Component reusability
- 📊 SEO-friendly architecture

---

## 📞 Support & Maintenance

### Documentation
- 📖 Comprehensive code comments
- 🔧 Setup and deployment guides
- 🐛 Error handling documentation
- 📊 Performance optimization notes

### Troubleshooting
- 🔍 Common issues and solutions
- 📝 Development environment setup
- 🚀 Production deployment checklist
- 🔧 Database migration guides

---

**Created with ❤️ for SrosThaiDev Blog**  
*Last Updated: December 2024*