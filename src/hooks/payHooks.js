import { computed, ref, reactive, unref, toRaw, watch } from 'vue'
import { getDishInfoById, calcRecommendCoupon, calcRecommendFanpiao, calcUserAvailableMerchantCoupon } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";
import { wechatPay, aliPay, showToast } from '@utils';


async function commonPay(args) {
  let res = await API.Order.pay(args);
  if (!res?.transactionId) {
    return false;
  }
  return res;
}


export function usePay() {

  async function buyFanpiao(fanpiaoInfo, merchantId = uni.getStorageSync("merchantId")) {

    let data = {
      fanpiaoCategoryId: fanpiaoInfo.id,
      billFee: fanpiaoInfo.totalValue,
      paidFee: fanpiaoInfo.totalValue,
      merchantId: merchantId,
      transactionType: "FANPIAO_PURCHASE",
      payMethod: "WECHAT_PAY", // 'WALLET' //
    };
    // #ifdef MP-ALIPAY
    data.payMethod = "ALIPAY";
    // #endif
    let res = await commonPay(data);
    let payRes = false;;
    if (data.payMethod == "WECHAT_PAY") {
      payRes = await wechatPay(res.signData);
    } else if (data.payMethod == "ALIPAY") {
      payRes = await aliPay(res);
    }
    return payRes


  }
  async function buyFanpiaoAndPay() {

  }

  async function buyCoupon(merchantId, fanpiaoInfo) {
    let data = {
      fanpiaoCategoryId: fanpiaoInfo.id,
      billFee: fanpiaoInfo.totalValue,
      paidFee: fanpiaoInfo.totalValue,
      merchantId: merchantId,
      transactionType: "FANPIAO_PURCHASE",
      payMethod: "WECHAT_PAY", // 'WALLET' //
    };
    // #ifdef MP-ALIPAY
    data.payMethod = "ALIPAY";
    // #endif
    let res = await commonPay(data);
    let payRes = false;;
    if (data.payMethod == "WECHAT_PAY") {
      payRes = await wechatPay(res.signData);
    } else if (data.payMethod == "ALIPAY") {
      payRes = await aliPay(res);
    }
    return payRes
  }

  async function buyStoredVal(merchantId, storedInfo) {
    console.log('%cstoredInfo: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', storedInfo);
    let data = {
      rechargeCategoryId: storedInfo.id,
      billFee: storedInfo.amount,
      paidFee: storedInfo.sellPrice,
      merchantId: merchantId,
      transactionType: 'SHILAI_MEMBER_CARD_RECHARGE',
      payMethod: 'WECHAT_PAY' // 'WALLET' //
    }
    let res = await commonPay(data);
    let transactionId = res.transactionId || ''
    if (!transactionId) {
      await showToast('充值失败，请稍后再试')
      return
    }
    let payRes = await wechatPay(res.signData);
    return payRes
  }

  async function payOrder() {

  }


  return {
    buyFanpiao,
    buyFanpiaoAndPay,
    buyCoupon,
    payOrder,
    buyStoredVal

  }

}


export function useRecommendedCoupon() {
  const { couponList } = useState("merchant", ['couponList']);
  const { selectedDishesFinalTotalPrice } = useGetters('menu', ["selectedDishesFinalTotalPrice"]);
  const { userMerchantCoupons } = useState('user', ["userMerchantCoupons"])


  const recommendedCoupon = computed(() => {
    let calcRes = calcRecommendCoupon(toRaw(unref(couponList)), unref(selectedDishesFinalTotalPrice));
    return calcRes
  })
  const userAvailableMerchantCoupon = computed(() => {
    let calcRes = calcUserAvailableMerchantCoupon(toRaw(unref(userMerchantCoupons)), unref(selectedDishesFinalTotalPrice));
    return calcRes
  })

  return {
    recommendedCoupon,
    userAvailableMerchantCoupon,
    setDefaultSelCoupon
  }

}