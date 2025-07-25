import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { nanoid } from 'nanoid'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${nanoid()}.${fileExtension}`
    
    // Determine upload directory based on environment
    let uploadsDir: string
    let filePath: string
    
    if (process.env.NODE_ENV === 'production') {
      // In production (serverless), use /tmp directory
      uploadsDir = join('/tmp', 'uploads')
      filePath = join(uploadsDir, fileName)
    } else {
      // In development, use public/uploads
      uploadsDir = join(process.cwd(), 'public', 'uploads')
      filePath = join(uploadsDir, fileName)
    }

    // Create uploads directory if it doesn't exist
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true })
      }
      await writeFile(filePath, buffer)
    } catch (error) {
      console.error('Directory creation or file write error:', error)
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
    }

    // Return the public URL
    const imageUrl = process.env.NODE_ENV === 'production' 
      ? `/api/uploads/${fileName}`
      : `/uploads/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      url: imageUrl,
      filename: fileName 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}