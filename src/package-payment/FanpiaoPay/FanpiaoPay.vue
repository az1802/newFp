<template>
  <div class="fanpiao-pay-wrapper">
    <div
      class="tooltip-wrapper"
      v-if="
        !fanpiaoBalance && recommendFanpiaoList?.length > 0 && enableMarketing
      "
    >
      <div class="text" v-if="!selFanpiao.id">
        饭票价低至
        <div class="val">{{ fanpiaoMinPay / 100 }}</div>
        元
      </div>
      <div class="text" v-else>
        享饭票价
        <div class="val">{{ fanpiaoMinPay / 100 }}</div>
        元
      </div>
    </div>
    <div
      class="fanpiao-pay-module"
      v-if="fanpiaoBalance"
      @click="toggleFanpiaoPayMethod"
    >
      <div
        class="fanpiao-content-bg"
        :class="[payMethod == 'FANPIAO_PAY' ? 'active' : '']"
      >
        <div class="text-box">
          <div class="balance-text">
            饭票(余额:￥{{ fanpiaoBalance / 100 }})
          </div>
          <div class="tooltip-text">饭票支付，本单可享立减</div>
        </div>
        <div class="tag">时来钱包</div>
      </div>
      <div class="checked">
        <img
          v-if="payMethod !== 'FANPIAO_PAY'"
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

    <div
      class="fabpiao-list-wrapper"
      v-if="
        enableMarketing &&
        ((recommendFanpiaoList?.length > 0 && needBuyFanpiao) ||
          !fanpiaoBalance)
      "
    >
      <div
        class="explain-text"
        v-if="!fanpiaoBalance && recommendFanpiaoList?.length > 0"
      >
        <img
          class="min-radio-checked"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-radio-checked.png"
          alt=""
          style="margin-left: 0px"
        />资金保障
        <img
          class="min-radio-checked"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-radio-checked.png"
          alt=""
        />全天可用
        <img
          class="min-radio-checked"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/min-radio-checked.png"
          alt=""
        />有效期一年
      </div>
      <div
        class="need-buy-tooltip"
        v-if="fanpiaoBalance && recommendFanpiaoList?.length > 0"
      >
        余额不足，建议购买饭票
      </div>
      <scroll-view scroll-y class="fanpiao-list">
        <div
          class="fanpiao-item"
          :class="[selFanpiao.id == fanpiaoItem.id ? 'active' : '']"
          v-for="fanpiaoItem in recommendFanpiaoList"
          :key="fanpiaoItem.id"
          @click="changeSelFanpiao(fanpiaoItem)"
        >
          <div class="tag">限时抢购</div>
          <div class="left">
            <div class="discount">
              全单享<span class="val">{{ 10 - fanpiaoItem.discount / 10 }}</span
              >折
            </div>
            <div class="sell-count">
              已售{{ fanpiaoItem.sellingQuantity }}份
            </div>
          </div>
          <div class="sell-price">
            <div class="text">{{ fanpiaoItem.sellPrice / 100 }}</div>
          </div>
        </div>
      </scroll-view>
      <div
        v-if="recommendFanpiaoList?.length > 0"
        class="rules"
        @click="navigateTo('OTHER/FANPIAO_RULES')"
      >
        查看购买须知>
      </div>
    </div>
  </div>
</template>
<script>
import { useFanpiaoInfo } from "@hooks/merchantHooks";
import { ref, computed, unref } from "vue";
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
    selFanpiao: {
      type: Object,
      default: {},
    },
    fanpiaoBalance: {
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

    function changeSelFanpiao(fanpiaoItem) {
      let { fanpiaoBalance, recommendFanpiaoList, selFanpiao } = props;
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

      if (!selFanpiao.id && recommendFanpiaoList.length > 0) {
        //默认选择第一个
        emit("update:selFanpiao", recommendFanpiaoList[0]);
      } else if (selFanpiao.id && billFee > fanpiaoBalancePaidFee) {
        emit("update:selFanpiao", {});
      }
    }
    return {
      fanpiaoMinPay,
      changeSelFanpiao,
      toggleFanpiaoPayMethod,
      navigateTo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.tooltip-wrapper {
  margin: 10px 0;
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
  .box-size(100%,60px,transparent);
  display: flex;
  margin: 12px 0 16px 0;
  .fanpiao-content-bg {
    .box-size(calc(100% - 40px),100%);
    .flex-simple(center,center);
    position: relative;
    background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-pay-bg_02.png")
      0 0/100% 100% no-repeat;
    &.active {
      background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-pay-bg-active.png")
        0 0/100% 100% no-repeat;
      .text-box .balance-text,
      .text-box .tooltip-text,
      .tag {
        color: white;
      }
    }
    .tag {
      .box-size(43px,13px);
      .line-center(13px);
      .pos-tl-absolute(0,0);
      .normal-font(8px,#FFE1AD);
      background: linear-gradient(180deg, #f25643 0%, #eb7b3a 100%);
      border-radius: 4px 0px 4px 0px;
      text-align: center;
    }
    .text-box {
      text-align: left;
      .balance-text {
        .normal-font(16px,rgba(0,0,0,0.8));
      }
      .tooltip-text {
        .normal-font(10px,#794a07);
        margin-top: 4px;
      }
    }
  }
  .checked {
    .box-size(40px,100%);
    .flex-simple(flex-end,center);
    border-radius: 4px;
  }
}
.fabpiao-list-wrapper {
  .explain-text {
    .normal-font(10px,rgba(0,0,0,0.6));
    .line-center(14px);
    .min-radio-checked {
      .box-size(12px,12px,transparent);
      display: inline-block;
      vertical-align: middle;
      margin: 0 4px 0 8px;
    }
    margin-bottom: 8px;
  }
  .need-buy-tooltip {
    .line-center(20px);
    .normal-font(14px,rgba(27, 27, 33, 0.8));
    margin-bottom: 8px;
  }
  .fanpiao-list {
    max-height: 149px;
    .fanpiao-item {
      .box-size(calc(50% - 8px),65px);
      display: inline-flex;
      background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-pay-bg.png")
        0 0/100% 100% no-repeat;
      border-radius: 6px;
      overflow: hidden;
      position: relative;
      margin-bottom: 16px;
      &.active {
        background: url("https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-item-bg-active.png")
          0 0/100% 100% no-repeat;
        .tag,
        .left .discount,
        .left .discount .val,
        .left .sell-count {
          color: rgba(255, 255, 255, 0.8);
        }
        .sell-price .text {
          color: rgba(255, 255, 255, 0.8);
          .price-symbol(10px,rgba(255, 255, 255, 0.8));
        }
      }
      &:nth-child(even) {
        margin-left: 16px;
      }
      &:nth-last-child(1),
      &:nth-last-child(2) {
        margin-bottom: 0px;
      }

      .tag {
        border-radius: 6px 0 6px 0;
        .pos-tl-absolute(0,0);
        .line-center(13px);
        .box-size(43px,13px);
        background: linear-gradient(180deg, #f25643 0%, #eb7b3a 100%);
        text-align: center;
        opacity: 0.8;
        .normal-font(8px,#FFE1AD);
      }
      .left {
        display: inline-flex;
        width: 70%;
        .flex-simple(center,center);
        flex-direction: column;
        .discount {
          .line-center(20px);
          .bold-font(14px,rgba(0,0,0,0.8));
          .val {
            .bold-font(14px,#f25643);
          }
        }
        .sell-count {
          .line-center(14px);
          .bold-font(10px,#794a07);
        }
      }
      .sell-price {
        display: inline-flex;
        width: 30%;
        .flex-simple(center,center);
        .text {
          .bold-font(16px,#F25643);
          .price-symbol(10px);
        }
      }
    }
  }
  .rules {
    .normal-font(10px,rgba(27, 27, 33, 0.6));
    .line-center(12px);
    margin-top: 8px;
    text-align: right;
    margin-bottom: 26px;
  }
}
</style>