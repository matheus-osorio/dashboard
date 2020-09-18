<template>
  <div class="area-total background">
      <div class="area">
        <div class="cabecalho">
          {{titulo}}
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
                   <b>{{linha.setor}}</b>
               </th>
               <td>
                   {{linha.total}}
               </td>
               <td>
                   {{linha.alimentacao}}%
               </td>
               <td>
                   {{linha.transporte}}%
               </td>
               <td>
                   {{linha.cesta}}%
               </td>
               <td>
                   {{linha.ferias}}%
               </td>
           </tr>
        </tbody>  
     </table> 
  </div>
  </div>
</template>

<script>
export default {
  props: ['funcionarios'],
  data(){
      return {
          titulo:'Tabela Porcentagem',
          tabela: []
      }
  },
  methods:{
      buscarValor(obj,param){
            return param.reduce((obj,valor) => {
                return obj[valor] //retorna o valor no fim do array
            },obj)
        },

        mapear(arr,param){
            return arr.map((obj) => {return this.buscarValor(obj,param)}) //mapeia elementos de acordo com o array passado
        },

        criarPorcentagens(obj,categoria){
            const soma = obj.length

            const ferias = this.mapear(obj,['ferias']).reduce((soma,valor) => {
                return soma + (valor == true ? 1 : 0)
            })*100/soma
            const alimentacao = this.mapear(obj,['alimentacao']).reduce((soma,valor) => {
                return soma + (valor == true ? 1 : 0)
            })*100/soma
            const transporte = this.mapear(obj,['transporte']).reduce((soma,valor) => {
                return soma + (valor == true ? 1 : 0)
            })*100/soma
            const cesta = this.mapear(obj,['basica']).reduce((soma,valor) => {
                return soma + (valor == true ? 1 : 0)
            })*100/soma

            return {
                setor: categoria,
                ferias: ferias.toFixed(2),
                alimentacao: alimentacao.toFixed(2),
                transporte: transporte.toFixed(2),
                cesta: cesta.toFixed(2),
                total: soma
            }

        }
  },
  mounted(){
      let setores = this.mapear(this.funcionarios,['setor'])
      setores = new Set(setores)
      setores = Array.from(setores)

      const porcentagens = setores.map(categoria => {
          const filtr = this.funcionarios.filter((obj) => {return obj.setor == categoria})
          return this.criarPorcentagens(filtr,categoria)
      })
      porcentagens.push(this.criarPorcentagens(this.funcionarios,'TOTAL'))
      this.tabela = porcentagens
  }
}
</script>

<style>

</style>