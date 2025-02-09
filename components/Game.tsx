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

interface GameContextProps{
    gameProps: GameProps
    tiles: TileData[]
    moveTile: (id: number, newSpaceID: number) => void
    spaces: SpaceData[]
    updateSpace: (id: number, ref: HTMLDivElement | null) => void
    dragID: number
    changeDragID: (id: number) => void
    selectedID: number
    changeSelectedID: (id: number) => void
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

    const [tiles, setTiles] = useState<TileData[]>(initialTiles)
    const spaces = useRef<SpaceData[]>(initialSpaces)
    const [solution, setSolution] = useState<SolutionData>(initialSolution)
    const [dragID, setDragID] = useState(-1)
    const [selectedID, setSelectedID] = useState(-1)

    useEffect(() => {
        searchBoard(tiles, spaces.current, boardSize, setSolution)
    }, [tiles])

    const moveTile = (id: number, newSpaceID: number) => {
        setTiles(prevTiles => prevTiles.map(tile => 
            tile.id === id ? {...tile, spaceID: newSpaceID} : tile
        ))
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
    
    const changeSelectedID = (id: number) =>{
        setSelectedID(id)
    }

    const GameContextProps = { 
        gameProps: { letters, boardSize },
        tiles, moveTile, spaces: spaces.current, updateSpace,
        dragID, changeDragID, selectedID, changeSelectedID,
        solution: solution
    }

    return (
        <GameContext.Provider value={{...GameContextProps}}>
            <div className={`game h-svh  justify-self-center flex flex-col justify-between md-box:justify-center
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
                <div className='mb-16'>
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