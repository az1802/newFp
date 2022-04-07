<template>
  <div class="withdraw">
    <NavigationBar title="提现" />
    <p class="tips-title">预计2小时内原路退回，请留意查收</p>
    <p class="tip">* 单次最低可提现金额 20.00 元</p>
    <p class="tip">* 单日最高可提现金额 200.00 元</p>
    <div class="withdraw-wrapper common-card">
      <div class="title">提现金额</div>
      <div class="input-wrapper">
        <input
          type="digit"
          class="input"
          :value="inputAmount"
          @input="handleInput"
        />
      </div>
      <p class="desc">
        <span class="amount">零钱金额¥{{ redPacketBalance }}，</span>
        <span class="all-withdraw" @click="withdrawAll">全部提现</span>
      </p>
      <button hover-class="none" class="btn" @click="withdraw">提现</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import API from "@api";
import { onBeforeMount, ref, computed, unref } from "vue";
import { useUserInfo } from "@hooks/userHooks";
import { useTransformPrice, useNavigate } from "@hooks/commonHooks";
import { showToast } from "@utils";
const LOWER_LIMIT = 20;
const HIGHER_LIMIT = 2000;

export default {
  setup() {
    let inputAmount = ref("");
    const { fenToYuan } = useTransformPrice();
    const { userWallet, requestUserWallet } = useUserInfo();
    const { navigateBack } = useNavigate();
    onBeforeMount(() => {
      uni.showLoading();
      requestUserWallet();
      uni.hideLoading();
    });

    let redPacketBalance = computed(() => {
      return unref(userWallet).redPacketBalance / 100;
    });

    async function withdraw() {
      if (unref(inputAmount) <= LOWER_LIMIT) {
        showToast(`提现金额不得低于 ${LOWER_LIMIT} 元`);
        return;
      }
      if (unref(inputAmount) > HIGHER_LIMIT) {
        showToast(`提现金额不得高于 ${HIGHER_LIMIT}元`);
        return;
      }
      //#ifdef MP-WEIXIN
      let payMethod = "WECHAT_PAY";
      //#endif
      //#ifdef MP-ALIPAY
      let payMethod = "ALIPAY";
      //#endif
      let data = {
        amount: unref(inputAmount) * 100,
        payMethod: payMethod,
      };
      let res = await API.User.withdraw(data);
      if (res) {
        //#ifdef MP-WEIXIN
        showToast("已发起提现请求，请前往微信钱包留意到账情况");
        //#endif
        //#ifdef MP-ALIPAY
        showToast("已发起提现请求，请前往支付宝钱包留意到账情况");
        //#endif
        setTimeout(() => {
          navigateBack();
        }, 1500);
      }
    }
    async function withdrawAll() {
      inputAmount.value = unref(redPacketBalance);
    }

    function handleInput(e) {
      let { value } = e.detail,
        redPacketValue = unref(redPacketBalance);
      if (Number(value) > redPacketValue) {
        value = redPacketValue;
      } else if (value.indexOf(".") > -1) {
        let num = (value + "").split(".");
        const decimalLength = (num[1] || "").length;
        if (num.length > 2) {
          value = Number(num[0] + "." + num[1]);
        } else if (decimalLength > 2) {
          value = Number(value).toFixed(2);
        }
      }
      inputAmount.value = value;
    }

    return {
      inputAmount,
      fenToYuan,
      redPacketBalance,
      withdraw,
      withdrawAll,
      handleInput,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.withdraw {
  width: 100%;
  box-sizing: border-box;
  padding: 0 15px;

  .tips-title {
    font-size: 15px;
    color: #595959;
  }

  .tip {
    margin-top: 10px;
    font-size: 13px;
    color: #E3513F;
  }

  .withdraw-wrapper {
    box-sizing: border-box;
    margin-top: 20px;
    padding: 20px 15px;

    .title {
      font-size: 17px;
      color: #333333;
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      width: 100%;
      margin-top: 23px;
      padding-bottom: 10px;
      border-bottom-1px();

      &::before {
        content: '¥';
        display: block;
        font-size: 30px;
        font-weight: bold;
      }

      .input {
        flex: 1;
        height: 45px;
        margin-left: 15px;
        font-size: 40px;
        font-weight: bold;
      }
    }

    .desc {
      padding-top: 25px;

      .amount, .all-withdraw {
        font-size: 15px;
      }

      .amount {
        color: #888888;
      }

      .all-withdraw {
        color: #E3513F;
      }
    }

    .btn {
      height: 48px;
      line-height: 48px;
      margin-top: 20px;
      border-radius: 30px;
      text-align: center;
      font-size: 18px;
      color: white;
      background: #E3513F;
    }
  }
}
</style>
