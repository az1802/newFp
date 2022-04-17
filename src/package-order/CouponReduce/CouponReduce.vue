<template>
  <div
    class="coupon-reduce-wrapper"
    v-if="
      userAvailableMerchantCoupon.length > 0 || orderInfo.isBuyCouponPackage
    "
  >
    <div class="label">
      <p class="title"><span class="tag">券</span>优惠券</p>
    </div>
    <div class="coupon-sel">
      <div v-if="orderInfo.isBuyCouponPackage" class="buy-coupon-reduce">
        <p class="coupon-text">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/create-order/icon-coupon.png"
            class="title-bg"
          />
          <span class="text">特惠券包</span>
        </p>
        <div class="reduce-text">
          <div class="symbol">-¥</div>
          {{ recommendedCoupon.couponCost / 100 }}
        </div>
      </div>
      <div
        v-else-if="orderInfo.selCouponId"
        class="available-coupon"
        @click="goToSelectCoupon"
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
      <div
        v-else-if="
          !orderInfo.selCouponId && userAvailableMerchantCoupon.length > 0
        "
        class="available-coupon"
        @click="goToSelectCoupon"
      >
        <span class="total-count">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/create-order/icon-coupon.png"
            alt=""
            class="total-count-icon"
          />
          共{{ userAvailableMerchantCoupon.length }}张可用
        </span>
        <img src="@assets/icon-arrow_right.svg" alt="" class="arrow-right" />
      </div>
      <div v-else>暂无可用</div>
    </div>
  </div>
</template>
<script>
import { useOrder } from "@hooks/orderHooks";
import { useRecommendedCoupon } from "@hooks/payHooks";
import { useUserMerchantCoupon } from "@hooks/userHooks";
import { useNavigate } from "@hooks/commonHooks";
export default {
  setup() {
    let { userMerchantCoupons } = useUserMerchantCoupon();

    const { navigateTo } = useNavigate();
    const { setOrderInfo, orderInfo } = useOrder();
    const { recommendedCoupon, userAvailableMerchantCoupon } =
      useRecommendedCoupon();

    function goToSelectCoupon() {
      let merchantId = uni.getStorageSync("merchantId");
      navigateTo("ORDER/SELECT_COUPON", { merchantId });
    }
    return {
      navigateTo,
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
    .buy-coupon-reduce {
      .flex-simple(flex-start,center);
      .coupon-text {
        .flex-simple(flex-start,center);
        .box-size(unset,18px,#f25643);
        .normal-font(12px,white);
        padding: 0 4px;
        border-radius: 2px;
        .title-bg {
          .box-size(15px,15px,transparent);
          margin: 0 4px;
        }
        .text {
          .normal-font(12px,white);
        }
      }
      .reduce-text {
        .bold-font(17px,#f25643);
        margin-left: 12px;
        .symbol {
          .bold-font(11px,#f25643);
          display: inline-block;
        }
      }
    }
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
      .total-count {
        .flex-simple(flex-start, center);
        .box-size(unset,16px,#eb4b3a);
        .line-center(16px);
        .normal-font(12px,white);
        border: 1px solid rgba(227, 81, 63, 0.8);
        padding: 0 6px;
        .total-count-icon {
          .box-size(13px,12px,transparent);
          margin-right: 4px;
        }
      }
      .arrow-right {
        .box-size(12px,12px);
        margin-left: 4px;
      }
    }
  }
}
</style>