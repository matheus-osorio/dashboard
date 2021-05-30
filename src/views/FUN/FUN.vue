<template>
  <div id="FUN" v-if="!loading">
      <Menu :cargos="cargos" :config="config" :filtros="filtros" :lista="lista" @fazFiltragem="fazFiltragem"/>
      <graficoSalario @zoom="(zoom,unzoom) => {zoomActivator('grafico-salario',zoom,unzoom)}" id="grafico-salario" :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :loading="loading" :tooltip="config.tooltip" :smooth="config.smooth" :key="keys.graficoSalario"/>
      <graficoFuncao @zoom="(zoom,unzoom) => {zoomActivator('grafico-evolucao',zoom,unzoom)}" id="grafico-evolucao" :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :loading="loading" :tooltip="config.tooltip" :smooth="config.smooth" :key="keys.graficoFuncao"/>
      <div id="cards">
          <totalSalario :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :key="keys.totalSalario"/>
          <totalEvolucao :cargos="cargosFiltrados" :media="config.media" :tipo="config.precisao.tipo" :key="keys.totalEvolucao"/>
      </div>
      
      
      
      
      
      <div class="zoom-full" v-show="zoom">
        <div id="cima" class="blur"></div>
        <div id="esquerda" class="blur"></div>
        <div id="direita" class="blur"></div>
        <div id="baixo" class="blur"></div>
        <div class="background">
            <div class="zoom">
            <div class="box" id="zoom-box">
                <div class="botoes">
                <a href="#" @click="undoZoom"><i class="fas fa-times pad-custom"></i></a>
                </div>
                <div id="zoom-area"></div>
            </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

import Menu from './menu.vue'
import graficoSalario from './grafico_salario'
import graficoFuncao from './grafico_promocao'
import totalSalario from './total_salario'
import totalEvolucao from './total_evolucao'

export default {
    components:{
        Menu,
        graficoSalario,
        graficoFuncao,
        totalSalario,
        totalEvolucao
    },
    data(){
        return{
            cargosFiltrados:{},
            zoom: false,
            cargos:{},
            loading: true,
            lista: { nome: [], setor: [], funcao: [] },
            filtros: { nome: [], setor: [], funcao: [] },
            config: {
                media: true,
                ponderado: true,
                tooltip:true,
                smooth: false,
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
                totalSalario:20,
                totalEvolucao:30
            }
        }
    },
    methods:{
        zoomActivator(id, zoom, unzoom) {
            if (this.zoom) {
                return;
            }
            this.zoom = true;
            const area = document.querySelector("#" + id)
            document.querySelector("#zoom-area").appendChild(area)
            this.saveMethod = unzoom
            zoom()
        },
        undoZoom() {
            const node = document.querySelector("#zoom-area").firstElementChild
            document.querySelector("#FUN").appendChild(node)
            this.zoom = false
            this.saveMethod()
        },
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
        fazFiltragem(first = false){
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

          if(!first){
            this.cargosFiltrados = funcFiltrados
          }
          else{
              this.cargosFiltrados = []
          }
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
        this.fazFiltragem(true);
        this.loading = false        
    }
}
</script>

<style>

#FUN{
    row-gap: 10px;
    column-gap: 10px;
    padding:10px;
}

#FUN{
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 
    "menu menu cards grafico-salario grafico-salario grafico-salario"
    "menu menu cards grafico-evolucao grafico-evolucao grafico-evolucao";
}

.zoom-full {
  position: absolute;
  z-index: 2;
  display: grid;
  width: calc(100% - 50px);
  height: 100vh;
  grid-template-rows: 5vh 90vh 5vh;
  grid-template-columns: calc(5% - 20px) 90% 1fr;
  grid-template-areas:
    "cima cima cima"
    "esquerda zoomBox direita"
    "baixo baixo baixo";
}

#zoom-area {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

#cima {
  grid-area: cima;
}

#esquerda {
  grid-area: esquerda;
}

#direita {
  grid-area: direita;
}

#baixo {
  grid-area: baixo;
}

#cards{
    grid-area: cards;
}

#cards{
    display: grid;
    grid-gap: 10px;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr;
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



.print-page #FUN{
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 2fr 5fr;
    grid-template-areas: 
    "cards grafico-salario"
    "cards grafico-evolucao";
    height: 95%;
}
</style>