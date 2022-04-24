<template>
  <div class="page">
    <NavigationBar title="订单详情" @customBack="navBack" />
    <OrderStatusInfo :orderInfo="orderDetail" />
    <OrderDishInfo
      :merchantName="orderDetail.storeName"
      :dishList="orderDetail.dishList"
      :discountPrice="orderDiscountPrice"
      :totalPrice="orderTotalPrice"
    />
    <OrderInfoList :orderInfo="orderDetail" />
    <RedPacketModal :redPacketVal="redPacketVal" />
  </div>
</template>
<script>
import { useOrderDetail } from "@hooks/orderHooks";
import { computed, onBeforeMount, unref } from "vue";
import OrderStatusInfo from "./OrderStatusInfo/OrderStatusInfo.vue";
import OrderDishInfo from "./OrderDishInfo/OrderDishInfo.vue";
import OrderInfoList from "./OrderInfoList/OrderInfoList.vue";
import RedPacketModal from "./RedPacketModal/RedPacketModal.vue";
import { navigateBack, navigateTo } from "@utils";
let orderId = "",
  redPacketVal = "";
export default {
  components: {
    OrderStatusInfo,
    OrderInfoList,
    OrderDishInfo,
    RedPacketModal,
  },
  onLoad(opts) {
    orderId = opts.orderId;
    redPacketVal = opts.redPacketVal;
  },
  setup() {
    let { orderDetail, getOrderDetailById } = useOrderDetail();

    onBeforeMount(async () => {
      getOrderDetailById(orderId);
      if (redPacketVal) {
        //  弹出红包弹窗
        console.log(
          "%credPacketValue: ",
          "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
          redPacketVal
        );
      }
    });
    let orderDiscountPrice = computed(() => {
      return unref(orderDetail).billFee - unref(orderDetail).paidFee;
    });
    let orderTotalPrice = computed(() => {
      return unref(orderDetail).billFee;
    });
    function navBack() {
      let pages = getCurrentPages(),
        delta = 1;
      console.log("pages: ", pages);
      let menuPageIndex = pages.findIndex((item) => {
        return item.route == "package-menu/menu";
      });

      if (menuPageIndex != -1) {
        delta = pages.length - 1 - menuPageIndex || 1;
        console.log("delta: ", delta);
      }

      navigateBack({
        delta,
      });
    }

    return {
      orderDetail,
      orderDiscountPrice,
      orderTotalPrice,
      navBack,
      redPacketVal,
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