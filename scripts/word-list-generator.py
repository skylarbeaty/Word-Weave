import json

input_file = "./base-word-list.txt"
manual_exclusion_file = "./excluded-words.txt"
generated_exclusion_file = "./generated-excluded-word-list.txt"
manual_inclusion_file = "./manual-include-word-list.txt"
output_txt = "checked-wordlist.txt"
output_ts = "wordlist.ts"

print("Loading words...")

# load words from input file
with open(input_file, "r", encoding="utf-8") as file:
    words = {line.strip().lower() for line in file}

# load words from inclusion and exclusion files
def load_word_list(file_name):
    file_words = set()
    with open(file_name, "r", encoding="utf-8") as file:
        for line in file:
            word = line.split(":")[0].strip().lower()  # remove optional reason, denoted by ":"
            if word:
                file_words.add(word)
    return file_words

manual_excluded_words = load_word_list(manual_exclusion_file)
generated_excluded_words = load_word_list(generated_exclusion_file)
manual_include_words = load_word_list(manual_inclusion_file)

print("Filtering words...")

# filter out words with non-letter characters and one letter words 
def passes_word_filter(word):
    return (
        len(word) > 1 and
        word.isalpha()
    )

# check against manually generated lists and a dictionary scraped list
def passes_word_check(word):
    return(
        word not in manual_excluded_words and
        (word not in generated_excluded_words or word in manual_include_words)
    )

filtered_words = {word for word in words if passes_word_filter(word)}
checked_words = {word for word in filtered_words if passes_word_check(word)} # remove words on exclusion list
checked_words.update(manual_include_words) # add any words from include list that werent in original set

print("Sorting words...")

# sort by length
sorted_words = sorted(checked_words, key=len)

print("Writing text file...")

# write txt file
with open(output_txt, "w", encoding="utf-8") as f:
    f.write("\n".join(sorted_words))

print("Writing ts file...")

# write typescript file
word_list_ts = f'export const wordList = new Set({json.dumps(sorted_words)});\n'
with open(output_ts, "w", encoding="utf-8") as f:
    f.write(word_list_ts)

print(f"Processed {len(checked_words)} words. Output saved to {output_txt} and {output_ts}.")
