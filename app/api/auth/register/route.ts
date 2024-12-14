import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { sendVerificationEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { name, email, password } = await request.json()

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex')

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: null,
      verificationToken,
    },
  })

  // Send verification email
  await sendVerificationEmail(user.email, verificationToken)

  return NextResponse.json({ message: 'User registered successfully' })
}

