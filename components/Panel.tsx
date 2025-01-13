import { useRef } from 'react';
import Tile from './Tile';
import { useTilesContext } from './Game';

const Panel = () => {
  const tilesContext = useTilesContext()!
  const moveTile = tilesContext.moveTile
  const panelTiles = tilesContext.tiles.filter(tile => tile.position.container === "panel")
  const myTiles = panelTiles.sort((a,b) => a.position.index - b.position.index)

  const tileRefs = useRef<(HTMLDivElement | null)[]>([])
  tileRefs.current = myTiles.map((_, i) => tileRefs.current[i] || null);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    updateDrag(e)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    updateDrag(e)
  }

  const updateDrag = (e: React.DragEvent) => {
    const tileBeforeIndex = getClosestTileBefore(e.clientX, e.clientY)
    const tileID = tilesContext.dragID
    if (tileBeforeIndex >= 0){
      let tileAfter = myTiles[tileBeforeIndex]
      moveTile(tileID, "panel", tileAfter.position.index + 0.5)//fractional index for sorting, will be adjusted in moveTile method
    }
    else
      moveTile(tileID, "panel", -0.5)
  }

  //Find the (index of the) tile that the dragging tile can be inserted after, or give -1 if the dragging tile is first/only
  const getClosestTileBefore = (mouseX: number, mouseY: number) => {
    console.log("get drag tile after")

    let closestIndex = -1
    let closestDistance = Infinity

    tileRefs.current.forEach((tileRef, index) => {
      if (tileRef){
        const box = tileRef.getBoundingClientRect()
        //check only tiles that are about the same y and to the left of the x
        if (mouseX > box.left + box.width/2 && mouseY > box.top - box.height/2 && mouseY < box.bottom){
          //check if this tile is closer thatn the others checked
          const dist = Math.hypot( box.left + box.width/2 - mouseX, box.top - mouseY)
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
    <div className="mt-6 bg-indigo-300 p-4 rounded shadow-lg">
      <div id="panel" className="grid grid-cols-10 gap-2 min-h-10"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
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

export default Panel