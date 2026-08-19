<template>
    <div class="main-headerContainer">
        <div class="main-header">Informações sobre o Veículo</div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Matrícula:
            <div class="main-text">{{ idVeiculo}}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Marca:
            <div class="main-text">{{ this.marca }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Modelo:
            <div class="main-text">{{ this.modelo }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Tipo Motor:
            <div class="main-text">{{ this.tipoMotor }}</div>
        </div>
    </div>

    <div class="main-textContainer">
        <div class="main-subHeader">
            Cilidrada/Potencia:
            <div class="main-text">{{ this.cilindrada  }}</div>
        </div>
    </div>
    <div class="main-textContainer">
        <div class="main-subHeader">
            Quilometragem do veículo:
            <div class="main-text"> {{  this.kms }}</div>
        </div>
    </div>
</template>






<script>
export default {
    name: 'infVeiculo',
    props : ['idServico'],
    created() {
        this.getIdVeiculo();
    },
    data() {
        return {
            idVeiculo: null,
            modelo: null,
            marca: null,
            tipoMotor: null,
            cilindrada: null,
            kms: null
        }
    },
    methods: {
        getIdVeiculo(){
            fetch("http://localhost:3000/services/" + this.idServico) 
            .then(response => response.json())
            .then(service => {
                this.idVeiculo =  service.vehicleId;
                this.getInfVeiculo();
            })
            .catch ((error) => {
                alert("Não existe veiculo associado a esse servico.")
                console.error("Erro ao buscar dados:", error);
            });
        },
        getInfVeiculo(){
            fetch("http://localhost:3000/vehicles/" + this.idVeiculo) 
            .then(response => response.json())
            .then(vaiculo => {
                this.marca = vaiculo.Marca;
                this.modelo = vaiculo.Modelo;
                this.tipoMotor = vaiculo["vehicle-typeId"];
                this.cilindrada = vaiculo.cilindrada;
                this.kms = vaiculo.kms;
                

            })
            .catch ((error) => {
                alert("Não existe nenhuma descrição associada a esse veiculo.")
                console.error("Erro ao buscar dados:", error);
            });

    
        }
    }
    
}

</script>


<style scoped>
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

.main-subHeader,
.main-text {
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


