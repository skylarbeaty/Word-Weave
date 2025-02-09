import React from 'react'
import { useGameContext } from './Game'
import Space from './Space'

const Board = () => {
  const gameContext = useGameContext()! 
  const mySpaces = gameContext.spaces.filter(space => space.position.container == "board")
  const width = gameContext.gameProps.boardSize.width

  return (
    <div id="board" className={`grid justify-self-center
      p-[2px]   xs-box:p-[4px]    sm-box:p-[8px]    md-box:p-[16px]
      gap-[2px] xs-box:gap-[4px]  sm-box:gap-[6px]  md-box:gap-[8px]`}
      style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))` }}>
      {mySpaces.map((space, index) => (
        <Space key={space.id} id={space.id} />
      ))}
    </div>
  )
}

export default Board