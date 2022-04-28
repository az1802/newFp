<!--
 * @Author: sunjie
 * @Date: 2022-02-15 17:01:20
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:55:19
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuHeader/MenuHeaderBanner.vue
-->
<template>
  <div
    class="banner-container"
    v-if="showBanner"
    @click="navigateTo('MARKETING/BUY_FANPIAO')"
  >
    <div class="banner">
      <img
        class="banner-background"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/menu/fanpiaoBannerBackground_09.png"
        alt=""
      />
      <div class="fanpiao-discount">{{ fanpiaoDiscount }}</div>
      <div class="time-box">
        <div class="text">距结束</div>
        <TimeCounter
          mode="dragon-boat-festival"
          customStartText=""
          :isMini="true"
          :endDate="
            merchantInfo &&
            merchantInfo.fanpiaoSnapUpActivityTime &&
            merchantInfo.fanpiaoSnapUpActivityTime.endTimestamp
          "
        />
      </div>
    </div>
  </div>
</template>
<script>
import { useFanpiaoInfo, useMerchantInfo } from "@hooks/merchantHooks";
import { useNavigate } from "@hooks/commonHooks";
import { computed, unref } from "vue";
export default {
  setup() {
    const { maxDiscountFanpiao, fanpiaoList } = useFanpiaoInfo();
    const { merchantInfo } = useMerchantInfo();
    const { navigateTo } = useNavigate();
    const showBanner = computed(() => {
      const { bannerMode, disableBuyFanpiao } = unref(merchantInfo);
      return (
        !disableBuyFanpiao &&
        bannerMode !== "BANNER_NONE" &&
        unref(fanpiaoList).length
      );
    });
    const fanpiaoDiscount = computed(() => {
      let { discount = 0 } = unref(maxDiscountFanpiao);
      return Number((100 - discount) / 10).toFixed(1);
    });
    return {
      merchantInfo,
      maxDiscountFanpiao,
      navigateTo,
      showBanner,
      fanpiaoDiscount,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";

.banner-container {
  .box-size(100%,unset);
  padding: 8px 12px 8px 12px;
  .banner {
    .box-size(100%,22.66666vw);
    position: relative;
    .banner-background {
      .fill-box();
    }
  }
  .fanpiao-discount {
    .pos-tr-absolute(22%,26%);
    .bold-font(7.4vw,#f25643);
    height: 100%;
    font-style: italic;
    text-shadow: 0px 2px 0px #ffe7b8;
  }
  .time-box {
    .box-size(140px,16px);
    .flex-simple(center,center);
    .pos-br-absolute(12px,112px);
    background: linear-gradient(90deg, #fdb241 0%, #ff8927 99%);
    border-radius: 8px;
    .text {
      .bold-font(10px,white);
      margin: -1px -4px 0 0;
    }
  }
}
</style>