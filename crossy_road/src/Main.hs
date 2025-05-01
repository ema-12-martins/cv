{- |
Module      : Main
Description : Gloss
Copyright   : Henrique Nuno Marinho Malheiro  <a97455@alunos.uminho.pt>
              Ema Maria Monteiro Martins  <a97678@alunos.uminho.pt>

Módulo para a realização do Gloss do projeto de LI1 em 2022/23.
-}
module Main where

import LI12223
import Tarefa1_2022li1g025
import Tarefa2_2022li1g025
import Tarefa3_2022li1g025
import Tarefa4_2022li1g025
import Tarefa5_2022li1g025
import Graphics.Gloss
import Graphics.Gloss.Interface.IO.Game
import Data.Maybe
import System.Random


data Objeto = T Terreno | O Obstaculo | J Jogador deriving (Show,Read,Eq)

type EstadoGloss = (Jogo, Jogo,Jogo,Bool,Texturas,[Int],Time,ContaJogo,ContaJogo,ContaJogo,Best) 

data Texturas = Texturas {player :: [(Jogador,Picture)], obstaculos :: [(Obstaculo,Picture)], terrenos :: [(Terreno,Picture)], menu :: [(Windows, [Picture])]}

data Opcoes = Jogar
              |Sair
              |Oneplayer
              |Multiplayer
              |Oneplayer2
              |Multiplayer2
              |Progress
              |Game
              |GameMultiplayer
              |GameLost
              |GameMultiplayerLost
              deriving Eq

data Windows = Menu Opcoes deriving Eq

type AllGame = (Windows, EstadoGloss) 
type Time = Int
type ContaJogo = Int
type Best = Int

{-| 
 __ selecionaLv1 __
 Cria a base do tabuleiro de jogo.
-}
selecionaLvl :: Int -> [Int] -> Jogo
selecionaLvl n random |n == 1 = Jogo (Jogador (11,17)) (lvl1 (Mapa 20 [(Relva,[Arvore,Nenhum,Nenhum,Arvore,Arvore 
                                                                        ,Arvore,Nenhum,Nenhum,Arvore,Nenhum       
                                                                        ,Nenhum,Nenhum,Nenhum,Arvore,Arvore
                                                                        ,Nenhum,Nenhum,Nenhum,Arvore,Nenhum])
                                                                        ,(Relva,[Arvore,Nenhum,Nenhum,Arvore,Arvore 
                                                                        ,Arvore,Nenhum,Nenhum,Arvore,Nenhum       
                                                                        ,Nenhum,Nenhum,Nenhum,Arvore,Arvore
                                                                        ,Nenhum,Nenhum,Nenhum,Arvore,Nenhum])
                                                                        ,(Relva,[Arvore,Nenhum,Nenhum,Arvore,Arvore 
                                                                        ,Arvore,Nenhum,Nenhum,Arvore,Nenhum       
                                                                        ,Nenhum,Nenhum,Nenhum,Arvore,Arvore
                                                                        ,Nenhum,Nenhum,Nenhum,Arvore,Nenhum])]) 17 random)   
                      |otherwise = undefined

{-| 
 __ lvl1 __
 Cria o mapa de jogo.
-}
lvl1 :: Mapa -> Int-> [Int] -> Mapa
lvl1 mapa tamanho (h1:h2:t) | tamanho>0 = lvl1 (estendeMapa mapa h1 h2) (tamanho-1) t 
                            | otherwise = mapa 

{-| 
 __ dm __
Dimenciona a janela do jogo.
-}
dm :: Display
dm = FullScreen

{-| 
 __ fr __
Indica a Frame rate
-}
fr :: Int
fr = 2

{-| 
 __ reageTempoGloss __
Função que reage ao tempo, atualizando o mapa.
-}
reageTempoGloss :: Float -> AllGame -> AllGame
reageTempoGloss tmp ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda,texturas,(h1:h2:t),time,conta1,conta2,conta3,best)) =  if time==2 
                                                                                                                              then if (jogoTerminou (animaJogo (deslizaJogo h1 h2 jogo1) Parado) || jogoTerminou (animaJogo (deslizaJogo h1 h2 jogo2) Parado )) 
                                                                                                                                    then ((Menu GameMultiplayerLost),(jogo1,jogo2,jogo3,guarda,texturas,(h1:h2:t),time,conta1,conta2,conta3,best)) 
                                                                                                                                    else ((Menu GameMultiplayer), ((animaJogo (deslizaJogo h1 h2 jogo1) Parado),(animaJogo (deslizaJogo h1 h2 jogo2) Parado),jogo3,guarda,texturas,t,0,conta1,conta2,conta3,best))
                                                                                                                              else ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,(h1:h2:t), time+1,conta1,conta2,conta3,best))
reageTempoGloss tmp ((Menu Game), (jogo1@(Jogo jogador mapa),jogo2,jogo3,guarda, texturas,(h1:h2:t), time,conta1,conta2,conta3,best)) =   if time==2 
                                                                                                                                          then if (jogoTerminou (animaJogo (deslizaJogo h1 h2 jogo1) Parado)) 
                                                                                                                                                then ((Menu GameLost),(jogo1,jogo2,jogo3,guarda, texturas,(h1:h2:t),time,conta1,conta2,conta3,best)) 
                                                                                                                                                else ((Menu Game), ((animaJogo (deslizaJogo h1 h2 jogo1) Parado),jogo2,jogo3,guarda, texturas,t, 0,conta1,conta2,conta3,best)) 
                                                                                                                                          else ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,(h1:h2:t), time+1,conta1,conta2,conta3,best))
reageTempoGloss _ s = s 

{-| 
 __ reageEventoGloss __
Reage aos eventos do Gloss.
-}
reageEventoGloss :: Event -> AllGame -> AllGame
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Jogar), (jogo1,jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Sair), (jogo1,jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Jogar), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | guarda = ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
                                                                                                                                                       | otherwise = ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Jogar), (jogo1,jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Sair), (jogo1,jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Sair), (jogo1,jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Jogar), (jogo1,jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Sair), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = undefined
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Sair), (jogo1,jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Jogar), (jogo1,jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Multiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Multiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Multiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Multiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Multiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Progress), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Multiplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Progress), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Game), (jogo3,jogo2,jogo3,guarda, texturas,random, time,conta3,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Progress), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Multiplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Progress), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Multiplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu Multiplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Multiplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Progress), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Cima)) = ((Menu GameLost),((animaJogo2 jogo1 (Move Cima)),jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,if best>conta1 then best else conta1))
                                                                                                                                                   | otherwise = ((Menu Game), ((animaJogo2 jogo1 (Move Cima)),jogo2,jogo3,guarda, texturas,random,time,conta1+1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Baixo)) = ((Menu GameLost),((animaJogo2 jogo1 (Move Baixo)),jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,if best>conta1 then best else conta1))
                                                                                                                                                     | otherwise = ((Menu Game), ((animaJogo2 jogo1 (Move Baixo)),jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyRight) Down _ _) ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Direita)) = ((Menu GameLost),((animaJogo2 jogo1 (Move Direita)),jogo2,jogo3,guarda, texturas,random,time,conta1,conta2,conta3,if best>conta1 then best else conta1))
                                                                                                                                                      | otherwise = ((Menu Game), ((animaJogo2 jogo1 (Move Direita)),jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyLeft) Down _ _) ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Esquerda)) = ((Menu GameLost),((animaJogo2 jogo1 (Move Esquerda)),jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,if best>conta1 then best else conta1))
                                                                                                                                                     | otherwise = ((Menu Game), ((animaJogo2 jogo1 (Move Esquerda)),jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeySpace) Down _ _) ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | guarda==False = ((Menu Game),(jogo1,jogo2,jogo1,True,texturas,random, time,conta1,conta2,conta1,best))
                                                                                                                                                      | otherwise = ((Menu Game),(jogo1,jogo2,jogo1,guarda,texturas,random,time,conta1,conta2,conta1,best))

reageEventoGloss (EventKey (SpecialKey KeyUp) Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Cima)) = ((Menu GameMultiplayerLost),((animaJogo2 jogo1 (Move Cima)),jogo2,jogo3,guarda,texturas,random,time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                              | otherwise = ((Menu GameMultiplayer), ((animaJogo2 jogo1 (Move Cima)),jogo2,jogo3,guarda,texturas,random,time,conta1+1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyDown) Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Baixo)) = ((Menu GameMultiplayerLost),((animaJogo2 jogo1 (Move Baixo)),jogo2,jogo3,guarda,texturas,random,time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                                | otherwise = ((Menu GameMultiplayer), ((animaJogo2 jogo1 (Move Baixo)),jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyRight) Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Direita)) = ((Menu GameMultiplayerLost),((animaJogo2 jogo1 (Move Direita)),jogo2,jogo3,guarda,texturas,random,time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                                 | otherwise = ((Menu GameMultiplayer), ((animaJogo2 jogo1 (Move Direita)),jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (SpecialKey KeyLeft) Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo1 (Move Esquerda)) = ((Menu GameMultiplayerLost),((animaJogo2 jogo1 (Move Esquerda)),jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                                | otherwise = ((Menu GameMultiplayer), ((animaJogo2 jogo1 (Move Esquerda)),jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))

reageEventoGloss (EventKey (Char 'w') Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo2 (Move Cima)) = ((Menu GameMultiplayerLost),(jogo1,(animaJogo2 jogo2 (Move Cima)),jogo3,guarda,texturas,random,time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                      | otherwise = ((Menu GameMultiplayer), (jogo1,(animaJogo2 jogo2 (Move Cima)),jogo3,guarda,texturas,random,time,conta1,conta2+1,conta3,best))
reageEventoGloss (EventKey (Char 's') Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo2 (Move Baixo)) = ((Menu GameMultiplayerLost),(jogo1,(animaJogo2 jogo2 (Move Baixo)),jogo3,guarda,texturas,random,time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                      | otherwise = ((Menu GameMultiplayer), (jogo1,(animaJogo2 jogo2 (Move Baixo)),jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (Char 'd') Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo2 (Move Direita)) = ((Menu GameMultiplayerLost),(jogo1,(animaJogo2 jogo2 (Move Direita)),jogo3,guarda,texturas,random,time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                      | otherwise = ((Menu GameMultiplayer), (jogo1,(animaJogo2 jogo2 (Move Direita)),jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))
reageEventoGloss (EventKey (Char 'a') Down _ _) ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | jogoTerminou (animaJogo2 jogo2 (Move Esquerda)) = ((Menu GameMultiplayerLost),(jogo1,(animaJogo2 jogo2 (Move Esquerda)),jogo3,guarda,texturas,random, time,conta1,conta2,conta3,if best>conta1 then if best>conta2 then best else conta2 else conta1))
                                                                                                                                                      | otherwise = ((Menu GameMultiplayer), (jogo1,(animaJogo2 jogo2 (Move Esquerda)),jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best))
                                                                                                                                                                                                                            
reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu GameLost), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Jogar),((selecionaLvl 1 random),(selecionaLvl 1 random),jogo3,guarda,texturas,random,0,0,0,conta3,best)) -- reinicia os jogos

reageEventoGloss (EventKey (SpecialKey KeyEnter) Down _ _) ((Menu GameMultiplayerLost), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = ((Menu Jogar),((selecionaLvl 1 random),(selecionaLvl 1 random),jogo3,guarda,texturas,random,0,0,0,conta3,best)) -- reinicia os jogos
                                                                                                                                                        
reageEventoGloss _ s = s   


{-| 
 __ estadoGlossInicial __
 Desenha o estado inicial do Gloss.
-}
estadoGlossInicial :: Texturas -> [Int] -> AllGame
estadoGlossInicial texturas random = ((Menu Jogar), ((selecionaLvl 1 random),(selecionaLvl 1 random),(selecionaLvl 1 random), False, texturas,random, 0,0,0,0,0))

{-| 
 __ reageEventoGloss __
Desenha os diversos eventos do Gloss.
-}
desenhaEstadoGloss :: AllGame -> Picture  
desenhaEstadoGloss ((Menu Jogar), (jogo1,jogo2,jogo3,guarda,texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Jogar) (menu texturas))) 2
                                                                                                                ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Jogar) (menu texturas))) 3
                                                                                                                ,translate 0 (50) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Jogar) (menu texturas))) 0
                                                                                                                ,translate (-7) (-150) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Jogar) (menu texturas))) 1]
desenhaEstadoGloss ((Menu Sair), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Sair) (menu texturas))) 2
                                                                                                                ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Sair) (menu texturas))) 3
                                                                                                                ,translate (-10) (25) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Sair) (menu texturas))) 0
                                                                                                                ,translate (-8) (-117) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Sair) (menu texturas))) 1]
desenhaEstadoGloss ((Menu Oneplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 3
                                                                                                                      ,translate (560) (380) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1200 200
                                                                                                                      ,translate (400) (363) $ scale 0.30 0.30 $ Text ("Best Score: "++(show best))
                                                                                                                      ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 4
                                                                                                                      ,translate (-10) (25) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 0
                                                                                                                      ,translate (-260) (25) $ scale (0.05) (0.05) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 2
                                                                                                                      ,translate (-10) (-117) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 1] 
desenhaEstadoGloss ((Menu Multiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 3
                                                                                                                        ,translate (560) (380) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1200 200
                                                                                                                        ,translate (400) (363) $ scale 0.30 0.30 $ Text ("Best Score: "++(show best))
                                                                                                                        ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 4
                                                                                                                        ,translate (-10) (25) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 0
                                                                                                                        ,translate (-10) (-117) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 1
                                                                                                                        ,translate (-260) (-117) $ scale (0.05) (0.05) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 2]
desenhaEstadoGloss ((Menu Oneplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 3
                                                                                                                      ,translate (560) (380) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1200 200
                                                                                                                      ,translate (400) (363) $ scale 0.30 0.30 $ Text ("Best Score: "++(show best))
                                                                                                                      ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 4
                                                                                                                      ,translate (-10) (25) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 0
                                                                                                                      ,translate (-260) (25) $ scale (0.05) (0.05) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 2
                                                                                                                      ,translate (-10) (-117) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 1
                                                                                                                      ,translate (-10) (-240) $ scale (0.4) (0.32) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 5] 
desenhaEstadoGloss ((Menu Multiplayer2), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 3
                                                                                                                        ,translate (560) (380) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1200 200
                                                                                                                        ,translate (400) (363) $ scale 0.30 0.30 $ Text ("Best Score: "++(show best))
                                                                                                                        ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 4
                                                                                                                        ,translate (-10) (25) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 0
                                                                                                                        ,translate (-10) (-117) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 1
                                                                                                                        ,translate (-260) (-117) $ scale (0.05) (0.05) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 2
                                                                                                                        ,translate (-10) (-240) $ scale (0.4) (0.32) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 5]   
desenhaEstadoGloss ((Menu Progress), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 3
                                                                                                                      ,translate (560) (380) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1200 200
                                                                                                                      ,translate (400) (363) $ scale 0.30 0.30 $ Text ("Best Score: "++(show best))
                                                                                                                      ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 4
                                                                                                                      ,translate (-10) (25) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 0
                                                                                                                      ,translate (-10) (-117) $ scale (0.51) (0.5) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 1
                                                                                                                      ,translate (-260) (-250) $ scale (0.05) (0.05) $ (!!) (fromJust (lookup (Menu Multiplayer) (menu texturas))) 2
                                                                                                                      ,translate (-10) (-240) $ scale (0.4) (0.32) $ (!!) (fromJust (lookup (Menu Oneplayer) (menu texturas))) 5]

desenhaEstadoGloss ((Menu Game), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu Game) (menu texturas))) 7
                                                                                                                ,translate (-400) (400) $ printGame jogo1 texturas
                                                                                                                ,translate (545) (380) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1000 200
                                                                                                                ,translate (437) (363) $ scale 0.35 0.35 $ Text ("Score: "++(show conta1))
                                                                                                                ,translate (570) (200) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1170 200
                                                                                                                ,translate (400) (200) $ scale 0.15 0.15 $ Text ("Press Space to save the progress")]  
desenhaEstadoGloss ((Menu GameMultiplayer), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameMultiplayer) (menu texturas))) 7
                                                                                                                            ,translate (-870) (300) $ printGame jogo2 texturas
                                                                                                                            ,translate (130) (300) $ printGame jogo1 texturas
                                                                                                                            ,translate (535) (372) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1500 200
                                                                                                                            ,translate (-490) (372) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 1500 200
                                                                                                                            ,translate (330) (360) $ scale 0.35 0.35 $ Text ("Score player1: "++(show conta1))
                                                                                                                            ,translate (-685) (360) $ scale 0.35 0.35 $ Text ("Score player2: "++(show conta2))]                                                                        
desenhaEstadoGloss ((Menu GameLost), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 0
                                                                                                                      ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 2
                                                                                                                      ,translate 0 (-50) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 1
                                                                                                                      ,translate (4) (85) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 850 200
                                                                                                                      ,translate (-90) (70) $ scale 0.35 0.35 $ Text ("Score: "++(show conta1))]
desenhaEstadoGloss ((Menu GameMultiplayerLost), (jogo1,jogo2,jogo3,guarda, texturas,random, time,conta1,conta2,conta3,best)) | conta1> conta2 = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 0
                                                                                                                                                ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 2
                                                                                                                                                ,translate 0 (-50) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 1
                                                                                                                                                ,translate (-10) (70) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 950 200
                                                                                                                                                ,translate (-145) (58) $ scale 0.35 0.35 $ Text ("Player1 Won")] 
                                                                                                                             | conta2 > conta1 = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 0
                                                                                                                                                  ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 2
                                                                                                                                                  ,translate 0 (-50) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 1
                                                                                                                                                  ,translate (-10) (70) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 950 200
                                                                                                                                                  ,translate (-145) (58) $ scale 0.35 0.35 $ Text ("Player2 Won")]
                                                                                                                             | otherwise = Pictures [scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 0
                                                                                                                                            ,translate 0 (320) $ scale (1.5) (1.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 2
                                                                                                                                            ,translate 0 (-50) $ scale (0.5) (0.5) $ (!!) (fromJust (lookup (Menu GameLost) (menu texturas))) 1
                                                                                                                                            ,translate (4) (85) $ scale 0.32 0.35 $ Color azure $ rectangleSolid 500 200
                                                                                                                                            ,translate (-45) (73) $ scale 0.35 0.35 $ Text ("Draw")]                                                        
{-| 
 __ coordenadasLinha __
Cria a linha do tabuleiro em que associa os objetos da mesma com as suas respetivas coordenadas.
-}
coordenadasLinha :: (Terreno,[Obstaculo]) -> Int -> Int -> [(Objeto,Coordenadas)]
coordenadasLinha (terreno,[]) indiceLinha indiceColuna = []
coordenadasLinha (terreno,(h:t)) indiceLinha indiceColuna | h==Nenhum = [(T terreno,(indiceColuna,indiceLinha))] ++ (coordenadasLinha (terreno,t) indiceLinha (indiceColuna+1))
                                                          | otherwise = [(O h,(indiceColuna,indiceLinha))] ++ (coordenadasLinha (terreno,t) indiceLinha (indiceColuna+1)) 
{-| 
 __ coordenadasMapa __
Cria uma lista com todas as os objetos associados às respetivas coordenadas.
-}
coordenadasMapa :: Mapa -> Int -> [(Objeto,Coordenadas)]
coordenadasMapa (Mapa largura []) indiceLinha = []
coordenadasMapa (Mapa largura (linha:t)) indiceLinha =  coordenadasLinha linha indiceLinha 0 ++ (coordenadasMapa (Mapa largura t) (indiceLinha+1))  

{-| 
 __ printGame __
Faz o print do jogo.
-}
printGame :: Jogo -> Texturas -> Picture
printGame game@(Jogo (Jogador (x,y)) mapa) texturas = Pictures $ auxPrintGame (decodeGame game) texturas

{-| 
 __ auxPrintGame __
Auxilia da função printGame que tranforma o tabuleiro numa lista de Pictures.
-}
auxPrintGame :: [(Objeto,Coordenadas)] -> Texturas -> [Picture]
auxPrintGame [] _ = []
auxPrintGame (h:t) texturas = printObjeto h texturas : auxPrintGame t texturas

{-| 
 __ printObjeto __
Associa cada objeto (obstaculo/terreno) à sua Picture.
-}
printObjeto :: (Objeto, Coordenadas) -> Texturas -> Picture
printObjeto ((T (Rio v)), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ fromJust (lookup (Rio 0) (terrenos texturas))
printObjeto ((T (Estrada v)), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ fromJust (lookup (Estrada 0) (terrenos texturas))
printObjeto ((T Relva), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ fromJust (lookup (Relva) (terrenos texturas))
printObjeto ((O Tronco), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ fromJust (lookup (Tronco) (obstaculos texturas))
printObjeto ((O Carro), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ fromJust (lookup (Carro) (obstaculos texturas))
printObjeto ((O Arvore), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ fromJust (lookup (Arvore) (obstaculos texturas))
printObjeto ((J (Jogador (x1,y1))), (x,y)) texturas = translate (40*(fromIntegral x)) (-40*(fromIntegral y)) $ scale 0.6 0.6 $ fromJust (lookup (Jogador (0,0)) (player texturas))  

{-| 
 __ decodeGame __
Cria uma lista com os objetos e as respetivas coordenadas de todas as peças do tabuleiro.
-}
decodeGame :: Jogo -> [(Objeto,Coordenadas)]
decodeGame (Jogo (Jogador (x,y)) mapa) =  (coordenadasMapa mapa 0) ++ [(J (Jogador (x,y)), (fromIntegral x, fromIntegral y))]


{-| 
 __ main __
Main do jogo.
-}
main :: IO ()
main = do 
  backgroudMenu <- loadBMP "pictures/menu.bmp"
  headerMenu <- loadBMP "pictures/headerMenu.bmp"
  loadFire <- loadBMP "pictures/loadFire.bmp"
  exitFire <- loadBMP "pictures/exitFire.bmp"
  load <- loadBMP "pictures/load.bmp"
  exit <- loadBMP "pictures/exit.bmp"
  menuPrincipalFire <- loadBMP "pictures/MenuPrincipalFire.bmp"
  multiplayer <- loadBMP "pictures/multiplayer.bmp"
  oneplayer <- loadBMP "pictures/oneplayer.bmp"
  progress <- loadBMP "pictures/progress.bmp"
  arrow <- loadBMP "pictures/arrow.bmp"
  relva <- loadBMP "pictures/relva.bmp"
  rio <- loadBMP "pictures/rio.bmp"
  carro <- loadBMP "pictures/carro.bmp" 
  estrada <- loadBMP "pictures/estrada.bmp"
  arvore <- loadBMP "pictures/arvore.bmp"
  tronco <- loadBMP "pictures/tronco.bmp"
  jogador <- loadBMP "pictures/frango.bmp" 
  g <- newStdGen

  let random = randoms g :: [Int]

  play 
    dm
    (white)
    fr
    (let texturas = Texturas {
              player= [
                (Jogador (0,0),jogador)
              ],
              obstaculos = [
                (Arvore,arvore),
                (Carro,carro),
                (Tronco,tronco)
              ],
              terrenos = [
                (Relva,relva),
                (Rio 0,rio),
                (Estrada 0,estrada)
              ],
              menu = [
                ((Menu Jogar), [loadFire,exit,backgroudMenu,headerMenu]),
                ((Menu Sair), [load,exitFire,backgroudMenu,headerMenu]),
                ((Menu Oneplayer), [oneplayer,multiplayer,arrow,backgroudMenu,headerMenu,progress]),
                ((Menu Oneplayer2), [oneplayer,multiplayer,arrow,backgroudMenu,headerMenu,progress]),
                ((Menu Multiplayer), [oneplayer,multiplayer,arrow,backgroudMenu,headerMenu,progress]),
                ((Menu Multiplayer2), [oneplayer,multiplayer,arrow,backgroudMenu,headerMenu,progress]),
                ((Menu Oneplayer), [oneplayer,multiplayer,arrow,backgroudMenu,headerMenu,progress]),
                ((Menu Game), [relva,arvore,rio,tronco,estrada,carro,jogador,backgroudMenu]),
                ((Menu GameMultiplayer), [relva,arvore,rio,tronco,estrada,carro,jogador,backgroudMenu]),
                ((Menu GameLost), [backgroudMenu,menuPrincipalFire,headerMenu])]
                              } in
      estadoGlossInicial texturas random)

    desenhaEstadoGloss 
    reageEventoGloss
    reageTempoGloss 
