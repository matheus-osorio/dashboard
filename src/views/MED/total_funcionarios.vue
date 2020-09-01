<template>
  <div class="background division">
    <div class="area-definida">
      <div class="title">Quantidade de Funcionários</div>
      <div class="number">{{valor}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props:['obj'],
  data() {
    return {
      valor: 0,
    };
  },
  mounted() {
    const obj = this.obj
    const ultimo = obj.data[obj.data.length - 1];
    this.valor = ultimo.reduce((soma, item) => {
      soma += parseFloat(item.funcionarios.total);
      return soma;
    }, 0);
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
  height: 100%;
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