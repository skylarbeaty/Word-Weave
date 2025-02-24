import { useGameContext } from '../Game'
import GameButton from './GameButton'
import { shuffleArray } from '@/util/shuffle'
import { debounce } from '@/util/debounce'

const Shuffle = () => {
    const gameContext = useGameContext()!
    const tiles = gameContext.tiles
    const spaces = gameContext.spaces
    const moveTiles = gameContext.moveTiles

    const handleShuffle = () => {
    const panelTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "panel")
    let unusedSpaces = shuffleArray(spaces.filter(space => space.position.container === "panel"))

    const movements = panelTiles.map(tile => ({
        id: tile.id,
        spaceID: unusedSpaces.shift()!.id
    }))

    moveTiles(movements, false)
    }

    const shuffleDisabled = () => {
    return (tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "panel").length === 0)
    }
  return (
    <GameButton handlePointerDown={debounce(handleShuffle, 100)} disabled={shuffleDisabled()}>
        <img
        src="/shuffle.svg"
        alt="shuffle"
        />
    </GameButton>
  )
}

export default Shuffle