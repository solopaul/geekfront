<template>
  <div>
    <span>version: {{versions[0].version}} </span>
    <el-popover
      placement="bottom"
      title="历史版本信息"
      width="400"
      trigger="click">
      <el-timeline :reverse="false" class="version-info">
        <el-timeline-item
          v-for="(version, index) in versions"
          :key="index"
          :type="version.type"
          :timestamp="version.publish_date"
        >
          <div :class="{ current: version.type == 'success'}">
            <span>{{ version.version }}</span>
            <el-divider direction="vertical"></el-divider>
            <span class="el-icon-download" @click="openDownload" style="cursor:pointer;">下载</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{ version.desc }}</span>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-link slot="reference" type="primary" :underline="false"><i class="el-icon-tickets"></i></el-link>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "VersionInfo",
  data() {
    return {
      versions: [
        {
          version: "7.0.0",
          publish_date: "2020-08-01",
          desc: "全新改版"
        }
      ],
    };
  },
  created() {
    this.versions.map((item, index) => {
      if (index == 0) {
        item.type = "success";
      } else {
        item.type = "info";
      }
    });
  },
  methods: {
    openDownload(){
      window.openURL("http://jikedingzhi.com/downloadlist?driverID=41");
    }
  }
};
</script>

<style lang="scss" scoped>
.el-link {
  font-size: 18px;
}
.version-info {
  padding-top: 5px;
  padding-left: 10px;
  font-size: 12px;
  color: #111;
  max-height: 200px;
  overflow-y: scroll;
  /deep/ .el-timeline-item {
    padding-bottom: 10px;
    .el-timeline-item__tail {
      border-color: #888;
    }
    .el-timeline-item__wrapper {
      .el-timeline-item__content {
        color: #aaa;
      }
      padding-left: 20px;
    }
  }
  .current {
    color: #00c2ff;
  }
}
</style>
