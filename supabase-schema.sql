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

-- Create Post table
CREATE TABLE IF NOT EXISTS "Post" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tags TEXT,
    published BOOLEAN DEFAULT FALSE,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    image TEXT,
    FOREIGN KEY ("authorId") REFERENCES "User"(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_published ON "Post"(published);
CREATE INDEX IF NOT EXISTS idx_post_slug ON "Post"(slug);
CREATE INDEX IF NOT EXISTS idx_post_author ON "Post"("authorId");
CREATE INDEX IF NOT EXISTS idx_post_created_at ON "Post"("createdAt");
CREATE INDEX IF NOT EXISTS idx_user_email ON "User"(email);

-- Enable Row Level Security (RLS)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- Create policies for User table
CREATE POLICY "Users can view own profile" ON "User"
    FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = id);

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

CREATE TRIGGER update_post_updated_at BEFORE UPDATE ON "Post"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();