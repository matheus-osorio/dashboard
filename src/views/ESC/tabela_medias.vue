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
           <th>Idade</th>
           <th>Tempo de Empresa</th>
           <th>Salário</th>
       </thead>
       <tbody>
           <tr v-for="linha in tabela" :key="linha.id">
               <th>
                   <b>{{linha.setor}}</b>
               </th>
               <td>
                   {{linha.funcionarios}}
               </td>
               <td>
                   {{linha.idade}}
               </td>
               <td>
                   {{linha.tempo}}
               </td>
               <td>
                   R$ <money :raw="linha.salario" invalid="Inválido"/>
               </td>
           </tr>
        </tbody>  
     </table> 
  </div>
</div>
  
</template>

<script>

import money from './money'

export default {
    props:['funcionarios'],
    data(){
        return {
            titulo: 'Tabela (Médias)',
            tabela: []
        }
    },
    components:{
        money
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

        idade(data1){
            
            data1 = data1.split(' ')[0].split('/') //normaliza data e cria array com os dias
            const agora = new Date()
            const data2 = [agora.getDate(),agora.getMonth() +1 ,agora.getFullYear()]
            
            let idade = data2[2] - data1[2]
            if(data2[2] > data1[2]){
                idade += 1
            }

            if(data2[2] == data1[2] && data2[1] >= data2[1]){
                idade += 1
            }

            return idade
        },
        totalPorCategoria(arr,categoria){
            const totalFuncionarios = arr.length 
            let idades = this.mapear(arr,['nasc'])
            let tempo = this.mapear(arr,['adm'])
            let salario = this.mapear(arr,['salario','maior'])
            salario = salario.map((valor) => parseFloat(valor.replace(',','.')))

            salario = salario.reduce((soma,valor) => {return soma + valor})/totalFuncionarios
            tempo = tempo.map((data) => {return this.idade(data)}).reduce((soma,valor) => {return soma + valor})/totalFuncionarios
            idades = idades.map((data) => {return this.idade(data)}).reduce((soma,valor) => {return soma + valor})/totalFuncionarios 
            console.log('tempo:', tempo, 'idades: ',idades, 'salario:', salario)
            return {
                setor: categoria,
                funcionarios: totalFuncionarios,
                idade: idades.toFixed(2),
                tempo: tempo.toFixed(2),
                salario: salario.toFixed(2)
            }
        }
    },
    mounted(){
        let setores = this.mapear(this.funcionarios,['setor']) //pega lista dos setores
        setores = new Set(setores) //cria set para tirar os repetidos
        setores = Array.from(setores) //cria array sem repetidos
        // console.log('setores',setores)
        this.tabela = setores.map((atual) => {
            // console.log(atual)
            const filtrados = this.funcionarios.filter((funcionario) => {return funcionario.setor == atual}) //filtra todos os funcionarios do setor
            // console.log('filtrado:',filtrados)
            return this.totalPorCategoria(filtrados,atual) //retorna dados do setor
        })
        this.tabela.push(this.totalPorCategoria(this.funcionarios,'TOTAL')) //insere total
        // console.log('tabela: ',this.tabela)
    }

}
</script>

<style>

</style>