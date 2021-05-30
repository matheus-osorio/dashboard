<template>
  <div id="menu" class="area-total tamanho" :class="{ background: zoomBtn }">
    <div class="area">
      <div class="cabecalho-menu">
        <div class="wrapper-menu">
          <button id="criar-botao" class="botao-menu" @click="$emit('fazFiltragem')">
            <i class="fas fa-reply"></i> Criar
          </button>
        </div>
        <div class="wrapper-menu">
          <button id="menu-opcoes" class="botao-menu" @click="aba = 'options'">
            <i class="fas fa-cog"></i> OPÇÕES
          </button>
        </div>
        <div class="wrapper-menu dropdown-menu">
          <button class="botao-menu" @click="show = !show">
            <i class="fas fa-filter"></i> FILTROS
            <i class="fas fa-sort-down"></i>
          </button>
          <div class="dropdown-options" :class="{ 'show-dropdown': show }">
            <div
              @click="
                menu = 'nome';
                show = false;
                todos = tudoMarcado();
                aba = 'filtros';
              "
              :class="{ 'linha-ativa': menu == 'nome' }"
              class="linha"
            >
              Funcionários
            </div>
            <div
              @click="
                menu = 'funcao';
                show = false;
                todos = tudoMarcado();
                aba = 'filtros';
              "
              :class="{ 'linha-ativa': menu == 'funcao' }"
              class="linha"
            >
              Funções
            </div>
            <div
              @click="
                menu = 'setor';
                show = false;
                todos = tudoMarcado();
                aba = 'filtros';
              "
              :class="{ 'linha-ativa': menu == 'setor' }"
              class="linha"
            >
              Setores
            </div>
          </div>
        </div>
      </div>
      <div>
        <table v-if="aba == 'options'">
          <tr>
            <td colspan="1">
              <div class="checkmark-box cursor-pointer" @click="config.media = !config.media">
                <br v-if="false" /><i
                  class="fas fa-check"
                  v-if="config.media"
                ></i>
              </div>
            </td>
            <td colspan="3">Mostrar Média</td>
          </tr>
          <tr>
            <td colspan="1">
              <div class="checkmark-box cursor-pointer" @click="config.ponderado = !config.ponderado">
                <br v-if="false" /><i
                  class="fas fa-check"
                  v-if="config.ponderado"
                ></i>
              </div>
            </td>
            <td colspan="3">Cálculo Inteligente</td>
          </tr>
          <tr>
            <td colspan="1">
              <div class="checkmark-box cursor-pointer" @click="config.tooltip = !config.tooltip">
                <br v-if="false" /><i
                  class="fas fa-check"
                  v-if="config.tooltip"
                ></i>
              </div>
            </td>
            <td colspan="3">Mostrar Tooltip</td>
          </tr>
          <tr>
            <td colspan="1">
              <div class="checkmark-box cursor-pointer" @click="config.smooth = !config.smooth">
                <br v-if="false" /><i
                  class="fas fa-check"
                  v-if="config.smooth"
                ></i>
              </div>
            </td>
            <td colspan="3">Linhas Suaves</td>
          </tr>
          <tr>
            <td  class="" colspan="1">
              <div class="wrapper-menu dropdown-menu">
                <div class="botao-menu cursor-pointer" @click="config.precisao.show = !config.precisao.show">
                  Precisão da Medida
                  <i class="fas fa-sort-down"></i>
                </div>
                <div
                  class="dropdown-options"
                  :class="{ 'show-dropdown': config.precisao.show }"
                >
                  <div
                    @click="
                      config.precisao.tipo = 'DIA'
                    "
                    :class="{ 'linha-ativa': config.precisao.tipo == 'DIA'}"
                    class="linha"
                  >
                    Dia
                  </div>
                  <div
                    @click="
                      config.precisao.tipo = 'MES'
                    "
                    :class="{ 'linha-ativa': config.precisao.tipo == 'MES'}"
                    class="linha"
                  >
                    Mês
                  </div>
                  <div
                    @click="
                      config.precisao.tipo = 'ANO'
                    "
                    :class="{ 'linha-ativa': config.precisao.tipo == 'ANO'}"
                    class="linha"
                  >
                    Ano
                  </div>
                </div>
              </div>
            </td>
            <td  class="" colspan="3">
              <div class="wrapper-menu dropdown-menu">
                <div class="botao-menu cursor-pointer" @click="config.filtragem.show = !config.filtragem.show">
                  Tipo de Filtragem
                  <i class="fas fa-sort-down"></i>
                </div>
                <div
                  class="dropdown-options"
                  :class="{ 'show-dropdown': config.filtragem.show }"
                >
                  <div
                    @click="
                      config.filtragem.tipo = 'ULTIMO'
                    "
                    :class="{ 'linha-ativa': config.filtragem.tipo == 'ULTIMO'}"
                    class="linha"
                  >
                    Somente Atual
                  </div>
                  <div
                    @click="
                      config.filtragem.tipo = 'TOTAL'
                    "
                    :class="{ 'linha-ativa': config.filtragem.tipo == 'TOTAL'}"
                    class="linha"
                  >
                    Todo o Histórico
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <table v-if="aba == 'filtros'">
          <tr>
            <td>
              <div class="checkmark-box cursor-pointer" @click="marcarFiltros(true)">
                <br v-if="false" /><i class="fas fa-check" v-if="todos"></i>
              </div>
            </td>
            <td>{{ textoTodos }}</td>
          </tr>
          <tr v-for="(linha, valor) in lista[menu]" :key="linha.id">
            <td>
              <div class="checkmark-box cursor-pointer" @click="trocaFiltros(valor)">
                <br v-if="false" /><i
                  class="fas fa-check"
                  v-if="filtros[menu][valor]"
                ></i>
              </div>
            </td>
            <td>{{ linha }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  props: ["cargos","config","lista","filtros"],
  data() {
    return {
      titulo: "MENU",
      show: false,
      menu: "nome",
      todos: true,
      textoTodos: "Desmarcar Tudo",
      aba: "filtros"
    };
  },
  methods: {
    marcarFiltros() {
      const resultado = !this.todos;
      for (let i = 0; i < this.lista[this.menu].length; i++) {
        Vue.set(this.filtros[this.menu], i, resultado);
      }
      this.todos = this.tudoMarcado();
    },
    trocaFiltros(valor) {
      Vue.set(this.filtros[this.menu], valor, !this.filtros[this.menu][valor]);
      this.todos = this.tudoMarcado();
    },
    tudoMarcado() {
      if (this.lista[this.menu].length == 0) {
        return false;
      }
      for (let i = 0; i < this.lista[this.menu].length; i++) {
        if (!this.filtros[this.menu][i]) {
          this.textoTodos = "Marcar Tudo";
          return false;
        }
      }
      this.textoTodos = "Desmarcar Tudo";
      return true;
    },
  },
  mounted() {
    
  },
};
</script>

<style>

#criar-botao{
  background-color: #4caf50 ;
}

#menu{
  height: 100%;
  overflow: auto;
}

.checkmark-box {
  border-style: solid;
  border-width: 1px;
  height: 30px;
  width: 30px;
  padding: 4px;
}

.checkmark-box:active{
  background-color: rgb(138, 138, 138);
}

.nome-menu {
  font-size: 1.6rem;
}

.wrapper-menu {
  height: 100%;
  width: 100%;
}

.botao-menu {
  height: 100%;
  width: 100%;
}

.cursor-pointer{
  cursor: pointer;
}

.botao-menu:focus {
  outline: none;
  background-color: #f9f9f9;
  box-shadow: 0px;
}

.linha {
  font-size: 1.2rem;
  padding-top: 10px;
  padding-left: 15px;
  padding-bottom: 10px;
  cursor: pointer;
}

.linha:hover {
  background-color: rgb(184, 184, 184);
}

.linha-ativa {
  background-color: rgb(184, 184, 184);
}
.dropdown-options {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  padding: 0px;
  z-index: 1;
}

.show-dropdown {
  display: block;
}

.cabecalho-menu {
  display: grid;
  position: sticky;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 5px;
}

.print-page  #menu{
    display: none;
}
</style>