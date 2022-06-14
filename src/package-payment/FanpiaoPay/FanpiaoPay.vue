<template>
  <div
    class="fanpiao-pay-wrapper"
    :class="[recommendFanpiaoList.length > 0 ? '' : 'no-marketing']"
  >
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
      <div class="tooltip">
        <div class="text">限时抢购饭票</div>
        <div class="time-wrapper">
          <div class="text">距结束</div>
          <FanpiaoTimeCounter :isShowHour="false" />
        </div>
      </div>
      <!-- <div class="tooltip" v-if="!billFee && selFanpiao.id">
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
      <div class="tooltip need-buy-fanpiao" v-else>余额不足，建议购买饭票</div> -->
      <scroll-view scroll-x class="fanpiao-list">
        <div
          class="fanpiao-item-wrapper"
          v-for="(fanpiaoItem, index) in recommendFanpiaoList"
          :key="fanpiaoItem.id"
          @click.stop="changeSelFanpiao(fanpiaoItem)"
        >
          <div
            class="fanpiao-item"
            :class="[selFanpiao.id == fanpiaoItem.id ? 'active' : '']"
          >
            <img
              class="fanpiao-icon-a"
              v-if="fanpiaoList[0] && fanpiaoList[0].id === fanpiaoItem.id"
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-tag_a.png"
            />
            <img
              class="fanpiao-icon-b"
              v-if="fanpiaoList[1] && fanpiaoList[1].id === fanpiaoItem.id"
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-tag_b.png"
            />

            <img
              v-if="selFanpiao.id == fanpiaoItem.id"
              class="check-tag"
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/couponRadioChecked_3.png"
            />
            <div class="discount">
              买单享<span class="text">{{
                10 - fanpiaoItem.discount / 10
              }}</span
              >折
            </div>
            <div class="sell-price">
              {{ fanpiaoItem.totalValue / 100 }}
            </div>
            <div class="sell-count">
              立省{{
                parseFloat(
                  (parseFloat(
                    fanpiaoItem.totalValue / (1 - fanpiaoItem.discount / 100)
                  ).toFixed(0) -
                    fanpiaoItem.totalValue) /
                    100
                ).toFixed(1)
              }}元
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
    fanpiaoList: {
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
  // padding: 0 17px;
  box-sizing: border-box;
  overflow: hidden;
  border: 1px solid rgba(255, 169, 81, 0.6);
  &.no-marketing {
    border: 1px solid white;
    .fanpiao-pay-module {
      padding-bottom: 0px;
      background: white;
      border: 1px solid transparent;
    }
  }
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
  padding: 0 13px 7px 13px;
  background: linear-gradient(90deg, #ffe5aa 7%, #ffedc2 97%);
  .fanpiao-content-bg {
    .box-size(100%,42px,transparent);
    .flex-simple(space-between,center);
    .label {
      .flex-simple(flex-start,center);
      .img {
        .box-size(16px,16px,transparent);
      }
      .text {
        .bold-font(14px,#32312c);
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
        .box-size(16px,16px,transparent);
        display: inline-block;
        margin-left: 13.5px;
        .img {
          .box-size(16px,16px,transparent);
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
  // border-top: 1px solid #ededed;
  margin-top: -7px;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  padding: 0 13px;
  background: white;
  .tooltip {
    .line-center(18.5px);
    .normal-font(13px,#333333);
    padding: 11px 0 11px 0;
    .flex-simple(space-between,center);
    .time-wrapper {
      .flex-simple(flex-start,center);
      .text {
        .line-center(18.5px);
        .normal-font(12px,#333333);
        margin-right: 4px;
      }
    }
    // &.need-buy-fanpiao {
    //   color: #fe4a26;
    // }
    // .text {
    //   display: inline-block;
    //   color: #fe4a26;
    // }
  }
  .fanpiao-list {
    max-height: 148px;
    box-sizing: border-box;
    white-space: nowrap;
    .fanpiao-item-wrapper {
      .box-size(108px,148px,white);
      display: inline-flex;
      margin-right: 10px;
      padding-top: 12px;
      // margin-top: 3.5px;
      .fanpiao-item {
        .box-size(108px,136px,#f8f8f8);
        .flex-simple(flex-start,center);
        display: inline-flex;
        flex-direction: column;
        background: url(https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/directPayment/fanpiao-item-bg_3.png)
          100% 100%/100% 100% no-repeat;
        position: relative;
        border-radius: 8px;
        border: 1px solid rgba(246, 116, 15, 0.2);
        &.active {
          border: 1px solid #32ce24;
        }
        .fanpiao-icon-a {
          .pos-tl-absolute(-9.5px,0px);
          .box-size(49px,19px,transparent);
        }
        .fanpiao-icon-b {
          .pos-tl-absolute(-9.5px,0px);
          .box-size(59px,19px,transparent);
        }
        .check-tag {
          .pos-tr-absolute(-1px,-1px);
          .box-size(16px,16px,transparent);
          z-index: 100;
        }
        .discount {
          .line-center(20px);
          .normal-font(14px,#333333);
          margin-top: 16.5px;
          .text {
            display: inline-block;
            .bold-font(14px,#fe4a26);
          }
        }
        .sell-price {
          .line-center(18px);
          .bold-font(24px,#fe4a26);
          margin-top: 12px;
          .price-symbol(17px,#fe4a26);
        }
        .sell-count {
          .line-center(15px);
          .bold-font(11px,#000000);
          margin-top: 12.5px;
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