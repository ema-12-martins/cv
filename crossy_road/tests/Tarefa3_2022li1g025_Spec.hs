{- |
Module      : Tarefa3_2022li1g025_Spec
Description : Testes da movimentação do personagem e obstáculos
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização dos testes da Tarefa 3 do projeto de LI1 em 2022/23.
-}
module Tarefa3_2022li1g025_Spec where

import LI12223
import Tarefa3_2022li1g025
import Test.HUnit

{-|
__Teste 1__
Verifica se os obstáculos andam conforme a velocidade e direção do terreno onde estão.
-}

{-|
__Teste 2__
Verifica que o Jogador efetua o movimento dado.
-}

{-|
__Teste 3__
Verifica que, se a jogada dada ultrapassar os limites do mapa, o movimento não é feito.
-}

{-|
__Teste 4__
Verifica que, se o jogador estiver em cima de um Tronco e não se movimentar, a sua posição será alterada em conformidade com o movimento do Tronco.
-}

testsT3 :: Test
testsT3 = TestLabel "Testes Tarefa 3" $ test [

    "Teste 1" ~:(Mapa 3 [(Estrada (-1),[Carro,Nenhum,Nenhum]),(Rio 1, [Nenhum,Tronco,Nenhum])]) ~=? tarefa3a (Jogador (0,0)) (Mapa 3 [(Estrada (-1),[Nenhum,Carro,Nenhum]),(Rio 1, [Tronco,Nenhum,Nenhum])]),

    "Teste 2" ~: (Jogo (Jogador (0,1)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum]),(Relva, [Arvore,Nenhum])])) ~=? 
    animaJogo (Jogo (Jogador (0,2)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum]),(Relva, [Arvore,Nenhum])])) (Move Cima),
     
    "Teste 3" ~: (Jogo (Jogador (0,2)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum]),(Relva, [Arvore,Nenhum])])) ~=? 
    animaJogo (Jogo (Jogador (0,2)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum]),(Relva, [Arvore,Nenhum])])) (Move Baixo),

    "Teste 4" ~: (Jogo (Jogador (1,2)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum]),(Rio 1, [Nenhum,Tronco])])) ~=? 
    animaJogo (Jogo (Jogador (0,2)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum]),(Rio 1, [Tronco,Nenhum])])) (Parado)
    ]
