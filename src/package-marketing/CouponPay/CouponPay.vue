<template>
  <div class="coupon-pay-wrapper" v-if="billFee != 0">
    <div
      v-if="
        userMerchantCoupons?.length > 0 ||
        (enableMarketing &&
          minMerchantLeastCostCoupon &&
          userMerchantCoupons.length == 0)
      "
      class="coupon-info-wrapper"
    >
      <div class="coupon-label">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-coupon-icon.png"
          alt=""
          class="icon"
        />
        <div class="text">特惠券包</div>
      </div>
      <div class="coupon-info">
        <div
          class="tooltip-wrapper"
          v-if="minLeastCostCoupon && billFee >= minLeastCostCoupon.leastCost"
        >
          <div class="price-text">
            -¥{{ minLeastCostCoupon.reduceCost / 100 }}
          </div>
          （已选择最佳优惠）
          <div class="arrow-icon">></div>
        </div>
        <div
          class="tooltip-wrapper"
          v-if="minLeastCostCoupon && billFee < minLeastCostCoupon.leastCost"
        >
          再消费
          <div class="price-text">
            ¥{{ (billFee - minLeastCostCoupon.leastCost) / 100 }}
          </div>
          ,立减
          <div class="price-text">
            ¥{{ minLeastCostCoupon.reduceCost / 100 }}
          </div>
          <div class="arrow-icon">></div>
        </div>

        <div
          class="tooltip-wrapper"
          v-if="
            !minLeastCostCoupon && minMerchantLeastCostCoupon && enableMarketing
          "
        >
          <div class="price-text">
            -¥{{ minMerchantLeastCostCoupon.couponCost / 100 }}
          </div>
          （已选择最佳优惠）
          <div class="arrow-icon">></div>
        </div>

        <div class="checked" @click="togglePayMethod">
          <img
            v-if="payMethod !== 'COUPON_PAY'"
            style="width: 24px; height: 24px"
            mode="scaleToFill"
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioNoChecked_1.svg"
          />
          <img
            v-else
            mode="scaleToFill"
            style="width: 24px; height: 24px"
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_1.svg"
            class="pay-img"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        enableMarketing &&
        minMerchantLeastCostCoupon &&
        userMerchantCoupons.length == 0
      "
      class="buy-coupon-info"
    >
      <div class="coupon-detail-wrapper">
        <div class="left">
          <div class="reduce-cost-price">
            {{ minMerchantLeastCostCoupon.couponCost / 100 }}
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/mul.png"
            alt=""
            class="mul-icon"
          />
          <div class="coupon-number">
            {{ minMerchantLeastCostCoupon.number }}
          </div>
        </div>
        <div class="right">
          <div class="total-value">
            价值{{ minMerchantLeastCostCoupon.totalPrice / 100 }}元
          </div>
          <div class="sell-quantity">
            已售{{ minMerchantLeastCostCoupon.sellingQuantity }}张
          </div>
        </div>
      </div>

      <div class="use-rules-wrapper">
        <div class="valid-days">
          有效期{{ minMerchantLeastCostCoupon.validDays }}天
        </div>
        <div class="view-rules">
          <div class="radio-wrapper" @click="toggleAgreeRules">
            <img
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-radio-checked.png"
              class="radio-box"
              v-if="isAgreeRules"
            />
            <img
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-radio-no-checked.png"
              class="radio-box"
              v-if="!isAgreeRules"
            />
          </div>
          <div class="text" click="navigateTo('OTHER/COUPON_ACCORD_TEXT')">
            阅读并同意《付费券包协议》
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { watch, ref, unref, toRefs, computed, toRaw } from "vue";
import { navigateTo } from "@utils";
export default {
  props: {
    enableMarketing: {
      type: Boolean,
      default: false,
    },
    buyCouponInfo: {
      type: Object,
      default: {},
    },
    userMerchantCoupons: {
      type: Array,
      default: [],
    },
    couponList: {
      type: Array,
      default: [],
    },
    billFee: {
      type: [Number, String],
      default: 0,
    },
    payMethod: {
      type: String,
      default: "",
    },
    selCoupon: {
      type: Object,
      default: {},
    },
    isBuyCoupon: {
      type: Boolean,
      default: false,
    },
    isAgreeRules: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    let {
      billFee,
      userMerchantCoupons,
      enableMarketing,
      couponList,
      payMethod,
      isAgreeRules,
    } = toRefs(props);

    let minLeastCostCoupon = computed(() => {
      let res = null;
      if (unref(userMerchantCoupons).length > 0) {
        unref(userMerchantCoupons).forEach((item) => {
          if (!res) {
            res = item;
          } else if (res && res.leastCost > item.leastCost) {
            res = item;
          }
        });
      }
      return res;
    });

    let minMerchantLeastCostCoupon = computed(() => {
      let res = null;
      if (
        unref(couponList).length > 0 &&
        unref(userMerchantCoupons).length == 0
      ) {
        unref(couponList).forEach((item) => {
          if (!res) {
            res = item;
          } else if (res && res.availableFee > item.availableFee) {
            res = item;
          }
        });
      }

      return res;
    });

    watch([billFee, payMethod], ([newBillFee, newPayMethod]) => {
      if (
        newPayMethod == "COUPON_PAY" &&
        unref(minLeastCostCoupon) &&
        unref(billFee) >= unref(minLeastCostCoupon).leastCost
      ) {
        emit("update:selCoupon", toRaw(unref(minLeastCostCoupon)));
      } else {
        emit("update:selCoupon", {});
      }

      if (
        newPayMethod == "COUPON_PAY" &&
        unref(minMerchantLeastCostCoupon) &&
        unref(billFee) >= unref(minMerchantLeastCostCoupon).availableFee
      ) {
        emit(
          "update:buyCouponInfo",
          toRaw(unref(minMerchantLeastCostCoupon)) || {}
        );
        emit("update:isBuyCoupon", true);
      } else {
        emit("update:buyCouponInfo", {});
        emit("update:isBuyCoupon", false);
      }
    });
    function togglePayMethod() {
      let newPayMethod =
        unref(payMethod) == "COUPON_PAY" ? "WECHAT_PAY" : "COUPON_PAY";
      emit("update:payMethod", newPayMethod);
    }

    function toggleAgreeRules() {
      emit("update:isAgreeRules", !unref(isAgreeRules));
    }

    return {
      minLeastCostCoupon,
      minMerchantLeastCostCoupon,
      togglePayMethod,
      toggleAgreeRules,
      navigateTo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.coupon-pay-wrapper {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  margin-top: 16px;
}
.coupon-info-wrapper {
  .flex-simple(space-between,center);
  .line-center(24px);
  .coupon-label {
    .flex-simple(flex-start,center);
    .icon {
      .box-size(20px,24px);
    }
    .text {
      .line-center(20px);
      margin-left: 4px;
      .normal-font(14px,rgba(0, 0, 0, 0.6));
    }
  }
  .coupon-info {
    .flex-simple(flex-start,center);
    .line-center(24px);
    .tooltip-wrapper {
      .flex-simple(flex-start,center);
      padding: 0 16px;
      background: linear-gradient(180deg, #ffc87b 0%, #fff1d5 100%);
      border-radius: 14px;
      .normal-font(14px,rgba(27, 27, 33, 0.8));
      .price-text {
        .normal-font(14px,rgba(242, 86, 67, 1));
      }
      .arrow-icon {
        font-size: 10px;
        color: rgba(27, 27, 33, 0.8);
      }
    }
    .checked {
      .box-size(24px,24px);
      margin-left: 12px;
    }
  }
}
.buy-coupon-info {
  margin: 10px 0 8px 0;

  .coupon-detail-wrapper {
    .box-size(calc(100% - 16px),100px,transparent);
    .flex-simple(space-between,center);
    padding: 0 7.88% 0 16.84%;
    background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/coupon-background.png")
      0 0/100% 100% no-repeat;
    .left {
      .flex-simple(flex-start,center);
      .reduce-cost-price {
        .bold-font(24px,rgba(242, 86, 67, 1));
        &:after {
          content: "元";
          font-size: 14px;
          margin-left: 2px;
        }
      }
      .mul-icon {
        .box-size(9px,9px);
        margin: 0 6px;
      }
      .coupon-number {
        .bold-font(24px,rgba(242, 86, 67, 1));
        &:after {
          content: "张";
          font-size: 14px;
          margin-left: 2px;
        }
      }
    }
    .right {
      .flex-simple(flex-start,center);
      flex-direction: column;
      .total-value {
        .line-center(22px);
        .bold-font(16px,rgba(255, 255, 255, 1));
      }
      .sell-quantity {
        .line-center(20px);
        .normal-font(14px,rgba(255, 255, 255, 0.8));
      }
    }
  }

  .use-rules-wrapper {
    .flex-simple(space-between,center);
    .line-center(14px);
    margin: 4px 0 12px 0;
    .valid-days {
      .normal-font(10px,rgba(0, 0, 0, 0.6));
    }
    .view-rules {
      .flex-simple(flex-start,center);
      .normal-font(10px,rgba(0, 0, 0, 0.6));
      .radio-wrapper {
        .flex-simple(flex-start,center);
        margin-right: 4px;
        .radio-box {
          .box-size(12px,12px);
        }
      }
    }
  }
}
</style>