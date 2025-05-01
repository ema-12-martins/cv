<template>
    <servico v-if="servicoPage" @routeUpdated="handleRouteUpdate"></servico>
    <servicoSuspenso v-if="servicoSuspenso" @routeUpdated="handleRouteUpdate"></servicoSuspenso>
    <servicoIniciado v-if="servicoIniciado"></servicoIniciado>
</template>



<script>
import servico from '../pages/Servico.vue';
import servicoSuspenso from '../pages/ServicoSuspenso.vue';
import ServicoIniciado from '../pages/ServicoIniciado.vue';

export default {
    name: 'GestorServicos',
    components: {
        servico,
        servicoSuspenso,
        ServicoIniciado
    },
    emits: ['routeUpdated'],
    data() {
        return {
            baseURL: 'http://localhost:3000/',
            servicoId: null,
            servico: null,
            servicoPage: false,
            servicoSuspenso: false,
            servicoIniciado: false
        }
    },
    created() {
        this.verificarRota();
        this.loadServico();
    },
    methods: {
        verificarRota() {
            var listLink = this.$route.path.split('/')
            this.servicoId = listLink[2];
        },
        loadServico() {
            const url = this.baseURL + 'services/' + this.servicoId;
            fetch(url) 
            .then(response => response.json())
            .then(data => {
                this.servico = data;
                if(this.servico.estado === 'iniciado'){
                    this.servicoIniciado = true
                }else if(this.servico.estado === 'parado'){
                    this.servicoSuspenso = true
                }else if(this.servico.estado === 'naoIniciado' || this.servico.estado === 'realizado'){
                    this.servicoPage = true
                }
            })
            .catch(() => {
                alert("Não existe nenhum serviço com esse identificador")
            });
        },
        handleRouteUpdate() {
            this.servico = null
            this.servicoId = null
            this.servicoPage = false
            this.servicoIniciado = false
            this.servicoSuspenso = false
            this.verificarRota()
            this.loadServico();
        }
    }
}
</script>