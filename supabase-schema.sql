-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    password TEXT
);

-- Create Category table
CREATE TABLE IF NOT EXISTS "Category" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    status BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create PostCategory table
CREATE TABLE IF NOT EXISTS "PostCategory" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    image TEXT,
    status BOOLEAN DEFAULT TRUE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Post table
CREATE TABLE IF NOT EXISTS "Post" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tags TEXT,
    published BOOLEAN DEFAULT FALSE,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT,
    "postCategoryId" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image TEXT,
    FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE CASCADE,
    FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE SET NULL,
    FOREIGN KEY ("postCategoryId") REFERENCES "PostCategory"(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_category_name ON "Category"(name);
CREATE INDEX IF NOT EXISTS idx_category_status ON "Category"(status);
CREATE INDEX IF NOT EXISTS idx_postcategory_name ON "PostCategory"(name);
CREATE INDEX IF NOT EXISTS idx_postcategory_status ON "PostCategory"(status);
CREATE INDEX IF NOT EXISTS idx_post_published ON "Post"(published);
CREATE INDEX IF NOT EXISTS idx_post_slug ON "Post"(slug);
CREATE INDEX IF NOT EXISTS idx_post_author ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS idx_post_category ON "Post"("categoryId");
CREATE INDEX IF NOT EXISTS idx_post_postcategory ON "Post"("postCategoryId");
CREATE INDEX IF NOT EXISTS idx_post_created_at ON "Post"("createdAt");
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PostCategory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- Create policies for User table
CREATE POLICY "Users can view own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

-- Create policies for Category table
CREATE POLICY "Anyone can view active categories" ON "Category"
    FOR SELECT USING (status = true);

CREATE POLICY "Authenticated users can view all categories" ON "Category"
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create categories" ON "Category"
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update categories" ON "Category"
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories" ON "Category"
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for PostCategory table
CREATE POLICY "Anyone can view active post categories" ON "PostCategory"
    FOR SELECT USING (status = true);

CREATE POLICY "Authenticated users can view all post categories" ON "PostCategory"
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can create post categories" ON "PostCategory"
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update post categories" ON "PostCategory"
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete post categories" ON "PostCategory"
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create policies for Post table
CREATE POLICY "Anyone can view published posts" ON "Post"
    FOR SELECT USING (published = true);

CREATE POLICY "Authors can view own posts" ON "Post"
    FOR SELECT USING (auth.uid()::text = "authorId");

CREATE POLICY "Authors can create posts" ON "Post"
    FOR INSERT WITH CHECK (auth.uid()::text = "authorId");

CREATE POLICY "Authors can update own posts" ON "Post"
    FOR UPDATE USING (auth.uid()::text = "authorId");

CREATE POLICY "Authors can delete own posts" ON "Post"
    FOR DELETE USING (auth.uid()::text = "authorId");

-- Create triggers for updating updatedAt timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "User"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at BEFORE UPDATE ON "Category"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_postcategory_updated_at BEFORE UPDATE ON "PostCategory"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_updated_at BEFORE UPDATE ON "Post"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();