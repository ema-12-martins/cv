<template> 
    <div class="main-headerContainer">
        <div class="main-header">Informações sobre o Cliente</div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Nome do Cliente:
            <div class="main-text">{{ nome }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Nº Contacto:
            <div class="main-text">{{ telefone }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            NIF:
            <div class="main-text">{{ nif }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Email:
            <div class="main-text">{{ email }}</div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'infCliente',
    props : ['idServico'],
    created() {
        this.getIdVaiculo();
    },
    data() {
        return {
            idVeiculo: null,
            idCliente: null,
            nome: null,
            email: null,
            telefone: null,
            nif: null
        }
    },
    methods: {
        getIdVaiculo(){
            fetch("http://localhost:3000/services/" + this.idServico) 
            .then(response => response.json())
            .then(service => {
                this.idVeiculo =  service.vehicleId;
                this.getIdCliente();

            })
            .catch ((error) => {
                alert("Não existe nenhum veiculo associado a esse servico.")
                console.error("Erro ao buscar dados:", error);
            });
        },
        getIdCliente(){
            fetch("http://localhost:3000/vehicles/" + this.idVeiculo) 
            .then(response => response.json())
            .then(vaiculo => {
                this.idCliente = vaiculo.clientId;
                this.getInfCleinte();
            })
            .catch ((error) => {
                alert("Não existe nenhum cliente com associado a esse veiculo.")
                console.error("Erro ao buscar dados:", error);
            });
        },
        getInfCleinte(){
            fetch("http://localhost:3000/clients/" + this.idCliente) 
            .then(response => response.json())
            .then(vaiculo => {  
                this.idCliente = vaiculo.clientId;
                this.nome = vaiculo.nome;
                this.email = vaiculo.email;
                this.telefone = vaiculo.telefone;
                this.nif = vaiculo.Nif;
            })
            .catch ((error) => {
                alert("Não existe nenhum dados associado a esse cliente.")
                console.error("Erro ao buscar dados:", error);
            });

        }
    }
}
</script>



<style scoped>
.main-container{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.main-headerContainer {
    margin-top: 5rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
}

.main-header {
    font-family: 'Inter';
    font-weight: bold;
    font-size: 2.3rem;
    color: #003154;
}

.main-textContainer {
    margin-left: 5rem;
}

.main-subHeader, .main-text {
    display: inline-block;
    font-family: 'Inter';
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
