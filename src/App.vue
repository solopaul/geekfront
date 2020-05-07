<template>
  <div id="app" v-loading="loading" :style="{'background-image': 'url(' + skinpath  + ')', 'background-size': 'cover'}">
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
      loading: false
    }
  },
  created() {
    Promise.all([window.initEnvConfig(), window.initAppConfig(), window.initDeviceList(), window.initLeList(), window.initMacroList()]).then(res => {
      console.log(res, 'promise all 方法');
      this.$store.commit('initEnvConf', res[0]);
      this.$store.commit('initAppConf', res[1]);
      this.$store.commit('initDeviceList', res[2]);
      this.$store.commit('initLeList', res[3]);
      this.$store.commit('initMacroList', res[4]);
      this.loading = false;
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
    skinpath() {
      return this.$store.state.appconf.Skin && this.$store.state.appconf.Skin.path ? this.$store.state.appconf.Skin.path : require('./assets/skin/bg5.jpg');
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
