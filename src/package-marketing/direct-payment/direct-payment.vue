<template>
  <div class="pay-bill">
    <div class="head-info">
      <div :style="{ height: statusBarHeight + 'px' }"></div>
      <div class="merchant-info">
        <img :src="merchantInfo.logoUrl" alt="" class="img" />
        <div class="name">{{ merchantInfo.name }}</div>
      </div>
    </div>

    <div class="amount-wrapper">
      <div class="title">
        消费金额<span class="iconfont icon-Delete"></span>
      </div>
      <FxAmountInput
        @change="amountChange"
        @confirm="confirmPay"
        :actuallyPaid="
          payMethod == 'FANPIAO_PAY' ? fanpiaoActuallyPaid : actuallyPaid
        "
        :fanpiaoMoney="fanpiaoPayAndFanpiaoBalance"
        :selCoupon="selCoupon"
        :buyCouponInfo="buyCouponInfo"
      />
      <FanpiaoPay
        :billFee="billFee"
        v-model:payMethod="payMethod"
        v-model:selFanpiao="selFanpiao"
        :enableMarketing="merchantInfo.enableNumberPlatePayWithFanpiao"
        :recommendFanpiaoList="recommendFanpiaoList"
        :needBuyFanpiao="needBuyFanpiao"
        :fanpiaoBalance="userMerchantFanpiaoBalance"
      />
      <CouponPay
        :billFee="billFee"
        v-model:payMethod="payMethod"
        v-model:selCoupon="selCoupon"
        v-model:isBuyCoupon="isBuyCoupon"
        v-model:buyCouponInfo="buyCouponInfo"
        :enableMarketing="merchantInfo.enableNumberPlatePayWithCouponPackage"
        :userMerchantCoupons="userMerchantCoupons"
        :couponList="couponList"
        v-model:isAgreeRules="isAgreeRules"
        :merchantId="merchantInfo.merchantId"
      />
    </div>
  </div>
</template>
<script>
import FxAmountInput from "../FxAmountInput/FxAmountinput.vue";
import FanpiaoPay from "../FanpiaoPay/FanpiaoPay.vue";
import CouponPay from "../CouponPay/CouponPay.vue";
import {
  useUserLogin,
  useUserMerchantFanpiaoBalance,
  useUserMerchantCoupon,
} from "@hooks/userHooks";
import {
  useMerchantInfo,
  useFanpiaoInfo,
  useCouponInfo,
} from "@hooks/merchantHooks";
import { useDirectPay } from "@hooks/payHooks";
import { useSystemInfo, useNavigate } from "@hooks/commonHooks";
import { useDirectPaySelCoupon } from "@hooks/directPayHooks";
import { calcRecommendFanpiao, showToast, sleep, switchTab } from "@utils";

import { onBeforeMount, ref, unref, computed, watchEffect, watch } from "vue";
let merchantId;
export default {
  components: { FxAmountInput, FanpiaoPay, CouponPay },
  async onLoad(opts) {
    merchantId =
      opts.merchantId || opts.scene || "8ec573585d9645229fb01713e30a2a6d";
  },
  setup() {
    let { statusBarHeight } = useSystemInfo();
    const { signUp } = useUserLogin();
    const { merchantInfo, requestMerchantInfo } = useMerchantInfo();
    const { fanpiaoList, requestFanpiaoList } = useFanpiaoInfo();
    const { couponList, requestCouponList } = useCouponInfo();
    const { directPay } = useDirectPay();
    const { selCoupon } = useDirectPaySelCoupon();
    const {
      userMerchantFanpiaoBalance,
      requestUserMerchantFanpiaoBalance,
      requestFanpiaoBalancePaidFee,
      fanpiaoBalancePaidFee,
      calcFanpiaoPaidBill,
    } = useUserMerchantFanpiaoBalance();
    const { userMerchantCoupons, requestUserMerchantCoupons } =
      useUserMerchantCoupon();

    const billFee = ref(""),
      selFanpiao = ref({}),
      payMethod = ref("WECHAT_PAY"),
      needBuyFanpiao = ref(false),
      recommendFanpiaoList = ref([]),
      fanpiaoPayAndFanpiaoBalance = ref(0),
      fanpiaoActuallyPaid = ref(0),
      needBuyCoupon = ref(false),
      buyCouponInfo = ref({}),
      isBuyCoupon = ref(false),
      isAgreeRules = ref(true);

    onBeforeMount(async () => {
      await signUp();
      let res = await requestMerchantInfo(merchantId);
      // 请求商户的饭票余额和用户券包
      requestUserMerchantFanpiaoBalance(merchantId);
      requestFanpiaoBalancePaidFee(merchantId);
      requestUserMerchantCoupons(merchantId);

      if (res.enableNumberPlatePayWithFanpiao) {
        requestFanpiaoList(merchantId);
      }
      if (res.enableNumberPlatePayWithCouponPackage) {
        requestCouponList(merchantId);
      }
    });

    function amountChange(val) {
      billFee.value = (val || 0) * 100;
    }

    watch(billFee, (newBillFee) => {
      //开启饭票营销且余额不足时
      if (
        unref(fanpiaoBalancePaidFee) < newBillFee &&
        newBillFee != "" &&
        unref(merchantInfo).enableNumberPlatePayWithFanpiao
      ) {
        let calcRes = calcRecommendFanpiao(
          unref(fanpiaoList),
          newBillFee,
          unref(fanpiaoBalancePaidFee)
        );
        needBuyFanpiao.value = true;
        recommendFanpiaoList.value = calcRes;
        if (calcRes.findIndex((item) => item.id == selFanpiao.id) !== -1) {
          //当金额变化导致之前选择推荐饭票不符合时自动推荐第一张饭票
          selFanpiao.value = recommendFanpiaoList.value[0] || {};
        }
      } else {
        recommendFanpiaoList.value = [];
        needBuyFanpiao.value = false;
        (selFanpiao.value = {}), (fanpiaoActuallyPaid.value = 0);
        fanpiaoPayAndFanpiaoBalance.value = 0;
      }

      // 有券包只计算合适的券包
      if (unref(userMerchantCoupons).length > 0) {
      }
      // 没有券包则只计算推荐的券包
    });

    let minLeastCostCoupon = watch(
      [billFee, selFanpiao, payMethod],
      async ([newBillFee, newSelFanpiao, newPayMethod]) => {
        if (newPayMethod !== "FANPIAO_PAY") {
          fanpiaoActuallyPaid.value = 0;
          fanpiaoPayAndFanpiaoBalance.value = 0;
          return;
        }
        if (!newSelFanpiao.id) {
          if (unref(fanpiaoBalancePaidFee) >= newBillFee && newBillFee != "") {
            //饭票足够支付
            let calcRes = await calcFanpiaoPaidBill(merchantId, unref(billFee));
            fanpiaoActuallyPaid.value = calcRes.paidFee;
            fanpiaoPayAndFanpiaoBalance.value = Math.round(
              unref(userMerchantFanpiaoBalance) - (calcRes?.paidFee || 0)
            );
          } else {
            //  金额过大不存在相关饭票
            fanpiaoActuallyPaid.value = newBillFee || 0;
            fanpiaoPayAndFanpiaoBalance.value = 0;
          }
        } else {
          let { discount = 0, sellPrice, totalValue, id } = newSelFanpiao;
          fanpiaoActuallyPaid.value = sellPrice;
          fanpiaoPayAndFanpiaoBalance.value = parseFloat(
            Math.round(
              totalValue -
                (unref(billFee) - unref(fanpiaoBalancePaidFee)) *
                  (1 - discount / 100)
            )
          );
        }
      }
    );

    const actuallyPaid = computed(() => {
      if (unref(payMethod) == "WECHAT_PAY") {
        //考虑使用券包的情况
        return unref(billFee) || 0;
      } else if (unref(payMethod) == "COUPON_PAY") {
        if (unref(isBuyCoupon)) {
          let { price = 0, couponCost = 0 } = unref(buyCouponInfo);
          return (unref(billFee) || 0) - couponCost + price;
        } else if (unref(selCoupon)?.id) {
          let { reduceCost, leastCost } = unref(selCoupon);
          return (unref(billFee) || 0) < leastCost
            ? unref(billFee) || 0
            : unref(billFee) - reduceCost;
        } else {
          return unref(billFee) || 0;
        }
      }
    });

    async function confirmPay() {
      let reg1 = /(^[0-9]{1,6}$)|(^[0-9]{1,6}[\.]{1}[0-9]{1,2}$)/;
      if (!reg1.test((unref(billFee) || 0) / 100)) {
        await showToast("请输入正确的金额，最小单位为分");
        return;
      }

      let pm = unref(payMethod);
      let payRes,
        params = {
          billFee: unref(billFee),
          merchantId,
          paidFee: unref(billFee),
          payMethod: "WECHAT_PAY",
          transactionType: "DIRECT_PAY",
        };
      if (pm == "FANPIAO_PAY") {
        if (unref(needBuyFanpiao) && unref(selFanpiao)?.id) {
          let { id, sellPrice } = unref(selFanpiao);
          params.fanpiaoCategoryId = id;
          params.paidFee = sellPrice;
          params.billFee = sellPrice;
          params.transactionType = "FANPIAO_PURCHASE";
          params.otherActions = [
            {
              DIRECT_PAY_WITH_FANPIAO_PURCHASE: {
                billFee: unref(billFee),
                paidFee: unref(billFee),
                merchantId: merchantId,
                transactionType: "DIRECT_PAY",
                payMethod: "FANPIAO_PAY", // 'WALLET' //
              },
            },
          ];
        } else {
          params.payMethod = "FANPIAO_PAY";
          params.paidFee = unref(fanpiaoActuallyPaid);
        }
      } else if (pm == "COUPON_PAY") {
        let par;
        if (unref(selCoupon)?.id) {
          let { id, reduceCost = 0 } = unref(selCoupon);
          params.couponId = id;
          params.paidFee = unref(billFee) - reduceCost;
        } else if (unref(isBuyCoupon) && unref(buyCouponInfo)?.id) {
          if (!unref(isAgreeRules)) {
            showToast("请阅读并同意《付费券包协议》");
            return;
          }
          let { id, couponCost = 0, price = 0 } = unref(buyCouponInfo);
          params.couponPackageId = id;
          params.paidFee = unref(billFee) - couponCost + price;
          params.transactionType = "DIRECT_PAY_WITH_COUPON_PACKAGE_PURCHASE";
        }
      }
      payRes = await directPay(params);
      if (payRes) {
        switchTab("/pages/order/order");
      }
    }

    return {
      statusBarHeight,
      couponList,
      recommendFanpiaoList,
      needBuyFanpiao,
      merchantInfo,
      amountChange,
      confirmPay,
      payMethod,
      selFanpiao,
      billFee,
      userMerchantFanpiaoBalance,
      actuallyPaid,
      fanpiaoPayAndFanpiaoBalance,
      fanpiaoActuallyPaid,
      userMerchantCoupons,
      isBuyCoupon,
      selCoupon,
      isAgreeRules,
      buyCouponInfo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-bill {
  .box-size(100vw,unset,white);
  min-height: 100vh;
  position: relative;
  .head-info {
    height: 200px;
    background: linear-gradient(
      180deg,
      #f25643 0%,
      #ef663f 62%,
      rgba(235, 123, 58, 0.16) 100%
    );
    backdrop-filter: blur(10px);
    .merchant-info {
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .img {
        height: 24px;
        width: 24px;
        border-radius: 100%;
        margin: 0 8px 0 16px;
      }
      .name {
        font-size: 17px;
        color: white;
        font-weight: bold;
      }
    }
  }
  .amount-wrapper {
    position: absolute;
    top: 104px;
    left: 16px;
    right: 16px;
    min-height: 330px;
    background: white;
    border-radius: 24px;
    padding: 0 32px;
    z-index: 100;
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    .title {
      .line-center(20px);
      padding: 24px 0 16px 0;
      .normal-font(14px,rgba(0,0,0,0.6));
    }
  }
}
</style>