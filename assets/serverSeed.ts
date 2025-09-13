import { PrismaClient } from '@prisma/client'
import fs from 'node:fs'
import path from 'node:path'

const prisma = new PrismaClient()

async function main(){
    const filePath = path.join(process.cwd(), 'serverSeedData.txt')
    
    if (!fs.existsSync(filePath)) {
        console.error('Puzzle file not found.')
        process.exit(1)
    }

    const fileContents = fs.readFileSync(filePath, 'utf-8')
    const lines = fileContents.split('\n').map(line => line.trim()).filter(line => line)

    if (lines.length === 0) {
        console.error('Puzzle file is empty.')
        process.exit(1)
    }

    const startDate = new Date('2025-9-1')
    const segmentLength = 13
    for (let i = 0; i < lines.length; i += segmentLength) {
        const lettersAlpha = lines[i]
        const lettersScrabbled = JSON.parse(lines[i + 1].replace(/'/g, '"').toUpperCase())
        const knownSolution = lines.slice(i + 3, i + 13) // board as an array of strings

        const puzzleDate = new Date(startDate)
        puzzleDate.setDate(startDate.getDate() + i / segmentLength)

        await prisma.puzzle.create({
            data: {
            date: puzzleDate,
            lettersAlpha,
            lettersScrambled: JSON.stringify(lettersScrabbled),
            knownSolution: JSON.stringify(knownSolution),
            },
        })
    }

    console.log('Puzzles loaded successfully!')
}

main()
    .then(async () => { 
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })