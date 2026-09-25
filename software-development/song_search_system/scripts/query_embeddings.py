import requests
from sentence_transformers import SentenceTransformer

def text_to_embedding(text):
    model = SentenceTransformer('neuralmind/bert-base-portuguese-cased')
    embedding = model.encode(text, convert_to_tensor=False).tolist()
    
    # Convert the embedding to the expected format
    embedding_str = "[" + ",".join(map(str, embedding)) + "]"
    return embedding_str

def solr_knn_query(endpoint, collection, embedding):
    url = f"{endpoint}/{collection}/select"

    data = {
        "q": f"{{!knn f=vector topK=10}}{embedding}",
        "fl": "*,score",
        "rows": 10,
        "wt": "json"
    }
    
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    response = requests.post(url, data=data, headers=headers)
    response.raise_for_status()
    return response.json()


def display_results(results):
    docs = results.get("response", {}).get("docs", [])
    num = results.get("response", {}).get("numFound", 0)
    if not docs:
        print("No results found.")
        return
    
    print(f"Found {num} results:")
    # Print top results
    for doc in docs:
        print(f"* {doc.get('id')} {doc.get('title')} {doc.get('lyrics')} [score: {doc.get('score'):.2f}]")

    # Write to results.txt
    with open("results.txt", "w") as f:
        for doc in docs:
            # Write Every parameter to the file
            f.write(f"* {doc.get('id')} \n {doc.get('title')} \n {doc.get('artist')} \n {doc.get('lastfm_tags')} \n {doc.get('lastfm_content_song')} \n {doc.get('lastfm_content_artist')} \n {doc.get('lyrics')} [score: {doc.get('score'):.2f}]\n")

            f.write("\n\n\n\n\n\n\n\n")

def main():
    solr_endpoint = "http://localhost:8983/solr"
    collection = "semantic_songs"
    
    query_text = input("Enter your query: ")
    embedding = text_to_embedding(query_text)

    try:
        results = solr_knn_query(solr_endpoint, collection, embedding)
        display_results(results)
    except requests.HTTPError as e:
        print(f"Error {e.response.status_code}: {e.response.text}")

if __name__ == "__main__":
    main()
