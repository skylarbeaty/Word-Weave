import { useRef, forwardRef, useLayoutEffect, useEffect } from 'react'
import { useGameContext } from './Game';

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>((props, ref) => {
  const targetPos = useRef<{ left: number; top: number } | null>(null)
  const tileGhostRef = useRef<HTMLDivElement | null>(null)
  const gameContext = useGameContext()!
  const myTile = gameContext.tiles[props.id - 1]
  const mySpace = gameContext.spaces[myTile.spaceID - 1]
  let mouseDelta = {x: 0, y: 0}

  useLayoutEffect(() => {
    // capture current target position
    if (mySpace.divRef) {
      const rect = mySpace.divRef.getBoundingClientRect()
      targetPos.current = {left: rect.left, top: rect.top}
    }

    // animate to target position
    if (targetPos.current && myTile.divRef){
      const rect = myTile.divRef.getBoundingClientRect()
      const deltaX = targetPos.current.left - rect.left
      const deltaY = targetPos.current.top - rect.top

      if (deltaX || deltaY){
        myTile.divRef.style.transform = ""
        myTile.divRef.style.transition = "transform"

        requestAnimationFrame(() => {
          if (myTile.divRef) {
            myTile.divRef.style.transform = `translate(${deltaX}px, ${deltaY}px)`
            myTile.divRef.style.transition = "transform 300ms ease-in-out"
          }
        })
      }
    }
  }, [myTile?.spaceID, gameContext.spaces])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()

    const rect = myTile.divRef?.getBoundingClientRect()!
    mouseDelta = {x: e.clientX - rect.x, y: e.clientY - rect.y}
    console.log(mouseDelta.x)
    updateGhost(e.clientX - mouseDelta.x, e.clientY - mouseDelta.y)
    gameContext.changeDragID(props.id)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault() 
    updateGhost(e.clientX - mouseDelta.x, e.clientY - mouseDelta.y)
  }

  const handleMouseUp = (e: MouseEvent) => {
    e.preventDefault() 
    gameContext.changeDragID(-1)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const updateGhost = (posx: number, posY: number) =>{
    if (myTile.divRef && tileGhostRef.current){
      tileGhostRef.current.style.left = `${posx}px`
      tileGhostRef.current.style.top = `${posY}px`
    }
  }

  return (
    <>
      <div className={`w-10 h-10 flex fixed items-center justify-center rounded bg-indigo-600 text-white drop-shadow-md
        ${gameContext.dragID === myTile.id && "animate-pulse"}
        ${gameContext.dragID === -1 ? "draggable" : "dragging"}
        `}
        ref={ref}
        onMouseDown={handleMouseDown}
      >
        {props.letter}
      </div>
      {gameContext.dragID === myTile.id &&
        <div className='dragging w-10 h-10 flex fixed items-center justify-center rounded bg-indigo-400 animate-pulse text-white drop-shadow-md'
          ref={tileGhostRef}
        >
          {props.letter}
        </div>
      }
    </>
  )
})

export default Tile