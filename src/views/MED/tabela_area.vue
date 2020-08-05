<template>
  <div class="fixo">
    <div class="botoes"><button @click="anterior">esquerda</button> <button @click="proximo">direita</button></div>
    <table>
      <thead>
        <th class="centralizado">{{tabela.mes}}</th>
      </thead>
      <thead>
        <th v-for="valor in tabela.header" :key="valor.id">{{valor}}</th>
      </thead>
      <tbody>
        <tr v-for="valor in tabela.data" :key="valor.id">
          <th>
            {{valor.setor}}
          </th>
          <td>
            {{valor.valor}}
          </td>
          <td>
            {{valor.funcionarios}}
          </td>
          <td>
            {{valor.media}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data(){
    return {
      info: {},
      mes: {},
      tabela: {},
      index: 0
    }
  },
  methods:{
    proximo(){
      this.index = (this.index + 1) % this.info.length
      this.tabela = this.info[this.index]
      console.log(this.tabela)
    },
    anterior(){
      this.index = (this.index -1) % this.info.length
      this.index = this.index >= 0 ? this.index : -this.index
      this.tabela = this.info[this.index]
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
    }
  },
  mounted(){
    fetch("http://localhost:3000/historico")
      .then((response) => response.json())
      .then((obj) => {
        const data = obj.data.map(linha => {
         return linha.map(valor => {
          const novo = {...valor}
          novo.media = valor.valor/valor.funcionarios
          return novo
        })
        })

        const header = ['Setor','Valor','Funcionários','Funcionarios x Valor']
        const meses = this.arrayData(obj)
        this.info = data.map((linha,index) => {return {data: linha, header,mes:meses[index]}})
        this.index = this.info.length - 1
        this.tabela = this.info[this.index]
        console.log(this.tabela)
      });
  }
}
</script>

<style>

.centralizado{
  text-align: center;
}

.fixo{
  overflow: hidden;
}
</style>