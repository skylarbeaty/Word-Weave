"use client"
import { useState, createContext, useCallback, useContext, useRef, useEffect } from 'react'

import "@/app/game.css"
import Tile from './Tile'
import TilePanel from './TilePanel'
import Board from './Board'
import InputPanel from '@/components/InputPanel'
import ButtonPanel from '@/components/ButtonPanel'
import { searchBoard } from '@/app/boardSolver'

export interface TileData{
    id: number
    letter: string
    divRef: HTMLDivElement | null //use to access current position through client rect
    spaceID: number //use to access current actual/target position spaces[spaceID].divRef & using client rect
}

export interface SpaceData{
    id: number
    divRef: HTMLDivElement | null
    position: {
        container: "panel" | "board"
        index: number
    }
}

export interface SolutionData{
    solutionTiles: Set<number>
    disconnectedValidTiles: Set<number>
    errorTiles: Set<number>
    score: number
}

const initialSolution: SolutionData = {
    solutionTiles: new Set(),
    disconnectedValidTiles: new Set(),
    errorTiles: new Set(),
    score: 0
}

type TileState = { id: number, spaceID: number }[]

interface GameContextProps{
    gameProps: GameProps
    tiles: TileData[]
    moveTiles: (movements: {id: number, spaceID: number}[], saveToHistory?: boolean) => void
    spaces: SpaceData[]
    updateSpace: (id: number, ref: HTMLDivElement | null) => void
    dragID: number
    changeDragID: (id: number) => void
    selection: number[] | undefined
    updateSelection: (id: number) => void
    history: TileState[]
    historyIndex: number
    setHistoryIndex: (value: number) => void
    bestState: {state: TileState, score: number} | null
    solution: SolutionData
}

const GameContext = createContext<GameContextProps | undefined>(undefined)

export function useGameContext(){
    return useContext(GameContext)
}

interface GameProps {
    letters: string[]
    boardSize: {
        width: number
        height: number
    }
}

const Game = ({ letters, boardSize }: GameProps) => {
    const boardLength = boardSize.width * boardSize.height
    const lettersLength = letters.length
    
    const initialTiles: TileData[] = letters.map((letter,index) => { return {
        id: index + 1,
        letter: letter,
        divRef: null,
        spaceID: index + boardLength + 1
    }})
    
    const initialSpaces: SpaceData[] = [
        // board spaces
        ...Array.from({length: boardLength}, (_, index): SpaceData => ({
            id: index + 1,
            divRef: null,
            position: {
                container: "board",
                index: index
            }
        })),
        // tile panel spaces
        ...Array.from({length: lettersLength}, (_, index): SpaceData => ({
            id: index + boardLength + 1,
            divRef: null,
            position: {
                container: "panel",
                index: index
            }
        })),
    ]

    const initialTileHistoy: TileState[] = [
        initialTiles.map((
            { id, spaceID }) => ({ id, spaceID }))
    ]

    const [tiles, setTiles] = useState<TileData[]>(initialTiles)
    const spaces = useRef<SpaceData[]>(initialSpaces)

    const [solution, setSolution] = useState<SolutionData>(initialSolution)
    const [dragID, setDragID] = useState(-1)
    const [selection, setSelection] = useState<number[]>()
    
    const [tileHistory, setTileHistory] = useState<TileState[]>(initialTileHistoy)
    const [historyIndex, setHistoryIndex] = useState(0)
    const [bestState, setBestState] = useState<{state: TileState, score: number} | null>(null)

    useEffect(() => {// update solution when tiles change
        searchBoard(tiles, spaces.current, boardSize, setSolution)
    }, [tiles])

    useEffect(() => {// update best state when solution changes
        if ((!bestState && solution.score != 0) || (bestState?.score && solution.score > bestState?.score)) {
            setBestState({state: tileHistory[historyIndex], score: solution.score})
        }
    }, [solution])

    const moveTiles = (movements: {id: number, spaceID: number}[], saveToHistory = true) => {
        setTiles(prevTiles => {
            const newTiles = prevTiles.map(tile => {
                const movement = movements.find(movement => movement.id === tile.id)
                return movement ? {...tile, spaceID: movement.spaceID} : tile
            })

            if (saveToHistory){
                const newHistory = tileHistory.slice(0, historyIndex + 1)
                newHistory.push(newTiles.map(({id, spaceID}) => ({id, spaceID})))
                setTileHistory(newHistory)
                setHistoryIndex(newHistory.length - 1)
            }

            return newTiles
        })
    }

    const updateSpace = useCallback((id: number, ref: HTMLDivElement | null) => {
        const spaceIndex = spaces.current.findIndex((space) => space.id === id)
        if (spaceIndex != -1){
            spaces.current[spaceIndex].divRef = ref
        }
    }, [])

    const changeDragID = (id: number) =>{
        setDragID(id)
    }

    const updateSelection = (tileID: number) => {
        if (tileID == -1){//trigger to clear the selection
            setSelection([])
        }else if (selection && selection.length > 0){// if there is an existing selection
            const tile = tiles.find(tile => tile.id === tileID)!
            const firstTile = tiles.find(tile => tile.id === selection[0])!
            const space = spaces.current.find(space => space.id === tile.spaceID)!
            const firstSpace = spaces.current.find(space => space.id === firstTile.spaceID)!

            if (space?.position.container === firstSpace.position.container){//if the tile is from the same container
                setSelection(prevSelection => 
                    prevSelection?.includes(tileID) 
                        ? prevSelection.filter(id => id != tileID) // remove if it already exists
                        : [...prevSelection!, tileID] // add if its not there
                )
            }else{// if the tile is in the opposite container
                // swap the tile with the first tile
                moveTiles([
                    { id: firstTile.id, spaceID: tile.spaceID},
                    { id: tile.id, spaceID: firstTile.spaceID}
                ])
                // remove the first tile from the selection
                setSelection(prevSelection => prevSelection?.filter(id => id != firstTile.id))
            }
        }else{
            setSelection([tileID])// first tile in selection
        }        
    }

    const GameContextProps = { 
        gameProps: { letters, boardSize },
        tiles, moveTiles, spaces: spaces.current, updateSpace,
        dragID, changeDragID, selection, updateSelection, 
        history: tileHistory, historyIndex, setHistoryIndex, bestState,
        solution: solution
    }

    return (
        <GameContext.Provider value={{...GameContextProps}}>
            <div className={`game h-svh  justify-self-center flex flex-col justify-center
                max-w-full
                
                `}>
                <div>
                    <h1 className={`font-bold text-center mb-2 mt-1 xs:mt-2 text-indigo-900
                        text-lg xs-box:text-xl sm-box:text-2xl md-box:text-4xl`}>
                            Word Weave
                    </h1>
                    <h2 className={`text-xl font-bold text-center m-2 
                        text-xs xs-box:text-base sm-box:text-xl md-box:text-2xl
                        ${solution.score == 0 ? "text-indigo-800" : "text-emerald-800"}`}>
                            Score: {solution.score}
                    </h2>
                </div>
                <div>
                    <Board/>
                </div>
                <div className='mb-4'>
                    {/* <InputPanel/> */}
                    <ButtonPanel/>
                    <TilePanel/>
                    {tiles.map((tile, index) => (
                        <Tile
                            ref={(el: HTMLDivElement | null) => {tiles[index].divRef = el}}
                            key={tile.id} 
                            id={tile.id} 
                            letter={tile.letter} 
                        />
                    ))}
                </div>
            </div>
        </GameContext.Provider>
    )
}

export default Game