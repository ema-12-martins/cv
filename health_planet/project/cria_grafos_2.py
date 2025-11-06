import networkx as nx
import random

def cria_grafo(num_nodes=65, max_conexoes_por_no=4):
    G = nx.DiGraph()

    # Adicionar nós ao grafo
    for i in range(num_nodes):
        node_label = f"Node_{i}"
        G.add_node(node_label, label=node_label)

    # Adicionar o nó 'Armazem' ao grafo
    G.add_node("Armazem", label="Armazem")

    # Adicionar arestas partindo do nó 'Armazem'
    conexoes_armazem = random.sample([f"Node_{i}" for i in range(num_nodes)], min(3, num_nodes))
    for node in conexoes_armazem:
        weight = random.randint(1,7)  # Peso aleatório para as arestas (1 a 20)
        estrada = random.choice(["alcatrão", "paralelo", "terra"])  # Escolha aleatória do tipo de estrada
        transito = random.uniform(0, 0.9)  # Trânsito aleatório (0 a 0.9)

        G.add_edge("Armazem", node, weight=weight, estrada=estrada, transito=transito)
        G.add_edge(node, "Armazem", weight=weight, estrada=estrada, transito=transito)

    # Adicionar arestas entre os demais nós do grafo
    for node in G.nodes():
        if node != "Armazem":
            num_conexoes = random.randint(1, max_conexoes_por_no)
            outros_nos = list(G.nodes - {node, "Armazem"})
            conexoes = random.sample(outros_nos, min(num_conexoes, len(outros_nos)))

            for conexao in conexoes:
                weight = random.randint(1, 20)  # Peso aleatório para as arestas (1 a 20)
                estrada = random.choice(["alcatrão", "paralelo", "terra"])  # Escolha aleatória do tipo de estrada
                transito = random.uniform(0, 0.9)  # Trânsito aleatório (0 a 0.9)

                G.add_edge(node, conexao, weight=weight, estrada=estrada, transito=transito)
                G.add_edge(conexao, node, weight=weight, estrada=estrada, transito=transito)

    # Adicionar heurísticas (exemplo com valores aleatórios)
    for node in G.nodes():
        heuristica = {other_node: random.uniform(0, 20) for other_node in G.nodes() if other_node != node}
        G.nodes[node]['heuristica'] = heuristica

    return G




def str_arestas_grafo(grafo):
        edges = grafo.edges(data=True)
        i=1
        for edge in edges:
                origin = edge[0]
                destination = edge[1]
                weight = edge[2]['weight']
                estrada = edge[2]['estrada']
                transito = edge[2]['transito']
                print(f"{i}-Origem: {origin}, Destino: {destination}, Peso: {weight}, Tipo: {estrada}, Trânsito: {transito}")
                i+=1

def mover_aresta_entre_grafos(numero, grafo1, grafo2, corte):
        edges = list(grafo1.edges(data=True))
        
        aresta_selecionada = edges[numero-1]  
        origem = aresta_selecionada[0]
        destino = aresta_selecionada[1]

        if corte and len(list(grafo1.successors(origem))) == 1:
                print(f"A estrada selecionada é a única forma de sair de {origem}, pelo que não pode ser cortada")

        elif corte and len(list(grafo1.predecessors(destino))) == 1:
                print(f"A estrada selecionada é a única forma de entrar em {destino}, pelo que não pode ser cortada")

        else:
                # Adiciona a aresta ao grafo2
                dados_aresta = aresta_selecionada[2] if len(aresta_selecionada) > 2 else {}
                grafo2.add_edge(origem, destino, **dados_aresta)

                # Remove a aresta do grafo1
                grafo1.remove_edge(origem, destino)

                if corte:
                        print (f"A estrada entre {origem} e {destino} foi cortada")
                else:
                        print (f"A estrada entre {origem} e {destino} foi reposta")
