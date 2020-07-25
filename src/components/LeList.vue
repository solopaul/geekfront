<template>
  <div>
    <cms-listbox :listh="($store.state.window.height - 100 - 300 - 30) + 'px'" v-if="true">
      <slot slot="title">
        <span class="el-icon-sunrise-1"></span>
        灯光
      </slot>
      <slot slot="btns">
        <span class="el-icon-download"></span>
        <span class="el-icon-upload2"></span>
        <span class="el-icon-menu"></span>
        <span class="el-icon-plus"></span>
      </slot>
      <slot slot="content">
        <cms-lectrl @onChange="onChangeLeCtrl"></cms-lectrl>
        <cms-search :cate="filterCate" :search="filterSearch" v-on:filterChange="filterChange"></cms-search>
        <ul class="sp-list" :style="{height: 'calc(100% - 32px - ' + leCtrlHeight + 'px)', 'overflow-y':'auto'}">
          <li class="item" :class="{'active': $store.state.device.curplayle == item.GUID }" v-for="item in $store.state.lelist" :key="item.GUID" @click="onSelectLe(item.GUID)">
            <img src="../assets/app/app.png"/>
            <span class="desc">
              {{item.Name}}
            </span>
            <span class="el-icon-check btn"></span>
          </li>
        </ul>
      </slot>
    </cms-listbox>
  </div>
</template>

<script>
import ListBox from './ListBox';
//import ColorPicker from './ColorPicker';
import Search from './common/Search';
import LeCtrl from './LeCtrl';
export default {
  name: "LeList",
  components: {
    'cms-listbox': ListBox,
    'cms-search': Search,
    'cms-lectrl': LeCtrl
  },
  data() {
    return {
      filterSearch: {placeholder:'请输入名称', text: ''},
      leCtrlHeight: 0
    };
  },
  props: {},
  mounted() {
    this.leCtrlChange();
  },
  methods: {
    onSelectLe(val){
      this.$emit("onSelect", val);
    },
    filterChange(filter){
      console.log("dddddd:",filter);
    },
    onChangeLeCtrl(val){
      this.$emit("onSelect", val);
    },
    leCtrlChange(){
      this.leCtrlHeight = this.$el.querySelector(".lectrl").offsetHeight;
    }
  },
  computed:{
    filterCate(){
      return {
        list: this.$store.state.devicelist,
        title: "Name",
        key: "ModelID",
        selected: this.$store.state.curdevice.ModelID,
        placeholder: "请选择分类",
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
