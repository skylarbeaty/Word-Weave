import { prisma } from "@/app/lib/db"
import { getServerSession } from "next-auth"
import authOptions from "@/app/lib/authOptions"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    // Find today's puzzle, based on user time zone
    const url = new URL(req.url)
    const userTimeZone = url.searchParams.get("timezone") || "UTC"
    const now = new Date()
    const localDateString = now.toLocaleDateString("en-US", { timeZone: userTimeZone })
    const localDate = new Date(localDateString)
    const dateString = localDate.toISOString().split("T")[0] + "T00:00:00.000Z"
    console.log("Local:", localDate)
    console.log("Date String:", dateString)

    const puzzle = await prisma.puzzle.findFirst({
      where: {
        date: dateString
      }
    });

    if (!puzzle) {
      return new Response(JSON.stringify({ error: "No puzzle found for today." }), { status: 404 })
    }

    // See if the user has already submitted a solution to this puzzle
    let userSolution = null

    if (session && session.user?.email){
      const user = await prisma.user.findUnique({
        where: {email: session.user.email},
        select: { id: true }
      })

      if (user){
        userSolution = await prisma.puzzleSolution.findUnique({
          where: { userID_puzzleID: {userID: user.id, puzzleID: puzzle.id}},
          select: { 
            score: true,
            boardState: true,
            submittedAt: true
          }
        })

        if (userSolution) {
          userSolution = {
            ...userSolution,
            submittedAt: userSolution.submittedAt.toISOString(), 
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      puzzle: JSON.parse(puzzle.lettersScrambled),
      puzzleID: puzzle.id,
      userSolution
    }), { status: 200 })

  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: "Internal server error." }), { status: 500 })
  }
}

export async function POST(req: Request) {
  try{
    const session = await getServerSession(authOptions)
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