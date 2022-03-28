<!--
 * @Author: sunjie
 * @Date: 2022-02-18 13:55:25
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:30:19
 * @FilePath: /new-fanpiao-uniapp/src/package-order/ConfirmOrder/ConfirmOrder.vue
-->
<template>
  <div class="confirm-order-container">
    <div class="left">
      <div class="price">{{ fenToYuan(selectedDishesTotalPrice) }}</div>
    </div>
    <div class="right">
      <div class="continue-order" @click="navigateBack">继续点菜</div>
      <div class="confirm-order" @click="confirmOrder">确认下单</div>
    </div>
  </div>
</template>
<script>
import { useNavigate, useTransformPrice } from "@hooks/commonHooks";
import { useOrder } from "@hooks/orderHooks";
import { useDish } from "@hooks/menuHooks";
export default {
  components: {},
  setup() {
    const { selectedDishesTotalPrice } = useDish();
    const { navigateBack, navigateTo } = useNavigate();
    const { createOrder } = useOrder();
    let { fenToYuan } = useTransformPrice();

    async function confirmOrder() {
      let res = await createOrder();
      let { orderId } = res;
      console.log(
        "%corderId: ",
        "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
        orderId
      );
      navigateTo("ORDER/PAY_ORDER");
    }

    return {
      navigateBack,
      createOrder,
      confirmOrder,
      selectedDishesTotalPrice,
      fenToYuan,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.confirm-order-container {
  .box-size(100vw,70px);
  .flex-between();
  align-items: center;
  .pos-bl-absolute(32px,0px);
  padding: 0 15px 10px 15px;
  .left {
    flex: 1;
    .price {
      .bold-font(18px);
      .price-symbol(12px,#000);
    }
  }
  .right {
    flex: 1;
    .flex-between();
    .continue-order {
      .common-btn(45px,#fe8746,25px);
      .bold-font(16px,white);
      flex: 1;
      border-radius: 25px 0 0 25px;
    }
    .confirm-order {
      .common-btn(45px,#e3513f,25px);
      .bold-font(16px,white);
      flex: 1;
      border-radius: 0 25px 25px 0;
    }
  }
}
</style>