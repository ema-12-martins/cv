import sys

def calculate_ap(retrieved_ids, relevant_ids):
    relevant_set = set(relevant_ids)  # Conjunto de documentos relevantes
    total_relevant = len(relevant_set)  # Total de documentos relevantes
    if total_relevant == 0:
        return 0.0  # Evita divisão por zero

    num_relevant_found = 0  # Contador de documentos relevantes encontrados
    precision_sum = 0.0

    for i, doc_id in enumerate(retrieved_ids):
        if doc_id in relevant_set:
            num_relevant_found += 1
            precision_at_i = num_relevant_found / (i + 1)  # Precisão na posição atual
            precision_sum += precision_at_i

    # Média das precisões nos documentos relevantes
    return precision_sum / total_relevant


src_total = sys.argv[1]
src_relevant = sys.argv[2]

try:
    with open(src_total, 'r') as file_total, open(src_relevant, 'r') as file_relevant:
        # Ler todas as linhas do primeiro arquivo
        total_lines = file_total.readlines()
        
        # Ler todas as linhas do segundo arquivo
        relevant_lines = file_relevant.readlines()
except FileNotFoundError as e:
    print(f"Erro: Arquivo não encontrado - {e}")
except Exception as e:
    print(f"Erro: {e}")

third_column_values = [line.split()[2] for line in total_lines]

#.........................................................

# Exemplo de uso
retrieved_ids = third_column_values  # IDs de documentos recuperados
relevant_ids =  [item.strip() for item in relevant_lines]  # IDs de documentos relevantes

ap = calculate_ap(retrieved_ids, relevant_ids)
print(f"Average Precision (AP): {ap:.4f}")
