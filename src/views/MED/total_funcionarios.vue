<template>
  <div>
      Quantidade de Funcionários: {{valor}}
  </div>
</template>

<script>
export default {
    data(){
        return {
            valor: 0
        }
    },
    mounted(){
        fetch("http://localhost:3000/historico")
        .then((response) => response.json())
        .then((obj) => {
            const ultimo = obj.data[obj.data.length -1]
            this.valor = ultimo.reduce((soma,item) => {
                soma += parseFloat(item.funcionarios)
                return soma
            }, 0)
        })
    }
}
</script>

<style>

</style>