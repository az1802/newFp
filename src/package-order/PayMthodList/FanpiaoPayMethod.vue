<template>
  <div class="fanpiao-pay-wrapper">
    <div class="header">
      <div class="title">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-shilai-03.svg"
          alt=""
          class="logo"
        />
        <div class="text">时来钱包</div>
      </div>
      <div class="tooltip-text" @click="navigateTo('OTHER/DISCOUNT_RULES')">
        购买须知 >
      </div>
    </div>
    <div class="fanpiao-content" @click="setFanpiaoPayMethod">
      <div class="balance-wrapper">
        <div class="left">
          <div class="balance">
            饭票(余额:{{ userWallet.fanpiaoBalance / 100 }})
          </div>
          <div
            v-if="orderFanpiaoPayInfo.recommendFanpiaoList.length > 0"
            class="tooltip"
          >
            饭票余额不足，购买下列饭票即享优惠
          </div>
          <div v-else class="tooltip">饭票支付，本单立省0.35-0.75元</div>
        </div>
        <CustomImgRadio :checked="payMethod == 'FANPIAO_PAY'" />
      </div>
      <scroll-view
        class="fanpiao-list-scrollview"
        scroll-y
        v-if="orderFanpiaoPayInfo.recommendFanpiaoList.length > 0"
      >
        <div class="fanpiao-list">
          <FanpiaoItem
            v-for="(
              fanpiaoItem, index
            ) in orderFanpiaoPayInfo.recommendFanpiaoList"
            :key="fanpiaoItem.id"
            :fanpiaoInfo="fanpiaoItem"
            :active="orderFanpiaoPayInfo.selFanpiaoId == fanpiaoItem.id"
            @select="changeSelFanpiao"
            :isSuperFanpiao="
              index == orderFanpiaoPayInfo.recommendFanpiaoList.length - 1
            "
          />
        </div>
      </scroll-view>
    </div>
    <div class="red-packet" @click="setPayMethod('WALLET')">
      <div class="text">红包(余额:{{ userWallet.redPacketBalance / 100 }})</div>
      <CustomImgRadio :checked="payMethod == 'WALLET'" />
    </div>
  </div>
</template>
<script>
import FanpiaoItem from "./FanpiaoItem.vue";
import { useOrder, usePayMethod, useFanpiaoPayInfo } from "@hooks/orderHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoInfo } from "@hooks/merchantHooks";
import { useUserMerchantWallet } from "@hooks/userHooks";
import { onBeforeMount, ref, unref, computed } from "vue";
import { calcRecommendFanpiao } from "@utils";

export default {
  components: {
    FanpiaoItem,
  },
  setup(props) {
    let { setPayMethod, payMethod } = usePayMethod();
    let { navigateTo } = useNavigate();
    const { userWallet } = useUserMerchantWallet();
    const { orderFanpiaoPayInfo, setOrderFanpiaoPayInfo } = useFanpiaoPayInfo();

    function changeSelFanpiao(fanpiao) {
      let { recommendFanpiaoList, selFanpiaoInfo } = unref(orderFanpiaoPayInfo);
      let { fanpiaoBalance } = unref(userWallet);
      console.log(recommendFanpiaoList.length, fanpiao.id, selFanpiaoInfo.id);

      if (recommendFanpiaoList.length > 0 && selFanpiaoInfo.id == fanpiao.id) {
        //推荐饭票时支持饭票反选
        setOrderFanpiaoPayInfo({
          selFanpiaoId: "",
          selFanpiaoInfo: {},
        });
      } else {
        setPayMethod("FANPIAO_PAY");
        setOrderFanpiaoPayInfo({
          selFanpiaoId: fanpiao.id,
          selFanpiaoInfo: fanpiao,
        });
      }
    }

    function setFanpiaoPayMethod() {
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
      setPayMethod,
      payMethod,
      navigateTo,
      userWallet,
      changeSelFanpiao,
      orderFanpiaoPayInfo,
      setFanpiaoPayMethod,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.fanpiao-pay-wrapper {
  background-image: url(https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-order/wallet-pay-wrapper-bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-shadow: 1px 2px 8px 0px rgba(254, 172, 92, 0.5);
  border-radius: 8px;
  overflow: hidden;
  // height: 357px;
  padding: 0 12px 12px 12px;
  box-sizing: border-box;
  .header {
    .flex-simple(space-between,center);
    .line-center(51px);
    .title {
      box-sizing: border-box;
      .flex-center();
      .logo {
        .box-size(30px,30px,transparent);
      }
      .text {
        .bold-font(18px,#c97c0d);
        margin-left: 12px;
      }
    }
    .tooltip-text {
      .normal-font(12px,#c97c0d);
    }
  }
  .fanpiao-content {
    .box-size(100%,unset);
    background: #fffdfa;
    border-radius: 8px;
    border: 1px solid #febe33;
    padding: 0 12px;
    .balance-wrapper {
      .box-size(100%,86px);
      .flex-simple(space-between,center);
      .left {
        .flex-between(column);
        .balance {
          .line-center(27px);
          .bold-font(18px,#333);
        }
        .tooltip {
          .line-center(18px);
          .normal-font(12px,#ff4029);
        }
      }
    }
    .fanpiao-list-scrollview {
      max-height: 150px;
      .fanpiao-list {
        display: grid;
        grid-template-rows: 63px;
        grid-template-columns: 1fr 1fr;
        grid-row-gap: 8px;
        grid-column-gap: 8px;
        padding-bottom: 8px;
      }
    }
  }
  .red-packet {
    .box-size(100%,49px);
    .flex-simple(space-between,center);
    background: #fffdfa;
    border-radius: 8px;
    border: 1px solid #febe33;
    padding: 0 12px;
    margin-top: 12px;
    .text {
      .normal-font(16px,#333);
    }
  }
}
</style>