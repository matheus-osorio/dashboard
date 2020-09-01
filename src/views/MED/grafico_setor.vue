<template>
  <div class="area-total" :class="{'background':zoomBtn}">
    <div class="grafico-setor">
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
          {{titulo}}{{setor}}
          <div class="caixa-icones">
            <btn
              classes="teal darken-2 btn-arrow borda"
              frase
              evento="anterior"
              modo="icone"
              icone="fas fa-arrow-left"
              :show="true"
              @anterior="mudar(-1)"
            />
            <btn
              classes="teal darken-2 btn-arrow borda"
              frase
              evento="proximo"
              modo="icone"
              icone="fas fa-arrow-right"
              :show="true"
              @proximo="mudar(1)"
            />
            <btn
              classes="btn-zoom blue lighten-2 borda"
              frase
              evento="zoom"
              modo="icone"
              icone="fas fa-search-plus"
              @zoom="zoom()"
              :show="zoomBtn"
            />
          </div>
        </div>
        <div>
          <e-chart :options="graph" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import btn from "./botao.vue";

export default {
  props:['obj'],
  data() {
    return {
      graph: {},
      setores: {},
      index: {},
      loading: true,
      titulo: "Grafico por Setor - ",
      setor: "teste",
      zoomBtn: true,
    };
  },
  components: {
    btn,
  },
  methods: {
    onZoom() {
      this.zoomBtn = false;
    },
    onUnzoom() {
      this.zoomBtn = true;
    },
    zoom() {
      this.$emit("zoom", this.onZoom, this.onUnzoom);
    },
    mudar(num) {
      if (num < 0) {
        if (num + this.index < 0) {
          this.index = this.setores.length - 1;
        } else {
          this.index += num;
        }
      } else {
        if (num + this.index >= this.setores.length) {
          this.index = 0;
        } else {
          this.index += num;
        }
      }
      this.graph = this.setores[this.index];
      this.setor = this.nomes[this.index];
    },
    criarGrafico(obj) {
      const cores = ["#4287f5", "#ed4574", "#41a81e"];
      const valores = obj.valor;
      const funcionarios = obj.funcionarios.diario;
      const headers = ["Valor", "Funcionários", "Valor x Funcionários"];
      const media = [];
      for (let index in valores) {
        let valor = (valores[index] / funcionarios[index]).toFixed(2);
        media.push(valor);
      }
      const options = {};
      options.colors = cores;
      options.legend = {
        data: headers,
      };
      options.tooltip = {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      };
      const series = [
        {
          name: headers[0],
          type: "bar",
          barGap: 0,
          data: valores,
        },
        {
          name: headers[1],
          type: "bar",
          barGap: 0,
          yAxisIndex: 1,
          data: funcionarios,
        },
        {
          name: headers[2],
          type: "bar",
          barGap: 0,
          data: media,
        },
      ];
      options.series = series;
      (options.xAxis = [
        {
          type: "category",
          axisTick: { show: false },
          data: valores.map((valor, index) => {
            return index + 1;
          }),
        },
      ]),
        (options.yAxis = [
          {
            type: "value",
            splitNumber: 8,
          },
          {
            type: "value",
            splitNumber: 8,
          },
        ]);
      return options;
    },

    nomes(obj) {
      const raw = obj.data[obj.data.length - 1];
      const nomes = raw.map((valor) => {
        return valor.setor;
      });
      console.log(nomes);
      return nomes;
    },
  },
  mounted() {
    const obj = this.obj
    const mes = obj.data[obj.data.length - 1];

    const graphs = mes.map((obj) => {
      return this.criarGrafico(obj);
    });

    this.setores = graphs;
    this.graph = graphs[0];
    this.nomes = this.nomes(obj);
    this.setor = this.nomes[0];
    this.index = 0;
    this.loading = false;
  },
};
</script>

<style>
.grafico-setor {
  width: 100%;
  height: 100%;
  background: white;
}

.area-total {
  width: 100%;
  height: 100%;
}

.background {
  background: linear-gradient(
    180deg,
    rgba(6, 183, 227, 1) 9%,
    rgba(11, 221, 157, 1) 73%
  );
  padding: 2px;
}

.area {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-rows: 30px 1fr;
}

.echarts {
  width: 100% !important;
  height: 100% !important;
  margin: 0;
}

.canvas {
  height: 100%;
  width: 100%;
}
.cabecalho {
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}
</style>