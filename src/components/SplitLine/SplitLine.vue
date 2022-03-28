<!--
 * @Author: sunjie
 * @Date: 2022-02-18 15:31:05
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 16:45:24
 * @FilePath: /new-fanpiao-uniapp/src/components/SplitLine/SplitLine.vue
-->
<template>
  <div class="line-wrapper" :style="lineStyle">
    <div class="line"></div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  props: {
    paddingTop: {
      type: String,
      default: "0",
    },
    paddingBottom: {
      type: String,
      default: "0",
    },
  },
  setup(props) {
    let { paddingTop, paddingBottom } = props;
    let lineStyle = ref({
      paddingTop: paddingTop + "px",
      paddingBottom: paddingBottom + "px",
    });
    return {
      lineStyle,
    };
  },
};
</script>
<style lang="less" scoped>
.line-wrapper {
  width: 100%;
  .line {
    height: 1px;
    background: #e0e0e0;
  }
}
</style>