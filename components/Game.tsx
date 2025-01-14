"use client"
import { useState, createContext, useCallback, useContext } from 'react';

import Board from '@/components/Board';
import Panel from '@/components/Panel';

interface TileData{
    id: number
    letter: string
    position: {
        container: "panel" | "board"
        index: number
    }
}

//test letter set
const letters = [ "A", "B", "C", "D", "E", "F", "G", "H", "I", 
                "J", "K", "L", "M", "N", "O", "P", "Q", "R",
                "S", "T", "U", "V", "W", "X", "Y", "Z", 
                "A", "B", "C", "D" ]

const initialTiles: TileData[] = letters.map((letter,index) => { return {
    id: index + 1, 
    letter: letter, 
    position: {
        container: "panel", 
        index: index
    }
}})

interface TilesContextProps {
    tiles: TileData[]
    moveTile: (id: number, newContainer: 'panel' | 'board', newIndex: number) => void;
    dragID: number
    changeDragID: (id: number) => void;
}

const TilesContext = createContext<TilesContextProps | undefined>(undefined)

export function useTilesContext(){
    return useContext(TilesContext)
}

const Game = () => {
    const [tiles, setTiles] = useState<TileData[]>(initialTiles)
    const [dragID, setDragID] = useState(-1) // needed for access on other drag events oither than drops

    const moveTile = (id: number, newContainer: "panel" | "board", newIndex: number) => {
        // set the index of the tile with correct id
        setTiles(prevTiles => prevTiles.map(tile =>
            tile.id === id ? { ...tile, position: {container: newContainer, index: newIndex}} : tile
        ))
        // sorting and re-indexing tiles
        if (newContainer === "panel"){
            setTiles(tiles => tiles.sort((a,b) => a.position.index - b.position.index).map((tile, i) =>
                tile.position.container === "panel" ? { ...tile, position: {container: "panel", index: i}} : tile
            ))
        }
    }

    const changeDragID = (id: number) =>{
        setDragID(id)
    }

    return (
        <TilesContext.Provider value={{tiles, moveTile, dragID, changeDragID}}>
            <div className={`game ${dragID >=0 ? 'dragging' : ''}`}>
                <Board />
                <Panel />
            </div>
        </TilesContext.Provider>
    )
}

export default Game