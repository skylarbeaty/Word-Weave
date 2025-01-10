import React from 'react';
import Tile from './Tile';

const Panel = () => {
  return (
    <div className="mt-6 bg-indigo-300 p-4 rounded shadow-lg">
      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: 30 }).map((_, index) => (
          <Tile key={index} letter="A" />
        ))}
      </div>
    </div>
  )
}

export default Panel