<template>
  <div class="area-total background">
    <div class="fixo">
      <table class="tabela">
        <colgroup>
        <col class="column1">
        <col class="column2">
        <col class="column3">
        <col class="column2">
        </colgroup>
        <thead>
          <th class="centralizado">{{tabela.mes}}</th>
          <th>
            <btn
              classes="teal darken-2 btn-arrow"
              frase
              evento="anterior"
              modo="icone"
              icone="fas fa-arrow-left"
              :show="true"
              @anterior="anterior"
            />
          </th>
          <th>
            <btn
              classes="teal darken-2 btn-arrow"
              frase
              evento="proximo"
              modo="icone"
              icone="fas fa-arrow-right"
              :show="true"
              @proximo="proximo"
            />
          </th>
        </thead>
        <thead>
          <th v-for="valor in tabela.header" :key="valor.id">{{valor}}</th>
        </thead>
        <tbody>
          <tr v-for="valor in tabela.data" :key="valor.id">
            <th>{{valor.setor}}</th>
            <td><money :raw="valor.valor" invalid="Inválido"/></td>
            <td>{{valor.funcionarios}}</td>
            <td><money :raw="valor.media" invalid="Inválido"/></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import btn from "./botao.vue";
import money from './money.vue';

export default {
  props:['obj'],
  data() {
    return {
      info: {},
      mes: {},
      tabela: {},
      index: 0,
    };
  },
  components: {
    btn,
    money
  },
  methods: {
    proximo() {
      this.index = (this.index + 1) % this.info.length;
      this.tabela = this.info[this.index];
      console.log(this.tabela);
    },
    anterior() {
      this.index = (this.index - 1) % this.info.length;
      this.index = this.index >= 0 ? this.index : this.info.length - 1;
      this.tabela = this.info[this.index];
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
  },
  mounted() {
    const obj = this.obj
    const data = obj.data.map((linha) => {
      return linha.map((valor) => {
        const novo = { ...valor };
        novo.valor = novo.valor.reduce((soma, valor) => {
          return soma + valor;
        });
        novo.funcionarios = novo.funcionarios.total;
        novo.media = (novo.valor / novo.funcionarios).toFixed(2);
        return novo;
      });
    });

    const header = ["Setor", "Valor", "Funcionários", "Funcionarios x Valor"];
    const meses = this.arrayData(obj);
    this.info = data.map((linha, index) => {
      return { data: linha, header, mes: meses[index]};
    });
    this.index = this.info.length - 1;
    this.info = this.info.reduce((novoArray,valor) => {
      const total = valor.data.reduce((total,valor) => {
        total.funcionarios += valor.funcionarios
        total.valor += valor.valor
        return total
      },{funcionarios:0,valor:0,setor:'Total'})
      
      total.media = (total.valor / total.funcionarios).toFixed(2)
      valor.data.push(total)
      novoArray.push(valor)
      return novoArray
    },[])
    this.tabela = this.info[this.index];
    console.log(this.tabela);
  },
};
</script>

<style>
th,tr{
  overflow: hidden;
}

.column1{
    width:28% !important;
}

.column2{
  width:25% !important;
}

.column3{
  width: 22% !important;
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

.centralizado {
  text-align: center;
}

.tabela{
  table-layout: fixed;
  width: 100%;
  background: rgb(255, 255, 255);
}

.fixo {
  overflow: auto;
  height: 100%;
  background: whitesmoke;
}
::-webkit-scrollbar {
  width: 3px;
  border-radius: 30px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>