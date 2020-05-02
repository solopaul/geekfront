<template>
  <div>
    <section class="custom">
      <div class="title">
        <div class="text">
          <span class="el-icon-notebook-2"></span>
          配置文件
        </div>
        <div class="btns">
          <span class="el-icon-download"></span>
          <span class="el-icon-upload2"></span>
          <span class="el-icon-menu"></span>
          <span class="el-icon-plus"></span>
        </div>
      </div>
      <div class="content">
        <p style="color:red;">
          在现货市场和期货市场对同一种类的商品同时进行数量相等但方向相反的买卖活动，即在买进或卖出实货的同时，在期货市场上卖出或买进同等数量的期货，经过一段时间，当价格变动使现货买卖上出现的盈亏时，可由期货交易上的亏盈得到抵消或弥补。从而在"现"与"期"之间、近和远之间建立一种对冲机制，以使价格风险降低到最低限度。
          理论基础
          现货和期货市场的走势趋同（在正常市场条件下）,由于这两个市场受同一供求关系的影响，所以二者价格同涨同跌；但是由于在这两个市场上操作相反，所以盈亏相反，期货市场的盈利可以弥补现货市场的亏损。
          {{ JSON.stringify($store.state) }}
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "ProfileList",
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
$border_radius: 2px;
section.custom {
  height: calc(100% -20px);
  width: 280px;
  margin: 10px;
  padding: 0;
  border-radius: $border_radius;
  box-shadow: 0 0 5px #121212;
  .title {
    color: #ccc;
    background: linear-gradient(45deg, #20232b, rgba(100,100,100,.3));
    display: flex;
    justify-content: space-between;
    font-size: .8em;
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    border-bottom: 1px solid #121212;
    border-top-left-radius: $border_radius;
    border-top-right-radius: $border_radius;
    .btns {
      color: #00c2ff;
      font-size: 1em;
      font-weight: bold;
      span {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
  .content {
    max-height: 400px;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 10px;
    background-color: rgba(32,35,43,.5);
  }
}
</style>
