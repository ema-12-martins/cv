{- |
Module      : Tarefa5_2022li1g025
Description : Retira a última linha do novo mapa
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização da Tarefa 5 do projeto de LI1 em 2022/23.
-}
module Tarefa5_2022li1g025 where

import LI12223
import Tarefa2_2022li1g025-- Porque precisamos de funcao estendeMapa

{-|
__deslizaJogo __ 
Atualiza o mapa, retirando a ultima linha.
-}

deslizaJogo :: Int -> Int -> Jogo -> Jogo
deslizaJogo aleatorio r2 (Jogo (Jogador (x,y)) (Mapa largura lista)) = Jogo (Jogador (x,y+1)) (estendeMapa (Mapa largura (init lista)) aleatorio r2)  