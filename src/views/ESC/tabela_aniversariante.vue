<template>
  <div class="area-total background scroll">
    <div class="area">
     <table>
       <thead>
           <th>Nome</th>
           <th>Aniversário</th>
        
       </thead>
       <tbody>
           <tr v-for="linha in tabela" :key="linha.id">
               <td>
                   {{linha.user}}
               </td>
               <td>
                   {{linha.nasc}}
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
            tabela: []
        }
    },
    methods:{
        aniversariantes(){

            let func = this.funcionarios.filter((fun) => this.aniversarioNoMes(fun))
            for(let i=0;i<func.length;i++){
                for(let j=i+1;j<func.length;j++){
                    if(func[i].nasc > func[j].nasc){
                        [func[i],func[j]] = [func[j],func[i]]
                    }
                }
            }

            func = func.map(fun => {
                const nasc = fun.nasc.split(' ')[0].split('/')
                fun.nasc = nasc[0] + '/' + nasc[1]
                return fun
            })
            return func
        },
        aniversarioNoMes(funcionario){
            const nasc = funcionario.nasc
            const mes = nasc.split(' ')[0].split('/')[1]
            const mesAtual = (new Date()).getMonth() + 1
            return mes == mesAtual
        }
    },
    mounted(){
       this.tabela = this.aniversariantes() 
    }
    
}
</script>

<style>
.scroll{
    overflow: auto;
}


</style>