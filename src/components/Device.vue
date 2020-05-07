<template>
  <div class="device" :style="{width: showwidth + 'px', height: showheight + 'px', overflow: 'hidden'}">
    <el-row class="device-tools" style="position:absolute;top:0;width:100%;">
      <el-col :span="24" style="color:#00c2ff;padding: 10px 20px;font-size: .9rem;">
        <span>GK64-RGB</span>
        <el-divider direction="vertical"></el-divider>
        <span>v1.0.0</span>
      </el-col>
    </el-row>
    <div
      class="device-key"
      v-for="key in showkeys"
      :key="key.LocationCode"
      :data-location="key.LocationCode"
      :style="{'left': key.Position.Left + 'px','top': key.Position.Top + 'px','width': key.Position.Width + 'px','height': key.Position.Height + 'px', 'transform': 'rotate(' + key.Position.Rotate + 'deg)'}"
    >
      <p :data-logic="key.LogicCode" @click="playLe(key.LogicCode)"></p>
    </div>
    <img
      v-if="true"
      :src="outline"
      class="device-outline"
      :style="{position: 'absolute', 'width': showimgwidth + 'px','left': offsetleft + 'px', 'top' :offsettop+'px'}"
    />
    <img
      v-if="true"
      :src="panel"
      :style="{position: 'absolute', 'width': showimgwidth + 'px','left': offsetleft + 'px', 'top' :offsettop+'px'}"
    />
    <img
      v-if="true"
      :src="keycap"
      :style="{position: 'absolute', 'width': showimgwidth + 'px','left': offsetleft + 'px', 'top' :offsettop+'px'}"
    />
    <el-slider vertical v-model="zoomoffset" @change="zoomChange" :format-tooltip="formatZoomOffset" height="200px" :style="{position:'absolute', left: '10px', top: (showheight - 200) / 2 + 'px'}"></el-slider>
    <el-row class="device-tools" style="position:absolute;bottom:0;width:100%;">
      <el-col :span="24" style="display:flex;justify-content:space-between;color:#00c2ff;padding: 10px 20px;font-size:.9rem;">
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
      profile: "1"
    }
  },
  props: {
    deviceid: { type: Number, required: true, default: 1 },
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
    }
  },
  beforeCreate: function() {
    //console.log("before create");
  },
  created: function() {
    //console.log("created");
    //this.zoom = this.zoomin;
  },
  beforeMount: function() {
    //console.log("before mount");
  },
  mounted: function() {
    //console.log("mounted");
    //this.playLe(ledata);
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
          objkey = this.$el.querySelector(
            ".device-key[data-location='" + lc + "']"
          );
          if (objkey) objkey.style.setProperty("background-color", "#000");
        }
      }
      for (var leitem in data) {
        objkey = this.$el.querySelector(
          ".device-key[data-location='" + leitem + "']"
        );
        if (objkey)
          objkey.style.setProperty("background-color", toJS(data[leitem]));
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
      }, _this.lespeed);
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
}
.device-key {
  justify-content: center;
  text-align: center;
  position: absolute;
  background-color: green;
  color: black;
}
.device-key > p {
  color: white;
  margin: 0;
}
</style>
