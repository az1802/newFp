<!--
 * @Author: sunjie
 * @Date: 2022-02-15 16:10:57
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 10:23:02
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuHeader/MenuHeaderImg.vue
-->
<template>
  <div class="menu-header-container" :style="headerStyle">
    <span
      class="iconfont icon-dajiantouzuo arrow"
      :style="{ top: statusBarHeight + 9 + 'px' }"
    ></span>
    <img
      class="img"
      :src="merchantInfo.storeCoverPhotoUrls"
      mode="aspectFill"
    />
  </div>
</template>
<script>
import { useState, useMutations } from "@utils/storeHooks";
import { useSystemInfo } from "@utils/commonHooks";
import { ref } from "vue";
export default {
  setup() {
    const { merchantInfo } = useState("merchant", ["merchantInfo"]);
    const { statusBarHeight, screenWidth } = useSystemInfo();

    const headerStyle = ref({
      height: screenWidth / 3 + "px",
    });
    return {
      merchantInfo,
      headerStyle,
      statusBarHeight,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.menu-header-container {
  min-height: 125px;
  position: relative;
  z-index: -1;
  .arrow {
    position: absolute;
    left: 10px;
  }
  .img {
    .box-size();
    background: #ccc;
  }
}
</style>