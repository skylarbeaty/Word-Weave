import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Star = () => {
    const gameContext = useGameContext()!
    const moveTiles = gameContext.moveTiles
    const history = gameContext.history
    const historyIndex = gameContext.historyIndex
    const bestState = gameContext.bestState

    const handleSetStar = () => {//re-create to best scoring state
        if (bestState && bestState.state != history[historyIndex]){
            moveTiles(bestState.state, true)
        }
    }
    
    const starDisabled = () => {
        return bestState ? JSON.stringify(bestState.state) === JSON.stringify(history[historyIndex])  : true;
    }
    
    return (
        <GameButton handlePointerDown={handleSetStar} disabled={starDisabled()}>
          <img
            src="/star.svg"
            alt="star"
          />
        </GameButton>
    )
}

export default Star