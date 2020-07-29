<template>
  <div class="device" @mouseout="hideKeyConf" :style="{width: showwidth + 'px', height: showheight + 'px', overflow: 'hidden'}">
    <div
      class="device-le"
      v-for="(key,idx) in showkeys"
      :key="'le' + key.LocationCode + idx"
      :data-location="key.LocationCode"
      :style="{'left': key.Position.Left + 'px','top': key.Position.Top + 'px','width': key.Position.Width + 'px','height': key.Position.Height + 'px', 'transform': 'rotate(' + key.Position.Rotate + 'deg)'}"
    >
    </div>
    <img :src="outline" class="device-outline" :style="{position: 'absolute', 'width': showimgwidth + 'px','left': offsetleft + 'px', 'top' :offsettop+'px'}"/>
    <img :src="panel" :style="{position: 'absolute', 'width': showimgwidth + 'px','left': offsetleft + 'px', 'top' :offsettop+'px'}"/>
    <img :src="keycap" :style="{position: 'absolute', 'width': showimgwidth + 'px','left': offsetleft + 'px', 'top' :offsettop+'px'}"/>
    <div
      v-show="true"
      v-for="(key,idx) in showkeys"
      :key="'key'+idx"
      :id="'key'+key.LogicCode"
      class="device-key"
      v-bind:class="{'noshowkeyset': true, 'current': currentkey == key.LogicCode, 'fnsel': (fnmode && key.LogicCode == 0)}"
      @mouseover="showKeyConf(key,$event)"
      @click="setCurrentKey(key.LogicCode)"
      :style="{'left': key.Position.Left + 'px', 'top': key.Position.Top + 'px', 'width': key.Position.Width + 'px', 'height': key.Position.Height + 'px', 'transform': 'rotate(' + key.Position.Rotate + 'deg)', 'font-size': ((zoom + 1) * 0.8) + 'em'}" :data-logic="key.LogicCode"
      >
    </div>
    <div id="key_conf" class="el-popover el-popper el-popover--plain" style="position: absolute; top: 20px; left: 118px; transform-origin: center top; z-index: 1;padding: 8px 10px;min-width: 80px;" x-placement="top">
      功能：<span id="key_func_show"></span> <el-button class="el-icon-delete" type="text"></el-button>
      <div x-arrow="" class="popper__arrow" style="left: calc(50% - 6px)"></div>
    </div>
    <el-slider vertical v-model="zoomoffset" @change="zoomChange" :format-tooltip="formatZoomOffset" height="200px" :style="{position:'absolute', left: '10px', top: (showheight - 200) / 2 + 'px'}"></el-slider>
    <el-row class="dev-ctrls top">
      <el-col :span="24">
        <span>
          <span>{{$store.state.curdevice.Name}}</span>
          <el-divider direction="vertical"></el-divider>
          <span>{{fwversion}}</span>
        </span>
        <el-radio-group v-if="false" v-model="playspeed" size="mini">
          <el-radio-button label="20">极快</el-radio-button>
          <el-radio-button label="50">正常</el-radio-button>
          <el-radio-button label="100">慢速</el-radio-button>
        </el-radio-group>
        <el-popover
          placement="bottom-end"
          title="标题"
          width="200"
          trigger="click"
          content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
          <el-button class="el-icon-setting" type="text" slot="reference">设置</el-button>
        </el-popover>
      </el-col>
    </el-row>
    <el-row class="dev-ctrls btm">
      <el-col :span="24">
        <el-radio-group v-model="device.profile.GUID" @change="changeProfile" size="mini">
          <el-radio-button v-for="item in profilelist" :key="item.GUID" :label="item.GUID">{{$t("common")[item.Name]}}</el-radio-button>
        </el-radio-group>
        <div>
          <el-button type="default" icon="el-icon-check">{{$t("common.save")}}</el-button>
          <el-button type="primary" icon="el-icon-download">{{$t("common.apply")}}</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { toJS, fromRGB, toHSB, fromHSB } from "../util/color.js";
import { compare } from "../util/util.js";
import { mapState } from 'vuex';
export default {
  name: "Device",
  data() {
    return {
      zoomoffset: localStorage.getItem("zoomoffset") ? parseInt(localStorage.getItem("zoomoffset")) : 50,
      playtimer: null,
      value: 0,
      playspeed: 100,
      modeidx: "",
      fnmode: false,
      currentkey: null
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
  watch: {
    "device.profile.GUID": function(nval, oval){
      if(nval != oval){
        this.initProfile(this.device.profile);
      }
    }
  },
  computed: {
    ...mapState(["curdevice", "device", "userconfig"]),
    profilelist: function() {
      let pflist = this.$store.state.device.profilelist ? this.$store.state.device.profilelist : [];
      pflist = pflist.sort(compare("ModeIndex", true));
      let pfonline = [];
      let pfonboard = [];
      pflist.forEach(item => {
        if(item.ModeIndex == 0){
          pfonline.push(item);
        }else{
          pfonboard.push(item);
        }
      });
      pflist = pfonboard.concat(pfonline);
      return pflist;
    },
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
    // let ledata = {"Frames":[{"Count":1,"Data":{"0":"0xffffff","1":"0xffffff","2":"0xffffff","3":"0xffffff","4":"0xffffff","5":"0xffffff","6":"0xffffff","7":"0xffffff","8":"0xffffff","9":"0xffffff","10":"0xffffff","11":"0xffffff","12":"0xffffff","13":"0xffffff","14":"0xffffff","15":"0xffffff","16":"0xffffff","17":"0xffffff","18":"0xffffff","19":"0xffffff","20":"0xffffff","21":"0xffffff","22":"0xffffff","23":"0xffffff","24":"0xffffff","25":"0xffffff","26":"0xffffff","27":"0xffffff","28":"0xffffff","29":"0xffffff","30":"0xffffff","31":"0xffffff","32":"0xffffff","33":"0xffffff","34":"0xffffff","35":"0xffffff","36":"0xffffff","37":"0xffffff","38":"0xffffff","39":"0xffffff","40":"0xffffff","41":"0xffffff","42":"0xffffff","43":"0xffffff","44":"0xffffff","45":"0xffffff","46":"0xffffff","47":"0xffffff","48":"0xffffff","49":"0xffffff","50":"0xffffff","51":"0xffffff","52":"0xffffff","53":"0xffffff","54":"0xffffff","55":"0xffffff","56":"0xffffff","57":"0xffffff","58":"0xffffff","59":"0xffffff","60":"0xffffff","61":"0xffffff","62":"0xffffff","63":"0xffffff","64":"0xffffff","65":"0xffffff","66":"0xffffff","67":"0xffffff","68":"0xffffff","69":"0xffffff","70":"0xffffff","71":"0xffffff","72":"0xffffff","73":"0xffffff","74":"0xffffff","75":"0xffffff","76":"0xffffff","77":"0xffffff","78":"0xffffff","79":"0xffffff","80":"0xffffff","81":"0xffffff","82":"0xffffff","83":"0xffffff","84":"0xffffff","85":"0xffffff","86":"0xffffff","87":"0xffffff","88":"0xffffff","89":"0xffffff","90":"0xffffff","91":"0xffffff","92":"0xffffff","93":"0xffffff","94":"0xffffff","95":"0xffffff","96":"0xffffff","97":"0xffffff","98":"0xffffff","99":"0xffffff","100":"0xffffff","101":"0xffffff","102":"0xffffff","103":"0xffffff","104":"0xffffff","105":"0xffffff","106":"0xffffff","107":"0xffffff","108":"0xffffff","109":"0xffffff","110":"0xffffff","111":"0xffffff","112":"0xffffff","113":"0xffffff","114":"0xffffff","115":"0xffffff","116":"0xffffff","117":"0xffffff","118":"0xffffff","119":"0xffffff","120":"0xffffff","121":"0xffffff","122":"0xffffff","123":"0xffffff","124":"0xffffff","125":"0xffffff","126":"0xffffff","127":"0xffffff","128":"0xffffff","129":"0xffffff","130":"0xffffff","131":"0xffffff"},"Name":"frame0"}],"GUID":"2B09E183-E827-49a3-84CC-B3350B8F4A83","LEConfigs":[{"Color":"0xff0000","Count":60,"Keys":[70,91,111,69,90,88,110,68,49,89],"Type":1},{"Color":"0xff0099","Count":60,"Keys":[67,66,47,45,44,46,48,49,22,23],"Type":1},{"Color":"0xcc00ff","Count":60,"Keys":[0,24,25,2,3,26,4,27,50,5,28,1],"Type":1},{"Color":"0x3300ff","Count":60,"Keys":[7,29,8,30,9,10,31,6],"Type":1},{"Color":"0x0066ff","Count":60,"Keys":[51,32,11,12,33,34,13,14,15,52,16,17,18,19],"Type":1},{"Color":"0x00ffff","Count":60,"Keys":[53,54,55,56,58,36,59,37,38,39,60,61,40,41,42,43,62,63,64,52,20,21,35,57],"Type":1},{"Color":"0x00ff66","Count":60,"Keys":[75,76,77,79,84,85,86,65,109,78,80,81,83],"Type":1},{"Color":"0x33ff00","Count":60,"Keys":[99,102,104,106,107,108,130,128,127,126,125,75,98,100,101,103],"Type":1},{"Color":"0xccff00","Count":60,"Keys":[124,122,121,120,98,97,74,123],"Type":1},{"Color":"0xff9900","Count":60,"Keys":[96,73,72,95,119,118],"Type":1},{"Color":"0xff0000","Count":60,"Keys":[116,94,71,70,93,92,112,113,115],"Type":1}],"Name":"风车1"}
    // this.playLe(ledata);
  },
  beforeDestroy: function() {
    //console.log("before destory");
  },
  destroyed: function() {
    //console.log("destoryed");
  },
  methods: {
    showKeyConf(key, $event) {
      let targetdom =  $event.target;
      this.$el.querySelector("#key_func_show").innerText = targetdom.getAttribute('data-func') ? targetdom.getAttribute('data-func') : "未设置 ";
      let confboxdom = this.$el.querySelector("#key_conf");
      confboxdom.style.display = "block";
      confboxdom.style.left = (targetdom.offsetLeft - (confboxdom.offsetWidth - targetdom.offsetWidth) / 2) + "px";
      confboxdom.style.top = (targetdom.offsetTop - confboxdom.offsetHeight - 2) + "px";
    },
    hideKeyConf() {
      this.$el.querySelector("#key_conf").style.display = "none";
    },
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
            ".device-le[data-location='" + lc + "']"
          );
          if (objkey) objkey.style.setProperty("background-color", "#000");
        }
      }
      for (var leitem in data) {
        objkey = this.$el.querySelector(
          ".device-le[data-location='" + leitem + "']"
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
          ".device-le[data-location='" + lc + "']"
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
    },
    setCurrentKey(lcode){
      if(lcode > 0){
        this.currentkey = (lcode == this.currentkey ? null : lcode);
      } else if(lcode == 0){
        this.fnmode = !this.fnmode;
      }
    },
    //profile
    changeProfile(guid) {
      console.log(333,guid, this.curdevice);
      window.readProfile(this.curdevice.ModelID, guid, (data)=>{
        this.$store.commit("setCurProfile", data);
        this.initProfile(data);
        this.$EventBus.$emit("profileChange");
        window.cprofile = JSON.parse(JSON.stringify(data));
        if(this.userconfig.ModelInit[this.curdevice.ModelID].Mode !== data.ModeIndex){
          this.userconfig.ModelInit[this.curdevice.ModelID].Mode = data.ModeIndex;
          window.writeUserConfig(this.userconfig);
        }
      });
    },
    initProfile(pfdetail){
      // let fnkey = this.$el.querySelector('#key0');
      // fnkey.classList.add("fnsel");
      this.clearProfileStat(this.device.keymap);
      if(pfdetail.ModeIndex == 1){
        this.initStdProfile(pfdetail);
      }else{
        this.initKeyset(pfdetail);
      }
    },
    clearProfileStat(keymap){
      this.currentkey = null;
      this.fnmode = false;
      keymap.forEach((item) => {
        var obj = this.$el.querySelector('#key' + item.LogicCode);
        if(obj){
          obj.classList.remove("current");
          obj.classList.remove("seted");
          obj.classList.remove("fnsel");
          obj.innerText = "";
        }
      })
    },
    initStdProfile: function(pf){
      console.log(pf);
    },
    initKeyset: function(pfdetail){
      let keytype = this.fnmode ? "FnKeySet" : "KeySet";
      pfdetail[keytype].forEach((item)=>{
        var obj = this.$el.querySelector('#key' + item.Index);
        if(obj){
          obj.classList.remove("seted");
          obj.classList.remove("current");
          obj.setAttribute("data-func", item.MenuName);
          obj.setAttribute("data-le", '');
          if(item.MenuName != ""){
            obj.classList.add("seted");
            obj.innerText = item.MenuName;
          }
        }
      });
      // if(!this.fnmode){
      // }
      // DEVICE.currentProfile[type].forEach((item,index)=>{
      //   var obj = document.getElementById('key'+item.Index);
      //   if(obj){
      //     obj.classList.remove("seted");
      //     obj.classList.remove("fnseted");
      //     obj.setAttribute("data-func", '');
      //     obj.setAttribute("data-le", '');
      //     obj.innerHTML = '<span></span>';
      //     if(_this.isfnkeyset){
      //       obj.classList.add("fnseted");
      //     }
      //     if(DEVICE.currentProfile[type][index].MenuName){
      //       obj.children[0].classList.add("hasfunc");
      //       obj.classList.add("seted");
      //       if(DEVICE.currentProfile[type][index].DriverValue == "0x0A010001"){
      //         obj.children[0].innerHTML = item.MenuName;
      //         obj.setAttribute("data-func", item.MenuName);
      //       }else{
      //         console.log(item.DriverValue)
      //         if(window.KeyFunc[item.DriverValue]){
      //           if(window.KeyFunc[item.DriverValue].hasOwnProperty('Icon'))
      //             obj.children[0].classList.add(window.KeyFunc[item.DriverValue].Icon);
      //           if(window.KeyFunc[item.DriverValue].ShowClass)
      //             obj.children[0].classList.add(window.KeyFunc[item.DriverValue].ShowClass);
      //           obj.setAttribute("data-func", _this.$t('keys')[window.KeyFunc[item.DriverValue].LangTitle]);
      //           if(!window.KeyFunc[item.DriverValue].Icon){
      //             obj.children[0].innerHTML = _this.$t('keys')[window.KeyFunc[item.DriverValue].LangTitle];
      //           }else{
      //             obj.children[0].innerHTML = '';
      //           }
      //         }else{
      //           obj.setAttribute("data-func", item.MenuName);
      //           if(item.MenuName.length <= 5)
      //             obj.children[0].innerHTML = item.MenuName;
      //           else
      //             obj.children[0].innerHTML = item.MenuName.substring(0,4) + '...';
      //         }

      //       }
      //     }
      //     if(DEVICE.currentProfile.KeySet[index].KeyLE && DEVICE.currentProfile.KeySet[index].KeyLE.GUID !== ''){
      //       obj.classList.add("seted");
      //       obj.setAttribute("data-le", DEVICE.currentProfile.KeySet[index].KeyLE.Name);
      //     }
      //   }
      // });
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
      display:flex;
      justify-content:space-between;
      color:#00c2ff;
      padding: 10px 20px;
      font-size:.9rem;
    }
  }
  // img{
  //   z-index: 0;
  // }
}
.device-le {
  justify-content: center;
  text-align: center;
  position: absolute;
  background-color: green;
  color: black;
}
.device-key {
  justify-content: center;
  text-align: center;
  position: absolute;
  // display: flex;
  // align-items: center;
  height: 100%;
  line-height: 100%;
  align-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 2px;
  box-sizing: border-box;
  color: #00c2ff;
  cursor: pointer;
  &:hover, &.current {
    box-shadow: 0px 0px 2px 2px #FC6621;
    background-color: rgba(252, 102, 33, 0.3);
  }
  &.seted {
    background-color: rgba(0, 0, 0, 0.6);
  }
  &.current {
    border:2px dashed #ff0;
  }
  &.fnsel {
    border:1px solid rgb(158, 158, 149);
    box-shadow: 0px 0px 5px 5px #00c2ff;
  }
}
.device-key > p {
  color: white;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
