import { useRef, useLayoutEffect, useState } from 'react'
import { useGameContext } from './Game'

interface SpaceProps {
  id: number
}

const Space = ({id}: SpaceProps) => {
  const gameContext = useGameContext()!
  const moveTiles = gameContext.moveTiles
  const dragID = gameContext.dragID
  const selection = gameContext.selection
  const updateSelection = gameContext.updateSelection

  const divRef =  useRef<HTMLDivElement | null>(null)
  const [mouseHover, setMouseHover] = useState<boolean>(false)

  let myTile = gameContext.tiles.find(tile => tile.spaceID === id)
  let myBG = `border-indigo-400 border border-dotted xs-box:border-dashed`
  if (myTile)
      myBG = ``


  useLayoutEffect(() => {
    gameContext.updateSpace(id, divRef.current)
  })

  const handlePointerEnter = (e: React.PointerEvent) => {
    e.preventDefault() 
    if (dragID != -1 || (selection && selection.length > 0))
      setMouseHover(true)
  }

  const handlePointerLeave = (e: React.PointerEvent) => {
    e.preventDefault() 
    setMouseHover(false)
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.preventDefault() 
    if (gameContext.dragID != -1){
      moveTiles([{id: dragID, spaceID: id}])
      setMouseHover(false)
    }else if (selection && selection.length > 0){
      moveTiles([{id: selection[0], spaceID: id}])// move first selected tile
      updateSelection(selection[0])// remove first tile from selection
    }
  }

  return (
    <>
      <div className={`overflow-visible rounded-md justify-self-center
        w-4 h-4 xs-box:w-6 xs-box:h-6 sm-box:w-8 sm-box:h-8 md-box:w-10 md-box:h-10
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