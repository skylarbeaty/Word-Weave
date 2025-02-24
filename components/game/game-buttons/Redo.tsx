import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Redo = () => {
    const gameContext = useGameContext()!
    const moveTiles = gameContext.moveTiles
    const history = gameContext.history
    const historyIndex = gameContext.historyIndex
    const setHistoryIndex = gameContext.setHistoryIndex

    const handleRedo = () => {
        if (historyIndex < history.length - 1){
            setHistoryIndex(historyIndex + 1)
            moveTiles(history[historyIndex + 1], false)
        }
    }
    
    const redoDisabled = () => {
        return (historyIndex === history.length - 1)
    }

    return (
        <GameButton handlePointerDown={handleRedo} disabled={redoDisabled()}>
            <img
                src="/redo.svg"
                alt="redo"
            />
        </GameButton>
    )
}

export default Redo