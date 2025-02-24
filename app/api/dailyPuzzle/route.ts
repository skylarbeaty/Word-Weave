import { prisma } from "@/app/lib/db"
import { getServerSession } from "next-auth"
import authOptions from "@/app/lib/authOptions"

export async function GET() {
  try {
    const today = new Date()

    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 0, 0, 0))
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 23, 59, 59))
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
      puzzle: JSON.parse(puzzle.lettersScrambled),
      puzzleID: puzzle.id
    }), { status: 200 })

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try{
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 })
    }

    const { puzzleID, boardState, score } = await req.json()

    if (!puzzleID || !boardState || typeof score !== "number") {
      return new Response(JSON.stringify({ error: "Invalid request data" }), { status: 400 })
    }

    // Get user ID
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    })

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 })
    }

    // Check if puzzle exists
    const puzzle = await prisma.puzzle.findUnique({
      where: { id: puzzleID },
      select: { id: true },
    })

    if (!puzzle) {
      return new Response(JSON.stringify({ error: "Puzzle not found" }), { status: 404 })
    }

    // Prevent duplicate submissions
    const existingSolution = await prisma.puzzleSolution.findUnique({
      where: { userID_puzzleID: { userID: user.id, puzzleID } },
    })

    if (existingSolution) {
      return new Response(JSON.stringify({ error: "Solution already submitted" }), { status: 409 })
    }

    // Save the solution
    const solution = await prisma.puzzleSolution.create({
      data: {
        userID: user.id,
        puzzleID,
        boardState,
        score,
      },
    });

    return new Response(JSON.stringify({ message: "Solution submitted", solution }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
  }
}