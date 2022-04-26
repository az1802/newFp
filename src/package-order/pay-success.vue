<template>
  <div class="page">
    <NavigationBar title="订单详情" @customBack="navBack" useCustomBack />
    <scroll-view class="scroll-view" scroll-y>
      <OrderStatusInfo :orderInfo="orderDetail" />
      <OrderDishInfo
        :merchantName="orderDetail.storeName"
        :dishList="orderDetail.dishList"
        :discountPrice="orderDiscountPrice"
        :totalPrice="orderTotalPrice"
      />
      <OrderInfoList :orderInfo="orderDetail" />
      <RedPacketModal ref="redPacketModal" :redPacketVal="redPacketVal" />
      <div style="height: 150px"></div>
    </scroll-view>
  </div>
</template>
<script>
import { useOrderDetail } from "@hooks/orderHooks";
import { computed, onBeforeMount, unref, ref } from "vue";
import OrderStatusInfo from "./OrderStatusInfo/OrderStatusInfo.vue";
import OrderDishInfo from "./OrderDishInfo/OrderDishInfo.vue";
import OrderInfoList from "./OrderInfoList/OrderInfoList.vue";
import RedPacketModal from "./RedPacketModal/RedPacketModal.vue";
import { navigateBack, navigateTo } from "@utils";
let orderId = "",
  redPacketVal = ref(0);
export default {
  components: {
    OrderStatusInfo,
    OrderInfoList,
    OrderDishInfo,
    RedPacketModal,
  },
  onLoad(opts) {
    orderId = opts.orderId;
    redPacketVal.value = parseFloat(opts.redPacketVal);
    // 进入到此页面后,后续回到点餐页面需要重新加载用户相关的商户信息
    getApp().globalData.resetUserMerchantInfo = true;
  },
  setup() {
    let { orderDetail, getOrderDetailById } = useOrderDetail();
    let redPacketModal = ref("");
    onBeforeMount(async () => {
      if (!orderId) {
        console.log("订单错误");
        return;
      }
      getOrderDetailById(orderId);
      if (redPacketVal.value) {
        redPacketModal.value.show();
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
      let menuPageIndex = pages.findIndex((item) => {
        console.log("item: ", item);
        return item.route == "package-menu/menu";
      });
      console.log("menuPageIndex: ", menuPageIndex);

      if (menuPageIndex != -1) {
        delta = pages.length - 1 - menuPageIndex || 1;
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
      redPacketModal,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.page {
  .box-size(100vw,100vh,#F8F8F8);
  .scroll-view {
    height: calc(100vh - 88px);
  }
}
</style>