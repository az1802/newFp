<!--
 * @Author: sunjie
 * @Date: 2022-02-18 14:22:32
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 19:22:25
 * @FilePath: /new-fanpiao-uniapp/src/package-order/pay-order.vue
-->
<template>
  <div class="pay-order-page">
    <NavigationBar title="确认支付" />
    <scroll-view class="scroll-view" scroll-y>
      <div class="pay-price-info">
        <!-- 会员支付和饭票支付才显示折扣价  其余都显示原价 -->
        <div
          class="show-discount-price"
          v-if="
            showBillFee ||
            (payMethod == 'FANPIAO_PAY' &&
              (orderFanpiaoPayInfo.fanpiaoRemainPaidFee <= 0 ||
                (orderFanpiaoPayInfo.fanpiaoRemainPaidFee > 0 &&
                  orderFanpiaoPayInfo.selFanpiaoId)))
          "
        >
          <div class="pay-price">{{ fenToYuan(paidFee) }}</div>
          <div class="origin-price">{{ fenToYuan(orderInfo.billFee) }}</div>
        </div>
        <div v-else class="show-origin-price">
          <div class="origin-price">{{ fenToYuan(paidFee) }}</div>
        </div>
      </div>
      <PayMthodList
        :merchantId="merchantInfo.merchantId"
        :billFee="orderInfo.billFee"
      />
    </scroll-view>
    <div class="bottom">
      <div class="tooltip" v-if="payMethod !== 'FANPIAO_PAY'">
        <div class="text">单单减!本单再减{{ fanpiaoPayTooltipText }}</div>
        <div class="btn" @click="toggleFanpiaoPay">点我立减</div>
      </div>
      <div class="pay-btn" @click="payOrderInfo">{{ payText }}</div>
    </div>
  </div>
</template>
<script>
import PayMthodList from "./PayMthodList/payMethodList.vue";
import {
  useOrder,
  usePayMethod,
  useFanpiaoPayInfo,
  useOrderRechargeInfo,
} from "@hooks/orderHooks";
import { useUserMerchantWallet, useUserInfo } from "@hooks/userHooks";
import {
  useFanpiaoInfo,
  useMerchantInfo,
  useRechargeInfo,
} from "@hooks/merchantHooks";
import { usePayOrder } from "@hooks/payHooks";
import { useDish } from "@hooks/menuHooks";
import {
  calcRecommendFanpiao,
  fenToYuan,
  calcRecommendRecharge,
  navigateTo,
  sleep,
  calcFanpiaoDiscountPrice,
} from "@utils";

import { onBeforeMount, computed, unref } from "vue";
export default {
  components: { PayMthodList },
  setup() {
    let readyPay = false;
    const { resetSelDishes } = useDish();
    const { orderInfo, resetOrder } = useOrder();
    const { payOrder } = usePayOrder();
    const { merchantInfo } = useMerchantInfo();
    const { setOrderFanpiaoPayInfo, finalFanpiaoPaidFee, orderFanpiaoPayInfo } =
      useFanpiaoPayInfo();
    const { orderRechargeInfo, setOrderRechargeInfo } = useOrderRechargeInfo();
    const { requestFanpiaoList, fanpiaoList } = useFanpiaoInfo();
    const { userInfo } = useUserInfo();
    const { userWallet, requestUserWallet, requestFanpiaoPaidFee } =
      useUserMerchantWallet();
    const { requestMerchantRecharges, rechargeConfigs } = useRechargeInfo();
    const { payMethod, setPayMethod } = usePayMethod();

    async function genRecommendFanpiaoList(merchantId) {
      let res = await requestFanpiaoPaidFee(
        merchantId,
        unref(orderInfo).billFee
      );
      let remainPaidFee = res.remainDiscountFee + res.remainNoDiscountFee;
      let recommendFanpiaoList = [];
      if (remainPaidFee > 0) {
        //表示饭票余额不足
        recommendFanpiaoList = calcRecommendFanpiao(
          unref(fanpiaoList),
          unref(orderInfo).billFee,
          unref(userWallet).fanpiaoPaidFee
        );
      }
      setOrderFanpiaoPayInfo({
        fanpiaoPaidFee: res.paidFee,
        fanpiaoRemainPaidFee: remainPaidFee,
        recommendFanpiaoList: recommendFanpiaoList || [],
      });
    }

    async function genRecommendRechargeList() {
      let { memberCardBalance } = unref(userWallet),
        recommendRechargeList = [];

      let { billFee } = unref(orderInfo);

      if (memberCardBalance < billFee) {
        recommendRechargeList = calcRecommendRecharge(
          unref(rechargeConfigs),
          billFee,
          memberCardBalance
        );
      }
      setOrderRechargeInfo({
        recommendRechargeList,
      });
    }

    // 请求钱包信息,计算所有饭票支付相关额
    onBeforeMount(async () => {
      // 获取余额
      let merchantId = uni.getStorageSync("merchantId");
      await requestMerchantRecharges(merchantId); //获取商户储值列表
      await requestFanpiaoList(merchantId); //TODO 可以移除
      await requestUserWallet(merchantId); //请求用户所有相关d余额
      readyPay = true;
      genRecommendFanpiaoList(merchantId);
      genRecommendRechargeList();
    });

    const showBillFee = computed(() => {
      let { billFee } = unref(orderInfo),
        pm = unref(payMethod);
      if (pm !== "SHILAI_MEMBER_CARD_PAY" && pm !== "FANPIAO_PAY") {
        return true;
      } else {
        return false;
      }
    });

    // 根据支付金额来进行显示
    const paidFee = computed(() => {
      let {
          billFee,
          selCouponReduceCost,
          phoneMemberDiscount,
          discountAmountPrice,
        } = unref(orderInfo),
        pm = unref(payMethod);
      if (pm == "WECHAT_PAY" || pm == "ALIPAY" || pm == "WALLET") {
        return billFee - selCouponReduceCost - discountAmountPrice;
      } else if (pm == "SHILAI_MEMBER_CARD_PAY") {
        return billFee;
      } else if (pm == "MEMBER_PAY") {
        let discount = phoneMemberDiscount || 0;
        return ((billFee * (100 - phoneMemberDiscount)) / 100).toFixed(0);
      } else if (pm == "FANPIAO_PAY") {
        return unref(finalFanpiaoPaidFee);
      }
    });

    const payText = computed(() => {
      let pm = unref(payMethod),
        resText = "";
      if (pm == "WECHAT_PAY") {
        resText = "微信支付";
      } else if (pm == "ALIPAY") {
        resText = "支付宝支付";
      } else if (pm == "FANPIAO_PAY") {
        let { selFanpiaoId, selFanpiaoInfo } = unref(orderFanpiaoPayInfo);
        if (selFanpiaoId && selFanpiaoInfo?.totalValue) {
          resText = `购买饭票￥${selFanpiaoInfo.totalValue / 100}并支付`;
        } else {
          resText = `饭票支付`;
        }
      } else if (pm == "SHILAI_MEMBER_CARD_PAY") {
        let { selRechargeInfo } = unref(orderRechargeInfo);
        let { memberCardBalance } = unref(userWallet);

        if (
          selRechargeInfo.id &&
          memberCardBalance < unref(orderInfo).billFee
        ) {
          resText = `会员储值￥${
            selRechargeInfo.sellPrice
              ? parseFloat(selRechargeInfo.sellPrice) / 100
              : ""
          }并支付`;
        } else {
          resText = `会员储值支付`;
        }
      } else if (pm == "WALLET") {
        resText = "红包支付";
      } else if (pm == "MEMBER_PAY") {
        resText = "会员支付";
      } else {
        resText = "确认支付";
      }

      return resText;
    });

    async function payOrderInfo() {
      if (!readyPay) {
        return;
      }
      let tempOrderInfo = { ...unref(orderInfo) };
      console.log("tempOrderInfo: ", tempOrderInfo, unref(orderFanpiaoPayInfo));
      // return;
      tempOrderInfo.merchantId = unref(merchantInfo).merchantId;
      tempOrderInfo.paidFee = unref(paidFee);
      tempOrderInfo.orderFanpiaoPayInfo = { ...unref(orderFanpiaoPayInfo) };
      tempOrderInfo.orderRechargeInfo = { ...unref(orderRechargeInfo) };
      readyPay = false;
      let res = await payOrder(
        unref(payMethod),
        tempOrderInfo,
        unref(userWallet)
      );
      readyPay = true;
      console.log("res: ", res);
      if (!res) {
        return;
      }
      await sleep(1000);
      setPayMethod("WECHAT_PAY");
      resetSelDishes([]);
      resetOrder();
      // 跳转到支付成功野蛮
      navigateTo("ORDER/PAY_SUCCESS", {
        orderId: tempOrderInfo.orderId,
        redPacketVal: res.redPacketValue || 0,
      });
    }

    let fanpiaoPayTooltipText = computed(() => {
      let { recommendFanpiaoList, fanpiaoRemainPaidFee } =
        unref(orderFanpiaoPayInfo);
      let { billFee } = unref(orderInfo);

      if (unref(orderFanpiaoPayInfo).fanpiaoRemainPaidFee <= 0) {
        let discountTemp = billFee - unref(orderFanpiaoPayInfo).fanpiaoPaidFee;
        return discountTemp > 0 ? discountTemp / 100 : 0;
      }

      // 按照推荐的饭票比例处理
      let { maxFanpiaoDiscount, minFanpiaoDiscount } = calcFanpiaoDiscountPrice(
        unref(recommendFanpiaoList),
        billFee || 0
      );
      if (maxFanpiaoDiscount < minFanpiaoDiscount) {
        return "";
      }
      let minDiscountPrice = Number(
        ((minFanpiaoDiscount || 0) * (billFee || 0)) / 10000
      ).toFixed(2);
      let maxDiscountPrice = Number(
        ((maxFanpiaoDiscount || 0) * (billFee || 0)) / 10000
      ).toFixed(2);
      return minDiscountPrice != maxDiscountPrice
        ? `${minDiscountPrice}-${maxDiscountPrice}元`
        : `${minDiscountPrice}元`;
    });
    function toggleFanpiaoPay() {
      setPayMethod("FANPIAO_PAY");
      let { selFanpiaoId, recommendFanpiaoList } = unref(orderFanpiaoPayInfo);
      if (!selFanpiaoId) {
        let fanpiaoInfo = recommendFanpiaoList[0];
        fanpiaoInfo &&
          setOrderFanpiaoPayInfo({
            selFanpiaoId: fanpiaoInfo.id,
            selFanpiaoInfo: fanpiaoInfo,
          });
      }
    }
    return {
      merchantInfo,
      orderInfo,
      showBillFee,
      paidFee,
      fenToYuan,
      payOrderInfo,
      userWallet,
      payMethod,
      orderFanpiaoPayInfo,
      payText,
      toggleFanpiaoPay,
      fanpiaoPayTooltipText,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-order-page {
  .box-size(100vw,100vh,white);
  .scroll-view {
    .box-size(100vw,calc(100vh - 100px),transparent);
    padding-bottom: 100px;
  }
  .bottom {
    position: fixed;
    bottom: 52px;
    left: 0px;
    right: 0px;
    padding: 0 12px;
    .tooltip {
      .box-size(100%,61px,#f6e7e5);
      .flex-simple(space-between,flex-start);
      padding: 10px 12px 0 12px;
      border-radius: 8px 8px 0 0;
      margin-bottom: -23px;
      .text {
        .line-center(24px);
        .normal-font(14px,#f25643);
      }
      .btn {
        .line-center(22px);
        .normal-font(14px,#ff4029);
        border: 1px solid #ff4029;
        border-radius: 4px;
        text-align: center;
        padding: 0 4px;
        background: white;
      }
    }
    .pay-btn {
      width: 100%;
      .common-btn(45px,#f25643,25px);
      .bold-font(18px,white);
    }
  }
}
.pay-price-info {
  .show-discount-price {
    .flex-simple(center,flex-end);
    height: 45px;
    padding: 20px 0 24px 0;
    .pay-price {
      .normal-font(45px,#333);
      .price-symbol(22px,#333);
      .line-center(45px);
    }
    .origin-price {
      .flex-simple(center,flex-end);
      .normal-font(20px,#666);
      .price-symbol(20px,#666);
      text-decoration: line-through;
      margin-left: 6px;
    }
  }
  .show-origin-price {
    .flex-simple(center,flex-end);
    height: 45px;
    padding: 20px 0 24px 0;
    .origin-price {
      .normal-font(45px,#333);
      .price-symbol(22px,#333);
      .line-center(45px);
    }
  }
}
</style>