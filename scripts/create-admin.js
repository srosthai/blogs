const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  const name = process.argv[2]
  const email = process.argv[3]
  const password = process.argv[4]

  if (!name || !email || !password) {
    console.log('Usage: node scripts/create-admin.js "Your Name" "your@email.com" "your-password"')
    process.exit(1)
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ User with this email already exists')
      process.exit(1)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    console.log('✅ Admin user created successfully!')
    console.log(`Name: ${user.name}`)
    console.log(`Email: ${user.email}`)
    console.log('You can now sign in at: http://localhost:3000/auth/signin')

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()