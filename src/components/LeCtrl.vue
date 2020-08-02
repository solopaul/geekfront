<template>
  <ul class="sp-list lectrl" :style="{height: 'auto', 'overflow-y':'auto'}">
    <li class="item" v-for="(item,idx) in list" :key="idx" :class="{'selected': idx == current }" @click="ChangeSel(idx)">
      <span class="ol">{{idx+1}}</span>
      <span class="desc">
        {{item.Name ? item.Name : "未设置"}}
      </span>
      <span class="el-icon-delete btn" @click="setCurrent(idx, '', '')"></span>
    </li>
  </ul>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "LeCtrl",
  components: {
  },
  data() {
    return {
      list: [],
      current: 0
    };
  },
  props: {
  },
  mounted() {
    this.$EventBus.$on("profileChange", () => {
      this.list = this.device.profile.ModeIndex == 1 ? this.device.profile.DriverLE : [this.device.profile.ModeLE];
      this.ChangeSel(0);
    });
    this.$EventBus.$on("setLe", (le) => {
      this.setCurrent(this.current, le.Name, le.GUID);
    });
  },
  methods: {
    ChangeSel(val){
      this.current = val;
      this.$emit("onChange", this.list[this.current].GUID);
    },
    setCurrent(idx, name, guid){
      // console.log(this.current)
      // this.list.forEach((item,idx) => {
      //   if(idx == this.current){
      //     this.list[idx].Name = name;
      //     this.list[idx].GUID = guid;
      //   }
      // });
      this.list[idx].Name = name;
      this.list[idx].GUID = guid;
    }
  },
  computed:{
    ...mapState(["device"])
  },
  watch:{
  }
};
</script>

<style lang="scss" scoped>
.lectrl.sel {
  transition: height 1.5s ease-in-out;
}
.sp-list li.item.selected {
  background-image: linear-gradient(20deg, rgba(0,194,255,0.4), rgba(0,255,0,0.4), rgba(0, 78, 255, 0.43))
  // box-shadow: aqua 0 0 5px;
}
</style>
