<!--
 * @Author: sunjie
 * @Date: 2022-02-18 19:13:57
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:53:51
 * @FilePath: /new-fanpiao-uniapp/src/package-order/PayMthodList/payMethodList.vue
-->
<template>
  <div class="pay-method-container">
    <FanpiaoPayMethod />

    <div class="other-pay">
      <div
        class="member-stored-pay"
        @click="setPayMethod('SHILAI_MEMBER_CARD_PAY')"
      >
        <div class="member-balance common-pay">
          <div class="left">
            <img
              src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-store.png"
              class="icon"
            />
            <div class="pay-text">
              <div class="main-">
                会员储值(余额:{{ userWallet.memberCardBalance / 100 }})
              </div>
              <div class="tooltip">17688479248 切换</div>
            </div>
          </div>
          <CustomImgRadio :checked="payMethod == 'SHILAI_MEMBER_CARD_PAY'" />
        </div>
        <scroll-view class="recharge-list-wrapper">
          <div class="recharge-list">
            <div
              class="recharge-item"
              :class="[
                orderRechargeInfo.selRechargeId == rechargeItem.id
                  ? 'active'
                  : '',
              ]"
              v-for="rechargeItem in orderRechargeInfo.recommendRechargeList"
              :key="rechargeItem.id"
              @click="changeRecharge(rechargeItem)"
            >
              <div class="price-text">
                {{ rechargeItem.sellPrice / 100 }}
              </div>
              <div class="discount-info">
                赠送
                <div class="amount">
                  {{ (rechargeItem.amount - rechargeItem.sellPrice) / 100 }}
                </div>
                元
              </div>
            </div>
          </div>
        </scroll-view>
      </div>
      <div
        class="member-pay common-pay"
        @click="setPayMethod('MEMBER_PAY')"
        v-if="userInfo.isPhoneMember && userInfo.phone"
      >
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
      <div class="wechat-pay common-pay" @click="setPayMethod('WECHAT_PAY')">
        <div class="left">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-wechat.svg"
            class="icon"
          />
          <div class="pay-text">微信支付</div>
        </div>
        
        <CustomImgRadio :checked="payMethod == 'WECHAT_PAY'" />
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
import { ref, onBeforeMount, computed } from "vue";
import FanpiaoPayMethod from "./FanpiaoPayMethod";
import { useOrder, useOrderRechargeInfo } from "@hooks/orderHooks";
import { useUserMerchantWallet, useUserInfo } from "@hooks/userHooks";
import { useRechargeInfo } from "@hooks/merchantHooks";
export default {
  components: {
    FanpiaoPayMethod,
  },
  setup() {
    let { setPayMethod, payMethod } = useOrder();
    const { userInfo } = useUserInfo();
    const { userWallet } = useUserMerchantWallet();
    const { orderRechargeInfo } = useOrderRechargeInfo();

    function changeRecharge(rechargeItem) {
      console.log(
        "%crechargeItem: ",
        "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
        rechargeItem
      );
    }

    return {
      payMethod,
      setPayMethod,
      userWallet,
      userInfo,
      orderRechargeInfo,
      changeRecharge,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-method-container {
  .box-size(calc(100% - 30px),unset);
  margin: 0 auto;
  .other-pay {
    background-color: #fff;
    border-radius: 8px;
    margin-top: 8px;
    padding: 0 12px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
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
      &.member-stored-pay {
        border-bottom-width: 0px;
        height: 56px;
        align-items: center;
      }
    }
    .member-stored-pay {
      .box-size(100%,unset);
      .flex-simple(flex-start,flex-start);
      flex-direction: column;
      min-height: 82px;
      border-bottom: 1px solid #e0e0e0;
      .recharge-list-wrapper {
        max-height: 150px;
        .recharge-list {
          display: grid;
          grid-template-rows: 63px;
          grid-template-columns: 1fr 1fr;
          grid-row-gap: 8px;
          grid-column-gap: 8px;
          padding-bottom: 8px;
          .recharge-item {
            .box-size(100%,63px,#F8F8F8);
            color: #333333;
            border: 1px solid transparent;
            border-radius: 4px;
            padding: 12px 0px 12px 12px;
            .price-text {
            }
          }
        }
      }
    }
    .member-pay {
      .box-size(calc(100% - 24px),72px);
    }
    .wechat-pay {
    }
  }
}
</style>