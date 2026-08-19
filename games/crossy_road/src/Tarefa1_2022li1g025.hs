{- |
Module      : Tarefa1_2022li1g025
Description : Validação de um mapa
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização da Tarefa 1 do projeto de LI1 em 2022/23.
-}
module Tarefa1_2022li1g025 where

import LI12223
import Data.List
 
{-| 
 __ mapaValido __
Verifica se todas as condiçãoes necessárias para um mapa ser válido são verdadeiras. 
Para isso,recorre às funções "tarefa1a", "tarefa1b" , "tarefa1c" , "tarefa1d", "tarefa1e" e "tarefa1f".
-}
mapaValido :: Mapa -> Bool
mapaValido mapa | (tarefa1a mapa)==True && (tarefa1b mapa)==True && (tarefa1c mapa)==True && 
                  (tarefa1d mapa)==True && (tarefa1e mapa)==True && (tarefa1f mapa)==True && (tarefa1g mapa)==True = True
                | otherwise = False

{-|
 __ tarefa1a __
 Verifica se os obstáculos estão nos terrenos que os correspondem.
 -}
tarefa1a :: Mapa -> Bool
tarefa1a (Mapa num []) = True
tarefa1a (Mapa num ((Relva,l):t)) | ((elem Tronco l)||(elem Carro l)) = False
                                  | otherwise = tarefa1a (Mapa num t)
tarefa1a (Mapa num ((Estrada _,l):t)) | ((elem Tronco l)||(elem Arvore l)) = False
                                      | otherwise = tarefa1a (Mapa num t)
tarefa1a (Mapa num ((Rio _,l):t)) | ((elem Arvore l)||(elem Carro l)) = False
                                  | otherwise = tarefa1a (Mapa num t)

{-|
__ tarefa1b __
Verifica se rios contíguos têm direções opostas.
-}

tarefa1b :: Mapa -> Bool
tarefa1b (Mapa num []) = True
tarefa1b (Mapa num [x]) = True
tarefa1b (Mapa num [(Rio v1,l1),(Rio v2,l2)]) | v1<0 && v2<0 = False
                                              | v1>0 && v2>0 = False  
                                              | otherwise = True
tarefa1b (Mapa num ((Rio v1,l1):(Rio v2,l2):t)) | v1<0 && v2<0 = False
                                                | v1>0 && v2>0 = False
                                                | otherwise = tarefa1b (Mapa num ((Rio v2,l2):t))
tarefa1b (Mapa num [x,y]) = True
tarefa1b (Mapa num (x:y)) = tarefa1b (Mapa num y)


{-|
 __ aux1c1 __
Verifica se não existem mais do que 6 Troncos somados entre o inicio e o fim da linha.
Por exemplo: [Tronco,Tronco,Tronco,Nenhum,Tronco,Tronco,Tronco] é uma linha inválida, pois com o movimento do rio eles acabam por ficar os 6 seguidos.
 -}
aux1c1 :: [[Obstaculo]] -> Bool
aux1c1 [] = True
aux1c1 [x] = True
aux1c1 ((Tronco:t):y) | (length (Tronco:t))+(length(last y))>5 = False
                      | otherwise = True
aux1c1 (x:y) = True


{-|
 __ aux1c2 __
Verifica se não existem mais do que 6 Troncos seguidos.
 -}
aux1c2 :: [[Obstaculo]] -> Bool
aux1c2 [] = True
aux1c2 ((Tronco:t):y) | length (Tronco:t)>5 = False
                      | otherwise = aux1c2 y
aux1c2 (x:y) = aux1c2 y

{-|
 __ tarefa1c __
Chama as funções "aux1c1" e a "aux1c2", sendo True se ambas também o forem.
 -}
tarefa1c :: Mapa -> Bool
tarefa1c (Mapa num [])=True
tarefa1c (Mapa num ((_,l):t)) | (aux1c1 lista) && (aux1c2 lista) = True
                              | otherwise = False
                              where lista=group l

{-|
 __ aux1d __
Verifica se não existem mais do que 4 Carros seguidos.
 -}
aux1d :: [Obstaculo] -> Bool
aux1d [a,b,c,d] | a==Carro && b==Carro && c==Carro && d==Carro= False
                | otherwise = True
aux1d (a:b:c:d:t) | a==Carro && b==Carro && c==Carro && d==Carro = False
                  | otherwise = aux1d (b:c:d:t)

{-|
__ tarefa1d __
Chama a função "aux1d" caso a lista de obstáculos seja maior do que 3.
-}
tarefa1d :: Mapa -> Bool
tarefa1d (Mapa num [])=True
tarefa1d (Mapa num ((_,l):t)) | (length l)<=3 = True
                              | ((length l)>3) && (aux1d l==True) = tarefa1d (Mapa num t)
                              | otherwise = False
{-|
__ tarefa1e __
Verifica se existe pelo menos um obstáculo "Nenhum" na lista de obstáculos.
-}

tarefa1e :: Mapa -> Bool
tarefa1e (Mapa num []) = False
tarefa1e (Mapa num [(_,l)]) | elem Nenhum l == True = True
                            | otherwise = False
tarefa1e (Mapa num ((_,l):t)) | elem Nenhum l == True = tarefa1e (Mapa num t)
                              | otherwise = False

{-|
__ tarefa1f __
 Verifica se o comprimento da lista de obstáculos de cada linha corresponde exatamente à largura do mapa.
-}
tarefa1f :: Mapa -> Bool
tarefa1f (Mapa num []) | num == 0 = True
                       | otherwise = False  
tarefa1f (Mapa num [(_,l)]) | length l == num = True
                            | otherwise = False  
tarefa1f (Mapa num ((_,l):t)) | length l == num = tarefa1f (Mapa num t)
                              | otherwise = False  


{-|
 __ aux1g __
A função "aux1g" conta o número de vezes que aparecem seguidos os Rios, ou Estradas ou Relvas.
 -}
aux1g :: Int -> Terreno -> [(Terreno,[Obstaculo])] -> Int
aux1g p x [] = p
aux1g p (Rio v) ((Rio v2,l):t) =  aux1g (p+1) (Rio v) t
aux1g p (Estrada v) ((Estrada v2,l):t) = aux1g (p+1) (Estrada v) t
aux1g p Relva ((Relva,l):t) = aux1g (p+1) Relva t
aux1g p x ((terreno,l):t) = p

{-|
__ tarefa1g __
A função "tarefa1g" retorna False se houverem mais do que 5 Rios seguidos ou mais do que 6 Estradas ou Relvas seguidas.
-}
tarefa1g :: Mapa-> Bool
tarefa1g (Mapa num []) = True
tarefa1g (Mapa num ((Rio v1,l):t)) |aux1g 1 (Rio v1) t > 4 = False
                                   |otherwise = tarefa1g (Mapa num t)
tarefa1g (Mapa num ((Estrada v1,l):t)) | aux1g 1 (Estrada v1) t > 5 = False
                                       | otherwise = tarefa1g (Mapa num t)
tarefa1g (Mapa num ((Relva,l):t)) | aux1g 1 Relva t > 5 = False
                                  | otherwise = tarefa1g (Mapa num t)
