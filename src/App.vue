<template>
  <div id="app" :class="{'print-page':print}">
    <nav class="vertical-bar">
      <img src="./img/logo.svg" class="logo" alt="">
      <hr class="line">
      <router-link :to="{name:'medicao',params:$route.params}" :class="{'selected':$route.name == 'medicao'}" @click="selected = 'MED'" class="waves-effect waves-teal btn-flat btn-custom"><i class="fas fa-pencil-ruler centered"></i></router-link>
      <router-link :to="{name:'escala',params:$route.params}" :class="{'selected':$route.name == 'escala'}" @click="selected = 'ESC'" class="waves-effect waves-teal btn-flat btn-custom"><i class="fas fa-table centered"></i></router-link>
      <router-link :to="{name:'funcionarios',params:$route.params}" :class="{'selected':$route.name == 'funcionarios'}" @click="selected = 'FUN'" class="waves-effect waves-teal btn-flat btn-custom"><i class="fas fa-user-friends centered"></i></router-link>
      <a @click="printPage"  class="waves-effect waves-teal btn-flat btn-custom btn-option"><i class="fas fa-print centered"></i></a>

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
      selected:"MED",
      print:false
    }
  },
  methods:{
    printPage(){
      this.print = true
      setTimeout(() => {
        window.print()
        this.print = false
      },300)
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

.btn-option:active{
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

html {
    font-size:12px;
}
#MED {
    background: #f5f5f5;
}
.background, .fixo {
    background:#ffffff;
}
td, th {
    text-align:center;
}
thead th {
    padding: 6px;
}
.background {
    -webkit-box-shadow: 0px 0px 5px 0px rgba(225,225,225,1);
    -moz-box-shadow: 0px 0px 5px 0px rgba(225,225,225,1);
    box-shadow: 0px 0px 5px 0px #9f9f9f;
    padding: 0;
}
.area-definida {
    display: table;
    border-collapse: collapse; 
}
.cabecalho,.title {
    font-size:14px;
    font-weight:normal;
    /*background:#ebf2f8;*/
    border-bottom: 1px solid  #d0d0d0;
    display:table-row;
    width:100%;
    text-align:left;
}
.area-definida .title {
    display:table-row;
    height: 40px;
    text-indent: 7px;
    line-height: 30px;
}
.number {
    font-size: 26px;
}
.area .cabecalho {
    justify-content: left;
    padding-left: 7px;
    padding-right: 0;
    display:block;
    height: 40px;
    text-align:left;
}
.overflow-graph, .echarts {
    top: 10px;
    position: relative;
    overflow-x: hidden;
    padding:10px 10px 10px;
}
.number {
    margin:auto;
    display:table-cell;
    vertical-align:middle;
    height:100%;
    text-align:center;
}
.cabecalho .btn-small {
    height:24px;
    width:24px;
    line-height:25px;
    padding:0;
    float:right;
    background-color: #ffffff !important;
    color: #00796b;
}
.btn-small i {
    font-size:12px;
}
.btn-arrow,.teal.darken-2 {
    width: 24px;
    height: 24px;
    line-height: 24px;
    padding-left: 6px;
    background-color: #ffffff !important;
    color: #00796b;
}

@media(max-width: 600px){
  #app {
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr;
  grid-template-columns: 1fr;
  grid-template-areas: 
  "navbar" 
  "data";

 }

 .vertical-bar {
  display: flex;
  flex-direction: row;
  justify-content: start;
  grid-area: navbar;
  height: 100%;
  background: rgb(6,183,227);
  background: linear-gradient(180deg, rgba(6,183,227,1) 9%, rgba(11,221,157,1) 73%);
 }

 .line{
   display: none;
 }

 .btn-custom{
   padding-right: 10px;
   padding-left: 10px;
   height: 100%;
 }

 .centered{
   padding-top: 30%;
 }
}



  #app.print-page{
    width: 1000px;
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;
    grid-template-areas: 
    "data";
  }
  .print-page .vertical-bar{
    display: none;
  }


@media print{
  #app.print-page{
    width: 100%;
  }
}
</style>


