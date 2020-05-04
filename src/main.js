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
import './assets/js/cms.js'
import './assets/js/app.js'
// import './assets/js/init.js'
import VueRouter from 'vue-router'
import store from './store'
Vue.use(VueRouter)
Vue.use(ElementUI, {
    size: 'mini'
});
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
