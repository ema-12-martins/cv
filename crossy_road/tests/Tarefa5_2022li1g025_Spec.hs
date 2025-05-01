{- |
Module      : Tarefa5_2022li1g025_Spec
Description : Testa a atualização para o novo Mapa.
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização dos testes da Tarefa 5 do projeto de LI1 em 2022/23.
-}
module Tarefa5_2022li1g025_Spec where

import LI12223
import Tarefa1_2022li1g025
import Tarefa5_2022li1g025
import Test.HUnit

{-| 
__Teste1__
Neste caso o mapa fornecido é válido.
-}

testsT5 :: Test
testsT5 = TestLabel "Testes Tarefa 5" $ test [

    "Teste 1" ~: True ~=? let (Jogo jogador mapa) = deslizaJogo 45 70 (Jogo (Jogador (0,3)) (Mapa 5 [(Relva, [Arvore,Nenhum,Nenhum,Arvore,Arvore]),(Estrada 2, [Carro,Carro,Nenhum,Carro,Nenhum])])) in mapaValido mapa]