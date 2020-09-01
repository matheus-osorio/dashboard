<template>
  <div class="area-total background">
    <div class="fixo">
      <table>
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
            <td>{{valor.valor}}</td>
            <td>{{valor.funcionarios}}</td>
            <td>{{valor.media}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import btn from "./botao.vue";

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
  },
  methods: {
    proximo() {
      this.index = (this.index + 1) % this.info.length;
      this.tabela = this.info[this.index];
      console.log(this.tabela);
    },
    anterior() {
      this.index = (this.index - 1) % this.info.length;
      this.index = this.index >= 0 ? this.index : -this.index;
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
      return { data: linha, header, mes: meses[index] };
    });
    this.index = this.info.length - 1;
    this.tabela = this.info[this.index];
    console.log(this.tabela);
  },
};
</script>

<style>
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