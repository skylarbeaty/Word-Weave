import React from 'react'
import { useGameContext } from './Game'

const ButtonPanel = () => {
  const gameContext = useGameContext()!
  const tiles = gameContext.tiles
  const spaces = gameContext.spaces
  const solution = gameContext.solution

  const handleReturnButton = () => {
    const boardTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
    const returnTiles = boardTiles.filter(tile => !solution.solutionTiles.has(tile.id))
    let emptySpaces = spaces.filter(space => space.position.container === "panel" 
                                    && !tiles.find(tile => tile.spaceID === space.id))

    returnTiles.forEach(tile => {
      if (emptySpaces.length > 0)
        gameContext.moveTile(tile.id, emptySpaces.shift()!.id)
      else
        console.log("Error: No spaces left to return tiles")
    })
  }

  return (
    <div className='bg-indigo-200 mt-2 mb-2 p-4 rounded shadow-lg flex justify-between'>
        <button className='bg-indigo-800 text-white p-3 ml-1 min-w-24 rounded-lg'
          onPointerDown={handleReturnButton}
        >
          Return
        </button>
        <button className='bg-indigo-800 text-white p-3 mr-1 mr-1 min-w-24 rounded-lg'>Restart</button>
        <button className='bg-indigo-800 text-white p-3 ml-1 mr-1 min-w-24 rounded-lg'>Shuffle</button>
        <button className='bg-indigo-800 text-white p-3 ml-1 min-w-24 rounded-lg'>Move</button>
    </div>
  )
}

export default ButtonPanel