import Vue from "vue";
import Vuex from "vuex";

//挂载Vuex
Vue.use(Vuex);

//创建VueX对象
const store = new Vuex.Store({
  state: {
    name: "geekx",
    window: {
      height: document.documentElement.clientHeight || document.body.clientHeight,
      width: document.documentElement.clientWidth || document.body.clientWidth,
      layout: localStorage.getItem("layout") ? localStorage.getItem('layout') : "row"
    },
    style: {
      basecolor: '#888',
      activecolor: '#00c2ff',
      bgappsize: 'cover',
      bgheader: 'rgba(32,34,43,.9)',
      bgcontent: 'rgba(32,34,43,.8)',
      gradient: {
        background: 'linear-gradient(45deg, #20232b, rgba(100,100,100,.3))'
      }
    },
    env: {},
    appconf: {},
    devicelist: [],
    deviceconf: {},
    lelist: []
  },
  mutations: {
    edit(state) {
      state.name = "solopaul";
    },
    initEnvConf(state, data) {
      state.env = data;
    },
    initAppConf(state, data) {
      state.appconf = data;
    },
    initDeviceList(state, data) {
      state.devicelist = data;
    },
    initLeList(state, data) {
      state.lelist = data;
    },
    updateAppConf(state, data) {
      window.writeAppConfig(data, () => {
        state.appconf = data;
      });
    }
  },
});

export default store;
