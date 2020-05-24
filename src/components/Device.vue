<template>
  <div class="device" :style="{width: showwidth + 'px', height: showheight + 'px', overflow: 'hidden'}">
    <div class="key-panel" :style="{'left': layoutpanel.left + 'px','top': layoutpanel.top + 'px','width': layoutpanel.width + 'px','height': layoutpanel.height + 'px'}">
    </div>
    <div
      :class="{'device-key': key.LogicCode >= 0, 'device-light': key.LogicCode == -1}"
      v-for="key in showkeys"
      :key="key.LocationCode"
      :data-location="key.LocationCode"
      :style="{'left': key.Position.Left + 'px','top': key.Position.Top + 'px','width': key.Position.Width + 'px','height': key.Position.Height + 'px', 'transform': 'rotate(' + key.Position.Rotate + 'deg)', 'font-size': keyfontsize + 'rem'}"
    >
      <p v-if="key.LogicCode >= 0" :data-logic="key.LogicCode" @click="playLe(key.LogicCode)">{{key.Show}}</p>
      <p v-else :data-logic="key.LogicCode" @click="playLe(key.LogicCode)"><span class="el-icon-sunny"></span></p>
    </div>
    <el-slider vertical v-model="zoomoffset" @change="zoomChange" :format-tooltip="formatZoomOffset" height="200px" :style="{position:'absolute', left: '10px', top: (showheight - 200) / 2 + 'px'}"></el-slider>
    <el-row class="dev-ctrls top">
      <el-col :span="24">
        <span>
          <span>{{$store.state.curdevice.Name}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{fwversion}}</span>
        </span>
        <span class="el-icon-setting">
        </span>
        <el-radio-group v-if="false" v-model="playspeed" size="mini">
          <el-radio-button label="20">极快</el-radio-button>
          <el-radio-button label="50">正常</el-radio-button>
          <el-radio-button label="100">慢速</el-radio-button>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="dev-ctrls btm">
      <el-col :span="24">
        <el-radio-group v-model="profile" size="mini">
          <el-radio-button label="0">标准层</el-radio-button>
          <el-radio-button label="1">板载一</el-radio-button>
          <el-radio-button label="2">板载二</el-radio-button>
          <el-radio-button label="3">板载三</el-radio-button>
          <el-radio-button label="4">驱动层</el-radio-button>
        </el-radio-group>
        <div>
          <el-button type="default" icon="el-icon-check">保存</el-button>
          <el-button type="primary" icon="el-icon-download">应用</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { toJS, fromRGB, toHSB, fromHSB } from "../util/color.js";
export default {
  name: "Device",
  data() {
    return {
      zoomoffset: localStorage.getItem("zoomoffset") ? parseInt(localStorage.getItem("zoomoffset")) : 50,
      playtimer: null,
      value: 0,
      profile: "1",
      playspeed: 100
    }
  },
  props: {
    orgwidth: { type: Number, required: true, default: 1200 },
    orgheight: { type: Number, required: true, default: 600 },
    showwidth: { type: Number, required: true, default: 1200 },
    showheight: { type: Number, required: true, default: 600 },
    zoomin: { type: Number, required: true, default: 0 },
    keys: { type: Array, required: true },
    keycap: { required: true },
    panel: { required: true },
    outline: { required: true },
    lespeed: { type: Number, default: 100 }
  },
  watch: {},
  computed: {
    scale: function() {
      var scale = 1;
      if (this.showwidth / this.showheight > this.orgwidth / this.orgheight) {
        scale = this.showheight / this.orgheight;
      } else {
        scale = this.showwidth / this.orgwidth;
      }
      return scale;
    },
    showimgwidth: function() {
      return this.orgwidth * (this.scale + this.zoom);
    },
    offsetleft: function() {
      return (this.showwidth - this.orgwidth * (this.scale + this.zoom)) / 2;
    },
    offsettop: function() {
      return (
        (this.showheight - this.orgheight * (this.scale + this.zoom)) / 2
      );
    },
    showkeys: function() {
      let tempkeys = JSON.parse(JSON.stringify(this.keys));
      tempkeys.forEach((item, index) => {
        tempkeys[index].Position.Left =
          tempkeys[index].Position.Left * (this.scale + this.zoom) +
          this.offsetleft;
        tempkeys[index].Position.Top =
          tempkeys[index].Position.Top * (this.scale + this.zoom) +
          this.offsettop;
        tempkeys[index].Position.Width =
          tempkeys[index].Position.Width * (this.scale + this.zoom);
        tempkeys[index].Position.Height =
          tempkeys[index].Position.Height * (this.scale + this.zoom);
      });
      return tempkeys;
    },
    zoom(){
      return this.zoomin + ((this.zoomoffset - 50) / 50);
    },
    fwversion(){
      return this.$store.state.device.fwversion && this.$store.state.device.fwversion.FWVersion ? this.$store.state.device.fwversion.FWVersion : "加载中";
    },
    layoutpanel(){
      let panellayout = {};
      let templeftmin = this.keys[0].Position.Left;
      let templeftmax = this.keys[0].Position.Left + this.keys[0].Position.Width;
      let temptopmin = this.keys[0].Position.Top + this.keys[0].Position.Width;
      let temptopmax = this.keys[0].Position.Top + this.keys[0].Position.Height;
      this.keys.forEach(item => {
        if(item.Position.Left < templeftmin){
          templeftmin = item.Position.Left;
        }
        if(item.Position.Left + item.Position.Width > templeftmax){
          templeftmax = item.Position.Left + item.Position.Width;
        }
        if(item.Position.Top < temptopmin){
          temptopmin = item.Position.Top;
        }
        if(item.Position.Top + item.Position.Height > temptopmax){
          temptopmax = item.Position.Top + item.Position.Height;
        }
      });
      panellayout.left = (templeftmin) * (this.scale + this.zoom) + this.offsetleft - 14;
      panellayout.top = (temptopmin) * (this.scale + this.zoom) + this.offsettop - 15;
      panellayout.width = (templeftmax - templeftmin) * (this.scale + this.zoom) + 28;
      panellayout.height = (temptopmax - temptopmin) * (this.scale + this.zoom) + 40;
      console.log(templeftmax-templeftmin,temptopmax-temptopmin);
      return panellayout;
    },
    keyfontsize() {
      return this.scale + this.zoom;
    }
  },
  beforeCreate: function() {
    //console.log("before create");
  },
  created: function() {
    console.log("created");
    //this.zoom = this.zoomin;
    this.playspeed = this.lespeed ? this.lespeed : 100;
  },
  beforeMount: function() {
    //console.log("before mount");
  },
  mounted: function() {
    //console.log("mounted");
    let ledata = {"Frames":[{"Count":1,"Data":{"0":"0xffffff","1":"0xffffff","2":"0xffffff","3":"0xffffff","4":"0xffffff","5":"0xffffff","6":"0xffffff","7":"0xffffff","8":"0xffffff","9":"0xffffff","10":"0xffffff","11":"0xffffff","12":"0xffffff","13":"0xffffff","14":"0xffffff","15":"0xffffff","16":"0xffffff","17":"0xffffff","18":"0xffffff","19":"0xffffff","20":"0xffffff","21":"0xffffff","22":"0xffffff","23":"0xffffff","24":"0xffffff","25":"0xffffff","26":"0xffffff","27":"0xffffff","28":"0xffffff","29":"0xffffff","30":"0xffffff","31":"0xffffff","32":"0xffffff","33":"0xffffff","34":"0xffffff","35":"0xffffff","36":"0xffffff","37":"0xffffff","38":"0xffffff","39":"0xffffff","40":"0xffffff","41":"0xffffff","42":"0xffffff","43":"0xffffff","44":"0xffffff","45":"0xffffff","46":"0xffffff","47":"0xffffff","48":"0xffffff","49":"0xffffff","50":"0xffffff","51":"0xffffff","52":"0xffffff","53":"0xffffff","54":"0xffffff","55":"0xffffff","56":"0xffffff","57":"0xffffff","58":"0xffffff","59":"0xffffff","60":"0xffffff","61":"0xffffff","62":"0xffffff","63":"0xffffff","64":"0xffffff","65":"0xffffff","66":"0xffffff","67":"0xffffff","68":"0xffffff","69":"0xffffff","70":"0xffffff","71":"0xffffff","72":"0xffffff","73":"0xffffff","74":"0xffffff","75":"0xffffff","76":"0xffffff","77":"0xffffff","78":"0xffffff","79":"0xffffff","80":"0xffffff","81":"0xffffff","82":"0xffffff","83":"0xffffff","84":"0xffffff","85":"0xffffff","86":"0xffffff","87":"0xffffff","88":"0xffffff","89":"0xffffff","90":"0xffffff","91":"0xffffff","92":"0xffffff","93":"0xffffff","94":"0xffffff","95":"0xffffff","96":"0xffffff","97":"0xffffff","98":"0xffffff","99":"0xffffff","100":"0xffffff","101":"0xffffff","102":"0xffffff","103":"0xffffff","104":"0xffffff","105":"0xffffff","106":"0xffffff","107":"0xffffff","108":"0xffffff","109":"0xffffff","110":"0xffffff","111":"0xffffff","112":"0xffffff","113":"0xffffff","114":"0xffffff","115":"0xffffff","116":"0xffffff","117":"0xffffff","118":"0xffffff","119":"0xffffff","120":"0xffffff","121":"0xffffff","122":"0xffffff","123":"0xffffff","124":"0xffffff","125":"0xffffff","126":"0xffffff","127":"0xffffff","128":"0xffffff","129":"0xffffff","130":"0xffffff","131":"0xffffff"},"Name":"frame0"}],"GUID":"2B09E183-E827-49a3-84CC-B3350B8F4A83","LEConfigs":[{"Color":"0xff0000","Count":60,"Keys":[70,91,111,69,90,88,110,68,49,89],"Type":1},{"Color":"0xff0099","Count":60,"Keys":[67,66,47,45,44,46,48,49,22,23],"Type":1},{"Color":"0xcc00ff","Count":60,"Keys":[0,24,25,2,3,26,4,27,50,5,28,1],"Type":1},{"Color":"0x3300ff","Count":60,"Keys":[7,29,8,30,9,10,31,6],"Type":1},{"Color":"0x0066ff","Count":60,"Keys":[51,32,11,12,33,34,13,14,15,52,16,17,18,19],"Type":1},{"Color":"0x00ffff","Count":60,"Keys":[53,54,55,56,58,36,59,37,38,39,60,61,40,41,42,43,62,63,64,52,20,21,35,57],"Type":1},{"Color":"0x00ff66","Count":60,"Keys":[75,76,77,79,84,85,86,65,109,78,80,81,83],"Type":1},{"Color":"0x33ff00","Count":60,"Keys":[99,102,104,106,107,108,130,128,127,126,125,75,98,100,101,103],"Type":1},{"Color":"0xccff00","Count":60,"Keys":[124,122,121,120,98,97,74,123],"Type":1},{"Color":"0xff9900","Count":60,"Keys":[96,73,72,95,119,118],"Type":1},{"Color":"0xff0000","Count":60,"Keys":[116,94,71,70,93,92,112,113,115],"Type":1}],"Name":"风车1"}
    this.playLe(ledata);
  },
  beforeDestroy: function() {
    //console.log("before destory");
  },
  destroyed: function() {
    //console.log("destoryed");
  },
  methods: {
    selfDestroy: function() {
      this.$destroy();
    },
    renderFrame: function(data) {
      for (var i = 0; i < this.keys.length; i++) {
        var lc = this.keys[i].LocationCode;
        var objkey = null;
        lc = lc.toString();
        if (!data[lc]) {
          objkey = this.$el.querySelector(".device-key[data-location='" + lc + "']");
          if (objkey){
            objkey.style.setProperty("box-shadow", 'none');
            objkey.style.setProperty("color", "#000");
          }
        }
      }
      for (var leitem in data) {
        objkey = this.$el.querySelector(".device-key[data-location='" + leitem + "']");
        if(!objkey) {
          objkey = this.$el.querySelector(".device-light[data-location='" + leitem + "']");
        }
        if (objkey){
          //objkey.style.setProperty("border-color", toJS(data[leitem]));
          objkey.style.setProperty("color", toJS(data[leitem]));
          //objkey.style.setProperty("border-color", toJS(data[leitem]));
          if(objkey.classList.contains('device-light')){
            objkey.style.setProperty("text-shadow", '0 0 20px '+toJS(data[leitem]));
          }else{
            objkey.style.setProperty("box-shadow", '0 0 10px '+toJS(data[leitem]));
          }
        }
      }
    },
    stopLe() {
      clearInterval(this.playtimer);
      this.playtimer = null;
      for (var i = 0; i < this.keys.length; i++) {
        var lc = this.keys[i].LocationCode;
        lc = lc.toString();
        var objkey = this.$el.querySelector(
          ".device-key[data-location='" + lc + "']"
        );
        if (objkey) objkey.style.setProperty("background-color", "#000");
      }
    },
    playLe(LeData) {
      var _this = this;
      var intvframe = 0;
      var intvcount = 0;
      var intframecount = 0;
      var framecount = 0;
      //console.log(JSON.stringify(LeData))
      for (var fc = 0; fc < LeData.Frames.length; fc++) {
        framecount += LeData.Frames[fc].Count;
      }
      if (this.playtimer) {
        clearInterval(this.playtimer);
        this.playtimer = null;
      }
      var intvplay = 0;
      this.playtimer = setInterval(function() {
        intframecount++;
        if (intframecount == framecount) {
          intframecount = 0;
        }
        //console.log(intframecount);
        var lecfg = JSON.parse(JSON.stringify(LeData.LEConfigs));
        var allcolor = {};
        for (var lc = 0; lc < lecfg.length; lc++) {
          if (!lecfg[lc].Color) {
            lecfg[lc].Color = "0xffffff";
          }
          var hsb = null;
          switch (lecfg[lc].Type) {
            case 0:
              lecfg[lc].Color = toJS(lecfg[lc].Color);
              break;
            case 1:
              hsb = toHSB(lecfg[lc].Color);
              hsb.h =
                (hsb.h +
                  (intvplay % lecfg[lc].Count) * (360 / lecfg[lc].Count)) %
                360;
              lecfg[lc].Color = fromRGB(fromHSB(hsb));
              //console.log(hsb)
              break;
            case 2:
              //lecfg[lc].Color = toJS(lecfg[lc].Color);
              hsb = toHSB(lecfg[lc].Color);
              hsb.b =
                hsb.b -
                ((intvplay % (lecfg[lc].Count + lecfg[lc].StayCount)) /
                  (lecfg[lc].Count + lecfg[lc].StayCount)) *
                  100;
              lecfg[lc].Color = fromRGB(fromHSB(hsb));
              break;
          }
          for (var keycfg in lecfg[lc].Keys) {
            allcolor[lecfg[lc].Keys[keycfg]] = lecfg[lc].Color;
          }
        }
        var lecfgarr = {};
        for (var tc in LeData.Frames[intvframe].Data) {
          if (allcolor[tc]) {
            lecfgarr[tc] = allcolor[tc];
          } else {
            lecfgarr[tc] = "0xffffff";
          }
        }
        //console.log(LeData.Frames[intvframe].Data);
        if (LeData.Frames[intvframe].Count > 1) {
          if (intvcount == LeData.Frames[intvframe].Count - 1) {
            intvframe++;
            intvcount = 0;
            if (intvframe == LeData.Frames.length) intvframe = 0;
          }
          _this.renderFrame(lecfgarr);
          intvcount++;
        } else {
          if (LeData.Frames[intvframe].Data) _this.renderFrame(lecfgarr);
          intvframe++;
          if (intvframe == LeData.Frames.length) intvframe = 0;
        }
        intvplay++;
      }, this.lespeed);
    },
    zoomChange(val) {
      localStorage.setItem("zoomoffset", val);
    },
    formatZoomOffset(val) {
      return (1 + (val - 50) / 50).toFixed(2) + "X";
    }
  }
};
</script>

<style lang="scss" scoped>
.device {
  width: 100%;
  position: relative;
  .dev-ctrls {
    position:absolute;
    width:100%;
    &.top{
      top:0;
    }
    &.btm{
      bottom:0;
    }
    .el-col{
      display:flex;justify-content:space-between;color:#00c2ff;padding: 10px 20px;font-size:.9rem;
    }
  }
}
.key-panel {
  position: absolute;
  background-color: #463973;
  border-color: #2e2640;
  border-radius: 5px;
  border-style: solid;
  border-width: 8px 10px 15px 10px;
  display: inline-grid;
  grid-template-columns: repeat(36,1fr);
  grid-template-rows: repeat(5,1fr);
  padding: 5px;
  user-select: none;
  box-sizing: border-box;
  box-shadow: 0 0 2em #00c2ff;
}
.device-key {
  position: absolute;
  border-color: #382e59 #2e2640;
  border-radius: 4px;
  border-style: solid;
  border-width: 3px 5px 8px 5px;
  color: #bbadd9;
  display: block;
  font-size: 1rem;
  font-weight: normal;
  //grid-column-end: span 2;
  //margin: 3px;
  //padding-top: 2px;
  //@at-rootpadding: 5px;
  text-align: center;
  text-transform: uppercase;
  transition: all 50ms ease-out;
  will-change: box-shadow,color,text-shadow;
  box-sizing: border-box;
  background-color: #202020;
}
.device-light {
  position: absolute;
  display:flex;
  font-size: 1rem;
  font-weight: 800;
  align-items: center;
  text-align: center;
  p{
    margin: 0 auto;
  }
}
.device-key > p {
  margin: 0;
}
</style>
