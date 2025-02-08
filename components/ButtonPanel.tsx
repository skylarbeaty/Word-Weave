import GameButton from './GameButton'
import Game, { useGameContext } from './Game'
import { shuffleArray } from '@/util/shuffle'
import { debounce } from "@/util/debounce"

const ButtonPanel = () => {
  const gameContext = useGameContext()!
  const tiles = gameContext.tiles
  const spaces = gameContext.spaces
  const solution = gameContext.solution
  const moveTile = gameContext.moveTile

  const handleReturn = () => {
    const boardTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
    const returnTiles = boardTiles.filter(tile => !solution.solutionTiles.has(tile.id))
    let emptySpaces = spaces.filter(space => space.position.container === "panel" && !tiles.find(tile => tile.spaceID === space.id))

    returnTiles.forEach(tile => {
      if (emptySpaces.length > 0)
        moveTile(tile.id, emptySpaces.shift()!.id) // move each tile to the next empty space
      else
        console.log("Error: No spaces left to return tiles")
    })
  }

  const returnDisabled = () => {//check whether there are any tiles to return
    return tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
                .filter(tile => !solution.solutionTiles.has(tile.id))
                .length === 0
  }

  const handleRestart = () => {
    tiles.forEach(tile => {
      moveTile(tile.id, tile.id + 140) // move each tile to its original location
    })
  }

  const handleShuffle = () => {
    const panelTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "panel")
    let unusedSpaces = shuffleArray(spaces.filter(space => space.position.container === "panel"))

    panelTiles.forEach(tile => {
      moveTile(tile.id, unusedSpaces.shift()!.id)
    })
  }

  const handleDeselect = () => {
    gameContext.changeSelectedID(-1)
  }

  const deselectDisabled = () => {
    return (gameContext.selectedID === -1)
  }

  const handleMove = () => {
    
  }

  const handleUndo = () => {

  }

  const handleRedo = () => {

  }

  const handleSetStar = () => {

  }

  const handleSubmit = () => {

  }

  const submitDisabled = () => {
    return (solution.score === 0)
  }

  return (
    <div className={`bg-indigo-200 mt-2 mb-2 rounded-lg shadow-lg flex justify-between  justify-self-center
        p-[2px]   xs-box:p-[4px]    sm-box:p-[8px]    md-box:p-[16px]
        gap-[2px] xs-box:gap-[4px]  sm-box:gap-[6px]  md-box:gap-[8px]`}>
        <GameButton handlePointerDown={handleReturn} disabled={returnDisabled()}>
          <img
            src="/return.svg"
            alt="return"
          />
        </GameButton>
        <GameButton handlePointerDown={debounce(handleShuffle, 100)}>
          <img
            src="/shuffle.svg"
            alt="shuffle"
          />
        </GameButton>
        <GameButton handlePointerDown={handleDeselect} disabled={deselectDisabled()}>
          <img
            src="/deselect.svg"
            alt="deselect"
          />
        </GameButton>
        {/* <GameButton handlePointerDown={handleMove}>
          <img
            src="/move.svg"
            alt="move"
          />
        </GameButton>
        <GameButton handlePointerDown={handleUndo}>
          <img
            src="/undo.svg"
            alt="undo"
          />
        </GameButton>
        <GameButton handlePointerDown={handleRedo}>
          <img
            src="/redo.svg"
            alt="redo"
          />
        </GameButton> */}
        <GameButton handlePointerDown={handleRestart}>
          <img
            src="/restart.svg"
            alt="restart"
          />
        </GameButton>
        {/* <GameButton handlePointerDown={handleSetStar}>
          <img
            src="/star.svg"
            alt="star"
          />
        </GameButton>
        <GameButton handlePointerDown={handleSubmit} disabled={submitDisabled()}>
          <img
            src="/launch.svg"
            alt="submit"
          />
        </GameButton> */}
    </div>
  )
}

export default ButtonPanel