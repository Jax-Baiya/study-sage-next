import { Configuration, OpenAIApi } from 'openai'
import { NextResponse } from 'next/server'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  if (!configuration.apiKey) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
  }

  const { topic } = await req.json()

  if (!topic || topic.trim().length === 0) {
    return NextResponse.json({ error: 'Please provide a valid topic' }, { status: 400 })
  }

  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: generatePrompt(topic),
      max_tokens: 1000,
      temperature: 0.6,
    })

    const flashcards = parseFlashcards(completion.data.choices[0].text || '')
    return NextResponse.json({ flashcards })
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data)
      return NextResponse.json({ error: error.response.data }, { status: error.response.status })
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`)
      return NextResponse.json({ error: 'An error occurred during your request.' }, { status: 500 })
    }
  }
}

function generatePrompt(topic: string) {
  return `Generate 5 flashcards about ${topic}. Each flashcard should have a question and an answer. Format the output as follows:

Q1: [Question 1]
A1: [Answer 1]

Q2: [Question 2]
A2: [Answer 2]

... and so on for 5 flashcards.`
}

function parseFlashcards(text: string) {
  const flashcards = []
  const lines = text.split('\n')
  let currentCard: { question?: string; answer?: string } = {}

  for (const line of lines) {
    if (line.startsWith('Q')) {
      if (currentCard.question) {
        flashcards.push(currentCard)
        currentCard = {}
      }
      currentCard.question = line.substring(line.indexOf(':') + 1).trim()
    } else if (line.startsWith('A')) {
      currentCard.answer = line.substring(line.indexOf(':') + 1).trim()
    }
  }

  if (currentCard.question) {
    flashcards.push(currentCard)
  }

  return flashcards
}

