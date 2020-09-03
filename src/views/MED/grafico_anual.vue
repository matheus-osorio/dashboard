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
          <btn
            classes="btn-zoom blue lighten-2"
            frase
            evento="zoom"
            modo="icone"
            icone="fas fa-search-plus"
            @zoom="zoom()"
            :show="zoomBtn"
          />
        </div>
        <e-chart :options="graph" autoresize />
      </div>
    </div>
  </div>
</template>

<script>
import btn from "./botao.vue";

export default {
  props: ["obj"],
  data() {
    return {
      loading: true,
      graph: {},
      titulo: "Gráfico Anual",
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
    arrayData(obj) {
      const ordem = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      const arr = [];
      const copia = { ...obj.inicio };
      for (let i = 0; i < obj.data.length; i++) {
        let valor = ordem[copia.mes - 1] + "/" + copia.ano;
        if (copia.mes == 12) {
          copia.mes = 1;
          copia.ano++;
        } else {
          copia.mes++;
        }
        arr.push(valor);
      }
      return arr;
    },
    createGraph(data, xAxis) {
      const options = {};
      const headers = data[0].map((value) => value.setor);
      const colors = [
        "#4287f5",
        "#e80721",
        "#079125",
        "#c9cc00",
        "#8a0685",
        "#7ca3cc",
        "#565e66",
        "#0e3012",
      ];
      options.xAxis = {
        type: "category",
        data: xAxis,
      };

      options.yAxis = {
        type: "value",
      };

      const rawValues = data.reduce(
        (matriz, atual) => {
          atual.forEach((valores, index) => {
            matriz[index].push(
              valores.valor.reduce((soma, atual) => {
                return soma + atual;
              })
            );
          });
          return matriz;
        },
        data[0].map(() => [])
      );
      options.series = [];
      rawValues.forEach((bar, index) => {
        const serie = {
          name: headers[index],
          data: bar,
          type: "bar",
          showBackground: true,
          color: colors[index],
          stack: "one",
        };

        options.series.push(serie);
      });

      options.legend = {
        data: headers,
      };

      options.tooltip = {
        trigger: "axis",
      };

      return options;
    },
  },
  mounted() {
    console.log("anual OK!")
    const obj = this.obj;
    const length = obj.data.length;
    const month = obj.inicio.mes;
    const restOfYear = 13 - month;
    let lastYear = 0
    if(restOfYear < length){
      lastYear = restOfYear 
      while(length > lastYear + 12){
        lastYear += 12
      }
    }
    const calculate = obj.data.slice(lastYear);
    const xAxis = this.arrayData(obj).slice(lastYear);
    this.graph = this.createGraph(calculate, xAxis);
    this.loading = false;
  },
};
</script>

<style scoped>
.grafico {
  width: 100%;
  height: 100%;
  background: white;
  margin: 0 auto;
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
  width: 100%;
  height: 100%;
  margin: 0 auto;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}

canvas {
  width: 100%;
  height: 100%;
  margin: 0 auto;
}
</style>