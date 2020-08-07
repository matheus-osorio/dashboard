<template>
  <div id="MED">
      <graficoDiario id="diario"/>
      <graficoAcumulado id="acumulado"/>
      <graficoHistorico id="historico"/>
      <div id="total">
          <totalContrato/>
          <totalFuncionarios/>
      </div>
      <tabelaArea id="tabela"/>
      <graficoAnual id="anual"/>
  </div>
</template>

<script>

import graficoDiario from './grafico_diario'
import graficoAcumulado from './grafico_acumulado'
import graficoHistorico from './grafico_historico'
import totalContrato from './total_contrato'
import tabelaArea from './tabela_area'
import graficoAnual from './grafico_anual'
import totalFuncionarios from './total_funcionarios'

export default {
    components:{
        graficoDiario,
        graficoAcumulado,
        graficoHistorico,
        totalContrato,
        tabelaArea,
        graficoAnual,
        totalFuncionarios
    }
}
</script>

<style>
#MED{
    display: grid;
    height: 100%;
    grid-template-rows: 15px 340px 1fr;
    grid-template-columns:30px 490px 15px 490px 1fr;
    grid-template-areas: 
    "nada nada nada nada nada"
    "espaco diario barra1 acumulado historico"
    "espaco anual barra2 tabela total";
}

@media(max-width: 600px){
 #MED{
    display: grid;
    height: 100%;
    grid-template-rows: 15px 340px 15px 340px 15px 340px 15px 340px 15px 340px;
    grid-template-columns:10px 1fr;
    grid-template-areas: 
    "espaco nada1"
    "espaco diario"
    "espaco nada2"
    "espaco acumulado"
    "espaco nada3"
    "espaco historico"
    "espaco nada4"
    "espaco anual"
    "espaco nada5"
    "espaco tabela";
}   
}

#diario{
    grid-area: diario;
}

#acumulado{
    grid-area: acumulado;
}

#historico{
    grid-area: historico;
}

#total{
    grid-area: total
}

#tabela{
    grid-area:tabela
}

#anual{
    grid-area:anual;
}
.outer-ring{
    border-style: solid;
    border-radius: 10px;
    border-color: linear-gradient(180deg, rgba(6,183,227,1) 9%, rgba(11,221,157,1) 73%);
}
</style>