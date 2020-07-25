<template>
<div id="colorpbox" ref="colorpbox" class="color-picker">
  <div class="color-select" @mouseup="stopDrag">
    <div class="color-current" @mousedown="setColorBoxPos($event)" @mousemove="moveColorBoxPos($event)">
      <div class="color-white"></div>
      <div class="color-black"></div>
      <div class="color-dot" :style="{'top': colorboxpostop + 'px','right': colorboxposright + 'px'}"></div>
    </div>
    <div class="color-bar" @mousedown="setHuePos($event)" @mousemove="moveHuePos($event)">
      <div class="color-bar-pos" :style="{'top': huepostop + 'px'}"></div>
      <hr style="color:red;weight:3">
      <hr>
    </div>
  </div>
  <div class="color-preset">
    <ul class="color-sets">
      <li v-for="color in precolors" :key="color" :style="{'backgroundColor': color}" @click="setCurrentColor(color)" :class="{selected: colorhex == color}"></li>
    </ul>
    <div class="color-val">
      <input type="" v-model="colorhex" :style="{'backgroundColor': colorhex}">
      <i class="el-icon-back" style="color: green;"></i>
      <div class="color-state-btn" :class="{'active':issellcode}" @click="triggerSelLeCode">
        <i class="el-icon-kb-select"></i>
      </div>
    </div>
  </div>
</div>
</template>

<style>
.colorpicker{
  height: 32px;
  line-height: 32px;
}
.predefine{
  height: 32px;
  line-height: 32px;
  display:inline-block;
}
.predefine ul li{
  float:left;
  width:24px;
  height:24px;
  background:blue;
  list-style:none;
  margin-left:.8rem;
  display:inline-block;
}
.color-picker{
  position: absolute;
  z-index: 10;
  padding: 6px;
  box-sizing: content-box;
  background-color: #3A3939;
  /*border: 1px solid #ebeef5;*/
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  display: flex;
  width: 100%;
  box-sizing: border-box;
}
.color-select{
  flex:3;
}
.color-preset{
  flex:2;
  position: relative;
}
.color-current{
  width: 80%;
  padding-top: 80%;
  float: left;
  background: red;
  position: relative;
}
.color-white,.color-black{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.color-white{
  background: linear-gradient(to right,#fff,rgba(255,255,255,0));
}
.color-black{
  background: linear-gradient(to top,#000,rgba(255,255,255,0));
}
.color-dot{
  position: absolute;
  right: 0px;
  top: 0px;
  width: 4px;
  height: 4px;
  /*box-shadow: 0 0 0 1.5px #fff,inset 0 0 1px 1px rgba(0,0,0,.3),0 0 1px 2px rgba(0,0,0,.4);*/
  border: 1px solid #fff;
  /*transform: translate(-2px,-2px);*/
  margin: -3px;
  border-radius:2px;
  cursor: crosshair;
}
.color-bar{
  float: right;
  position: relative;
  width:14%;
  margin-right: 3%;
  padding-top: 80%;
  background: linear-gradient(to bottom,#f00 0,#ff0 16.7%,#0f0 33.4%,#0ff 50.1%,#00f 66.8%,#f0f 83.4%,#f00 100%);
  /*cursor: row-resize;*/
}
.color-bar-pos{
  position: absolute;
  cursor: pointer;
  box-sizing: border-box;
  left: 0;
  top: 100px;
  width: 100%;
  height: 4px;
  border-radius: 1px;
  background: #fff;
  border: 1px solid #f0f0f0;
  box-shadow: 0 0 2px rgba(0,0,0,.6);
  z-index: 1;
  margin-top: -2px;
  margin-bottom: -2px;
}
.color-sets{
  display: flex;
  width: 100%;
  margin-block-start: 0em;
  margin-block-end: 0em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  -webkit-margin-before: 0em;
  -webkit-margin-after: 0em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  -webkit-padding-start: 0px;
  box-sizing: content-box;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
}
.color-sets li{
  margin: 0 0 2% 0;
  padding: 0;
  float: left;
  width: 15%;
  min-width: 15%;
  max-width: 15%;
  padding-bottom: 15%;
  border:1px solid #ccc;
  background: #00c2ff;
  list-style: none;
  display: inline-block;
  flex:1;
  border-radius: 10%;
  box-sizing: border-box;
  cursor: pointer;
}
.color-sets li.selected{
  box-shadow: rgb(64, 158, 255) 0px 0px 3px 2px;
}
.color-val{
  clear: both;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 1.8rem;
  line-height: 1.8rem;
  display:flex;
  align-items: center;
  text-align: center;
}
.color-val input{
  flex: 5;
  height: 1.8rem;
  line-height: 1.8rem;
  border:none;
  text-align: center;
  box-sizing: border-box;
}
.color-val i{
  flex:2;
}
.color-state-btn{
  flex:3;
  height:1.8rem;
  line-height:1.8rem;
  border-radius: .2rem;
  background-color: #333;
  border:1px solid #000000;
  display:inline-block;
  color:#f00;
  cursor:pointer;
}
.color-state-btn i{
  height: 1.8rem;
  line-height: 1.8rem;
  font-size:1.2rem;
}
.color-state-btn.active{
  border-color: #00c2ff;
}
.color-state-btn.active i{
  font-size:1.3rem;
  font-weight:bold;
  color:#00ff00;
}
</style>

<script>
  export default {
    data () {
      return {
        isstatic: true,
        loading: true,
        disabled: false,
        color: "red",
        precolors: [
          '#ff0000',
          '#ffff00',
          '#00ff00',
          '#00ffff',
          '#0000ff',
          '#ff00ff',
          '#cc0019',
          '#ff2a00',
          '#ff7200',
          '#ffc000',
          '#f9ff00',
          '#8aff00',
          '#00ff4e',
          '#aa00ff',
          '#00a59b',
          '#14ae67',
          '#28a7e1',
          '#0d6fb8',
          '#122a88',
          '#171c61',
          '#601986',
          '#920783',
          '#a40a5e',
          '#800080',
          '#ff4500',
          '#00ced1',
          '#00c2ff',
          '#ff00aa',
          '#ffffff',
          '#000000'
        ],
        colorhex: "#FF0000",
        hueh: 130,
        huepostop: 0,
        colorboxposright: 0,
        colorboxpostop: 0,
        colorbarmousedown: false,
        colorboxmousedown: false,
        issellcode: false,
      }
    },
    props: [],
    created: function(){

    },
    mounted: function(){
      this.initColorPicker();
    },
    computed:{
    },
    watch: {
      colorhex: function(newv,oldv){
        if(newv != oldv){
        //   if(!DEVICE.isEditStaticLE)
        //     this.triggerSelLeCode();
        }
      }
    },
    methods: {
      initColorPicker(){
        this.hueh = this.$refs.colorpbox.querySelector(".color-bar").offsetHeight;
        this.huepostop = 0;
        this.colorboxposright = 0;
        this.colorboxpostop = 0;
      },
      getElementPageLeft(element){
        var actualLeft=element.offsetLeft;
        var parent=element.offsetParent;
        while(parent!=null){
            actualLeft+=parent.offsetLeft+(parent.offsetWidth-parent.clientWidth)/2;
            parent=parent.offsetParent;
        }
        return actualLeft;
      },
      getElementPageTop(element){
          var actualTop=element.offsetTop;
          var parent=element.offsetParent;
          while(parent!=null){
              actualTop+=parent.offsetTop+(parent.offsetHeight-parent.clientHeight)/2;
              parent=parent.offsetParent;
          }
          return actualTop;
      },
      setHuePos(ev){
        var _this = this;
        _this.colorbarmousedown = true;
        _this.moveHuePos(ev);
      },
      moveHuePos(ev){
        var _this = this;
        if(!_this.colorbarmousedown) return;
        var colorobj = ev.currentTarget.parentNode.parentNode;
        var colorbox = colorobj.querySelector(".color-current");
        var colorinput = colorobj.querySelector("input");
        var cbartop = _this.getElementPageTop(colorobj);
        if((ev.clientY - (cbartop + 6)) <= 0){
          _this.huepostop = 0;
        }else if((ev.clientY - (cbartop + 6)) >= _this.hueh){
          _this.huepostop = _this.hueh;
        }else{
          _this.huepostop = ev.clientY - (cbartop + 6);
        }
        var h = parseInt(360*(this.huepostop/_this.hueh));
        colorbox.style.background = 'hsl('+h+',100%,50%)';
        _this.resetColor();
      },
      setColorBoxPos(ev){
        var _this = this;
        _this.colorboxmousedown = true;
        _this.moveColorBoxPos(ev);
      },
      moveColorBoxPos(ev){
        var _this = this;
        if(!_this.colorboxmousedown) return;
        var colorobj = ev.currentTarget.parentNode.parentNode;
        var colorbox = colorobj.querySelector(".color-current");
        var colorinput = colorobj.querySelector("input");
        var colorboxtop = _this.getElementPageTop(colorobj);
        var colorboxleft = _this.getElementPageLeft(colorobj);
        if((ev.clientY - (colorboxtop + 6)) <= 0){
          _this.colorboxpostop = 0;
        }else if((ev.clientY - (colorboxtop + 6)) >= _this.hueh){
          _this.colorboxpostop = _this.hueh;
        }else{
          _this.colorboxpostop = ev.clientY - (colorboxtop + 6);
        }
        if((ev.clientX - (colorboxleft + 6)) <= 0){
          _this.colorboxposright = _this.hueh;
        }else if((ev.clientX - (colorboxleft + 6)) >= _this.hueh){
          _this.colorboxposright = 0;
        }else{
          _this.colorboxposright = _this.hueh - (ev.clientX - (colorboxleft + 6));
        }
        _this.resetColor();
      },
      stopDrag(){
        this.colorboxmousedown=false;
        this.colorbarmousedown=false;
      },
      resetColor: function(){
        var _this = this;
        var h = parseInt(360*(this.huepostop/_this.hueh));
        var s = 100*(1-this.colorboxposright/_this.hueh);
        var b = 100*(1-this.colorboxpostop/_this.hueh);
        var color = window.fromRGB(window.fromHSB({h:h,s:s,b:b}));
        _this.colorhex = color;
        //DEVICE.editStaticLEColor = color;
      },
      setCurrentColor: function(color){
        this.colorhex = color;
        //DEVICE.editStaticLEColor = color;
      },
      triggerSelLeCode: function(){
        this.issellcode = !this.issellcode;
        //DEVICE.isEditStaticLE = this.issellcode;
      },
      alertInfo: function(alerttitle, alerttype, tout){
        this.$notify({
          title: alerttitle,
          type: alerttype,
          duration: tout,
          position: 'bottom'
        })
      }
    }
  }
</script>