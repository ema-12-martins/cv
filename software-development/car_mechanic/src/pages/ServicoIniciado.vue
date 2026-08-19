<template>
    <div id="app">
        <navBar :servicoIniciado="true"> </navBar>
        <sidePainel nomeComponentePai="PaginaServicoIniciado"></sidePainel>

        <main id="main">
            <div class="main-container">
                
                <InfCliente v-if="infoCliente" :idServico="servicoId" />
                <InfServico v-if="infoServico" :idServico="servicoId" />
                <InfVeiculo v-if="infoVeiculo" :idServico="servicoId"/>

                <div class="main-buttonsContainer">
                    <div class="main-buttonsRowContainer">
                        <button class="main-buttonFailure" @click="abrirPop()">
                            Insucesso
                        </button>
                        <div class="popUpIndicarMotivo" v-if="mostrarPopUp" @fecharPopUpMotivo="fecharPop()" >
                            <IndicarMotivo v-if="mostrarPopUp" @fecharPopUpMotivo="fecharPop()" @fecharPopUp="motivoSucesso()" @cruz="tirarPopMotivo" :estouPecas="true"/>
                        </div>
                        <button class="main-buttonSuccess" @click="paginaServicosAgendados()">
                            Sucesso
                        </button>
                    </div>
                </div>

            </div>
        </main>

        <footer id="footer">
            <div class="footer-content">
            </div>    
        </footer>
    </div>

    
</template>


<script>
import navBar from '../components/Nav.vue';
import sidePainel from '../components/Side.vue';
import InfCliente from '@/components/InfCliente.vue';
import InfServico from '@/components/InfServico.vue';
import InfVeiculo from '@/components/InfVeiculo.vue';
import IndicarMotivo from '@/components/IndicarMotivo.vue';

export default {
    name: 'PaginaServicoIniciado',
    components: {
        navBar,
        sidePainel,
        InfCliente,
        InfServico,
        InfVeiculo,
        IndicarMotivo
    },

    data() {
        return {
            servicoId: null,
            infoCliente: false,
            infoServico: false,
            infoVeiculo: false,
            mostrarPopUp: false,
            baseURL: 'http://localhost:3000/'
        }
    },

    created() {
        this.verificarRota();
    },

    methods: {
        verificarRota() {
            var listLink = this.$route.path.split('/')
            this.servicoId = listLink[2];
            var tipoInfo = listLink[3];

            if (tipoInfo == "infCliente") {
                this.infoCliente = true;  
            } 
            else if (tipoInfo == "infServico") {
                this.infoServico = true;
            } 
            else {
                this.infoVeiculo = true;
            }
        },
        paginaServicosAgendados(){
            this.atualizarEstadoDoServico().then(() => {
                this.$router.push("/servicos/agendados");
            })
        },
        abrirPop(){
            this.mostrarPopUp = true;
        },
        fecharPop(){
            this.mostrarPopUp = false;
        },
        motivoSucesso(){
            this.mostrarPopUp = false;
            this.$router.push("/servicos/agendados");
        },

        async atualizarEstadoDoServico() {
            try {
                const response = await fetch(`http://localhost:3000/services/${this.servicoId
                }`);
                const data = await response.json();

                data.estado = "realizado";

                const requestOptions = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                };
                const updateResponse = await fetch(`http://localhost:3000/services/${this.servicoId}`, requestOptions);

                if (updateResponse.ok) {
                    console.log('Estado do serviço atualizado com sucesso!');
                } else {
                    console.error('Erro ao atualizar o estado do serviço');
                }
            } 
            catch (error) {
                console.error('Ocorreu um erro:', error);
            }
        },
        tirarPopMotivo(){
            this.mostrarPopUp = false;
        }
    },
    watch: {
        // Observa mudanças na rota e chama verificarRota novamente
        $route() {
            this.infoCliente = false
            this.infoServico = false
            this.infoVeiculo = false
            this.verificarRota();
        }
    },
    mounted() {
        document.documentElement.classList.add('paginaServicoIniciado-html-body');
        document.body.classList.add('paginaServicoIniciado-html-body');
    },
    beforeUnmount() {
        document.documentElement.classList.remove('paginaServicoIniciado-html-body');
        document.body.classList.remove('paginaServicoIniciado-html-body');
    }

}
</script>

<style>
.paginaServicoIniciado-html-body {
    margin: 0;
    padding: 0;
    font-size: 0.8vw;
}
</style>

<style scoped>
#app {
    display: grid;
    grid-template-areas:
      "nav    nav"
      "side   main"
      "side   ."
      "side footer";
    grid-template-rows: 1fr 10fr 0.75fr 0.75fr;
    grid-template-columns: 1.5fr 4fr;
    height: 100vh;
}

#main {
    grid-area: main;
}

.main-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.main-buttonsContainer{
    display: flex;
    justify-content: flex-end;
    margin-right: 2rem;
}

.main-buttonsRowContainer{
    display: flex;
    justify-content: space-between;
    width: 40%;
}

.main-buttonSuccess {
    background-color: #63AA6A;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0.9rem 0 0.9rem 0rem;
    width: 45%;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 2.5rem;
    color: #FFFFFF;
    cursor: pointer;
}

.main-buttonSuccess:hover {
    background-color: #00850D;
}

.main-buttonFailure {
    background-color: rgba(164, 7, 7, 0.65);
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0.9rem 0 0.9rem 0rem;
    width: 45%;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 2.5rem;
    color: #FFFFFF;
    cursor: pointer;
}

.main-buttonFailure:hover {
    background-color: #A10000;
}

.popUpIndicarMotivo {
    position: fixed;
    top: 10%;
    left: 14.85%;
}

#footer {
    grid-area: footer;
}

.footer-content {
    background: linear-gradient(90deg, #4A82AA, #FFFFFF);
    width: 100%;
    height: 100%;
}
</style>