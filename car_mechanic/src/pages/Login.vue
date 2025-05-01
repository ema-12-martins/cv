<template>
  <div class="app" id="app" @keyup.enter="validaMecanico">
      <!--Parte antes das caixas-->
      <div class="container-parte_cima">
          <div class="container-login-bem_vindo_posto">
              <div class="login-bem_vindo">Bem-vindo!</div>
              <div class="login-posto" >Encontra-se no posto {{ num_posto }}!</div>
          </div>

          <div class="container-data">
              <div class="login-data">{{dataAtual}}</div>
              <div class="login-horas">{{horaAtual}}</div>
          </div>
      </div>

      <!--Caixas-->
      <div class="container-grid">
          <div class="login-grid">
              <img src="../../images/person.png" class='login-imagem' id="login-image1" alt="Icon pessoa">
              <input type="text" id="login-caixa1" class="login-caixa" name="texto"  :value="nome_mecanico" @input="setNomeMecanico">

              <img src="../../images/key.png" class='login-imagem' id="login-image2" alt="Icon pessoa">
              <input type="password" id="login-caixa2" class="login-caixa" name="texto" :value="pass_mecanico" @input="setPassMecanico">
          </div>
      </div>

      <div class="container-login-pass">
          <!--Botao login-->
          <button class="login-botao" id="texto" name="texto" @click="validaMecanico">Login</button>
      </div>
  </div>   
  <PopUpsErro class="popUpMotivoNaoGuardado" v-if="mostrarPopUp" :idPagina="keyPopUp"/>
</template>


<script>
import { LoginStore } from "../store/LoginStore.js";
import PopUpsErro from '../components/PopUpsErro.vue';

export default {
  name: 'LoginPage',
  components: {
        PopUpsErro
    },

  props: {
    msg: String,
  },
  data() {
        return {
            nome_mecanico: "",
            pass_mecanico: "",
            dataAtual: '',
            horaAtual: '',
            mostrarPopUp:false,
            keyPopUp:1,
            num_posto: 4
        }
  },

  created() {
    // Inicia o relógio ao criar o componente
    this.atualizarDataEHora();
    // Verifica a hora a cada segundo
    setInterval(this.atualizarDataEHora, 1000);
  },

  methods: {
        setNomeMecanico(event){
          this.nome_mecanico=event.target.value
        },
        setPassMecanico(event){
          this.pass_mecanico=event.target.value
        },
        ativarEdesativarPopUp(){
            this.mostrarPopUp=true;
            setTimeout(() => {
              this.mostrarPopUp = false;
              let atual = this.$route.path;
              this.$router.push(atual);
            }, 3000);
        },

        validaMecanico() { 
          let nome = this.nome_mecanico.trim()
          let pass = this.pass_mecanico.trim()

          fetch('http://localhost:3000/mecanicos?nome_utilizador=' + nome)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('Something went wrong');
            }
          })
          .then(data => {
            const mecanico= data[0]
            if(mecanico.pass_utilizador==pass){
              if(mecanico.posto==this.num_posto){
                LoginStore().setNomeUtilizador(nome);
                LoginStore().setIdUtilizador(mecanico.id);
                LoginStore().setImagemUtilizador(mecanico.foto);
                this.$router.push("/servicos/agendados");
              }else{
                this.nome_mecanico=""
                this.pass_mecanico=""
                this.keyPopUp=3
                this.ativarEdesativarPopUp()
              }
            }else{
              this.nome_mecanico=""
              this.pass_mecanico=""
              this.keyPopUp=2
              this.ativarEdesativarPopUp()
            }
          })
          .catch(error => {
            this.keyPopUp = 1;
            this.ativarEdesativarPopUp();
            console.log(error);
          });
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
        }
    },

  mounted() {
    document.documentElement.classList.add('login-html-body');
    document.body.classList.add('login-html-body');
  },
  beforeUnmount() {
    document.documentElement.classList.remove('login-html-body');
    document.body.classList.remove('login-html-body');
  }
}

</script>

<style>
.login-html-body{
  height: auto;
  padding: 0;
  font-size: 0.8vw;
  font-family: 'Open Sans', sans-serif;
  background: linear-gradient(#DDEFFF, #002B53);
  background-repeat: no-repeat;
  background-attachment: fixed; 
}
</style>


<style scoped>
.app {
  /*Para centrar*/
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  position: absolute;
  background-color: white;
  color: black;
  width: 50%;
  height: auto;
  border-radius: 30px; /* Arredondar as bordas em 5px */

  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}

/*-------------------------------PARTE DE CIMA---------------------------------------------------*/
.login-bem_vindo{
  text-align: center; /* Centralizar o texto horizontalmente */
  font-size: 6rem;
  font-weight: bold;
}

.login-posto{
  text-align: center; 
  font-size: 2rem;
}

.login-data{
  text-align: center; 
  font-size: 1.6rem;
}

.login-horas{
  text-align: center;
  font-size: 1.6rem;
}

/*--------------------------------CAIXAS E IMAGENS--------------------------------------------------*/
.login-caixa {
  display: flex;
  width: 85%; 
  height: 40%; 
  padding: 1rem;
  font-size: 1.5rem;
  margin: 0 auto;
  border: 1px solid #C4E6FF; /* Adicionar borda preta de 1px */
  border-radius: 10px; /* Arredondar as bordas em 5px */
  background-color: #C4E6FF;
}

.login-imagem{
  margin-left: 3rem;
  width: 60%; 
  height: 90%;
  display: flex;
}

.login-grid{
  display: grid;
  grid-template-columns: 0.8fr 5fr;
  grid-template-rows:auto auto;
  grid-template-areas: 
      "login-imagem1  login-caixa1"
      "login-imagem2  login-caixa2"
      ;
}

#login-image1 {
  grid-area: login-imagem1;
}

#login-caixa1 {
  grid-area: login-caixa1;
}

#login-image2 {
  grid-area: login-imagem2;
}

#login-caixa2 {
  grid-area: login-caixa2;
}

/*-------------------------------------FUNDO---------------------------------------------------*/
.login-botao{
  display: block;
  margin: 0 auto;
  font-size: 2rem;
  padding: 1rem 2rem;

  border: 1px solid #C4E6FF; /* Adicionar borda preta de 1px */
  border-radius: 10px; /* Arredondar as bordas em 5px */
  background-color: #C4E6FF;
  cursor: pointer; /*Passar o rato para uma mao quando estamos sobre o botao*/
}

.login-relembra_pass{
  text-align: center; 
  font-size: 1.6rem;
  cursor: pointer;
}

/*----------------------------Componentes-------------------------------------------------------*/

.container-login-bem_vindo_posto{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 65%;
}

.container-data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 5%;
  margin-top: 3rem;
}

.container-parte_cima{
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.container-login-pass{
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.container-grid{
  margin-top: 4rem;
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

</style>