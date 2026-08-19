import threading

class Encomenda:
    gera_ids = 1

    def __init__(self, peso, volume, tempo):
        self.id = Encomenda.gera_ids
        Encomenda.gera_ids += 1
        self.peso = peso
        self.volume = volume
        self.tempo = tempo
        self.preco=None

        self.lock_encomenda = threading.Lock()

        #Entrega da encomenda
        self.id_estafeta = None
        self.tempo_previsto=0 #Tempo que se calculou para a entrega da encomenda
        self.tempo_que_percorreu=0 #Tempo que passou desde que se pediu a encomenda
        self.tempo_total_viagem=0 #Tempo de ida e volta
        self.tempo_transporte=0 #Tempo de viagem que ainda falta fazer
        self.caminho=[]
        self.ultimo_local_passou="Armazem"
        self.velocidades_medias=[]
        self.chegou_ao_destino = False
        self.destino = None
        
    def __str__(self):
        with self.lock_encomenda:
            return f"ID: {self.id}, Peso: {self.peso}, Volume: {self.volume}, Tempo máximo: {self.tempo}, Preço: {self.preco}, Id do Estafeta: {self.id_estafeta},\nEncomenda Entregue: {self.chegou_ao_destino}, Último Local: {self.ultimo_local_passou}, Caminho: {self.caminho},\nTempo para entrega previsto: {self.tempo_previsto}, Tempo total decorrido: {self.tempo_que_percorreu}, Tempo previsto da viagem: {self.tempo_total_viagem}, Tempo que ainda falta percorrer: {self.tempo_transporte}\n"

    def get_id_estafeta(self):
        with self.lock_encomenda:
            return self.id_estafeta

    def get_caminho(self):
        with self.lock_encomenda:
            return self.caminho

    def get_tempo_transporte(self):
        with self.lock_encomenda:
            return self.tempo_transporte
        
    def get_tempo_total_viagem(self):
        with self.lock_encomenda:
            return self.tempo_total_viagem
        
    def get_tempo_que_percorreu(self):
        with self.lock_encomenda:
            return self.tempo_que_percorreu
        
    def get_atraso(self):
        with self.lock_encomenda:
            if self.chegou_ao_destino:
                atraso = self.tempo_que_percorreu - self.tempo_previsto
                if atraso<0:
                    atraso = 0
                return atraso
            else:
                return None
        
    def get_chegou_ao_destino(self):
        with self.lock_encomenda:
            return self.chegou_ao_destino
    
    def get_preco(self):
        with self.lock_encomenda:
            if self.preco != None:
                return self.preco
            else:
                return -1
            
    def get_ultimo_local_passou(self):
        with self.lock_encomenda:
            return self.ultimo_local_passou
    
    def aumenta_tempo_que_percorreu(self):
        with self.lock_encomenda:
            self.tempo_que_percorreu += 1

    def get_posicao(self,grafo,grafo_cortadas):
        tempo_acumulado=0
        posicao=0
        ultimo_lugar=None
        
        with self.lock_encomenda:
            while(tempo_acumulado<=(self.tempo_total_viagem-self.tempo_transporte) and posicao + 1 < len(self.caminho)):
                try:
                    distancia=grafo[self.caminho[posicao]][self.caminho[posicao+1]]['weight']
                except:
                    distancia=grafo_cortadas[self.caminho[posicao]][self.caminho[posicao+1]]['weight']
                    
                tempo_aresta=(distancia/self.velocidades_medias[posicao])*60
                tempo_acumulado+=tempo_aresta
                posicao+=1
            
            ultimo_lugar = self.caminho[posicao-1] if posicao > 0 else "Armazem"

        return ultimo_lugar
    
    def calcula_preco(self,meio_transporte, eletrico, distancia):
        preco=0

        if(self.tempo<20):
            preco+=5
        elif(self.tempo<40):
            preco+=4
        elif(self.tempo<60):
            preco+=3
        elif(self.tempo<80):
            preco+=2
        elif(self.tempo<100):
            preco+=1

        if (self.peso<=10):
            preco+=0.5
        elif(self.peso<=25):
            preco+=1
        else:
            preco+=1.5

        if (self.volume<=5):
            preco+=0.5
        elif (self.volume<=10):
            preco+=1
        else:
            preco+=1.5

        if (meio_transporte==1 and eletrico==False):
            preco+=0.05*distancia
        elif (meio_transporte==1 and eletrico==True):
            preco+=0.1*distancia
        elif (meio_transporte==2 and eletrico==False):
            preco+=0.15*distancia
        elif (meio_transporte==2 and eletrico==True):
            preco+=0.2*distancia
        elif (meio_transporte==3 and eletrico==False):
            preco+=0.25*distancia
        elif (meio_transporte==3 and eletrico==True):
            preco+=0.3*distancia
        else:
            preco=0
        return preco

    def atualiza_encomenda_inicio(self,tempo,tempo_necessario,velocidades_medias,caminho,id_estafeta,veiculo,eletrico,distancia):
        with self.lock_encomenda:
            self.id_estafeta = id_estafeta
            self.ultimo_local_passou="Armazem"
            self.tempo_transporte=tempo
            self.tempo_total_viagem=tempo
            self.tempo_previsto=tempo_necessario
            self.tempo_que_percorreu=0
            self.caminho=caminho
            self.velocidades_medias=velocidades_medias
            self.chegou_ao_destino=False
            self.destino = caminho[int((len(caminho)-1)/2)]
            self.preco=self.calcula_preco(veiculo,eletrico,distancia)

    def atualiza_encomenda_meio(self,posicao):
        with self.lock_encomenda:
            if self.tempo_transporte!=0:
                self.tempo_transporte-=1
                self.ultimo_local_passou=posicao
                if self.chegou_ao_destino == False and posicao==self.destino:
                    self.destino = "Armazem"
                    self.chegou_ao_destino = True
                    return 0
                
            else:
                self.ultimo_local_passou="Armazem"
                return -2

        return -1
