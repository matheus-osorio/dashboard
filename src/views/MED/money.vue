<template>
  <span>{{dinheiro}}</span>
</template>

<script>
export default {
    props:['raw','invalid'],
    computed:{
        dinheiro(){
            let valor = ("" + parseFloat(this.raw).toFixed(2)).replace(".", ",");
            if (!valor.match(",")) {
            valor += ",00";
            } else if (valor.match(/.+,\d$/)) {
            valor += "0";
            }
            valor = valor.replace(/(\d)(?=(\d{3})+,)/g,'$1.')
            if(valor.match('Infinity') || valor.match('NaN')){
                return this.invalid
            }
            return valor
        }
    }
}
</script>

<style>
</style>