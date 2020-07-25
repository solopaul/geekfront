<template>
<div>
  <div class="search-box">
    <el-input :placeholder="search.placeholder" v-model="searchText" suffix-icon="el-icon-search" class="input-with-select" clearable>
      <el-select v-model="selCate" @change="onSelect" slot="prepend" :placeholder="cate.placeholder" clearable>
        <i slot="prefix" class="el-input__icon el-icon-filter"></i>
        <el-option v-for="(item,idx) in cate.list" :key="idx" :label="item[cate.title]" :value="item[cate.key]" style="max-width: 200px;"></el-option>
      </el-select>
    </el-input>
  </div>
</div>
</template>

<script>
export default {
  name: "Search",
  components: {
  },
  data() {
    return {
      searchText: "",
      selCate: "",
    };
  },
  props: {
    cate: {
      type: Object,
      default: function () {
        return {
          list: [],
          title: "key",
          key: "value",
          selected: "",
          placeholder: "请选择"
        }
      }
    },
    search: {
      type: Object,
      default: function () {
        return {
          placeholder: "请输入",
          text: ""
        }
      }
    }
  },
  mounted() {
    this.searchText = this.search.text;
    this.selCate = this.cate.selected;
  },
  methods: {
    onSelect(val){
      this.selCate = val;
    },
    onFilterChange(){
      this.$emit("filterChange", this.filter);
    }
  },
  computed:{
    lecate(){
      return this.$store.state.devicelist;
    },
    filter(){
      return { search: this.searchText, cate: this.selCate };
    }
  },
  watch: {
    "filter" : function(nval, oval){
      if(JSON.stringify(nval) != JSON.stringify(oval)){
        this.onFilterChange();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.search-box{
  padding:2px 2px;
  background: #111;
  .el-select .el-input {
    width: 130px;
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
