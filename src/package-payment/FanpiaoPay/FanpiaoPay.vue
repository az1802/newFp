<template>
  <div class="fanpiao-pay-wrapper">
    <div class="fanpiao-pay-module" @click="toggleFanpiaoPayMethod">
      <div
        class="fanpiao-content-bg"
        :class="[payMethod == 'FANPIAO_PAY' ? 'active' : '']"
      >
        <div class="label">
          <img
            class="img"
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/shilai-icon.png"
            alt=""
          />
          <div class="text">饭票支付</div>
        </div>
        <div class="fanpiao-pay-right">
          <div class="balance-wrapper">
            <div class="text">余额</div>
            ¥{{ fanpiaoBalance / 100 }}
          </div>
          <div class="checked">
            <img
              v-if="payMethod !== 'FANPIAO_PAY'"
              class="img"
              mode="scaleToFill"
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioNoChecked_3.png"
            />
            <img
              v-else
              class="img"
              mode="scaleToFill"
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_3.png"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="fabpiao-list-wrapper"
      v-if="enableMarketing && recommendFanpiaoList.length > 0"
    >
      <div class="tooltip" v-if="!billFee && selFanpiao.id">
        <div class="text">请在上方输入消费金额</div>
      </div>
      <div class="tooltip" v-else-if="!billFee && !selFanpiao.id">
        购买饭票本单享受
        <div class="text">{{ minFanpiaoDiscount / 10 }}折</div>
      </div>
      <div class="tooltip" v-else-if="billFee && selFanpiao.id">
        本单折后低至
        <div class="text">{{ (billFee - discountFanpiaoPrice) / 100 }}</div>
        元
      </div>
      <div class="tooltip need-buy-fanpiao" v-else>余额不足，建议购买饭票</div>
      <scroll-view scroll-x class="fanpiao-list">
        <div
          class="fanpiao-item-wrapper"
          v-for="fanpiaoItem in recommendFanpiaoList"
          :key="fanpiaoItem.id"
          @click.stop="changeSelFanpiao(fanpiaoItem)"
        >
          <div
            class="fanpiao-item"
            :class="[selFanpiao.id == fanpiaoItem.id ? 'active' : '']"
          >
            <img
              v-if="selFanpiao.id == fanpiaoItem.id"
              class="check-tag"
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_3.png"
            />
            <div class="discount">
              整单享<span class="text">{{
                10 - fanpiaoItem.discount / 10
              }}</span
              >折
            </div>
            <div class="sell-price">
              {{ fanpiaoItem.totalValue / 100 }}
            </div>
            <div class="sell-count">
              已售{{ fanpiaoItem.sellingQuantity }}份
            </div>
          </div>
        </div>
      </scroll-view>
      <div
        class="rules"
        v-if="recommendFanpiaoList?.length > 0"
        @click="navigateTo('OTHER/FANPIAO_RULES')"
      >
        <div class="radio-wrapper" @click.stop="toggleAgreeRules">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_4.png"
            class="radio-box"
            v-if="isAgreeFanpiaoRules"
          />
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioNoChecked_3.png"
            class="radio-box"
            v-else
          />
        </div>
        <div class="text" click="viewRules">阅读并同意《购买饭票协议》</div>
      </div>
    </div>
  </div>
</template>
<script>
import { useFanpiaoInfo } from "@hooks/merchantHooks";
import { ref, computed, unref, toRefs } from "vue";
import { navigateTo, showToast, sleep } from "@utils";
export default {
  props: {
    enableMarketing: {
      type: Boolean,
      default: false,
    },
    needBuyFanpiao: {
      type: Boolean,
      default: false,
    },
    isAgreeFanpiaoRules: {
      type: Boolean,
      default: true,
    },
    selFanpiao: {
      type: Object,
      default: {},
    },
    fanpiaoBalance: {
      type: [Number, String],
      default: 0,
    },
    discountFanpiaoPrice: {
      type: [Number, String],
      default: 0,
    },
    payMethod: {
      type: String,
      default: "",
    },
    billFee: {
      type: [Number, String],
      default: 0,
    },
    recommendFanpiaoList: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    let { isAgreeFanpiaoRules } = toRefs(props);
    const { maxDiscountFanpiao } = useFanpiaoInfo();
    const fanpiaoMinPay = computed(() => {
      let discount;
      if (props.selFanpiao.id) {
        discount = props.selFanpiao.discount;
      } else {
        discount = unref(maxDiscountFanpiao).discount;
      }
      return Math.round(((100 - (discount || 0)) * (props.billFee || 0)) / 100);
    });
    const showBuyFanpiaoList = computed(() => {
      let {
        enableMarketing,
        recommendFanpiaoList,
        fanpiaoBalance,
        needBuyFanpiao,
      } = props;
      return (
        enableMarketing &&
        ((recommendFanpiaoList?.length > 0 && needBuyFanpiao) ||
          !fanpiaoBalance)
      );
    });

    function changeSelFanpiao(fanpiaoItem) {
      // console.log("fanpiaoItem: ", fanpiaoItem);
      let { fanpiaoBalance, recommendFanpiaoList, selFanpiao, billFee } = props;
      if (!billFee) {
        if (
          recommendFanpiaoList.length > 0 &&
          selFanpiao.id == fanpiaoItem.id
        ) {
          emit("update:payMethod", "WECHAT_PAY");
          emit("update:selFanpiao", {});
          return;
        } else {
          emit("update:payMethod", "FANPIAO_PAY");
          emit("update:selFanpiao", fanpiaoItem);
        }
      } else {
        if (
          !fanpiaoBalance &&
          recommendFanpiaoList.length > 0 &&
          selFanpiao.id == fanpiaoItem.id
        ) {
          emit("update:payMethod", "WECHAT_PAY");
          emit("update:selFanpiao", {});
          return;
        }
        emit("update:payMethod", "FANPIAO_PAY");
        emit("update:selFanpiao", fanpiaoItem);
      }
    }

    function toggleFanpiaoPayMethod() {
      let {
        enableMarketing,
        billFee,
        fanpiaoBalancePaidFee,
        fanpiaoBalance,
        selFanpiao,
        recommendFanpiaoList,
        payMethod,
      } = props;
      if (
        !enableMarketing &&
        billFee > fanpiaoBalancePaidFee &&
        fanpiaoBalance &&
        payMethod != "FANPIAO_PAY"
      ) {
        //饭票存在余额不存在营销时提示余额不足
        showToast("饭票余额不足,请重新输入金额");
        return;
      }

      let newPayMethod =
        payMethod == "FANPIAO_PAY" ? "WECHAT_PAY" : "FANPIAO_PAY";
      emit("update:payMethod", newPayMethod);

      if (!selFanpiao.id && recommendFanpiaoList.length > 0 && billFee) {
        //默认选择第一个
        emit("update:selFanpiao", recommendFanpiaoList[0]);
      } else if (selFanpiao.id && billFee > fanpiaoBalancePaidFee) {
        emit("update:selFanpiao", {});
      }
    }

    function toggleAgreeRules() {
      emit("update:isAgreeFanpiaoRules", !unref(isAgreeFanpiaoRules));
    }

    const minFanpiaoDiscount = computed(() => {
      let { recommendFanpiaoList } = props;

      let m = 0;
      recommendFanpiaoList?.forEach((item) => {
        if (item.discount > m) {
          m = item.discount;
        }
      });

      return 100 - m;
    });

    return {
      fanpiaoMinPay,
      changeSelFanpiao,
      toggleFanpiaoPayMethod,
      navigateTo,
      showBuyFanpiaoList,
      toggleAgreeRules,
      minFanpiaoDiscount,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.fanpiao-pay-wrapper {
  background: white;
  border-radius: 8px;
  padding: 0 17px;
  box-sizing: border-box;
}
.tooltip-wrapper {
  padding: 11px 0 7.5px;
  .text {
    .line-center(20px);
    .normal-font(14px,#1b1b21);
    .val {
      display: inline-block;
      .bold-font(14px,#F25643);
    }
  }
}

.fanpiao-pay-module {
  .box-size(100%,unset,transparent);
  display: flex;
  .fanpiao-content-bg {
    .box-size(100%,44px);
    .flex-simple(space-between,center);
    .label {
      .flex-simple(flex-start,center);
      .img {
        .box-size(16px,16px);
      }
      .text {
        .bold-font(14px,#333333);
        margin-left: 7.5px;
      }
    }
    .fanpiao-pay-right {
      .flex-simple(space-between,center);
      .balance-wrapper {
        .bold-font(14px,#333333);
        .text {
          .normal-font(14px,#333333);
          font-weight: 400;
          display: inline-block;
          margin-right: 6px;
        }
      }
      .checked {
        .box-size(16px,16px);
        display: inline-block;
        margin-left: 13.5px;
        .img {
          .box-size(16px,16px);
        }
      }
    }
  }
  .checked {
    .box-size(40px,100%);
    .flex-simple(flex-end,center);
    border-radius: 4px;
    line-height: 20px;
    align-self: center;
  }
}
.fabpiao-list-wrapper {
  border-top: 1px solid #ededed;
  .tooltip {
    .line-center(18.5px);
    .normal-font(13px,#333333);
    padding: 12px 0 4.5px 0;
    &.need-buy-fanpiao {
      color: #fe4a26;
    }
    .text {
      display: inline-block;
      color: #fe4a26;
    }
  }
  .fanpiao-list {
    max-height: 107px;
    white-space: nowrap;
    .fanpiao-item-wrapper {
      .box-size(98px,107px,white);
      display: inline-flex;
      margin-right: 7px;
      margin-top: 3.5px;
      .fanpiao-item {
        .box-size(100%,103.5px,#f8f8f8);
        .flex-simple(flex-start,center);
        display: inline-flex;
        flex-direction: column;
        background: url(https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-item-bg_2.png)
          100% 100%/100% 100% no-repeat;
        position: relative;
        border: 1px solid transparent;
        border-radius: 7px;
        &.active {
          border: 1px solid #23b815;
        }
        .check-tag {
          .pos-tr-absolute(-3.5px,-3.5px);
          .box-size(16px,16px);
          z-index: 100;
        }
        .discount {
          .line-center(16.5px);
          .bold-font(12px,#B06D0B);
          margin-top: 8.5px;
          .text {
            display: inline-block;
            color: #fe4a26;
          }
        }
        .sell-price {
          .line-center(18px);
          .bold-font(22px,#FE4A26);
          margin-top: 6.5px;
          .price-symbol(14px,#FE4A26);
        }
        .sell-count {
          .line-center(14px);
          .bold-font(10px,#CD8620);
          margin-top: 7.5px;
        }
      }
    }
  }
  .rules {
    .flex-simple(flex-start,center);
    .normal-font(11px,#999999);
    padding: 11.5px 0 13.5px;
    .radio-wrapper {
      .flex-simple(flex-start,center);
      margin-right: 4px;
      .radio-box {
        .box-size(12px,12px);
      }
    }
  }
}
</style>