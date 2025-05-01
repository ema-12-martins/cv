{- |
Module      : Tarefa4_2022li1g025
Description : Determinar se o jogo terminou
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização da Tarefa 4 do projeto de LI1 em 2022/23.
-}
module Tarefa4_2022li1g025 where

import LI12223

{-|
 __foradoMapa__
 A função "foradomapa" verifica se o jogador está nos limites do mapa
 -}
foradoMapa:: Jogo -> Bool
foradoMapa (Jogo (Jogador (x,y)) (Mapa largura l)) | 0<=x && x<largura && 0<=y && y<length l = False
                                                   | otherwise = True  

{-|
 __naAguaouCarro__
 A função "naAguaouCarro" verifica se o jogador caiu na água ou foi contra um carro 
 -}
naAguaouCarro:: Jogo -> Bool
naAguaouCarro (Jogo (Jogador (x,y)) (Mapa largura ((Relva,(obs:z)):t))) | y>0 = naAguaouCarro ((Jogo (Jogador (x,y-1)) (Mapa largura (t))))
                                                                        | otherwise = False
naAguaouCarro (Jogo (Jogador (x,y)) (Mapa largura ((Estrada v1,(obs:z)):t)))  | y==0 && x==0 && obs == Carro = True 
                                                                              | y==0 && x==0 && obs == Nenhum = False
                                                                              | y>0 = naAguaouCarro ((Jogo (Jogador (x,y-1)) (Mapa largura (t))))
                                                                              | x>0 = naAguaouCarro ((Jogo (Jogador (x-1,y)) (Mapa largura ((Estrada v1,z):t))))                                                                
naAguaouCarro (Jogo (Jogador (x,y)) (Mapa largura ((Rio v1,(obs:z)):t))) | y==0 && x==0 && obs == Nenhum = True 
                                                                         | y==0 && x==0 && obs == Tronco = False
                                                                         | y>0 = naAguaouCarro ((Jogo (Jogador (x,y-1)) (Mapa largura (t))))
                                                                         | x>0 = naAguaouCarro ((Jogo (Jogador (x-1,y)) (Mapa largura ((Rio v1,z):t))))
naAguaouCarro (Jogo (Jogador (x,y)) (Mapa largura ((Rio v1,[]):t))) = False
naAguaouCarro (Jogo (Jogador (x,y)) (Mapa largura ((Estrada v1,[]):t))) = False 

{-|
 __jogoTerminou__
 A função "jogoTerminou" verifica se o jogador está nos limites do mapa (usando a "foradoMapa") e também se não caiu na agua ou foi contra um carro (usando a "naAguaouCarro") 
 -}
jogoTerminou :: Jogo -> Bool
jogoTerminou (Jogo (Jogador (x,y)) (Mapa largura l)) = foradoMapa (Jogo (Jogador (x,y)) (Mapa largura l)) || naAguaouCarro (Jogo (Jogador (x,y)) (Mapa largura l)) 
                
