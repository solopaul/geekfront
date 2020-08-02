<template>
  <div>
    <cms-listbox listh="300px" v-if="true">
      <slot slot="title">
        <span class="el-icon-notebook-2"></span>
        宏
      </slot>
      <slot slot="btns">
        <span class="el-icon-download"></span>
        <span class="el-icon-upload2"></span>
        <span class="el-icon-menu"></span>
        <span class="el-icon-plus"></span>
      </slot>
      <slot slot="content">
        <div class="search-box">
          <el-input placeholder="请输入内容" v-model="search" suffix-icon="el-icon-search" class="input-with-select">
            <el-select v-model="selectMacroCate" @change="changeCate" slot="prepend" placeholder="请选择分类">
              <i slot="prefix" class="el-input__icon el-icon-filter"></i>
              <el-option v-for="(item,idx) in $store.state.macrolist" :key="item.Name" :label="item.Name" :value="idx"></el-option>
            </el-select>
          </el-input>
        </div>
        <div style="height:calc(100% - 32px - 68px);overflow-y:auto;">
          <ul class="sp-list">
            <li class="item" v-for="item in curList" :key="item.GUID">
              <img src="../assets/app/app.png"/>
              <span class="desc">
                {{item.Name}}
              </span>
              <span class="el-icon-check btn"></span>
            </li>
          </ul>
        </div>
        <div class="macrolist-oper">
          <el-radio v-model="curMacro.mode" label="1">执行<input v-model="curMacro.repeat" class="macro-play-time mini" style="width:50px"/>次后停止</el-radio><br>
          <el-radio v-model="curMacro.mode" label="2">松开停止</el-radio><br>
          <el-radio v-model="curMacro.mode" label="3">在次按下停止</el-radio>
        </div>
      </slot>
    </cms-listbox>
  </div>
</template>

<script>
import ListBox from './ListBox';
export default {
  name: "ProfileList",
  components: {
    'cms-listbox': ListBox
  },
  data() {
    return {
      search: "",
      selectMacroCate: 0,
      curList: [],
      curMacro: {
        guid: "",
        mode: "1",
        repeat: 1
      }
    };
  },
  props: {},
  mounted() {
    // this.curList = this.$store.state.macrolist[this.selectMacroCate].Data;
    setTimeout(()=>{this.changeCate(0);},500);
  },
  watch: {
    // "$store.state.macrolist" : (newv, oldv) => {
    //   console.log(666,newv,oldv,this.$store.state.macrolist);
    // }
  },
  methods: {
    changeCate(val){
      this.selectMacroCate = val;
      this.curList = this.$store.state.macrolist[this.selectMacroCate].Data;
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/.search-box{
  padding:2px 2px;
  .el-select .el-input {
    width: 120px;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color: #232323;
    color: #909399;
    border: 1px solid #353535;
  }
  .el-input__inner {
    border: 1px solid #353535;
    border-left: none;
  }
  .el-select-dropdown__list {
    max-height: 200px;
    overflow-y: auto;
  }
}
/deep/.macrolist-oper {
  padding: 0 10px;
  // background: rgba(50, 50, 50, 0.3);
  background: linear-gradient(45deg, #20232b, rgba(100, 100, 100, 0.3));
  .el-radio__inner {
    width: 1em;
    height: 1em;
  }
  .el-radio__label {
    font-size: 1em;
  }
  .macro-play-time {
    height: 1.2em;
    color: #efefef;
    background-color: #353535;
    text-align: center;
    font-size: 1em;
    border: 1px solid #252525;
    width: 5em;
  }
}
</style>
