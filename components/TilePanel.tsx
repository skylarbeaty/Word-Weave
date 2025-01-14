import { useRef } from 'react';
import Tile from './Tile';
import { useTilesContext } from './Game';

const TilePanel = () => {
  const tilesContext = useTilesContext()!
  const moveTile = tilesContext.moveTile
  const dragID = tilesContext.dragID
  const panelTiles = tilesContext.tiles.filter(tile => tile.position.container === "panel")
  const myTiles = panelTiles.sort((a,b) => a.position.index - b.position.index)

  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  tileRefs.current = myTiles.map((_, i) => tileRefs.current[i] || null);
  
  const handleMouseUp = (e: React.MouseEvent) => {
    e.preventDefault()
    updateDrag(e)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("mouse over")
    updateDrag(e)
  }

  const updateDrag = (e: React.MouseEvent) => {    
    if (dragID < 0)
      return
    const tileBeforeIndex = getClosestTileBefore(e.clientX, e.clientY)
    const tileID = dragID
    if (tileBeforeIndex >= 0){
      let tileAfter = myTiles[tileBeforeIndex]
      moveTile(tileID, "panel", tileAfter.position.index + 0.5)//fractional index for sorting, will be adjusted in moveTile method
    }
    else
      moveTile(tileID, "panel", -0.5)
  }

  //Find the (index of the) tile that the dragging tile can be inserted after, or give -1 if the dragging tile is first/only
  const getClosestTileBefore = (mouseX: number, mouseY: number) => {
    let closestIndex = -1
    let closestDistance = Infinity

    tileRefs.current.forEach((tileRef, index) => {
      if (tileRef){
        const box = tileRef.getBoundingClientRect()
        //check only tiles that are about the same y and to the left of the x
        if (mouseX > box.left + box.width/2  && mouseY > box.top - box.height/2 && mouseY < box.bottom){
          console.log("cleared check")
          //check if this tile is closer thatn the others checked
          const dist = Math.hypot(box.left + box.width/2 - mouseX, box.top + box.height/2 - mouseY)
          if (dist < closestDistance){
            closestDistance = dist
            closestIndex = index
          }
        }
      }
    })
    return closestIndex
  }

  return (
    <div className="bg-indigo-300 p-4 rounded shadow-lg">
      <div id="panel" className="grid grid-cols-10 gap-2 min-h-10"
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        >
          {myTiles.map((tile, index) => (
              <Tile
                ref={(el: HTMLDivElement | null) => {tileRefs.current[index] = el}}
                key={tile.id} 
                id={tile.id} 
                letter={tile.letter} />
          ))}
      </div>
    </div>
  )
}

export default TilePanel