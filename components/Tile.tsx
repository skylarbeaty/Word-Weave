import { useRef, forwardRef, useLayoutEffect, useEffect } from 'react'
import { useGameContext } from './Game';

interface TileProps {
  id: number
  letter: string
}

const Tile = forwardRef<HTMLDivElement, TileProps>((props, ref) => {
  const targetPos = useRef<{ left: number; top: number } | null>(null)
  const gameContext = useGameContext()!
  const myTile = gameContext.tiles[props.id - 1]
  const mySpace = gameContext.spaces[myTile.spaceID - 1]

  useLayoutEffect(() => {
    // capture current target position
    if (mySpace.divRef) {
      const rect = mySpace.divRef.getBoundingClientRect()
      targetPos.current = {left: rect.left, top: rect.top}
    }

    // animate to target position
    if (targetPos.current && myTile.divRef){
      const rect = myTile.divRef.getBoundingClientRect()
      const deltaX = targetPos.current.left - rect.left;
      const deltaY = targetPos.current.top - rect.top;

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

  return (
    <div className='draggable w-10 h-10 flex fixed items-center justify-center rounded bg-indigo-600 text-white drop-shadow-md'
      ref={ref}
    >
      {props.letter}
    </div>
  )
})

export default Tile