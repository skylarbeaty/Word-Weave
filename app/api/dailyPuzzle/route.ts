import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'scripts', 'daily-puzzles.txt') // Ensure this path is correct
    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "Puzzle file not found." }), { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const lines = fileContents.split('\n').map(line => line.trim()).filter(line => line)
    
    if (lines.length === 0) {
      return new Response(JSON.stringify({ error: "Puzzle file is empty." }), { status: 500 })
    }

    const startDate = new Date('2025-02-16') // YYYY-MM-DD
    const today = new Date()
    const diffInDays = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const dayIndex = diffInDays % lines.length
    const letters = lines[dayIndex].toUpperCase().split('')
    const shuffledLetters = seededShuffle(letters, dayIndex)

    return new Response(JSON.stringify({ puzzle: shuffledLetters }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
  }
}

function seededShuffle(array: string[], seed: number): string[] {
  let shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randIndex = seed % (i + 1); // Use the seed to generate a predictable swap index
    [shuffled[i], shuffled[randIndex]] = [shuffled[randIndex], shuffled[i]]
    seed = (seed * 9301 + 49297) % 233280
  }
  return shuffled
}