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
        <div
          class="fanpiao-input-tooltip"
          @click="toggleFanpiaoPayMethod"
          v-if="billFee && recommendFanpiaoList.length > 0"
        >
          <div class="split-line"></div>
          <div class="price-info-wrapper">
            <div
              class="unuse-fanpiao"
              v-if="recommendFanpiaoList.length > 0 && !selFanpiao.id"
            >
              点我享{{ (100 - recommendFanpiaoList[0].discount) / 10 }}折 >
            </div>
            <div class="use-fanpiao" v-else>饭票价</div>
            <div class="price-info">
              <div class="fanpiao-price">{{ fanpiaoMarketPrice }}</div>
              <div class="origin-price">¥{{ billFee / 100 }}</div>
            </div>
          </div>
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
        :fanpiaoList="allFanpiaoList"
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
      isPaying = ref(false),
      fanpiaoMarketPrice = ref(0),
      allFanpiaoList = ref([]);

    onBeforeMount(async () => {
      await signUp();
      let res = await requestMerchantInfo(merchantId);
      // 请求商户的饭票余额和用户券包
      requestUserMerchantFanpiaoBalance(merchantId);
      requestFanpiaoBalancePaidFee(merchantId);
      let userCoupons = await requestUserMerchantCoupons(merchantId);
      setSelCoupon(userCoupons[0] || {});

      if (res.enableNumberPlatePayWithFanpiao) {
        requestFanpiaoList(merchantId).then((fanpiaoList) => {
          recommendFanpiaoList.value = fanpiaoList;
          allFanpiaoList.value = fanpiaoList;
        });
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

    async function calcFanpiaoMarketPirce(newBillFee, newSelFanpiao) {
      if (unref(fanpiaoBalancePaidFee) >= newBillFee && newBillFee != "") {
        //饭票足够支付 不显示饭票价
        // console.log("饭票余额足够");
        // let calcRes = await calcFanpiaoPaidBill(merchantId, newBillFee);
        // fanpiaoMarketPrice.value = (calcRes?.paidFee || 0) / 100;
      } else if (unref(recommendFanpiaoList).length > 0 && !newSelFanpiao.id) {
        let fanpiaoInfo = unref(recommendFanpiaoList)[0];
        let res = parseFloat(
          (newBillFee * (1 - fanpiaoInfo.discount / 100)) / 100
        ).toFixed(2);
        fanpiaoMarketPrice.value = res;
      } else if (newSelFanpiao.id) {
        let { discount = 0, sellPrice, totalValue, id } = newSelFanpiao;
        let fanpiaoPaidBalanceTemp = parseFloat(
          Math.round(
            totalValue -
              (newBillFee - unref(fanpiaoBalancePaidFee)) * (1 - discount / 100)
          )
        );

        fanpiaoMarketPrice.value = parseFloat(
          (unref(userMerchantFanpiaoBalance) +
            (totalValue || 0) -
            fanpiaoPaidBalanceTemp) /
            100
        ).toFixed(2);
      } else {
        fanpiaoMarketPrice.value = 0;
      }
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
        if (newBillFee) {
          calcFanpiaoMarketPirce(newBillFee, newSelFanpiao);
        }

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

    function toggleFanpiaoPayMethod() {
      if (!billFee.value) {
        return;
      }
      payMethod.value = "FANPIAO_PAY";
      if (recommendFanpiaoList.value.length > 0) {
        selFanpiao.value = recommendFanpiaoList.value[0];
      }
    }

    return {
      statusBarHeight,
      couponList,
      allFanpiaoList,
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
      fanpiaoMarketPrice,
      toggleFanpiaoPayMethod,
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
    .box-size(100%,82px,white);
    padding: 14px 17px 0 17px;
    margin: 12px auto 12px auto;
    border-radius: 8px;
    border: 1px solid #ffa951;
    position: relative;
    .title {
      .line-center(14px);
      .normal-font(14px,#FE5941);
      margin-bottom: 7px;
    }
    .fanpiao-input-tooltip {
      .pos-tr-absolute(13.5px,0);
      .box-size(50%,53px);
      padding: 0 0 0 30px;
      z-index: 1000;
      .split-line {
        .box-size(1px,41px,#FFA951);
        .pos-tl-absolute(7.5px,0);
      }
      .unuse-fanpiao,
      .use-fanpiao {
        display: inline-block;
        .line-center(23px);
        border-radius: 50px;
        background-image: linear-gradient(90deg, #fe7e3b 0%, #fc5318 90%);
        padding: 0 10px;
        .bold-font(12px,#FFF4F2);
      }
      .price-info-wrapper {
        .price-info {
          .flex-simple(flex-start,center);
          margin-top: 5.5px;
          height: 24px;
          .fanpiao-price {
            .line-center(24px);
            .bold-font(22px,#FF5544);
            letter-spacing: 0;
            margin-right: 7px;
            &::before {
              content: "¥";
              font-size: 17px;
              margin-right: 5px;
            }
          }
          .origin-price {
            .line-center(24px);
            .bold-font(14px,#B9B9B9);
            letter-spacing: 0;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
</style>