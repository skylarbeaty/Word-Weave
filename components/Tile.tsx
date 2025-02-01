import { useRef, forwardRef, useLayoutEffect, useEffect, useState } from 'react'
import { useGameContext } from './Game'

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>((props, ref) => {
  const targetPos = useRef<{ left: number; top: number } | null>(null)
  const prevPos = useRef<{left: number, top: number} | null>(null)
  const initPos = useRef<{left: number, top: number} | null>(null)
  const tileGhostRef = useRef<HTMLDivElement | null>(null)
  
  const [ready, setReady] = useState<boolean>(false)
  const [ghostReady, setGhostReady] = useState<boolean>(false)
  const [resized, setResized] = useState<boolean>(false)
  
  const gameContext = useGameContext()!
  const myTile = gameContext.tiles[props.id - 1]
  const mySpace = gameContext.spaces[myTile.spaceID - 1]
  let mouseDelta = {x: 0, y: 0} // for dragging ghost image
  
  let bgStyle = "bg-indigo-600"
  if (gameContext.solution.solutionTiles.has(myTile.id))
      bgStyle = "bg-emerald-700"
  else if (gameContext.solution.disconnectedValidTiles.has(myTile.id))
      bgStyle = "bg-indigo-900"

  useLayoutEffect(() => {
    
    // handle window resize
    if (resized && mySpace.divRef && myTile.divRef && targetPos.current && prevPos.current && initPos.current){
      const rect = myTile.divRef.getBoundingClientRect()
      let diff = {left: prevPos.current!.left - rect.left, top: prevPos.current!.top - rect.top} 

      initPos.current = {left: initPos.current.left - diff.left, top: initPos.current.top - diff.top}
      prevPos.current = {left: rect.left, top: rect.top}
      setResized(false)
    }

    // capture current target position
    if (mySpace.divRef) {
      const rect = mySpace.divRef.getBoundingClientRect()
      targetPos.current = {left: rect.left, top: rect.top}
    }

    // setup position first time rendering
    if (!prevPos.current && targetPos.current && myTile.divRef){
      const rect = myTile.divRef.getBoundingClientRect()
      prevPos.current = {...targetPos.current}
      initPos.current = {left: rect.left, top: rect.top}
    }

    // animate to target position
    if (targetPos.current && myTile.divRef && prevPos.current && initPos.current){
      const rect = myTile.divRef.getBoundingClientRect()
      const startX = prevPos.current.left - initPos.current.left
      const startY = prevPos.current.top - initPos.current.top
      const deltaX = targetPos.current.left - prevPos.current.left
      const deltaY = targetPos.current.top - prevPos.current.top

      myTile.divRef.style.transform = `translate(${startX}px, ${startY}px)`
      myTile.divRef.style.transition = "transform"

      if (deltaX || deltaY){
        requestAnimationFrame(() => {
          if (myTile.divRef) {
            myTile.divRef.style.transform = `translate(${startX + deltaX}px, ${startY + deltaY}px)`
            myTile.divRef.style.transition = "transform 300ms ease-in-out"
            if (prevPos.current)
              prevPos.current = {...targetPos.current!}
          }
        })
      }
    }
    setReady(true)

    window.addEventListener("resize", () => {setResized(true)});
    return () => window.removeEventListener("resize", () => {setResized(true)});
  }, [myTile?.spaceID, gameContext.spaces])

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault()

    const rect = myTile.divRef?.getBoundingClientRect()!
    mouseDelta = {x: e.clientX - rect.x, y: e.clientY - rect.y}
    updateGhost(e.clientX - mouseDelta.x, e.clientY - mouseDelta.y)
    gameContext.changeDragID(props.id)

    document.addEventListener("pointermove", handlePointerMove, { passive: false })
    document.addEventListener("pointerup", handlePointerUp, { passive: false })
  }

  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault() 
    setGhostReady(true);
    updateGhost(e.clientX - mouseDelta.x, e.clientY - mouseDelta.y)
  }

  const handlePointerUp = (e: PointerEvent) => {
    e.preventDefault() 
    gameContext.changeDragID(-1)
    setGhostReady(false);
    document.removeEventListener("pointermove", handlePointerMove)
    document.removeEventListener("pointerup", handlePointerUp)
  }

  const updateGhost = (posx: number, posY: number) =>{
    if (myTile.divRef && tileGhostRef.current){
      tileGhostRef.current.style.left = `${posx}px`
      tileGhostRef.current.style.top = `${posY}px`
    }
  }

  return (
    <>
      <div className={`w-10 h-10 flex fixed items-center justify-center rounded
        ${ready && `${bgStyle} text-white drop-shadow-md`}
        ${gameContext.dragID === myTile.id && "animate-pulse"}
        ${gameContext.dragID === -1 ? "draggable" : "dragging"}
        `}
        ref={ref}
        onPointerDown={handlePointerDown}
      >
        {ready && props.letter}
      </div>
      {gameContext.dragID === myTile.id &&
        // ghost tile that follows the cursor when dragging
        <div className={`dragging pointer-events-none touch-none w-10 h-10 flex fixed items-center justify-center rounded 
          ${ghostReady && 'bg-indigo-400 animate-pulse text-white drop-shadow-md'}`}
          ref={tileGhostRef}
        >
          {ghostReady && props.letter}
        </div>
      }
    </>
  )
})

export default Tile