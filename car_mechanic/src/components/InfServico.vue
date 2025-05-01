<template>
    <div class="main-headerContainer">
        <div class="main-header">Informações sobre o serviço</div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Serviço:
            <div class="main-text">{{ servdesc }}</div>
        </div>
    </div>

    <div class="main-textContainer" v-show="agendamento == 'programado'">
        <div class="main-subHeader">
            Hora para terminar:
            <div class="main-text">{{ getHora() }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Tempo do Serviço:
            <div class="main-text">{{ duracao + "m" }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Matrícula:
            <div class="main-text">{{ this.matricula }}</div>
        </div>
    </div>

    <div class="main-textContainer" v-if="this.estado == 'parado'  && this.motivo !== ''">
        <div class="main-subHeader">
            Motivo:
            <div class="main-text">{{ this.motivo }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "infServico",
    props: ["idServico"],
    async created() {
        await this.getDadosServico();
    },
    data() {
        return {
            idservicoDescricao: null,
            estado: null,
            agendamento: null,
            descricao: null,
            motivo: null,
            servdesc: null,
            duracao: null,
            data: null,
            matricula: null,
            hora : null,
            minutos : null
        };
    },
    methods: {
        async getDadosServico() {
            try {
                const response = await fetch("http://localhost:3000/services/" + this.idServico);
                const service = await response.json();
                this.matricula = service.vehicleId;
                this.idservicoDescricao = service.definitionId;
                this.estado = service.estado;
                this.agendamento = service.agendamento;
                if (this.agendamento === "programado") {
                    this.data = service.data;
                }
                this.descricao = service["descrição"];
                this.motivo = service.motivo;
                this.hora = service.data.hora;
                this.minutos = service.data.minutos;
                this.getDadosServicoDef();
            } catch (error) {
                /*alert("Não existe nenhum serviço com esse identificador");*/
                console.error("Erro ao buscar dados:", error);
            }
        },
        getDadosServicoDef() {
            fetch("http://localhost:3000/service-definitions/" + this.idservicoDescricao)
                .then((response) => response.json())
                .then((serviceDef) => {
                    this.servdesc = serviceDef.descr;
                    this.duracao = serviceDef["duração"];
                })
                .catch((error) => {
                    alert("Não existe nenhum nenhuma descrição para esse serviço.")
                    console.error("Erro ao buscar dados:", error);

                });
        },
        getHora() {
            return this.hora + "h" + this.minutos + "m";
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
    justify-content: flex-end;
    margin-right: 2rem;
}
</style>
