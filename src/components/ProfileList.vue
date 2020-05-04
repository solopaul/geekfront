<template>
  <div>
    <cms-listbox :listh="($store.state.window.height - 100 - 304 - 40) / 2 + 'px'" v-if="true">
      <slot slot="title">
        <span class="el-icon-notebook-2"></span>
        配置文件
      </slot>
      <slot slot="btns">
        <span class="el-icon-download"></span>
        <span class="el-icon-upload2"></span>
        <span class="el-icon-menu"></span>
        <span class="el-icon-plus"></span>
      </slot>
      <slot slot="content">
        
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
    return {};
  },
  props: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>

</style>
