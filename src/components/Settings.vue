<template>
  <div class="settings-box">
    <el-form ref="form_settings" :model="settings" label-position="left" label-width="90px" label-suffix=" : ">
      <el-form-item label="软件版本">
        {{$store.state.appconf.SoftVersion}}
        <el-button type="text" class="el-icon-refresh"> 检测</el-button>
      </el-form-item>
      <el-form-item label="语言设置">
        <el-select v-model="$store.state.appconf.Language" @change="setLang" placeholder="请选择语言">
          <el-option label="中文" value="zh"></el-option>
          <el-option label="英文" value="en"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示设置">
        <el-select v-model="$store.state.appconf.Language" @change="setLang" placeholder="请选择">
          <el-option label="1200*900" value="zh"></el-option>
          <el-option label="1024*768" value="en"></el-option>
          <el-option label="1920*1080" value="en"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="true" label="开机启动">
        <el-switch v-model="settings.openwith"></el-switch>
      </el-form-item>
      <el-form-item v-if="true" label="布局">
        <el-radio-group v-model="$store.state.window.layout" @change="setLayout" size="mini" >
          <el-radio label="row">左右布局</el-radio>
          <el-radio label="row-reverse">右左布局</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form :model="settings" label-position="top">
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
          <span class="item" v-for="(model,index) in $store.state.devicelist" :key="model.ModelID">{{model.Name}}<el-divider v-if="index != $store.state.devicelist.length - 1" direction="vertical"></el-divider></span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      settings: { name: "设置", lang: "zh", openwith: true },
      skins: [
        {name: "皮肤", path: require('../assets/skin/bg1.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg2.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg3.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg4.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg5.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg6.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg7.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg8.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg9.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg10.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg11.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg12.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg13.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg14.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg15.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg16.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg17.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg18.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg19.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg20.jpg'),mode: 1},
        {name: "皮肤", path: require('../assets/skin/bg21.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg22.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg23.jpg'),mode: 1},
        {name: "皮肤", path: require('../assets/skin/bg24.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg25.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg26.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg27.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg28.jpg'),mode: 1},
        {name: "皮肤", path: require('../assets/skin/bg29.jpg'),mode: 0},
        {name: "皮肤", path: require('../assets/skin/bg30.jpg'),mode: 1}
      ],
      skinpath: null
    };
  },
  created() {},
  mounted() {
    this.skinpath = this.$store.state.appconf.Skin.path;
  },
  computed: {},
  methods: {
    setLang(langkey) {
      let conf = JSON.parse(JSON.stringify(this.$store.state.appconf));
      conf.Language = langkey;
      this.$store.commit('updateAppConf', conf);
    },
    setSkin(itemskin) {
      this.skinpath = itemskin.path;
      let conf = JSON.parse(JSON.stringify(this.$store.state.appconf));
      conf.Skin = itemskin;
      this.$store.commit('updateAppConf', conf);
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
    overflow-y: scroll;
    .el-divider {
      color: #666;
    }
  }
  .skins {
    width: 100%;
    max-height: 265px;
    overflow-y: scroll;
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
