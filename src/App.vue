<template>
  <div id="app" ondragstart="return false" v-loading="loading" :style="{'background-image': 'url(' + skinpath  + ')', 'background-size': skinsize}">
    <cms-main></cms-main>
  </div>
</template>

<script>
import CmsMain from './components/Main.vue'

export default {
  name: 'App',
  components: {
    CmsMain
  },
  data() {
    return {
      loading: true
    }
  },
  created() {
    Promise.all([window.initEnvConfig(), window.initAppConfig(), window.initDeviceList(), window.initLeList(), window.initMacroList()]).then((res) => {
      this.$store.commit('initEnvConf', res[0]);
      this.$store.commit('initAppConf', res[1]);
      this.$store.commit('initDeviceList', res[2]);
      this.$store.commit('initLeList', res[3]);
      this.$store.commit('initMacroList', res[4]);
      if(res[2].length > 0){
        this.$store.commit('setCurDevice', res[2][0]);
      }
      this.loading = false;
    }).then(()=>{
      this.initDevice(this.$store.state.curdevice);
      window.initMacroList();
    }).catch(
      (err) => {
        console.log(err)
      }
    )
  },
  mounted() {
    window.onresize = () => {
      this.$store.commit("setScreen");
    }
  },
  computed: {
    curdev(){
      return this.$store.state.curdevice;
    },
    skinpath() {
      return this.$store.state.appconf.Skin && this.$store.state.appconf.Skin.path ? this.$store.state.appconf.Skin.path : require('./assets/skin/bg5.jpg');
    },
    skinsize() {
      return this.$store.state.appconf.Skin && this.$store.state.appconf.Skin.mode == 1 ? "inherit" : "cover";
    }
  },
  watch: {
    curdev (newVal, oldVal) {
      if(newVal != oldVal)
      this.initDevice(newVal);
    }
  },
  methods:{
    initDevice(curdev){
      let curdevid = curdev.ModelID;
      Promise.all([window.initDeviceConfig(curdevid),window.initDeviceKeymap(curdevid),window.initDeviceProfileList(curdevid),window.initDeviceFWVersion(curdevid)]).then(resdev => {
        console.log(2345555,resdev);
        this.$store.commit('setCurConfig', resdev[0]);
        this.$store.commit('setCurKeymap', resdev[1]);
        this.$store.commit('setCurProfileList', resdev[2]);
        window.readProfile(curdevid, resdev[2][0].GUID, (data)=>{
          console.log(11111);
          this.$store.commit('setCurProfile', data);
          this.$store.commit('setCurFWVersion', resdev[3]);
          // console.log("profile0:",JSON.stringify(data,null,2));
          // console.log("device:",JSON.stringify(this.$store.state.device))
        })
      });
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
