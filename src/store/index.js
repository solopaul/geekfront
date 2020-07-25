import Vue from "vue";
import Vuex from "vuex";

//挂载Vuex
Vue.use(Vuex);

//创建VueX对象
const store = new Vuex.Store({
  state: {
    name: "geekx",
    devdir: 'D:/jizhi/GK6X-Release/CMSEngine/driver/device/',
    window: {
      height: document.documentElement.clientHeight || document.body.clientHeight,
      width: document.documentElement.clientWidth || document.body.clientWidth,
      layout: localStorage.getItem("layout") ? localStorage.getItem('layout') : "row",
      leftSideWidth: 265
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
    userconfig: {},
    devicelist: [],
    deviceconf: {},
    lelist: [],
    macrolist: [],
    curdevice: {},
    device: {
      config: {},
      keymap: [],
      profilelist: [],
      curprofile: {
        ModeIndex: 0
      },
      fwversion: {},
      curplayle: ""
    },
    isDevReady: false
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
    initMacroList(state, data) {
      state.macrolist = data;
    },
    setCurDevice(state, data) {
      state.curdevice = data;
    },
    setCurConfig(state, data) {
      state.device.config = data;
    },
    setCurKeymap(state, data) {
      state.device.keymap = data;
    },
    setCurProfileList(state, data) {
      state.device.profilelist = data;
    },
    setCurProfile(state, data) {
      state.device.profile = data;
      state.isDevReady = true;
    },
    setCurFWVersion(state, data) {
      state.device.fwversion = data;
    },
    setCurPlayLe(state, data) {
      state.device.curplayle = data;
    },
    setUserConfig(state, data) {
      state.userconfig = data;
    },
    updateAppConf(state, data) {
      window.writeAppConfig(data, () => {
        state.appconf = data;
      });
    },
    setScreen(state) {
      state.window.width = document.body.offsetWidth;
      state.window.height = document.body.offsetHeight;
    }
  },
});

export default store;
