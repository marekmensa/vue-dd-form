import Vue from 'vue';
import App from './App.vue';
import ddForm from '../src';
Vue.use(ddForm);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
