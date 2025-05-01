<template>
    <div id="container-Principal" v-if="mostrarPai">
        <div id="PaginaMotivo">
            <nav id="nav">  
                <div class="nav-greetings">
                    Sair
                </div>
            </nav>
    
            <main id="main">
              <div class="container-FrasePrincipal">
                <div class="FrasePrincipal">
                    Tem a certeza que pretende sair?
                </div>
              </div>
    
              <div class="container-FraseSecundaria">
                <div class="FraseSecundaria">
                    As alterações efetuadas não serão guardadas...
                </div>
              </div>
    
                <div class="butoes">
                  <button class="butaoTexto" @click="ativarPopUp()">
                    <span class="texto">
                      Sim
                    </span>
                    <div class="imagemCheckCross">
                      <img class="check" src="@/../images/check.png" />
                    </div>
                  </button>
                    
                  
                  <button class="butaoTexto" @click.prevent="voltarParaPaginaAnterior">
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
      <div class="popUpMotivoNaoGuardado" v-if="mostrarPopUp">
        <PopUpsErro v-if="mostrarPopUp" :idPagina="this.idPagina"/>
        </div>
</template>

<script>

import PopUpsErro from './PopUpsErro.vue';

export default {
    name: 'MotivoSair',
    emits: ['fecharPopUp', 'fecharPopUpTodo'],
    props: ['estouPecas'],
    components:{
        PopUpsErro
    },

    data() {
        return {
            mostrarPopUp: false,
            mostrarPai: true,
            idPagina: null,
        }
    },

    methods:{
        //Lógica para o botão não
        voltarParaPaginaAnterior() {
                this.$emit('fecharPopUp');
        },
        ativarPopUp(){
            if(this.estouPecas == true){
                this.idPagina = 10;
            }
            else{
                this.idPagina = 9;
            }
            this.mostrarPopUp = true;
            this.mostrarPai = false;
            setTimeout(() => {
            this.mostrarPopUp = false;
            this.$emit('fecharPopUpTodo');
            }, 3000);
            
        }
    },    

    mounted() {
        document.documentElement.classList.add('motivoSair-html-body');
        document.body.classList.add('motivoSair-html-body');
    },
    beforeUnmount() {
        document.documentElement.classList.remove('motivoSair-html-body');
        document.body.classList.remove('motivoSair-html-body');
    }
}
</script>

<style>
.motivoSair-html-body{
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
    width: 60.8%;
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
    display: flex;
    justify-content: center;
}

.FrasePrincipal{
    overflow-wrap: break-word;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 4rem;
    color: #000000;
}

.container-FraseSecundaria{
    margin-top: 1.5rem;
    margin-bottom: 4.5rem;
    display: flex;
    justify-content: center;
}

.FraseSecundaria{
    overflow-wrap: break-word;
    font-family: 'Inter';
    font-weight: 400;
    font-size: 2.8rem;
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