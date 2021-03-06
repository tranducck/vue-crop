import Vue from 'vue';
import App from './app';
import './assets/scss/base.scss';

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
