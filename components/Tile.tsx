import { forwardRef, useRef, useLayoutEffect } from 'react';

import { useTilesContext } from './Game';

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>(({ id, letter }, ref) => {
  const tilesContext = useTilesContext()!
  const dragID = tilesContext.dragID
  const setDragID = tilesContext.changeDragID

  const tileRef = useRef<HTMLDivElement | null>(null)
  const outerRef = useRef<HTMLDivElement | null>(null)
  const prevPos = useRef<{ left: number; top: number } | null>(null)
  const targetPos = useRef<{ left: number; top: number } | null>(null)
  const animationRef = useRef<number | null>(null)
  let intervalID: number;

  useLayoutEffect(() => {
    if(tileRef.current && outerRef.current){
      let rect = outerRef.current.getBoundingClientRect()
      targetPos.current = {left: rect.left, top: rect.top}
      if (prevPos.current){
        const deltaX = prevPos.current.left - targetPos.current.left;
        const deltaY = prevPos.current.top - targetPos.current.top;

        if (deltaX || deltaY){
          tileRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
          tileRef.current.style.transition = "transform 0s"

          requestAnimationFrame(() => {
            if (tileRef.current) {
              tileRef.current.style.transform = ""
              tileRef.current.style.transition = "transform 50ms linear"
              animatePrevPos()
            }
          })
        }
      } else{
        prevPos.current = {left: rect.left, top: rect.top}
      }
    }
    return () => {
      if (intervalID) 
        clearInterval(intervalID)
      if (tileRef.current){
        const currentRect = tileRef.current.getBoundingClientRect()
        prevPos.current = {left: currentRect.left, top: currentRect.top}
      }
    }
  })

  const animatePrevPos = () => {//update the previous position while the tile animates its movement
    const intervalTime = 2;
    let iter = 0;
    if (intervalID)
      clearInterval(intervalID)
    intervalID = window.setInterval(() => {
      if (tileRef.current){
        const currentRect = tileRef.current.getBoundingClientRect()
        prevPos.current = {left: currentRect.left, top: currentRect.top}

        if (Math.abs(currentRect.left - targetPos.current!.left) < 0.1 &&
            Math.abs(currentRect.top - targetPos.current!.top) < 0.1){
              clearInterval(intervalID)
            }

        if (iter > 10000){
          console.log("animation timeout")
          clearInterval(intervalID)
        }
        iter++
      }
    },intervalTime)
  }

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
    // outside div snaps to location
    <div //className={`w-11 h-11 ${(dragID == id) ? 'bg-yellow-400' : ''} ${(dragID != id && id % 2 == 0) ? 'bg-slate-700' : 'bg-red-700'}`}
      ref={(div) => {
        outerRef.current = div
        if(typeof ref === 'function') {
          ref(div) // ref for parent
        }
      }}>
        {/* inside div for movement animation */}
        <div className={`draggable w-10 h-10 flex items-center justify-center rounded text-white drop-shadow-md transition-all ease-in-out
          ${dragID == id ? "bg-indigo-600  animate-pulse" : "bg-indigo-900"}
          ${dragID >=0 ? "dragging" : ""}`}
          onMouseDown={handleMouseDown}
          ref={(div) => {
            tileRef.current = div
            // if(ref && typeof ref != 'function') {
            //   ref.current = div // ref for self
            // }
          }}
          >
            {letter}
        </div>
    </div>
  )
})

export default Tile