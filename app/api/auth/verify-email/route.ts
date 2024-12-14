import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  const { token } = await request.json()

  const user = await prisma.user.findFirst({
    where: { verificationToken: token },
  })

  if (!user) {
    return NextResponse.json({ error: 'Invalid verification token' }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      verificationToken: null,
    },
  })

  return NextResponse.json({ message: 'Email verified successfully' })
}

