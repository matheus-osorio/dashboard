<template>
  <div class="background division">
    <div class="area-definida">
      <div class="title">Valor Total Contrato</div>
      <div class="number">$ {{valor}}</div>
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
        fetch(this.$store.getters.link('contrato',this.$route.params))
        .then(response => response.json())
        .then(obj => {
            this.valor = obj.total
            this.valor = ("" + this.valor).replace(".", ",");
            if (!this.valor.match(",")) {
            this.valor += ",00";
            } else if (this.valor.match(/.+,\d$/)) {
            this.valor += "0";
            }
            this.valor = this.valor.replace(/(\d)(?=(\d{3})+,)/g, "$1.");
        })
    }
}
</script>

<style>
.background {
  background: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
  padding: 2px;
  width: 100%;
  height: calc(100% - 5px);
  margin-top: 3px;
}
.title {
  width: 100%;
  text-align: center;
}

.number {
  width: 100%;
  text-align: center;
  font-size: 2rem;
}

.area-definida {
  width: 100%;
  height: 100%;
  background: white;
}
</style>