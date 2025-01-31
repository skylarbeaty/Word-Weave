import { debounce } from "@/util/debounce"
import { wordList } from "@/scripts/wordlist"
import { TileData, SpaceData, SolutionData } from "@/components/Game"

interface WordData {
    id: number
    word: string
    tileIDs: Set<number>
    valid: boolean // is the word in the word list
    connected: boolean // is the word in the biggest connected graph of valid words
}

const solveBoard = (tiles: TileData[], spaces: SpaceData[], setSolution: React.Dispatch<React.SetStateAction<SolutionData>>) => {
    let words: WordData[] = []
    words = findWords(tiles, spaces)
    words = validateWords(words)
    words = findConnectedWords(words)

    let solution: SolutionData = {
      solutionTiles: new Set<number>(),
      disconnectedValidTiles: new Set<number>(),
      score: 0
    }

    for (const word of words){
      if (word.connected){
        word.tileIDs.forEach(id => solution.solutionTiles.add(id))
        solution.score += word.word.length
      }else if (word.valid)//only add the valid words that arent in solution
        word.tileIDs.forEach(id => solution.disconnectedValidTiles.add(id))
    }

    setSolution(solution)

    console.log("words:", words)
}

const findWords = (tiles: TileData[], spaces: SpaceData[]) => {
    const boardTiles = tiles.filter(tile => spaces.find(space => space.id === tile.spaceID)?.position.container === "board")
  
    let words: WordData[] = []
    let width = 10, height = 14
    let id = 1
  
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
        if (grid[row][col]) {// keep track of each letter going across
          word += grid[row][col]?.letter
          tileIDs.add(grid[row][col]?.id!)
        } else {// when theres an empty space, check if a word was made
          if (word.length > 1) 
            words.push({id: id++, word, tileIDs, valid: false, connected: false})
          word = ""
          tileIDs = new Set<number>()
        }
      }
      if (word.length > 1) // when its the end of the row, check if a word was made
        words.push({id: id++, word, tileIDs, valid: false, connected: false})
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
            words.push({id: id++, word, tileIDs, valid: false, connected: false})
          word = ""
          tileIDs = new Set<number>()
        }
      }
      if (word.length > 1) 
        words.push({id: id++, word, tileIDs, valid: false, connected: false})
    }

    return words
}

const validateWords = (words: WordData[]) => {
    return words.map(wordObj => ({
        ...wordObj,
        valid: wordList.has(wordObj.word.toLowerCase()), // check against local word list
    }))
}

const findConnectedWords = (words: WordData[]) => {
    let visited = new Set<number>()
    let largestGraph = new Set<number>() // list of word IDs, words array holds connections by common *tile* ID
    let largestScore = 0

    const validWords = words.filter(word => word.valid)
    
    for (const word of validWords) {
        if(!visited.has(word.id)){
            // recursively search through every valid word that is connected to this word
            const currentData = connectedWordDFS(word, validWords, visited, new Set(), 0)
            // update data from DFS return
            visited = currentData.visited
            if (currentData.score > largestScore){
                largestScore = currentData.score
                largestGraph = currentData.currentGraph
            }
            // if any valid words were not connected/visited, the next loop will DFS on one of those words
        }
    }

    return words.map(word => ({
        ...word,
        connected: largestGraph.has(word.id)
    }))
}

const connectedWordDFS = (word: WordData, validWords: WordData[], visited: Set<number>, currentGraph: Set<number>, score: number) => {
    currentGraph.add(word.id)
    visited.add(word.id)
    score += word.word.length // score is currently just he length of the word, e.i. how many tiles were used to make it

    // neighboring words will share a tile ID
    const neighbors = validWords.filter(
        wordObj => wordObj.id != word.id && [...wordObj.tileIDs].some(id => word.tileIDs.has(id))
    )

    // recurse through connected words
    for (const neighbor of neighbors){
        if (!visited.has(neighbor.id)){
            // recursively call on each neighbor and pass the data up through returns
            const result = connectedWordDFS(neighbor, validWords, visited, currentGraph, score)
            currentGraph = result.currentGraph
            score = result.score
            visited = result.visited
        }
    }

    return {currentGraph, score, visited}
}

export const searchBoard = debounce(solveBoard, 300)