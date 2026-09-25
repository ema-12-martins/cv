import sys
import json
from sentence_transformers import SentenceTransformer

# Load the SentenceTransformer model
model = SentenceTransformer('neuralmind/bert-base-portuguese-cased')

def get_embedding(text):
    # The model.encode() method already returns a list of floats
    return model.encode(text, convert_to_tensor=False).tolist()

if __name__ == "__main__":
    # Read JSON from STDIN
    data = json.load(sys.stdin)
    count = 0

    # Update each document in the JSON data
    for document in data:
        # Extract fields if they exist, otherwise default to empty strings
        title = document.get("title", "")
        lyrics = document.get("lyrics", "")
        tags = document.get("lastfm_tags", "")
        content_artist = document.get("lastfm_content_artist", "")
        content_song = document.get("lastfm_content_song", "")

        combined_text = title + " " + lyrics + " " + tags + " " + content_artist + " " + content_song
        document["vector"] = get_embedding(combined_text)

    # Output updated JSON to STDOUT
    json.dump(data, sys.stdout, indent=4, ensure_ascii=False)
