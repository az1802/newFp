<!--
 * @Author: sunjie
 * @Date: 2022-02-18 12:09:48
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:28:39
 * @FilePath: /new-fanpiao-uniapp/src/package-order/create-order.vue
-->
<template >
  <div class="create-order-container">
    <div class="a"></div>
    <NavigationBar title="" />
    <scroll-view class="page-content" scroll-y>
      <TableInfo />
      <div style="height: 8px"></div>
      <OrderDishInfo
        :merchantName="merchantInfo.name"
        :dishList="orderDishList"
        :totalPrice="orderTotalPrice"
        :discountPrice="orderDiscountPrice"
        :showBatchNumber="orderInfo.pendingOrderId ? true : false"
      />
      <div style="height: 18px"></div>
      <CouponInfo />
      <OrderRemarks />
      <div style="height: 100px"></div>
    </scroll-view>
    <ConfirmOrder
      :tooltipType="
        !merchantInfo.disableBuyFanpiao &&
        merchantInfo.enableFanpiao &&
        (hasBuyFanpiao ? 'hasBuyFanpiao' : 'noBuyFanpiao')
      "
    />
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
import {
  useMerchantInfo,
  useRecommendationDish,
  useFanpiaoInfo,
  useCouponInfo,
} from "@hooks/merchantHooks";
import { useOrder, useOrderDetail } from "@hooks/orderHooks";
import { useRecommendedCoupon } from "@hooks/payHooks";
import { useUserMerchantCoupon } from "@hooks/userHooks";
import { onBeforeMount, ref, computed, unref, watch } from "vue";
let pendingOrderId = ref("");
export default {
  components: {
    TableInfo,
    OrderDishInfo,
    ConfirmOrder,
    CouponInfo,
    OrderRemarks,
    RecommendationModal,
  },
  onLoad(opts) {
    console.log("下单页页面参数 ", opts);
    pendingOrderId.value = opts.pendingOrderId;
    getApp().globalData.hasJumpedToCreateOrder = true;
  },
  onShow() {
    this.hasBuyFanpiao = getApp().globalData.hasBuyFanpiao || false;
  },
  setup() {
    let {
      selectedDishes,
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
      resetSelDishes,
    } = useDish();
    let { recommendedDishes, requestRecommendDishes } = useRecommendationDish();
    let { merchantInfo, requestMerchantInfo } = useMerchantInfo();
    let { orderInfo, setOrderInfo } = useOrder();
    let { recommendedCoupon, userAvailableMerchantCoupon } =
      useRecommendedCoupon();
    let { requestUserMerchantCoupons } = useUserMerchantCoupon();
    let recommendationModal = ref("");
    const { orderDetail, getOrderDetailById } = useOrderDetail();
    const { requestFanpiaoList } = useFanpiaoInfo();
    const { requestCouponList } = useCouponInfo();

    async function getOrderInfo(orderId) {
      let orderInfoRes = await getOrderDetailById(orderId);
      console.log("orderInfoRes: ", orderInfoRes);
      // todo  设置订单相关的信息同步到本地
      setOrderInfo({
        currentType: "ADD",
        orderId: orderId, //订单id
        remark: orderInfoRes.remark, //订单备注
        billFee: orderInfoRes.billFee, //账单金额
        paidFee: orderInfoRes.paidFee, //账单金额
        packageFee: 0, //打包费
        discountAmountPrice: 0, //菜品折扣已优惠的价格
        // phoneMemberDiscount: 0, //会员折扣
        groupDiningEventId: "", //TODO 保留字段
        appointmentTime: "", //TODO 保留字段
        mealType: orderInfoRes.mealType, //就餐模式
        peopleCount: orderInfoRes.peopleCount, //就餐人数
        tableId: orderInfoRes.tableId, //桌台id
        tableName: orderInfoRes.tableName, //桌台名称
      });

      // TODO 此处便于测试才会加载相关资源 默认点餐页面该资源已经被加载
      await requestMerchantInfo(orderInfoRes.merchantId);
      requestFanpiaoList(orderInfoRes.merchantId);
      requestCouponList(orderInfoRes.merchantId);
      return orderInfoRes;
    }

    onBeforeMount(async () => {
      let merchantId;
      if (pendingOrderId.value) {
        // 获取订单相关信息 并且获取商户相关资源
        let orderInfo = await getOrderInfo(pendingOrderId.value);
        merchantId = orderInfo.merchantId;
      } else {
        merchantId = unref(merchantInfo).merchantId;
      }
      requestRecommendDishes(merchantId); //请求推荐菜品
      let userCoupons = (await requestUserMerchantCoupons(merchantId)) || []; //请求用户已有的商户券包
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

    const orderTotalPrice = computed(() => {
      if (pendingOrderId.value) {
        return unref(orderInfo).billFee;
      } else {
        return unref(selectedDishesTotalPrice);
      }
    });

    const orderDiscountPrice = computed(() => {
      let res = 0;
      let {
        billFee,
        paidFee,
        isBuyCouponPackage,
        selCouponId,
        selCouponReduceCost,
      } = unref(orderInfo);
      if (unref(pendingOrderId)) {
        res = billFee - paidFee;
      } else {
        res = unref(selectedDishesDiscountPrice);
      }
      if (isBuyCouponPackage) {
        res += unref(recommendedCoupon).couponCost;
      } else if (selCouponId) {
        res += selCouponReduceCost;
      }
      return res;
    });

    const orderDishList = computed(() => {
      return pendingOrderId.value
        ? unref(orderDetail).dishList
        : unref(selectedDishes);
    });

    return {
      merchantInfo,
      selectedDishes,
      orderInfo,
      orderDishList,
      selectedDishesTotalPrice,
      orderDiscountPrice,
      orderTotalPrice,
      recommendationModal,
      autoRecommendedDishes,
    };
  },
  data() {
    return {
      hasBuyFanpiao: false,
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