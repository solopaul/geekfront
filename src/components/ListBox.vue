<template>
  <div>
    <section class="custom" :style="{height: listh}">
      <div class="title">
        <div class="text">
          <slot name="title"></slot>
        </div>
        <div class="btns">
          <slot name="btns">
          </slot>
        </div>
      </div>
      <div class="content" :style="{height: 'calc(' + listh + ' - 39px)'}">
        <slot name="content">
        </slot>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "ListBox",
  data() {
    return {};
  },
  props: {
    listh: {
      type: String,
      required: false,
      default: "200px"
    }
  },
  components: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
$border_radius: 2px;
section.custom {
  margin-bottom: 10px;
  padding: 0;
  border-radius: $border_radius;
  box-shadow: 0 0 10px #000;
  overflow: hidden;
  &:hover {
    box-shadow: 0 0 20px #000;
  }
  .title {
    color: #ccc;
    background: linear-gradient(45deg, #20232b, rgba(100,100,100,.3));
    display: flex;
    justify-content: space-between;
    font-size: .8em;
    height: 38px;
    line-height: 38px;
    padding: 0 10px;
    border-bottom: 1px solid #666;
    .btns {
      color: #00c2ff;
      font-size: 1.2em;
      font-weight: bold;
      span {
        margin-left: 10px;
        cursor: pointer;
        &:hover {
          text-shadow: 0 0 15px #00c2ff;
        }
      }
    }
  }
  .content {
    background-color: rgba(32,35,43,.8);
    overflow-y: auto;
  }
}
</style>
