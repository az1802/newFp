<!--
 * @Author: sunjie
 * @Date: 2022-02-10 13:55:41
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 19:06:27
 * @FilePath: /new-fanpiao-uniapp/src/components/NavigationBar/NavigationBar.vue
-->
<template>
  <div class="nav-container" :style="{ paddingTop: statusBarHeight + 'px' }">
    <div class="arrow" v-if="showArrow" @click="navigateBack">
      <span
        class="iconfont icon-dajiantouzuo"
        :style="{ color: iconColor }"
      ></span>
    </div>
    <div class="title" v-if="title" :style="{ color: titleColor }">
      {{ title }}
    </div>
    <slot class="title" v-else />
  </div>
</template>
<script>
import { useSystemInfo, useNavigate } from "@hooks/commonHooks";

export default {
  props: {
    showArrow: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: "",
    },
    titleColor: {
      type: String,
      default: "black",
    },
    iconColor: {
      type: String,
      default: "black",
    },
    backgroundOpacity: {
      type: Number,
      default: 1,
    },
  },
  setup(props, context) {
    let { statusBarHeight } = useSystemInfo();
    let { navigateBack } = useNavigate();
    return {
      statusBarHeight,
      navigateBack,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.nav-container {
  .flex-center();
  height: 44px;
  background: white;
  position: relative;
  .arrow {
    .pos-tl-absolute(unset,10px);
  }
  .title {
    display: inline-block;
    .bold-font(18px,black);
  }
}
</style>