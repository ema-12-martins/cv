<template>
    <div class="popUpSairAplicacao" v-if="mostrarPopUp">
        <SairAplicacao @fecharPopUp="fecharPopUp()"/>
    </div>
    <nav id="nav">  
        <div class="nav-leftContainer">
            <div class ="nav-greetings">
                Bem-vindo, {{nome}}
            </div>
        </div>
        
        <div :class="{'nav-rightContainer2': checkTipo('servicos'), 'nav-rightContainer4': checkTipo('perfil'), 'nav-rightContainer3': checkTipo('servico')}">
            <button @click="abrirPopUp()" v-if="checkTipo('perfil')" class="nav-exit"></button>
            <button @click="paginaAnterior()" v-if="!checkTipo('servicos')" class="nav-return" v-bind:style="{ cursor: String(servicoIniciado) === 'true' ? 'not-allowed' : 'pointer' }"></button>
            <div class="nav-date">
                {{ dataAtual }}
                <br>
                {{ horaAtual }}
            </div>
            <button @click="mudarPagina('/perfil/infPessoais')" class="nav-photo" v-bind:style="{ cursor: String(servicoIniciado) === 'true' ? 'not-allowed' : 'pointer' }">
                <img class="imagem" :src="getImageSrc()">
            </button>
        </div>
    </nav>
</template>


<script>
import SairAplicacao from './SairAplicacao.vue';
import { LoginStore } from '../store/LoginStore.js'

export default {
    name: 'navBar',
    props: ["paginaServico", "servicoIniciado"],

    components: {
        SairAplicacao
    },

    data() {
        return {
            mostrarPopUp: false,
            dataAtual: '',
            horaAtual: ''    
        }
    },

    setup() {
        const user = LoginStore()

        return {
            nome: user.getNomeUtilizador,
            image: user.getImagemUtilizador
        }
    },

    created() {
    // Inicia o relógio ao criar o componente
    this.atualizarDataEHora();
    // Verifica a hora a cada segundo
    setInterval(this.atualizarDataEHora, 1000);
  },

    methods: {
        mudarPagina(rota) {
            if(this.servicoIniciado != true){
            this.$router.push(rota);
            }
        },
        checkTipo(tipo) {
            var listLink = this.$route.path.split('/')
            return listLink[1] == tipo;
        },
        abrirPopUp(){
            this.mostrarPopUp = true;
        },
        fecharPopUp(){
            this.mostrarPopUp = false;
        },
        paginaAnterior(){
            if(this.paginaServico == true){
                this.$router.push("/servicos/agendados");
            }
            else if (this.paginaServico == false){
                this.$router.push("/perfil/servRealizados");
            }
            
        },
        atualizarDataEHora() {
        const dataAtual = new Date();
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        const ano = dataAtual.getFullYear();
        const hora = String(dataAtual.getHours()).padStart(2, '0');
        const minutos = String(dataAtual.getMinutes()).padStart(2, '0');
        this.dataAtual = `${dia}-${mes}-${ano}`;
        this.horaAtual = `${hora}:${minutos}`;
        },
        getImageSrc() {
            try {
                return require(`@/../images/${this.image}`);
            } catch (error) {
                return require("@/../images/552721.png");
            }
        }
    }
}
</script>   


<style scoped>

#nav {
    background-color: #4A82AA;
    grid-area: nav;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.nav-leftContainer{
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: 1rem;
}

.nav-greetings {
    display: inline-block;
    word-wrap: break-word;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 3rem;
    color: #FFFFFF;
}

.nav-rightContainer2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 19rem; /* 12rem pelo primeiro e 7rem pelos restantes */
    margin-right: 1rem;
}

.nav-rightContainer3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 26rem; /* 12rem pelo primeiro e 7rem pelos restantes */
    margin-right: 1rem;
}

.nav-rightContainer4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 33rem; /* 12rem pelo primeiro e 7rem pelos restantes */
    margin-right: 1rem;
}

.nav-date {
    display: inline-block;
    text-align: center;
    word-wrap: break-word;
    font-family: 'Inter';
    font-weight: normal;
    font-size: 2rem;
    color: #FFFFFF;
}

.nav-return {
    border: none;
    background: none;
    cursor: pointer;
    background-image: url('../../images/return.svg');
    background-size: cover;
    background-repeat: no-repeat;
    width: 4.5rem;
    height: 4rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
}  

.nav-exit {
    border: none;
    background: none;
    cursor: pointer;
    background-image: url('../../images/exit.svg');
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url('../../images/exit.svg');
    width: 5.5rem;
    height: 5.5rem;
}

.nav-photo {
    border: none;
    background: none;
    cursor: pointer;
    background-size: cover;
    background-repeat: no-repeat;
    width: 5.5rem;
    height: 5.5rem;
}

.imagem{
    height: 5rem;
    padding-top: 0.15rem;
}

.popUpSairAplicacao {
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