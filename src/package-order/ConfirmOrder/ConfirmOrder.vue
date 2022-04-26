<!--
 * @Author: sunjie
 * @Date: 2022-02-18 13:55:25
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:30:19
 * @FilePath: /new-fanpiao-uniapp/src/package-order/ConfirmOrder/ConfirmOrder.vue
-->
<template>
  <div class="container-wrapper">
    <div
      class="buy-fanpiao-tooltip"
      v-if="tooltipType == 'noBuyFanpiao' && userMerchantFanpiaoBalance < 5000"
    >
      <div class="left">
        <div class="text">本单可享饭票价</div>
        <div class="price">{{ minFanpiaoPrice }}</div>
      </div>
      <div class="right">
        <div @click="navigateTo('MARKETING/BUY_FANPIAO')">
          <div class="text-box">
            <div class="text">抢饭票</div>
            <img
              src="@assets/arrow-white-right2.png"
              class="arrow-white-right"
            />
          </div>
          <TimeCounter
            customStartText=" "
            :isShowHour="false"
            :isNoBg="true"
            :show-day="false"
            mode="fanpiao-new"
          />
        </div>
      </div>
    </div>
    <div
      class="use-fanpiao-tooltip"
      v-if="tooltipType == 'hasBuyFanpiao' && userMerchantFanpiaoBalance < 5000"
    >
      支付时选择饭票支付，即可享饭票价。
    </div>
    <div class="confirm-order-container">
      <div class="left">
        <div v-if="orderInfo.isBuyCouponPackage" class="buy-coupon-price">
          <div class="price-info">
            <div class="price-calc">
              <div class="order-pay-price">
                {{ (orderFinalPrice - recommendedCoupon.couponCost) / 100 }}
              </div>
              +
              <div class="coupon-price">
                {{ recommendedCoupon.price / 100 }}
              </div>
            </div>
            券包
          </div>
          <div class="coupon-text">
            (本单已省¥{{ recommendedCoupon.couponCost / 100 }}元)
          </div>
        </div>
        <div v-else class="price">
          {{ fenToYuan(orderFinalPrice - orderInfo.selCouponReduceCost) }}
        </div>
      </div>
      <div class="right" v-if="!orderInfo.pendingOrderId">
        <div class="continue-order" @click="navigateBack">继续点菜</div>
        <div class="confirm-order" @click="confirmOrder">确认下单</div>
      </div>
      <div class="right" v-if="orderInfo.pendingOrderId">
        <div class="continue-order" @click="navigateBack">加菜</div>
        <div class="confirm-order" @click="confirmOrder">支付</div>
      </div>
    </div>
    <div style="height: 32px; background: white"></div>
  </div>
</template>
<script>
import { useNavigate } from "@hooks/commonHooks";
import { useOrder } from "@hooks/orderHooks";
import { useDish } from "@hooks/menuHooks";
import { useUserMerchantFanpiaoBalance } from "@hooks/userHooks";
import { useRecommendedCoupon, usePay } from "@hooks/payHooks";
import { useFanpiaoInfo } from "@hooks/merchantHooks";
import { fenToYuan, showToast } from "@utils";

import { ref, unref, computed } from "vue";
export default {
  components: {},
  props: {
    tooltipType: {
      type: [String, Boolean],
      default: "",
    },
  },
  setup() {
    const {
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
      selectedDishesFinalTotalPrice,
    } = useDish();
    const { recommendedCoupon } = useRecommendedCoupon();
    const { commonPay } = usePay();

    const { navigateBack, navigateTo } = useNavigate();
    const { createOrder, setOrderInfo, orderInfo } = useOrder();
    const { maxDiscountFanpiao } = useFanpiaoInfo();
    const { userMerchantFanpiaoBalance } = useUserMerchantFanpiaoBalance();
    // const totalPrice = computed(() => {});
    async function buyCouponAndPay() {
      let { isAgreeCouponAccord, selCouponId, pendingOrderId, paidFee } =
        unref(orderInfo);
      if (!isAgreeCouponAccord) {
        showToast("请阅读并同意《付费券包协议》");
        return;
      }

      let orderId = "";
      if (pendingOrderId) {
        orderId = pendingOrderId;
      } else {
        orderId = await createOrder();
      }

      if (!orderId) {
        return;
      }
      let orderPaidFee = 0;

      let data = {
        billFee:
          unref(selectedDishesTotalPrice) +
          (unref(recommendedCoupon)?.price || 0),
        couponPackageId: unref(recommendedCoupon).id,
        isInvoice: false,
        merchantId: uni.getStorageSync("merchantId"),
        noDiscountBillFee: 0,
        orderId,
        paidFee:
          (pendingOrderId ? paidFee : unref(selectedDishesFinalTotalPrice)) +
          (unref(recommendedCoupon)?.price || 0) -
          (unref(recommendedCoupon)?.couponCost || 0),
        payMethod: "WECHAT_PAY",
        transactionType: "SELF_DISH_ORDER_PAYMENT",
      };
      // #ifdef MP-ALIPAY
      data.payMethod = "ALIPAY";
      // #endif

      let payRes = await commonPay(data);
      if (payRes) {
        // navigateTo("ORDER/PAY_SUCCESS", {
        //   orderId: "c682d06704b445fa9813dab71e5a3770",
        //   redPacketVal: 1,
        // });
        navigateTo("ORDER/PAY_SUCCESS", {
          orderId: payRes.id,
          redPacketVal: payRes.redPacketValue || 0,
        });
      }
    }

    async function confirmOrder() {
      let { isBuyCouponPackage, isAgreeCouponAccord, billFee, pendingOrderId } =
        unref(orderInfo);

      if (isBuyCouponPackage) {
        //券包合并支付
        buyCouponAndPay(unref(orderInfo));
        return;
      }

      let { paidFee } = unref(orderInfo);
      let orderId = "";
      if (pendingOrderId) {
        orderId = pendingOrderId;
      } else {
        orderId = await createOrder();
      }

      if (!orderId) {
        return;
      }

      let discountAmountPrice = unref(selectedDishesDiscountPrice), //菜品折扣的优化
        orderBillFee = pendingOrderId
          ? billFee
          : unref(selectedDishesTotalPrice); //菜品原价总额

      setOrderInfo({
        orderId,
        discountAmountPrice,
        billFee: orderBillFee,
        couponPrice: 0,
        couponId: 0,
      });

      navigateTo("ORDER/PAY_ORDER");
    }

    const minFanpiaoPrice = computed(() => {
      let { discount = 0 } = unref(maxDiscountFanpiao);
      const { pendingOrderId, billFee } = unref(orderInfo);
      let totalPrice = pendingOrderId
        ? billFee
        : unref(selectedDishesTotalPrice);
      return Number(((100 - discount) * (totalPrice || 0)) / 10000).toFixed(2);
    });

    const orderFinalPrice = computed(() => {
      const { pendingOrderId, paidFee } = unref(orderInfo);
      return pendingOrderId ? paidFee : unref(selectedDishesFinalTotalPrice);
    });

    return {
      navigateBack,
      navigateTo,
      createOrder,
      confirmOrder,
      orderFinalPrice,
      fenToYuan,
      orderInfo,
      recommendedCoupon,
      minFanpiaoPrice,
      userMerchantFanpiaoBalance,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.container-wrapper {
  .pos-bl-absolute(0px,0px);
  position: fixed;
  z-index: 100;
  background: transparent;
}
.buy-fanpiao-tooltip {
  .box-size(calc(100vw - 24px),50px,transparent);
  .flex-simple(space-between,center);
  margin: 0 12px;
  padding: 0 12px 0 6px;
  z-index: 99;
  background-image: url(https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/create-order/fanpiaojia-lable-bg_02.svg);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: relative;
  .left {
    .flex-simple(flex-start,center);
    .pos-tl-absolute(13px,10%);
    .text {
      .normal-font(14px,#777);
    }
    .price {
      .bold-font(20px,#F25643);
      .price-symbol(14px,#F25643,normal);
    }
  }
  .right {
    .pos-tr-absolute(6px,15px);
    .flex-simple(center,center);
    background: #fff7e2;
    padding: 4px 10px;
    border-radius: 8px;
    .text-box {
      .flex-simple(center,center);
      .line-center(14px);
      width: 100%;
      margin-bottom: 2px;
    }
    .text {
      .bold-font(14px,#F25643);
    }
    .arrow-white-right {
      .box-size(6px,9px,transparent);
      margin-left: 2px;
    }
  }
}

.use-fanpiao-tooltip {
  .box-size(calc(100vw - 24px),50px,#ffe9d2);
  .line-center(32px);
  .normal-font(14px,#eb4b3a);
  margin: 0 12px 8px 12px;
  text-align: center;
}
.confirm-order-container {
  .box-size(100vw,70px);
  .flex-between();
  align-items: center;
  padding: 0 15px 10px 15px;
  border-top: 1px solid rgb(224, 224, 224);
  .left {
    flex: 1;
    .buy-coupon-price {
      height: 39px;
      .normal-font(12px,black);
      .price-info {
        .line-center(18px);
        .flex-simple(flex-start,center);
        .price-calc {
          .flex-simple(flex-start,center);
          margin-right: 5px;
          .order-pay-price,
          .coupon-price {
            .line-center(18px);
            .bold-font(18px,#333);
            .price-symbol(11px,#333);
          }
        }
      }
      .coupon-text {
        .line-center(12px);
        .bold-font(12px,#666);
        margin-top: 4px;
      }
    }
    .price {
      .line-center(12px);
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