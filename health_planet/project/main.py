from matplotlib.animation import FuncAnimation
import algoritmos_procura as ap
import cria_grafos as cg
import health_planet as hp
import estafeta as es
import encomenda as en
import povoar as p
import threading
import time
import networkx as nx
import matplotlib.pyplot as mpl

def atualiza_encomendas(encomenda,meio_de_transporte,grafo,meteorologia,altura_do_dia):

    caminho_antigo=encomenda.caminho
    ocorrencia = caminho_antigo.index(encomenda.ultimo_local_passou)
    if(encomenda.destino!="Armazem"):
        caminho_antigo = caminho_antigo[:ocorrencia]
        path1,_,_ = ap.dijkstra(grafo,encomenda.ultimo_local_passou,encomenda.destino)
        path2,_,_=ap.dijkstra(grafo,encomenda.destino,"Armazem")
        path=caminho_antigo+path1
        path=trajeto_completo_estafeta(path,path2)
        trajeto_novo=trajeto_completo_estafeta(path1,path2)
    else:
        ocorrencia = caminho_antigo.index(encomenda.ultimo_local_passou, ocorrencia + 1)
        caminho_antigo = caminho_antigo[:ocorrencia + 1]
        path1,_=ap.dijkstra(grafo,encomenda.ultimo_local_passou,"Armazem")
        path=caminho_antigo+path1
        trajeto_novo=path1

    if meio_de_transporte==1:
        tempo_novo_ida,tempo_novo_total,_=altera_velocidade(meteorologia,altura_do_dia,trajeto_novo, 10-(0.6*encomenda.peso), grafo)
        tempo_ida,tempo_total, vel_medias_novas=altera_velocidade(meteorologia,altura_do_dia,path, 10-(0.6*encomenda.peso), grafo)
    elif meio_de_transporte==2:
        tempo_novo_ida,tempo_novo_total,_ =altera_velocidade(meteorologia,altura_do_dia,trajeto_novo, 35-(0.5*encomenda.peso), grafo)
        tempo_ida,tempo_total, vel_medias_novas=altera_velocidade(meteorologia,altura_do_dia,path, 35-(0.5*encomenda.peso), grafo)
    else:
        tempo_novo_ida,tempo_novo_total,_ =altera_velocidade(meteorologia,altura_do_dia,trajeto_novo, 50-(0.1*encomenda.peso), grafo)
        tempo_ida,tempo_total, vel_medias_novas=altera_velocidade(meteorologia,altura_do_dia,path, 50-(0.1*encomenda.peso), grafo)

    return tempo_novo_total,tempo_total, vel_medias_novas, path

def trajeto_completo_estafeta(lista1,lista2):
    lista_concatenada = lista1 + lista2[1:]
    return lista_concatenada

def altera_velocidade(meteorologia,altura_do_dia,path, vel, grafo):
    tempo_ida = 0
    tempo_total = 0
    vel_medias = []

    if meteorologia == 1:
        pass
    elif meteorologia == 2:
        vel -= vel * 0.04
    elif meteorologia == 3:
        vel -= vel * 0.08
    elif meteorologia == 4:
        vel -= vel * 0.12
    elif meteorologia == 5:
        vel -= vel * 0.16

    if altura_do_dia == 1:
        pass
    elif altura_do_dia == 2:
        vel -= vel * 0.04

    posicao = 0
    while posicao + 1 < len(path):
        vel_aresta = vel
        distancia = grafo[path[posicao]][path[posicao + 1]]['weight']

        if grafo[path[posicao]][path[posicao + 1]]['estrada'] == "terra":
            vel_aresta -= vel_aresta * 0.1
        elif grafo[path[posicao]][path[posicao + 1]]['estrada'] == "paralelo":
            vel_aresta -= vel_aresta * 0.05

        vel_aresta -= vel_aresta * (grafo[path[posicao]][path[posicao + 1]]['transito'])

        if posicao < (len(path)-1)/2:
            tempo_ida += int(((distancia / vel_aresta) * 60) + 0.5)
        tempo_total += int(((distancia / vel_aresta) * 60) + 0.5)
        vel_medias.append(vel_aresta)
        posicao += 1
        
    return tempo_ida, tempo_total, vel_medias

def verifica_disponibilidade (transporte, tempo_ida,tempo_total, velocidades_medias, tempo_pretendido,health_planet,caminho,queremosEletrico,id_encomenda,distancia):
    tempo_disponivel_eletrico, estafeta_disponivel_eletrico, tempo_disponivel_sem_ser_eletrico, estafeta_disponivel_eletrico_sem_ser_eletrico = health_planet.disponibilidade(transporte)

    tempo_necessario_eletrico = (tempo_disponivel_eletrico + tempo_ida)
    tempo_necessario_sem_ser_eletrico = (tempo_disponivel_sem_ser_eletrico + tempo_ida) 


    if(queremosEletrico==True):
        if (tempo_pretendido >= tempo_necessario_eletrico):
            health_planet.atualiza_inicial(estafeta_disponivel_eletrico,tempo_total,tempo_necessario_eletrico,velocidades_medias,caminho,id_encomenda,transporte,True,distancia) 
            return tempo_necessario_eletrico
        elif(tempo_pretendido >= tempo_necessario_sem_ser_eletrico):
            health_planet.atualiza_inicial(estafeta_disponivel_eletrico_sem_ser_eletrico,tempo_total,tempo_necessario_sem_ser_eletrico,velocidades_medias,caminho,id_encomenda,transporte,False,distancia) 
            return tempo_necessario_sem_ser_eletrico
        return -1
    else:
        if(tempo_pretendido >= tempo_necessario_sem_ser_eletrico):
            health_planet.atualiza_inicial(estafeta_disponivel_eletrico_sem_ser_eletrico,tempo_total,tempo_necessario_sem_ser_eletrico,velocidades_medias,caminho,id_encomenda,transporte,False,distancia) 
            return tempo_necessario_sem_ser_eletrico
        elif(tempo_pretendido >= tempo_necessario_eletrico,distancia):
            health_planet.atualiza_inicial(estafeta_disponivel_eletrico,tempo_total,tempo_necessario_eletrico,velocidades_medias,caminho,id_encomenda,transporte,True,distancia) 
            return tempo_necessario_eletrico
        return -1

def calculos(dist,meteorologia,altura_do_dia,tempo_pedido, peso, path,health_planet,grafo,id_encomenda,nodos_percorridos):

    tempo_ida,tempo_total, velocidades_medias = altera_velocidade(meteorologia,altura_do_dia,path,10-(0.6*peso), grafo)
    if (peso<=5 and tempo_ida<tempo_pedido and (tempo_necessario := verifica_disponibilidade (1, tempo_ida,tempo_total, velocidades_medias, tempo_pedido,health_planet,path,False,id_encomenda,dist))!= -1):
        preco = health_planet.get_preco_encomenda(id_encomenda)
        print(f"Demora {tempo_ida} minutos a realizar a sua entrega de bicicleta pelo seguinte percurso de ida e volta: {path}, mas só é possível entregar daqui a {tempo_necessario} minutos, tendo um custo de {preco} euros\nPara obter este caminho, o algoritmo percorreu as seguintes freguesias {nodos_percorridos}")

    else:
        tempo_ida,tempo_total, velocidades_medias = altera_velocidade(meteorologia,altura_do_dia,path,35-(0.5*peso), grafo)
        if(peso<=20 and tempo_ida<tempo_pedido  and (tempo_necessario := verifica_disponibilidade (2, tempo_ida,tempo_total, velocidades_medias, tempo_pedido,health_planet,path,True,id_encomenda,dist))!= -1):
            preco = health_planet.get_preco_encomenda(id_encomenda)
            print(f"Demora {tempo_ida} minutos a realizar a sua entrega de moto pelo seguinte percurso de ida e volta: {path}, mas só é possível entregar daqui a {tempo_necessario} minutos, tendo um custo de {preco} euros\nPara obter este caminho, o algoritmo percorreu as seguintes freguesias {nodos_percorridos}")
        else:
            tempo_ida,tempo_total, velocidades_medias = altera_velocidade(meteorologia,altura_do_dia,path,50-(0.1*peso), grafo)
            if (tempo_ida<tempo_pedido and (tempo_necessario := verifica_disponibilidade (3, tempo_ida,tempo_total, velocidades_medias, tempo_pedido,health_planet,path,True,id_encomenda,dist))!= -1):
                preco = health_planet.get_preco_encomenda(id_encomenda)
                print(f"Demora {tempo_ida} minutos a realizar a sua entrega de carro pelo seguinte percurso de ida e volta: {path}, mas só é possível entregar daqui a {tempo_necessario} minutos, tendo um custo de {preco} euros\nPara obter este caminho, o algoritmo percorreu as seguintes freguesias {nodos_percorridos}")
            else:
                print("Não é possível entregar a encomenda no tempo pretendido")
                health_planet.remove_encomenda(id_encomenda)

def avanca_tempo_virtual(health_planet, grafo, encerrar_thread, grafo_cortadas):
    while True:
        if not encerrar_thread.is_set():
            time.sleep(1)
            health_planet.atualiza_estado(grafo, grafo_cortadas)
        else:
            time.sleep(1)

def update(id_estafeta,health_planet,grafo,ax,pos):
    encomenda = health_planet.dict_estafetas[id_estafeta].get_encomenda_atual()
    if encomenda is None:
        posicao = 'Armazem'
    else:
        posicao = encomenda.get_ultimo_local_passou()
    
    cores = ['blue' if node != posicao else 'red' for node in grafo.nodes()]
    ax.clear()
    nx.draw(grafo, pos=pos, with_labels=True, node_color=cores, font_weight='bold', ax=ax)
    

    
def main():
    health_planet = hp.Health_Planet()
    p.povoa_estafetas(health_planet)
    grafo = cg.cria_grafo()
    grafo_cortadas = nx.DiGraph()

    encerrar_thread = threading.Event()  # Cria um evento para encerrar a thread
    thread = threading.Thread(target=avanca_tempo_virtual, args=(health_planet, grafo, encerrar_thread, grafo_cortadas),daemon=True)
    thread.start()

    meteorologia=1
    altura_do_dia=1

    i=-2
    while(i!=0):
        print("\n------MENU-----")
        print("0-Sair")
        print("1-Adicionar estafeta")
        print("2-Visualizar estafetas")
        print("3-Remover estafeta")
        print("4-Atrasar estafeta")
        print("5-Visualizar encomendas")
        print("6-Visualizar fila de encomendas estafeta")
        print("7-Avançar o tempo")
        print("8-Parar o tempo")
        print("9-Visualizar grafo")
        print("10-Ver posicao de estafeta no grafo")
        print("11-Fazer Alterações")
        print("12-Comparar algoritmos")
        print("13-Realizar encomenda")
        print("14-Avaliar encomendas")
        print("15-Visualizar estatísticas")
        

        try:
            i=int(input("Introduza uma das opções: "))
            if (i!=0):
                if (i==1):
                    nome = input("Introduza o nome do estafeta: ")
                    meio_de_transporte = int(input("Indique o número do tipo de veículo \n1-Bicicleta\n2-Moto\n3-Carro:"))
                    eletrico = int(input("O veículo é elétrico (1-Sim, 2-Não):"))
                    if (meio_de_transporte>0 and meio_de_transporte<4):
                        if(eletrico==1 or eletrico==2):
                            if eletrico==1:
                                estafeta = es.Estafeta(nome, meio_de_transporte,True)
                                health_planet.add_estafeta(estafeta.id, estafeta)
                            else:
                                estafeta = es.Estafeta(nome, meio_de_transporte,False)
                                health_planet.add_estafeta(estafeta.id, estafeta)
                            print(f"O estafeta {nome} foi adicionado com sucesso")
                        else:
                            print("Valor inválido")
                    else:
                        print("Valor inválido")
                        
                elif(i==2):
                    health_planet.ver_estafetas()

                elif(i==3):
                    id=int(input("Introduza o id do estafeta: "))
                    try:
                        health_planet.remove_estafeta(id)
                    except:
                        print("Não foi possível remover o estafeta")

                elif(i==4):
                    try:
                        id = int(input("Indique o id do estafeta que se encontra atrasado: "))
                        if not health_planet.existe_estafeta(id):
                            print("O estafeta não existe")
                        else:
                            atraso = int(input("Indique o tempo de atraso do estafeta: "))
                            if(atraso>=0):
                                health_planet.dict_estafetas.get(id).aumenta_pausa(atraso)
                                print(f"O estafeta {id} está {atraso} minutos atrasado")
                            else:
                                print("O valor introduzido não é válido")
                    except:
                        print("Não foi possível registar o atraso do estafeta")
  
                elif(i==5):
                    health_planet.ver_encomendas()

                elif(i==6):
                    try:
                        id = int(input("Indique o id do estafeta de que pretende ver a fila de encomendas em espera: "))
                        if not health_planet.existe_estafeta(id):
                            print("O estafeta não existe")
                        else:
                            health_planet.ver_fila_estafeta(id)
                    except:
                        print("Não foi possível apresentar o solicitado")


                elif(i==7):
                    try:
                        if encerrar_thread.is_set():
                            encerrar_thread.clear()
                            print("O tempo está a avançar")
                        else:
                            print("O tempo já estava a avançar")
                    except:
                        print("Não foi possível avancar o tempo")


                elif(i==8):
                    try:
                        if not encerrar_thread.is_set():
                            encerrar_thread.set()
                            print("O tempo encontra-se parado")
                        else:
                            print("O tempo já estava parado")
                    except:
                        print("Não foi possível avancar o tempo")

                elif(i==9):
                    try:
                        print("Feche a representação do grafo para continuar")
                        nx.draw(grafo, with_labels=True, font_weight='bold')
                        mpl.show()
                    except:
                        print("Não foi possível apresentar o grafo")
                elif(i==10):  
                    try:
                        print("Feche a representação do grafo para continuar")
                        id_estafeta = int(input("Introduza o valor do estafeta que quer observar: "))

                        pos = nx.spring_layout(grafo)
                        fig, ax = mpl.subplots()
                        ani = FuncAnimation(fig, lambda frame: update(id_estafeta, health_planet, grafo,ax,pos), frames=10, interval=1000)
                        mpl.show()
                    except:
                        print("Nao foi possivel realizar a operacao")

                elif(i==11):#Alterar parametro
                    try:
                        correr_tempo = False
                        if not encerrar_thread.is_set():
                            encerrar_thread.set()
                            correr_tempo = True

                        opcao=-1
                        while(opcao!=0):
                            try:
                                print("\n------ALTERAR-----")
                                print("0-Terminar alterações")
                                print("1-Cortar estrada")
                                print("2-Repor estrada")
                                print("3-Alterar altura do dia")
                                print("4-Alterar meteorologia")
                                print("5-Alterar trânsito de uma estrada")
                                opcao=int(input("Introduza a opção que pretende realizar: "))
                                
                                if (opcao==0):
                                    pass
                                elif (opcao==1): 
                                    if(len(grafo.edges()) == 0):
                                        print("Não existem estradas que não estejam cortadas")
                                    else:
                                        cg.str_arestas_grafo(grafo)
                                        try:
                                            id = int(input("Introduza a estrada que vai ser cortada:"))
                                            if id>0 and id<=grafo.number_of_edges():
                                                cg.mover_aresta_entre_grafos(id,grafo,grafo_cortadas,True)
                                            else:
                                                print ("Introduza um valor válido")
                                        except:
                                            print("Introduza um valor válido")
                                elif(opcao==2):
                                    if(len(grafo_cortadas.edges()) == 0):
                                        print("Não existem estradas cortadas")
                                    else:
                                        cg.str_arestas_grafo(grafo_cortadas)
                                        try:
                                            id = int(input("Introduza a estrada que vai ser reposta:"))
                                            if id>0 and id<=grafo_cortadas.number_of_edges():
                                                cg.mover_aresta_entre_grafos(id,grafo_cortadas,grafo,False)
                                            else:
                                                print ("Introduza um valor válido")
                                        except:
                                            print("Introduza um valor válido")
                                elif(opcao==3):
                                    try:
                                        altura_dia = int(input("Altura do dia: (1-Dia, 2-Noite): "))
                                        if (altura_dia==1 or altura_dia==2):
                                            altura_do_dia=altura_dia
                                            print("A altura do dia foi alterada com sucesso")
                                        else:
                                            print("Valor inválido")
                                    except:
                                        print("Introduza um valor inteiro")
                                elif(opcao==4):
                                    try:
                                        met = int(input("Condições meteorológicas (1-sol, 2-vento, 3-chuva, 4-nevoeiro, 5-tempestade): "))
                                        if(met>0 and met<6):
                                            meteorologia=met
                                            print("A meteorologia foi alterada com sucesso")
                                        else:
                                            print("Valor não é válido")
                                    except:
                                        print("Introduza um valor inteiro")
                                elif(opcao==5):
                                    if(len(grafo.edges()) == 0):
                                        print("O grafo atual não tem estradas")
                                    else:
                                        cg.str_arestas_grafo(grafo)
                                        try:
                                            id = int(input("Introduza a estrada em que pretende alterar o trânsito:"))
                                            if id>0 and id<=grafo.number_of_edges():
                                                transito=float(input("Introduza o valor do trânsito (entre 0 e 0.9):"))
                                                if (transito>=0 and transito<=0.9):
                                                    edges = list(grafo.edges(data=True))
                                                    aresta_selecionada = edges[id-1]  
                                                    origem = aresta_selecionada[0]
                                                    destino = aresta_selecionada[1]
                                                    grafo[origem][destino]['transito']=transito
                                                    print(f"O trânsito de {origem} para {destino} foi alterado para {transito}")
                                                else:
                                                    print("O trânsito tem de ser um valor entre 0 e 0.9")
                                            else:
                                                print ("Introduza um valor válido")
                                        except:
                                            print("Introduza um valor válido")
                                else:
                                    print("Introduza um valor válido")
                            except:
                                print("Não foi possível realizar a alteração")
                                    
                        #O que temos de atualizar no estafeta
                        for estafeta in health_planet.dict_estafetas.values():
                            #..........................Atualizar encomenda atual.........................................
                            if(estafeta.encomenda_atual!=None):
                                tempo_transporte,tempo_total_viagem,vel_medias,path=atualiza_encomendas(estafeta.encomenda_atual,estafeta.meio_de_transporte,grafo,meteorologia,altura_do_dia)

                                estafeta.encomenda_atual.velocidades_medias=vel_medias
                                estafeta.encomenda_atual.tempo_transporte=tempo_transporte
                                estafeta.encomenda_atual.tempo_total_viagem=tempo_total_viagem
                                estafeta.encomenda_atual.caminho=path

                                #............................Atualizar encomendas em fila.................................
                                if(not estafeta.fila_encomendas.empty):
                                    tamanho_da_fila = estafeta.fila_encomendas.qsize()

                                    for i in range(tamanho_da_fila):
                                        elemento = estafeta.fila_encomendas.get()
                                        tempo_transporte,tempo_total_viagem,vel_medias,path=atualiza_encomendas(elemento,estafeta.meio_de_transporte,grafo,meteorologia,altura_do_dia)

                                        elemento.velocidades_medias=vel_medias
                                        elemento.tempo_transporte=tempo_transporte
                                        elemento.tempo_total_viagem=tempo_total_viagem
                                        elemento.caminho=path
                                        
                                        estafeta.fila_encomendas.put()

                        #Para voltar a correr a thread
                        if correr_tempo:
                            encerrar_thread.clear()

                    except:
                        print("Erro ao realizar as alterações")
                        if correr_tempo:
                            encerrar_thread.clear()

                elif(i==12):
                    try:
                        origem=input("\nOrigem: ")
                        destino=input("\nDestino: ")

                        print("1-Dijkstra")
                        trajeto_final,custo,trajeto_completo= ap.dijkstra(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                        print("2-Iterativo")
                        trajeto_final,custo,trajeto_completo= ap.iterative_deepening_dfs(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                        print("3-Procura em profundidade(DFS)")
                        trajeto_final,custo,trajeto_completo= ap.procura_em_profundidade(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                        print("4-Procura Bidirecional")
                        trajeto_final,custo,trajeto_completo= ap.bidirectional_search(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                        print("5-Procura em largura(BFS)")
                        trajeto_final,custo,trajeto_completo= ap.bfs(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                        print("6-Procura Gulosa")
                        trajeto_final,custo,trajeto_completo= ap.greedy_shortest_path(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                        print("7-Procura A*")
                        trajeto_final,custo,trajeto_completo= ap.algoritmoAEstrela(grafo,origem,destino)
                        print(f"Trajeto completo: {trajeto_completo}")
                        print(f"Trajeto final: {trajeto_final}")
                        print(f"Custo: {custo}")
                        print("\n")

                    except:
                        print("Nao foi possivel realizar a operação")



                elif(i==13):
                    print("\n------ALGORITMO-----")
                    print("1-Dijkstra")
                    print("2-Iterativo")
                    print("3-Procura em profundidade(DFS)")
                    print("4-Procura Bidirecional")
                    print("5-Procura em largura(BFS)")
                    print("6-Procura Gulosa")
                    print("7-Procura A*")

                    try:
                        opcao=int(input("Introduza uma das opções:"))
                        volume=int(input("\nIntroduza o volume da encomenda:"))
                        peso=float(input("\nIntroduza o peso da encomenda em Kg:"))
                        tempo=int(input("\nQual o tempo máximo em minutos:"))
                        terra=input("\nPara onde deseja encomendar:")

                        try:
                            encomenda=en.Encomenda(peso,volume, tempo)
                            health_planet.add_encomenda(encomenda.id,encomenda)
                            if (peso>0 and peso<=100):
                                #.....................Varios algoritmos.................
                                if (opcao==1):
                                    try:
                                        path1,dist,nodos_percorridos = ap.dijkstra(grafo,"Armazem",terra)
                                        path2,_,_=ap.dijkstra(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos (dist,meteorologia,altura_do_dia, tempo, peso, path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except:
                                        print("O destino selecionado não existe")

                                elif (opcao==2):
                                    try:
                                        path1,dist,nodos_percorridos = ap.iterative_deepening_dfs(grafo,"Armazem",terra)
                                        path2,_,_=ap.iterative_deepening_dfs(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos(dist,meteorologia,altura_do_dia,tempo,peso,path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except:
                                        print("O destino selecionado não existe")

                                elif (opcao==3):
                                    try:
                                        path1,dist,nodos_percorridos = ap.procura_em_profundidade(grafo,"Armazem",terra)
                                        path2,_,_=ap.procura_em_profundidade(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos (dist,meteorologia,altura_do_dia, tempo, peso, path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except:
                                        print("O destino selecionado não existe")

                                elif (opcao==4):
                                    try:
                                        path1,dist,nodos_percorridos = ap.bidirectional_search(grafo,"Armazem",terra)
                                        path2,_,_=ap.bidirectional_search(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos (dist,meteorologia,altura_do_dia, tempo, peso, path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except :
                                        print("O destino selecionado não existe")

                                elif (opcao==5):
                                    try:
                                        path1,dist,nodos_percorridos = ap.bfs(grafo,"Armazem",terra)
                                        path2,_,_=ap.bfs(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos (dist,meteorologia,altura_do_dia, tempo, peso, path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except :
                                        print("O destino selecionado não existe")

                                elif (opcao==6):
                                    try:
                                        path1,dist,nodos_percorridos = ap.greedy_shortest_path(grafo,"Armazem",terra)
                                        path2,_,_=ap.greedy_shortest_path(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos (dist,meteorologia,altura_do_dia, tempo, peso, path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except :
                                        print("O destino selecionado não existe")

                                elif (opcao==7):
                                    try:
                                        path1,dist,nodos_percorridos = ap.algoritmoAEstrela(grafo,"Armazem",terra)
                                        path2,_,_=ap.algoritmoAEstrela(grafo,terra,"Armazem")
                                        path=trajeto_completo_estafeta(path1,path2)
                                        calculos (dist,meteorologia,altura_do_dia, tempo, peso, path,health_planet,grafo,encomenda.id,nodos_percorridos)
                                    except :
                                        print("O destino selecionado não existe")

                                else:
                                    print("O algoritmo escolhido não é válido")
                                    health_planet.remove_encomenda(encomenda.id)
                                #........................................................                                
                            else:
                                    print("Peso impossível")
                                    health_planet.remove_encomenda(encomenda.id)
                        except :
                                print("Não foi possível registar a encomenda")
                                health_planet.remove_encomenda(encomenda.id)
                    except :
                        print("Os valores introduzidos são inválidos")
                        health_planet.remove_encomenda(encomenda.id)
                

                elif (i==14):
                    try:
                        length = health_planet.imprime_encomendas_por_avaliar()
                        if length == 0:
                            print("Não existem encomendas por avaliar")
                        else:
                            id=int(input("Introduza o número da encomenda que pretende avaliar: "))
                            if id>0 and id<=length:
                                avaliacao = float(input("Indique a classificação que pretende dar (entre 0 e 5): "))
                                if avaliacao<0 or avaliacao>5:
                                    print("O valor introduzido não é válido")
                                else:
                                    classificacao_final = health_planet.regista_classificacao(id, avaliacao)
                                    print(f"O estafeta que realizou a encomenda ficou com uma classificação de {classificacao_final}")
                            else:
                                print("Introduza um valor válido")

                    except:
                        print("Não foi possível avaliar a encomenda")


                elif (i==15):
                    opcao=-1
                    while(opcao!=0):
                        try:
                            print("\n-----Estatísticas-----")
                            print("0-Regressar ao menu principal")
                            print("1-Classificação média dos estafetas")
                            print("2-Preço médio das encomendas")
                            print("3-Tempo médio de entrega das encomendas")
                            print("4-Tempo médio de atraso das encomendas")
                            print("5-Tempo médio de entrega por estafeta")
                            print("6-Tempo médio de atraso por estafeta")
                            print("7-Lista dos estafetas ordenados por classificação")
                            print("8-Lista dos estafetas ordenados por número de encomendas efetuadas")
                            print("9-Lista dos estafetas ordenados por número de encomendas efetuadas sem atrasos")
                            opcao=int(input("Introduza a opção da estatística que pretende consultar: "))
                        
                            if (opcao==0):
                                pass

                            elif (opcao==1):
                                classificacao = health_planet.classificacao_media()
                                if classificacao != -1:
                                    print (f"A classificação média dos estafetas é de {classificacao}")
                                else:
                                    print("Não existem estafetas")

                            elif (opcao==2):
                                preco = health_planet.preco_medio()
                                if preco != -1:
                                    print (f"O preço médio das encomendas é de {preco} euros")
                                else:
                                    print("Não existem encomendas")

                            elif (opcao==3):
                                tempo_entrega = health_planet.tempo_encomenda_medio()
                                if tempo_entrega != -1:
                                    print (f"O tempo médio de entrega das encomendas é de {tempo_entrega} minutos")
                                else:
                                    print ("Não existem encomendas entregues")

                            elif (opcao==4):
                                tempo_atraso = health_planet.tempo_atraso_medio()
                                if tempo_atraso != -1:
                                    print (f"O tempo médio de atraso das encomendas é de {tempo_atraso} minutos")
                                else:
                                    print ("Não existem encomendas entregues")

                            elif (opcao==5):
                                health_planet.tempo_encomenda_medio_por_estafeta()

                            elif (opcao==6):
                                health_planet.tempo_atraso_medio_por_estafeta()

                            elif (opcao==7):
                                health_planet.ordena_estafetas_classificacao()

                            elif (opcao==8):
                                health_planet.ordena_estafetas_nr_encomendas()

                            elif (opcao==9):
                                health_planet.ordena_estafetas_nr_encomendas_sem_atraso()

                            else:
                                print("Introdiza um valor válido")
                        
                        except:
                            print ("Não foi possível apresentar a estatística pretendida")
                
                
                
                else:
                    print ("Introduza um valor válido")
            else:
                    encerrar_thread.set()
        except:
            print("Introduza um valor válido")
            i=-2

if __name__ == "__main__":
    main()
