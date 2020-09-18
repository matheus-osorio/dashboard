<template>
    <div class="background">
    <div class="area-definida">
      <div class="title">Status Válidos</div>
      <div class="number">{{valor}}</div>
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
        fetch(this.$store.getters.link('hoje',this.$route.params))
        .then(response => response.json())
        .then(hoje => {
            fetch(this.$store.getters.link('cor',this.$route.params))
            .then(response => response.json())
            .then(cores => {
                const validos = cores.reduce((obj,cor) => {
                    obj[cor.name] = cor.valid
                    return obj
                },{})
                this.valor = hoje.status.filter((status) => validos[status]).length
            })
        })
    }
}
</script>

<style>

</style>