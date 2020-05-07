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
              <el-option v-for="(item,idx) in $store.state.macrolist" :key="item.Name" :label="item.Name" :value="idx"></el-option>
            </el-select>
          </el-input>
        </div>
        <div style="height:calc(100% - 32px);overflow-y:auto;">
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
      selectMacroCate: null,
      curList: []
    };
  },
  props: {},
  mounted() {
    //this.curList = this.$store.state.macrolist[this.selectMacroCate].Data;
  },
  watch: {
    // "$store.state.macrolist" : (newv, oldv) => {
    //   console.log(666,newv,oldv,this.$store.state.macrolist);
    // }

  },
  methods: {
    changeCate(val){
      console.log(val);
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
</style>
