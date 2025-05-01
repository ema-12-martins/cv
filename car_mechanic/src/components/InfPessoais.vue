<template>
  <div class="main-headerContainer">
    <div class="main-header">Informações sobre o Mecânico</div>
  </div>

  <div class="main-textContainer">
    <div class="main-subHeader">
      Número de Funcionário:
      <div class="main-text">
        {{ this.idMecanico }}
      </div>
    </div>
  </div>

  <div class="main-textContainer">
    <div class="main-subHeader">
      Nome:
      <div class="main-text">
        {{ this.nome }}
      </div>
    </div>
  </div>

  <div class="main-textContainer">
    <div class="main-subHeader">
      Especialização:
      <div class="main-text">
        {{ this.especializacao }}
      </div>
    </div>
  </div>
</template>

<script>
import { LoginStore } from "../store/LoginStore.js";

export default {
  name: "infPessoais",
  data() {
    return {
      idMecanico: null,
      nome: null,
      especializacao: null,
    };
  },
  created() {
    this.getInfMecanico()
  },
  methods: {
    getInfMecanico() {
    this.idMecanico = LoginStore().getIdUtilizador;
    fetch("http://localhost:3000/mecanicos/" + this.idMecanico)
      .then((response) => response.json())
      .then((mecanico) => {
          this.nome = mecanico.nome_utilizador;
          this.especializacao = mecanico.especializacao;          
      })
      .catch((error) => {
        alert("Não existe dados associados ao mecânico.");
        console.error("Erro ao buscar dados:", error);
      });
    },
  },
};
</script>

<style scoped>
.main-headerContainer {
  margin-top: 5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.main-header {
  font-family: "Inter";
  font-weight: bold;
  font-size: 2.3rem;
  color: #003154;
}

.main-textContainer {
  margin-left: 5rem;
}

.main-subHeader,
.main-text {
  display: inline-block;
  font-family: "Inter";
  color: #000000;
}

.main-subHeader {
  font-weight: bold;
  font-size: 2.2rem;
}

.main-text {
  font-weight: normal;
  font-size: 2rem;
}

.main-buttonContainer {
  display: flex;
  justify-content: right;
  margin-right: 2rem;
}

.main-button {
  background-color: #4a82aa;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0.9rem 0 0.9rem 0rem;
  width: 17.5%;
  font-family: "Inter";
  font-weight: normal;
  font-size: 2.5rem;
  color: #ffffff;
}
</style>
