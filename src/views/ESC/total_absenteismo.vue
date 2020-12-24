<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Absenteísmo</div>
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
        contaABS(dias,cores){
            return dias.reduce((soma,dia) => {
                return soma + (cores[dia] == true? 1:0)
            },0)
        }
    },
    async mounted(){
       let cores = await fetch(this.$store.getters.link('cor',this.$route.params)).then(response => response.json())
      
       console.log('cores: ',cores)
       const abs = cores.reduce((obj,cor) => {
           obj[cor.name] = cor.abs == 'true'
           return obj
       },{})
      console.log('abs: ',abs)
      console.log('valores: ', this.contaABS(['FE','FE','FE'],abs)) 
       const total = this.funcionarios.reduce((soma,func) => {
           return soma + this.contaABS(func.status,abs)
       },0)
        console.log(total)
       this.valor = ((total*100)/(this.funcionarios[0].status.length * this.funcionarios.length)).toFixed(3)
       
    }
}
</script>

<style>

</style>