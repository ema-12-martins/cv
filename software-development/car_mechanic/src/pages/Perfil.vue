<template>
    <div id="app">
        <main id="main">
            <div v-if="servRealizados">
                <div class="main-headerContainer-servRealizados">
                    <div class="main-header">
                        Informações sobre os Serviços Realizados
                    </div>
                </div>
                <div class="main-tableContainer">
                    <TableComponent></TableComponent>
                </div>
            </div>
            <div v-if="infPessoais" class="main-container-infPessoais">
                <infPessoais></infPessoais>
            </div>
        </main>

        <footer id="footer">
            <div class="footer-content"></div>
        </footer>
        
        <navBar :paginaServico="true"></navBar>    
        <sidePainel></sidePainel>
    </div>
</template>

<script>
import navBar from '../components/Nav.vue';
import sidePainel from '../components/Side.vue';
import TableComponent from '../components/Table.vue';
import infPessoais from '../components/InfPessoais.vue';

export default {
    name: 'PaginaPerfil',
    components: {
        navBar, 
        sidePainel,
        TableComponent,
        infPessoais
    },
    data() {
        return {
            servRealizados: false,
            infPessoais: false,
        }
    },
    created() {
        this.verificarRota();
        document.documentElement.classList.add('Perfil-html-body');
        document.body.classList.add('Perfil-html-body');
    },
    methods: {
        verificarRota() {
            // Verifica a rota atual e define as variáveis com base nela
            const listLink = this.$route.path.split('/');
            this.servRealizados = listLink[2] === 'servRealizados';
            this.infPessoais = listLink[2] === 'infPessoais';
        }
    },
    watch: {
        // Observa mudanças na rota e chama verificarRota novamente
        $route() {
            this.verificarRota();
        }
    }
};
</script>

<style>
.Perfil-html-body {
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

.main-container-infPessoais {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 70%;
}

.main-headerContainer-servRealizados {
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

.main-tableContainer {
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