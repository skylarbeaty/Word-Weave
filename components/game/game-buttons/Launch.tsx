import { useGameContext } from '../Game'
import GameButton from './GameButton'

const Launch = () => {
    const gameContext = useGameContext()!
    const tiles = gameContext.tiles
    const spaces = gameContext.spaces
    const solution = gameContext.solution
    const boardSize = gameContext.gameProps.boardSize
    const puzzleID = gameContext.gameProps.puzzleID

    const handleSubmit = async () => {//submit your solution for the puzzle
        const boardState = boardJSON()
        const score = solution.score
        
        try {
            const response = await fetch("/api/dailyPuzzle", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    puzzleID,
                    boardState,
                    score
                }),
            })
        
            if (response.ok) {
                console.log("Submission successful!")
                window.location.reload()
            } else {
                console.error("Submission failed:", await response.text())
            }
        } catch (error) {
            console.error("Error submitting puzzle:", error)
        }
    }

    const boardJSON = () => {
        const board = Array(boardSize.height).fill(null).map(() => Array(boardSize.width).fill(""))
        tiles.forEach(tile => {
            const space = spaces.find(space => space.id === tile.spaceID)
            if (space && space.position.container === "board"){
                const { index } = space.position
                const row = Math.floor(index / boardSize.width)
                const col = index % boardSize.width
                board[row][col] = tile.letter
            }
        })
        return JSON.stringify(board)
    }

    const submitDisabled = () => {
        const panelTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "panel")
        return (panelTiles.length != 0 || solution.errorTiles.size != 0)
    }

    let submitRingStyle = ""
    if (!submitDisabled()){
        if (solution.solutionTiles.size == tiles.length && solution.disconnectedValidTiles.size == 0){
            submitRingStyle = "ring-emerald-700 ring-1 xs-box:ring-2 sm-box:ring-[3px]"
        } else {
            submitRingStyle = "ring-amber-300 ring-1 xs-box:ring-2 sm-box:ring-[3px]"
        }
    }
      
    return (
        <GameButton handlePointerDown={handleSubmit} disabled={submitDisabled()} style={submitRingStyle}>
            <img
                src="/launch.svg"
                alt="submit"
            />
        </GameButton>
    )
}

export default Launch