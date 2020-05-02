<template>
    <el-header ref="header" style="display:flex;justify-content: space-between;padding-right:0;cursor:move">
      <div style="display:flex;">
        <img src="../assets/img/logo.png" alt="" style="height:56px;display:inline-block;">
        <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="rgba(32,34,43,.2)"
        text-color="#fff"
        active-text-color="#00c2ff">
          <el-menu-item index="1"><span class="el-icon-cpu"></span>功能配置</el-menu-item>
          <el-menu-item index="2"><span class="el-icon-sunrise-1"></span>灯效</el-menu-item>
          <el-menu-item index="3"><span class="el-icon-edit-outline"></span>宏</el-menu-item>
          <el-menu-item index="4" disabled><span class="el-icon-s-comment"></span>敬请期待</el-menu-item>
        </el-menu>
      </div>
      <div style="display:flex;width:400px;">
        <div class="switch-box">
            <el-carousel arrow="always" type="card" :autoplay="false" indicator-position="none" height="60px">
                <el-carousel-item v-for="item in 10" :key="item">
                    <img src="../assets/img/device.png" alt="">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="setting-box">
          <div>
            <span @click="drawer = true" class="el-icon-s-tools"></span>
          </div>
          <div>
            <span @click="miniWin" class="el-icon-minus"></span>
          </div>
          <div>
            <span @click="closeWin" class="el-icon-close"></span>
          </div>
        </div>
      </div>
      <el-drawer
        title=""
        :visible.sync="drawer"
        :modal="false"
        direction="rtl"
        size="400px">
        
      </el-drawer>
    </el-header>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      drawer: false
    }
  },
  mounted(){
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    miniWin() {
      window.minimizeCMSUI();
    },
    closeWin() {
      window.closeCMSUI();
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .switch-box {
  width: 298px;
  .el-carousel__arrow {
    width: 24px;
    border-radius: 8%;
    background-color: rgba(15, 68, 128, 0.2);
    color: #e4e4e4;
  }
  .el-carousel__arrow:hover {
    background-color: rgba(7, 98, 202, 0.61);
  }
  .el-carousel__mask {
    background-color: rgba(255,255,255,0);
  }
}
.setting-box {
  font-size: 18px;
  width: 102px;
  display: flex;
  div{
    flex:1;
    border: none;
    box-sizing: border-box;
    align-items: center;
    &:nth-child(3) span:hover{
      color: white;
      background-color: rgba(244, 84, 84, 0.8);
      font-weight: bold;
    }
    span{
      border: none;
      cursor: pointer;
      padding: 6px 8px;
      margin: 0;
      display: inline-block;
      &:hover{
        color: #00c2ff;
        background-color: rgba(255,255,255,.1);
      }
    }
  }
}
</style>
