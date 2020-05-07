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
        <ul class="sp-list">
          <li class="item" v-for="item in $store.state.lelist" :key="item.GUID">
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
export default {
  name: "LeList",
  components: {
    'cms-listbox': ListBox
  },
  data() {
    return {};
  },
  props: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>

</style>
