import { defineStore } from 'pinia';

export const LoginStore = defineStore({
  id: 'userLogin',
  state: () => ({
    userLogin: -1,
    nomeUtilizador: null,
    idUtilizador: null,
    imagemUtilizador: null
  }),
  actions: {
    setUserLogin(userLogin) {
      this.userLogin = userLogin;
    },
    setNomeUtilizador(nome_utilizador) {
      this.nomeUtilizador = nome_utilizador;
    },
    setIdUtilizador(id_utilizador) {
      this.idUtilizador = id_utilizador;
    },
    setImagemUtilizador(imagem) {
      this.imagemUtilizador = imagem;
    }
  },
  getters: {
    getUserLogin() {
      return this.userLogin;
    },
    getNomeUtilizador(){
      return this.nomeUtilizador;
    },
    getIdUtilizador() {
      return this.idUtilizador;
    },
    getImagemUtilizador() {
      return this.imagemUtilizador;
    }
  },
  persist: {
    enabled: true, 
    strategies: [
      {
        storage: sessionStorage, 
      }
    ]
  }
});