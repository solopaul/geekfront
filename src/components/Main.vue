<template>
  <el-container v-loading="loading" :style="{'background-color': 'rgba(32,35,43,.75)'}">
    <cms-header @mousedown.native="dragWin"></cms-header>
    <el-main :style="{'flex-direction': $store.state.window.layout}">
      <div class="flex-left">
        <cms-lelist v-if="true"></cms-lelist>
        <cms-profilelist v-if="false"></cms-profilelist>
        <cms-macrolist v-if="true"></cms-macrolist>
      </div>
      <div class="flex-right">
        <section class="content">
          <cms-keyset v-if="true"></cms-keyset>
        </section>
      </div>
    </el-main>
    <el-footer ref="footer" @mousedown.native="dragWin" style="height: 40px;">
      <cms-footer></cms-footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from './Header';
import Footer from './Footer';
import LeList from './LeList';
import ProfileList from './ProfileList';
import MacroList from './MacroList';
import KeySet from './KeySet';
export default {
  name: 'HelloWorld',
  data () {
    return {
      drawer: false,
      loading: false
    }
  },
  components: {
    'cms-header': Header,
    'cms-footer': Footer,
    'cms-lelist': LeList,
    'cms-profilelist': ProfileList,
    'cms-macrolist': MacroList,
    'cms-keyset': KeySet
  },
  mounted(){
    // document.onmousedown =function (ev) {
    //   if(ev.target == document.querySelector(".el-header") || ev.target == document.querySelector(".el-footer")){
    //     setTimeout(()=>{window.startDrag();},0);
    //   }
    // }
    // window.initEnvConfig().then(res => {
    //   this.$store.commit('setEnvConf',res);
    //   window.initEnvConfig2().then(res => {
    //     this.$store.commit('setDeviceList',res);
    //   })
    // }).then()
  },
  methods: {
    dragWin(){
      setTimeout(()=>{window.startDrag();},0);
    }
  }
}
</script>

<style lang="scss" scoped>
.el-main {
  padding: 10px;
  height: calc(100% - 100px);
  display: flex;
  justify-content: space-between;
  .flex-left,.flex-right {
    height: 100%;
    padding: 0;
    box-sizing: border-box;
  }
  .flex-left {
    width: 265px;
  }
  .flex-right {
    width: calc(100% - 265px - 10px);
    position: relative;
  }
  section.content {
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 0;
    box-sizing: border-box;
    box-shadow: 0 0 10px #000;
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
