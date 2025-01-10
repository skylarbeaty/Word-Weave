import React from 'react'

interface TileProps {
    letter: string;
}

const Tile = ({ letter }: TileProps) => {
  return (
    <div className="w-10 h-10 bg-indigo-900 flex items-center justify-center rounded text-white drop-shadow-md">
        {letter}
    </div>
  )
}

export default Tile