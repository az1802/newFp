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
      <div v-if="orderInfo.isBuyCouponPackage" class="buy-coupon-price">
        <div class="price-info">
          <div class="price-calc">
            <div class="order-pay-price">
              {{
                (selectedDishesFinalTotalPrice - recommendedCoupon.couponCost) /
                100
              }}
            </div>
            +
            <div class="coupon-price">{{ recommendedCoupon.price / 100 }}</div>
          </div>
          券包
        </div>
        <div class="coupon-text">
          (本单已省¥{{ recommendedCoupon.couponCost / 100 }}元)
        </div>
      </div>
      <div v-else class="price">{{ fenToYuan(selectedDishesTotalPrice) }}</div>
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
import { useRecommendedCoupon } from "@hooks/payHooks";

import { ref, unref } from "vue";
export default {
  components: {},
  setup() {
    const {
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
      selectedDishesFinalTotalPrice,
    } = useDish();
    const { navigateBack, navigateTo } = useNavigate();
    const { createOrder, setOrderInfo, orderInfo } = useOrder();
    let { recommendedCoupon } = useRecommendedCoupon();
    let { fenToYuan } = useTransformPrice();

    function buyCouponAndPay() {
      let { isAgreeCouponAccord } = unref(orderInfo);
      if (!isAgreeCouponAccord) {
        showToast("请阅读并同意《付费券包协议》");
        return;
      }

      // TODO 直接支付
    }

    async function confirmOrder() {
      let { isBuyCouponPackage, isAgreeCouponAccord } = unref(orderInfo);

      if (isBuyCouponPackage) {
        //券包合并支付
        buyCouponAndPay();
        return;
      }

      let res = await createOrder();
      let { orderId } = res;
      let discountAmount = unref(selectedDishesDiscountPrice),
        billFee = unref(selectedDishesTotalPrice);

      setOrderInfo({
        orderId,
        discountAmount,
        billFee,
        paidFee: billFee - discountAmount,
        couponPrice: "",
        couponId: "",
        couponPackageId: "",
        isBuyCouponPackage: "",
      });
      navigateTo("ORDER/PAY_ORDER");
    }

    return {
      navigateBack,
      createOrder,
      confirmOrder,
      selectedDishesTotalPrice,
      selectedDishesFinalTotalPrice,
      fenToYuan,
      orderInfo,
      recommendedCoupon,
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
  position: fixed;
  padding: 0 15px 10px 15px;
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