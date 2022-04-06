import { computed, ref, reactive, unref } from 'vue'
import { getDishInfoById } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import API from "@api";
import { wechatPay, aliPay } from '@utils';


async function commonPay(args) {
  let res = await API.Order.pay(args);
  if (!res?.transactionId) {
    return false;
  }
  return res;
}


export function usePay() {

  async function buyFanpiao(merchantId, fanpiaoInfo) {
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

  async function payOrder() {

  }


  return {
    buyFanpiao,
    buyFanpiaoAndPay,
    buyCoupon,
    payOrder

  }

}
