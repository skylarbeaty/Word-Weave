import React from 'react'
import { useGameContext } from './Game';
import Space from './Space'

const Board = () => {
  const mySpaces = useGameContext()!.spaces.filter(space => space.position.container == "board")

  return (
    <div id="board" className="grid grid-cols-10 gap-1 p-2 sm:gap-2 sm:p-4 max-w-full">
      {mySpaces.map((space, index) => (
        <Space key={space.id} id={space.id} />
      ))}
    </div>
  )
}

export default Board