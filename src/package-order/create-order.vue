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
        :totalPrice="selectedDishesTotalPrice"
        :discountPrice="orderDiscountPrice"
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
let orderId;
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
    orderId = opts.orderId;
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
      let orderInfo = await getOrderDetailById(orderId);
      // todo  设置订单相关的信息同步到本地
      setOrderInfo({
        currentType: "ADD",
        orderId: orderId, //订单id
        remark: orderInfo.remark, //订单备注
        billFee: orderInfo.orderInfo, //账单金额
        packageFee: 0, //打包费
        discountAmountPrice: 0, //菜品折扣已优惠的价格
        phoneMemberDiscount: 0, //会员折扣
        groupDiningEventId: "", //TODO 保留字段
        appointmentTime: "", //TODO 保留字段
        mealType: "EAT_IN", //就餐模式
        peopleCount: orderInfo.peopleCount, //就餐人数
        tableId: orderInfo.tableId, //桌台id
        tableName: orderInfo.tableName, //桌台名称
      });
      return res;
    }

    onBeforeMount(async () => {
      let merchantId;
      if (orderId) {
        // 获取订单相关信息 并且获取商户相关资源
        let orderInfo = await getOrderInfo(orderId);
        merchantId = orderInfo.merchantId;
        await requestMerchantInfo(merchantId);
        requestFanpiaoList(merchantId);
        requestCouponList(merchantId);
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
      if (orderId) {
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

    const orderDishList = computed(() => {
      console.log("unref(orderDetail).dishList: ", unref(orderDetail).dishList);

      return orderId ? unref(orderDetail).dishList : unref(selectedDishes);
    });

    return {
      merchantInfo,
      selectedDishes,
      orderDishList,
      selectedDishesTotalPrice,
      orderDiscountPrice,
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