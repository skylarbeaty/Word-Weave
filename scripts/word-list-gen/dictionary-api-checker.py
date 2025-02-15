import requests, time, json

base_url = "https://api.dictionaryapi.dev/api/v2/entries/en/{}"

filtered_word_list = "filtered-wordlist.txt"
excluded_word_list = "generated-excluded-word-list.txt"

def load_filtered_words():
    with open(filtered_word_list, "r", encoding="utf-8") as file:
        return [line.strip() for line in file if line.strip()]
    
# pick up list where it left off, if found
def load_excluded_words():
    excluded_words = set()
    try:
        with open(excluded_word_list, "r", encoding="utf-8") as file:
            for line in file:
                word = line.split(":")[0].strip()
                excluded_words.add(word)
    except FileNotFoundError:
        pass
    return excluded_words

# check api for the word
def check_word(word):
    try:
        # call api
        response = requests.get(base_url.format(word), timeout=5)
        if response.status_code != 200:
            return False, "API error or not found"
        # was it in the dictionary
        data = response.json()
        if isinstance(data,dict) and data.get("title") == "No Definitions Found":
            return False, "No definition found"
        # does the word have an audio listed (way for removing abbreviations)
        for entry in data:
            if "phonetics" in entry:
                for phonetic in entry["phonetics"]:
                    if "audio" in phonetic and phonetic["audio"]:
                        return True, None # word passes
        
        return False, "No audio available"
    except (requests.RequestException, json.JSONDecodeError) as e:
        return None, f"API Failure: {str(e)}"
    
# check all the words against the api
def process_words():
    words = load_filtered_words()
    excluded_words = load_excluded_words()
    exclusions = []
    count = 0

    for word in words:
        count += 1
        # if len(word) < 2 or word in excluded_words:
        if len(word) != 4 or word in excluded_words:
            continue

        success, reason = check_word(word)

        if success is None:
            print(f"{count}/8081: Skipping {word} due to API failure. Try running again later.")
            continue

        if not success:
            print(f"{count}/8081: Excluding {word}: {reason}")
            exclusions.append(f"{word}: {reason}")

        time.sleep(0.2)

    if exclusions:
        with open(excluded_word_list, "a", encoding="utf-8") as file:
            file.write("\n".join(exclusions) + "\n")

    print("Process complete. Exclusions saved.")

if __name__ == "__main__":
    process_words()