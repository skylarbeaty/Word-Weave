"use client"

import { useEffect, useState } from 'react'
import Game from '@/components/Game'
import LoadingSpinner from '@/components/LoadingSpinner'

const boardSize = { width: 10, height: 10 }

interface userSolution{
  score: number,
  submittedAt: string,
  boardState: string[][]
}

export const dynamic = "force-dynamic";

export default function Daily() {
  const [letters, setLetters] = useState([])
  const [puzzleID, setPuzzleID] = useState("")
  const [userSolution, setUserSolution] = useState<null | userSolution>(null)

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        const response = await fetch(`/api/dailyPuzzle?timezone=${encodeURIComponent(timeZone)}`)
        const data = await response.json()
        if (data.puzzle) {
          setLetters(data.puzzle)
          setPuzzleID(data.puzzleID)
          setUserSolution(data.userSolution)
        } else {
          console.error("Failed to load puzzle:", data.error)
        }
      } catch (error) {
        console.error("Error fetching puzzle:", error)
      }
    }

    fetchPuzzle()
  }, [])

  return (
    <div className="bg-slate-100 flex items-center justify-center w-full">
      <div className="h-svh w-svw">
        {letters.length > 0 ? (
          userSolution ? (
            <div className='text-center justify-self-center'>
              <h1>
                You've submitted the puzzle for today
              </h1>
              <p>
                It was submitted {new Date(userSolution.submittedAt).toLocaleString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  hour12: true, 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-lg">
                Your score: <span className="font-semibold">{userSolution.score}</span>
              </p>
            </div>
          ) : (
            <Game letters={letters} boardSize={boardSize} puzzleID={puzzleID}/>
          )
        ) : (
          <LoadingSpinner/>
        )}
      </div>
    </div>
  )
}
