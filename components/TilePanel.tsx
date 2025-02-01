import React from 'react'
import { useGameContext } from './Game';
import Space from './Space';

const TilePanel = () => {
  const mySpaces = useGameContext()!.spaces.filter(space => space.position.container == "panel")

  return (
    <div className="bg-indigo-300 p-1 m-1 sm:m-0 sm:p-4 rounded shadow-lg">
      <div id="panel" className="grid grid-cols-10 gap-1 sm:gap-2 min-h-10">
          {mySpaces.map((space, index) => (
              <Space 
                key={space.id} 
                id={space.id}
              />
          ))}
      </div>
    </div>
  )
}

export default TilePanel