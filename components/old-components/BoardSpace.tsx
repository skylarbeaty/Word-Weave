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
    
    const handleMouseUp = (e: React.MouseEvent) => {
        updateTile
    }

    const handleMouseEnter = (e: React.MouseEvent) => {
        updateTile()
    }

    const updateTile = () => {
        if (!myTile && tilesContext.dragID >= 0){
            const tileID = tilesContext.dragID
            moveTile(tileID, "board", index)
        }
    }

    return (
        <div className={`boardSpace border-indigo-400 rounded-md w-10 h-10 flex items-center justify-center
            ${myTile? "" : "border border-dashed"}`}
            onMouseUp={handleMouseUp}
            onMouseEnter={handleMouseEnter}
            >
                {myTile? (<Tile key={myTile.id} id={myTile.id} letter={myTile.letter}/>) : (<div/>)}
        </div>
    )
}

export default BoardSpace