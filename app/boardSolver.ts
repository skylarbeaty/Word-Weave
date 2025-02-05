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
    // scan board and process words
    let words: WordData[] = []
    words = findWords(tiles, spaces)
    validateWords(words)
    findConnectedWords(words)

    // make solution
    let solution: SolutionData = {
      solutionTiles: new Set<number>(),
      disconnectedValidTiles: new Set<number>(),
      errorTiles: new Set<number>(),
      score: 0
    }

    for (const word of words){
      if (word.connected){
        word.tileIDs.forEach(id => solution.solutionTiles.add(id))
        solution.score += word.word.length
      }else if (word.valid)//only add the valid words that arent in solution
        word.tileIDs.forEach(id => solution.disconnectedValidTiles.add(id))

      if (!word.valid)
        word.tileIDs.forEach(id => solution.errorTiles.add(id))
    }

    setSolution(solution)
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
    // check each word against the word list
    words.forEach(wordObj => {
      wordObj.valid = wordList.has(wordObj.word.toLowerCase())
    })
    return words
}

const findConnectedWords = (words: WordData[]) => {
    let visited = new Set<number>()
    let largestGraph = new Set<number>() // list of word IDs, words array holds connections by common *tile* ID
    let largestScore = 0

    // only consider words where all tile placements are valid i.e. they dont create any invalid words
    const validWords = words.filter(word => word.valid)
    const invalidWords = words.filter(word => !word.valid)
    let usableWords: WordData[] = []
    validWords.forEach(validWord => {
      // only add to usable words if none if its tiles are shared with invalid words
      if (!invalidWords.some(invalidWord => [...invalidWord.tileIDs].some(id => validWord.tileIDs.has(id))))
        usableWords.push(validWord)
    })

    console.log("valid words: " + validWords.length + " usable words: " + usableWords.length + " invalid words: " + invalidWords.length) 
    
    for (const word of usableWords) {
        if(!visited.has(word.id)){
            // recursively search through every valid word that is connected to this word
            const currentData = connectedWordDFS(word, usableWords, visited, new Set(), 0)
            // update data from DFS return
            console.log(visited.size)
            if (currentData.score > largestScore){
                largestScore = currentData.score
                largestGraph = currentData.currentGraph
            }
            // if any valid words were not connected/visited, the next loop will DFS on one of those words
        }
    }

    words.forEach(word => {
      word.connected = largestGraph.has(word.id)
    })
    return words
}

const connectedWordDFS = (word: WordData, usableWords: WordData[], visited: Set<number>, currentGraph: Set<number>, score: number) => {
    currentGraph.add(word.id)
    visited.add(word.id)
    score += word.word.length // score is currently just he length of the word, e.i. how many tiles were used to make it

    // neighboring words will share a tile ID
    const neighbors = usableWords.filter(
        wordObj => wordObj.id != word.id && [...wordObj.tileIDs].some(id => word.tileIDs.has(id))
    )

    // recurse through connected words
    for (const neighbor of neighbors){
        if (!visited.has(neighbor.id)){
            // recursively call on each neighbor and pass the data up through returns
            const result = connectedWordDFS(neighbor, usableWords, visited, currentGraph, score)
            currentGraph = result.currentGraph
            score = result.score
        }
    }

    return {currentGraph, score}
}

export const searchBoard = debounce(solveBoard, 300)