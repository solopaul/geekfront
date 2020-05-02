<template>
  <el-container v-loading="loading" :style="{'background-color': 'rgba(32,35,43,.7)'}">
    <cms-header @mousedown.native="dragWin"></cms-header>
    <el-main>
      <cms-profilelist></cms-profilelist>
      <section class="content">
        <!-- <el-tabs type="border-card">
          <el-tab-pane label="用户管理">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs> -->
        <cms-keyset></cms-keyset>
      </section>
    </el-main>
    <el-footer ref="footer" @mousedown.native="dragWin" style="height: 40px;">
      <cms-footer></cms-footer>
    </el-footer>
  </el-container>
</template>

<script>
import Header from './Header';
import Footer from './Footer';
import ProfileList from './ProfileList';
import KeySet from './KeySet';
export default {
  name: 'HelloWorld',
  data () {
    return {
      drawer: false,
      loading: false
    }
  },
  components: {
    'cms-header': Header,
    'cms-footer': Footer,
    'cms-profilelist': ProfileList,
    'cms-keyset': KeySet
  },
  mounted(){
    // document.onmousedown =function (ev) {
    //   if(ev.target == document.querySelector(".el-header") || ev.target == document.querySelector(".el-footer")){
    //     setTimeout(()=>{window.startDrag();},0);
    //   }
    // }
    // window.initEnvConfig().then(res => {
    //   this.$store.commit('setEnvConf',res);
    //   window.initEnvConfig2().then(res => {
    //     this.$store.commit('setDeviceList',res);
    //   })
    // }).then()
    Promise.all([window.initEnvConfig(),window.initAppConfig(),window.initDeviceList()]).then((res) => {
      console.log(res, 'promise all 方法');
      this.$store.commit('initEnvConf',res[0]);
      this.$store.commit('initAppConf',res[1]);
      this.$store.commit('initDeviceList',res[2]);
      this.loading = false;
    }).catch(
        (err) => {
            console.log(err)
        }
    );
  },
  methods: {
    dragWin(){
      setTimeout(()=>{window.startDrag();},0);
    }
  }
}
</script>

<style scoped>
.el-main {
  padding: 0;
  position: relative;
}
  /* section.content{
    width: 800px; 
    height: 300px;
    box-shadow: 0 0 10px 10px rgba(31, 31, 31, 0.5);
    border: 6px solid #424242;
    border-radius: 4px;
  } */
section.content {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;

}
</style>
