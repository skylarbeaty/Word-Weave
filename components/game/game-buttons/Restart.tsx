import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Restart = () => {
    const gameContext = useGameContext()!
    const tiles = gameContext.tiles
    const moveTiles = gameContext.moveTiles
    const boardSize = gameContext.gameProps.boardSize
    const boardLength = boardSize.width * boardSize.height
    const history = gameContext.history
    const historyIndex = gameContext.historyIndex

    const handleRestart = () => {//return all the tiles to their original locations
        const movements = tiles.map(tile => ({
            id: tile.id,
            spaceID: tile.id + boardLength
        }))
    
        moveTiles(movements)
    }
    
    const restartDisbabled = () => {
        return (JSON.stringify(history[0]) === JSON.stringify(history[historyIndex]))
    }

    return (
        <GameButton handlePointerDown={handleRestart} disabled={restartDisbabled()}>
            <img
                src="/restart.svg"
                alt="restart"
            />
        </GameButton>
    )
}

export default Restart