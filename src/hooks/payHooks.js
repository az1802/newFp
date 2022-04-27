import { computed, ref, reactive, unref, toRaw, watch } from 'vue'
import { getDishInfoById, calcRecommendCoupon, calcRecommendFanpiao, calcUserAvailableMerchantCoupon, navigateTo } from "@utils";
import { useState, useGetters, useMutations } from "@hooks/storeHooks";
import { useUserLogin, useUserInfo } from '@hooks/userHooks'
import { useDish } from '@hooks/menuHooks';
import API from "@api";
import { wechatPay, aliPay, showToast, sleep } from '@utils';
import { zip } from 'lodash';

async function getTransactionId(args) {
  let res = await API.Order.pay(args);
  if (!res?.transactionId) {
    if (res.errmsg) {
      await showToast(res.errmsg, "none", 2000);
      await sleep(2000)
    }
    return false;
  }
  return res;
}

async function commonPay(data) {
  let res = await getTransactionId(data);
  if (res) {
    let payRes = true;
    if (data.payMethod == "WECHAT_PAY") {
      payRes = await wechatPay(res.signData);
    } else if (data.payMethod == "ALIPAY") {
      payRes = await aliPay(res);
    }
    if (payRes) {
      return res;
    } else {
      return false;
    }
  }

  return false;

}


export function usePay() {


  return {
    commonPay
  }
}
export function usePayOrder() {

  // const { userInfo } = useUserInfo()


  async function buyFanpiaoAndPay(fanpiaoInfo, orderInfo) {
    let payMethod = 'WECHAT_PAY';
    // #ifdef MP-ALIPAY
    payMethod = 'ALIPAY' //支付宝支付方式调整
    // #endif
    let data = {
      fanpiaoCategoryId: fanpiaoInfo.id,
      billFee: fanpiaoInfo.sellPrice,
      paidFee: fanpiaoInfo.sellPrice,
      merchantId: orderInfo.merchantId,
      transactionType: 'FANPIAO_PURCHASE',
      orderId: orderInfo.orderId,
      payMethod: payMethod// 'WALLET' //
    };

    let payRes = await commonPay(data);

    return payRes;
  }

  async function buyRechargeAndPay(rechargeInfo, orderInfo) { //只支持微信支付
    let payMethod = 'WECHAT_PAY';
    let data = {
      rechargeCategoryId: rechargeInfo.id,
      billFee: rechargeInfo.amount,
      paidFee: rechargeInfo.sellPrice,
      merchantId: orderInfo.merchantId,
      transactionType: 'SHILAI_MEMBER_CARD_RECHARGE',
      payMethod: payMethod // 'WALLET' //
    };
    let payRes = await commonPay(data);
    return payRes;
  }

  async function payOrder(payMethod, orderInfo, userWallet) {
    let params = {
      merchantId: orderInfo.merchantId,
      orderId: orderInfo.orderId,
      billFee: orderInfo.billFee,
      paidFee: orderInfo.paidFee,
      noDiscountBillFee: orderInfo.noDiscountBillFee || 0,
      transactionType: orderInfo.transactionType,
      payMethod: payMethod,
      isInvoice: orderInfo.isInvoice || false,
      isFromGroup: orderInfo.isWechatGroupActivity || false,
    }

    // TODO 外卖菜品打包费

    //使用券包
    if (orderInfo.selCouponId && payMethod !== 'FANPIAO_PAY' && payMethod !== 'SHILAI_MEMBER_CARD_PAY') {
      params.couponId = orderInfo.selCouponId
    }



    if (payMethod == "FANPIAO_PAY") {
      let { fanpiaoRemainPaidFee, selFanpiaoId, selFanpiaoInfo, fanpiaoPaidFee } = orderInfo.orderFanpiaoPayInfo;
      if (fanpiaoRemainPaidFee) {
        if (!selFanpiaoId) {
          showToast('饭票余额不足，购买下列饭票即享优惠');
        } else {
          let res = await buyFanpiaoAndPay(selFanpiaoInfo, orderInfo);
          showToast(res ? "购买成功" : "购买失败,请稍后重试");
          return res;
        }
        return;
      } else { //饭票直接支付
        params.paidFee = fanpiaoPaidFee
      }
      params.transactionType = "SELF_DISH_ORDER_PAYMENT";
    } else if (payMethod === 'SHILAI_MEMBER_CARD_PAY') {
      params.transactionType = "SELF_DISH_ORDER_PAYMENT";
      let { selRechargeInfo } = orderInfo.orderRechargeInfo
      if (orderInfo.billFee <= userWallet.memberCardBalance) {//直接使用储值支付

      } else {
        if (selRechargeInfo && selRechargeInfo.id) {
          let res = await buyRechargeAndPay(selRechargeInfo, orderInfo);
          showToast(res ? "购买成功" : "购买失败,请稍后重试");
        } else {
          showToast('储值余额不足');
        }
        return;
      }
    } else if (payMethod === "WALLET" && orderInfo.billFee > userWallet.redPacketBalance) {
      showToast('红包余额不足');
      return;
    } else if (payMethod === "MEMBER_PAY") {
      params.paidFee = Number(Number(orderInfo.billFee * parseFloat((100 - (orderInfo.phoneMemberDiscount || 0)) / 100)).toFixed(0));
      params.transactionType = "SELF_DISH_ORDER_PAYMENT";
      params.payMethod = "WECHAT_PAY"
      // #ifdef MP-ALIPAY
      params.payMethod = 'ALIPAY'
      // #endif
      params.isPhoneMemberPay = true
    } else {
      params.transactionType = "SELF_DISH_ORDER_PAYMENT";
    }


    let res = await commonPay(params);
    // TODO 清除本地缓存菜品

    //  跳转到支付成功页面
    showToast(res ? "买单成功" : "买单失败,请稍后重试");
    return res;
  }


  return {
    payOrder,
    commonPay,
    buyFanpiaoAndPay
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

  async function buyCoupon(merchantId, couponInfo) {
    if (!uni.getStorageSync('userId')) { navigateTo("MENU/LOGIN"); return };
    let data = {
      couponPackageId: couponInfo.id,
      billFee: couponInfo.price,
      paidFee: couponInfo.price,
      merchantId: merchantId,
      transactionType: "COUPON_PACKAGE_PURCHASE",
      // 券包仅限用微信支付渠道购买，不可用其他优惠渠道如红包、饭票等购买
      payMethod: 'WECHAT_PAY'
    }
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
    let calcRes = calcRecommendCoupon(toRaw(unref(couponList)), unref(selectedDishesFinalTotalPrice), unref(userMerchantCoupons));
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
    params.billFee = Number(parseFloat(params.billFee || 0).toFixed(0));
    params.paidFee = Number(parseFloat(params.paidFee || 0).toFixed(0));
    let payRes = false;
    let res = await API.Order.pay(params);
    if (res.errcode != 0) {
      showToast(res.errmsg);
      return false;
    }
    if (params.payMethod == "WECHAT_PAY") {
      payRes = await wechatPay(res.signData);
    } else if (params.payMethod == "FANPIAO_PAY") {
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
