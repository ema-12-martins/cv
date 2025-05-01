<template>
    <aside id="side">
        <div class="popUpSugerirServicos" v-if="mostrarPopUp">
            <SugerirServicos @fecharPop="fecharPopUp()" :tituloPagina="true" :estouPecas="false"/>
        </div>
        <div v-if="checkTipo('servico')" :class="{'side-container4':checkIniciado(), 'side-container3':!checkIniciado()}">

            <button @click="mudarPaginaServico('infServico')" :class="{'side-button': !getSelected('infServico'), 'side-buttonSelected': getSelected('infServico')}">
                Informações Serviço <!--/servico/\<idServico>/infServico -->
            </button>

            <button @click="mudarPaginaServico('infVeiculo')" :class="{'side-button': !getSelected('infVeiculo'), 'side-buttonSelected': getSelected('infVeiculo')}">
                Informações Veículo <!--/servico/\<idServico>/infVeiculo -->
            </button>

            <button @click="mudarPaginaServico('infCliente')" :class="{'side-button': !getSelected('infCliente'), 'side-buttonSelected': getSelected('infCliente')}">
                Informações Cliente <!--/servico/\<idServico>/infCliente -->
            </button>

            <button v-if="checkIniciado()" class="side-button" @click="abrirPopUp()">
                Sugerir Serviços <!--Chamar pop-up sugerir serviços-->
            </button>
        </div>

        <div v-if="checkTipo('perfil')" class="side-container2">

            <button @click="mudarPagina('/perfil/infPessoais')" :class="{'side-button': !getSelected('infPessoais'), 'side-buttonSelected': getSelected('infPessoais')}">
                Informações Pessoais <!--/perfil/infPessoais-->
            </button>

            <button @click="mudarPagina('/perfil/servRealizados')" :class="{'side-button': !getSelected('servRealizados'), 'side-buttonSelected': getSelected('servRealizados')}">
                Serviços Realizados <!--/perfil/servRealizados -->
            </button>
        </div>

        <div v-if="checkTipo('servicos')" class="side-container3">

            <button @click="mudarPagina('/servicos/agendados')" :class="{'side-button': !getSelected('agendados'), 'side-buttonSelected': getSelected('agendados')}">
                Serviços Agendados <!--/servicos/agendados -->
            </button>

            <button @click="mudarPagina('/servicos/fila')" :class="{'side-button': !getSelected('fila'), 'side-buttonSelected': getSelected('fila')}">
                Serviços na Fila <!--/servicos/fila -->
            </button>

            <button @click="mudarPagina('/servicos/suspensos')" :class="{'side-button': !getSelected('suspensos'), 'side-buttonSelected': getSelected('suspensos')}">
                Serviços Suspensos <!--/servicos/suspensos -->
            </button>
        </div>
        
    </aside>
</template>


<script>
import SugerirServicos from './SugerirServicos.vue';
export default {
    name: 'sidePainel',

    props: {
        nomeComponentePai: String
    },

    components: {
        SugerirServicos
    },

    data() {
        return {
            mostrarPopUp: false
        }
    },

    methods: {
        mudarPaginaServico(fim) {
            var listLink = this.$route.path.split('/')
            listLink[listLink.length-1] = fim;
            var rota = listLink.join('/')
            this.$router.push(rota);
        },
        mudarPagina(rota) {
            this.$router.push(rota);
        },
        checkTipo(tipo) {
            var listLink = this.$route.path.split('/')
            return listLink[1] == tipo;
        },
        getSelected(botao) {
            var listLink = this.$route.path.split('/')
            return listLink[listLink.length-1] == botao;
        },
        checkIniciado() {
            return this.nomeComponentePai == "PaginaServicoIniciado";
        },
        abrirPopUp(){
            this.mostrarPopUp = true;
        },
        fecharPopUp(){
            this.mostrarPopUp = false;
        }
    },
}
</script>


<style scoped>
#side {
    background-color: #4A82AA;
    grid-area: side;
}

.side-container2{
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 26%; /* 13% por cada butao */
}

.side-container3{
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 39%; /* 13% por cada butao */
}

.side-container4{
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 52%; /* 13% por cada butao */
}

.side-buttonSelected {
    border-radius: 1.3rem;
    border: 0.3rem solid #000000;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 1.25rem 0 1.25rem 0;
    width: 80%;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 2rem;
    color: #000000;
    cursor: pointer;
}

.side-button {
    border-radius: 1.3rem;
    background-color: #FFFFFF;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 1.25rem 0 1.25rem 0;
    width: 80%;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 2rem;
    color: #000000;
    cursor: pointer;
}

.popUpSugerirServicos {
    display: flex; 
    justify-content: center; 
    align-items: center; 
    height: 100vh; 
    width: 100vw; 
    position: fixed; 
    top: 0; 
    left: 0; 
}
</style>