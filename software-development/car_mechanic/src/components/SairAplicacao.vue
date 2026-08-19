<template>

    <div id="container-Principal">
        <div id="PaginaMotivo">
            <nav id="nav">  
                <div class="nav-greetings">
                    Sair
                </div>
            </nav>
    
            <main id="main">
              <div class="container-FrasePrincipal">
                <div class="FrasePrincipal">
                  Tem a certeza que pretende sair da aplicação?
                </div>
              </div>
    
              <div class="butoes">
                <button class="butaoTexto" @click="voltarParaLogin">
                  <span class="texto">
                    Sim
                  </span>
                  <div class="imagemCheckCross">
                    <img class="check" src="@/../images/check.png" />
                  </div>
                </button>
                <button class="butaoTexto" @click="voltarParaPaginaAnterior">
                  <span class="texto">
                    Não
                  </span>
                  <div class="imagemCheckCross">
                    <img class="cross" src="@/../images/cross.png" />
                  </div>
                </button>
              </div>
            </main>
        </div>  
      </div>

</template>


<script>
import { LoginStore } from '../store/LoginStore.js'

export default {
    name: 'SairAplicacao',
    emits: ['fecharPopUp'],
    methods: {
        voltarParaLogin() {
            LoginStore().$reset();
            this.$router.push('/');
        },
        // Afinal é com emits
        voltarParaPaginaAnterior() {
            this.$emit('fecharPopUp');
        }
  },

    mounted() {
        document.documentElement.classList.add('sairAplicacao-html-body');
        document.body.classList.add('sairAplicacao-html-body');
    },
    beforeUnmount() {
        document.documentElement.classList.remove('sairAplicacao-html-body');
        document.body.classList.remove('sairAplicacao-html-body');
    }
}

</script>

<style>
.sairAplicacao-html-body{
    margin: 0;
    padding: 0;
    font-size: 0.8vw;
    height: 100%;
}
</style>

<style scoped>
#container-Principal {
    height: 100vh;
    display: flex;
    justify-content: center; 
    align-items: center; 
}

#PaginaMotivo {
    border-radius: 1.9rem;
    border: 0.2rem solid #000000;
    background: #B1AAAA;
    display: grid; 
    grid-template-areas:
        "nav"
        "main";
    grid-template-rows: auto auto; 
    grid-template-columns: 1fr; 
    padding-bottom: 8.1rem;
    width: 65vw;
}

#nav {
    grid-area: nav;
    border-top-left-radius: 1.7rem;
    border-top-right-radius: 1.7rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background: #4A82AA;
}

.nav-greetings {
    position: relative;
    margin-left: 1.0rem;
    display: inline-block;
    align-self: flex-start;
    overflow-wrap: break-word;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 3rem;
    color: #FFFFFF;
}

#main {
    grid-area: main;
}

.container-main{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.container-FrasePrincipal{
    margin-top: 5rem;
    margin-bottom: 4.5rem;
    display: flex;
    justify-content: center;
}

.FrasePrincipal{
    text-align: center;
    overflow-wrap: break-word;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 4rem;
    color: #000000;
}

.butoes{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 53.6rem;
    box-sizing: border-box;
    margin: auto;
}

.butaoTexto{
    background: #FFFFFF;
    position: relative;
    display: flex;
    flex-direction: row;
    padding: 0.9rem 0.95rem 0.9rem 0.95rem;
    width: 41.5%;
    box-sizing: border-box;
    cursor: pointer;
    border: 0.05rem solid;
    overflow-wrap: break-word;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 4rem;
    color: #000000;
}

.texto{
    margin-right: 3rem;
    margin-left: 3rem;
}

.imagemCheckCross{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 6rem;
    height: 4.6rem;
}

.check{
    width: 6rem;
    height: 4.6rem;
}

.cross{
    width: 5.5rem;
    height: 4.6rem;
}
</style>