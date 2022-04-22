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
    <div class="pay-price-info">
      <!-- 会员支付和饭票支付才显示折扣价  其余都显示原价 -->
      <div
        class="show-discount-price"
        v-if="
          payMethod == 'MEMBER_PAY' ||
          (payMethod == 'FANPIAO_PAY' &&
            (orderFanpiaoPayInfo.fanpiaoRemainPaidFee <= 0 ||
              (orderFanpiaoPayInfo.fanpiaoRemainPaidFee > 0 &&
                orderFanpiaoPayInfo.selFanpiaoId)))
        "
      >
        <div class="pay-price">{{ fenToYuan(paidFee) }}</div>
        <div class="origin-price">{{ fenToYuan(billFee) }}</div>
      </div>
      <div v-else class="show-origin-price">
        <div class="origin-price">{{ fenToYuan(paidFee) }}</div>
      </div>
    </div>
    <PayMthodList />
    <div class="pay-btn" @click="payOrderInfo">{{ payText }}</div>
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
} from "@utils";

import { onBeforeMount, computed, unref } from "vue";
export default {
  components: { PayMthodList },
  setup() {
    const { resetSelDishes } = useDish();
    const { orderInfo } = useOrder();
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
    const { payMethod } = usePayMethod();

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
      console.log("memberCardBalance: ", memberCardBalance, billFee);

      if (memberCardBalance < billFee) {
        recommendRechargeList = calcRecommendRecharge(
          unref(rechargeConfigs),
          (billFee = 0),
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
      genRecommendFanpiaoList(merchantId);
      genRecommendRechargeList();
    });

    const billFee = computed(() => {
      if (unref(payMethod) == "MEMBER_PAY") {
        return unref(orderInfo).paidFee;
      } else if (unref(payMethod) == "FANPIAO_PAY") {
        return unref(orderInfo).paidFee;
      } else {
        return unref(orderInfo).paidFee;
      }
    });

    // 根据支付金额来进行显示
    const paidFee = computed(() => {
      console.log("计算  paidFee", unref(orderInfo));
      if (
        unref(payMethod) == "WECHAT_PAY" ||
        unref(payMethod) == "ALIPAY" ||
        unref(payMethod) == "WALLET"
      ) {
        return unref(orderInfo).paidFee;
      } else if (unref(payMethod) == "SHILAI_MEMBER_CARD_PAY") {
        let { selCouponReduceCost, paidFee } = unref(orderInfo);
        // TODO  不可以使用券包
        return selCouponReduceCost ? paidFee + selCouponReduceCost : paidFee;
      } else if (unref(payMethod) == "MEMBER_PAY") {
        let discount = unref(userInfo).phoneMemberDiscount || 0;
        return ((unref(orderInfo).paidFee * (100 - discount)) / 100).toFixed(0);
      } else if (unref(payMethod) == "FANPIAO_PAY") {
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
        //  if(this.selectRechargeId&&this.depositBalance < this.billFee){
        //     resText =  `会员储值￥${this.selectRecharge.sellPrice ? parseFloat(this.selectRecharge.sellPrice)/100 : ''}并支付`
        //  }else{
        //     resText =  `会员储值支付`
        //  }
        resText = `会员储值支付`;
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
      let tempOrderInfo = { ...unref(orderInfo) };
      console.log("tempOrderInfo: ", tempOrderInfo, unref(orderFanpiaoPayInfo));
      return;
      tempOrderInfo.merchantId = unref(merchantInfo).merchantId;
      tempOrderInfo.billFee = unref(billFee);
      tempOrderInfo.paidFee = unref(paidFee);
      tempOrderInfo.orderFanpiaoPayInfo = { ...unref(orderFanpiaoPayInfo) };
      let res = await payOrder(
        unref(payMethod),
        tempOrderInfo,
        unref(userWallet)
      );
      if (!res) {
        return;
      }
      res && resetSelDishes([]);
      await sleep(2000);
      // 跳转到支付成功野蛮
      navigateTo("ORDER/PAY_SUCCESS", {
        orderId: tempOrderInfo.orderId,
        redPacketVal: tempOrderInfo.redPacketValue,
      });
    }
    return {
      orderInfo,
      billFee,
      paidFee,
      fenToYuan,
      payOrderInfo,
      userWallet,
      payMethod,
      orderFanpiaoPayInfo,
      payText,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-order-page {
  .box-size(100vw,100vh,white);
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
  .pay-btn {
    position: fixed;
    bottom: 52px;
    left: 12px;
    right: 12px;
    .common-btn(45px,#f25643,25px);
    .bold-font(18px,white);
  }
}
</style>