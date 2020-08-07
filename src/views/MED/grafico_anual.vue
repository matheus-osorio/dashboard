<template>
    <div>
        <e-chart :options="graph"/>
    </div>
</template>

<script>
export default {
    data(){
        return {
            graph: {}
        }
    },
    methods:{
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
        createGraph(data,xAxis){
            const options = {}
            const headers = data[0].map((value) => value.setor)
            const colors = ["#4287f5","#e80721","#079125","#c9cc00","#8a0685","#7ca3cc","#565e66","#0e3012"]
            options.xAxis = {
                type: "category",
                data: xAxis
            }

            options.yAxis = {
                type: "value"
            }

            const rawValues = data.reduce((matriz,atual) => {
                atual.forEach((valores,index) => {
                    matriz[index].push(valores.valor)                        
                })
                return matriz
            },data[0].map(() => []))
            options.series = []
            rawValues.forEach((bar,index) => {
                const serie = {
                    name: headers[index],
                    data: bar,
                    type: 'bar',
                    showBackground: true,
                    color: colors[index],
                    stack: "one"
                }

                options.series.push(serie)
            })

            options.legend = {
                data : headers
            }
    
            options.tooltip = {
                trigger: "axis"
            }

            return options
        }
    },
    mounted(){
        fetch("http://localhost:3000/historico")
        .then((response) => response.json())
        .then((obj) => {
            const length = obj.data.length 
            const month = obj.inicio.mes
            let lastYear = 12 - month
            if(length <= 12){
                lastYear = 0
            }
            else {
                lastYear = length - (length % 12)
            }
            console.log("year: ",lastYear)
            const calculate = obj.data.slice(lastYear)
            const xAxis = this.arrayData(obj).slice(lastYear)
            this.graph = this.createGraph(calculate,xAxis)

        })
    }
}
</script>

<style scoped>
.echarts{
    width: 100%;
    height: 100%;
}

.chart{
    width: 100%;
    height: 100%;
}

canvas{
    width: 100%;
    height: 100%;
}
</style>