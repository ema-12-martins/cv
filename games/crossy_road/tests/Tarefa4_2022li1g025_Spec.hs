{- |
Module      : Tarefa4_2022li1g025_Spec
Description : Testa se o jogo terminou
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização dos testes da Tarefa 4 do projeto de LI1 em 2022/23.
-}
module Tarefa4_2022li1g025_Spec where

import LI12223
import Tarefa4_2022li1g025
import Test.HUnit

{-|
__Teste 1__
Verifica que, se o jogador for para fora do mapa, o jogo termina.
-}

{-|
__Teste 2__
Verifica que, se o jogador cair na água, o jogo termina.
-}

{-|
__Teste 3__
Verifica que, se o jogador for atingido por um carro, o jogo termina.
-}

{-|
__Teste 4__
Verifica que, se o jogador estiver numa posição válida , o jogo continua.
-}

testsT4 :: Test
testsT4 = TestLabel "Testes Tarefa 4" $ test [

    "Teste 1" ~: True ~=? jogoTerminou (Jogo (Jogador (2,2)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum])])),

    "Teste 2" ~: True ~=? jogoTerminou (Jogo (Jogador (1,1)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum])])),

    "Teste 3" ~: True ~=? jogoTerminou (Jogo (Jogador (1,0)) (Mapa 2 [(Estrada 2,[Nenhum,Carro]),(Rio 2, [Tronco,Nenhum])])),
   
    "Teste 4" ~: False ~=? jogoTerminou (Jogo (Jogador (0,1)) (Mapa 2 [(Relva,[Arvore,Nenhum]),(Rio 2, [Tronco,Nenhum])]))
    ]
