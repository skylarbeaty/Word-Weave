"use client"

import { useEffect, useState } from 'react'
import Game from '@/components/Game'
import LoadingSpinner from '@/components/LoadingSpinner'

const boardSize = { width: 10, height: 10 }

export default function Daily() {
  const [letters, setLetters] = useState([])
  const [puzzleID, setPuzzleID] = useState("")

  useEffect(() => {
    async function fetchPuzzle() {
      try {
        const response = await fetch("/api/dailyPuzzle")
        const data = await response.json()
        if (data.puzzle) {
          setLetters(data.puzzle)
          setPuzzleID(data.puzzleID)
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
          <Game letters={letters} boardSize={boardSize} puzzleID={puzzleID}/>
        ) : (
          <LoadingSpinner/>
        )}
      </div>
    </div>
  )
}
