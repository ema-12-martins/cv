{- |
Module      : Tarefa1_2022li1g025_Spec
Description : Testes da validação de um mapa
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização dos testes da Tarefa 1 do projeto de LI1 em 2022/23.
-}
module Tarefa1_2022li1g025_Spec where

import LI12223
import Tarefa1_2022li1g025
import Test.HUnit

{-| 
__Teste1__
Neste caso o mapa fornecido é válido.
-}

{-| 
__Teste2__
Mapa incorreto pois temos uma Arvore no local de uma Estrada.
-}

{-|
__Teste3__
Neste caso rios contíguos têm sentidos opostos.
-} 

{-|
__Teste4__
Neste caso, os 2 primeiros rios tem sentidos iguais.
-}

{-|
__Teste5__
Neste caso temos mais de 5 troncos seguidos.
-}

{-|
__Teste6__
Neste caso temos mais de 3 carros seguidos.
-}

{-|
__Teste7__
Neste caso temos uma linha do mapa que não têm nenhum obstáculo Nenhum
-}

{-|
__Teste8__
Neste caso, todas as linhas do mapa que têm um obstáculo Nenhum
-}

{-|
__Teste9__
Neste caso temos uma linha do mapa que não tem um número de obstáculos por linha igual igual à largura do mapa. 
-}

{-|
__Teste10__
Neste caso temos mais de 4 rios contíguos.
-}

{-|
__Teste11__
Neste caso temos mais de 5 estradas contíguas.
-}

testsT1 :: Test
testsT1 = TestLabel "Testes Tarefa 1" $ test [
    "Teste 1" ~: True ~=? mapaValido (Mapa 5 [(Relva, [Arvore,Nenhum,Nenhum,Arvore,Arvore]),
                                              (Estrada 2, [Carro,Carro,Nenhum,Carro,Nenhum])]),
                                              
    "Teste 2" ~: False ~=? mapaValido (Mapa 5 [(Relva, [Arvore,Carro,Nenhum,Arvore,Arvore]), --1a
                                              (Estrada 2, [Carro,Carro,Nenhum,Carro,Nenhum])]),

    "Teste 3" ~: True ~=? mapaValido (Mapa 5 [(Rio 2, [Tronco,Tronco,Nenhum,Tronco,Tronco]), --1b
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (2), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada 2, [Carro,Nenhum,Nenhum,Carro,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum])]),

    "Teste 4" ~: False ~=? mapaValido (Mapa 5 [(Rio 2, [Tronco,Tronco,Nenhum,Tronco,Tronco]), --1b
                                              (Rio 1, [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (2), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada 2, [Carro,Nenhum,Nenhum,Carro,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum])]), 
                                            
    "Teste 5" ~: False ~=? mapaValido (Mapa 7 [(Rio 2, [Tronco,Tronco,Tronco,Tronco,Tronco,Nenhum,Tronco]), --1c
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada (2), [Carro,Carro,Nenhum,Carro,Nenhum,Nenhum,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum,Nenhum]),
                                              (Relva, [Arvore,Nenhum,Nenhum,Arvore,Nenhum,Arvore,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco,Nenhum])]),

    "Teste 6" ~: False ~=? mapaValido (Mapa 6 [(Rio 2, [Tronco,Tronco,Tronco,Tronco,Tronco,Nenhum]), --1d
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco]),
                                              (Estrada (2), [Carro,Carro,Carro,Carro,Nenhum,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum]),
                                              (Relva, [Arvore,Nenhum,Nenhum,Arvore,Nenhum,Arvore]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco])]),
 
    "Teste 7" ~: False ~=? mapaValido (Mapa 6 [(Rio 2, [Tronco,Tronco,Tronco,Tronco,Tronco,Tronco]), --1e
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco]),
                                              (Estrada (2), [Carro,Carro,Nenhum,Carro,Nenhum,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum]),
                                              (Relva, [Arvore,Nenhum,Nenhum,Arvore,Nenhum,Arvore]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco])]),
  
    "Teste 8" ~: True ~=? mapaValido (Mapa 5 [(Rio 2, [Tronco,Tronco,Nenhum,Tronco,Tronco]), --1b
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (2), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada 2, [Carro,Nenhum,Nenhum,Carro,Nenhum]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum])]),
    
    "Teste 9" ~: False ~=? mapaValido (Mapa 6 [(Rio 2, [Tronco,Tronco,Tronco,Tronco,Tronco,Nenhum]), --1f
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum]),
                                              (Estrada (2), [Carro,Carro,Nenhum,Carro,Nenhum,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum]),
                                              (Relva, [Arvore,Nenhum,Nenhum,Arvore,Nenhum,Arvore]),
                                              (Rio 2, [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco])]),

    "Teste 10" ~: False ~=? tarefa1g (Mapa 6 [(Rio 2, [Tronco,Tronco,Tronco,Tronco,Tronco,Nenhum]), --1g
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco]),
                                              (Rio (2), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum]),
                                              (Rio (-1), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Nenhum]),
                                              (Rio 2, [Tronco,Nenhum,Nenhum,Tronco,Nenhum,Tronco]),
                                              (Rio (-2), [Tronco,Tronco,Nenhum,Tronco,Nenhum,Tronco])]),

    "Teste 11" ~: False ~=? tarefa1g (Mapa 6 [(Estrada 2, [Carro,Carro,Nenhum,Carro,Carro,Nenhum]), --1g
                                              (Estrada (-1), [Carro,Carro,Nenhum,Carro,Nenhum,Carro]),
                                              (Estrada (2), [Carro,Carro,Nenhum,Carro,Nenhum,Nenhum]),
                                              (Estrada (-1), [Carro,Carro,Nenhum,Carro,Nenhum,Nenhum]),
                                              (Estrada 2, [Carro,Nenhum,Nenhum,Carro,Nenhum,Carro]),
                                              (Estrada (-1), [Carro,Carro,Nenhum,Carro,Nenhum,Carro])])
    ]
