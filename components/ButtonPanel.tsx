import React from 'react'
import { useGameContext } from './Game'
import { shuffleArray } from '@/util/shuffle'
import { debounce } from "@/util/debounce"

const ButtonPanel = () => {
  const gameContext = useGameContext()!
  const tiles = gameContext.tiles
  const spaces = gameContext.spaces
  const solution = gameContext.solution
  const moveTile = gameContext.moveTile

  const handleReturn = () => {
    const boardTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
    const returnTiles = boardTiles.filter(tile => !solution.solutionTiles.has(tile.id))
    let emptySpaces = spaces.filter(space => space.position.container === "panel" && !tiles.find(tile => tile.spaceID === space.id))

    returnTiles.forEach(tile => {
      if (emptySpaces.length > 0)
        moveTile(tile.id, emptySpaces.shift()!.id) // move each tile to the next empty space
      else
        console.log("Error: No spaces left to return tiles")
    })
  }

  const handleRestart = () => {
    tiles.forEach(tile => {
      moveTile(tile.id, tile.id + 140) // move each tile to its original location
    })
  }

  const handleShuffle = () => {
    const panelTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "panel")
    let unusedSpaces = shuffleArray(spaces.filter(space => space.position.container === "panel"))

    panelTiles.forEach(tile => {
      moveTile(tile.id, unusedSpaces.shift()!.id)
    })
  }

  return (
    <div className='bg-indigo-200 mt-2 m-1 sm:m-0 sm:mb-2 p-1 sm:p-4 rounded shadow-lg flex justify-between'>
        <button className='bg-indigo-800 text-white p-2 m-1 sm:m-0 rounded-lg min-w-20 sm:min-w-28 text-l sm:text-xl'
          onPointerDown={handleReturn}
        >
          Return
        </button>
        <button className='bg-indigo-800 text-white p-2 m-1 sm:m-0 rounded-lg min-w-20 sm:min-w-28 text-l sm:text-xl'
          onPointerDown={debounce(handleShuffle, 100)}
        >
          Shuffle
        </button>
        <button className='bg-indigo-800 text-white p-2 m-1 sm:m-0 rounded-lg min-w-20 sm:min-w-28 text-l sm:text-xl'
          onPointerDown={handleRestart}
        >
          Restart
        </button>
    </div>
  )
}

export default ButtonPanel