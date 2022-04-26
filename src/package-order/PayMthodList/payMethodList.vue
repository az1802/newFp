<!--
 * @Author: sunjie
 * @Date: 2022-02-18 19:13:57
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-21 13:53:51
 * @FilePath: /new-fanpiao-uniapp/src/package-order/PayMthodList/payMethodList.vue
-->
<template>
  <div class="pay-method-container">
    <FanpiaoPayMethod :billFee="billFee" />

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
              <!-- <div class="tooltip">17688479248 切换</div> -->
              <div class="tooltip get-phone" @click.stop="stop" v-if="!phone">
                绑定手机号<GetPhoneButton
                  class="get-phone-btn"
                  @success="getPhoneSuccess"
                />
              </div>
            </div>
          </div>
          <CustomImgRadio :checked="payMethod == 'SHILAI_MEMBER_CARD_PAY'" />
        </div>
        <scroll-view
          class="recharge-list-wrapper"
          v-if="
            orderRechargeInfo.recommendRechargeList.length > 0 &&
            payMethod == 'SHILAI_MEMBER_CARD_PAY'
          "
        >
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
import { ref, onBeforeMount, computed, unref } from "vue";
import FanpiaoPayMethod from "./FanpiaoPayMethod";
import { useOrder, useOrderRechargeInfo } from "@hooks/orderHooks";
import {
  useUserMerchantWallet,
  useUserInfo,
  useUserMerchantMemberBalance,
  useUserPhone,
} from "@hooks/userHooks";
import { useRechargeInfo } from "@hooks/merchantHooks";
import { stop, sleep } from "@utils";
export default {
  props: {
    merchantId: {
      type: String,
      default: "",
    },
    billFee: {
      type: [String, Number],
      default: 0,
    },
  },
  components: {
    FanpiaoPayMethod,
  },
  setup(props) {
    let { setPayMethod, payMethod } = useOrder();
    const { userInfo } = useUserInfo();
    const { phone } = useUserPhone();
    const { userWallet, requestUserWallet } = useUserMerchantWallet();
    const { orderRechargeInfo, setOrderRechargeInfo } = useOrderRechargeInfo();

    function changeRecharge(rechargeItem) {
      let { selRechargeId } = unref(orderRechargeInfo);
      if (selRechargeId == rechargeItem.id) {
        setOrderRechargeInfo({
          selRechargeId: "",
          selRechargeInfo: {},
        });
      } else {
        setOrderRechargeInfo({
          selRechargeId: rechargeItem.id,
          selRechargeInfo: rechargeItem,
        });
      }
    }

    return {
      payMethod,
      setPayMethod,
      userWallet,
      userInfo,
      orderRechargeInfo,
      changeRecharge,
      stop,
      phone,
      async getPhoneSuccess(phone) {
        // TODO 更新用户手机号并重新获取余额
        if (phone) {
          sleep(1000);
          await requestUserWallet(props.merchantId);
        } else {
          showToast("绑定手机号失败,请重新操作");
        }
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.pay-method-container {
  .box-size(calc(100% - 30px),unset);
  margin: 0 auto;
  padding-bottom: 150px;
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
      border-top: 1px solid #e0e0e0;
      &:first-child {
        border-top-width: 0px;
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
        border-top-width: 0px;
        height: 56px;
        align-items: center;
      }
      &.member-balance {
        flex-basis: 56px;
      }
    }
    .member-stored-pay {
      .box-size(100%,unset);
      .flex-simple(center,flex-start);
      flex-direction: column;
      min-height: 82px;
      // border-top: 1px solid #e0e0e0;
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
              .bold-font(18px,#333);
              .line-center(18px);
            }
            .discount-info {
              .normal-font(14px,#666);
              .line-center(21px);
              .amount {
                .normal-font(14px,#f25643);
                display: inline-block;
              }
            }
            &.active {
              background-color: #f25643;
              border: 1px solid #f25643;
              .price-text,
              .discount-info,
              .discount-info .amount {
                color: white;
              }
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
.get-phone {
  .box-size(70px,20px,#E6E6E6);
  .normal-font(12px,#666);
  .line-center(20px);
  flex-basis: unset;
  padding-top: 0.5px;
  display: inline-block;
  text-align: center;
  border-radius: 3px;
  position: relative;
}
.get-phone-btn {
  .fill-box();
  background: transparent;
}
</style>