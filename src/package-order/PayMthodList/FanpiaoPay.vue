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
    <div class="fanpiao-content" @click="setPayMethod('FANPIAO_PAY')">
      <div class="balance-wrapper">
        <div class="left">
          <div class="balance">饭票(余额:0)</div>
          <div class="tooltip">饭票支付，本单立省0.35-0.75元</div>
        </div>
        <CustomImgRadio :checked="payMethod == 'FANPIAO_PAY'" />
      </div>
      <scroll-view class="fanpiao-list-scrollview" scroll-y>
        <div class="fanpiao-list">
          <FanpiaoItem
            v-for="fanpiaoItem in fanpiaoList"
            :key="fanpiaoItem.id"
            :fanpiaoInfo="fanpiaoItem"
          />
        </div>
      </scroll-view>
    </div>
    <div class="red-packet" @click="setPayMethod('WALLET')">
      <div class="text">红包(余额:73.79)</div>
      <CustomImgRadio :checked="payMethod == 'WALLET'" />
    </div>
  </div>
</template>
<script>
import FanpiaoItem from "./FanpiaoItem.vue";
import { useOrder } from "@hooks/orderHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoInfo } from "@hooks/merchantHooks";
export default {
  components: {
    FanpiaoItem,
  },
  setup() {
    let { setPayMethod, payMethod } = useOrder();
    let { navigateTo } = useNavigate();
    let { fanpiaoList } = useFanpiaoInfo();
    return {
      setPayMethod,
      payMethod,
      navigateTo,
      fanpiaoList,
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
  height: 357px;
  padding: 0 12px;
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
    .box-size(100%,228px);
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
          .bold-font(12px,#ff4029);
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