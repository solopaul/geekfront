<template>
  <el-container v-loading="loading" :style="{'background-color': 'rgba(32,35,43,.75)'}">
    <cms-header @mousedown.native="dragWin"></cms-header>
    <el-main :style="{'flex-direction': window.layout}">
      <div class="flex-left" :style="{width: window.leftSideWidth + 'px'}">
        <cms-lelist v-if="true" @onSelect="selectLe"></cms-lelist>
        <cms-profilelist v-if="false"></cms-profilelist>
        <cms-macrolist v-if="true"></cms-macrolist>
      </div>
      <div class="flex-right" :style="{width: 'calc(100% - ' + (window.leftSideWidth + 10) + 'px)'}">
        <section v-loading="!isDevReady" class="box-device" :style="{width: '100%', height: (window.height - 100 - 300 - 30) + 'px;'}">
          <cms-device
            ref="dev"
            v-if="isDevReady"
            :keys="device.keymap"
            :orgwidth="dev.orgwidth"
            :orgheight="dev.orgheight"
            :zoomin="dev.zoomin"
            :keycap="deviceshow.keycap"
            :panel="deviceshow.panel"
            :outline="deviceshow.outline"
            :showwidth="parseInt(window.width - window.leftSideWidth - 30)"
            :showheight="parseInt(window.height - 100 - 300 - 30)"
            :lespeed="parseInt(100)"
          ></cms-device>
          <div v-if="false" class="dev-normal" style="width:100%;height:calc(100vh - 420px);background:#fff;" :style="{'background-image': 'url('+ require('../assets/skin/bg24.jpg')+')'}">
            <div class="key" :style="{width:'60px', height: '60px', top: '50px', left: '50px', 'text-align': 'center', 'padding': '.2em', 'background-color': 'cyan'}">
              <span style="color: white;font-weight:bold;text-shadow: 0 0 2px cyan">Tab</span>
            </div>
          </div>
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
import { mapState } from 'vuex';
import Header from './Header';
import Footer from './Footer';
import LeList from './LeList';
import ProfileList from './ProfileList';
import MacroList from './MacroList';
import Device from './Device';
import KeySet from './KeySet';
//import { device2 } from "../device/device2.js";
export default {
  name: 'HelloWorld',
  data () {
    return {
      dev: null,
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
  computed: {
    ...mapState(["isDevReady", "device", "curdevice", "window", "devicelist", "frontdir"]),
    deviceshow: function(){
      let keycappath = this.frontdir + '/device/' + this.curdevice.ModelID + '/img/device_keycap.png';
      let panelpath = this.frontdir + '/device/' + this.curdevice.ModelID + '/img/device_panel.png';
      let outlinepath = this.frontdir + '/device/' + this.curdevice.ModelID + '/img/device_outline.png';
      return {
        keycap: keycappath,
        panel: panelpath,
        outline: outlinepath
      }
    }
  },
  mounted(){
      // let devdir = this.devdir;
      // let devid = this.curdevice.ModelID;
      this.dev = {
        keymap: this.device.keymap,
        orgwidth: 1200,
        orgheight: 600,
        zoomin: 0,
        //, 'background-image': 'url('+ require('../assets/img/keyboard/key.png')+')'
        //img_panel: require('D:/jizhi/GK6X-Release/CMSEngine/driver/device/' + devid + '/img/device_panel.png'),
        //img_panel: '',
        // img_keycap: require('D:/jizhi/GK6X-Release/CMSEngine/driver/device/' + devid + '/img/device_keycap.png'),
        // img_outline: require('D:/jizhi/GK6X-Release/CMSEngine/driver/device/' + devid + '/img/device_outline.png'),
        // img_panel: require('../device/655491172/img/device_panel.png'),
        // img_keycap: require('../device/655491172/img/device_keycap.png'),
        // img_outline: require('../device/655491172/img/device_outline.png'),
        // showwidth: parseInt(this.window.width - this.window.leftSideWidth - 30),
        // showheight: parseInt(this.window.height - 100 - 300 - 30),
        // lespeed: 100
      }
  },
  methods: {
    dragWin(){
      setTimeout(()=>{window.startDrag();},0);
    },
    selectLe(val){
      this.$store.commit("setCurPlayLe", val);
      window.readLE(val, (data) => {
        this.$refs.dev.playLe(data);
      });
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
    .key {
      position: absolute;
      background-size: contain;
      border-radius: 10%;
      box-shadow: 0 0 20px cyan;
      background-image: url("../assets/img/keyboard/center.png"), url("../assets/img/keyboard/left.png"), url("../assets/img/keyboard/right.png");
      background-repeat: repeat, no-repeat, no-repeat;
      background-size: contain contain, contain contain, contain contain;
      background-position: 10% , left, right;
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
