import React from 'react'
import { useGameContext } from './Game'
import Space from './Space'

const TilePanel = () => {
  const mySpaces = useGameContext()!.spaces.filter(space => space.position.container == "panel")

  return (
    <div id="panel" className={`grid grid-cols-10 justify-self-center bg-indigo-300 rounded-lg shadow-lg
        p-[2px]   xs-box:p-[4px]    sm-box:p-[8px]    md-box:p-[16px]
        gap-[2px] xs-box:gap-[4px]  sm-box:gap-[6px]  md-box:gap-[8px]`}>
        {mySpaces.map((space, index) => (
            <Space 
              key={space.id} 
              id={space.id}
            />
        ))}
    </div>
  )
}

export default TilePanel