<template>
  <div>
    <el-header ref="header" class="head-box">
      <div class="menu-left">
        <img class="logo" :src="frontdir + '/res/img/logo.png'" alt="">
        <el-menu
        default-active="1"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="rgba(32,34,43,.2)"
        text-color="#bbb"
        active-text-color="#00c2ff">
          <el-menu-item index="1"><span class="el-icon-cpu"></span>功能配置</el-menu-item>
          <el-menu-item v-if="false" index="2" disabled><span class="el-icon-sunrise-1"></span>灯效</el-menu-item>
          <el-menu-item v-if="false" index="3" disabled><span class="el-icon-edit-outline"></span>宏</el-menu-item>
          <el-menu-item v-if="false" index="4" disabled><span class="el-icon-s-comment"></span>敬请期待</el-menu-item>
        </el-menu>
      </div>
      <div class="menu-right">
        <div class="switch-box">
            <el-carousel arrow="hover" type="card" :autoplay="false" @change="changeDevice" indicator-position="none" height="60px">
                <el-carousel-item v-for="item in devicelist" :key="item.Name">
                    <img :src="frontdir + '/device/' + item.ModelID + '/device.png'" @error="setDefaultImg($event)" :alt="item.Name">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="setting-box">
          <div>
            <span @click="drawer = true" class="el-icon-s-tools"></span>
          </div>
          <div>
            <span @click="miniWin" class="el-icon-minus"></span>
          </div>
          <div>
            <span @click="closeWin" class="el-icon-close"></span>
          </div>
        </div>
      </div>
    </el-header>
    <el-drawer
      :visible.sync="drawer"
      :modal="false"
      direction="rtl"
      size="400px">
        <span slot="title" class="el-icon-s-tools" style="text-align:left;font-weight:bold;font-size:.9em"> 系统设置</span>
      <cms-settings></cms-settings>
    </el-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Settings from './Settings';
export default {
  name: 'Header',
  data () {
    return {
      drawer: false
    }
  },
  components: {
    'cms-settings': Settings
  },
  computed: {
    ...mapState(["devicelist", "frontdir"])
  },
  mounted(){
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    miniWin() {
      window.minimizeCMSUI();
    },
    closeWin() {
      window.closeCMSUI();
    },
    changeDevice(val) {
      this.$store.commit("setCurDevice", this.devicelist[val]);
    },
    setDefaultImg($event) {
      $event.target.src = require('../assets/img/device.png');
    }
  }
}
</script>

<style lang="scss" scoped>
.head-box {
  display:flex;
  justify-content: space-between;
  padding-right:0;
  cursor:move;
  box-shadow: 0 0 10px #000;
  .menu-left {
    display:flex;
    .logo {
      height:56px;
      display:inline-block;
      filter: grayscale(30%);
      &:hover {
        filter: grayscale(1%);
        cursor: pointer;
      }
    }
  }
  .menu-right {
    display:flex;
    width:400px;
    /deep/ .switch-box {
      width: 298px;
      text-align: center;
      .el-carousel__arrow {
        width: 24px;
        border-radius: 8%;
        background-color: rgba(15, 68, 128, 0.2);
        color: #e4e4e4;
      }
      .el-carousel__arrow:hover {
        background-color: rgba(7, 98, 202, 0.61);
      }
      .el-carousel__mask {
        background-color: rgba(255,255,255,0);
      }
    }
    .setting-box {
      font-size: 18px;
      width: 102px;
      display: flex;
      div{
        flex:1;
        border: none;
        box-sizing: border-box;
        align-items: center;
        &:nth-child(3) span:hover{
          color: white;
          background-color: rgba(244, 84, 84, 0.8);
          font-weight: bold;
        }
        span{
          border: none;
          cursor: pointer;
          padding: 6px 8px;
          margin: 0;
          display: inline-block;
          &:hover{
            color: #00c2ff;
            background-color: rgba(255,255,255,.1);
          }
        }
      }
    }
  }
}
</style>
