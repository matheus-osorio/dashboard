<template>
  <div class="background">
    <div class="area-definida">
      <div class="title">Total do Contrato</div>
      <div class="number">$ {{valor}}</div>
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
    this.valor = obj.data
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
    this.valor = ("" + this.valor).replace(".", ",");
    if (!this.valor.match(",")) {
      this.valor += ",00";
    } else if (this.valor.match(/.+,\d$/)) {
      this.valor += "0";
    }
    this.valor = this.valor.replace(/(\d)(?=(?:\d{3})+,)/, "$1.");
    this.loading = false;
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