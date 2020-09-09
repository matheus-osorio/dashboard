<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Verba Consumida do Contrato (%)</div>
      <div class="number">{{valor}}%</div>
    </div>
  </div>
</template>

<script>
export default {
  props:['obj'],
  data() {
    return {
      loading: true,
      valor: "",
    };
  },
  mounted() {
    const obj = this.obj
    const valor = obj.data
      .reduce((soma, linha) => {
        return parseFloat(
          soma +
            linha.reduce((itens, valor) => {
              return parseFloat(
                itens +
                  valor.valor.reduce((soma, valor) => {
                    return soma + valor;
                  })
              );
            }, 0)
        );
      }, 0)
      .toFixed(2);
    console.log(valor)
    fetch(this.$store.getters.link('contrato',this.$route.params))
    .then(response => response.json())
    .then(total => {
      this.valor = (valor*100/total.total).toFixed(2)
    })
  },
};
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