import GameButton from './GameButton'
import Game, { useGameContext } from './Game'
import { shuffleArray } from '@/util/shuffle'
import { debounce } from "@/util/debounce"

const ButtonPanel = () => {
  const gameContext = useGameContext()!
  const tiles = gameContext.tiles
  const spaces = gameContext.spaces
  const solution = gameContext.solution
  const moveTiles = gameContext.moveTiles
  const selection = gameContext.selection
  const updateSelection = gameContext.updateSelection
  const boardLength = gameContext.gameProps.boardSize.width * gameContext.gameProps.boardSize.height

  const handleReturn = () => {
    const boardTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
    let returnTiles = boardTiles.filter(tile => !solution.solutionTiles.has(tile.id)).map(tile => tile.id)
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

  const returnDisabled = () => {//check whether there are any tiles to return
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

  const handleRestart = () => {
    const movements = tiles.map(tile => ({
      id: tile.id,
      spaceID: tile.id + boardLength
    }))

    moveTiles(movements)
  }

  const handleShuffle = () => {
    const panelTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "panel")
    let unusedSpaces = shuffleArray(spaces.filter(space => space.position.container === "panel"))

    const movements = panelTiles.map(tile => ({
      id: tile.id,
      spaceID: unusedSpaces.shift()!.id
    }))

    moveTiles(movements)
  }

  const handleDeselect = () => {
    updateSelection(-1)
  }

  const deselectDisabled = () => {
    return (!selection || selection.length === 0)
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
        <GameButton handlePointerDown={handleReturn} disabled={returnDisabled()} style={returnRingStyle}>
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