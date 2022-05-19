<template>
  <div
    class="coupon-pay-wrapper"
    :class="[enableFanpiaoMarketing ? 'border-top-1px' : '']"
    v-if="
      billFee != 0 &&
      (userMerchantCoupons.length > 0 ||
        (couponList.length > 0 && enableMarketing))
    "
  >
    <div
      v-if="
        userMerchantCoupons.length > 0 ||
        (enableMarketing &&
          minMerchantLeastCostCoupon &&
          userMerchantCoupons.length == 0)
      "
      class="coupon-info-wrapper"
      @click="togglePayMethod"
    >
      <div class="coupon-label">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-coupon-icon_2.png"
          alt=""
          class="icon"
        />
        <div class="text">特惠券包</div>
      </div>
      <div class="coupon-info">
        <div
          class="tooltip-wrapper"
          @click.stop="goToSelectCoupon"
          v-if="minLeastCostCoupon && billFee >= minLeastCostCoupon.leastCost"
        >
          <div class="tooltip-text">
            <div class="price-text" v-if="selCoupon.id">
              -¥{{ minLeastCostCoupon.reduceCost / 100 }}
            </div>
            {{
              !selCoupon.id
                ? "有" + userMerchantCoupons.length + "张可用券"
                : "已选最佳优惠"
            }}
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right_2.png"
            alt=""
            class="arrow-icon"
          />
        </div>

        <div
          class="tooltip-wrapper"
          v-if="minLeastCostCoupon && billFee < minLeastCostCoupon.leastCost"
        >
          <div class="tooltip-text">
            再消费
            <div class="price-text">
              ¥{{
                Number(
                  (minLeastCostCoupon &&
                    minLeastCostCoupon.leastCost - billFee) / 100
                ).toFixed(2)
              }}
            </div>
            ,立减
            <div class="price-text">
              ¥{{ minLeastCostCoupon.reduceCost / 100 }}
            </div>
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right_2.png"
            alt=""
            class="arrow-icon"
          />
        </div>

        <div
          class="tooltip-wrapper buy-coupon"
          v-if="
            !minLeastCostCoupon &&
            minMerchantLeastCostCoupon &&
            enableMarketing &&
            minMerchantLeastCostCoupon.availableFee <= billFee
          "
        >
          <div class="tooltip-text">
            <div class="price-text">
              -¥{{ minMerchantLeastCostCoupon.couponCost / 100 }}
            </div>
            （本单可减{{ minMerchantLeastCostCoupon.couponCost / 100 }}元）
          </div>
        </div>

        <div
          class="tooltip-wrapper buy-coupon"
          v-if="
            !minLeastCostCoupon &&
            minMerchantLeastCostCoupon &&
            enableMarketing &&
            minMerchantLeastCostCoupon.availableFee > billFee
          "
        >
          <div class="tooltip-text">
            再消费
            <div class="price-text">
              ¥{{
                Number(
                  (minMerchantLeastCostCoupon &&
                    minMerchantLeastCostCoupon.availableFee - billFee) / 100
                ).toFixed(2)
              }}
            </div>
            ,立减
            <div class="price-text">
              ¥{{ minMerchantLeastCostCoupon.couponCost / 100 }}
            </div>
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right_2.png"
            alt=""
            class="arrow-icon"
          />
        </div>

        <div class="checked">
          <img
            v-if="payMethod !== 'COUPON_PAY'"
            style="width: 16px; height: 16px"
            mode="scaleToFill"
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioNoChecked_3.png"
          />
          <img
            v-else
            mode="scaleToFill"
            style="width: 16px; height: 16px"
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_3.png"
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
      <div
        class="coupon-detail-wrapper"
        :class="[payMethod == 'COUPON_PAY' ? 'active' : '']"
        @click="togglePayMethod"
      >
        <img
          v-if="payMethod == 'COUPON_PAY'"
          class="check-tag"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_3.png"
        />
        <div class="sell-count">
          已售{{ minMerchantLeastCostCoupon.sellingQuantity }}张
        </div>
        <div class="left">
          <div class="reduce-cost-price">
            {{ minMerchantLeastCostCoupon.couponCost / 100 }}
          </div>
          <div class="mul">&times;</div>
          <div class="coupon-number">
            {{ minMerchantLeastCostCoupon.number }}
          </div>
        </div>
        <div class="use-condition">
          满{{ minMerchantLeastCostCoupon.availableFee / 100 }}元可用 | 有效期{{
            minMerchantLeastCostCoupon.validDays
          }}天
        </div>
        <div class="right">
          <div class="origin-price">
            原价￥{{ minMerchantLeastCostCoupon.totalPrice / 100 }}
          </div>
          <div class="sell-price">
            {{ minMerchantLeastCostCoupon.price / 100 }}
          </div>
        </div>
      </div>

      <div class="use-rules-wrapper">
        <div class="view-rules">
          <div class="radio-wrapper" @click="toggleAgreeRules">
            <img
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_4.png"
              class="radio-box"
              v-if="isAgreeRules"
            />
            <img
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioNoChecked_3.png"
              class="radio-box"
              v-if="!isAgreeRules"
            />
          </div>
          <div class="text" click="viewRules">阅读并同意《付费券包协议》</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { watch, ref, unref, toRefs, computed, toRaw } from "vue";
import { navigateTo, showToast } from "@utils";
import { useDirectPaySelCoupon } from "@hooks/directPayHooks";
export default {
  props: {
    merchantId: {
      type: String,
      default: "",
    },
    enableMarketing: {
      type: Boolean,
      default: false,
    },
    enableFanpiaoMarketing: {
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
      merchantId,
    } = toRefs(props);
    const { selCoupon, setSelCoupon, autoSelCoupon } = useDirectPaySelCoupon();
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
        unref(billFee) >= unref(minLeastCostCoupon).leastCost &&
        !unref(selCoupon).id &&
        unref(autoSelCoupon)
      ) {
        // setSelCoupon(toRaw(unref(minLeastCostCoupon)));
        // emit("update:selCoupon", toRaw(unref(minLeastCostCoupon)));
      } else {
        // setSelCoupon({});
        // emit("update:selCoupon", {});
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
      } else {
        emit("update:buyCouponInfo", {});
      }

      if (
        (unref(minMerchantLeastCostCoupon) &&
          newBillFee < unref(minMerchantLeastCostCoupon).availableFee) ||
        (unref(minLeastCostCoupon) &&
          newBillFee < unref(minLeastCostCoupon).leastCost)
      ) {
        // 此处不能自动切换为微信支付会影响饭票余额支付的选择
        newPayMethod != "FANPIAO_PAY" && emit("update:payMethod", "WECHAT_PAY");
      }
    });
    function togglePayMethod() {
      let pm = unref(payMethod);
      if (
        (unref(minMerchantLeastCostCoupon) &&
          unref(billFee) < unref(minMerchantLeastCostCoupon).availableFee) ||
        (unref(minLeastCostCoupon) &&
          unref(billFee) < unref(minLeastCostCoupon).leastCost)
      ) {
        console.log("未达到门槛");
        let minCost =
          (unref(minMerchantLeastCostCoupon) &&
            unref(minMerchantLeastCostCoupon).availableFee) ||
          (unref(minLeastCostCoupon) && unref(minLeastCostCoupon).leastCost);
        //  券包营销开启,未达门槛时不能切换为券包支付
        showToast(`满${minCost / 100}元可用`);
        return;
      }

      emit(
        "update:payMethod",
        pm == "COUPON_PAY" ? "WECHAT_PAY" : "COUPON_PAY"
      );
    }

    function toggleAgreeRules() {
      emit("update:isAgreeRules", !unref(isAgreeRules));
    }

    function goToSelectCoupon() {
      if (unref(payMethod) != "COUPON_PAY") {
        return;
      }
      navigateTo("ORDER/SELECT_COUPON", {
        merchantId: unref(merchantId),
        billFee: unref(billFee),
        from: "directPay",
      });
    }

    return {
      minLeastCostCoupon,
      minMerchantLeastCostCoupon,
      togglePayMethod,
      toggleAgreeRules,
      navigateTo,
      goToSelectCoupon,
      selCoupon,
      toggleBuyCoupon() {
        if (unref(payMethod) == "COUPON_PAY") {
          emit("update:payMethod", "WECHAT_PAY");
        } else {
          emit("update:payMethod", "COUPON_PAY");
        }
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.coupon-pay-wrapper {
  background: white;
  border-radius: 8px;
  padding: 0px 17px;
  margin-top: 10px;
}
.coupon-info-wrapper {
  .flex-simple(space-between,center);
  .line-center(18px);
  padding: 13px 0px;
  &.border-bottpm-1px {
    border-bottom: 0.5px solid #ededed;
  }
  .coupon-label {
    .flex-simple(flex-start,center);
    .icon {
      .box-size(18px,18px);
    }
    .text {
      .line-center(20px);
      margin-left: 6px;
      .bold-font(14px,#333333);
    }
  }
  .coupon-info {
    .flex-simple(flex-start,center);
    .line-center(24px);
    .tooltip-wrapper {
      .flex-simple(flex-start,center);
      padding: 0 8px;
      background: #ffeeeb;
      border-radius: 9px;
      height: 18px;
      .tooltip-text {
        .flex-simple(space-between,center);
        .normal-font(11px,#333333);
        .price-text {
          .bold-font(11px,#FE4A26);
          margin-right: 4px;
        }
      }
      .arrow-icon {
        .box-size(10px,10px,transparent);
        margin-left: 4px;
      }
    }
    .checked {
      .box-size(16px,16px);
      margin-left: 13.5px;
      line-height: 16px;
    }
  }
}
.buy-coupon-info {
  padding: 10px 0 8px;

  .coupon-detail-wrapper {
    .box-size(268px,80px,white);
    .flex-simple(space-between,center);
    position: relative;
    background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/coupon-background_2.png")
      0 0/100% 100% no-repeat;
    border: 1px solid transparent;
    border-radius: 7px;
    &.active {
      border: 1px solid #23b815;
    }
    .check-tag {
      .pos-tr-absolute(-3.5px,-3.5px);
      .box-size(16px,16px,transparent);
      z-index: 100;
    }
    .sell-count {
      .pos-tl-absolute(0,0);
      .box-size(67px,18px,transparent);
      border-radius: 8px 8px 8px 0;
      .line-center(18px);
      .normal-font(10px,#63460b);
      text-align: center;
    }
    .use-condition {
      .pos-bl-absolute(5.5px,13.7px);
      .line-center(14px);
      .normal-font(10px,#999999);
    }
    .left {
      width: 189px;
      margin-bottom: 7.5px;
      .flex-simple(center,flex-end);
      height: 25px;
      .reduce-cost-price {
        .bold-font(24px,#333);
        .line-center(24px);
        &:after {
          content: "元";
          .normal-font(12px,#333);
          margin-left: 4px;
        }
      }
      .mul {
        font-size: 12px;
        margin: 0 4px;
        align-self: center;
      }
      .coupon-number {
        .bold-font(24px,#333);
        .line-center(24px);
        &:after {
          content: "张";
          .normal-font(12px,#333);
          margin-left: 4px;
        }
      }
    }
    .right {
      .flex-simple(flex-start,flex-start);
      flex-direction: column;
      align-self: flex-start;
      width: 71px;
      .origin-price {
        .normal-font(11px,white);
        .line-center(11px);
        opacity: 0.7;
        text-decoration: line-through;
        margin-top: 10px;
      }
      .sell-price {
        .line-center(18px);
        .bold-font(23px,white);
        .price-symbol(15px,white,normal);
        margin-top: 6px;
      }
    }
  }
  .use-rules-wrapper {
    .flex-simple(space-between,center);
    .line-center(15px);
    margin-top: 9px;
    .view-rules {
      .flex-simple(flex-start,center);
      .normal-font(11px,#999999);
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