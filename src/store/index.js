import Vue from "vue";
import Vuex from "vuex";

//挂载Vuex
Vue.use(Vuex);

//创建VueX对象
const store = new Vuex.Store({
  state: {
    name: "geekx",
    env: {},
    appconf: {},
    deviceconf: {},
    devicelist: [],
  },
  mutations: {
    edit(state) {
      state.name = "jack";
    },
    initEnvConf(state, data) {
      state.env = data;
    },
    initAppConf(state, data) {
      state.appconf = data;
    },
    initDeviceList(state, data) {
      state.devicelist = data;
    }
  },
});

export default store;
