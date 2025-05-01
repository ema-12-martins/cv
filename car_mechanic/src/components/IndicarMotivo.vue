<template>
  <div id="app" @keyup.esc="sair" @keyup.s="buttomEnviarGuardar">
    <div class="popMostrarAvisoSelecionarVazio" v-if="mostrarAviso">
      <PopUpsErro v-if="mostrarAviso" :idPagina="numeroAviso" />
    </div>
    <div class="popMostrarAvisoSelecionarVazio" v-if="motivoSair">
      <MotivoSair @fecharPopUp="fecharPopAviso" @fecharPopUpTodo="fecharPopTodo" :estouPecas="true">
      </MotivoSair>
    </div>
    <div id="pag">
      <nav id="nav">
        <div class="nav-leftContainer">
          <div class="nav-titulo">Serviço Suspenso</div>
        </div>

        <div class="nav-rightContainer">
          <button class="nav-exit" @click="sair"></button>
        </div>
      </nav>

      <main id="main">
        <form>
          <div class="selecao-motivo">
            <div class="texto">Motivo:</div>
            <div class="container-select">
              <select id="motivos" @change="meterBotaoVerde" v-model="motivoSelecionado">
                <option hidden value="">Selecionar Motivo</option>
                <option v-for="motivo in motivos" :key="motivo.id" :value="motivo">
                  {{ motivo.motivo }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <div v-show="tabelaValor()">
              <div class="falta-pecas-pesquisar">
                <div class="texto">Peças em Falta:</div>
                <div>
                  <button id="botao-pesquisar" @click.prevent="togglePopup">
                    Pesquisar
                  </button>
                  <sugerirServicos v-show="mostrarPop" class="pop_sugerir_servico" :mostrarPop="mostrarPop"
                    @fecharPop="mostrarPop = false" @guardardadosTabela="guardardados" :titulo-pagina="false"
                    :estouPecas="this.estouPecas">
                  </sugerirServicos>
                </div>
              </div>
              <div>
                <div class="falta-pecas-tabela">
                  <table class="table">
                    <thead>
                      <tr>
                        <th class="header-cell">Identificador</th>
                        <th class="header-cell">Peça</th>
                        <th class="header-cell">Quantidade</th>
                      </tr>
                    </thead>
                    <tbody class="cell-scroll">
                      <tr v-for="parte in selecionarIds" :key="parte.id">
                        <td class="cell">{{ parte.id }}</td>
                        <td class="cell">{{ parte.parte }}</td>
                        <td class="cell">
                          <input type="number" class="imput_numero" v-model.number="parte.numero"
                            @input="meterBotaoVerde">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="container-botao">
              <button v-if="verde" class="botao-gravar" type="submit"
                @click.prevent="buttomEnviarGuardar">Gravar</button>
              <button v-else class="botao-gravar-selecionado" type="submit"
                @click.prevent="buttomEnviarGuardar">Gravar</button>
            </div>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

<script>
import sugerirServicos from "./SugerirServicos.vue";
import PopUpsErro from "./PopUpsErro.vue";
import MotivoSair from "./MotivoSair.vue";
export default {
  name: "indicarMotivo",
  props: ["estouPecas"],
  emits: ["fecharPopUp", "fecharPopUpMotivo", "cruz"],
  components: {
    sugerirServicos,
    PopUpsErro,
    MotivoSair,
  },
  created() {
    this.carregarMotivos();
  },
  watch: {},
  data() {
    return {
      mostrarPop: false,
      motivoSair: false,
      motivoSelecionado: "",
      selecionarIds: [],
      mostrarAviso: false,
      numeroAviso: 0,
      verde: true,
      motivos: "",
    };
  },
  methods: {
    fecharPop() {
      this.mostrarPop = false;
    },
    togglePopup() {
      this.mostrarPop = !this.mostrarPop;
    },
    tabelaValor() {
      if (this.motivoSelecionado === "") {
        return false;
      }
      const indice = parseInt(this.motivoSelecionado.id);

      if (this.motivos[indice - 1] && this.motivos[indice - 1].tabela) {
        return true;
      } else {
        return false;
      }
    },
    meterBotaoVerde() {
      if (this.motivoSelecionado !== "" && this.motivoSelecionado.id !== 3) {
        this.verde = false;

      } else if (this.motivoSelecionado.id === 3) {
        if (this.selecionarIds.length == 0) {
          this.verde = true
        } else if (!this.selecionarIds.every(pecas => pecas.numero > 0)) {
          this.verde = true
        } else {
          this.verde = false
        }
      }
    },
    guardardados(dados) {
      this.selecionarIds = dados;
    },
    buttomEnviarGuardar() {
      if (this.motivoSelecionado === "") {
        this.mostrarAviso = true;
        this.numeroAviso = 11;
        setTimeout(() => {
          this.mostrarAviso = false;
        }, 3000);
      }
      else if (this.motivoSelecionado.motivo == "Falta de peças" && this.selecionarIds.length == 0){
        this.mostrarAviso = true;
        this.numeroAviso = 12;
        setTimeout(() => {
          this.mostrarAviso = false;
        }, 3000);
      }
      else if (!this.selecionarIds.every(pecas => pecas.numero > 0)) {
        this.mostrarAviso = true;
        this.numeroAviso = 13;
        setTimeout(() => {
          this.mostrarAviso = false;
        }, 3000);
      } else {
        var listLink = this.$route.path.split('/');
        var servicoId = listLink[2];
        fetch('http://localhost:3000/services/' + servicoId, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            estado: "parado",
            motivo: this.motivoSelecionado.motivo
          })
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Erro ao atualizar o estado.');
            }
            console.log('Estado atualizado com sucesso.');
          })
          .catch(error => {
            console.error('Erro ao fazer a requisição:', error);
          });



        this.mostrarAviso = true;
        this.numeroAviso = 14;
        setTimeout(() => {
          this.mostrarAviso = false;
          this.$emit("fecharPopUp");
        }, 3000);
      }
    },
    sair() {
      if (this.motivoSelecionado === "") {
        this.sairPop();
      } else if(!this.mostrarPop) {
        this.motivoSair = true;
      }
    },
    fecharPopAviso() {
      this.motivoSair = false;
    },
    fecharPopTodo() {
      this.motivoSair = false;
      this.$emit("fecharPopUpMotivo");
    },
    sairPop() {
      this.$emit("cruz");
      console.log("sair");
    },
    carregarMotivos() {
      fetch("http://localhost:3000/motivos")
        .then((response) => response.json())
        .then((motivo) => {
          this.motivos = motivo;
        })
        .catch((error) => {
          console.error("Erro:", error);
        });

    }
  }
};
</script>

<style scoped>
.scroll {
  max-height: 12rem;
  overflow-y: scroll;
  display: block;
}

.imput_numero {
  border: none;
  font-size: 1.25rem;
  width: 100%;
}

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
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.pop_sugerir_servico {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  visibility: auto;
}

#pag {
  border-radius: 1.9rem;
  border: 0.2rem solid #000000;
  background: #ffffff;
  display: grid;
  grid-template-areas:
    "nav"
    "main";
  grid-template-rows: 1fr 12.5fr;
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

.nav-return {
  border: none;
  background: none;
  cursor: pointer;
  background-image: url("../../images/return.svg");
  background-size: cover;
  background-repeat: no-repeat;
  width: 2.7rem;
  height: 2.45rem;
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

.selecao-motivo {
  display: flex;
  width: 75%;
  align-items: center;
  margin: 4rem auto;
}

.texto,
.motivos {
  flex: 0 0 auto;
}

.falta-pecas-pesquisar {
  display: flex;
  width: 75%;
  align-items: center;
  margin: 0 auto;
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.texto,
.botao-pesquisa {
  flex: 0 0 auto;
}

.texto {
  overflow-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 1.9rem;
  color: #000000;
}

.container-select {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

#motivos {
  margin-left: 2rem;
  border-radius: 1.9rem;
  background: #d9d9d9;
  position: relative;
  padding: 0.5rem 2rem;
  width: 56rem;
  box-sizing: border-box;
  overflow-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 1.9rem;
  color: #000000;
}

.botao-pesquisa {
  margin-left: 2rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

#botao-pesquisar {
  border-radius: 1.9rem;
  border: 0.1rem solid #000000;
  background: #c4e6ff;
  position: relative;
  box-sizing: border-box;
  padding: 0rem 1rem;
  width: 12rem;
  overflow-wrap: break-word;
  font-family: "Inter";
  font-weight: 400;
  font-size: 1.9rem;
  color: #000000;
}

.falta-pecas-tabela {
  display: flex;
  justify-content: center;
}

.table {
  display: block;
  width: 52.5rem;
}

.header-cell {
  background-color: #e5e5e5;
  position: relative;
  border: 0.1rem solid #828282;
  justify-content: center;
  width: 17.5rem;
  height: 5rem;
  box-sizing: border-box;
  word-wrap: break-word;
  font-family: "Inter";
  font-size: 1.5rem;
  line-height: 1;
  color: #000000;
}

.cell-scroll {
  max-height: calc(2 * (5.15rem));
  overflow-y: auto;
  display: block;
}

.cell {
  position: relative;
  border: 0.1rem solid #828282;
  width: 17.5rem;
  height: 5rem;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
  word-wrap: break-word;
  font-family: "Inter";
  font-size: 1.25rem;
  line-height: 1;
  color: #000000;
}

.container-botao {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 4.3rem;
  margin-top: 1rem;
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
  margin-top: 2rem;
}

.botao-gravar-selecionado {
  cursor: pointer;
}

.botao-gravar-selecionado:hover {
  background-color: #00850D;
}
</style>
