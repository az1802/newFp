<template>
  <div
    class="coupon-pay-wrapper"
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
          @click="goToSelectCoupon"
          v-if="minLeastCostCoupon && billFee >= minLeastCostCoupon.leastCost"
        >
          <div class="tooltip-text">
            <div class="price-text" v-if="selCoupon.id">
              -¥{{ minLeastCostCoupon.reduceCost / 100 }}
            </div>
            {{
              !selCoupon.id
                ? "有" + userMerchantCoupons.length + "张可用券"
                : "（已选择最佳优惠）"
            }}
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right.png"
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
              ¥{{ (billFee - minLeastCostCoupon.leastCost) / 100 }}
            </div>
            ，立减
            <div class="price-text">
              ¥{{ minLeastCostCoupon.reduceCost / 100 }}
            </div>
          </div>
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right.png"
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
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right.png"
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
            minMerchantLeastCostCoupon.availableFee > billFee
          "
        >
          <div class="tooltip-text">
            再消费
            <div class="price-text">
              ¥{{ (minMerchantLeastCostCoupon.availableFee - billFee) / 100 }}
            </div>
            ,立减
            <div class="price-text">
              ¥{{ minMerchantLeastCostCoupon.couponCost / 100 }}
            </div>
          </div>

          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/arrow-right.png"
            alt=""
            class="arrow-icon"
          />
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
        <div class="available-tag">
          满{{ minMerchantLeastCostCoupon.availableFee / 100 }}可用
        </div>
        <div class="left">
          <div class="count-and-price">
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
          <div class="sell-quantity">
            已售{{ minMerchantLeastCostCoupon.sellingQuantity }}张
          </div>
        </div>
        <div class="right">
          <div class="current-price">
            优惠价￥{{ minMerchantLeastCostCoupon.price / 100 }}
          </div>
          <div class="total-value">
            原价
            <div class="text">
              ￥{{ minMerchantLeastCostCoupon.totalPrice / 100 }}
            </div>
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
          <div class="text" click="viewRules">阅读并同意《付费券包协议》</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { watch, ref, unref, toRefs, computed, toRaw } from "vue";
import { navigateTo } from "@utils";
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
        //  券包营销开启,未达门槛时不能切换为券包支付
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
      height: 24px;
      min-width: 141px;
      .tooltip-text {
        .flex-simple(space-between,center);
        .normal-font(14px,rgba(27, 27, 33, 0.8));
        .price-text {
          .bold-font(14px,rgba(242, 86, 67, 1));
        }
      }
      .arrow-icon {
        .box-size(8px,11px,transparent);
        margin-left: 2px;
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
    padding: 0 5.01% 0 16.84%;
    background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/coupon-background.png")
      0 0/100% 100% no-repeat;
    .available-tag {
      .box-size(70px,16px);
      .line-center(16px);
      .normal-font(12px,rgba(121, 74, 7, 1));
      .pos-tr-absolute(0,0);
      background: linear-gradient(180deg, #ffc87b 0%, #fff1d5 100%);
      border-radius: 0px 12px 0px 30px;
      text-align: center;
    }
    .left {
      .flex-simple(flex-start,center);
      flex-direction: column;
      .line-center(53px);
      .count-and-price {
        .flex-simple(space-between,center);
        .line-center(33px);
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
      .sell-quantity {
        .line-center(20px);
        .normal-font(14px,rgba(121, 74, 7, 1));
      }
    }
    .right {
      .flex-simple(flex-start,flex-start);
      flex-direction: column;
      .current-price {
        .line-center(22px);
        .bold-font(16px,white);
      }
      .total-value {
        .line-center(22px);
        .normal-font(16px,white);
        font-family: "PingFangSC-Light";
        .text {
          display: inline-block;
          text-decoration: line-through;
          font-family: "PingFangSC-Light";
          color: white;
        }
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
      margin-right: 16px;
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