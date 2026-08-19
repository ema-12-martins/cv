<template>
  <div id="app" @keyup.esc="sair" @keyup.s="gravar">
    <div id="pag">
      <nav id="nav">
        <div class="nav-leftContainer">
          <div class="nav-titulo" v-if="tituloPagina == false">Pesquisar Peças</div>
          <div class="nav-titulo" v-if="tituloPagina == true">Sugerir Serviços</div>
        </div>

        <div class="nav-rightContainer">
          <button class="nav-exit" @click.prevent="sair"></button>
        </div>
      </nav>

      <main id="main">
        <div class="texto-inicial">
          Selecione os serviços que deveriam ser realizados:
        </div>
        <form>
          <div class="conteudo">
            <div v-show="tituloPagina == false">
              <div class="servico-form" v-for="peca in pecas" :key="peca.id">
                <label class="label">{{ peca.parte }}</label>
                <input class="check-box" type="checkbox" name="servico1" :value="peca" v-model="selecionarIds"
                  :change="selecionarPeca" @change="peloMenosUmCheckSelecionado" />
              </div>
            </div>
            <div v-show="tituloPagina == true">
              <div class="servico-form" v-for="service in listaDeServicos" :key="service.id">
                <label class="label">{{ service.descr }}</label>
                <input class="check-box" type="checkbox" name="servico1" :value="service" v-model="selecionarIds"
                  :change="selecionarPeca" @change="peloMenosUmCheckSelecionado" />
              </div>
            </div>

          </div>
          <div class="popMostrarAvisoSelecionarVazio" v-if="mostrarAviso">
            <PopUpsErro v-if="mostrarAviso" :idPagina="numeroAviso" />
          </div>
          <div class="popMostrarAvisoSelecionarVazio" v-if="motivoSair">
            <MotivoSair @fecharPopUp="fecharPopAviso" @fechar-pop-up-todo="fecharPopAviso2" :estouPecas="this.estouPecas">
            </MotivoSair>
          </div>
          <div class="container-botao">
            <button v-if="verde" class="botao-gravar" @click.prevent="gravar">Gravar</button>
            <button v-else class="botao-gravar-selecionado" @click.prevent="gravar">Gravar</button>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<script>
import PopUpsErro from "./PopUpsErro.vue";
import MotivoSair from "./MotivoSair.vue";
export default {
  name: "SugerirServicos",
  props: ["mostrarPop", "tituloPagina", "estouPecas"],
  created() {
    if (this.tituloPagina == false) {
      this.pecasValores();
    } else {
      this.sugerirServico();
    }
  },
  components: {
    PopUpsErro,
    MotivoSair,
  },
  data() {
    return {
      servicoId: null,
      mostrarAviso: false,
      motivoSair: false,
      pecas: null,
      numeroAviso: 0,
      selecionarIds: [],
      verde: true,
      idVeiculo: null,
      vehicleType: null,
      listaDeServicos: null,

    };
  },
  mounted() {
    document.documentElement.classList.add("sugerirServicos-html-body");
    document.body.classList.add("sugerirServicos-html-body");
  },
  beforeUnmount() {
    document.documentElement.classList.remove("sugerirServicos-html-body");
    document.body.classList.remove("sugerirServicos-html-body");
  },
  methods: {
    selecionarPeca(event) {
      const selectedId = event.target.value;
      if (event.target.checked) {
        // Add the id to the selectedIds array if checkbox is checked
        this.selecionarIds.push(selectedId);
      } else {
        // Remove the id from the selectedIds array if checkbox is unchecked
        const index = this.selectedIds.indexOf(selectedId);
        if (index !== -1) {
          this.selecionarIds.splice(index, 1);
        }
      }
    },

    peloMenosUmCheckSelecionado() {
      console.log("ns o que escrever para testar")
      // Verifica se pelo menos uma caixa de seleção está marcada
      let umaSelecionada = this.selecionarIds.some(selecionado => selecionado)
      if (umaSelecionada) {
        this.verde = false
      } else {
        this.verde = true
      }
    },

    gravar() {
      // Verifique se selecionarIds está vazio
      if (this.selecionarIds.length === 0) {
        if(this.estouPecas == true){
          this.numeroAviso = 12;
        }
        else{
          this.numeroAviso = 7;
        }
        this.mostrarAviso = true;

        // Esconda o pop-up após 3 segundos
        setTimeout(() => {
          this.mostrarAviso = false;
        }, 3000);

      }else {
        if (this.estouPecas == true) {
          this.numeroAviso = 16;
          this.mostrarAviso = true;
          setTimeout(() => {
            this.mostrarAviso = false;
            this.$emit("guardardadosTabela", this.selecionarIds);
            this.$emit("fecharPop");
          }, 3000);
        }
        else {
          this.numeroAviso = 8;
          this.mostrarAviso = true;
          setTimeout(() => {
            this.mostrarAviso = false;
            this.$emit("guardardadosTabela", this.selecionarIds);
            this.$emit("fecharPop");
            if(this.estouPecas == true){
              this.$router.push("/servicos/agendados");
            }
            else{
              this.$router.push(this.$route.path);
            }
          }, 3000);
        }
      }
    },
    sair() {
      if (this.estouPecas == true) {
        this.numeroAviso = 15;
        this.mostrarAviso = true;

        setTimeout(() => {
          this.mostrarAviso = false;
          this.selecionarIds = [];
          this.$emit("fecharPop");
        }, 3000);
      }
      else {
        if (this.selecionarIds.length === 0) {
          this.$emit("fecharPop");
        } else {
          this.motivoSair = true;
        }
      }
    },
    fecharPopAviso() {
      this.motivoSair = false;
    },
    fecharPopAviso2() {
      this.motivoSair = false;
      this.$emit("fecharPop");
    },
    pecasValores() {
      fetch("http://localhost:3000/pecas")
        .then(response => response.json())
        .then(pecas => {
          this.pecas = pecas;
          console.log(pecas);
        })
    },
    async sugerirServico() {
      try {
        var listLink = this.$route.path.split('/');
        this.servicoId = listLink[2];

        const response1 = await fetch("http://localhost:3000/services/" + this.servicoId);
        const service = await response1.json();
        this.idVeiculo = service["vehicleId"];

        const response2 = await fetch("http://localhost:3000/vehicles/" + this.idVeiculo);
        const veiculo = await response2.json();
        this.vehicleType = veiculo["vehicle-typeId"];

        const response3 = await fetch("http://localhost:3000/vehicle-types/" + this.vehicleType);
        const tipo = await response3.json();
        const listadetipo = tipo.serviços;

        let promises = listadetipo.map(id => fetch(`http://localhost:3000/service-definitions/${id}`).then(response => response.json()));
        let results = await Promise.all(promises);
        this.listaDeServicos = results.map(result => result);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        if (error instanceof TypeError) {
          alert("Não existe veículo associado a esse serviço.");
        } else if (error instanceof SyntaxError) {
          alert("Não existe informações de veículo associado a esse serviço.");
        } else {
          alert("Ocorreu um erro ao buscar os dados necessários para sugerir o serviço.");
        }
        this.$emit("fecharPop");
      }
    }

  },
};
</script>

<style>
.sugerirServicos-html-body {
  margin: 0;
  padding: 0;
  font-size: 0.8vw;
}
</style>

<style scoped>
.popMostrarAvisoSelecionarVazio {
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

#app {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
}

#pag {
  border-radius: 1.9rem;
  border: 0.2rem solid #000000;
  background: #ffffff;
  display: grid;
  grid-template-areas:
    "nav"
    "main";
  grid-template-rows: 1fr 13fr;
  grid-template-columns: 1fr;
  width: 70vw;
}

#nav {
  background-color: #4a82aa;
  grid-area: nav;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top-left-radius: 1.7rem;
  border-top-right-radius: 1.7rem;
}

#main {
  grid-area: main;
}

.nav-titulo {
  position: relative;
  display: inline-block;
  align-self: flex-start;
  overflow-wrap: break-word;
  display: inline-block;
  word-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 3rem;
  color: #ffffff;
}

.nav-exit {
  border: none;
  background: none;
  cursor: pointer;
  background-image: url("../../images/x.svg");
  background-size: cover;
  background-repeat: no-repeat;
  width: 2.15rem;
  height: 2.45rem;
  margin-right: 0.5rem;
}

.nav-leftContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1rem;
}

.nav-rightContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 3rem;
  /* 12rem pelo primeiro e 7rem pelos restantes */
  margin-right: 2rem;
}

.texto-inicial {
  margin: 2rem 0 1rem 4rem;
  overflow-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 2.5rem;
  color: #000000;
}

.conteudo {
  background: #d9d9d9;
  position: relative;
  height: 32rem;
  width: 80rem;
  margin: 0 auto;
  overflow: auto;
}

.servico-form {
  background: #ffffff;
  margin: 0.5rem 2rem 0.5rem 2rem;
  display: inline-block;
  width: 75rem;
  height: 3rem;
  border-radius: 1rem;
}

.check-box {
  margin: 0.8rem 2rem 0 0;
  float: right;
  transform: scale(1.5);
}

.label {
  margin-left: 2rem;
  overflow-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 2rem;
  color: #000000;
}

.container-botao {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 4.3rem;
  margin-top: 2rem;
  align-self: flex-end;
}

.botao-gravar,
.botao-gravar-selecionado {
  background: #63aa6a;
  position: relative;
  padding: 0.5rem 0;
  width: 12rem;
  box-sizing: border-box;
  overflow-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 2.5rem;
  color: #ffffff;
}

.botao-gravar-selecionado {
  cursor: pointer;
}

.botao-gravar-selecionado:hover {
  background-color: #00850D;
}
</style>
