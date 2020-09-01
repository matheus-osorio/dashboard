<template>
<div class="area-total" :class="{'background':zoomBtn}">
  <div class="grafico">
    <div class="center-align container loader" v-if="loading">
      <h5>Carregando dados</h5>
      <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-blue-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div>
          <div class="gap-patch">
            <div class="circle"></div>
          </div>
          <div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="area">
      <div class="cabecalho">
        {{titulo}}
        <btn classes="btn-zoom blue lighten-2" frase="" evento="zoom" modo="icone" icone="fas fa-search-plus" @zoom="zoom()" :show="zoomBtn" />
      </div>
    <e-chart :options="graficoDiario" autoresize></e-chart>
    </div>
  </div>
</div>
</template>

<script>
import btn from './botao.vue'

var valores = {};
var periodo = {};

export default {
  data() {
    return {
      graficoDiario: {},
      zoomBtn: true,
      titulo: "Gráfico Diário"
    };
  },
  components:{
    btn
  },
  methods:{
    onZoom(){
      
      this.zoomBtn = false
    },
    onUnzoom(){
      this.zoomBtn = true
    },
    zoom(){
      console.log('chegou aqui')
      this.$emit('zoom',this.onZoom,this.onUnzoom)
    }
  },

  mounted() {
    fetch(this.$store.getters.link('grafico',this.$route.params))
      .then((resposta) => resposta.json())
      .then((obj) => {
        valores = aplicaReajuste(obj);
        fetch(this.$store.getters.link('periodo',this.$route.params))
          .then((retorno) => retorno.json())
          .then((valor) => {
            periodo = valor;
            this.graficoDiario = montarGraficoDiario();
            this.loading = false;
          });
      });
  },
};

function montarVetorDiario() {
  let resultadoDiario = 0.0;
  let retorno = [];
  for (let index in valores.data[0]) {
    for (let categoria of valores.data) {
      resultadoDiario += categoria[index];
    }
    retorno.push(resultadoDiario);
    resultadoDiario = 0.0;
  }
  return retorno;
}

function fazerMediaDiario() {
  let ultimoDia = 0;
  let somaDiaria = montarVetorDiario();

  for (let i = somaDiaria.length - 1; i >= 0; i--) {
    if (somaDiaria[i] > 0) {
      ultimoDia = i + 1;
      break;
    }
  }

  const somaMes = somaDiaria.reduce((valor1, valor2) => {
    return valor1 + valor2;
  });

  const media = somaMes / ultimoDia;

  return replicarValor(media, somaDiaria.length);
}

function divisoesParaDiario(vetor, divisao) {
  let maior = vetor.reduce((valor, valor2) => Math.max(valor, valor2));
  maior = maior > valores.orcado / 10 ? maior : valores.orcado / 10;
  return Math.ceil(maior / divisao) + 1;
}

function gerarDivisoes(
  divisao = 5000,
  funcaoRequerida = (x) => x,
  funcaoExtra = (x) => x
) {
  let retorno = funcaoRequerida(divisao);

  return funcaoExtra(retorno, divisao);
}

function sequenciaParaDias(dias) {
  const inicial = parseInt(periodo.range.inicio - 1);
  const fim = parseInt(periodo.range.totalDias);
  dias = dias.map((dia, index) => {
    if (index >= fim) {
      return dia - fim;
    }
    return parseInt(dia) + parseInt(inicial);
  });
  console.log("dias:", dias);
  return dias;
}

function montarGraficoDiario() {
  let titulo = criaTitulo(""); //diário
  let totalDias = valores.data[0].length;
  let xAxis = [];
  adicionarX(
    xAxis,
    "category",
    false,
    sequenciaParaDias(acumularValor(replicarValor(1, totalDias), 0))
  );

  let yAxis = [];

  let divisoes =
    Math.max(gerarDivisoes(5000, montarVetorDiario, divisoesParaDiario), 10) *
    5000;

  adicionarY(yAxis, "", true, 0, divisoes, "value", "left", 5000);
  adicionarY(yAxis, "", true, 0, divisoes * 10, "value", "right", 50000);

  let tooltip = criarTooltip("axis");
  let dadosLegenda = [];
  let series = [];
  let cor = [
    "#4287f5",
    "#e80721",
    "#079125",
    "#c9cc00",
    "#8a0685",
    "#7ca3cc",
    "#565e66",
    "#0e3012",
  ];
  let valoresAcumulados = replicarValor(0, totalDias);
  let categoria = 0;

  adicionarPonto(
    series,
    "Total",
    "scatter",
    0,
    0.1,
    "",
    montarVetorDiario().map((numero) => {
      return Number(numero).toFixed(2);
    })
  );

  for (let index in valores.data) {
    valoresAcumulados = somaDiaria(valoresAcumulados, valores.data[index]);
    categoria++;
    dadosLegenda.push(`${categoria}.x`);
    adicionarBarra(
      series,
      `${categoria}.x`,
      "bar",
      0,
      "one",
      cor[index] == undefined ? "" : cor[index],
      valores.data[index].map((x) => parseFloat(x).toFixed(2))
    );
  }

  dadosLegenda.push("Acumulado", "Orçado", "Média", "Ideal");
  let legend = criarLegenda(dadosLegenda, "right", "right");
  adicionarLinha(
    series,
    "Acumulado",
    "line",
    1,
    "none",
    "#535154",
    acumularValor(valoresAcumulados, 2)
  ); //Linha valor acumulado
  adicionarLinha(
    series,
    "Orçado",
    "line",
    1,
    "none",
    "#6B4C9A",
    replicarValor(valores.orcado, totalDias)
  ); //Linha de valor orçado
  adicionarLinha(
    series,
    "Média",
    "line",
    0,
    "none",
    "#922428",
    fazerMediaDiario()
  ); //Linha de média
  adicionarLinha(
    series,
    "Ideal",
    "line",
    0,
    "none",
    "#948B3D",
    replicarValor(Number(valores.orcado / 31).toFixed(2), totalDias)
  ); //linha de valor ideal(orçado/31)

  let option = criarGrafico(titulo, xAxis, yAxis, legend, tooltip, series);
  return option;
}

function somaDiaria(vetor1, vetor2) {
  let resultado = [];
  {
    for (let index in vetor1) {
      resultado.push(vetor1[index] + vetor2[index]);
    }
  }
  return resultado;
}

function criarGrafico(title, xAxis, yAxis, legend, tooltip, series) {
  return { title, xAxis, yAxis, legend, tooltip, series };
}

function criaTitulo(text) {
  return { text };
}

function adicionarX(xAxis, type, silent, data) {
  xAxis.push({ type, silent, data });
}

function adicionarY(yAxis, name, scale, min, max, type, position, interval) {
  yAxis.push({ name, scale, min, max, type, position, interval });
}

function criarLegenda(data, align, position) {
  return { data, align, position };
}

function criarTooltip(trigger) {
  return { trigger };
}

function adicionarBarra(series, name, type, yAxisIndex, stack, color, data) {
  series.push({ name, type, yAxisIndex, stack, color, data });
}

function adicionarLinha(series, name, type, yAxisIndex, symbol, color, data) {
  series.push({ name, type, yAxisIndex, symbol, color, data });
}

function adicionarPonto(
  series,
  name,
  type,
  yAxisIndex,
  symbolSize,
  color,
  data
) {
  series.push({ name, type, yAxisIndex, symbolSize, color, data });
}

function replicarValor(valor, quantidade) {
  let retorno = [];
  while (quantidade > 0) {
    retorno.push(valor);
    quantidade--;
  }
  return retorno;
}

function acumularValor(valores, toFixed) {
  let retorno = [];
  let soma = 0;
  for (let val of valores) {
    soma += val;
    retorno.push(Number(soma).toFixed(toFixed));
  }
  return retorno;
}

function aplicaReajuste(obj) {
  let parametro = obj.reajuste;
  let resultado = [];
  for (let barra of obj.data) {
    resultado.push(barra.map((x) => x * parametro));
  }
  obj.data = resultado;
  return obj;
}
</script>


<style scoped>
.grafico {
  width: 100%;
  height: 100%;
  background: white;
}

.area-total{
  width: 100%;
  height: 100%;
}

.background{
    background: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
  padding: 2px;
}

.area{
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 30px 1fr;
}

.echarts {
  width: 95%;
  height: 100%;
  margin: 0 auto;
}

.cabecalho{
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}
</style>