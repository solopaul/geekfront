<template>
    <div style="display:flex;justify-content: space-between;">
      <cms-versions></cms-versions>
      <div>
        <span>Geek</span>
        <el-divider direction="vertical"></el-divider>
        <span>Tech</span>
      </div>
      <div class="help">
        <span class="el-icon-share"></span>
        <el-divider direction="vertical"></el-divider>
        <span class="el-icon-message"></span>
        <el-divider direction="vertical"></el-divider>
        <span class="el-icon-shopping-cart-full"></span>
        <el-divider direction="vertical"></el-divider>
        <span class="el-icon-service"></span>
        <el-divider direction="vertical"></el-divider>
        <span class="el-icon-question"></span>
      </div>
    </div>
</template>

<script>
import VersionInfo from './VersionInfo';
export default {
  name: 'Footer',
  components: {
    'cms-versions': VersionInfo
  },
  data () {
    return {
      
    }
  },
  mounted(){
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.help {
  span {
    cursor: pointer;
    &:hover{
      color: #00c2ff;
    }
  }
}
</style>
