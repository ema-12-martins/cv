import pandas as pd
from sklearn.preprocessing import OneHotEncoder
import numpy as np
import heapq
import os

import matplotlib.pyplot as plt

def analyze_backtrack_limits(backtrack_values, target_product_id='10001.jpg', k=6):
    global tree, df, X_encoded, split_axis_order

    results = []

    for n_bt in backtrack_values:
        print(f"\nAnalisando com n_backtrack = {n_bt}")

        visit_counter = [0]
        product_counter = [0]
        backtrack_counter = [n_bt]

        # Índice do produto alvo
        try:
            product_index = df[df['id'] == int(target_product_id.split('.')[0])].index[0]
        except IndexError:
            print(f"Produto com ID {target_product_id} não encontrado.")
            continue

        # Definir pesos
        weights = np.ones(X_encoded.shape[1])
        starts = [0]
        for cats in encoder_cat.categories_[:-1]:
            starts.append(starts[-1] + len(cats))
        col_start_dict = dict(zip(columns_to_use, starts))
        for col in ['subCategory', 'baseColour', 'usage']:
            start = col_start_dict[col]
            length = len(encoder_cat.categories_[columns_to_use.index(col)])
            weights[start:start+length] = 2
        weights[-1] = 2

        # Executar busca KNN
        _ = knn_search(tree, X_encoded[product_index], k=k, weights=weights,
                       visit_counter=visit_counter, split_axis_order=split_axis_order,
                       n_backtrack=backtrack_counter, product_counter=product_counter)

        results.append({
            'n_backtrack': n_bt,
            'products_visited': product_counter[0]
        })

    return results

import matplotlib.pyplot as plt

def plot_backtrack_analysis(results):
    n_backtrack_vals = [r['n_backtrack'] for r in results]
    products_visited = [r['products_visited'] for r in results]

    plt.figure(figsize=(8, 5))
    plt.plot(n_backtrack_vals, products_visited, marker='x')
    plt.xlabel('Number of backtracks allowed')
    plt.ylabel('Number of compared products')
    plt.title('Impact of the backtrack in the search')
    plt.grid(True)
    plt.tight_layout()
    plt.show()


def analyze_bucket_sizes(bucket_sizes, target_product_id='10001.jpg', k=6):
    global tree, df, X_encoded, split_axis_order
    
    results = []

    for bucket_size in bucket_sizes:
        print(f"\nAnalisando com min_bucket_size = {bucket_size}")

        # Recria a árvore com o bucket atual
        points = [(X_encoded[i], i) for i in range(len(X_encoded))]
        tree = build_kdtree(points, split_axis_order=split_axis_order, max_depth=30, min_bucket_size=bucket_size)
        
        # Pega os contadores
        visit_counter = [0]
        product_counter = [0]
        backtrack_counter = [50]
        
        # Faz busca KNN
        product_index = df[df['id'] == int(target_product_id.split('.')[0])].index[0]
        
        # Definindo pesos (o mesmo do código original)
        weights = np.ones(X_encoded.shape[1])
        starts = [0]
        for cats in encoder_cat.categories_[:-1]:
            starts.append(starts[-1] + len(cats))
        col_start_dict = dict(zip(columns_to_use, starts))
        for col in ['subCategory', 'baseColour', 'usage']:
            start = col_start_dict[col]
            length = len(encoder_cat.categories_[columns_to_use.index(col)])
            weights[start:start+length] = 2
        weights[-1] = 2
        
        _ = knn_search(tree, X_encoded[product_index], k=k, weights=weights,
                       visit_counter=visit_counter, split_axis_order=split_axis_order,
                       n_backtrack=backtrack_counter, product_counter=product_counter)
        
        results.append({
            'min_bucket_size': bucket_size,
            'nodes_visited': visit_counter[0],
            'products_visited': product_counter[0]
        })

    return results

def plot_analysis(results):
    bucket_sizes = [r['min_bucket_size'] for r in results]
    nodes_visited = [r['nodes_visited'] for r in results]
    products_visited = [r['products_visited'] for r in results]

    plt.figure(figsize=(10, 6))
    #plt.plot(bucket_sizes, nodes_visited, marker='o', label='Nós visitados')
    plt.plot(bucket_sizes, products_visited, marker='x', label='Compared products')
    plt.xlabel('Min size of the bucket')
    plt.ylabel('Number of compared products')
    #plt.title('Impacto do Tamanho do Bucket em Nós/Produtos Visitados')
    plt.title('Impact of the bucket size in the search')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()

def analyze_tree_depths(depth_values, target_product_id='10001.jpg', k=6, min_bucket_size=10):
    global tree, df, X_encoded, split_axis_order

    results = []

    for depth in depth_values:
        print(f"\nAnalisando com max_depth = {depth}")

        # Recria a árvore com a profundidade atual
        points = [(X_encoded[i], i) for i in range(len(X_encoded))]
        tree = build_kdtree(points, split_axis_order=split_axis_order, max_depth=depth, min_bucket_size=min_bucket_size)
        
        # Contadores
        visit_counter = [0]
        product_counter = [0]
        backtrack_counter = [50]

        # Índice do produto
        try:
            product_index = df[df['id'] == int(target_product_id.split('.')[0])].index[0]
        except IndexError:
            print(f"Produto com ID {target_product_id} não encontrado.")
            continue

        # Definir pesos
        weights = np.ones(X_encoded.shape[1])
        starts = [0]
        for cats in encoder_cat.categories_[:-1]:
            starts.append(starts[-1] + len(cats))
        col_start_dict = dict(zip(columns_to_use, starts))
        for col in ['subCategory', 'baseColour', 'usage']:
            start = col_start_dict[col]
            length = len(encoder_cat.categories_[columns_to_use.index(col)])
            weights[start:start+length] = 2
        weights[-1] = 2

        # Busca KNN
        _ = knn_search(tree, X_encoded[product_index], k=k, weights=weights,
                       visit_counter=visit_counter, split_axis_order=split_axis_order,
                       n_backtrack=backtrack_counter, product_counter=product_counter)
        
        results.append({
            'max_depth': depth,
            'nodes_visited': visit_counter[0],
            'products_visited': product_counter[0]
        })

    return results

def plot_depth_analysis(results):
    depths = [r['max_depth'] for r in results]
    nodes_visited = [r['nodes_visited'] for r in results]
    products_visited = [r['products_visited'] for r in results]

    plt.figure(figsize=(10, 6))
    #plt.plot(depths, nodes_visited, marker='o', label='Nós visitados')
    plt.plot(depths, products_visited, marker='x', label='Compared products')
    plt.xlabel('Max KD-Tree deepth')
    plt.ylabel('Number of compared products')
    plt.title('Impact of the deepth in the search')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    plt.show()



# Mapeamento das cores que combinam, para efeito de exemplo, você pode expandir esse mapeamento
color_combinations = {
    'Black': ['White', 'Grey', 'Beige', 'Red', 'Silver', 'Gold', 'Navy Blue'],
    'White': ['Black', 'Grey', 'Beige', 'Red', 'Silver', 'Gold', 'Navy Blue'],
    'Grey': ['Black', 'White', 'Beige', 'Navy Blue', 'Red', 'Silver'],
    'Blue': ['Navy Blue', 'White', 'Grey', 'Red', 'Beige', 'Black'],
    'Red': ['Black', 'White', 'Grey', 'Blue', 'Beige', 'Gold'],
    'Green': ['Black', 'White', 'Grey', 'Beige', 'Navy Blue'],
    'Navy Blue': ['Black', 'White', 'Grey', 'Beige', 'Red', 'Silver', 'Gold'],
    # Adicionar mais combinações de cores conforme necessário
}

# Função para atribuir peso às cores baseado na cor do produto base
def calculate_color_weight(base_color, product_color):
    # Se a cor do produto for nula (na), atribui peso 1
    if product_color == 'nan' or base_color == 'nan':
        return 1
    
    # Caso a cor seja a mesma
    if base_color == product_color:
        return 2  # Peso alto para cor exata
    
    # Caso as cores combinam de acordo com o mapeamento
    if product_color in color_combinations.get(base_color, []):
        return 1.5  # Peso intermediário para cores que combinam
    
    # Caso não haja combinação
    return 1  # Peso 1 para outras cores

# Função para atribuir pesos a todas as cores de um produto com base na cor base
def assign_weights_based_on_color(df, base_color_column='baseColour'):
    weights = []
    
    # Itera sobre o dataframe para calcular os pesos
    for _, row in df.iterrows():
        product_color = row[base_color_column]
        weight = calculate_color_weight(base_color_column, product_color)
        weights.append(weight)
        
    return np.array(weights)

# ======================== CLASSE KDTREE ==========================


# Modified KDNode class storing multiple points
class KDNode:
    def __init__(self, points, axis=None, left=None, right=None):
        self.points = points  # List of (point, index)
        self.axis = axis
        self.left = left
        self.right = right

# Modified build_kdtree function with max depth

def build_kdtree(points, depth=0, split_axis_order=None, max_depth=30, min_bucket_size=5):
    if not points:
        return None

    # If we hit the max depth or few points left, stop splitting
    if depth >= max_depth or len(points) <= min_bucket_size:
        return KDNode(points=points, axis=None)

    if split_axis_order is None:
        k = len(points[0][0])
        axis = depth % k
    else:
        axis = split_axis_order[depth % len(split_axis_order)]

    points.sort(key=lambda x: x[0][axis])
    median = len(points) // 2

    return KDNode(
        points=[points[median]],
        axis=axis,
        left=build_kdtree(points[:median], depth + 1, split_axis_order, max_depth, min_bucket_size),
        right=build_kdtree(points[median + 1:], depth + 1, split_axis_order, max_depth, min_bucket_size)
    )

# Modified knn_search to handle multiple points in nodes
def knn_search(root, target, k, weights=None, depth=0, heap=None, visit_counter=None, split_axis_order=None, n_backtrack=None, product_counter=None):
    if heap is None:
        heap = []

    if weights is None:
        weights = np.ones(len(target))

    if root is None:
        return heap

    if visit_counter is not None:
        visit_counter[0] += 1

    for point, idx in root.points:
        product_counter[0] += 1
        dist = np.sqrt(np.sum(weights * (np.array(target) - np.array(point))**2))
        heapq.heappush(heap, (-dist, idx, point))
        if len(heap) > k:
            heapq.heappop(heap)

    # Don't go deeper if this is a leaf node
    if root.left is None and root.right is None:
        return sorted([(-d, idx) for d, idx, _ in heap])

    axis = root.axis
    diff = target[axis] - root.points[0][0][axis]

    close, away = (root.left, root.right) if diff < 0 else (root.right, root.left)

    knn_search(close, target, k, weights, depth + 1, heap, visit_counter, split_axis_order, n_backtrack=n_backtrack,product_counter=product_counter)

    if len(heap) < k or n_backtrack[0]  >0:
        n_backtrack[0] -= 1
        knn_search(away, target, k, weights, depth + 1, heap, visit_counter, split_axis_order, n_backtrack=n_backtrack,product_counter=product_counter)

    return sorted([(-d, idx) for d, idx, _ in heap])

import pandas as pd
import json
import os

def join_csv_with_json(csv_path, json_dir, output_csv_path):
    df = pd.read_csv(csv_path, quotechar='"', on_bad_lines='skip', encoding='utf-8')

    # Novas colunas a adicionar
    df['price'] = None
    df['discountedPrice'] = None
    df['brandName'] = None
    df['ageGroup'] = None
    df['gender'] = None

    for index, row in df.iterrows():
        product_id = str(row['id'])
        json_path = os.path.join(json_dir, f"{product_id}.json")
        
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    product_data = data.get('data', {})
                    df.at[index, 'price'] = product_data.get('price')
                    df.at[index, 'discountedPrice'] = product_data.get('discountedPrice')
                    df.at[index, 'brandName'] = product_data.get('brandName')
                    df.at[index, 'ageGroup'] = product_data.get('ageGroup')
                    df.at[index, 'gender'] = product_data.get('gender')
                except json.JSONDecodeError:
                    print(f"Erro ao decodificar JSON para o ID {product_id}")
        else:
            print(f"Arquivo JSON não encontrado para ID {product_id}")

    df.to_csv(output_csv_path, index=False, encoding='utf-8')
    print(f"Arquivo enriquecido salvo em: {output_csv_path}")

def add_has_discount_column(file_path):
    df = pd.read_csv(file_path, quotechar='"', on_bad_lines='skip', encoding='utf-8')

    if 'price' in df.columns and 'discountedPrice' in df.columns:
        df['has_discount'] = (df['price'] != df['discountedPrice']).astype(int)
        df.to_csv(file_path, index=False) 
        print(f"Coluna 'has_discount' adicionada com sucesso em '{file_path}'.")
    else:
        print("As colunas 'price' e/ou 'discountedPrice' não estão presentes no DataFrame.")


# ======================== USO =========================

tree = None
df = None
X_encoded = None
encoder_cat = None
columns_to_use = None
split_axis_order = None

#Numero da linha do produto a procurar
def get_recommendations(id):
    global df, X_encoded, encoder_cat, columns_to_use, tree, split_axis_order

    id_aux = id.split('.')[0]
    try:
        product_index = df[df['id'] == int(id_aux)].index[0]
    except IndexError:
        print(f"Product ID {id_aux} not found in the dataset.")
        return []

    print("Produto original a procurar:")
    print(df.iloc[product_index].id)

    # 7. Column start indices
    starts = [0]
    for cats in encoder_cat.categories_[:-1]:
        starts.append(starts[-1] + len(cats))
    col_start_dict = dict(zip(columns_to_use, starts))

    # 8. Feature weights
    weights = np.ones(X_encoded.shape[1])
    for col in ['subCategory', 'baseColour', 'usage']:
        start = col_start_dict[col]
        length = len(encoder_cat.categories_[columns_to_use.index(col)])
        weights[start:start+length] = 2

    # 8b. Extra weight for discount (last column is price_case)
    weights[-1] = 2

    # 9. KNN Search
    visit_counter = [0]
    backtrack_counter = [50]
    product_counter = [0]
    neighbors = knn_search(tree, X_encoded[product_index], k=6,
                           weights=weights, visit_counter=visit_counter,
                           split_axis_order=split_axis_order,
                           n_backtrack=backtrack_counter,
                           product_counter = product_counter)
    print("Nodes visited:", visit_counter[0])
    print("product_counter: ", product_counter)
    # 10. Results

    id_list = df.iloc[[idx for _, idx in neighbors]].id.tolist()
    recommended_products = [f'{id}.jpg' for id in id_list]
    return recommended_products

def count_nodes(node):
    if node is None:
        return 0
    return 1 + count_nodes(node.left) + count_nodes(node.right)

df = pd.read_csv('styles_joined.csv', quotechar='"', on_bad_lines='skip', encoding='utf-8')

columns_to_use = ['gender', 'masterCategory', 'subCategory', 'articleType',
                  'baseColour', 'season', 'usage', 'brandName', 'ageGroup']
X_raw = df[columns_to_use].fillna('missing')

encoder_cat = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_cat = encoder_cat.fit_transform(X_raw)

if 'price' in df.columns:
    df['price_case'] = pd.cut(df['price'], bins=5, labels=[f'Case {i+1}' for i in range(5)])
    encoder_price = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    X_price = encoder_price.fit_transform(df[['price_case']])
    X_encoded = np.hstack([X_cat, X_price])
else:
    X_encoded = X_cat

points = [(X_encoded[i], i) for i in range(len(X_encoded))]
feature_sums = np.sum(X_encoded, axis=0)
split_axis_order = np.argsort(-feature_sums)[:15]

tree = build_kdtree(points, split_axis_order=split_axis_order, max_depth=15, min_bucket_size=10)
print(count_nodes(tree))
if __name__ == "__main__":
    # 1. Load data
    df = pd.read_csv('styles_joined.csv', quotechar='"', on_bad_lines='skip', encoding='utf-8')

    # 2. Select categorical columns
    columns_to_use = ['gender', 'masterCategory', 'subCategory', 'articleType',
                      'baseColour', 'season', 'usage', 'brandName', 'ageGroup']
    X_raw = df[columns_to_use].fillna('missing')

    # 3. Encode categories
    encoder_cat = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    X_cat = encoder_cat.fit_transform(X_raw)

    # 4. Encode price if available
    if 'price' in df.columns:
        df['price_case'] = pd.cut(df['price'], bins=5, labels=[f'Case {i+1}' for i in range(5)])
        encoder_price = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        X_price = encoder_price.fit_transform(df[['price_case']])
        X_encoded = np.hstack([X_cat, X_price])
    else:
        X_encoded = X_cat

    # 5. Build points list
    points = [(X_encoded[i], i) for i in range(len(X_encoded))]

    # 6. Determine split axis order from most populated features
    feature_sums = np.sum(X_encoded, axis=0)
    split_axis_order = np.argsort(-feature_sums)[:30]

    # 7. Build tree
    tree = build_kdtree(points, split_axis_order=split_axis_order, max_depth=30)

    # 8. Optionally count and print number of nodes
    print("Total KD-Tree nodes:", count_nodes(tree))

#RODAR APENAS 1x, para JUNTAR OS DATASETS
#join_csv_with_json('./fashion-dataset/styles.csv', './fashion-dataset/styles', 'styles_joined.csv') 
#add_has_discount_column('styles_joined.csv'

bucket_sizes_to_test = [1, 5, 10, 20, 30, 50, 100]
results = analyze_bucket_sizes(bucket_sizes_to_test, target_product_id='10001.jpg')
plot_analysis(results)

depths_to_test = list(range(2, 20, 2))  # Exemplo: [5, 10, 15, 20, 25, 30]
results_depth = analyze_tree_depths(depths_to_test, target_product_id='10001.jpg', min_bucket_size=10)
plot_depth_analysis(results_depth)

backtrack_range = list(range(0, 101, 5))  # Testa de 0 até 100 em passos de 10
results_backtrack = analyze_backtrack_limits(backtrack_range, target_product_id='10001.jpg')
plot_backtrack_analysis(results_backtrack)

