import { computed, ref, reactive, unref, toRaw, watch } from 'vue'
import { getDishInfoById, calcRecommendCoupon, calcRecommendFanpiao, calcUserAvailableMerchantCoupon, navigateTo } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import { useUserLogin } from '@hooks/userHooks'
import API from "@api";
import { wechatPay, aliPay, showToast, sleep } from '@utils';

async function getTransactionId(args) {
  let res = await API.Order.pay(args);
  if (!res?.transactionId) {
    return false;
  }
  return res;
}

async function commonPay(data) {
  let res = await getTransactionId(data);
  if (res) {
    let payRes = false;
    if (data.payMethod == "WECHAT_PAY") {
      payRes = await wechatPay(res.signData);
    } else if (data.payMethod == "ALIPAY") {
      payRes = await aliPay(res);
    }
    return payRes;
  }
}

export function usePay() {

  async function payOrder() {

  }

  return {
    payOrder,
    commonPay,
  }
}

export function useStorePay() {
  async function buyStoredVal(merchantId, storedInfo) {
    let data = {
      rechargeCategoryId: storedInfo.id,
      billFee: storedInfo.amount,
      paidFee: storedInfo.sellPrice,
      merchantId: merchantId,
      transactionType: 'SHILAI_MEMBER_CARD_RECHARGE',
      payMethod: 'WECHAT_PAY' // 'WALLET' //
    }
    let payRes = await commonPay(data);
    if (!payRes) {
      await showToast('充值失败，请稍后再试')
    }
    return payRes
  }
  return {
    buyStoredVal,
  }
}

export function useCouponPay() {

  async function buyCoupon(merchantId, fanpiaoInfo) {
    if (!uni.getStorageSync('userId')) { navigateTo("MENU/LOGIN"); return };
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
    let payRes = await commonPay(data);
    return payRes
  }
  async function buyCouponAndPay(orderInfo) {
    let { isAgreeCouponAccord, selCouponId } = orderInfo;
    if (!isAgreeCouponAccord) {
      showToast("请阅读并同意《付费券包协议》");
      return;
    }

    const {
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
      selectedDishesFinalTotalPrice,
    } = useState("menu", ["selectedDishesTotalPrice", "selectedDishesDiscountPrice", "selectedDishesFinalTotalPrice"]);
    const { recommendedCoupon } = useRecommendedCoupon();
    const { createOrder } = useOrder();

    let orderId = await createOrder();
    if (!orderId) {
      return;
    }
    let data = {
      billFee: unref(selectedDishesFinalTotalPrice) + (unref(recommendedCoupon)?.price || 0),
      couponPackageId: selCouponId,
      isInvoice: false,
      merchantId: uni.getStorageSync("merchantId"),
      noDiscountBillFee: unref(selectedDishesDiscountPrice),
      orderId,
      paidFee: unref(selectedDishesFinalTotalPrice) + (unref(recommendedCoupon)?.price || 0) - (unref(recommendedCoupon).couponCost || 0),
      payMethod: "WECHAT_PAY",
      transactionType: "SELF_DISH_ORDER_PAYMENT",
    }
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
  return {
    buyCoupon,
    buyCouponAndPay,
  }

}

export function useFanpiaoPay() {
  async function buyFanpiao(fanpiaoInfo, merchantId = uni.getStorageSync("merchantId")) {
    if (!uni.getStorageSync('userId')) { navigateTo("MENU/LOGIN"); return };
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
    let payRes = await commonPay(data);
    return payRes

  }
  async function buyFanpiaoAndPay() {

  }
  return {
    buyFanpiao,
    buyFanpiaoAndPay,
  }
}

export function useRecommendedCoupon() {
  const { couponList } = useState("merchant", ['couponList']);
  const { selectedDishesFinalTotalPrice } = useGetters('menu', ["selectedDishesFinalTotalPrice"]);
  const { userMerchantCoupons } = useState('user', ["userMerchantCoupons"]);
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
  }
}


export function useDirectPay(payMethod, params) {


  async function directPay(params) {
    let payRes = false;
    let res = await API.Order.pay(params);
    console.log('%cres: ', 'color: MidnightBlue; background: Aquamarine; font-size: 20px;', res);
    if (params.payMethod == "WECHAT_PAY") {
      payRes = await wechatPay(res.signData);
    } else if (params.payMethod == "FANPIAO_PAY") {

      console.log(res)
      if (res.errcode != 0) {
        showToast(res.errmsg);
        return false;
      }
      payRes = true;
    }
    await showToast(payRes ? "买单成功" : "买单失败，请重试");
    await sleep(2000);

    return payRes;
  }




  return {
    directPay
  }
}
