<!--
 * @Author: sunjie
 * @Date: 2022-02-10 13:55:41
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 19:06:27
 * @FilePath: /new-fanpiao-uniapp/src/components/NavigationBar/NavigationBar.vue
-->
<template>
  <div
    class="nav-container"
    :style="{
      paddingTop: statusBarHeight + 'px',
      opacity: backgroundOpacity,
      background: backgroundColor,
      position: position,
    }"
  >
    <!-- #ifdef MP-WEIXIN -->
    <div class="arrow" v-if="showArrow" @click="back">
      <span
        class="iconfont icon-dajiantouzuo"
        :style="{ color: iconColor }"
      ></span>
    </div>
    <!-- #endif -->
    <div class="order-icon" v-if="showOrderIcon" @click="viewMerchantOrder">
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-order_02.png"
        alt=""
        class="img"
      />
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
    showOrderIcon: {
      type: Boolean,
      default: false,
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
    backgroundColor: {
      type: String,
      default: "white",
    },
    position: {
      type: String,
      default: "relative",
    },
    useCustomBack: {
      type: [Boolean],
      default: null,
    },
  },
  setup(props, { emit }) {
    let { statusBarHeight } = useSystemInfo();
    let { navigateBack, navigateTo } = useNavigate();

    function back() {
      if (props.useCustomBack) {
        emit("customBack");
      } else {
        navigateBack();
      }
    }
    return {
      statusBarHeight,
      back,
      viewMerchantOrder() {
        let merchantId = uni.getStorageSync("merchantId");
        navigateTo("MERCHANT/ORDER", {
          merchantId,
        });
      },
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
  position: fixed;
  z-index: 10;
  width: 100%;
  top: 0;
  left: 0;
  .arrow {
    .pos-tl-absolute(unset,0px);
    padding: 10px;
    z-index: 1000;
  }
  .order-icon {
    /* #ifdef MP-WEXIN */
    .pos-tl-absolute(unset,40px);
    /* #endif */
    /* #ifndef MP-WEXIN */
    .pos-tl-absolute(unset,50px);
    /* #endif */
    z-index: 1000;
    .box-size(100%,40px);
    .flex-simple(flex-start,center);
    .img {
      .box-size(24px,24px);
    }
  }
  .title {
    display: inline-block;
    .bold-font(18px,black);
  }
}
</style>