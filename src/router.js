import Vue from 'vue'
import Router from 'vue-router'


import MED from './views/MED/MED.vue'
import ESC from './views/ESC/ESC.vue'

const routes = [
    {path:'/medicao/:mes/:contrato',name:'medicao',component:MED},
    {path:'/escala/:mes/:contrato',name:'escala',component:ESC}
]

Vue.use(Router)

export default new Router({
    routes
})