{- |
Module      : Tarefa3_2022li1g025
Description : Movimentação do personagem e obstáculos
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização da Tarefa 3 do projeto de LI1 em 2022/23.
-}
module Tarefa3_2022li1g025 where

import LI12223

{-| 
__ aux3a __
Função auxiliar da "tarefa3a".
Faz o movimento dos troncos e Carros através da combinação dos drops e takes.
No caso de um Carro atropelar o jogador, retorna a o mapa no momento do atropelamento.
-}
aux3a :: Jogador-> Int -> [Obstaculo] -> [Obstaculo] 
aux3a (Jogador (x,y)) vel lista | vel==0 || onCar x lista = lista
                                | vel>0 = aux3a (Jogador (x,y)) (vel-1) ((drop (length lista-1) lista)++(take (length lista-1) lista))
                                | otherwise = aux3a (Jogador (x,y)) (vel+1) ((drop 1 lista)++(take 1 lista))
                                where onCar x (h:t) | x==0 = h==Carro
                                                    | otherwise = onCar (x-1) t 
{-| 
__ aux3a1 __
Função auxiliar da "tarefa3a".
Chama a função "aux3a" para os Rios e Estradas.
-}
aux3a1 :: Mapa -> Jogador-> [(Terreno,[Obstaculo])]
aux3a1 (Mapa _ []) jogador = []
aux3a1 (Mapa num ((Estrada v1,l):t)) jogador = (Estrada v1,(aux3a jogador v1 l)): aux3a1 (Mapa num t) jogador
aux3a1 (Mapa num ((Rio v1,l):t)) jogador = (Rio v1,(aux3a jogador v1 l)): aux3a1 (Mapa num t) jogador
aux3a1 (Mapa num ((Relva,l):t)) jogador = (Relva,l): aux3a1 (Mapa num t) jogador

{-|
 __tarefa3a__
 A função "tarefa3a" põem os obstáculos do rio (tronco) e da estrada (carro) a andar com a velocidade e direção do terreno onde estão. 
 Utiliza para isso a "aux3a1" e a "aux3a". 
 -}
tarefa3a :: Jogador -> Mapa -> Mapa
tarefa3a jogador (Mapa num []) = (Mapa num (aux3a1 (Mapa num []) jogador))
tarefa3a jogador (Mapa num ((Estrada v1,l):t)) = (Mapa num (aux3a1 (Mapa num ((Estrada v1,l):t)) jogador))
tarefa3a jogador (Mapa num ((Rio v1,l):t)) = (Mapa num (aux3a1 (Mapa num ((Rio v1,l):t)) jogador))
tarefa3a jogador (Mapa num ((Relva,l):t)) = (Mapa num (aux3a1 (Mapa num ((Relva,l):t)) jogador))

{-| 
__ aux3csegunda __
Função auxiliar da "tarefa3c".
Faz a movimentação do Jogador.
-}
aux3csegunda :: [Obstaculo] -> Jogador -> Int -> Int -> Jogador 
aux3csegunda ((Tronco):t) (Jogador (x,y)) contador vel | contador==x = (Jogador (x+vel,y)) 
                                                       | otherwise = (Jogador (x,y)) 
aux3csegunda (h:t) (Jogador (x,y)) contador vel | contador==x = (Jogador (x,y)) 
                                                | otherwise = aux3csegunda t (Jogador (x,y)) (contador+1) vel

{-| 
__ aux3c __
Função auxiliar da "tarefa3c".
Chama a função "aux3csegunda" para os Rios.

-}
aux3c :: (Terreno,[Obstaculo]) -> Jogador -> Jogador
aux3c (Rio vel,l) (Jogador (x,y))  = aux3csegunda l (Jogador (x,y)) 0 vel
aux3c (ter,l) (Jogador (x,y)) = (Jogador (x,y))

{-|
 __tarefa3c__
 A função "tarefa3c" poem o jogador a se movimentar com o tronco (no caso de estar em cima dele e estar parado).
 Utiliza as funções "aux3c" e "aux3csegunda".
 -}
tarefa3c :: Mapa -> Int -> Jogador -> Jogador
tarefa3c (Mapa largura [z]) contador (Jogador (x,y)) = aux3c z (Jogador (x,y))
tarefa3c (Mapa largura (h:t)) contador (Jogador (x,y)) | contador==y = aux3c h (Jogador (x,y))
                                                       | otherwise = tarefa3c (Mapa largura t) (contador+1) (Jogador (x,y))

{-|
 __tarefa3d__
 A função "tarefa3d" não deixa o jogador ultrapassar os limites do mapa.
 -}

tarefa3d :: Jogo -> Jogada -> Jogo
tarefa3d  (Jogo (Jogador (x,y)) (Mapa largura l)) Parado = (Jogo (Jogador (x,y)) (Mapa largura l))
tarefa3d  (Jogo (Jogador (x,y)) (Mapa largura l)) (Move Cima) | y == 0 = (Jogo (Jogador (x,y)) (Mapa largura l))
                                                              | otherwise = (Jogo (Jogador (x,y-1)) (Mapa largura l))

tarefa3d  (Jogo (Jogador (x,y)) (Mapa largura l)) (Move Baixo) | y == (largura-1) = (Jogo (Jogador (x,y)) (Mapa largura l))
                                                               | otherwise = (Jogo (Jogador (x,y+1)) (Mapa largura l))

tarefa3d  (Jogo (Jogador (x,y)) (Mapa largura ((terreno,obs):t))) (Move Direita) | x == (length obs-1) = (Jogo (Jogador (x,y)) (Mapa largura ((terreno,obs):t)))
                                                                                 | otherwise = (Jogo (Jogador (x+1,y)) (Mapa largura ((terreno,obs):t)))

tarefa3d  (Jogo (Jogador (x,y)) (Mapa largura ((terreno,obs):t))) (Move Esquerda) | x == 0 = (Jogo (Jogador (x,y)) (Mapa largura ((terreno,obs):t)))
                                                                                  | otherwise = (Jogo (Jogador (x-1,y)) (Mapa largura ((terreno,obs):t)))


{-| 
__ aux3 __
Função auxiliar da "animajogo".
Faz a orientação da chamada das várias funções auxiliares.
-}
aux3 :: Jogo -> Jogada -> Int -> Jogo
aux3 (Jogo jogador mapa) jogada contador | contador == 0 = aux3 (Jogo jogador mapa) (verArvores (Jogo jogador mapa) jogada) 1
                                         | contador == 1 = aux3 (Jogo (tarefa3c mapa 0 jogador) mapa) jogada 2
                                         | contador == 2 = aux3 (Jogo jogador (tarefa3a jogador mapa)) jogada 3
                                         | contador == 3 = (tarefa3d (Jogo jogador mapa) jogada)

{-|
--arvores--
Vẽ se na posição do jogador temos um tronco
-}
arvores :: [Obstaculo] -> Int -> Bool
arvores [] _ = False
arvores listaObstaculos x = (listaObstaculos !! x)==Arvore

{-|
--auxVerArvores--
Vẽ se posicao y do jogador e chama a função tronco para ver a posição x.
-}
auxverArvores :: (Int,Int) -> [(Terreno,[Obstaculo])] -> Bool
auxverArvores (x,y) [] = False 
auxverArvores (x,y) listaLinhas = arvores listaObstaculos x   
                                 where (terreno, listaObstaculos) = (listaLinhas !! y)
                                              

{-|
--verLimites--
-}
verLimites :: (Int, Int) -> Mapa -> Bool
verLimites (x,y) (Mapa largura obstaculo) = (x>(-1)) && (x<(largura)) && (y>(-1)) && (y<(length obstaculo))

{-|
--verArvores--
Vê se a jogada coloca o jogador em cima de uma arvore, impedindo que isso aconteça.
-}
verArvores :: Jogo -> Jogada -> Jogada
verArvores jogo Parado = Parado
verArvores (Jogo (Jogador (x,y)) mapa@(Mapa largura listaLinhas)) (Move Cima) = if verLimites (x,y-1) mapa then (if auxverArvores (x,y-1) listaLinhas then Parado else (Move Cima)) else Parado
verArvores (Jogo (Jogador (x,y)) mapa@(Mapa largura listaLinhas)) (Move Baixo) = if verLimites (x,y+1) mapa then (if auxverArvores (x,y+1) listaLinhas then Parado else (Move Baixo)) else Parado
verArvores (Jogo (Jogador (x,y)) mapa@(Mapa largura listaLinhas)) (Move Direita) = if verLimites (x+1,y) mapa then  (if auxverArvores (x+1,y) listaLinhas then Parado else (Move Direita)) else Parado
verArvores (Jogo (Jogador (x,y)) mapa@(Mapa largura listaLinhas)) (Move Esquerda) = if verLimites (x-1,y) mapa then (if auxverArvores (x-1,y) listaLinhas then Parado else (Move Esquerda))  else Parado


{-|
 __animajogo__
 A função "animajogo" permite movimentar os obstáculos (de acordo com a velocidade) do terreno em que se encontram, e o personagem, de acordo com a jogada dada.
 No caso de o jogador estar em cima do tronco, as suas coordenadas são atualizadas primeiro do que as coordenadas do tronco (pois as coordenadas do tronco são precisas na função "tarefa3a").
 -}
animaJogo :: Jogo -> Jogada -> Jogo
animaJogo jogo jogada = aux3 jogo jogada 0

{-|
 __animajogo2__
 A função "animajogo" permite movimentar os obstáculos (de acordo com a velocidade) do terreno em que se encontram.
-}
animaJogo2 :: Jogo -> Jogada -> Jogo
animaJogo2 jogo@(Jogo (Jogador (x,y)) mapa) jogada = (tarefa3d jogo (verArvores jogo jogada))  