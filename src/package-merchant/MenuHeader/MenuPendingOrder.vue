<!--  -->
<template>
  <div class="pending-order" v-if="orderInfo.pendingOrderId">
    <div class="text">您有一个订单未付款</div>
    <div class="go-to-pay" @click="goToPay">去付款</div>
  </div>
</template>
<script>
import { useOrder } from "@hooks/orderHooks";
import { navigateTo } from "@utils";
import { unref } from "vue";
export default {
  data() {
    const { orderInfo } = useOrder();
    return {
      orderInfo,
      goToPay() {
        navigateTo("ORDER/CREATE_ORDER", {
          pendingOrderId: unref(orderInfo).pendingOrderId,
        });
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pending-order {
  .box-size(100%,44px,#fcecea);
  .flex-simple(space-between,center);
  padding: 0 15px;
  .text {
    .normal-font(14px,#f25643);
  }
  .go-to-pay {
    .box-size(82px,28px,transparent);
    .line-center(28px);
    .bold-font(14px,#f25643);
    border: 1px solid #f25643;
    border-radius: 28px;
    text-align: center;
  }
}
</style>