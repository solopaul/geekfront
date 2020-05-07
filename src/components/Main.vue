<template>
  <el-container v-loading="loading" :style="{'background-color': 'rgba(32,35,43,.75)'}">
    <cms-header @mousedown.native="dragWin"></cms-header>
    <el-main :style="{'flex-direction': $store.state.window.layout}">
      <div class="flex-left" :style="{width: $store.state.window.leftSideWidth + 'px'}">
        <cms-lelist v-if="true"></cms-lelist>
        <cms-profilelist v-if="false"></cms-profilelist>
        <cms-macrolist v-if="true"></cms-macrolist>
      </div>
      <div class="flex-right" :style="{width: 'calc(100% - ' + ($store.state.window.leftSideWidth + 10) + 'px)'}">
        <section class="box-device" :style="{width: '100%', height: ($store.state.window.height - 100 - 300 - 30) + 'px;'}">
          <cms-device v-if="true"
            :ref="'device2'"
            :deviceid="dev.deviceid"
            :keys="dev.keys"
            :orgwidth="dev.orgwidth"
            :orgheight="dev.orgheight"
            :zoomin="dev.zoomin"
            :keycap="dev.img_keycap"
            :panel="dev.img_panel"
            :outline="dev.img_outline"
            :showwidth="parseInt($store.state.window.width - $store.state.window.leftSideWidth - 30)"
            :showheight="parseInt($store.state.window.height - 100 - 300 - 30)"
            :lespeed="parseInt(100)"
          ></cms-device>
        </section>
        <section class="box-keyset">
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
import Device from './Device';
import KeySet from './KeySet';
import { device2 } from "../device/device2.js";
export default {
  name: 'HelloWorld',
  data () {
    return {
      dev: device2,
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
    'cms-device': Device,
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
    // width: 265px;
  }
  .flex-right {
    position: relative;
  }
  section.box-device {
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px #000;
    &:hover {
      box-shadow: 0 0 20px #000;
    }
  }
  section.box-keyset {
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
