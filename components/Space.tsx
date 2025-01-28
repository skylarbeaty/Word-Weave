import { useRef, useLayoutEffect, useState } from 'react'
import { useGameContext } from './Game';

interface SpaceProps {
  id: number
}

const Space = ({id}: SpaceProps) => {
  const gameContext = useGameContext()!
  const divRef =  useRef<HTMLDivElement | null>(null)
  const [mouseHover, setMouseHover] = useState<boolean>(false)

  useLayoutEffect(() => {
    gameContext.updateSpace(id, divRef.current)
  })

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (gameContext.dragID != -1)
      setMouseHover(true)
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    setMouseHover(false)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (gameContext.dragID != -1){
      gameContext.moveTile(gameContext.dragID, id)
      setMouseHover(false)
    }
  }

  return (
    <>
      <div className={`w-10 h-10 overflow-visible rounded-md
        ${mouseHover ? `ring-2 ring-emerald-700 border-emerald-400 border-solid` : 
          `border-indigo-400 border border-dashed`}`}
        ref={divRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
      />
    </>
  )
}

export default Space