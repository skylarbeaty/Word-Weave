"use client"
import { useState, createContext, useCallback, useContext, useRef, useEffect } from 'react';

import "@/app/game.css";
import Tile from './Tile';
import TilePanel from './TilePanel';
import Board from './Board';
import InputPanel from '@/components/InputPanel';
import ButtonPanel from '@/components/ButtonPanel';
import { searchBoard } from '@/app/boardSolver';

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

interface GameContextProps{
    tiles: TileData[]
    moveTile: (id: number, newSpaceID: number) => void
    spaces: SpaceData[]
    updateSpace: (id: number, ref: HTMLDivElement | null) => void;
    dragID: number
    changeDragID: (id: number) => void;
    selectedID: number
    changeSelectedID: (id: number) => void;
    solution: SolutionData
}

const GameContext = createContext<GameContextProps | undefined>(undefined)

export function useGameContext(){
    return useContext(GameContext)
}

// test letter set: alphabeta
// const letters = [   "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
//                     "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
//                     "U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D" ]

// test letter set: fruits
// const letters = [   "A", "B", "O", "R", "E", "N", "G", "L", "P", "M",
//                     "N", "A", "A", "P", "A", "O", "R", "A", "N", "G",
//                     "E", "B", "N", "P", "E", "L", "M", "G", "P", "A" ]

// const letters = [   "J", "H", "R", "M", "I", "S", "B", "L", "T", "N",
//                     "C", "O", "I", "D", "F", "O", "G", "N", "U", "P",
//                     "P", "E", "E", "H", "A", "C", "L", "R", "I", "D" ];

const letters = [   "S", "M", "T", "N", "N", "O", "R", "E", "G", "U",
                    "C", "I", "L", "V", "D", "N", "T", "A", "S", "R",
                    "E", "N", "G", "I", "C", "O", "A", "T", "A", "L" ];

      

const initialTiles: TileData[] = letters.map((letter,index) => { return {
    id: index + 1,
    letter: letter,
    divRef: null,
    spaceID: index + 141
}})

const initialSpaces: SpaceData[] = [
    // board spaces
    ...Array.from({length: 140}, (_, index): SpaceData => ({
        id: index + 1,
        divRef: null,
        position: {
            container: "board",
            index: index
        }
    })),
    // tile panel spaces
    ...Array.from({length: 30}, (_, index): SpaceData => ({
        id: index + 141,
        divRef: null,
        position: {
            container: "panel",
            index: index
        }
    })),
]

const initialSolution: SolutionData = {
    solutionTiles: new Set(),
    disconnectedValidTiles: new Set(),
    errorTiles: new Set(),
    score: 0
}

const Game = () => {
    const [tiles, setTiles] = useState<TileData[]>(initialTiles)
    const [dragID, setDragID] = useState(-1)
    const [selectedID, setSelectedID] = useState(-1)
    const spaces = useRef<SpaceData[]>(initialSpaces)
    const [solution, setSolution] = useState<SolutionData>(initialSolution)

    useEffect(() => {
        searchBoard(tiles, spaces.current, setSolution)
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

    return (
        <GameContext.Provider value={{tiles, moveTile, spaces: spaces.current, updateSpace, dragID, changeDragID, selectedID, changeSelectedID, solution}}>
            <div className={`game h-[window.innerHeight]  justify-self-center
                max-w-[240px] xs-box:max-w-[340px]  sm-box:max-w-[450px]  md-box:max-w-full`}>
                <h1 className={`font-bold text-center mb-2 mt-1 xs:mt-2 text-indigo-900
                    text-lg xs-box:text-xl sm-box:text-2xl md-box:text-4xl`}>
                        Word Weave
                </h1>
                <h2 className={`text-xl font-bold text-center m-2 
                    text-sm xs-box:text-base sm-box:text-xl md-box:text-2xl
                    ${solution.score == 0 ? "text-indigo-800" : "text-emerald-800"}`}>
                        Score: {solution.score}
                </h2>
                <Board/>
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
        </GameContext.Provider>
    )
}

export default Game