<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Rotatividade</div>
      <div class="number">{{valor}} %</div>
    </div>
  </div>
</template>

<script>
export default {
    props:['total','funcionarios'],
    data(){
        return{
            valor: 0
        }
    },
    methods:{
        dataNesseMes(data){
            data = data.substring(0,10)
            const mesDATA = data.split('/')[1]
            const anoDATA = data.split('/')[2]
            const mesATUAL = (new Date()).getMonth() + 1
            const anoAtual = (new Date()).getFullYear()
            console.log('mesDATA:', mesDATA,'anoDATA: ', anoDATA)
            return ( mesDATA == mesATUAL && anoDATA == anoAtual) ? 1:0
        }
    },
    mounted(){
        const total = this.funcionarios.reduce((valor,func) => {
            valor += this.dataNesseMes(func.adm)  
            valor += func.desligamento == '' ? 0 : this.dataNesseMes(func.desligamento)
            return valor
        },0)
        console.log('total: ',total)
        this.valor = ((total/(2*this.total))*100).toFixed(3)
    }
}
</script>

<style>

</style>