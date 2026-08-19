#1
import json
import re

def CarregarBD(fnome):
    f = open(fnome, encoding="utf-8")
    return json.load(f)

def InserirID(fnome):
    f=CarregarBD(fnome)
    i=0
    for dic in f:
        dic["id"]=i
        i=i+1
    return f


#2
def GuardarBD(BD,fnome):
    f=open(fnome,"w",encoding="utf-8")
    json.dump(BD,f,ensure_ascii=False,indent=2)

#3
def InserirBD(BD,Ano,Atores,Título,Género,id):
    dic={}
    dic["title"]=str(Título)
    dic["year"]=int(Ano)
    dic["cast"]=Atores
    dic["genres"]=Género   
    dic["id"]=id
    BD.append(dic)
    return BD

#4
def ProcurarID(BD,ID):
    for dic in BD:
        if ID==dic["id"]:
            return dic

def ProcurarTitulo(BD,titulo):
    listaID=[]
    titulo=titulo.lower()
    for dic in BD:
        listapalavras=titulo.split(" ")
        palavrasacertadas=0
        for palavra in listapalavras:
            if palavra in dic["title"].lower():
                palavrasacertadas=palavrasacertadas+1
        if palavrasacertadas==len(listapalavras):
            listaID.append(ProcurarID(BD,dic["id"]))
    return listaID

#5
def ChaveOrd(entrada):
    entrada2=entrada["title"].strip(".'\"()")   
    entrada2=entrada2.lower()
    return entrada2
    
def OrdenarTitulo(BD):
    BD.sort(key=ChaveOrd)
    return BD

#6
def ProcurarGenero(BD,genero):
    listaID=[]
    genero=genero.lower()
    for dic in BD:
        for generoBD in dic["genres"]:
            if generoBD.lower()==genero:
                listaID.append(ProcurarID(BD,dic["id"]))
    return listaID

#7
def ProcurarAtor(BD,ator):
    listaID=[]
    ator=ator.lower()
    for dic in BD:
        listapalavras=ator.split(" ")
        palavrasacertadas=0
        for palavra in listapalavras:
            for actor in dic["cast"]:
                if palavra in actor.lower():
                    palavrasacertadas=palavrasacertadas+1
            if palavrasacertadas==len(listapalavras):
                listaID.append(ProcurarID(BD,dic["id"]))
    return listaID
#8.1
def QuantosFilmes(BD):
    return len(BD)

#8.2
import matplotlib.pyplot as plt

def DistribPorGenero(bd):
    distribuicao={}
    for filme in bd:
        for genero in filme["genres"]:
            if genero in distribuicao.keys() :
                distribuicao[genero]= distribuicao[genero]+1
            else:
                distribuicao[genero]= 1
    distribuicao2={}
    distribuicao2["Others"]=0
    for generos in distribuicao.keys():
        if distribuicao[generos] < 0.01*len(bd):
            distribuicao2["Others"]=distribuicao2["Others"]+distribuicao[generos]
        else:
            distribuicao2[generos]=distribuicao[generos]
    return distribuicao2

def PlotDistribPorGenero(bd):
    distribuicao=DistribPorGenero(bd)
    plt.pie(distribuicao.values(),labels=[x + " :" + str(distribuicao[x]) for x in distribuicao.keys()],radius=2)
    plt.show()

#8.3
def DistribPorAtor(bd):
    distribuicao={}
    for filme in bd:
        for ator in filme["cast"]:
            if ator in distribuicao.keys() :
                distribuicao[ator]= distribuicao[ator]+1
            else:
                distribuicao[ator]= 1
    
    valores=sorted(distribuicao.items(),key= lambda x: x[1],reverse=True)
    return dict(valores[:10])
def PlotDistribPorAtor(bd):
    distribuicao=DistribPorAtor(bd)
    plt.pie(distribuicao.values(),labels=[x + " :" + str(distribuicao[x]) for x in distribuicao.keys()],radius=2)
    plt.show()

#Extra1 
def Ord(x):
    return x.lower()
def ListaAtor(bd):
    ListaAtor=[]
    for filme in bd:
        for ator in filme["cast"]:
            if ator not in ListaAtor:
                ListaAtor.append(ator)
    ListaAtor.sort(key=Ord)
    DicAtor={}
    for elem in ListaAtor:
        for filme in bd:
            for ator in filme["cast"]:
                if ator == elem :
                    if ator not in DicAtor:
                        DicAtor[ator]=[{"id":filme["id"], "título":filme["title"]}]
                    else:
                        DicAtor[ator].append({"id":filme["id"],"título":filme["title"]})
    return DicAtor
#Extra2
def ListaGen(bd):
    ListaGen=[]
    for filme in bd:
        for genero in filme["genres"]:
            if genero not in ListaGen:
                ListaGen.append(genero)
    ListaGen.sort(key=Ord)
    DicGen={}
    for elem in ListaGen:
        for filme in bd:
            for gen in filme["genres"]:
                if gen == elem :
                    if gen not in DicGen:
                        DicGen[gen]=[{"id":filme["id"], "título":filme["title"]}]
                    else:
                        DicGen[gen].append({"id":filme["id"],"título":filme["title"]})
    return DicGen

#Extra3
def AlterarTitulo(bd,ID,novo):

    bd[int(ID)]["title"]=str(novo)
    return bd

def AlterarAno(bd,ID,novo):
    bd[int(ID)]["year"]=int(novo)
    return bd

def AlterarAtores(bd,ID,novo,velho):
    a=bd[int(ID)]["cast"].index(velho)
    bd[int(ID)]["cast"][a]=str(novo)
    return bd

def AlterarGeneros(bd,ID,novo,velho):
    a=bd[int(ID)]["genres"].index(velho)
    bd[int(ID)]["genres"][a]=str(novo)
    return bd

def Ord2(BD):
    return(BD["id"])