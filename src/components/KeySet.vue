<template>
  <el-row>
    <div class="disablediv" :class="{ disablehide: !disabled }"></div>
    <el-col :span="24">
      <el-row>
        <el-col :span="24" style="text-align:left;">
          <el-tabs type="border-card" class="keyset-tab" loading="true">
            <el-tab-pane
              v-for="itempanel in keyset"
              :key="itempanel.index"
              :lazy="islazy"
              style="height:200px;"
            >
              <span slot="label" class="tab-icon">
                <i :class="itempanel.icon"></i> {{ itempanel.title }}
              </span>
              <div class="keyset-row" v-for="itemline in itempanel.keys" :key="itemline.index">
                <el-button
                  v-for="itemkey in itemline.linekeys"
                  :key="itemkey.index"
                  class="key-btn"
                  :class="itemkey.Class"
                  :icon="itemkey.Icon"
                  @click="handleSetKeyFunc(itemkey)"
                >
                  <template v-if="!itemkey.Icon">
                    <template
                      v-if="system != '' && itemkey['LangTitle' + system]"
                    >
                      {{ itemkey["LangTitle" + system] }}
                    </template>
                    <template v-else>
                      {{ itemkey.Name }}
                    </template>
                  </template>
                </el-button>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane>
          <span slot="label" class="tab-icon">
            <i class="el-icon-tickets"></i> {{ $t('common.user_manual') }}
          </span>
          <el-tabs tab-position="left" style="height: 200px;">
            <el-tab-pane v-for="itemum in cms.deviceConfig.UserManual" :key="itemum.index" :label="$t('common')[itemum.title_lang]">
              <div v-for="item in itemum.items" :key="item.index" style="padding:.4rem;color:#888;">
                <el-tag size="small" type="primary" style="width:8rem;text-align:center;">{{ item.key }}</el-tag>
                <i class="el-icon-back"></i>
                {{ $t('common')[item.desc_lang] }}
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane> -->
          </el-tabs>
        </el-col>
      </el-row>
      <el-row>
        <div class="keyset-foot">
          <el-form :inline="true" size="mini">
            <el-form-item label="">
              <el-radio-group v-model="system">
                <el-radio-button label="">
                  <i class="el-icon-kb-windows"></i>
                </el-radio-button>
                <el-radio-button label="Mac">
                  <i class="el-icon-kb-mac"></i>
                </el-radio-button>
                <!-- <el-radio-button label="Linux">
                  <i class="el-icon-kb-linux"></i>
                </el-radio-button> -->
              </el-radio-group>
            </el-form-item>
            <el-form-item label="功能">
              <el-select
                v-model="combval"
                placeholder="选择"
                @change="combChange"
                style="width:10rem"
              >
                <el-option
                  v-for="item in combkeys.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span class="el-icon-plus" style="padding: 0 5px;color: #BABABA;"></span>
              <el-input
                v-model="curkeytext"
                placeholder="选择"
                disabled
                style="width:5rem;color:#888;"
              ></el-input
              >
              <el-button icon="el-icon-check" @click="setCombFunc" style="margin-left:10px;"
                >使用</el-button
              >
            </el-form-item>
            <el-form-item v-if="isdrivermode" label="快捷方式">
              <el-input
                v-model="shortcutpathshow"
                placeholder="选择"
                readonly
                style="width:10rem"
              >
                <el-button
                  slot="append"
                  icon="el-icon-menu"
                  @click="openFileDlg"
                ></el-button> </el-input
              >&nbsp;
              <el-button icon="el-icon-check" @click="setShortcutFunc"
                >选择</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import keysetdata from "../assets/config/keyset.js";
import combinekeydata from "../assets/config/combkeys.js";
export default {
  data() {
    return {
      keyset: keysetdata,
      cms: window.CMS,
      scale: 0.8,
      system: "",
      sizeForm: "",
      combkeys: combinekeydata,
      curkeytext: "A",
      curkeyval: "0x02000400",
      combval: JSON.parse(JSON.stringify(combinekeydata.options[0].value)),
      combtext: JSON.parse(JSON.stringify(combinekeydata.options[0].label)),
      shortcutpath: "",
      shortcutpathshow: "",
      isdrivermode: false,
      ischange: false,
      isapply: false,
      disabled: false,
      islazy: true,
    };
  },
  mounted() {
    var _this = this;
    const ops = localStorage.system || "";
    _this.system = ops;
  },
  watch: {
    system: function(newv, oldv) {
      if (newv != oldv) {
        localStorage.system = newv.toString();
      }
    },
  },
  computed: {},
  methods: {
    handleSetKeyFunc: function(keyitem) {
      if (keyitem.IsCombFunc) {
        this.curkeytext = keyitem.Name;
        this.curkeyval = keyitem.DriverValue;
      }
      this.$emit("changeKeyFunc", keyitem.Name, keyitem.DriverValue);
    },
    combChange: function(val) {
      var obj = {};
      obj = this.combkeys.options.find((item) => {
        return item.value === val;
      });
      this.combval = val;
      this.combtext = obj.label;
    },
    alertInfo: function(alerttitle, alerttype, tout) {
      this.$notify({
        title: alerttitle,
        type: alerttype,
        duration: tout,
        position: "bottom-left",
      });
    },
    setCombFunc() {
      var combfunctext = this.combtext + "+" + this.curkeytext;
      var combfuncval =
        "0x0" +
        (
          parseInt(this.combval) +
          parseInt(this.curkeyval) -
          parseInt(0x02000000)
        ).toString(16);
      console.log(combfunctext, combfuncval);
      this.$emit("changeKeyFunc", combfunctext, combfuncval);
    },
    openFileDlg() {
      var _this = this;
      window.openFileDialog(function(data) {
        var pos = data.lastIndexOf("/");
        _this.shortcutpath = data;
        _this.shortcutpathshow = data.substring(pos + 1);
        console.log(data);
      });
    },
    setShortcutFunc() {
      this.$emit("changeKeyFunc", this.shortcutpathshow, this.shortcutpath);
    },
    showTestInfo() {
      var _this = this;
      _this.alertInfo("sdsfsdfsdf", "warning", 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-tabs--border-card {
  background: rgba(32, 34, 43, 0.8);
  border: none;
  .el-tabs__header {
    background: linear-gradient(45deg, #20232b, rgba(100, 100, 100, 0.3));
  }
  .el-tabs__content {
    padding: 10px;
  }
}
.tab-icon i {
  font-size: 1rem;
}
.keyset-foot {
  text-align: left;
  background: rgba(32, 34, 43, 0.8);
  padding: 0 18px 10px;
}
.keyset-foot .el-form-item {
  margin-bottom: 0.2vw;
}
.el-tabs__content {
  padding: 1.5vw;
  height: 17vw;
}
.el-tabs--border-card .el-tabs__content {
  padding: 1vw;
}
/deep/.key-btn.el-button--danger {
  color: #fff;
  border-color: #f00;
  i {
    font-size: 1em ;
  }
}
/deep/.el-radio-button--mini .el-radio-button__inner {
  padding-top: 5px;
}
.key-btn {
  width: 3.5vw;
  padding: 0.6vw 0vw;
}
.key-btn.l125 {
  width: 4.375vw;
}
.key-btn.l150 {
  width: 5.5vw;
}
.key-btn.l175 {
  width: 6.625vw;
}
.key-btn.l200 {
  width: 7.5vw;
}
.key-btn.l225 {
  width: 8.375vw;
}
.key-btn.l250 {
  width: 10vw;
}
.key-btn.l275 {
  width: 10.625vw;
}
.key-btn.l300 {
  width: 11.5vw;
}
.key-btn.l625 {
  width: 26.525vw;
}
.key-btn.hide {
  visibility: hidden;
}
.key-btn.noedit {
  width: 8.375vw;
  cursor: not-allowed;
  color: #888;
}
.keyset-tab .keyset-row {
  padding: 0 8px;
  .el-button {
    margin-left: 0.55vw;
    margin-bottom: 8px;
    &:first-child {
      margin-left: 0;
    }
  }
  .el-button {
    padding: 6px 0.8vw;
  }
}
.keyset-tab .el-button.pad150 {
  margin-left: 2.5vw;
}
</style>
