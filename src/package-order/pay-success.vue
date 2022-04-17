<template>
  <div class="page">
    <NavigationBar title="订单详情" />
    <OrderStatusInfo :orderInfo="orderDetail" />
    <OrderDishInfo
      :dishList="orderDetail.dishList"
      :discountPrice="orderDiscountPrice"
      :totalPrce="orderTotalPrice"
    />
    <OrderInfoList :orderInfo="orderDetail" />
  </div>
</template>
<script>
import { useOrderDetail } from "@hooks/orderHooks";
import { computed, onBeforeMount, unref } from "vue";
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
    orderId = opts.orderId;
  },
  setup() {
    let { orderDetail, getOrderDetailById } = useOrderDetail();

    onBeforeMount(() => {
      getOrderDetailById(orderId);
    });
    let orderDiscountPrice = computed(() => {
      return unref(orderDetail).billFee - unref(orderDetail).paidFee;
    });
    let orderTotalPrice = computed(() => {
      return unref(orderDetail).billFee;
    });

    return {
      orderDetail,
      orderDiscountPrice,
      orderTotalPrice,
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