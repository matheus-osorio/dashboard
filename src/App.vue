<template>
  <div id="app">
    <nav class="vertical-bar">
      <img src="./img/logo.svg" class="logo" alt="">
      <hr class="line">
      <router-link :to="{name:'medicao',params:$route.params}" :class="{'selected':$route.name == 'medicao'}" @click="selected = 'MED'" class="waves-effect waves-teal btn-flat btn-custom">MED</router-link>
      <router-link :to="{name:'escala',params:$route.params}" :class="{'selected':$route.name == 'escala'}" @click="selected = 'ESC'" class="waves-effect waves-teal btn-flat btn-custom">ESC</router-link>
    </nav>
    <router-view/>
  </div>
  
</template>

<script>
export default {
  name: "App",
  components: {},
  data(){
    return {
      selected:"MED"
    }
  }
};
</script>

<style>
body{
  height:100vh;
}

#app {
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 50px 1fr;
  grid-template-areas: "navbar data";

}

.vertical-bar {
  display: flex;
  flex-direction: column;
  justify-content: start;
  grid-area: navbar;
  height: 100%;
  background: rgb(6,183,227);
  background: linear-gradient(180deg, rgba(6,183,227,1) 9%, rgba(11,221,157,1) 73%);
}

body{
  padding: 0px;
  margin: 0px;
}

@media(max-width: 600px){
  .vertical-bar{
    height: 100%;
  }

  #app{
    height: 1775px;
  }
}
.logo{
  height: 35px;
  margin-top: 5px;
}

.line{
  width: 90%;
  border: 1px;
  color: rgba(133, 131, 131, 0.548);
  border-style: solid;
  margin-bottom: 0px;
}

.btn-custom{
  padding-left: 0px;
  padding-right: 0px;
  text-align: center;
  color: white;
}

.selected{
  background: rgba(128, 128, 128, 0.5);
}

::-webkit-scrollbar {
  width: 3px;
  border-radius: 30px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #888; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>


