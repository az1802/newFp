<!--
 * @Author: sunjie
 * @Date: 2022-02-18 19:13:57
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:53:51
 * @FilePath: /new-fanpiao-uniapp/src/package-order/PayMthodList/payMethodList.vue
-->
<template>
  <div class="pay-method-container">
    <FanpiaoPay />

    <div class="other-pay">
      <div
        class="member-stored-pay common-pay"
        @click="setPayMethod('SHILAI_MEMBER_CARD_PAY')"
      >
        <div class="left">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-store.png"
            class="icon"
          />
          <div class="pay-text">
            <div class="main-">会员储值</div>
            <div class="tooltip">17688479248 切换</div>
          </div>
        </div>
        <CustomImgRadio :checked="payMethod == 'SHILAI_MEMBER_CARD_PAY'" />
      </div>
      <div class="member-pay common-pay" @click="setPayMethod('MEMBER_PAY')">
        <div class="left">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-store.png"
            class="icon"
          />
          <div class="pay-text">
            <div class="main-">会员支付</div>
            <div class="tooltip">* 不与其它优惠同享</div>
          </div>
        </div>
        <CustomImgRadio :checked="payMethod == 'MEMBER_PAY'" />
      </div>
      <!-- #ifdef MP-WEIXIN -->
      <div class="wechat-pay common-pay" @click="setPayMethod('WECHAT')">
        <div class="left">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-wechat.svg"
            class="icon"
          />
          <div class="pay-text">微信支付</div>
        </div>
        <CustomImgRadio :checked="payMethod == 'WECHAT'" />
      </div>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <div class="wechat-pay common-pay" @click="setPayMethod('ALIPAY')">
        <div class="left">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-alipay.png"
            class="icon"
          />
          <div class="pay-text">支付宝支付</div>
        </div>
        <CustomImgRadio :checked="payMethod == 'ALIPAY'" />
      </div>
      <!-- #endif -->
    </div>
  </div>
</template>
<script>
import { ref } from "vue";
import FanpiaoPay from "./FanpiaoPay";
import { useOrder } from "@hooks/orderHooks";
export default {
  components: {
    FanpiaoPay,
  },
  setup() {
    let { setPayMethod, payMethod } = useOrder();
    return {
      payMethod,
      setPayMethod,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-method-container {
  .box-size(calc(100% - 24px),unset);
  padding: 0 12px;
  margin: 0 auto;
  .other-pay {
    background-color: #fff;
    border-radius: 8px;
    margin-top: 8px;
    padding: 0 12px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
    height: 210px;
    .common-pay {
      .box-size(calc(100% - 24px),56px);
      .flex-simple(space-between,center);
      margin: 0 auto;
      border-bottom: 1px solid #e0e0e0;
      &:last-child {
        border-bottom-width: 0px;
      }
      .left {
        .flex-simple(flex-start,center);
        .icon {
          .box-size(22px,22px);
          margin-right: 10px;
        }
        .pay-text {
          .flex-between(column);
          .main-text {
            .normal-font(16px);
          }
          .tooltip {
            .normal-font(11px,#999);
          }
        }
      }
      .right {
      }
    }
    .member-stored-pay {
      .box-size(calc(100% - 24px),82px);
    }
    .member-pay {
      .box-size(calc(100% - 24px),72px);
    }
    .wechat-pay {
    }
  }
}
</style>