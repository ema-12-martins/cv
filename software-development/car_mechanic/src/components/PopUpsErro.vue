<template>
    <div class="frame"> 
        <div class="frame_bordContainer">
            <div class="frame_bord">
                <img class=imagem_erro :src="getImageSrc()">
                <h1 class="texto">
                    {{ erros[`key${idPagina}`].texto }} 
                </h1>
            </div>
        </div>
        
        <div class="background_frame"></div>
    </div>
</template>

<script>
export default {
    name: 'PopUpsErro',
    props: ['idPagina'],
    data() {
        return {
            erros:{
                key1: { texto: "O utilizador não existe!", imagem: "imagem3.png" },
                key2: { texto: "A palavra-passe está incorreta!", imagem: "imagem3.png" },
                key3: { texto: "Não pertence a este posto!", imagem: "imagem3.png"},
                key4: { texto: "Serviço inicializado!", imagem: "imagem5.png"},
                key5: { texto: "Serviço terminado!", imagem: "imagem5.png"},
                key6: { texto: "Serviço retomado!", imagem: "imagem5.png"},
                key7: { texto: "Selecione pelo menos um serviço!", imagem: "imagem7.png"},
                key8: { texto: "Serviço Sugerido Guardado!", imagem: "imagem5.png"},
                key9: { texto: "Serviço Sugerido Não Guardado!", imagem: "imagem3.png"},
                key10: { texto: "Motivo Não Guardado!", imagem: "imagem3.png"},
                key11: { texto: "Deve indicar um motivo!", imagem: "imagem7.png"},
                key12: { texto: "Escolha pelo menos uma peça!", imagem: "imagem7.png"},
                key13: { texto: "Deve preencher o campo quantidade!", imagem: "imagem7.png"},
                key14: { texto: "Motivo gravado com sucesso!", imagem: "imagem5.png"},
                key15: { texto: "Peça Não Guardada!", imagem: "imagem3.png"},
                key16: { texto: "Peça Guardada!", imagem: "imagem5.png"},
                
            }
        }
    },    
    methods:{
        getImageSrc() {
           return require(`@/../images/${this.erros[`key${this.idPagina}`].imagem}`);
        }   
    },

    mounted() {
        document.documentElement.classList.add('popUpsErro-html-body');
        document.body.classList.add('popUpsErro-html-body');
    },
    beforeUnmount() {
        document.documentElement.classList.remove('popUpsErro-html-body');
        document.body.classList.remove('popUpsErro-html-body');
    }
}
</script>


<style>
.popUpsErro-html-body{
    margin: 0;
    padding: 0;
    font-size: 0.8vw;
    height: 100%;
}
</style>


<style scoped>
.frame {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
  } 
  
  .frame_bordContainer{
    margin-bottom: 20rem;
    margin-right: -1rem;
  }
  
  .frame_bord {
    border-radius: 2rem;  
    border: 0.1rem solid #000000;
    background: #FFFFFF;
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; 
    padding: 3rem 2rem 3rem 2rem;
    width: calc(40% - 1rem); 
    box-sizing: border-box;
  }
  
  .texto {
    font-family: sans-serif;
    color: #000000;
    font-size: 2.5rem; 
    text-align: center;
    height: 100%; 
    width: 70%;
  }
  
  .background_frame {
    border-radius: 2rem;
    background: #063057;
    height: 19rem;
    width: calc(40% - 1rem); /* Largura fixa */
  }
  
  .imagem_erro {
    background-size: contain;
    background-repeat: no-repeat;
    text-align: center;
    height: 12rem;
  }
</style>