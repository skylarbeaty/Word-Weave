import { debounce } from "@/util/debounce"

const findWords = (tiles: any[], spaces: any[]) => {
    const boardTiles = tiles
      .filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
      .sort((a, b) => spaces.find(space => space.id === a.spaceID)!.position.index - spaces.find(space => space.id === b.spaceID)!.position.index)
  
    let words: string[] = []
    let width = 10, height = 14
  
    // make 2D grid from board
    const grid: (string | null)[][] = Array.from({ length: height }, () => Array(width).fill(null))
    
    boardTiles.forEach(tile => {
      const space = spaces.find(space => space.id === tile.spaceID)
      if (space) {
        const row = Math.floor(space.position.index / width)
        const col = space.position.index % width
        grid[row][col] = tile.letter
      }
    });
  
    // scan for horizontal words
    for (let row = 0; row < height; row++) {
      let word = ""
      for (let col = 0; col < width; col++) {
        if (grid[row][col]) {
          word += grid[row][col]
        } else {
          if (word.length > 1) 
            words.push(word)
          word = ""
        }
      }
      if (word.length > 1) 
        words.push(word)
    }
  
    // scan for vertical words
    for (let col = 0; col < width; col++) {
      let word = ""
      for (let row = 0; row < height; row++) {
        if (grid[row][col]) {
          word += grid[row][col]
        } else {
          if (word.length > 1) 
            words.push(word)
          word = ""
        }
      }
      if (word.length > 1) 
        words.push(word)
    }
  
    console.log("words:", words)
}

export const searchBoard = debounce(findWords, 300)