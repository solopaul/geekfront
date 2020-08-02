import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/theme/index.css'
import './assets/iconfont/base.css'
// import './assets/css/theme-green/index.css'; // 浅绿色主题
//Axios from 'vue-axios'
//Vue.use(VueAxios, axios)
//Vue.prototype.$http = axios
import './assets/css/el-base.scss'; // 浅绿色主题
import './assets/css/common.scss'; // 浅绿色主题
import './assets/js/cms.js';
import './assets/js/app.js';
import VueRouter from 'vue-router';
import store from './store';
import i18n from './i18n/i18n'
Vue.use(VueRouter)
Vue.use(ElementUI, {
    size: 'mini'
});
Vue.config.productionTip = false;
Vue.prototype.$EventBus = new Vue();

new Vue({
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
