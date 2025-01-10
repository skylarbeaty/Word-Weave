import React from 'react';
import BoardSpace from './BoardSpace';

const Board = () => {
  return (
    <div className="grid grid-cols-10 gap-2 p-4">
      {Array.from({ length: 140 }).map((_, index) => (
        <BoardSpace key={index}>
          {/* Future Tile Placement */}
        </BoardSpace>
      ))}
    </div>
  )
}

export default Board