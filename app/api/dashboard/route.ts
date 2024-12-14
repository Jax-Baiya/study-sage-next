import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      flashcards: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Calculate upcoming reviews (this is a placeholder, you'll need to implement the actual logic)
  const upcomingReviews = user.flashcards.length

  // Calculate study streak (this is a placeholder, you'll need to implement the actual logic)
  const studyStreak = 5

  // Get recent activity (this is a placeholder, you'll need to implement the actual logic)
  const recentActivity = [
    { action: 'Created new flashcard', date: '2023-07-15' },
    { action: 'Completed review session', date: '2023-07-14' },
    { action: 'Generated AI flashcards', date: '2023-07-13' },
  ]

  const dashboardData = {
    totalFlashcards: user.flashcards.length,
    decksCount: 1, // Assuming all flashcards are in one deck for now
    upcomingReviews,
    studyStreak,
    recentActivity,
  }

  return NextResponse.json(dashboardData)
}

