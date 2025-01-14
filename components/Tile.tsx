import { forwardRef } from 'react';

import { useTilesContext } from './Game';

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>(({ id, letter }, ref) => {
  const tilesContext = useTilesContext()!
  const dragID = tilesContext.dragID
  const setDragID = tilesContext.changeDragID

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setDragID(id)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault() 
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault() 
    setDragID(-1)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  return (
    <div className={`draggable w-10 h-10 flex items-center justify-center rounded text-white drop-shadow-md
      ${dragID == id ? "bg-indigo-600" : "bg-indigo-900"}
      ${dragID >=0 ? "dragging" : ""}`}
      onMouseDown={handleMouseDown}
      ref={ref}
      >
        {letter}
    </div>
  )
})

export default Tile