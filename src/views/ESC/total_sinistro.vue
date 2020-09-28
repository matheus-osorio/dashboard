<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Média Sinistralidade</div>
      <div class="number">{{valor}} %</div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            valor: 0
        }
    },
    mounted(){
        fetch(this.$store.getters.link('sinistro',this.$route.params))
        .then(response => response.json())
        .then(sinistro => {
          console.log('sinistro: ',sinistro)
            let ultimos = sinistro
            if(ultimos.length > 12){
             ultimos = sinistro.splice(sinistro.length - 12)
            }
            this.valor = (ultimos.reduce((soma,valor) => soma + valor.valor,0)/ultimos.length).toFixed(2)
        })
    }
}
</script>

<style>

</style>