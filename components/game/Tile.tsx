import { useRef, forwardRef, useLayoutEffect, useEffect, useState } from 'react'
import { useGameContext } from './Game'

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>((props, ref) => {
  const targetPos = useRef<{ left: number, top: number } | null>(null)
  const prevPos = useRef<{left: number, top: number} | null>(null)
  const initPos = useRef<{left: number, top: number} | null>(null)
  const tileGhostRef = useRef<HTMLDivElement | null>(null)
  
  const [ready, setReady] = useState<boolean>(false)
  const [ghostReady, setGhostReady] = useState<boolean>(false)
  const [resized, setResized] = useState<boolean>(false)
  
  const gameContext = useGameContext()!
  const myTile = gameContext.tiles[props.id - 1]
  const mySpace = gameContext.spaces[myTile.spaceID - 1]
  const selection = gameContext.selection
  const updateSelection = gameContext.updateSelection
  let mouseDelta = {x: 0, y: 0} // for dragging ghost image
  
  let bgStyle = "bg-indigo-600"
  if (gameContext.solution.solutionTiles.has(myTile.id))
    bgStyle = "bg-emerald-700"
  else if (gameContext.solution.disconnectedValidTiles.has(myTile.id))
    bgStyle = "bg-sky-400"
  if (gameContext.solution.errorTiles.has(myTile.id))
    bgStyle = "bg-rose-400"

  let ringStyle = ""
  if (selection && selection[0] === props.id)// if first selected
    ringStyle = "ring-amber-300 ring-1 xs-box:ring-2 sm-box:ring-[3px]"
  else if (selection && selection.includes(props.id))// if in selection but not first
    ringStyle = "outline-amber-300 outline-dashed outline-1 xs-box:outline-2 sm-box:outline-[3px]"

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

    window.addEventListener("resize", () => {setResized(true)})
    return () => window.removeEventListener("resize", () => {setResized(true)})
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
    const rect = myTile.divRef?.getBoundingClientRect()
    if (rect && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) {
      updateSelection(-1)//if commited to dragging, cancel selection
    }
    
    setGhostReady(true)
    updateGhost(e.clientX - mouseDelta.x, e.clientY - mouseDelta.y)
  }

  const handlePointerUp = (e: PointerEvent) => {
    //handle dragging
    e.preventDefault() 
    gameContext.changeDragID(-1)
    setGhostReady(false)
    
    // handle click
    const rect = myTile.divRef?.getBoundingClientRect()
    if (rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      updateSelection(props.id)
    }

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
      <div className={`flex fixed items-center justify-center rounded
        w-4 h-4 xs-box:w-6 xs-box:h-6 sm-box:w-8 sm-box:h-8 md-box:w-10 md-box:h-10
        text-[0.5rem] xs-box:text-[0.7rem] sm-box:text-[0.9rem] md-box:text-[1rem]
        ${ready && `${bgStyle} text-white drop-shadow-md`}
        ${gameContext.dragID === myTile.id && "animate-pulse"}
        ${gameContext.dragID === -1 ? "draggable" : "dragging"}
        ${ringStyle}
        `}
        ref={ref}
        onPointerDown={handlePointerDown}
      >
        {ready && props.letter}
      </div>
      {gameContext.dragID === myTile.id &&
        // ghost tile that follows the cursor when dragging
        <div className={`dragging pointer-events-none touch-none flex fixed items-center justify-center rounded 
          w-4 h-4 xs-box:w-6 xs-box:h-6 sm-box:w-8 sm-box:h-8 md-box:w-10 md-box:h-10
          text-[0.5rem] xs-box:text-[0.7rem] sm-box:text-[0.9rem] md-box:text-[1rem]
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