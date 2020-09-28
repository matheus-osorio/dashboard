<template>
  <div class="area-total background">
    <div class="area">
      <div class="cabecalho">
        {{ titulo }}
      </div>
      <table>
        <thead>
          <th>Setor</th>
          <th>Funcionários</th>
          <th>Vale Alimentação</th>
          <th>Vale Transporte</th>
          <th>Cesta Básica</th>
          <th>Férias</th>
        </thead>
        <tbody>
          <tr v-for="linha in tabela" :key="linha.id">
            <th>
              <b>{{ linha.setor }}</b>
            </th>
            <td>
              {{ linha.total }}
            </td>
            <td>
              {{ linha.alimentacao }}
            </td>
            <td>
              {{ linha.transporte }}
            </td>
            <td>
              {{ linha.cesta }}
            </td>
            <td>
              {{ linha.ferias }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["funcionarios"],
  data() {
    return {
      titulo: "Tabela Benefícios",
      tabela: [],
    };
  },
  methods: {
    buscarValor(obj, param) {
      return param.reduce((obj, valor) => {
        return obj[valor]; //retorna o valor no fim do array
      }, obj);
    },

    mapear(arr, param) {
      return arr.map((obj) => {
        return this.buscarValor(obj, param);
      }); //mapeia elementos de acordo com o array passado
    },

    criarPorcentagens(obj, categoria, status) {
      const soma = obj.length;

      const ferias = status[categoria].filter((status) => status == "FE")
        .length;

      const alimentacao = this.mapear(obj, ["alimentacao"]).reduce(
        (soma, valor) => {
          return soma + (valor == true ? 1 : 0);
        }
      );
      const transporte = this.mapear(obj, ["transporte"]).reduce(
        (soma, valor) => {
          return soma + (valor == true ? 1 : 0);
        }
      );
      const cesta = this.mapear(obj, ["basica"]).reduce((soma, valor) => {
        return soma + (valor == true ? 1 : 0);
      });

      return {
        setor: categoria,
        ferias: ferias,
        alimentacao: alimentacao,
        transporte: transporte,
        cesta: cesta,
        total: soma,
      };
    },

    statusGrupo(grupos, hoje) {
      let novo = Object.keys(hoje).reduce((obj, chave) => {
        const arr = hoje[chave];
        const status = arr.reduce((arr, obj) => {
          return arr.concat(obj.data);
        }, []);
        obj[chave] = status;
        return obj;
      }, {});

      novo = Object.keys(grupos).reduce((obj, chave) => {
        const arr = grupos[chave].grupo;
        const status = arr.reduce((arr, valor) => {
          return arr.concat(novo[valor]);
        }, []);
        obj[chave] = status;
        return obj;
      }, {});
      return novo;
    },
  },
  async mounted() {
    const grupos = await fetch(
      this.$store.getters.link("grupo", this.$route.params)
    ).then(response => response.json())
    const hoje = await fetch(
      this.$store.getters.link("hoje", this.$route.params)
    ).then(response => response.json())

    const statusHoje = this.statusGrupo(grupos, hoje);

    let setores = this.mapear(this.funcionarios, ["setor"]);
    setores = new Set(setores);
    setores = Array.from(setores);

    const porcentagens = setores.map((categoria) => {
      const filtr = this.funcionarios.filter((obj) => {
        return obj.setor == categoria;
      });
      return this.criarPorcentagens(filtr, categoria, statusHoje);
    });

    const totalStatus = {
        TOTAL: Object.values(statusHoje).reduce((arr,cat) => {
                return arr.concat(cat)
                },[])
    }
    porcentagens.push(this.criarPorcentagens(this.funcionarios, "TOTAL",totalStatus));
    this.tabela = porcentagens;
  },
};
</script>

<style>
</style>