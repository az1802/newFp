<template>
  <div class="page">
    <NavigationBar title="" :showArrow="false" :backgroundOpacity="0" />
    <OrderStatusInfo :orderInfo="orderInfo" />
    <OrderDishInfo :dishList="orderInfo.dishList" />
    <OrderInfoList :orderInfo="orderInfo" />
  </div>
</template>
<script>
import { useOrderRecord } from "@hooks/orderHooks";
import { computed, onBeforeMount } from "vue";
import OrderStatusInfo from "./OrderStatusInfo/OrderStatusInfo.vue";
import OrderDishInfo from "./OrderDishInfo/OrderDishInfo.vue";
import OrderInfoList from "./OrderInfoList/OrderInfoList.vue";
let orderId = "";
export default {
  components: {
    OrderStatusInfo,
    OrderInfoList,
    OrderDishInfo,
  },
  onLoad(opts) {
    orderId = opts.orderId || "dcb51bc95528408c8f6f338cb895d85d";
  },
  setup() {
    let { orderInfo, getOrderDetailById } = useOrderRecord();

    onBeforeMount(() => {
      getOrderDetailById(orderId);
    });

    return {
      orderInfo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.page {
  .box-size(100vw,100vh,#F8F8F8);
}
</style>