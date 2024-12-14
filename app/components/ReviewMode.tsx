import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { calculateNextReview, FlashcardReviewData } from '../utils/spacedRepetition';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

interface ReviewModeProps {
  flashcards: Flashcard[];
  onComplete: () => void;
  onUpdateReviewData: (reviewData: FlashcardReviewData) => void;
}

const ReviewMode: React.FC<ReviewModeProps> = ({ flashcards, onComplete, onUpdateReviewData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewData, setReviewData] = useState<FlashcardReviewData[]>([]);

  useEffect(() => {
    const initialReviewData = flashcards.map((card) => ({
      id: card.id,
      easeFactor: 2.5,
      interval: 0,
      dueDate: new Date(),
    }));
    setReviewData(initialReviewData);
  }, [flashcards]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (quality: number) => {
    const currentCard = flashcards[currentIndex];
    const currentReviewData = reviewData.find((data) => data.id === currentCard.id);

    if (currentReviewData) {
      const newReviewData = calculateNextReview(currentReviewData, quality);
      onUpdateReviewData(newReviewData);

      setReviewData((prevData) =>
        prevData.map((data) => (data.id === newReviewData.id ? newReviewData : data))
      );
    }

    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      onComplete();
    }
  };

  if (flashcards.length === 0) {
    return <div>No flashcards to review.</div>;
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
          </div>
          <div
            className={`cursor-pointer min-h-[200px] flex items-center justify-center text-center ${
              isFlipped ? 'animate-flip' : ''
            }`}
            onClick={handleFlip}
          >
            {isFlipped ? currentCard.answer : currentCard.question}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-2">
        <Button onClick={() => handleRate(1)} variant="outline">
          Hard
        </Button>
        <Button onClick={() => handleRate(3)} variant="outline">
          Good
        </Button>
        <Button onClick={() => handleRate(5)} variant="outline">
          Easy
        </Button>
      </div>
    </div>
  );
};

export default ReviewMode;

