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
        v-if="payMethod == 'MEMBER_PAY' || payMethod == 'FANPIAO_PAY'"
      >
        <div class="pay-price">{{ fenToYuan(paidFee) }}</div>
        <div class="origin-price">{{ fenToYuan(billFee) }}</div>
      </div>
      <div v-else class="show-origin-price">
        <div class="origin-price">{{ fenToYuan(paidFee) }}</div>
      </div>
    </div>
    <PayMthodList />
    <div class="pay-btn" @click="payOrder">确认支付</div>
  </div>
</template>
<script>
import PayMthodList from "./PayMthodList/payMethodList.vue";
import { useOrder, usePayMethod, useFanpiaoPayInfo } from "@hooks/orderhooks";
import { useTransformPrice } from "@hooks/commonHooks";
import { useUserWallet } from "@hooks/userHooks";
import { useFanpiaoInfo } from "@hooks/merchantHooks";
import { calcRecommendFanpiao } from "@utils";

import { onBeforeMount, computed, unref } from "vue";
export default {
  components: { PayMthodList },
  setup() {
    const { orderInfo } = useOrder();
    const { setOrderFanpiaoPayInfo, finalFanpiaoPaidFee } = useFanpiaoPayInfo();
    const { requestFanpiaoList, fanpiaoList } = useFanpiaoInfo();
    let { fenToYuan } = useTransformPrice();

    const { userWallet, requestUserWallet, requestFanpiaoPaidFee } =
      useUserWallet();
    const { payMethod } = usePayMethod();

    // 请求钱包信息,计算所有饭票支付相关额
    onBeforeMount(async () => {
      // 获取余额
      let merchantId = uni.getStorageSync("merchantId");
      await requestFanpiaoList(uni.getStorageSync("merchantId")); //TODO 可以移除
      await requestUserWallet(merchantId); //请求用户所有相关的余额
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
    });

    const billFee = computed(() => {
      if (unref(payMethod) == "MEMBER_PAY") {
        return unref(orderInfo).paidFee;
      } else if (unref(payMethod) == "FANPIAO_PAY") {
        return unref(orderInfo).paidFee;
      }
    });

    // 根据支付金额来进行显示
    const paidFee = computed(() => {
      if (
        unref(payMethod) == "WECHAT" ||
        unref(payMethod) == "ALIPAY" ||
        unref(payMethod) == "WALLET"
      ) {
        //可以使用券包
        return unref(orderInfo).paidFee;
      } else if (unref(payMethod) == "SHILAI_MEMBER_CARD_PAY") {
        let { selCouponReduceCost, paidFee } = unref(orderInfo);
        // TODO  不可以使用券包
        return selCouponReduceCost ? paidFee + selCouponReduceCost : paidFee;
      } else if (unref(payMethod) == "MEMBER_PAY") {
        return unref(orderInfo).paidFee * 0.95;
      } else if (unref(payMethod) == "FANPIAO_PAY") {
        return unref(finalFanpiaoPaidFee);
      }
    });

    async function payOrder() {
      // 根号有不同的支付方式选择
    }
    return {
      orderInfo,
      billFee,
      paidFee,
      fenToYuan,
      payOrder,
      userWallet,
      payMethod,
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