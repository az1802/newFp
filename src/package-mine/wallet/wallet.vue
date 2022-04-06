<template>
  <div class="wallet">
    <NavigationBar
      title="钱包"
      titleColor="white"
      iconColor="white"
      backgroundColor="linear-gradient(90deg, #fc8b56 0%, #ff5b47 100%);"
    />
    <div class="top-bg">
      <p class="total-balance-desc">总资产(元)</p>
      <p class="total-balance">
        {{ Number((totalBalance || 0) / 100).toFixed(2) }}
      </p>
    </div>
    <div class="section-wrapper">
      <div class="section-item border-bottom-1px">
        <div class="section-content">
          <div class="title">
            <span class="text">饭票余额</span>
          </div>
          <div class="amount">
            {{ Number((userWallet.fanpiaoBalance || 0) / 100).toFixed(2) }}
          </div>
        </div>
        <div class="btn" @click="navigateTo('MINE/FANPIAO')">查看</div>
      </div>

      <div class="section-item">
        <div class="section-content">
          <div class="title">
            <span class="text">红包余额</span>
          </div>
          <div class="amount">
            {{ Number((userWallet.redPacketBalance || 0) / 100).toFixed(2) }}
          </div>
          <div class="cash-out" @click="navigateTo('MINE/RED_PAPER_OVERVIEW')">
            红包明细 >
          </div>
        </div>
        <div class="btn redpacket-btn" @click="navigateTo('MINE/RED_PAPER')">
          提现
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useNavigate } from "@hooks/commonHooks";
import { useUserInfo } from "@hooks/userHooks";
import { computed, onBeforeMount, unref } from "vue";
export default {
  setup() {
    const { navigateTo } = useNavigate();
    const { userWallet, requestUserWallet } = useUserInfo();
    const totalBalance = computed(() => {
      return (
        parseFloat(unref(userWallet).fanpiaoBalance) +
        parseFloat(unref(userWallet).redPacketBalance)
      );
    });
    onBeforeMount(() => {
      requestUserWallet();
    });
    return {
      navigateTo,
      userWallet,
      totalBalance,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.wallet {
  width: 100%;
  height: 100vh;
  background: #f8f8f8;

  .top-bg {
    height: 104px;
    background: linear-gradient(90deg, #FC8B56 0%, #FF5B47 100%);
    display: flex;
    flex-direction: column;
    padding: 8px 0 0 12px;
    box-sizing: border-box;

    .total-balance-desc {
      color: white;
      font-size: 16px;
      height: 24px;
      line-height: 24px;
      font-weight: bold;
    }

    .total-balance {
      color: white;
      font-size: 40px;
      height: 60px;
      line-height: 60px;
      font-weight: bold;
    }
  }

  .section-wrapper {
    padding: 0 12px;
    box-sizing: border-box;
    background-color: white;
    background-clip: border-box;

    .section-item {
      width: 100%;
      box-sizing: border-box;
      padding: 16px 0px 16px 0px;
      background: white;
      display: flex;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: 0px;
      }

      .section-content {
        flex: 1;

        .title {
          font-size: 16px;
          color: #333333;

          .icon {
            width: 16px;
            height: 16px;
            position: relative;
            top: 2px;
          }

          .text {
            font-size: 16px;
            color: #333333;
          }
        }

        .amount {
          font-size: 22px;
          color: #333333;
          margin-top: 12px;
          font-weight: bold;
        }

        .cash-out {
          height: 16px;
          line-height: 16px;
          color: #666666;
          font-size: 12px;
          margin-top: 2px;
        }
      }

      .btn {
        flex-basis: 54px;
        width: 54px;
        height: 27px;
        line-height: 27px;
        border-radius: 22.5px;
        text-align: center;
        font-size: 15px;
        color: white;
        background: #F25643;
        margin-top: 11.5px;

        &.redpacket-btn {
          margin-top: 20.5px;
        }
      }
    }
  }
}
</style>
