<template>
  <div class="coupon-reduce-wrapper">
    <div class="label">
      <p class="title"><span class="tag">券</span>优惠券</p>
    </div>
    <div class="coupon-sel">
      <div v-if="orderInfo.isBuyCouponPackage" class="buy-coupon-reduce">
        {{ recommendedCoupon.name }}
      </div>
      <div
        v-else-if="userAvailableMerchantCoupon.length > 0"
        class="available-coupon"
      >
        <div class="price">
          -
          <div class="price-symbol">¥</div>
          {{ orderInfo.selCouponReduceCost / 100 }}
        </div>
        <div class="count">
          (共{{ userAvailableMerchantCoupon.length }}张可用)
        </div>
        <img src="@assets/icon-arrow_right.svg" alt="" class="arrow-right" />
      </div>
    </div>
  </div>
</template>
<script>
import { useOrder } from "@hooks/orderHooks";
import { useRecommendedCoupon } from "@hooks/payHooks";
import { useUserMerchantCoupon } from "@hooks/userHooks";
export default {
  setup() {
    let { userMerchantCoupons } = useUserMerchantCoupon();

    const { setOrderInfo, orderInfo } = useOrder();
    const { recommendedCoupon, userAvailableMerchantCoupon } =
      useRecommendedCoupon();

    return {
      userMerchantCoupons,
      orderInfo,
      recommendedCoupon,
      userAvailableMerchantCoupon,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.coupon-reduce-wrapper {
  .flex-simple(space-between,center);
  .line-center(18px);
  margin-bottom: 10px;
  .label {
    .title {
      .normal-font(16px,#333);
      .tag {
        .box-size(21.5px,16px,rgba(235,75,58,0.1));
        .line-center(16px);
        display: inline-block;
        margin-right: 10px;
        border-radius: 3px;
        .normal-font(11px,#e3513f);
      }
    }
  }
  .coupon-sel {
    .available-coupon {
      .flex-simple(flex-end,center);
      .price {
        .flex-simple(flex-end,center);
        .bold-font(17px,#f25643);
        .price-symbol {
          display: inline-block;
          .bold-font(11px,#f25643);
        }
      }
      .count {
        .normal-font(12px,#333);
        margin-left: 5px;
      }
      .arrow-right {
        .box-size(12px,12px);
        margin-left: 4px;
      }
    }
  }
}
</style>