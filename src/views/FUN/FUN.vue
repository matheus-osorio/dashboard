<template>
  <div id="FUN" v-if="!loading">
      <Menu :cargos="cargos" :config="config" :filtros="filtros" :lista="lista" @fazFiltragem="fazFiltragem" />
      <graficoSalario :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :key="keys.graficoSalario"/>
      <graficoFuncao :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :key="keys.graficoFuncao"/>
      <div id="cards">
          <totalSalario :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :key="keys.totalSalario"/>
      </div>
  </div>
</template>

<script>

import Menu from './menu.vue'
import graficoSalario from './grafico_salario'
import graficoFuncao from './grafico_promocao'
import totalSalario from './total_salario'

export default {
    components:{
        Menu,
        graficoSalario,
        graficoFuncao,
        totalSalario
    },
    data(){
        return{
            cargosFiltrados:{},
            cargos:{},
            loading: true,
            lista: { nome: [], setor: [], funcao: [] },
            filtros: { nome: [], setor: [], funcao: [] },
            config: {
                media: true,
                ponderado: true,
                precisao:{
                    tipo: 'DIA',
                    show:false
                },
                filtragem:{
                    show: false,
                    tipo: 'TOTAL'
                }
            },
            keys:{
                graficoSalario: 1,
                graficoFuncao:10,
                totalSalario:20
            }
        }
    },
    methods:{
        filtraNome(nome,lista){
            return lista.includes(nome)
        },

        filtraSetor(setor,lista){
            return lista.includes(setor)
        },

        filtraFuncao(cargos,lista,modo){
            if(modo == 'ULTIMO'){
                return lista.includes(cargos[cargos.length - 1])
            }

            if(modo == 'TOTAL'){
                return cargos.reduce((salvo,cargo) => {
                    return salvo || lista.includes(cargo)
                },false)
            }

        },
        fazFiltragem(){
            Array.prototype.getFromArray = function(arr) {
            const values = []
            for(let n in arr){
                if(arr[n]){
                    values.push(this[n])
                }
            }

            return values
        }
           const nomesValidos = this.lista.nome.getFromArray(this.filtros.nome) 
           const setoresValidos = this.lista.setor.getFromArray(this.filtros.setor)
           const funcoesValidas = this.lista.funcao.getFromArray(this.filtros.funcao)

           const funcFiltrados = this.cargos.filter(pessoa => {
               const cargos = pessoa.historico.map(item => item.cargo)
               const setor = pessoa.setor
               const nome = pessoa.nome

               return this.filtraNome(nome,nomesValidos) && this.filtraSetor(setor,setoresValidos) && this.filtraFuncao(cargos,funcoesValidas,this.config.filtragem.tipo)
           })

           this.cargosFiltrados = funcFiltrados
           this.updateKeys()
        },
        updateKeys(){
            for(let chave of Object.keys(this.keys)){
                this.keys[chave]++
            }
        }
    },
    async mounted(){
        
        const cargos = await fetch(this.$store.getters.link('cargo',this.$route.params)).then(r => r.json())
        this.cargos = cargos
        const lista = {};

        let nomes = this.cargos.map((v) => v.nome);

        let setor = this.cargos.map((v) => v.setor);
        setor = Array.from(new Set(setor));

        let funcao = this.cargos.reduce((soma, pessoa) => {
        return soma.concat(pessoa.historico.map((f) => f.cargo));
        }, []);

        funcao = Array.from(new Set(funcao));

        lista.nome = nomes.sort();
        lista.setor = setor.sort();
        lista.funcao = funcao.sort();

        const filtros = {};

        filtros.nome = lista.nome.map(() => true);
        filtros.setor = lista.setor.map(() => true);
        filtros.funcao = lista.funcao.map(() => true);

        this.filtros = filtros;
        this.lista = lista;
        this.fazFiltragem();
        this.loading = false        
    }
}
</script>

<style>

#FUN{
    display: grid;
    row-gap: 10px;
    column-gap: 10px;
    padding:10px;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: 
    "menu grafico-salario grafico-evolucao"
    "menu cards nada2"
    ;
}

#cards{
    grid-area: cards;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
}

#menu{
    grid-area: menu;
}

#grafico-salario{
    grid-area: grafico-salario;
}

#grafico-evolucao{
    grid-area:grafico-evolucao
}

#cards{
    grid-area: cards
}

</style>