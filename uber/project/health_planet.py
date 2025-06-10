import threading

class Health_Planet:
    def __init__(self):
        self.dict_estafetas = {}  # Mapa de estafetas com ID como chave
        self.lock_estafetas = threading.Lock()

        self.dict_encomendas = {}  # Mapa de encomendas com ID como chave
        self.lock_encomendas = threading.Lock()

        self.encomendas_por_avaliar=[]
        self.lock_encomendas_por_avaliar = threading.Lock()

        self.tempo_virtual=0

    def add_estafeta(self, estafeta_id, estafeta_data):
        with self.lock_estafetas:
            self.dict_estafetas[estafeta_id] = estafeta_data

    def remove_estafeta(self, estafeta_id):
        with self.lock_estafetas:
            if estafeta_id in self.dict_estafetas.keys():
                if self.dict_estafetas[estafeta_id].get_encomenda_atual() == None and self.dict_estafetas[estafeta_id].get_nr_encomendas_fila()==0:
                    del self.dict_estafetas[estafeta_id]
                    print("Estafeta removido com sucesso")
                else:
                    print(f"Não é possível remover o estafeta com ID {estafeta_id} porque este tem encomendas pendentes")
            else:
                print(f"Estafeta com ID {estafeta_id} não encontrado.")

    def ver_estafetas(self):
        with self.lock_estafetas:
            for estafeta in self.dict_estafetas.values():
                print(estafeta)

    def existe_estafeta(self,id):
        with self.lock_estafetas:
            if id in self.dict_estafetas.keys():
                return True
        return False

    def add_encomenda(self, encomenda_id, encomenda_data):
        with self.lock_encomendas:
            self.dict_encomendas[encomenda_id] = encomenda_data

    def remove_encomenda(self, encomenda_id):
        with self.lock_encomendas:
            if encomenda_id in self.dict_encomendas:
                del self.dict_encomendas[encomenda_id]

    def ver_encomendas(self):
        with self.lock_encomendas:
            for encomenda in self.dict_encomendas.values():
                print(encomenda)

    def ver_fila_estafeta(self, id_estafeta):
        with self.lock_estafetas:
            self.dict_estafetas[id_estafeta].ver_encomendas_em_fila()

    def disponibilidade(self, meio_transporte):
        tempo_minimo_eletrico = float('inf')
        id_condutor_min_tempo_eletrico = None

        tempo_minimo_sem_ser_eletrico = float('inf')
        id_condutor_min_tempo_sem_ser_eletrico = None

        with self.lock_estafetas:
            for condutor in self.dict_estafetas.values():
                if condutor.meio_de_transporte == meio_transporte:
                    tempo_ate_disponivel = condutor.calcula_tempo_ate_disponivel()
                    if tempo_ate_disponivel < tempo_minimo_eletrico and condutor.eletrico==True:
                        tempo_minimo_eletrico = tempo_ate_disponivel
                        id_condutor_min_tempo_eletrico = condutor.id
                    elif(tempo_ate_disponivel < tempo_minimo_sem_ser_eletrico and condutor.eletrico==False):
                        tempo_minimo_sem_ser_eletrico=tempo_ate_disponivel
                        id_condutor_min_tempo_sem_ser_eletrico=condutor.id

        return tempo_minimo_eletrico, id_condutor_min_tempo_eletrico, tempo_minimo_sem_ser_eletrico, id_condutor_min_tempo_sem_ser_eletrico
    
    def atualiza_inicial(self,id_estafeta,tempo,tempo_necessario,velocidades_medias,caminho,id_encomenda,veiculo,eletrico,distancia):
        with self.lock_encomendas:
            encomenda = self.dict_encomendas.get(id_encomenda)
        if encomenda is not None:
            encomenda.atualiza_encomenda_inicio(tempo,tempo_necessario,velocidades_medias,caminho,id_estafeta,veiculo,eletrico,distancia)
            with self.lock_estafetas:
                self.dict_estafetas[id_estafeta].atualiza_estafeta_inicio(encomenda)

    def atualiza_estado(self,grafo,grafo_cortadas):
        self.tempo_virtual+=1
        with self.lock_estafetas:
            for estafeta in self.dict_estafetas.values():
                encomenda = estafeta.get_encomenda_atual()
                if encomenda is not None:
                    ultimo_lugar = encomenda.get_posicao(grafo,grafo_cortadas)
                    if estafeta.atualiza_estafeta_meio(ultimo_lugar):
                        with self.lock_encomendas_por_avaliar:
                            self.encomendas_por_avaliar.append(encomenda)
                else:
                    estafeta.comecar_nova_encomenda()
        with self.lock_encomendas:
            for encomenda in self.dict_encomendas.values():
                if encomenda.get_chegou_ao_destino() == False:
                    encomenda.aumenta_tempo_que_percorreu()

        
    def imprime_encomendas_por_avaliar(self):
        i=1
        with self.lock_encomendas_por_avaliar:
            for encomenda in self.encomendas_por_avaliar:
                print (f"{i}- {encomenda}")
                i += 1
        return i-1

    def regista_classificacao(self, nr_encomenda, classificacao):
        with self.lock_encomendas_por_avaliar:
            encomenda=self.encomendas_por_avaliar[nr_encomenda-1]
            atraso=encomenda.get_atraso()
            id_estafeta= encomenda.get_id_estafeta()
            self.encomendas_por_avaliar.pop(nr_encomenda-1)
        with self.lock_estafetas:
            estafeta=self.dict_estafetas.get(id_estafeta)
            classificacao_estafeta = estafeta.atualiza_classificacao(atraso,classificacao)
        return classificacao_estafeta

    def get_preco_encomenda(self, id_encomenda):
        with self.lock_encomendas:
            encomenda=self.dict_encomendas.get(id_encomenda)
            return encomenda.get_preco()
                
    #Estatísticas
    #1
    def classificacao_media(self):
        with self.lock_estafetas:
            classificacao = 0
            estafetas = 0
            for estafeta in self.dict_estafetas.values():
                classificacao += estafeta.get_classificacao()
                estafetas += 1
        if estafetas > 0:
            return classificacao/estafetas
        else:
            return -1
    #2
    def preco_medio(self):
        with self.lock_encomendas:
            preco = 0
            encomendas = 0
            for encomenda in self.dict_encomendas.values():
                preco_encomenda = encomenda.get_preco()
                if preco_encomenda > -1:
                    preco += preco_encomenda
                    encomendas += 1
        if encomendas > 0:
            return preco/encomendas
        else:
            return -1

    #3    
    def tempo_encomenda_medio(self):
        with self.lock_encomendas:
            tempo = 0
            encomendas = 0
            for encomenda in self.dict_encomendas.values():
                if encomenda.get_chegou_ao_destino():
                    tempo += encomenda.get_tempo_que_percorreu()
                    encomendas += 1
        if encomendas > 0:
            return tempo/encomendas
        else:
            return -1

    #4    
    def tempo_atraso_medio(self):
        with self.lock_encomendas:
            atraso = 0
            encomendas = 0
            for encomenda in self.dict_encomendas.values():
                if encomenda.get_chegou_ao_destino():
                    atraso += encomenda.get_atraso()
                    encomendas += 1
        if encomendas > 0:
            return atraso/encomendas
        else:
            return -1


    #aux
    def media(self,lista):
        if len(lista)<1:
            return None
        return sum(lista)/len(lista)

    #5
    def tempo_encomenda_medio_por_estafeta(self):
        tempo_por_estafeta = {}
        with self.lock_encomendas:
            for encomenda in self.dict_encomendas.values():
                id_estafeta = encomenda.get_id_estafeta()
                if id_estafeta != None and encomenda.get_chegou_ao_destino():
                    if id_estafeta in tempo_por_estafeta:
                        tempo_por_estafeta[id_estafeta].append(encomenda.get_tempo_que_percorreu())
                    else:
                        tempo_por_estafeta[id_estafeta] = [encomenda.get_tempo_que_percorreu()]

        with self.lock_estafetas:
            for id, estafeta in self.dict_estafetas.items():
                if id in tempo_por_estafeta.keys():
                    estafeta.imprime(1,self.media(tempo_por_estafeta[id]))
                else:
                    estafeta.imprime(1,None)

    #6
    def tempo_atraso_medio_por_estafeta(self):
        tempo_por_estafeta = {}
        with self.lock_encomendas:
            for encomenda in self.dict_encomendas.values():
                id_estafeta = encomenda.get_id_estafeta()
                if id_estafeta != None and encomenda.get_chegou_ao_destino():
                    if id_estafeta in tempo_por_estafeta:
                        tempo_por_estafeta[id_estafeta].append(encomenda.get_atraso())
                    else:
                        tempo_por_estafeta[id_estafeta] = [encomenda.get_atraso()]
        
        with self.lock_estafetas:
            for id, estafeta in self.dict_estafetas.items():
                if id in tempo_por_estafeta.keys():
                    estafeta.imprime(2,self.media(tempo_por_estafeta[id]))
                else:
                    estafeta.imprime(2,None)

    #7
    def ordena_estafetas_classificacao(self):
        classificacao_estafetas = {}
        with self.lock_estafetas:
            for estafeta_id, estafeta in self.dict_estafetas.items():
                classificacao = estafeta.get_classificacao()
                classificacao_estafetas[estafeta_id] = classificacao

        estafetas_ordenados = sorted(classificacao_estafetas.items(), key=lambda x: x[1], reverse=True) #.items() transforma o dicionário em lista de pares (key,value), x[1] vai buscar o segundo elemento
        
        for id, _ in estafetas_ordenados:
            estafeta = self.dict_estafetas.get(id)
            if estafeta is not None:
                estafeta.imprime(3,_)

    #8
    def ordena_estafetas_nr_encomendas(self):
        encomendas_por_estafeta = {}
        with self.lock_encomendas:
            for encomenda in self.dict_encomendas.values():
                id_estafeta = encomenda.get_id_estafeta()
                if id_estafeta != None and encomenda.get_chegou_ao_destino():
                    if id_estafeta in encomendas_por_estafeta:
                        encomendas_por_estafeta[id_estafeta] += 1
                    else:
                        encomendas_por_estafeta[id_estafeta] = 1

        estafetas_ordenados = sorted(encomendas_por_estafeta.items(), key=lambda x: x[1], reverse=True) #.items() transforma o dicionário em lista de pares (key,value), x[1] vai buscar o segundo elemento
        
        for id, encomendas in estafetas_ordenados:
            estafeta = self.dict_estafetas.get(id)
            if estafeta is not None:
                estafeta.imprime(4,encomendas)

    #9
    def ordena_estafetas_nr_encomendas_sem_atraso(self):
        encomendas_por_estafeta = {}
        with self.lock_encomendas:
            for encomenda in self.dict_encomendas.values():
                id_estafeta = encomenda.get_id_estafeta()
                if id_estafeta != None and encomenda.get_chegou_ao_destino() and encomenda.get_atraso()<=0:
                    if id_estafeta in encomendas_por_estafeta:
                        encomendas_por_estafeta[id_estafeta] += 1
                    else:
                        encomendas_por_estafeta[id_estafeta] = 1

        estafetas_ordenados = sorted(encomendas_por_estafeta.items(), key=lambda x: x[1], reverse=True) #.items() transforma o dicionário em lista de pares (key,value), x[1] vai buscar o segundo elemento
        
        for id, encomendas in estafetas_ordenados:
            with self.lock_estafetas:    
                estafeta = self.dict_estafetas.get(id)
            if estafeta is not None:
                estafeta.imprime(5,encomendas)
