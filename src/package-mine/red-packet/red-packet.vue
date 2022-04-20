<template>
  <div class="wallet">
    <NavigationBar
      title="红包"
      backgroundColor="linear-gradient(90deg, #fc8b56 0%, #ff5b47 100%);"
      titleColor="white"
      iconColor="white"
    />
    <div class="top-bg"></div>
    <div class="content-wrapper">
      <div class="content common-card">
        <p class="title">余额（元）</p>
        <p class="money">
          {{ parseFloat(userWallet.redPacketBalance / 100).toFixed(2) }}
        </p>
        <p class="desc">金额超过20可提现</p>
        <button
          hover-class="none"
          class="btn"
          :class="{ disable: disableWithdraw }"
          :disabled="disableWithdraw"
          @click="navigateTo('MINE/WITHDRAW')"
        >
          立即提现
        </button>
        <!-- #ifdef MP-WEIXIN  -->
        <p class="tips">*根据微信平台规则，你需要完成微信实名认证才能提现</p>
        <!-- #endif -->
        <!-- #ifdef MP-ALIPAY  -->
        <p class="tips">*根据支付宝平台规则，你需要完成微信实名认证才能提现</p>
        <!-- #endif -->
      </div>
    </div>
  </div>
</template>
<script>
import API from "@api";
import { onBeforeMount, ref, computed } from "vue";
import { useUserInfo } from "@hooks/userHooks";
import { useNavigate } from "@hooks/commonHooks";
export default {
  setup() {
    const { userWallet, requestUserWallet } = useUserInfo();
    const { navigateTo } = useNavigate();

    const disableWithdraw = computed(() => {
      return false;
      return parseFloat(unref(userWallet).redPacketBalance) < 2000;
    });
    onBeforeMount(async () => {
      uni.showLoading();
      await requestUserWallet();
      uni.hideLoading();
    });

    return {
      userWallet,
      disableWithdraw,
      navigateTo,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wallet {
  width: 100%;

  .common-card {
    background: #fff !important;
    box-shadow: 0px 1px 5px 0px rgba(223, 210, 210, 0.5);
    border-radius: 10px !important;
  }

  .top-bg {
    height: 112px;
    background: linear-gradient(90deg, #fc8b56 0%, #ff5b47 100%);
  }

  .content-wrapper {
    height: 281px;
    margin-top: -96px;
    padding: 0 15px;

    .content {
      height: 281px;
      box-sizing: border-box;
      padding-top: 40px;
      text-align: center;

      .title {
        color: #333333;
        font-size: 16px;
        height: 24px;
        line-height: 24px;
      }

      .money {
        margin-top: 16px;
        color: #333333;
        font-size: 40px;
        font-weight: bold;
        height: 40px;
        line-height: 40px;
      }

      .desc {
        margin-top: 8px;
        color: #666666;
        font-size: 12px;
      }

      .btn {
        display: inline-block;
        margin-top: 40px;
        padding: 0 12px;
        border-radius: 23px;
        color: white;
        height: 45px;
        line-height: 45px;
        background: #F25643;
        transition: opacity 0.5s;
        width: calc(100% - 24px);

        &.disable {
          opacity: 0.5;
        }
      }

      .tips {
        margin-top: 12px;
        font-size: 12px;
        color: #F25643;
      }
    }
  }

  .tip {
    margin-top: 20px;
    text-align: center;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    color: #666666;
  }

  .activity-banner {
    width: calc(100vw - 24px);
    height: calc(25.07vw - 6px);
    margin: 12px auto 0 auto;

    .img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
