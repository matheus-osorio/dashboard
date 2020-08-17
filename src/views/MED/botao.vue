<template>
  <a href="#" @click="$emit(evento)" :class="classes" v-if="show" class="waves-effect waves-light btn-small">
      <i :class="icone" v-if="modo == 'icone'"></i>
  <span v-if="modo == 'frase'">{{frase}}</span></a>
</template>

<script>
export default {
    props:['classes','frase','evento','modo','icone','show']
}
</script>

<style>
.btn-zoom{
    border-radius: 50px;
    padding-left: 7px;
    padding-right: 7px;
    font-size: 0.5rem;
}

.btn-arrow{
    border-radius: 50px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 0.5rem;
}

.borda{
 margin-left: 8px;
}
i{
    font-size: inherit;
}
</style>