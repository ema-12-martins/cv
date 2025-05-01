<template>
    <div id="app">
        <navBar :paginaServico="true"> </navBar>
        <sidePainel></sidePainel>

        <main id="main">
            <div class="main-container">

                <InfCliente v-if="infoCliente" :idServico="servicoId" />
                <InfServico v-if="infoServico" :idServico="servicoId" />
                <InfVeiculo v-if="infoVeiculo" :idServico="servicoId"/>

                <div class="main-buttonContainer">
                    <button class="main-button" @click="ativarEdesativarPopUp()">
                        Retomar
                    </button>
                </div>

                <div class="popUpMotivoNaoGuardado" v-if="mostrarPopUp">
                    <PopUpsErro v-if="mostrarPopUp" :idPagina="6"/>
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
import PopUpsErro from '@/components/PopUpsErro.vue';

export default {
    name: 'PaginaServicoSuspenso',
    components: {
        navBar,
        sidePainel,
        InfCliente,
        InfServico,
        InfVeiculo,
        PopUpsErro
    },

    data() {
        return {
            servicoId: null,
            infoCliente: false,
            infoServico: false,
            infoVeiculo: false,
            mostrarPopUp: false
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

        ativarEdesativarPopUp(){
            this.mostrarPopUp = true;
            setTimeout(() => {
                this.mostrarPopUp = false;
                this.atualizarEstadoDoServico().then(() => {
                    let atual = this.$route.path;
                    this.$router.push(atual);

                    // Emitir evento personalizado para informar a atualização da rota
                    this.$emit('routeUpdated');
                })
            }, 3000);
        },

        async atualizarEstadoDoServico() {
            try {
               
                const response = await fetch(`http://localhost:3000/services/${this.servicoId
                }`);
                const data = await response.json();

                data.estado = "iniciado";

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
        document.documentElement.classList.add('paginaServicoSuspenso-html-body');
        document.body.classList.add('paginaServicoSuspenso-html-body');
    },

    beforeUnmount() {
        document.documentElement.classList.remove('paginaServicoSuspenso-html-body');
        document.body.classList.remove('paginaServicoSuspenso-html-body');
    }
}
</script>

<style>
.paginaServicoSuspenso-html-body {
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

.main-buttonContainer{
    display: flex;
    justify-content: flex-end;
    margin-right: 2rem;
}

.main-button {
    background-color: #4A82AA;
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0.9rem 0 0.9rem 0rem;
    width: 17.5%;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 2.5rem;
    color: #FFFFFF;
    cursor: pointer;
}

.main-button:hover {
    background-color: #034E66;
}

.popUpMotivoNaoGuardado{
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: fixed;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
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