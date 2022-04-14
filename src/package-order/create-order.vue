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
    <scroll-view class="page-content" scroll-y>
      <TableInfo />
      <div style="height: 8px"></div>
      <OrderDishInfo
        :dishList="selectedDishes"
        :totalPrce="selectedDishesTotalPrice"
        :discountPrice="orderDiscountPrice"
      />
      <div style="height: 18px"></div>
      <CouponInfo />
      <OrderRemarks />
      <div style="height: 100px"></div>
    </scroll-view>
    <ConfirmOrder />
    <RecommendationModal
      ref="recommendationModal"
      :recommendedDishes="autoRecommendedDishes"
    />
  </div>
</template>
<script>
import TableInfo from "./TableInfo/TableInfo.vue";
import OrderDishInfo from "./OrderDishInfo/OrderDishInfo.vue";
import ConfirmOrder from "./ConfirmOrder/ConfirmOrder.vue";
import CouponInfo from "./CouponInfo/CouponInfo.vue";
import OrderRemarks from "./OrderRemarks/OrderRemarks.vue";
import RecommendationModal from "./RecommendationModal/RecommendationModal.vue";
import { getStorage } from "@utils";

import { useDish } from "@hooks/menuHooks";
import { useMerchantInfo, useRecommendationDish } from "@hooks/merchantHooks";
import { useOrder } from "@hooks/orderHooks";
import { useRecommendedCoupon } from "@hooks/payHooks";
import { useUserMerchantCoupon } from "@hooks/userHooks";
import { onBeforeMount, ref, computed, unref, watch } from "vue";
export default {
  components: {
    TableInfo,
    OrderDishInfo,
    ConfirmOrder,
    CouponInfo,
    OrderRemarks,
    RecommendationModal,
  },
  onLoad() {},
  setup() {
    let {
      selectedDishes,
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
      resetSelDishes,
    } = useDish();
    let { recommendedDishes, requestRecommendDishes } = useRecommendationDish();
    let { merchantInfo } = useMerchantInfo();
    let { orderInfo, setOrderInfo } = useOrder();
    let { recommendedCoupon, userAvailableMerchantCoupon } =
      useRecommendedCoupon();
    let { requestUserMerchantCoupons } = useUserMerchantCoupon();
    let recommendationModal = ref("");

    onBeforeMount(async () => {
      let merchanrtId = unref(merchantInfo).merchantId;
      requestRecommendDishes(merchanrtId); //请求推荐菜品
      let userCoupons = (await requestUserMerchantCoupons(merchanrtId)) || []; //请求用户已有的商户券包
      // 默认设置用户可使用的券包
      let maxReduceCostCoupon = "";
      userCoupons.forEach((item) => {
        if (
          item.leastCost <= unref(selectedDishesTotalPrice) &&
          (!maxReduceCostCoupon ||
            maxReduceCostCoupon.reduceCost < item.reduceCost)
        ) {
          maxReduceCostCoupon = item;
        }
      });

      if (maxReduceCostCoupon) {
        setOrderInfo({
          selCouponId: maxReduceCostCoupon.id,
          selCouponReduceCost: maxReduceCostCoupon.reduceCost,
        });
      }
    });

    // TODO 选中菜发生变化会重新弹窗
    let autoRecommendedDishes = computed(() => {
      return unref(recommendedDishes).filter((dishItem) => {
        dishItem.quantity = 0;
        let isSel = unref(selectedDishes).some((sleItem) => {
          if (sleItem.id == dishItem.id) {
            return true;
          }
          if (
            sleItem?.attrs?.some((attrItem) => attrItem.name == dishItem.name)
          ) {
            return true;
          }
          if (
            sleItem?.supplyCondiments?.some(
              (condimentItem) => condimentItem.name == dishItem.name
            )
          ) {
            return true;
          }
        });
        return !isSel;
      });
    });

    watch(autoRecommendedDishes, (nval) => {
      if (nval?.length > 0) {
        recommendationModal.value.showModal();
      }
    });

    const orderDiscountPrice = computed(() => {
      let res = unref(selectedDishesDiscountPrice) || 0;
      if (unref(orderInfo).isBuyCouponPackage) {
        res += unref(recommendedCoupon).couponCost;
      } else if (unref(orderInfo).selCouponId) {
        res += unref(orderInfo).selCouponReduceCost;
      }
      return res;
    });
    return {
      selectedDishes,
      selectedDishesTotalPrice,
      orderDiscountPrice,
      recommendationModal,
      autoRecommendedDishes,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.create-order-container {
  .box-size(100vw,100vh);
  background: #f8f8f8;
  .page-content {
    .box-size(100vw,calc(100vh - 80px),#f8f8f8);
  }
}
</style>