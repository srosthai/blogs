# My Blog

A modern, feature-rich blog application built with Next.js 15, offering a seamless writing and reading experience with a powerful admin interface.

## ✨ Features

- **Rich Markdown Editor** - Advanced editor with formatting toolbar, live preview, and syntax highlighting
- **Image Upload System** - Drag-and-drop image uploads with automatic optimization
- **Admin Dashboard** - Complete content management system with draft/publish workflow
- **Tag System** - Organize posts with tags and filtering capabilities
- **Search Functionality** - Full-text search across posts and tags
- **Dark/Light Mode** - System-aware theme switching
- **Responsive Design** - Mobile-first design that works on all devices
- **SEO Optimized** - Built-in meta tags, Open Graph, and structured data
- **Authentication** - Secure admin authentication with NextAuth.js
- **Dual Database Setup** - SQLite for development, Supabase for production

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Prisma with SQLite (dev) / Supabase (prod)
- **Authentication**: NextAuth.js with bcrypt
- **UI Components**: shadcn/ui with Tailwind CSS 4
- **Markdown**: Custom editor with syntax highlighting
- **Deployment**: Vercel-ready with serverless optimizations

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-blogs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"  # For development
   
   # Authentication
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Create an admin user**
   ```bash
   node scripts/create-admin.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Open Prisma Studio
node scripts/create-admin.js  # Create admin user
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog post pages
│   └── tags/              # Tag pages
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── AdminAuthGuard.tsx # Admin route protection
│   ├── Navbar.tsx         # Navigation component
│   └── ...
├── lib/                   # Utility functions
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Database connection
│   └── validations.ts     # Zod schemas
└── types/                 # TypeScript type definitions
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Set up Supabase database**
   - Create a new Supabase project
   - Copy the connection string

2. **Configure environment variables in Vercel**
   ```env
   DATABASE_URL="your-supabase-connection-string"
   NEXTAUTH_SECRET="your-production-secret"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   ```

3. **Deploy**
   ```bash
   git push origin main
   ```

The application is optimized for serverless deployment with proper file handling for production environments.

## 🔐 Admin Access

1. Access the admin dashboard at `/admin`
2. Use the credentials created with the admin creation script
3. Create, edit, and manage blog posts
4. Upload images directly in the editor
5. Manage tags and post visibility

## 🎨 Customization

### Styling
- Modify `src/app/globals.css` for global styles
- Update `tailwind.config.js` for theme customization
- Components use shadcn/ui for consistent design

### Content
- Blog posts support full Markdown with syntax highlighting
- Images are automatically optimized and served efficiently
- Tags provide flexible content organization

## 📝 Writing Posts

1. Navigate to `/admin` and log in
2. Click "New Post" to create a post
3. Use the rich markdown editor with:
   - **Bold**, *italic*, and other formatting
   - Code blocks with syntax highlighting
   - Image uploads via drag-and-drop
   - Live preview of your content
4. Add tags for better organization
5. Save as draft or publish immediately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Open a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

Built with ❤️ using Next.js and modern web technologies.