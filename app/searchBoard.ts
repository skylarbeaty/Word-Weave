import { debounce } from "@/util/debounce"
import { wordList } from "@/scripts/wordlist"

interface WordData {
    word: string
    tileIDs: Set<number>
    valid: boolean
}

const solveBoard = (tiles: any[], spaces: any[]) => {
    let words: WordData[] = []
    words = findWords(tiles, spaces)
    words = validateWords(words)
    console.log("words:", words)
}

const findWords = (tiles: any[], spaces: any[]) => {
    const boardTiles = tiles
      .filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
      .sort((a, b) => spaces.find(space => space.id === a.spaceID)!.position.index - spaces.find(space => space.id === b.spaceID)!.position.index)
  
    let words: WordData[] = []
    let width = 10, height = 14
  
    // make 2D grid from board
    const grid: ({letter: string, id: number} | null)[][] = Array.from({ length: height }, () => Array(width).fill(null))
    
    boardTiles.forEach(tile => {
      const space = spaces.find(space => space.id === tile.spaceID)
      if (space) {
        const row = Math.floor(space.position.index / width)
        const col = space.position.index % width
        grid[row][col] = {...tile}
      }
    })
  
    // scan for horizontal words
    for (let row = 0; row < height; row++) {
      let word = ""
      let tileIDs: Set<number> = new Set<number>()
      for (let col = 0; col < width; col++) {
        if (grid[row][col]) {
          word += grid[row][col]?.letter
          tileIDs.add(grid[row][col]?.id!)
        } else {
          if (word.length > 1) 
            words.push({word, tileIDs, valid: false})
          word = ""
          tileIDs = new Set<number>()
        }
      }
      if (word.length > 1) 
        words.push({word, tileIDs, valid: false})
    }
  
    // scan for vertical words
    for (let col = 0; col < width; col++) {
      let word = ""
      let tileIDs: Set<number> = new Set<number>()
      for (let row = 0; row < height; row++) {
        if (grid[row][col]) {
          word += grid[row][col]?.letter
          tileIDs.add(grid[row][col]?.id!)
        } else {
          if (word.length > 1) 
            words.push({word, tileIDs, valid: false})
          word = ""
          tileIDs = new Set<number>()
        }
      }
      if (word.length > 1) 
        words.push({word, tileIDs, valid: false})
    }

    return words
}

const validateWords = (words: WordData[]) => {
    return words.map(wordObj => ({
        ...wordObj,
        valid: wordList.has(wordObj.word.toLowerCase()),
    }))
}

export const searchBoard = debounce(solveBoard, 300)