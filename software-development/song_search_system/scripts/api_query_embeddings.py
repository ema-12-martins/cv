from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import requests

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Load the SentenceTransformer model
def load_model():
    return SentenceTransformer('neuralmind/bert-base-portuguese-cased')

model = load_model()

@app.route('/query', methods=['POST'])
def query_embeddings():
    try:
        # Parse the input JSON
        data = request.get_json()
        query_text = data.get('query')
        if not query_text:
            return jsonify({'error': 'Query text is required'}), 400

        # Convert the text to an embedding
        embedding = model.encode(query_text, convert_to_tensor=False).tolist()
        embedding_str = "[" + ",".join(map(str, embedding)) + "]"

        # Call the Solr KNN query
        solr_endpoint = "http://localhost:8983/solr"
        collection = "semantic_songs"

        results = solr_knn_query(solr_endpoint, collection, embedding_str)
        return jsonify(results)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
    

    try:
        response = requests.post(url, data=data, headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print("Solr request failed:", e)
        return {"error": str(e)}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
