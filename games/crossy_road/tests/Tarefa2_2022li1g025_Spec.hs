{- |
Module      : Tarefa2_2022li1g025_Spec
Description : Testes da geração contínua de um mapa
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização de testes da Tarefa 2 do projeto de LI1 em 2022/23.
-}
module Tarefa2_2022li1g025_Spec where

import LI12223
import Tarefa2_2022li1g025
import Tarefa1_2022li1g025
import Test.HUnit

{-|
__Teste1__
Verificamos que o novo mapa é válido.
-} 

{-|
__Teste2__
Verificamos que o novo mapa é válido.
-} 

{-|
__Teste3__
Verificamos que o novo mapa é válido.
-} 

{-|
__Teste4__
Verificamos que o novo mapa é válido.
-} 

testsT2 :: Test
testsT2 = TestLabel "Testes Tarefa 2" $ test [

    "Teste 1" ~: True ~=? mapaValido (estendeMapa  (Mapa 5 [(Rio 2, [Tronco,Tronco,Nenhum,Tronco,Tronco])]) 45 76),

    "Teste 2" ~: True ~=? mapaValido (estendeMapa (Mapa 5 [(Rio 2, [Tronco,Tronco,Nenhum,Tronco,Tronco]), --1b
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (2), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada 2, [Carro,Nenhum,Nenhum,Carro,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum])]) 70 80),

    "Teste 3" ~: True ~=? mapaValido (estendeMapa (Mapa 7 [(Rio 2, [Tronco,Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco]), --1c
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada (2), [Carro,Carro,Nenhum,Carro,Nenhum,Nenhum,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum,Nenhum]),
                                              (Relva, [Arvore,Nenhum,Nenhum,Arvore,Nenhum,Arvore,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco,Nenhum])]) 67 23),

    "Teste 4" ~: True ~=? mapaValido (estendeMapa (Mapa 7 [(Rio 2, [Tronco,Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco]), --1c
                                              (Relva, [Arvore,Arvore,Nenhum,Arvore,Nenhum,Arvore,Nenhum]),
                                              (Estrada (2), [Carro,Nenhum,Nenhum,Carro,Carro,Nenhum,Carro]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum,Nenhum]),
                                              (Relva, [Arvore,Nenhum,Nenhum,Arvore,Nenhum,Arvore,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Tronco,Tronco,Nenhum,Tronco,Nenhum])]) 67 12)    
    ]
