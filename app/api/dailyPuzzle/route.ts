import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const today = new Date()

    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0));
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59));
    const puzzle = await prisma.puzzle.findFirst({
      where: {
        date: {
          gte: startOfDay, // >= midnight UTC
          lt: endOfDay,    // < eod UTC
        },
      },
    });

    if (!puzzle) {
      return new Response(JSON.stringify({ error: "No puzzle found for today." }), { status: 404 })
    }

    return new Response(JSON.stringify({ 
      alpha: puzzle.lettersAlpha,
      puzzle: JSON.parse(puzzle.lettersScrambled) 
    }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
  }
}