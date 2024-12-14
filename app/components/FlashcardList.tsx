import Flashcard from './Flashcard'

interface FlashcardData {
  id: string
  question: string
  answer: string
}

interface FlashcardListProps {
  flashcards: FlashcardData[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const FlashcardList: React.FC<FlashcardListProps> = ({ flashcards, onEdit, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {flashcards.map((flashcard) => (
        <Flashcard
          key={flashcard.id}
          id={flashcard.id}
          question={flashcard.question}
          answer={flashcard.answer}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

export default FlashcardList

