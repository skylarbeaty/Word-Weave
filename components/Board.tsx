import React from 'react'
import { useGameContext } from './Game';
import Space from './Space'

const Board = () => {
  const mySpaces = useGameContext()!.spaces.filter(space => space.position.container == "board")

  return (
    <div id="board" className="grid grid-cols-10 gap-2 p-4">
      {mySpaces.map((space, index) => (
        <Space key={space.id} id={space.id} />
      ))}
    </div>
  )
}

export default Board