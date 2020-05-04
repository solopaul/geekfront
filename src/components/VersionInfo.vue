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
            <span class="el-icon-download">下载</span>
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
          version: "1.0.0",
          publish_date: "2020-05-01",
          desc: "修复了一些已知的bug"
        },
        {
          version: "1.0.1",
          publish_date: "2020-05-02",
          desc: "修复了一些已知的bug,添加了一些新机型，优化了显示问题"
        },
        {
          version: "1.0.2",
          publish_date: "2020-05-03",
          desc: "修复了一些已知的bug"
        },
        {
          version: "1.0.3",
          publish_date: "2020-05-04",
          desc: "修复了一些已知的bug"
        },
        {
          version: "1.0.4",
          publish_date: "2020-05-05",
          desc: "修复了一些已知的bug"
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
  methods: {},
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
