<template>
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
     <e-chart :options="grafico"></e-chart>
  </div>
</template>

<script>
export default {
  data() {
    return {
      grafico: {},
      lading: true,
    };
  },
  methods: {
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
      for (let i=0;i<obj.data.length;i++) {
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
    criarArray(data){
      const arr = data.map((linha) => {
        return linha.reduce((soma,valor) => {
          console.log(valor)
          return parseFloat(soma + valor.valor)
        },0)
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
            color:'#3287a8'
          },
        ],
      }
      console.log(datas,valores)
      return option
    },
  },
  mounted() {
    fetch("http://localhost:3000/historico")
      .then((response) => response.json())
      .then((obj) => {
        const datas = this.arrayData(obj);
        const valores = this.criarArray(obj.data)
        this.grafico = this.montarGrafico(datas, valores);
        this.loading = false;
      });
  },
};
</script>

<style scoped>
.grafico{
  width: 100%;
  height: 100%;
}

.echarts {
  width: 95%;
  height: 95%;
}
</style>