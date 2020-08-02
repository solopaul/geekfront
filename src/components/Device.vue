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
      @mouseover="showKeyConf(key,$event)"
      @click="selCurrentKey(key.LogicCode)"
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
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color:#00c2ff;cursor:pointer;">
            <i class="el-icon-arrow-down el-icon-setting"></i>设置
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-delete">清除配置</el-dropdown-item>
            <el-dropdown-item icon="el-icon-refresh">恢复出厂</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <el-row class="dev-ctrls btm">
      <el-col :span="24">
        <el-radio-group v-model="device.profile.GUID" @change="changeProfile" size="mini">
          <el-radio-button v-for="item in profilelist" :key="item.GUID" :label="item.GUID">{{$t("common")[item.Name]}}</el-radio-button>
        </el-radio-group>
        <div>
          <el-button type="default" icon="el-icon-check" :class="{'btn-breath': pfchanged}">{{$t("common.save")}}</el-button>
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
// import keyfunc from "./config/keyfunc.js";
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
      currentkey: null,
      classseted: ["seted", "seted", "seted"],
      pfchanged: false
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
    },
    "fnmode": function(nval){
      if(nval){
        this.setClassByLogicCode(0, "fnsel", "add");
      }else{
        this.setClassByLogicCode(0, "fnsel", "remove");
      }
    },
    "currentkey": function(nval){
      this.device.keymap.forEach(item => {
        this.setClassByLogicCode(item.LogicCode, "current", "remove");
      })
      if(this.currentkey){
        this.setClassByLogicCode(nval, "current", "add");
      }else{
        this.setClassByLogicCode(nval, "current", "remove");
      }
    },
    "device.profile": {
      deep: true,
      handler(nval){
        console.log("pfchanged")
        if(JSON.stringify(nval) != JSON.stringify(window.cprofile)){
          this.pfchanged = true;
        }else{
          this.pfchanged = false;
        }
      }
    }
  },
  computed: {
    ...mapState(["curdevice", "device", "userconfig"]),
    profilelist: function() {
      let pflist = this.device.profilelist ? this.device.profilelist : [];
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
      return this.device.fwversion && this.device.fwversion.FWVersion ? this.device.fwversion.FWVersion : "加载中";
    },
    keysettype(){
      return this.fnmode ? "FnKeySet" : "KeySet";
    }
  },
  beforeCreate: function() {
    //console.log("before create");
  },
  created: function() {
    this.playspeed = this.lespeed ? this.lespeed : 100;
  },
  beforeMount: function() {
    //console.log("before mount");
  },
  mounted: function() {
    this.$EventBus.$on("changeKeyFunc", (keyitem) => {
      this.setKeyFunc(keyitem);
    });
    this.$EventBus.$on("initProfile", (pfguid) => {
      this.changeProfile(pfguid);
    });
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
    selCurrentKey(lcode){
      if(lcode > 0 && this.hasKeySet(lcode)){
        this.currentkey = (lcode == this.currentkey ? null : lcode);
      } else if(lcode == 0){
        this.fnmode = !this.fnmode;
        this.currentkey = null;
        this.initProfile(this.device.profile);
      }
    },
    setClassByLogicCode(lcode, cls, type){
      var obj = this.$el.querySelector('#key' + lcode);
      if(obj){
        if(type == "add"){
          if(!obj.classList.contains(cls)){
            obj.classList.add(cls);
          }
        }else if(type == "remove"){
          if(obj.classList.contains(cls)){
            obj.classList.remove(cls);
          }
        }
      }
    },
    hasKeySet(lcode){
      let haskey = false;
      this.device.profile[this.keysettype] && this.device.profile[this.keysettype].forEach(item => {
        if(item.Index == lcode){
          haskey = true;
        }
      })
      return haskey;
    },
    //profile
    changeProfile(guid) {
      // console.log(333,guid, this.curdevice);
      window.readProfile(this.curdevice.ModelID, guid, (data) => {
        this.$store.commit("setCurProfile", data);
        this.fnmode = false;
        this.currentkey = null;
        this.pfchanged = false;
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
      this.clearProfileStat(this.device.keymap);
      if(pfdetail.ModeIndex == 1){
        this.initStdProfile(pfdetail);
      }else{
        this.initKeyset(pfdetail);
      }
    },
    clearProfileStat(keymap){
      keymap.forEach((item) => {
        var obj = this.$el.querySelector('#key' + item.LogicCode);
        if(obj){
          this.clearKeyStat(obj)
          obj.innerText = "";
        }
      })
    },
    clearKeyStat(obj){
      let keyclasslist = obj.classList;
      let delclasslist = [];
      let exlist = ["device-key", "current", "fnsel"]
      keyclasslist.forEach(item => {
        if(exlist.indexOf(item) < 0){
          delclasslist.push(item);
        }
      });
      delclasslist.forEach(item => {
        obj.classList.remove(item);
      });
    },
    initStdProfile: function(pf){
      console.log(pf);
    },
    initKeyset: function(pfdetail){
      pfdetail[this.keysettype].forEach((item)=>{
        var obj = this.$el.querySelector('#key' + item.Index);
        if(obj){
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
    },
    setKeyFunc: function(keyconf){
      if(this.currentkey <= 0){
        this.$notify({
          title: "请先选择要设置的按键",
          type: "warning",
          position: "bottom-left"
        });
        return;
      }
      var obj = this.$el.querySelector('#key' + this.currentkey);
      if(obj){
        // obj.className = "device-key current";
        // obj.setAttribute("data-func", this.$t("keys")[keyconf.LangTitle]);
        // obj.setAttribute("data-le", '');
        let type = this.keysettype;
        for(let i=0;i<this.device.profile[type].length;i++){
          if(this.device.profile[type][i].Index == this.currentkey){
            this.device.profile[type][i].DriverValue = keyconf.DriverValue;
            this.device.profile[type][i].MenuName = keyconf.Name;
            obj.setAttribute("data-func", this.$t("keys")[keyconf.LangTitle]);
            obj.setAttribute("data-le", '');
            obj.classList.add("seted");
            obj.innerHTML = this.$t("keys")[keyconf.LangTitle];
            console.log(4, this.currentkey, type,this.device.profile[type][i].MenuName,this.device.profile[type][i].DriverValue)
          }
        }
        // this.initProfile(this.device.profile);
        // if(keyfunc[keyconf.DriverValue]){
        // console.log(1111, obj.classList,keyconf, keyfunc);
        //   if(keyfunc[keyconf.DriverValue].Icon){
        //     obj.classList.add(keyfunc[keyconf.DriverValue].Icon);
        //     obj.classList.add("bold");
        //   }else{
        //     obj.innerText = this.$t("keys")[keyconf.LangTitle];
        //   }
        // }
      }
      // var _this = this;
      // var keysets = [];
      // if(_this.isfnkeyset){
      //   keysets = DEVICE.currentProfile.FnKeySet;
      // }else{
      //   keysets = DEVICE.currentProfile.KeySet;
      // }
      // if(val == "disable_enable"){
      //   for(var i=0;i<keysets.length;i++){
      //     if(keysets[i].DriverValue.toString() == "0x02000000"){
      //       window.getDefaultKeySetByLcode(keysets[i].Index,function(defaultkey){
      //         console.log(defaultkey);
      //         var tempkey = $("key"+keysets[i].Index);
      //         if(tempkey){
      //           keysets[i].MenuName = '';
      //           keysets[i].DriverValue = defaultkey.DriverValue;
      //           tempkey.innerHTML = "<span></span>";
      //           tempkey.setAttribute("data-func", _this.$t('common.key_func_no_config'));
      //           tempkey.classList.remove("seted");
      //           if(keysets[i].KeyLE && keysets[i].KeyLE.GUID !== ''){
      //             tempkey.classList.add("seted");
      //           }
      //         }
      //       });
      //     }
      //   }
      //   if(window.isKeySetChange()){
      //     this.iskeysetchange = true;
      //   }else{
      //     this.iskeysetchange = false;
      //   }
      // }else if((val == "disable_all")
      //   ||(val == "disable_num")
      //   ||(val == "disable_fx")
      //   ||(val == "disable_pad")
      //   ||(val == "disable_letter")
      //   ||(val == "disable_symbol")
      //   ||(val == "disable_ctrls")
      //   ||(val == "disable_func9")
      //   ||(val == "disable_direction")
      //   ){
      //   var diskeys = window.KeyFunc[val].DriverValue.split(",");
      //   if(val == "disable_all"){
      //     diskeys = [];
      //     for(var i=0;i<keysets.length;i++){
      //       diskeys.push(keysets[i].Index.toString());
      //     }
      //   }
      //   console.log(diskeys);
      //   for(var i=0;i<keysets.length;i++){
      //     if(diskeys.indexOf(keysets[i].Index.toString()) >= 0){
      //       keysets[i].MenuName = window.KeyFunc["0x02000000"].Name;
      //       keysets[i].DriverValue = window.KeyFunc["0x02000000"].DriverValue;
      //       var tempkey = $("key"+keysets[i].Index);
      //       if(tempkey){
      //         tempkey.innerHTML = "<span class='hasfunc'></span>";
      //         tempkey.classList.add("seted");
      //         tempkey.children[0].classList.add(window.KeyFunc["0x02000000"].Icon);
      //         tempkey.children[0].classList.add(window.KeyFunc["0x02000000"].ShowClass);
      //         tempkey.setAttribute("data-func", _this.$t('keys')[window.KeyFunc["0x02000000"].LangTitle]);
      //       }
      //     }
      //   }
      //   if(window.isKeySetChange()){
      //     this.iskeysetchange = true;
      //   }else{
      //     this.iskeysetchange = false;
      //   }
      // }else if(DEVICE.editKeyCode){
      //   var selectkey = $("key"+DEVICE.editKeyCode);
      //   if(selectkey){
      //     if(window.KeyFunc[val]){
      //       selectkey.innerHTML = "<span class='hasfunc'>"+ _this.$t('keys')[window.KeyFunc[val].LangTitle] +"</span>";
      //       selectkey.setAttribute("data-func", _this.$t('keys')[window.KeyFunc[val].LangTitle]);
      //       if(window.KeyFunc[val].Icon){
      //         selectkey.children[0].classList.add(window.KeyFunc[val].Icon);
      //         selectkey.children[0].innerHTML = '';
      //       }
      //       if(window.KeyFunc[val].ShowClass){
      //         selectkey.children[0].classList.add(window.KeyFunc[val].ShowClass);
      //       }
      //     }else{
      //       if(name.length <= 5)
      //         selectkey.innerHTML = "<span class='hasfunc'>"+ name +"</span>";
      //       else
      //         selectkey.innerHTML = "<span class='hasfunc'>"+ name.substring(0,4) + '...' +"</span>";
      //       selectkey.setAttribute("data-func", name);
      //     }
      //     selectkey.classList.add("seted");
      //   }
      //   for(var i=0;i<keysets.length;i++){
      //     if(keysets[i].Index === DEVICE.editKeyCode){
      //       keysets[i].MenuName = name;
      //       keysets[i].DriverValue = val;
      //       if(name.indexOf(".exe")>0){
      //         keysets[i].DriverValue = "0x0A030001";
      //         keysets[i].Task = {};
      //         keysets[i].Task.Type = "OpenURL";
      //         keysets[i].Task.Data = {
      //           AppPath: val
      //         };
      //       }
      //       if(window.isKeySetChange()){
      //         this.iskeysetchange = true;
      //       }else{
      //         this.iskeysetchange = false;
      //       }
      //     }
      //   }
      // }else{
      //   _this.alertInfo(_this.$t('common.key_select_attention'), 'warning', 1000);
      // }
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
  display: flex;
  align-items: center;
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
  &.bold {
    font-weight: bold;
  }
}
.device-key > p {
  color: white;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>
