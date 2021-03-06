import Vue from 'vue';
import Echarts from 'vue-echarts';

import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';

Vue.component('e-chart', Echarts);