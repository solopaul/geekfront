<template>
  <div class="settings-box">
    <el-form ref="form_settings" :model="settings" label-position="left" label-width="90px" label-suffix=" : ">
      <el-form-item label="软件版本">
        {{appconf.SoftVersion}}
        <el-button type="text" class="el-icon-refresh" v-if="false"> 检测</el-button>
      </el-form-item>
      <el-form-item label="语言设置">
        <el-select v-model="appconf.Language" @change="setLang" placeholder="请选择语言">
          <el-option label="中文" value="zh"></el-option>
          <el-option label="英文" value="en"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示设置">
        <el-select v-model="appconf.Screen" @change="setScreen" placeholder="请选择">
          <el-option label="1200*900" value="0"></el-option>
          <el-option label="1024*768" value="1"></el-option>
          <el-option label="1920*1080" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="true" label="开机启动">
        <el-switch v-model="settings.openwith"></el-switch>
      </el-form-item>
      <el-form-item v-if="true" label="布局">
        <el-radio-group v-model="window.layout" @change="setLayout" size="mini" >
          <el-radio label="row">左右布局</el-radio>
          <el-radio label="row-reverse">右左布局</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form :model="settings" label-position="top" label-suffix=" : ">
      <el-form-item v-if="true" label="皮肤">
        <div class="skins" style="">
          <div :class="{item:true, active: skinpath == skin.path}" v-for="(skin,index) in skins" :key="skin.path" @click="setSkin(skin)" :style="{'background-image': 'url(' + skin.path + ')'}">
            <div class="mask">
              <p class="desc">{{skin.name + (index + 1)}}</p>
            </div>
            <span class="el-icon-check"></span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="支持机型">
        <div class="support">
          <span class="item" v-for="(model,index) in devicelist" :key="model.ModelID">{{model.Name}}<el-divider v-if="index != devicelist.length - 1" direction="vertical"></el-divider></span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: "Settings",
  data() {
    return {
      settings: { name: "设置", lang: "zh", openwith: true },
      skins: [
        {name: "皮肤", path: require('../assets/skin/bg1.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg2.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg3.jpg'),mode: 1},
        {name: "皮肤", path: require('../assets/skin/bg4.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg5.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg6.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg7.jpg'),mode: 1},
        {name: "皮肤", path: require('../assets/skin/bg8.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg9.jpg'),mode: 0}
      ],
      skinpath: null
    };
  },
  created() {},
  mounted() {
    this.skinpath = this.appconf.Skin.path;
    this.$i18n.locale = this.appconf.Language ? this.appconf.Language : "en";
  },
  computed: {
    ...mapState(["appconf", "window", "devicelist"]),
  },
  methods: {
    setLang(langkey) {
      let conf = JSON.parse(JSON.stringify(this.appconf));
      conf.Language = langkey;
      this.$i18n.locale = langkey;
      this.$store.commit('updateAppConf', conf);
    },
    setSkin(itemskin) {
      this.skinpath = itemskin.path;
      let conf = JSON.parse(JSON.stringify(this.appconf));
      conf.Skin = itemskin;
      this.$store.commit('updateAppConf', conf);
    },
    setScreen(val) {
      this.appconf.Screen = val;
      this.$store.commit('updateAppConf', this.appconf);
    },
    setLayout(val) {
      localStorage.setItem('layout', val);
    }
  },
};
</script>

<style lang="scss" scoped>
.settings-box {
  padding: 20px;
  text-align: left;
  .form-item__label {
    color: #888;
  }
  .support {
    // color: #ccc;
    font-size: .8em;
    max-height: 200px;
    overflow-y: auto;
    .el-divider {
      color: #666;
    }
  }
  .skins {
    width: 100%;
    max-height: 268px;
    overflow-y: auto;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    //justify-content: space-between ;
    padding: 5px;
    background-color: #131313;
    border: 1px solid #202020;
    border-radius: 5px;
    box-shadow: 4px 4px 8px #000;
    .item {
      position: relative;
      border: 1px solid #202020;
      margin: 5px;
      box-sizing: border-box;
      width: calc(100% / 3 - 10px);
      height: 75px;
      background-size: cover;
      .mask {
        display: none;
        position:absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(32,34,43,.5);
        p.desc {
          color: #00c2ff;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          padding: 0 10px;
          cursor: pointer;
        }
      }
      .el-icon-check {
        display: none;
        position: absolute;
        bottom: 5px;
        right: 5px;
        background-color: #00c2ff;
        padding: 4px;
        border-radius: 50%;
        color: #eee;
        font-weight: 600;
      }
      &:hover {
        border-color: #00c2ff;
        .mask {
          display: block;
        }
      } 
      &.active {
        border-color: #00c2ff;
        .el-icon-check {
          display: block;
        }
      }
    }
  }
}
</style>
