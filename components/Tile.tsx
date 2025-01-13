import { forwardRef } from 'react';

import { useTilesContext } from './Game';

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>(({ id, letter }, ref) => {
  const tilesContext = useTilesContext()!
  const setDragID = tilesContext.changeDragID

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("dragID", String(id)) 
    setDragID(id)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    setDragID(-1)
    document.body.style.cursor = ""
  }

  return (
    <div className={`draggable w-10 h-10 ${tilesContext.dragID == id ? "bg-indigo-600" : "bg-indigo-900"} flex items-center justify-center rounded text-white drop-shadow-md`}
      draggable="true" 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDrop={handleDragEnd}
      ref={ref}
      >
        {letter}
    </div>
  )
})

export default Tile