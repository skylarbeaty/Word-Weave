"use client"
import { useState, createContext, useCallback, useContext, useRef } from 'react';

import "@/app/game.css";
import Tile from './Tile';
import TilePanel from './TilePanel';
import Board from './Board';
import InputPanel from '@/components/InputPanel';
import ButtonPanel from '@/components/ButtonPanel';

interface TileData{
    id: number
    letter: string
    divRef: HTMLDivElement | null //use to access current position through client rect
    spaceID: number //use to access current actual/target position spaces[spaceID].divRef & using client rect
}

interface SpaceData{
    id: number
    divRef: HTMLDivElement | null
    position: {
        container: "panel" | "board"
        index: number
    }
}

interface GameContextProps{
    tiles: TileData[]
    moveTile: (id: number, newSpaceID: number) => void
    spaces: SpaceData[]
    updateSpace: (id: number, ref: HTMLDivElement | null) => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined)

export function useGameContext(){
    return useContext(GameContext)
}

//test letter set
const letters = [   "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", 
                    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                    "U", "V", "W", "X", "Y", "Z", "A", "B", "C", "D" ]

//test letter set
// const letters = [   "A", "B", "O", "R", "E", "N", "G", "L", "P", "M",
//                     "N", "A", "A", "P", "A", "O", "R", "A", "N", "G",
//                     "E", "B", "N", "P", "E", "L", "M", "G", "P", "A" ]

const initialTiles: TileData[] = letters.map((letter,index) => { return {
    id: index + 1,
    letter: letter,
    divRef: null,
    spaceID: index + 141
}})

const initialSpaces: SpaceData[] = [
    // Board Spaces
    ...Array.from({length: 140}, (_, index): SpaceData => ({
        id: index + 1,
        divRef: null,
        position: {
            container: "board",
            index: index
        }
    })),
    // Tile Panel Spaces
    ...Array.from({length: 30}, (_, index): SpaceData => ({
        id: index + 141,
        divRef: null,
        position: {
            container: "panel",
            index: index
        }
    })),
];

const Game = () => {
    const [tiles, setTiles] = useState<TileData[]>(initialTiles)
    const spaces = useRef<SpaceData[]>(initialSpaces)

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

    return (
        <GameContext.Provider value={{tiles, moveTile, spaces: spaces.current, updateSpace}}>
            <div>
                <Board/>
                <InputPanel/>
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