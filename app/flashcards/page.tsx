'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import FlashcardList from '../components/FlashcardList'
import FlashcardForm from '../components/FlashcardForm'
import AIGenerator from '../components/AIGenerator'
import ReviewMode from '../components/ReviewMode'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { FlashcardReviewData } from '../utils/spacedRepetition'

interface Flashcard {
  id: string
  question: string
  answer: string
}

export default function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const [isReviewMode, setIsReviewMode] = useState(false)
  const [reviewData, setReviewData] = useState<FlashcardReviewData[]>([])
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchFlashcards()
    }
  }, [session])

  const fetchFlashcards = async () => {
    const response = await fetch('/api/flashcards')
    const data = await response.json()
    setFlashcards(data)
  }

  const handleCreateFlashcard = async (data: { question: string; answer: string }) => {
    const response = await fetch('/api/flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const newFlashcard = await response.json()
    setFlashcards([...flashcards, newFlashcard])
  }

  const handleEditFlashcard = (id: string) => {
    const cardToEdit = flashcards.find((card) => card.id === id)
    if (cardToEdit) {
      setEditingCard(cardToEdit)
    }
  }

  const handleUpdateFlashcard = async (data: { question: string; answer: string }) => {
    if (editingCard) {
      const response = await fetch(`/api/flashcards/${editingCard.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updatedFlashcard = await response.json()
      setFlashcards(flashcards.map((card) => card.id === updatedFlashcard.id ? updatedFlashcard : card))
      setEditingCard(null)
    }
  }

  const handleDeleteFlashcard = async (id: string) => {
    await fetch(`/api/flashcards/${id}`, { method: 'DELETE' })
    setFlashcards(flashcards.filter((card) => card.id !== id))
    setReviewData(reviewData.filter((data) => data.id !== id))
  }

  const handleGenerateFlashcards = async (generatedFlashcards: Array<{ question: string; answer: string }>) => {
    const newFlashcards = await Promise.all(generatedFlashcards.map(async (card) => {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      })
      return response.json()
    }))
    setFlashcards([...flashcards, ...newFlashcards])
  }

  const handleStartReview = () => {
    setIsReviewMode(true)
  }

  const handleCompleteReview = () => {
    setIsReviewMode(false)
  }

  const handleUpdateReviewData = (newReviewData: FlashcardReviewData) => {
    setReviewData((prevData) =>
      prevData.map((data) => (data.id === newReviewData.id ? newReviewData : data))
    )
  }

  const getDueFlashcards = () => {
    const now = new Date()
    return flashcards.filter((card) => {
      const cardReviewData = reviewData.find((data) => data.id === card.id)
      return !cardReviewData || cardReviewData.dueDate <= now
    })
  }

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Flashcards</h1>
      {isReviewMode ? (
        <ReviewMode
          flashcards={getDueFlashcards()}
          onComplete={handleCompleteReview}
          onUpdateReviewData={handleUpdateReviewData}
        />
      ) : (
        <>
          <Button onClick={handleStartReview}>Start Review</Button>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList>
              <TabsTrigger value="manual">Manual Creation</TabsTrigger>
              <TabsTrigger value="ai">AI Generator</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              {editingCard ? (
                <FlashcardForm onSubmit={handleUpdateFlashcard} initialData={editingCard} />
              ) : (
                <FlashcardForm onSubmit={handleCreateFlashcard} />
              )}
            </TabsContent>
            <TabsContent value="ai">
              <AIGenerator onGenerate={handleGenerateFlashcards} />
            </TabsContent>
          </Tabs>
          <FlashcardList
            flashcards={flashcards}
            onEdit={handleEditFlashcard}
            onDelete={handleDeleteFlashcard}
          />
        </>
      )}
    </div>
  )
}

