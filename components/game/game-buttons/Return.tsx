import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Return = () => {
    const gameContext = useGameContext()!
    const tiles = gameContext.tiles
    const spaces = gameContext.spaces
    const solution = gameContext.solution
    const moveTiles = gameContext.moveTiles
    const selection = gameContext.selection
    const updateSelection = gameContext.updateSelection

    const handleReturn = () => {
        const boardTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
        let returnTiles = boardTiles.filter(tile => !solution.solutionTiles.has(tile.id)).map(tile => tile.id)//default returns all non-solution board tiles to panel
        let emptySpaces = spaces.filter(space => space.position.container === "panel" && !tiles.find(tile => tile.spaceID === space.id))
    
        if (selection && selection.length > 0){//if theres a selection in the board, return that instead
            const firstTile = tiles.find(tile => tile.id === selection[0])!
            const firstSpace = spaces.find(space => space.id === firstTile.spaceID)!
            if (firstSpace.position.container === "board"){
                returnTiles = selection
                updateSelection(-1)
            }
        }
    
        const movements = returnTiles.map(tileID => ({
            id: tileID,
            spaceID: emptySpaces.shift()!.id
        }))
    
        moveTiles(movements)
    }
    
    const returnDisabled = () => {
        if (selection && selection.length > 0){
            const firstTile = tiles.find(tile => tile.id === selection[0])!
            const firstSpace = spaces.find(space => space.id === firstTile.spaceID)!
            if (firstSpace.position.container === "board"){
                return false
            }
        }
        return tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
                    .filter(tile => !solution.solutionTiles.has(tile.id))
                    .length === 0
    }
    
    let returnRingStyle = ""
    if (selection && selection.length > 0){
        const firstTile = tiles.find(tile => tile.id === selection[0])!
        const firstSpace = spaces.find(space => space.id === firstTile.spaceID)!
        if (firstSpace.position.container === "board"){
            returnRingStyle = "ring-amber-300 ring-1 xs-box:ring-2 sm-box:ring-[3px]"
        }
    }

    return (
        <GameButton handlePointerDown={handleReturn} disabled={returnDisabled()} style={returnRingStyle}>
            <img
                src="/return.svg"
                alt="return"
            />
        </GameButton>
    )
}

export default Return