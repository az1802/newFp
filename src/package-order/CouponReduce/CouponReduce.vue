<template>
  <div
    class="coupon-reduce-wrapper"
    v-if="userMerchantCoupons.length > 0 && showUseCoupon"
  >
    <div class="use-coupon">
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
        <div v-else-if="userMerchantCoupons.length > 0" class="no-coupon-text">
          暂无可用
          <img src="@assets/arrow-right1.png" alt="" class="icon-coupon" />
        </div>
        <div v-else class="no-coupon-text">暂无可用</div>
      </div>
    </div>

    <div
      v-if="
        orderInfo.payType !== 'PAY_LATER' &&
        userMerchantCoupons.length > 0 &&
        selectedDishesTotalPrice < availableUseCoupon.leastCost
      "
      class="merge-wrapper"
    >
      <div class="left-wrapper">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-warn-grey.png"
          alt=""
          class="icon"
        />
        <div>
          <p class="desc">
            还差<span class="high-light"
              >{{
                (availableUseCoupon.leastCost - selectedDishesTotalPrice) / 100
              }}元</span
            >解锁特惠券包功能
          </p>
          <p class="desc">
            用券后本单<span class="high-light"
              >再减{{ availableUseCoupon.reduceCost / 100 }}元</span
            >
          </p>
        </div>
      </div>
      <div class="right-wrapper" @click="navigateBack">
        <p class="content">去凑单</p>
        <img
          src="@assets/arrow-right1.png"
          alt=""
          class="arrow-right arrow-right1"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { useOrder } from "@hooks/orderHooks";
import { useRecommendedCoupon } from "@hooks/payHooks";
import { useUserMerchantCoupon } from "@hooks/userHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useDish } from "@hooks/menuHooks";
import { computed, ref, unref } from "vue";
import { navigateBack } from "@utils";
export default {
  props: {
    showUseCoupon: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let { userMerchantCoupons } = useUserMerchantCoupon();

    const { navigateTo } = useNavigate();
    const { setOrderInfo, orderInfo } = useOrder();
    const { recommendedCoupon, userAvailableMerchantCoupon } =
      useRecommendedCoupon();
    const {
      selectedDishes,
      selectedDishesTotalQuantity,
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
    } = useDish();

    function goToSelectCoupon() {
      let merchantId = uni.getStorageSync("merchantId");
      navigateTo("ORDER/SELECT_COUPON", {
        merchantId,
        from: "createOrder",
      });
    }
    const availableUseCoupon = computed(() => {
      let res = null;
      unref(userMerchantCoupons).forEach((item) => {
        if (item.leastCost < res || res === null) {
          res = item;
        }
      });
      return res;
    });

    return {
      navigateTo,
      userMerchantCoupons,
      orderInfo,
      recommendedCoupon,
      userAvailableMerchantCoupon,
      goToSelectCoupon,
      availableUseCoupon,
      selectedDishesTotalPrice,
      navigateBack,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.coupon-reduce-wrapper {
  margin-bottom: 10px;
  .use-coupon {
    .flex-simple(space-between,center);
    .line-center(18px);
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
          text-align: center;
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
      .no-coupon-text {
        .normal-font(14px,#999);
        .icon-coupon {
          display: inline-block;
          .box-size(12px,12px);
          margin-left: 4px;
        }
      }
    }
  }
  .merge-wrapper {
    .flex-simple(space-between,fkex-start);
    padding: 10px 0;
    margin-bottom: -20px;
    .left-wrapper {
      display: flex;
      .icon {
        .box-size(19px,19px);
        align-self: center;
      }
      .desc {
        line-height: 20px;
        font-size: 14px;
        .high-light {
          color: #f25643;
        }
      }
    }
    .right-wrapper {
      display: flex;
      align-items: center;
      margin-left: 50px;
      .content {
        .normal-font(14px,#f25643);
        white-space: nowrap;
      }
      .arrow-right {
        .box-size(12px,12px);
        margin-left: 4px;
      }
    }
  }
}
</style>