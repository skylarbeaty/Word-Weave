import { useRef, useLayoutEffect, useState } from 'react'
import { useGameContext } from './Game';

interface SpaceProps {
  id: number
}

const Space = ({id}: SpaceProps) => {
  const gameContext = useGameContext()!
  const divRef =  useRef<HTMLDivElement | null>(null)
  const [mouseHover, setMouseHover] = useState<boolean>(false)

  let myTile = gameContext.tiles.find(tile => tile.spaceID === id)
  let myBG = `border-indigo-400 border border-dashed`
  if (myTile)
      myBG = ``


  useLayoutEffect(() => {
    gameContext.updateSpace(id, divRef.current)
  })

  const handlePointerEnter = (e: React.PointerEvent) => {
    e.preventDefault() 
    if (gameContext.dragID != -1)
      setMouseHover(true)
  }

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault() 
    setMouseHover(false)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault() 
    if (gameContext.dragID != -1){
      gameContext.moveTile(gameContext.dragID, id)
      setMouseHover(false)
    }
  }

  return (
    <>
      <div className={`w-10 h-10 overflow-visible rounded-md
        ${mouseHover ? `ring-2 ring-emerald-700 border-emerald-400 border-solid` : myBG}`}
        ref={divRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerUp={handlePointerUp}
      />
    </>
  )
}

export default Space