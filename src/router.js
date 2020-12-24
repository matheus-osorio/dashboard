import Vue from 'vue'
import Router from 'vue-router'


import MED from './views/MED/MED.vue'
import ESC from './views/ESC/ESC.vue'
import FUN from './views/FUN/FUN.vue'

const routes = [
    {path:'/medicao/:periodo/:contrato/:estab/:mes/:ano',name:'medicao',component:MED},
    {path:'/escala/:periodo/:contrato/:estab/:mes/:ano',name:'escala',component:ESC},
    {path:'/funcionarios/:contrato/:estab/:mes/:ano',name:'funcionarios',component:FUN}

]

Vue.use(Router)

export default new Router({
    routes
})