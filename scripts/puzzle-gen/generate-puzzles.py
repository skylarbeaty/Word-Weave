import random, copy

wordlist_file = "./checked-wordlist.txt"
common_words_file = "./common-words.txt"

board_width = 10
board_height = 10
letter_limit = 30

number_puzzles_to_gen = 1000

def load_wordlist():
    with open(wordlist_file, encoding="utf-8") as file:
        return set(word.strip().lower() for word in file)

wordlist = load_wordlist()

class Puzzle:
    def __init__(self):
        self.board = [[" " for _ in range(board_width)] for _ in range(board_height)]
        self.board_history = [self.board]

    def reset(self):
        self.board = [[" " for _ in range(board_width)] for _ in range(board_height)]
        self.board_history = [self.board]

    def try_add_word(self, word, col, row, is_across, try_only = False):
        # if word not in wordlist:
        #     print("not in wordlist")
        tempBoard = copy.deepcopy(self.board)
        is_first = (len(self.get_tiles()) == 0)
        found_neighbor = False # connected to other words
        
        for letter in word:
            if row >= board_width or col >= board_height or row < 0 or col < 0:
                # print("blocked by bounds check")
                # print(self.board_to_string())
                self.board = tempBoard
                return False
            # place letter if empty
            if self.board[row][col] == " ":
                self.board[row][col] = letter
            else: 
                found_neighbor = True
                if self.board[row][col] != letter: # blocked by existing tile
                    # print(f"blocked by existing tile: {self.board[row][col]} at {row}, {col}")
                    self.board = tempBoard
                    return False
            if not found_neighbor:
                if row + 1 < board_width and self.board[row + 1][col] != " ":
                    found_neighbor = True
                if col + 1 < board_height and self.board[row][col + 1] != " ":
                    found_neighbor = True
                if not is_across and col - 1 > 0 and self.board[row][col - 1] != " ":
                    found_neighbor = True
                if is_across and row - 1 > 0 and self.board[row - 1][col] != " ":
                    found_neighbor = True
            if is_across:
                col += 1
            else:
                row += 1
        # print("not connected: ", (not is_first and not found_neighbor), " valid: ", self.all_words_valid())
        if (not is_first and not found_neighbor) or (not self.all_words_valid()) or len(self.get_tiles()) > letter_limit:
            # print("blocked by final check")
            # print(self.board_to_string())
            self.board = tempBoard
            return False
        
        if try_only:
            self.board = tempBoard
            return True
        
        self.board_history.append(self.board.copy())
        return True
    
    def find_placements(self, word):
        placements = []
        if (len(self.get_tiles()) == 0):# if the board is empty place in center
            return [{"col": int(board_width/2), "row": int(board_height/2 - len(word)/2), "across": False}]
        for index in range(len(word)):
            locations = self.get_letter_locations(word[index])
            for location in locations:
                if self.try_add_word(word, location["col"] - index, location["row"], True, True):
                    placements.append({"col": location["col"] - index, "row": location["row"], "across": True})
                if self.try_add_word(word, location["col"], location["row"] - index, False, True):
                    placements.append({"col": location["col"], "row": location["row"] - index, "across": False})
        return placements
    
    def get_letter_locations(self, letter):
        locations = []
        for row in range(board_height):
            for col in range(board_width):
                if self.board[row][col] == letter:
                    locations.append({"col": col, "row": row})
        return locations

    def step_back(self):
        if (len(self.board_history) > 3):
            self.board_history.pop()
            self.board = self.board_history[-1]
        else:
            print(f"stepped back on fewer than {len(self.board_history)} words, reseting board")
            self.reset()
        if not self.all_words_valid():
            print("stil invalid after stepping back, reseting board")
            self.reset()
        
    # scan the board for all words, including any unintentional ones
    def get_words(self):
        words = []

        # horizontal words
        for row in range(board_height):
            word = ""
            for col in range(board_width):
                if (self.board[row][col] != " "):
                    word += self.board[row][col]
                else:
                    if len(word) > 1:
                        words.append(word)
                    word = ""
            if len(word) > 1:
                words.append(word)
        
        # vertical words
        for col in range(board_width):
            word = ""
            for row in range(board_height):
                if (self.board[row][col] != " "):
                    word += self.board[row][col]
                else:
                    if len(word) > 1:
                        words.append(word)
                    word = ""
            if len(word) > 1:
                words.append(word)

        return words
    
    def all_words_valid(self):
        words = self.get_words()
        for word in words:
            if word not in wordlist:
                # print("invalid word created", word)
                return False
        return True 
    
    def get_tiles(self, alpha_order = False):
        tiles = []
        for row in range(board_height):
            for col in range(board_width):
                if self.board[row][col] != " ":
                    tiles.append(self.board[row][col])
        if alpha_order:
            tiles.sort()
        return tiles
    
    def board_to_string(self):
        str = ""
        str += "\n"
        for row in range(board_height):
            for col in range(board_width):
                if (self.board[row][col] == " "):
                    str += "⬩"
                else:    
                    str += self.board[row][col]
            str += "\n"
        return str

def load_words():
    with open(wordlist_file, encoding="utf-8") as file:
        full_wordlist = set(word.strip().lower() for word in file)

    with open(common_words_file, encoding="utf-8") as file:
        common_words = set(word.strip().lower() for word in file)

    return list(common_words & full_wordlist)  # Keep only words in both files

def generate_puzzles():
    print("Generating Puzzles")
    words = load_words()
    used_words = []
    used_words_last_len = 0
    puzzles = []
    puzzle = Puzzle()
    alphas_used = set()
    
    while len(puzzles) < number_puzzles_to_gen:
        print(f"-> Working on puzzle {len(puzzles) + 1}/{number_puzzles_to_gen}...")
        print(f"#: {len(used_words)} words are already used, out of {len(words)} common words")

        random.shuffle(words)
        
        if len(used_words) == used_words_last_len:
            print("Looped without finding a word, stepping back and recycling words")
            puzzle.step_back()
            used_words = []
            if used_words_last_len == 0:

                print(puzzle.board_to_string())
        if (len(used_words) > 500):
            print("Words 60 percent used, recycling words")
            used_words = []
        used_words_last_len = len(used_words)
        
        for word in words:
            if word in used_words:
                # print("word is used")
                continue
            if len(word) > letter_limit - len(puzzle.get_tiles()) + 1:
                # print("word is too long")
                continue
            placements = puzzle.find_placements(word)
            random.shuffle(placements)
            # if len(placements) > 0:
            #     print(f"number of placements {len(placements)}")
            for placement in placements:
                if puzzle.try_add_word(word, placement["col"], placement["row"], placement["across"]):
                    # print(f"added word to puzzle {word}")
                    used_words.append(word)
                    break
            if len(puzzle.get_tiles()) == letter_limit:
                puzzles.append(puzzle)
                puzzle = Puzzle()
                print(f"~ Completed puzzle {len(puzzles)}")
                break

    dupes_found = 0
    for puzzle in puzzles:
        tiles = puzzle.get_tiles(True)
        alpha = "".join(tiles)
        random.shuffle(tiles)
        if alpha in alphas_used:
            dupes_found += 1
        alphas_used.add(alpha)

        print(alpha)
        print(tiles)
        print(puzzle.get_words())
        print(puzzle.board_to_string())
    print(f"Duplicates found {dupes_found} out of {number_puzzles_to_gen} puzzles generated")

def puzzle_tests():
    puzzle = Puzzle()
    def print_try(str, col, row, across):
        print("~", str)
        print("added:", puzzle.try_add_word(str, col, row, across))
    print_try("vanilla", 0, 0, False)
    print_try("vault", 0, 0, True)
    print_try("test", 0, 0, True) # test for overlapping
    print_try("test", 1, 1, True) # test for accidentally made invalid words
    print_try("test", 4, 4, True) # test for not connected
    print_try("test", 6, 3, True) # oob test 
    print_try("notword", 0, 2, True) # word validity test
    print_try("never", 0, 2, True)
    print_try("lets", 3, 1, False) # test for accidentally made invalid words
    puzzle.step_back()
    print_try("nothing", 0, 2, True)
    print_try("guides", 6, 2, False)
    print_try("twig", 4, 0, False)
    print_try("sits", 6, 7, True)
    print_try("sun", 9, 7, False)
    print_try("does", 6, 5, True) # test for going over letter limit
    print_try("do", 6, 5, True)
    print(f"puzzles tile length: {len(puzzle.get_tiles())}, tiles: {puzzle.get_tiles()}")
    print(puzzle.board_to_string())

    puzzle.step_back()
    puzzle.step_back()
    puzzle.step_back()
    puzzle.step_back()
    puzzle.step_back()
    puzzle.step_back()
    print(puzzle.board_to_string())
    puzzle.step_back()
    print(puzzle.board_to_string())


    # Expected output:
        # vault⬩⬩⬩⬩⬩
        # a⬩⬩⬩w⬩⬩⬩⬩⬩
        # nothing⬩⬩⬩
        # i⬩⬩⬩g⬩u⬩⬩⬩
        # l⬩⬩⬩⬩⬩i⬩⬩⬩
        # l⬩⬩⬩⬩⬩do⬩⬩
        # a⬩⬩⬩⬩⬩e⬩⬩⬩
        # ⬩⬩⬩⬩⬩⬩sits
        # ⬩⬩⬩⬩⬩⬩⬩⬩⬩u
        # ⬩⬩⬩⬩⬩⬩⬩⬩⬩n

# puzzle_tests()
generate_puzzles()