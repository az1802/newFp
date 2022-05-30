<template>
  <div class="pay-bill">
    <div class="head-info">
      <div
        class="head-placeholder"
        :style="{ height: statusBarHeight + 'px' }"
      ></div>
      <div class="merchant-info">
        <img :src="merchantInfo.logoUrl" alt="" class="img" />
        <div class="name">{{ merchantInfo.name }}</div>
      </div>
    </div>
    <div class="page-content">
      <div class="amount-wrapper">
        <div class="title">
          消费金额<span class="iconfont icon-Delete"></span>
        </div>
        <FxAmountInput
          @change="amountChange"
          @confirm="confirmPay"
          :isPaying="isPaying"
          :actuallyPaid="
            payMethod == 'FANPIAO_PAY' ? fanpiaoActuallyPaid : actuallyPaid
          "
          :fanpiaoMoney="fanpiaoPayAndFanpiaoBalance"
          :selCoupon="selCoupon"
          :showCouponReducest="
            payMethod == 'COUPON_PAY' &&
            selCoupon &&
            selCoupon.leastCost <= billFee
          "
          :buyCouponInfo="buyCouponInfo"
          :discountPrice="discountPrice"
          placeholder="请输入消费金额"
        />
      </div>
      <FanpiaoPay
        :billFee="billFee"
        :discountFanpiaoPrice="discountPrice"
        v-model:payMethod="payMethod"
        v-model:selFanpiao="selFanpiao"
        :enableMarketing="merchantInfo.enableNumberPlatePayWithFanpiao"
        :recommendFanpiaoList="recommendFanpiaoList"
        :needBuyFanpiao="needBuyFanpiao"
        :fanpiaoBalance="userMerchantFanpiaoBalance"
        :fanpiaoBalancePaidFee="fanpiaoBalancePaidFee"
        v-model:isAgreeFanpiaoRules="isAgreeFanpiaoRules"
      />
      <CouponPay
        :billFee="billFee"
        v-model:payMethod="payMethod"
        v-model:selCoupon="selCoupon"
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
import {
  calcRecommendFanpiao,
  showToast,
  sleep,
  switchTab,
  parseQrcodeParams,
} from "@utils";

import { onBeforeMount, ref, unref, computed, watchEffect, watch } from "vue";
let merchantId;
export default {
  components: { FxAmountInput, FanpiaoPay, CouponPay },
  async onLoad(opts) {
    merchantId = opts.merchantId || opts.scene;
    let parseRes = parseQrcodeParams(opts.q);
    if (parseRes.scene || parseRes.merchantId) {
      merchantId = parseRes.scene || parseRes.merchantId;
    }
  },
  setup() {
    let { statusBarHeight } = useSystemInfo();
    const { signUp } = useUserLogin();
    const { merchantInfo, requestMerchantInfo } = useMerchantInfo();
    const { fanpiaoList, requestFanpiaoList } = useFanpiaoInfo();
    const { couponList, requestCouponList } = useCouponInfo();
    const { directPay } = useDirectPay();
    const { selCoupon, setSelCoupon } = useDirectPaySelCoupon();
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
      isAgreeRules = ref(true),
      isAgreeFanpiaoRules = ref(true),
      isPaying = ref(false);

    onBeforeMount(async () => {
      await signUp();
      let res = await requestMerchantInfo(merchantId);
      // 请求商户的饭票余额和用户券包
      requestUserMerchantFanpiaoBalance(merchantId);
      requestFanpiaoBalancePaidFee(merchantId);
      let userCoupons = await requestUserMerchantCoupons(merchantId);
      setSelCoupon(userCoupons[0] || {});

      if (res.enableNumberPlatePayWithFanpiao) {
        requestFanpiaoList(merchantId).then(
          (fanpiaoList) => (recommendFanpiaoList.value = fanpiaoList)
        );
      }
      if (res.enableNumberPlatePayWithCouponPackage) {
        let couponList = await requestCouponList(merchantId);
        if (userCoupons.length == 0) {
          buyCouponInfo.value = couponList[0];
        }
      }
    });

    function amountChange(val) {
      billFee.value = (val || 0) * 100;
    }

    watch([billFee, payMethod], (newVal) => {
      let [newBillFee, newPayMethod] = newVal;

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
        if (unref(selFanpiao).id) {
          if (
            calcRes.findIndex((item) => item.id == unref(selFanpiao).id) === -1
          ) {
            //当金额变化导致之前选择推荐饭票不符合时自动推荐第一张饭票
            selFanpiao.value = recommendFanpiaoList.value[0] || {};
          }
        }
      } else if (!newBillFee) {
        recommendFanpiaoList.value = unref(fanpiaoList);
        // selFanpiao.value = {};
        needBuyFanpiao.value = false;
        fanpiaoActuallyPaid.value = 0;
        fanpiaoPayAndFanpiaoBalance.value = 0;
      } else {
        recommendFanpiaoList.value = [];
        needBuyFanpiao.value = false;
        selFanpiao.value = {};
        fanpiaoActuallyPaid.value = 0;
        fanpiaoPayAndFanpiaoBalance.value = 0;
      }
    });

    watch(
      [billFee, selFanpiao, payMethod],
      async ([newBillFee, newSelFanpiao, newPayMethod]) => {
        if (newPayMethod !== "FANPIAO_PAY" || !newBillFee) {
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

    watch(payMethod, (newPayMethod) => {
      if (newPayMethod != "FANPIAO_PAY") {
        needBuyFanpiao.value = false;
        selFanpiao.value = {};
      }
    });
    const actuallyPaid = computed(() => {
      if (unref(payMethod) == "WECHAT_PAY") {
        //考虑使用券包的情况
        return unref(billFee) || 0;
      } else if (unref(payMethod) == "COUPON_PAY") {
        if (unref(buyCouponInfo)?.id) {
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
      if (unref(isPaying)) {
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
      //#ifdef MP-ALIPAY
      params.payMethod = "ALIPAY";
      //#endif
      if (pm == "FANPIAO_PAY") {
        if (unref(needBuyFanpiao) && unref(selFanpiao)?.id) {
          if (!unref(isAgreeFanpiaoRules)) {
            showToast("请阅读并同意《购买饭票协议》");
            return;
          }
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
        if (unref(selCoupon)?.id) {
          let { id, reduceCost = 0 } = unref(selCoupon);
          params.couponId = id;
          params.paidFee = unref(billFee) - reduceCost;
        } else if (unref(buyCouponInfo)?.id) {
          if (!unref(isAgreeRules)) {
            showToast("请阅读并同意《付费券包协议》");
            return;
          }
          let { id, couponCost = 0, price = 0 } = unref(buyCouponInfo);
          params.couponPackageId = id;
          params.billFee = unref(billFee) + price;
          params.paidFee = unref(billFee) - couponCost + price;
          params.transactionType = "DIRECT_PAY_WITH_COUPON_PACKAGE_PURCHASE";
        }
      }
      isPaying.value = true;
      payRes = await directPay(params);
      isPaying.value = false;
      if (payRes) {
        switchTab("/pages/order/order");
      }
    }

    const discountPrice = computed(() => {
      if (unref(billFee) == 0) {
        return 0;
      }
      if (unref(payMethod) == "FANPIAO_PAY") {
        if (!unref(needBuyFanpiao)) {
          return (
            unref(billFee) -
            (unref(userMerchantFanpiaoBalance) -
              unref(fanpiaoPayAndFanpiaoBalance))
          );
        } else if (unref(needBuyFanpiao) && unref(selFanpiao).id) {
          return (
            unref(billFee) -
            (unref(userMerchantFanpiaoBalance) +
              (unref(selFanpiao).totalValue || 0) -
              unref(fanpiaoPayAndFanpiaoBalance))
          );
        } else {
          return 0;
        }
      } else if (unref(payMethod) == "COUPON_PAY") {
        let { reduceCost = 0, id, leastCost } = unref(selCoupon);
        if (unref(buyCouponInfo) && unref(buyCouponInfo).id) {
          return unref(buyCouponInfo).couponCost;
        } else if (id && reduceCost) {
          return reduceCost;
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    });

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
      selCoupon,
      isAgreeRules,
      isAgreeFanpiaoRules,
      buyCouponInfo,
      fanpiaoBalancePaidFee,
      isPaying,
      discountPrice,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-bill {
  .box-size(100vw,unset,#F5F5F5);
  min-height: 100vh;
  position: relative;
  .page-content {
    .box-size(100%,unset,F5F5F5);
    padding: 0 17px;
  }
  .head-info {
    .head-placeholder {
      background: white;
    }
    .merchant-info {
      height: 44px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      .img {
        height: 24px;
        width: 24px;
        border-radius: 100%;
        margin: 0 8px 0 16px;
        background: #f5f5f5;
      }
      .name {
        font-size: 17px;
        color: #03081a;
        font-weight: bold;
      }
    }
  }
  .amount-wrapper {
    .box-size(100%,94px,white);
    padding: 18.5px 17px 0 17px;
    margin: 12px auto 12px auto;
    border-radius: 8px;
    border: 1px solid #ffa951;
    .title {
      .line-center(14px);
      .normal-font(14px,#F68B1C);
      margin-bottom: 14.5px;
    }
  }
}
</style>