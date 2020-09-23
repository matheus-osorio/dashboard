<template>
    <div class="background" @click="zoom">
    <div class="area-definida" v-if="!mostrarTabela">
      <div class="title">Funcionários Ativos Hoje</div>
      <div class="number">{{valor}}</div>
    </div>
    <table v-if="mostrarTabela">
        <thead>
            <th>
                Grupo
            </th>
            <th>
                Funcionários Ativos
            </th>
        </thead>
        <tbody>
            <tr v-for="linha in tabela" :key="linha.id">
                <td>
                    {{linha.grupo}}
                </td>
                <td>
                    {{linha.valor}}
                </td>
            </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
    data(){
        return{
            valor: 0,
            tabela: {},
            mostrarTabela: false
        }
    },
    methods:{
        onZoom(){
            this.mostrarTabela = true
        },
        onUnzoom(){
            this.mostrarTabela = false
            const node = document.querySelector("#quadro1")
            const parent = document.querySelector("#subdivisao")

            parent.appendChild(node)
        },
        zoom(){
        this.$emit('zoom',this.onZoom,this.onUnzoom)
        },
        porArea(hoje){
            const chaves = Object.keys(hoje)
            return chaves.reduce((obj,chave) => {
                const arr = hoje[chave]
                obj[chave] = arr.reduce((soma,unitario) => {
                    return soma.concat(unitario.data)
                },[])
                return obj
            },{})
        },
        unicoArray(valores){
            const chaves = Object.keys(valores)
            return chaves.reduce((obj,chave) => obj.concat(valores[chave]),[])
        },
        fazerTabela(grupos,porArea,validos){
            const chaves = Object.keys(grupos)

            const agrupado = chaves.reduce((obj,chave) => {
                const gp = grupos[chave].grupo
                obj[chave] = gp.reduce((arr,setor) => {
                    if(porArea[setor] != undefined){
                        arr = arr.concat(porArea[setor])
                    }
                    
                    return arr
                },[])
                return obj
            },{})

            const linhas = Object.keys(agrupado).map((chave) => {
                return {
                    valor: agrupado[chave].filter((status) => validos[status]).length,
                    grupo: chave
                }
            })
            return linhas
        }
    },
    mounted(){
        fetch(this.$store.getters.link('hoje',this.$route.params))
        .then(response => response.json())
        .then(hoje => {
            fetch(this.$store.getters.link('cor',this.$route.params))
            .then(response => response.json())
            .then(cores => {
                fetch(this.$store.getters.link('grupo',this.$route.params))
                .then(response => response.json())
                .then(grupos => {
                    const validos = cores.reduce((obj,cor) => {
                    obj[cor.name] = cor.valid
                    return obj
                    },{})
                    const porArea = this.porArea(hoje)
                    console.log(porArea)
                    const arr = this.unicoArray(porArea)
                    this.tabela = this.fazerTabela(grupos,porArea,validos)
                    this.valor = arr.filter((status) => validos[status]).length
                })
                
            })
        })
    }
}
</script>

<style>

</style>