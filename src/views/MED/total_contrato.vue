<template>
  <div>
      Total do Contrato:   $ {{valor}}   
  </div>
</template>

<script>
export default {
    data(){
        return {
            loading: true,
            valor: 0
        }
    },
    mounted(){
        fetch("http://localhost:3000/historico")
        .then((response) => response.json())
        .then((obj) => {
            this.valor = obj.data.reduce((soma,linha) => {
                return parseFloat(soma + linha.reduce((itens,valor) => {
                    return parseFloat(itens + valor.valor)
                },0))
            },0)
            this.loading = false;
        });
    }
}
</script>

<style>

</style>