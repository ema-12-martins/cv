{- |
Module      : Tarefa2_2022li1g025
Description : Geração contínua de um mapa
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização da Tarefa 2 do projeto de LI1 em 2022/23.
-}
module Tarefa2_2022li1g025 where

import LI12223
import Tarefa1_2022li1g025-- Porque precisamos de funcao aux1g

------------------------------------------------------------Escolhe o Terreno------------------------------------------------

{-|
__ terreno1 __ 
Auxiliar da função "numero" que vê se o número random se encontra dentro do tamanho da lista dos terrrenos.
-}
terreno1 :: Int -> Int -> Int -> Mapa -> Terreno
terreno1 n r1 r2 mapa | n>=length (listaTerrenos) = terreno1 (n-1) r1 r2 mapa
                      | otherwise = (listaTerrenos !! n)
                        where listaTerrenos= proximosTerrenosValidos mapa r1 r2

{-|
__ numero2 __ 
Escolhe um terreno para estender o mapa.
-}
numero :: Mapa -> Int -> Int -> Terreno
numero (Mapa largura lista) num r2 | random1 == 0 = terreno1 0 num r2 (Mapa largura lista)
                                   | random1 == 1 = terreno1 1 num r2 (Mapa largura lista)
                                   | random1 == 2 = terreno1 2 num r2 (Mapa largura lista)
                                     where random1 = (mod (num+length (lista)) 3)
                                 
------------------------------------------------------------Escolhe os Obstaculos------------------------------------------------


{-|
__ obstaculo1 __ 
Auxiliar da função "mergenumero2" que verifica se o número se encontra dentro do tamanho da lista obstáculos.
-}
obstaculo1 :: Int -> Mapa -> Terreno -> Obstaculo
obstaculo1 n (Mapa largura lista) terreno| n>=length (listaObstaculos) = obstaculo1 (n-1) (Mapa largura lista) terreno
                                         | otherwise = (listaObstaculos !! n) 
                                         where listaObstaculos= (proximosObstaculosValidos largura (terreno,[]))
 
{-|
__ numero2 __ 
Auxiliar da função "mergenumero2" escolhe o número random.
-}
numero2 :: Mapa -> Int -> Terreno -> Obstaculo
numero2 (Mapa largura lista) num terreno | random1 == 0 = obstaculo1 0 (Mapa largura lista) terreno
                                         | random1 == 1 = obstaculo1 1 (Mapa largura lista) terreno
                                         | random1 == 2 = obstaculo1 2 (Mapa largura lista) terreno
                                         | random1 == 3 = obstaculo1 2 (Mapa largura lista) terreno
                                         | random1 == 4 = obstaculo1 2 (Mapa largura lista) terreno
                                          where random1 = (mod num 5)

{-|
__ mergenumero2 __ 
Escolhe obstaculos para formar uma nova linha, dado um terreno.
-}
mergenumero2 :: Mapa -> Int -> Int -> Terreno -> [Obstaculo]
mergenumero2 mapa random largura terreno | largura > 0 = ((numero2 mapa random terreno) : (mergenumero2 mapa (random+1) (largura-1) terreno))  
                                         | otherwise = []

{-|
__ estendeMapa __ 
Atualiza o mapa, colocando uma nova linha em cima.
-}
estendeMapa :: Mapa -> Int -> Int -> Mapa
estendeMapa (Mapa i lista) num r2 = let terreno=(numero (Mapa i lista) num r2)
                                        novaLinha = (mergenumero2 (Mapa i lista) num i terreno)
                                    in if mapaValido (Mapa i [(terreno,novaLinha)]) 
                                        then (Mapa i ([(terreno,novaLinha)]++lista))
                                        else (Mapa i ([(terreno,[Nenhum]++(tail novaLinha))]++lista))
                                
{-|
__ proximosTerrenosValidos __ 
Vê quais são os próximos terrenos possíveis, tendo em consideração que não podemos ter mais de 4 rios nem 5 estradas consecutivas.
-}
proximosTerrenosValidos:: Mapa -> Int -> Int -> [Terreno] -- a funcao auxiliar esta presente na tarefa 1
proximosTerrenosValidos (Mapa _ []) r1 r2 = let sentido = (mod r2 2)
                                                vel = if sentido==0 then (mod r1 5) else (-1)*(mod r1 5)
                                            in [Estrada vel,Relva,Rio vel]
proximosTerrenosValidos (Mapa num ((Rio v1,l):t)) r1 r2 = let sentido = (mod r2 2)
                                                              vel = if sentido==0 then (mod r1 5) else (-1)*(mod r1 5)
                                                          in if aux1g 1 (Rio v1) t >= 4 then [Estrada vel,Relva] else proximosTerrenosValidos (Mapa num t) r1 r2
proximosTerrenosValidos (Mapa num ((Estrada v1,l):t)) r1 r2 = let sentido = (mod r2 2)
                                                                  vel = if sentido==0 then (mod r1 5) else (-1)*(mod r1 5)
                                                              in if aux1g 1 (Estrada v1) t >= 5 then [Rio vel,Relva] else  proximosTerrenosValidos (Mapa num t) r1 r2
proximosTerrenosValidos (Mapa num ((Relva,l):t)) r1 r2 = let sentido = (mod r2 2)
                                                             vel = if sentido==0 then (mod r1 5) else (-1)*(mod r1 5)
                                                         in if aux1g 1 Relva t >= 5 then [Rio vel,Estrada vel] else proximosTerrenosValidos (Mapa num t) r1 r2
                                                                                                       

{-|
__ aux2b __
Auxiliar da função "proximosObstaculos" que vê se não é excedido o tamanho dos carros.
-}
aux2b :: Terreno -> [Obstaculo] -> Int -> Int -> [Obstaculo]
aux2b (Rio v1) [] cont1 cont2 = [Nenhum,Tronco]
aux2b (Rio v1) (x:y) cont1 cont2 | x==Tronco && (cont1+1)>4 && (length (x:y)) == 1 = [Nenhum]
                                 | x==Tronco && (cont1+1)>4 && (length (x:y)) /= (cont2+1) = aux2b (Rio v1) y (cont1+1) (cont2+2)
                                 | x==Tronco && (cont1+1)<=4 = aux2b (Rio v1) y (cont1+1) (cont2+1)
                                 | otherwise = aux2b (Rio v1) y 0 (cont2+1)
aux2b (Estrada v1) [] cont1 cont2 = [Nenhum,Carro]
aux2b (Estrada v1) (x:y) cont1 cont2 | x==Carro && (cont1+1)>2 && (length (x:y)) == 1 = [Nenhum]
                                     | x==Carro && (cont1+1)>2 && (length (x:y)) /= (cont2+1) = aux2b (Estrada v1) y (cont1+1) (cont2+2)
                                     | x==Carro && (cont1+1)<=2 = aux2b (Estrada v1) y (cont1+1) (cont2+1)
                                     | otherwise = aux2b (Estrada v1) y 0 (cont2+1)

{-| 
__ proximosObstaculosValidos __ 
Vê quais são os próximos obstáculos possíveis tendo em conta o terreno que vamos acrescentar ao mapa. Tendo em consideração 
que não podemos ter mais de 5 troncos nem 3 carros consecutivas, utiliza-se a função auxiliar "aux2b" para verificar essas condições.
-}
proximosObstaculosValidos :: Int -> (Terreno, [Obstaculo]) -> [Obstaculo]
proximosObstaculosValidos num (Rio v1,l) | num == length l = [] 
                                         | length l < 5 = [Nenhum,Nenhum,Tronco,Nenhum,Nenhum]
                                         | otherwise = aux2b (Rio v1) l 0 0
proximosObstaculosValidos num (Estrada v1,l) | num == length l = [] 
                                             | length l < 3 = [Carro,Nenhum,Nenhum,Nenhum,Nenhum]
                                             | otherwise = aux2b (Estrada v1) l 0 0
proximosObstaculosValidos num (Relva,l) | num == length l = []
                                        | otherwise = [Arvore,Nenhum,Nenhum,Nenhum,Nenhum]

