<template>
    <table class="main-table">
        <thead>
            <tr>
                <th class="header-cell">
                    Identificação
                </th>                     
                <th class="header-cell">
                    Serviço
                </th>
                <th class="header-cell">
                    Duração
                </th>
                <th v-if="this.tipo_da_data === 'agendados'" class="header-cell">
                    Data Entrega
                </th>
                <th v-if="this.tipo_da_data === 'fila'" class="header-cell">
                    Data Entrada
                </th>
                <th v-if="this.tipo_da_data === 'suspensos'" class="header-cell">
                    Data Entrada
                </th>
                <th v-if="this.tipo_da_data === 'servRealizados'" class="header-cell">
                    Data e hora (fim)
                </th>
            </tr>
        </thead>
        <tbody class="cell-scroll">
            <tr v-for="servico in lista_servicos" :key="servico.id"> <!--Para so ter 1 identificador por celula-->
              <td class="cell-button" @click="irParaPaginaServico(servico.servicoId)">{{ servico.servicoId }} </td>
              <td class="cell">{{ servico.descr}}</td>
              <td class="cell">{{ servico.duração}}min</td>
              <td class="cell" v-html="formataHoraDia(servico.data)"></td>
            </tr>
        </tbody>
    </table>
</template>


<script>
import { LoginStore } from "../store/LoginStore.js";

export default {
    name: 'TableComponent',
    props: {
        msg: String
    },
    data() {
        return {
            lista_servicos:[],
            tipo_da_data:""
        }
    },
    methods: {
        irParaPaginaServico(servicoId){
            this.$router.push("/servico/"+servicoId+"/infServico");
        },
        formataHoraDia(objeto_json){
            return objeto_json.dia.toString().padStart(2, '0')+'-'+objeto_json.mes.toString().padStart(2, '0')+'-'+objeto_json.ano.toString().padStart(4, '0')+'<br>'
            +objeto_json.hora.toString().padStart(2, '0')+':'+objeto_json.minutos.toString().padStart(2, '0')

        },
        preencherListaServicos(link){
            fetch(link)
                .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Something went wrong');
                }
                })
                .then(data => {
                    let self = this;
                    let lista=data
                    lista.forEach(function(servico) {
                        fetch('http://localhost:3000/service-definitions?id='+servico.definitionId)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Something went wrong');
                            }
                        })
                        .then(data => {
                            if (Array.isArray(data)) {
                                data.sort((a, b) => {
                                    return new Date(b.data.ano, b.data.mes - 1, b.data.dia, b.data.hora, b.data.minutos) - new Date(a.data.ano, a.data.mes - 1, a.data.dia, a.data.hora, a.data.minutos);
                                });
                                return data;
                            } else {
                                throw new Error('Data is not an array');
                            }
                        })
                        .then(data2 => {
                            data2[0].data = servico.data
                            data2[0].servicoId = servico.id
                            self.lista_servicos.push(data2[0])
                        })
                        .catch(error => console.log(error));
                        
                    });
                })
                .catch(error => console.log(error));

        },

        preencherTabela() { 
            var listLink = this.$route.path.split('/')
            if (listLink[1] === 'servicos' && listLink[2] === 'agendados'){
                this.tipo_da_data='agendados'
                this.preencherListaServicos('http://localhost:3000/services?estado=naoIniciado&agendamento=programado')
            }else if(listLink[1] === 'servicos' && listLink[2] === 'fila'){
                this.tipo_da_data='fila'
                this.preencherListaServicos('http://localhost:3000/services?estado=naoIniciado&agendamento=filaDeEspera')
            }else if(listLink[1] === 'servicos' && listLink[2] === 'suspensos'){
                this.tipo_da_data='suspensos'
                this.preencherListaServicos('http://localhost:3000/services?estado=parado')
            }else if(listLink[1] === 'perfil' && listLink[2] === 'servRealizados'){
                this.tipo_da_data='servRealizados'
                let idMecanico = LoginStore().getIdUtilizador
                this.preencherListaServicos("http://localhost:3000/services?estado=realizado&mecanico="+idMecanico)
            }
           
        }
    },
    watch: {
        // Observa mudanças na rota e chama verificarRota novamente
        $route() {
            this.lista_servicos = []
            this.preencherTabela()
        }
    },
    mounted(){
        // Esta função será chamada assim que o componente for montado
        this.preencherTabela();
    }
}
</script>   

<style scoped>
.main-table{
    display: block;
    width: 60rem;
}

.header-cell {    
    background-color: #E5E5E5;
    position: relative;
    border: 0.1rem solid #828282;
    justify-content: center;
    width: 15rem;
    height: 5rem;
    box-sizing: border-box;
    word-wrap: break-word;
    font-family: 'Inter';
    font-size: 1.5rem;
    line-height: 1;
    color: #000000;
}

.cell-scroll{
    max-height: calc(6 * (5.15rem)); 
    overflow-y: auto; 
    display: block;
}

.cell {    
    position: relative;
    border: 0.1rem solid #828282;
    width: 15rem;
    height: 5rem;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    word-wrap: break-word;
    font-family: 'Inter';
    font-size: 1.25rem;
    line-height: 1;
    color: #000000;
}

.cell-button {    
    position: relative;
    border: 0.1rem solid #828282;
    width: 15rem;
    height: 5rem;
    justify-content: center;
    text-align: center;
    box-sizing: border-box;
    word-wrap: break-word;
    font-family: 'Inter';
    font-size: 1.25rem;
    line-height: 1;
    color: #000000;
    cursor: pointer;
}
</style>