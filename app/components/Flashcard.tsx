import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { FlipVerticalIcon as Flip, Edit, Trash } from 'lucide-react'

interface FlashcardProps {
  id: string
  question: string
  answer: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const Flashcard: React.FC<FlashcardProps> = ({ id, question, answer, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <Card className="w-full max-w-md mx-auto perspective-1000">
      <div className={`relative w-full h-64 transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        <CardContent className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Question:</h3>
            <p>{question}</p>
          </div>
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
              <Flip className="mr-2 h-4 w-4" /> Flip
            </Button>
            <div>
              <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardContent className="absolute w-full h-full backface-hidden bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col justify-between rotate-y-180">
          <div>
            <h3 className="text-xl font-semibold mb-2">Answer:</h3>
            <p>{answer}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
            <Flip className="mr-2 h-4 w-4" /> Flip
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}

export default Flashcard

