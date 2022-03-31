<!--
 * @Author: sunjie
 * @Date: 2022-02-18 12:09:48
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:28:39
 * @FilePath: /new-fanpiao-uniapp/src/package-order/create-order.vue
-->
<template >
  <div class="create-order-container">
    <NavigationBar title="订单" />
    <TableInfo />
    <!-- <div style="height: 8px"></div> -->
    <OrderDishInfo />
    <div style="height: 18px"></div>
    <CouponInfo />
    <OrderRemarks />
    <div style="height: 100px"></div>
    <ConfirmOrder />
  </div>
</template>
<script>
import TableInfo from "./TableInfo/TableInfo.vue";
import OrderDishInfo from "./OrderDishInfo/OrderDishInfo.vue";
import ConfirmOrder from "./ConfirmOrder/ConfirmOrder.vue";
import CouponInfo from "./CouponInfo/CouponInfo.vue";
import OrderRemarks from "./OrderRemarks/OrderRemarks.vue";
import { getStorage } from "@utils";

import { useDish } from "@hooks/menuHooks";
import { useTransformPrice } from "@hooks/commonHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import {} from "@hooks/orderHooks";
export default {
  components: {
    TableInfo,
    OrderDishInfo,
    ConfirmOrder,
    CouponInfo,
    OrderRemarks,
  },
  onLoad() {},
  setup() {
    let { resetSelDishes } = useDish();
    let { requestMerchantInfo } = useMerchantInfo();
    resetSelDishes(getStorage("selected-dishes"));
    requestMerchantInfo("4146f4810c74424b819d7fcfb84826e8");
    return {};
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.create-order-container {
  .box-size(100vw,100vh);
  background: #f8f8f8;
}
</style>