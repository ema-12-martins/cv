
from json import JSONDecodeError
import PySimpleGUI as sg
import Projeto as bs
BD=[]

tipos=[("JSON (*.json)", "*.json")]
sg.theme('DarkTeal4')
Parte1=[[sg.Button("Carregar",size=(10,2),font="Helvetica 15")],
[sg.Button("Inserir",size=(10,2),font="Helvetica 15")],
[sg.Button("Alterar",size=(10,2),font="Helvetica 15")],
[sg.Button("Gravar",size=(10,2),font="Helvetica 15")],
[sg.Button("Listar",size=(10,2),font="Helvetica 15")],
[sg.Button("Consultar",size=(10,2),font="Helvetica 15")],
[sg.Button("Estatísticas",size=(10,2),font="Helvetica 15")],
[sg.Button("Sair",size=(10,2),font="Helvetica 15")]
]
Barra=["ID","Título","Ano","Atores","Generos"]
Barra2=["Ator","IDs","Títulos" ]
Valores=[["Ainda não existem","Ainda não existem","Ainda não existem","Ainda não existem","Ainda não existem"]]
Valores2=[["       Ainda    não    existem  nesta Coluna     ","       Ainda    não    Existem    nesta Coluna   ", "       Ainda    não     Exitem   nesta Coluna    "]]
Listar=[[sg.Text("Listagem de Filmes",font="Helvetica 15",justification="center",size=(70,1))],[sg.Button("Lista de Filmes"),sg.Button("Lista por Ator",tooltip="Esta operação pode demorar algum tempo!"), sg.Button("Lista por Género")], [sg.Frame("Lista de filmes", [[sg.Table(values=Valores,headings=Barra,auto_size_columns=True,
        vertical_scroll_only=False,justification="center",size=(70,28),background_color="#cfd7f8", alternating_row_color="#e1dff8",text_color="#000000",key="Lista11")]],key="Lista1")]]
Inicial=[
    [sg.Text("Painel de Dados",size=(70,1),justification="center",font="Helvetica 15")],
    [sg.Text(size=(70,32),key="-Placeholder-" )],
]
Carregar=[[sg.Text(size=(70,2))],
    [sg.Text("Painel de Dados",size=(70,1),justification="center",font="Helvetica 15")],
    [sg.Text(size=(70,3))],
    [sg.Text("Base de Dados:",justification="center",font="Helvetica 15")],
    [sg.Input(size=(60,1.5),do_not_clear=False),sg.FileBrowse(file_types=tipos,size=(10,1),font="Helvetica 15"),
    sg.Button("Abrir",size=(10,1),font="Helvetica 15")]
    ]

Inserir=[[sg.Text("Painel de Dados",size=(70,1),justification="center",font="Helvetica 15")],
    [sg.Text(size=(70,4))],
    [sg.Text("Título",font="Helvetica 13")],
    [sg.Input(size=(60,1),font="Helvetica 13",key="Titulo",do_not_clear=False)],
    [sg.Text(size=(70,1))],
    [sg.Text("Ano de Lançamento",font="Helvetica 13")],
    [sg.Input(size=(60,1),font="Helvetica 13",key="Ano",do_not_clear=False)],
    [sg.Text(size=(70,1))],
    [sg.Text("Atores",font="Helvetica 13")],
    [sg.Input(size=(60,1),font="Helvetica 13",key="Atores", tooltip="Separe os nomes dos Atores por vírgulas!",do_not_clear=False)],
    [sg.Text(size=(70,1))],
    [sg.Text("Género",font="Helvetica 13")],
    [sg.Input(size=(60,1),font="Helvetica 13",key="Genero",tooltip="Separe os Géneros por vírgulas!",do_not_clear=False)],[sg.Button("Adicionar",font="Helvetica 13",size=(10,1))
    ]]

Gravar=[[sg.Text("Painel de Dados",size=(70,1),justification="center",font="Helvetica 15")],
    [sg.Text(size=(70,11))],
    [sg.Text("Nome do nome Documento:",font="Helvetica 14")],
    [sg.Text(size=(70,1))],
    [sg.Input(font="Helvetica 13", size=(70,1),key="Gravado",do_not_clear=False)],
    [sg.Button("Salvar",font="Helvetica 13",)]
]
Estatistica=[[sg.Text("Painel de Dados",font="Helvetica 15",size=(70,2), justification="center")], [sg.Button("Gráfico por Género",font="Helvetica 13",size=(30,1))],
            [sg.Button("Gráfico por Ator",font="Helvetica 13",size=(30,1))], [sg.Button("Número de Filme da Base de Dados",font="Helvetica 13",size=(30,1))],
            [sg.Text("",font="Helvetica 13",size=(70,2),key="Entradas")]]

Consultar=[[sg.Text("Procurar por ID, Título, Género ou Ator ",size=(70,6),font="Helvetica 13",justification="center")],[sg.Button("ID",font="Helvetica 13",size=(10,1)),sg.Button("Título",font="Helvetica 13",size=(10,1))
            ,sg.Button("Género",font="Helvetica 13",size=(10,1),tooltip="Este parâmetro precisa de estar escrito por completo"),sg.Button("Ator",font="Helvetica 13",size=(10,1))],
        [sg.Input(key="-InpConsult-",font="Helvetica 13",size=(70,1),do_not_clear=False)],
        [sg.Text("",font="Helvetica 13", key="ResulConsult",size=(70,3))],[sg.Listbox(values=[],key="-ConsultarTit-",size=(70,15),visible=False,font="Helvetica 13",horizontal_scroll=True)]]

Alterar=[[sg.Text("Introduza o ID do Filme que pretende modificar",font="Helvetica 15",size=(70,2),justification="center")],
         [sg.Input(key="-InpAlterar-",font="Helvetica 13",size=(70,1))],[sg.Text("Introduza a Alteração",font="Helvetica 13",size=(70,1))],
         [sg.Input(key="Alteracao",font="Helvetica 13",size=(70,1),do_not_clear=True)],
         [sg.Button("Título",font="Helvetica 13",size=(30,1),key="-AlterarTitulo-"),sg.Button("Ano",font="Helvetica 13",size=(30,1),key="-AlterarAno-"),sg.Button("Atores",font="Helvetica 13",size=(30,1),key="-AlterarAtores-"),sg.Button("Géneros",font="Helvetica 13",size=(30,1),key="-AlterarGenero-")],
         [sg.Listbox(values=[],key=("Listas"),size=(70,10))],
         [sg.Button("Finalizar alteração",key="-Finalizar-")]
    ]
Listar2=[[sg.Text("Listagem de Filmes",font="Helvetica 15",justification="center",size=(70,1))],[sg.Button("Lista de Filmes",key="Lista de Filmes1"),sg.Button("Lista por Ator",key="Lista por Ator1",tooltip="Esta operação pode demorar algum tempo!"), sg.Button("Lista por Género", key="Lista por Género1")],
        [sg.Frame("Lista por Ator", [[sg.Table(size=(70,28),values=Valores2,headings=Barra2, vertical_scroll_only=False,justification="center",background_color="#cfd7f8",
         alternating_row_color="#e1dff8",text_color="#000000",key="Lista22")]], key="Lista2")]]

Listar3=[[sg.Text("Listagem de Filmes",font="Helvetica 15",justification="center",size=(70,1))],[sg.Button("Lista de Filmes",key="Lista de Filmes2"),sg.Button("Lista por Ator",key="Lista por Ator2",tooltip="Esta operação pode demorar algum tempo!"), sg.Button("Lista por Género",key="Lista por Género2")], 
        [sg.Frame("Lista por Género",[[sg.Table(values=Valores2,headings=["Género","IDs","Títulos"],auto_size_columns=True,
        vertical_scroll_only=False,justification="center",size=(70,28),background_color="#cfd7f8", alternating_row_color="#e1dff8",text_color="#000000",key="Lista33")]], key="Lista3")]]
layout = [
    [
        sg.Column(Parte1),
        sg.VSeperator(),
        sg.Column(Inicial,key="-Inicial-"),
        sg.Column(Carregar,key="-Carregar-",visible=False),
        sg.Column(Inserir,key="-Inserir-",visible=False),
        sg.Column(Gravar,key="-Gravar-",visible=False),
        sg.Column(Consultar,key="-Consultar-",visible=False),
        sg.Column(Estatistica,key="-Estatistica-",visible=False),
        sg.Column(Listar,key="-Listar-",visible=False),
        sg.Column(Listar2,key="-Listar2-",visible=False),
        sg.Column(Listar3,key="-Listar3-",visible=False),
        sg.Column(Alterar,key="-Alterar-",visible=False)
    ]
]


window = sg.Window("Sample App", layout)
Gravarfi=[[sg.Text("A nova Base de Dados ainda não foi guardada")],[sg.Input(key="Nome",tooltip="Nome do novo ficheiro")],
    [sg.Button("Gravar"),
    sg.Button("Não Gravar")]]

stop = False
Guardado=True
while not stop:
    event, values = window.read()
    window["-Carregar-"].update(visible=False)
    window["-Inserir-"].update(visible=False)
    window["-Gravar-"].update(visible=False)
    window["-Consultar-"].update(visible=False)
    window["-Estatistica-"].update(visible=False)
    window["-Listar-"].update(visible=False)  
    window["-Listar3-"].update(visible=False)
    window["-Listar2-"].update(visible=False)
    window["-Alterar-"].update(visible=False)
    if event == "Sair" or event == sg.WIN_CLOSED:
        if Guardado==False:
            wingrav=sg.Window("Gravar",Gravarfi)
            eventgrav, valuesgrav = wingrav.read()
            if eventgrav=="Gravar":
                bs.GuardarBD(BD,valuesgrav["Nome"])
                wingrav.close()
            elif eventgrav=="Não Gravar" or eventgrav== sg.WIN_CLOSED:
                wingrav.close()

        stop = True

    elif event == "Carregar":
        window["-Inicial-"].update(visible=False)
        window["-Carregar-"].update(visible=True)
    elif event=="Abrir":
        try:
            try:
                window["-Carregar-"].update(visible=True)
                Localizacao=values
                BD=bs.InserirID(Localizacao["Browse"])
                sg.popup("A Base de Dados foi carregada com sucesso!")
            except FileNotFoundError:
                sg.popup("Ficheiro Não Existe",title="Erro")
        except JSONDecodeError:
            sg.popup("Tipo de ficheiro não suportado")
    
    elif event == "Inserir": 
        window["-Inicial-"].update(visible=False)
        window["-Inserir-"].update(visible=True)
    elif event=="Adicionar":
        window["-Inserir-"].update(visible=True)
        try:
            Atores=values["Atores"].split(",")
            Género=values["Genero"].split(",") 
            Ano=int(values["Ano"]) 
            Título=values["Titulo"]
            if Atores==[""] or Género==[""] or Ano=="" or Título=="":
                sg.popup("Erro, Não pode deixar campos em Branco!")
            else:
                BD=bs.InserirBD(BD,Ano,Atores,Título,Género,int(len(BD)))
                sg.popup("O novo filme foi inserido!")
                Guardado=False
        except ValueError or TypeError:
            sg.popup("Erro, Ano deve ser um número inteiro!")
        
    elif event == "Alterar":
        window["-Inicial-"].update(visible=False)
        window["-Alterar-"].update(visible=True)
        Alterado=""
        BD.sort(key=bs.Ord2)
    elif event== "-AlterarTitulo-":
        window["-Alterar-"].update(visible=True)
        try:
            if int(values["-InpAlterar-"])>=0:
                
                Alterado="Titulo"
                window["Listas"].update(values=[BD[int(values["-InpAlterar-"])]["title"]])
            else: 
                sg.popup("Erro! Introduza um ID válido!")
        except ValueError:
            sg.popup("Erro! Introduza um ID válido!")
    elif event== "-AlterarAno-":
        window["-Alterar-"].update(visible=True)
        try:
            if int(values["-InpAlterar-"])>=0:
                
                Alterado="Ano"
                window["Listas"].update(values=[BD[int(values["-InpAlterar-"])]["year"]])
            else: 
                sg.popup("Erro! Introduza um ID válido!")
        except ValueError:
            sg.popup("Erro! Introduza um ID válido!")
    elif event== "-AlterarAtores-":

        window["-Alterar-"].update(visible=True)
        Alterado="Atores"
        try:
            if int(values["-InpAlterar-"])>=0:
                if BD[int(values["-InpAlterar-"])]["cast"] is str:
                    window["Listas"].update(values=[BD[int(values["-InpAlterar-"])]["cast"]])
                else:
                    window["Listas"].update(values=BD[int(values["-InpAlterar-"])]["cast"])
            else: 
                sg.popup("Erro! Introduza um ID válido!")
        except ValueError:
            sg.popup("Erro! Introduza um ID válido!")
    elif event== "-AlterarGenero-":

        window["-Alterar-"].update(visible=True)
        Alterado="Genero" 
        try:
            if int(values["-InpAlterar-"])>=0:
                if BD[int(values["-InpAlterar-"])]["genres"] is str:
                    window["Listas"].update(values=[BD[int(values["-InpAlterar-"])]["genres"]])
                else:
                    window["Listas"].update(values=BD[int(values["-InpAlterar-"])]["genres"]) 
            else: 
                sg.popup("Erro! Introduza um ID válido!")
        except ValueError:
            sg.popup("Erro! Introduza um ID válido!")
    elif event=="-Finalizar-":
        window["-Alterar-"].update(visible=True)
        try:
            if int(values["-InpAlterar-"])<=len(BD):
                if len(values["Alteracao"])!=0:
                    if Alterado=="Ano":
                        try:
                            BD=bs.AlterarAno(BD, values["-InpAlterar-"],values["Alteracao"])
                            sg.popup("O filme foi alterado com sucesso!")
                            Guardado=False
                        except ValueError:
                            sg.popup("Erro! O Ano deve ser um número Inteiro")
                    elif Alterado=="Titulo":
                        BD=bs.AlterarTitulo(BD,values["-InpAlterar-"],values["Alteracao"])
                        sg.popup("O filme foi alterado com sucesso!")
                        Guardado=False
                    elif Alterado=="Genero":
                        try:
                            BD=bs.AlterarGeneros(BD,values["-InpAlterar-"],values["Alteracao"], values["Listas"][0])
                            sg.popup("O filme foi alterado com sucesso!")
                            Guardado=False
                        except IndexError:
                            sg.popup("Erro! Selecione um Género!")
                    elif Alterado=="Atores":
                        try:
                            BD=bs.AlterarAtores(BD,values["-InpAlterar-"],values["Alteracao"], values["Listas"][0])
                            sg.popup("O filme foi alterado com sucesso!")
                            Guardado=False
                        except IndexError:
                            sg.popup("Erro! Selecione um Ator!")
                else:
                    sg.popup("Erro! Por favor, não deixe campos em branco!")
            else:
                sg.popup("Erro! Não existe esse ID!")
        except ValueError:
            sg.popup("Erro! O ID deve ser um número Inteiro")

    elif event == "Gravar":  
        Guardado=True
        window["-Inicial-"].update(visible=False)
        window["-Gravar-"].update(visible=True)    
    elif event=="Salvar":
        window["-Gravar-"].update(visible=True)
        bs.GuardarBD(BD,values["Gravado"])

    elif event == "Listar":
        window["-Inicial-"].update(visible=False)
        window["-Listar-"].update(visible=True)    
        Valores=[]
    elif event=="Lista de Filmes" or event=="Lista de Filmes1" or event=="Lista de Filmes2":
        window["-Listar-"].update(visible=True)

        
        for x in range(len(BD)):
            Cast=str(BD[x]["cast"])
            a=Cast.strip("[]\"'")
            a=a.replace("\'","")
            a=a.replace("\"","")
            Genres=str(BD[x]["genres"])
            b=Genres.strip('[]')
            b=b.replace("'","")
            Valores.append([BD[x]["id"],BD[x]["title"],BD[x]["year"],a,b])
        window["Lista11"].update(values=Valores)
        
    elif event=="Lista por Ator" or event=="Lista por Ator1 " or event=="Lista por Ator2":
        window["-Listar2-"].update(visible=True)
        Lista=bs.ListaAtor(BD)
        Atores=[]
        for Ator in Lista:
            IDs=[]
            Filmes=[]
            for filme in Lista[Ator]:
                IDs.append(filme["id"])
                Filmes.append(filme["título"])
            Ids=str(IDs)
            a=Ids.strip("[]")
            Filmes=str(Filmes)
            b=Filmes.strip('[]\"')
            b=b.replace("'","")
            Atores.append([Ator,a,b])
        window["Lista22"].update(values=Atores)
        
    elif event=="Lista por Género" or event=="Lista por Género1" or event=="Lista por Género2":
        window["-Listar3-"].update(visible=True)
        Lista=bs.ListaGen(BD)
        Genero=[]
        for gen in Lista:
            IDs=[]
            Filmes=[]
            for filme in Lista[gen]:
                IDs.append(filme["id"])
                Filmes.append(filme["título"])
            Ids=str(IDs)
            a=Ids.strip("[]")
            Filmes=str(Filmes)
            b=Filmes.strip('[]\"')
            b=b.replace("'","")
            Genero.append([gen,a,b])
        window["Lista33"].update(values=Genero)


    elif event == "Consultar":  
        window["-Inicial-"].update(visible=False)
        window["-Consultar-"].update(visible=True)
        window["-ConsultarTit-"].update(visible=False)
        window["ResulConsult"].update(visible=False)
    elif event=="ID":
            window["-Consultar-"].update(visible=True)
            window["-ConsultarTit-"].update(visible=False)
            window["ResulConsult"].update(visible=True)
            try:
                    Resul=bs.ProcurarID(BD,int(values["-InpConsult-"]))
                    Cast=str(Resul["cast"])
                    a=Cast.strip("[]'")
                    a=a.replace("'","")
                    Genres=str(Resul["genres"])
                    b=Genres.strip("[]'")
                    b=b.replace("'","")
                    window["ResulConsult"].update(str(Resul["title"])+" | "+str(Resul["year"])+" | "+ a+" | "+b)
                
            except:
                sg.popup("Erro!!")
    elif event=="Título":
        window["ResulConsult"].update(visible=False)
        window["-ConsultarTit-"].update(visible=True)
        window["-Consultar-"].update(visible=True)
        try:
            try:
                Resul=bs.ProcurarTitulo(BD,(values["-InpConsult-"]))
                Final=[]                
                for Dic in Resul:
                    Cast=str(Dic["cast"])
                    a=Cast.strip("[]'")
                    a=a.replace("'","")
                    Genres=str(Dic["genres"])
                    b=Genres.strip("[]'")
                    b=b.replace("'","")
                    Final.append(str(Dic["id"])+"|"+str(Dic["title"])+" | "+str(Dic["year"])+" | "+a+" | "+b)

                
                window["-ConsultarTit-"].update(values=Final )
            except ValueError:
                sg.popup("Erro!!")
        except NameError:
            sg.popup("Erro!!")
    elif event== "Género":
        window["-Consultar-"].update(visible=True)
        window["-ConsultarTit-"].update(visible=True)
        window["ResulConsult"].update(visible=False)
        try:
            try:
                Resul=bs.ProcurarGenero(BD,(values["-InpConsult-"]))
                Final=[]                
                for Dic in Resul:
                    Cast=str(Dic["cast"])
                    a=Cast.strip("[]'")
                    a=a.replace("'","")
                    Genres=str(Dic["genres"])
                    b=Genres.strip("[]'")
                    b=b.replace("'","")
                    Final.append(str(Dic["id"])+"|"+str(Dic["title"])+" | "+str(Dic["year"])+" | "+a+" | "+b)
                window["-ConsultarTit-"].update(values=Final )
            except ValueError:
                sg.popup("Erro!!")
        except NameError:
            sg.popup("Erro!!")
    elif event =="Ator":
        window["-Consultar-"].update(visible=True)
        window["-ConsultarTit-"].update(visible=True)
        window["ResulConsult"].update(visible=False)
        try:
            try:
                Resul=bs.ProcurarAtor(BD,(values["-InpConsult-"]))
                Final=[]                
                for Dic in Resul:
                    Cast=str(Dic["cast"])
                    a=Cast.strip("[]'")
                    a=a.replace("'","")
                    Genres=str(Dic["genres"])
                    b=Genres.strip("[]'")
                    b=b.replace("'","")
                    Final.append(str(Dic["id"])+"|"+str(Dic["title"])+" | "+str(Dic["year"])+" | "+a+" | "+b)
                window["-ConsultarTit-"].update(values=Final )
            except ValueError:
                sg.popup("Erro!!")
        except NameError:
            sg.popup("Erro!!")
                
    elif event == "Estatísticas":
        window["-Inicial-"].update(visible=False)
        window["-Estatistica-"].update(visible=True)
    elif event=="Gráfico por Género": 
        window["-Estatistica-"].update(visible=True)   
        bs.PlotDistribPorGenero(BD)
    elif event=="Gráfico por Ator":
        window["-Estatistica-"].update(visible=True)
        bs.PlotDistribPorAtor(BD)
    elif event=="Número de Filme da Base de Dados":
        window["-Estatistica-"].update(visible=True)
        window["Entradas"].update("Exitem "+ str(bs.QuantosFilmes(BD))+" filmes nesta Base de Dados!")

window.close()