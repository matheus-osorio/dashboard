<template>
  <div id="MED">
      <graficoDiario id="diario"/>
      <graficoAcumulado id="acumulado"/>
      <graficoHistorico id="historico"/>
      <totalContrato id="total"/>
      <tabelaArea id="tabela"/>
  </div>
</template>

<script>

import graficoDiario from './grafico_diario'
import graficoAcumulado from './grafico_acumulado'
import graficoHistorico from './grafico_historico'
import totalContrato from './total_contrato'
import tabelaArea from './tabela_area'
export default {
    components:{
        graficoDiario,
        graficoAcumulado,
        graficoHistorico,
        totalContrato,
        tabelaArea
    }
}
</script>

<style>
#MED{
    display: grid;
    height: 100%;
    grid-template-rows: 30px 380px 1fr;
    grid-template-columns:30px 490px 15px 490px 1fr;
    grid-template-areas: 
    "nada nada nada nada nada"
    "espaco diario barra1 acumulado historico"
    "espaco numsei barra2 tabela total";
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
.outer-ring{
    border-style: solid;
    border-radius: 10px;
    border-color: linear-gradient(180deg, rgba(6,183,227,1) 9%, rgba(11,221,157,1) 73%);
}
</style>