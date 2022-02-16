<!--
 * @Author: sunjie
 * @Date: 2022-02-10 13:55:41
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:20:31
 * @FilePath: /new-fanpiao-uniapp/src/components/NavigationBar/NavigationBar.vue
-->
<template>
  <div class="nav-container" :style="{ paddingTop: statusBarHeight + 'px' }">
    <div class="arrow" v-if="showArrow">
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
import { useSystemInfo } from "@hooks/commonHooks";

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

    return {
      statusBarHeight,
    };
  },
};
</script>
<style lang="less" scoped>
.nav-container {
  height: 44px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .arrow {
    position: absolute;
    left: 10px;
  }
  .title {
    display: inline-block;
  }
}
</style>