import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'

interface FlashcardFormProps {
  onSubmit: (data: { question: string; answer: string }) => void
  initialData?: { question: string; answer: string }
}

const FlashcardForm: React.FC<FlashcardFormProps> = ({ onSubmit, initialData }) => {
  const [question, setQuestion] = useState(initialData?.question || '')
  const [answer, setAnswer] = useState(initialData?.answer || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ question, answer })
    if (!initialData) {
      setQuestion('')
      setAnswer('')
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Flashcard' : 'Create Flashcard'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Question
            </label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="answer" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Answer
            </label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">{initialData ? 'Update' : 'Create'}</Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default FlashcardForm

