import nltk 
from nltk.corpus import wordnet
import json

# nltk.download("wordnet") # update words before running

# extract words fgrom wordnet
word_list = {lemma.name().lower() for synset in wordnet.all_synsets() for lemma in synset.lemmas()}

# filter for unwanted words
def is_valid_word(word, synset):
    return (
        "-" not in word and
        "_" not in word and
        "'" not in word and
        len(word) > 1 and
        word.isalpha() # and
        # synset.pos() != "n"
        # synset.pos() != "s"
    )

filtered_words = {lemma.name().lower() for synset in wordnet.all_synsets()
                  for lemma in synset.lemmas() if is_valid_word(lemma.name().lower(), synset)}

# convert for Typescript use
word_list_ts = f'export const wordList = new Set({json.dumps(list(filtered_words))});'

with open("wordlist.ts", "w") as file:
    file.write(word_list_ts)

print(f"Generated word list with {len(filtered_words)} words.")