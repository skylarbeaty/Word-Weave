import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Deselect = () => {
    const gameContext = useGameContext()!
    const selection = gameContext.selection
    const updateSelection = gameContext.updateSelection

    const handleDeselect = () => {
        updateSelection(-1)
    }
    
    const deselectDisabled = () => {
        return (!selection || selection.length === 0)
    }

    return (
        <GameButton handlePointerDown={handleDeselect} disabled={deselectDisabled()}>
            <img
                src="/deselect.svg"
                alt="deselect"
            />
        </GameButton>
    )
}

export default Deselect