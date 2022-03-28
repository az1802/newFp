<!--
 * @Author: sunjie
 * @Date: 2022-02-18 19:13:57
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:53:51
 * @FilePath: /new-fanpiao-uniapp/src/package-order/PayMthodList/payMethodList.vue
-->
<template>
  <div class="pay-method-container">
    <div
      class="pay-method-item"
      @click="changePayMethod"
      data-pay-method-name="FANPIAO"
    >
      <div class="left">饭票支付</div>
      <CustomRadio :checked="payMethod == 'FANPIAO'" />
    </div>
    <div
      class="pay-method-item"
      @click="changePayMethod"
      data-pay-method-name="REDPACKET"
    >
      <div class="left">红包</div>
      <CustomRadio :checked="payMethod == 'REDPACKET'" />
    </div>
    <div
      class="pay-method-item"
      @click="changePayMethod"
      data-pay-method-name="MEMBER_CARD"
    >
      <div class="left">储值</div>
      <CustomRadio :checked="payMethod == 'MEMBER_CARD'" />
    </div>
    <div
      class="pay-method-item"
      @click="changePayMethod"
      data-pay-method-name="WECHAT"
    >
      <div class="left">微信</div>
      <CustomRadio :checked="payMethod == 'WECHAT'" />
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
export default {
  components: {},
  setup() {
    let payMethod = ref("FANPIAO");

    return {
      payMethod,
      changePayMethod(e) {
        let { payMethodName } = e.currentTarget.dataset;
        payMethod.value = payMethodName;
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-method-container {
  .box-size(100%,unset);
  padding: 0 12px;
  .pay-method-item {
    height: 56px;
    .flex-between();
  }
  .left {
    flex: 1;
  }
}
</style>