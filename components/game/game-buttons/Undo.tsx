import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Undo = () => {
    const gameContext = useGameContext()!
    const moveTiles = gameContext.moveTiles
    const history = gameContext.history
    const historyIndex = gameContext.historyIndex
    const setHistoryIndex = gameContext.setHistoryIndex

    const handleUndo = () => {
        if (historyIndex > 0){
            setHistoryIndex(historyIndex - 1) // move index but preserve states for redo
            moveTiles(history[historyIndex - 1], false)// index wont update till render
        }
    }
    
    const undoDisabled = () => {
        return (historyIndex <= 0)
    }

    return (
        <GameButton handlePointerDown={handleUndo} disabled={undoDisabled()}>
            <img
                src="/undo.svg"
                alt="undo"
            />
        </GameButton>
    )
}

export default Undo