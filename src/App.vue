<template>
  <div id="app" :style="{'background-image': 'url(' + require('./assets/skin/bg29.jpg') + ')', 'background-size': 'cover'}">
    <cms-main></cms-main>
  </div>
</template>

<script>
import CmsMain from './components/Main.vue'

export default {
  name: 'App',
  components: {
    CmsMain
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
