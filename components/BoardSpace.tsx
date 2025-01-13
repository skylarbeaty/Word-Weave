import { useTilesContext } from './Game';
import Tile from './Tile';

interface BoardSpaceProps {
    children?: React.ReactNode
    index: number
}

const BoardSpace = ({ index }: BoardSpaceProps) => {
    const tilesContext = useTilesContext()!
    let moveTile = tilesContext.moveTile
    let myTile = tilesContext.tiles.find(tile => tile.position.container === "board" && tile.position.index === index)
    
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (!myTile){//dont add two tiles to the same board space
            const tileID = Number(e.dataTransfer.getData("dragID"))
            moveTile(tileID, "board", index)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        if (!myTile){
            const tileID = tilesContext.dragID // dragEnter doesnt have access to dataTransfer, so using context/state
            moveTile(tileID, "board", index)
        }
    }

    return (
        <div className="boardSpace border border-dashed border-indigo-400 w-10 h-10 flex items-center justify-center" 
            onDrop={handleDrop}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            >
                {myTile? (<Tile key={myTile.id} id={myTile.id} letter={myTile.letter}/>) : (<div/>)}
        </div>
    )
}

export default BoardSpace