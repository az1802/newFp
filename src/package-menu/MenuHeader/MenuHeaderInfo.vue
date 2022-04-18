<!--
 * @Author: sunjie
 * @Date: 2022-02-15 17:07:53
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 18:53:39
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuHeader/MenuHeaderInfo.vue
-->
<template>
  <div class="header-info-container">
    <img class="logo" :src="merchantInfo.logoUrl" alt="" mode="aspectFill" />
    <div class="info">
      <div class="name">{{ merchantInfo.name }}</div>
      <div class="welcome-text">
        <span class="iconfont icon-weibiaoti555"></span>
        <Marquee
          class="marquee"
          :text="welcomeText"
          :scrollable="true"
          color="#999"
        />
      </div>
    </div>
    <div class="order-records">
      <!-- <span class="iconfont icon-dingdan1"></span> -->
    </div>
  </div>
</template>
<script>
import { computed } from "vue";
import { useMerchantInfo } from "@hooks/merchantHooks";
export default {
  setup() {
    const { merchantInfo } = useMerchantInfo();
    const welcomeText = computed(() => {
      let { merchantSystemMessage } = merchantInfo.value;
      if (merchantSystemMessage) {
        return merchantSystemMessage;
      }
      return `欢迎光临，很高兴为您服务～`;
    });
    return {
      welcomeText,
      merchantInfo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.header-info-container {
  .box-size(100%,66px,white);
  padding: 12px 12px 6px 12px;
  border-radius: 16px 16px 0 0;
  margin-top: -16px;
  display: flex;
  z-index: 10;
  .logo {
    .box-size(50px,50px);
    border-radius: 4px;
    background: #ccc;
  }
  .info {
    flex: 1;
    padding: 0 12px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .name {
      .bold-font();
      .no-wrap();
    }
    .welcome-text {
      display: flex;
      .iconfont {
        .box-size(16px,16px);
        margin-right: 6px;
      }
      .marquee {
        flex: 1;
      }
    }
  }
  .order-records {
    flex-basis: 24px;
    .flex-center();
  }
}
</style>