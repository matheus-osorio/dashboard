<template>
  <div class="area-total" :class="{'background':zoomBtn}">
    <div class="grafico grafico1">
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
        <e-chart :options="grafico" autoresize></e-chart>
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
      grafico: {},
      loading: true,
      titulo: "Histórico",
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
      const arr = []
      const copia = { ...obj.inicio }
      for (let i = 0; i < obj.data.length; i++) {
        let valor = ordem[copia.mes - 1] + "/" + copia.ano
        if (copia.mes == 12) {
          copia.mes = 1
          copia.ano++
        } else {
          copia.mes++
        }
        arr.push(valor)
      }
      return arr
    },
    criarArray(data) {
      const arr = data.map((linha) => {
        return linha.reduce((soma, valor) => {
          return parseFloat(
            soma +
              valor.valor.reduce((soma, atual) => {
                return soma + atual
              })
          )
        }, 0)
      })
      console.log("arr:", arr)
      return arr
    },
    montarGrafico(datas, valores) {
      //valores.push(valores.reduce((soma,atual) => soma + atual,0))
      //datas.push('Total')
      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["historico"],
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: datas.reverse(),
        },
        series: [
          {
            name: "historico",
            type: "bar",
            data: valores.reverse(),
            color: "#3287a8",
          },
        ],
      }
      console.log(datas, valores)
      return option
    },
  },
  mounted() {
    const obj = this.obj
    const datas = this.arrayData(obj)
    const valores = this.criarArray(obj.data)
    this.grafico = this.montarGrafico(datas, valores)
    this.loading = false
  },
}
</script>

<style scoped>
.grafico {
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
  width: 95%;
  height: 100%;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  padding-right: 5px;
  padding-top: 2px;
  padding-left: 5px;
}
</style>