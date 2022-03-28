<!--
 * @Author: sunjie
 * @Date: 2022-02-18 14:22:32
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 19:22:25
 * @FilePath: /new-fanpiao-uniapp/src/package-order/pay-order.vue
-->
<template>
  <div class="pay-order-page">
    <NavigationBar title="确认支付" />
    <div class="pay-price-info">
      <div class="pay-price">91</div>
      <div class="origin-price">104</div>
    </div>

    <PayMthodList />

    <div class="pay-btn">确认支付</div>
  </div>
</template>
<script>
import PayMthodList from "./PayMthodList/payMethodList.vue";
export default {
  components: { PayMthodList },
  setup() {},
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-order-page {
  .box-size(100vw,100vh,#f8f8f8);
  .pay-price-info {
    .flex-simple(center,flex-end);
    height: 45px;
    padding: 20px 0 24px 0;
    .pay-price {
      .normal-font(45px,#333);
      .price-symbol(22px,#333);
      .line-center(45px);
    }
    .origin-price {
      .normal-font(20px,#666);
      .price-symbol(20px,#666);
      text-decoration: line-through;
      margin-left: 6px;
    }
  }
  .pay-btn {
    position: fixed;
    bottom: 52px;
    left: 12px;
    right: 12px;
    .common-btn(45px,#f25643,25px);
    .bold-font(18px,white);
  }
}
</style>