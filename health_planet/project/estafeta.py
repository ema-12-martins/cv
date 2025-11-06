from queue import Queue
import threading

class Estafeta:
    gera_ids=1
    def __init__(self,nome,meio_de_transporte,eletrico):
        self.id=Estafeta.gera_ids
        Estafeta.gera_ids+=1
        self.nome=nome
        self.meio_de_transporte=meio_de_transporte
        self.eletrico=eletrico
        self.soma_classificacoes = 0
        self.n_viagens = 0

        self.lock_estafeta = threading.Lock()

        #Guarda as encomendas que estão em espera
        self.fila_encomendas = Queue()  # Mapa de encomendas com ID como chave

        #Cenas para o avancar no tempo
        self.pausa=0
        self.encomenda_atual = None

    #toString
    def __str__(self):
        meio_transporte = ""
        if self.meio_de_transporte == 1:
            meio_transporte = "Bicicleta"
        elif self.meio_de_transporte == 2:
            meio_transporte = "Moto"
        elif self.meio_de_transporte == 3:
            meio_transporte = "Carro"

        with self.lock_estafeta:
            return f"ID: {self.id}, Nome: {self.nome}, Meio de Transporte: {meio_transporte}, Elétrico: {self.eletrico}, Classificação: {self.calcula_classificacao()}\n Encomenda: {self.encomenda_atual}"
        
    def imprime(self, tipo, valor):
        with self.lock_estafeta:
            if tipo == 1:
                print(f"ID: {self.id}, Nome: {self.nome}, Tempo médio de entrega: {valor}")
            elif tipo == 2:
                print(f"ID: {self.id}, Nome: {self.nome}, Tempo médio de atraso: {valor}")
            elif tipo == 3:
                print(f"ID: {self.id}, Nome: {self.nome}, Classificação: {self.calcula_classificacao()}")
            elif tipo == 4:
                print(f"ID: {self.id}, Nome: {self.nome}, Encomendas efetuadas: {valor}")
            elif tipo == 5:
                print(f"ID: {self.id}, Nome: {self.nome}, Encomendas efetuadas sem atrasos: {valor}")
    
    #Gets
    def get_encomenda_atual(self):
        with self.lock_estafeta:
            return self.encomenda_atual
        
    def get_nr_encomendas_fila(self):
        with self.lock_estafeta:    
            copia_fila = list(self.fila_encomendas.queue)
            return len(copia_fila)
        
    def get_classificacao(self):
        with self.lock_estafeta:
            return self.calcula_classificacao()

    #Calculos
    def calcula_classificacao(self):
        if self.n_viagens == 0:
            return 5.0
        else:
            return self.soma_classificacoes/self.n_viagens

    def calcula_tempo_ate_disponivel(self):
        tempo_acumulado = 2 #Margem para a entrega que está a ser pedida
        with self.lock_estafeta:
            tempo_acumulado += self.pausa
            if self.encomenda_atual is not None:
                tempo_acumulado += self.encomenda_atual.get_tempo_transporte()
                tempo_acumulado += 2 #Margem entrega atual
            copia_fila = list(self.fila_encomendas.queue)
        for encomenda in copia_fila:
            tempo_acumulado += encomenda.get_tempo_total_viagem()
            tempo_acumulado += 2 #Margem por entrega
        return tempo_acumulado
    
    #Queue
    def push_encomenda(self, encomenda):
        self.fila_encomendas.put(encomenda)

    def pop_encomenda(self):
        if not self.fila_encomendas.empty():
            encomenda = self.fila_encomendas.get()
            return encomenda
        else:
            return None

    def ver_encomendas_em_fila(self):
        with self.lock_estafeta:    
            copia_fila = list(self.fila_encomendas.queue)
        for encomenda in copia_fila:
            print(encomenda)

    #Tempo
    def aumenta_pausa(self, atraso):
        with self.lock_estafeta:
            self.pausa += atraso

    def atualiza_estafeta_inicio(self,encomenda):
        with self.lock_estafeta:
            if self.encomenda_atual is None and self.fila_encomendas.empty():
                self.encomenda_atual = encomenda
            else:
                self.push_encomenda(encomenda)

    def atualiza_estafeta_meio(self,posicao):
        with self.lock_estafeta:
            if self.pausa>0:
                self.pausa-=1
            else:
                if (valor:=self.encomenda_atual.atualiza_encomenda_meio(posicao))==0:
                    return True
                elif valor==-2:
                    self.encomenda_atual = None
        return False

    def comecar_nova_encomenda (self):
        with self.lock_estafeta:
            if self.pausa>0:
                self.pausa-=1
            self.encomenda_atual = self.pop_encomenda()


    def atualiza_classificacao (self,atraso,classificacao):
        with self.lock_estafeta:
            if atraso > 0:
                self.n_viagens+=1
                atraso = atraso-5 #Tolerância de 5 minutos para atrasos
                if atraso<0:
                    atraso=0
                classificacao_nova = classificacao-(atraso*0.05)
                if classificacao_nova<0:
                    classificacao_nova=0
                self.soma_classificacoes+=classificacao_nova
            else:
                self.n_viagens+=1
                self.soma_classificacoes+=classificacao
            return self.calcula_classificacao()
        
