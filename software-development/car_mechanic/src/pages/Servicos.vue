<template>
    <div id="app">
        <navBar></navBar>    
        <sidePainel></sidePainel>

        <main id="main">
            <div class="main-headerContainer">
                <div v-if="servicoAgendado" class="main-header">
                    Serviços Agendados
                </div>
                <div v-if="servicoFila" class="main-header">
                    Serviços na Fila
                </div>
                <div v-if="servicoSuspenso" class="main-header">
                    Serviços Suspensos
                </div>
            </div>

            <div class="main-tableContainer">
                <TableComponent></TableComponent>
            </div>
        </main>

        <footer id="footer">
            <div class="footer-content"></div>
        </footer>
    </div>
</template>


<script>
import navBar from '../components/Nav.vue';
import sidePainel from '../components/Side.vue';
import TableComponent from '../components/Table.vue';

export default {
    name: 'PaginaServicos',
    components: {
        navBar,
        sidePainel,
        TableComponent
    },
    data() {
        return {
            servicoFila: false,
            servicoAgendado: false,
            servicoSuspenso: false
        }
    },
    created() {
        this.verificarRota();
    },
    methods: {
        verificarRota() {
            var listLink = this.$route.path.split('/')
            if (listLink[2] === 'agendados'){
                this.servicoAgendado = true
            }else if (listLink[2] === 'fila'){
                this.servicoFila = true
            }else if (listLink[2] === 'suspensos'){
                this.servicoSuspenso = true
            }
        }
    },
    watch: {
        // Observa mudanças na rota e chama verificarRota novamente
        $route() {
            this.servicoAgendado = false
            this.servicoFila = false
            this.servicoSuspenso = false
            this.verificarRota();
        }
    },
    mounted() {
        document.documentElement.classList.add('Servicos-html-body');
        document.body.classList.add('Servicos-html-body');
    },
    beforeUnmount() {
        document.documentElement.classList.remove('Servicos-html-body');
        document.body.classList.remove('Servicos-html-body');
    }
}
</script>


<style>
.Servicos-html-body {
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

.main-headerContainer{
    margin-top: 5rem;
    margin-bottom: 4rem;
    display: flex;
    justify-content: center;
}

.main-header {
    font-family: 'Inter';
    font-weight: bold;
    font-size: 2.3rem;
    color: #003154;
}

.main-tableContainer{
    display: flex;
    justify-content: center;
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