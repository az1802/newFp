<template>
  <div class="make-deposit">
    <NavigationBar
      title="充值"
      backgroundColor="#F56F61"
      titleColor="white"
      iconColor="white"
    />
    <div class="top-bg">
      <p class="balance">￥{{ (depositBalance / 100).toFixed(2) }}</p>
      <p class="balance-desc">当前余额(元)</p>
    </div>

    <div class="selection-wrapper">
      <p class="selection-title">选择储值金额</p>
      <div class="display-area">
        <div
          v-for="(config, index) in rechargeConfigs"
          :key="index"
          :class="config.id === selectedCategory.id ? 'selected' : 'unselected'"
          @click="selectedCategory = config"
        >
          <p class="title">充{{ config.sellPrice / 100 }}元</p>
          <p class="gift">
            赠送+{{ (config.amount - config.sellPrice) / 100 }}元
          </p>
          <p class="total">(一共可得{{ config.amount / 100 }}元)</p>
        </div>
      </div>
    </div>

    <div class="buy-wrapper">
      <div class="rules-wrapper" @click="navigateTo('OTHER/DEPOSIT_RULES')">
        <span class="rules-title"
          >完成储值即表示您同意《商家储值服务用户协议》</span
        >
        <span class="rules-link"> >> </span>
      </div>
      <div class="btn-wrapper">
        <div class="btn" v-if="!selectedCategory.id" @click="pay">确认充值</div>
        <div class="btn" v-else @click="pay">
          ￥{{ selectedCategory.sellPrice / 100 }} 确认充值
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import API from "@api";
import { ref, computed, onBeforeMount, unref } from "vue";
import { useNavigate } from "@hooks/commonHooks";
import { useStorePay } from "@hooks/payHooks";
import { showToast, sleep } from "@utils";

export default {
  setup() {
    let { navigateTo, navigateBack } = useNavigate();
    let { buyStoredVal } = useStorePay();
    let depositBalance = ref(0),
      selectedCategory = ref({}),
      rechargeConfigs = ref([]);

    onBeforeMount(async () => {
      let merchantId = uni.getStorageSync("merchantId");
      let balanceRes = await API.User.getUserMemberBalance(merchantId);
      depositBalance.value = balanceRes.balance;
    });
    onBeforeMount(async () => {
      let merchantId = uni.getStorageSync("merchantId");
      let rechargeList = await API.Merchant.getRechargeConfigs(merchantId);
      console.log(
        "%crechargeList: ",
        "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
        rechargeList
      );
      rechargeConfigs.value = rechargeList;
    });
    async function pay() {
      if (!unref(selectedCategory).id) {
        await showToast("请选择充金额");
        return;
      }
      let merchantId = uni.getStorageSync("merchantId");
      let payRes = await buyStoredVal(merchantId, unref(selectedCategory));
      showToast(payRes ? "充值成功" : "充值失败，请稍后再试");
      if (payRes) {
        await sleep(1500);
        navigateBack();
      }
    }
    return {
      pay,
      depositBalance,
      selectedCategory,
      navigateTo,
      rechargeConfigs,
    };
  },
};
</script>

<style>
page {
  background: #f8f8f8;
}
</style>

<style scoped lang="stylus" rel="stylesheet/stylus">
.make-deposit {
  width: 100%;

  .top-bg {
    height: 132px;
    background: linear-gradient(180deg, rgba(245, 111, 97, 1) 0%, rgba(235, 75, 58, 0.9) 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .balance {
      color: white;
      font-size: 36px;
    }

    .balance-desc {
      color: white;
      font-size: 13px;
      margin-top: 10px;
    }
  }

  .selection-wrapper {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: white;

    .selection-title {
      font-size: 18px;
    }

    .display-area {
      display: flex;
      justify-content: space-evenly;
      flex-wrap: wrap;

      .selected {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 45%;
        height: 100px;
        border-radius: 5px;
        background: linear-gradient(138deg, rgba(254, 135, 70, 1) 0%, rgba(229, 33, 24, 1) 100%);
        font-family: 'PingFangSC-Medium';
        margin: 20px 0;

        .title {
          color: white;
          font-size: 20px;
        }

        .gift {
          color: white;
          font-size: 15px;
          margin-top: 10px;
        }

        .total {
          color: white;
          font-size: 15px;
          margin-top: 10px;
        }
      }

      .unselected {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 45%;
        height: 100px;
        border: 1px solid #F25643;
        border-radius: 5px;
        font-family: 'PingFangSC-Medium';
        margin: 20px 0;

        .title {
          color: #F25643;
          font-size: 20px;
        }

        .gift {
          color: #F25643;
          font-size: 15px;
          margin-top: 10px;
        }

        .total {
          color: #F25643;
          font-size: 16px;
          margin-top: 10px;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }

      .recharge-config {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 45%;
        height: 100px;
        border: 1px solid #F25643;
        border-radius: 5px;
        font-family: 'PingFangSC-Medium';
        margin: 20px 0;
        color: white;

        .title {
          font-size: 20px;
        }

        .gift {
          font-size: 15px;
          margin-top: 10px;
        }

        .total {
          font-size: 16px;
        }

        .content-wrapper {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }

  .buy-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 5px;
    padding: 20px;
    background-color: white;

    .rules-wrapper {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin: 0px 20px;
      padding: 0px 20px;

      .rules-title {
        font-size: 13px;
      }

      .rules-link {
        font-size: 16px;
        color: #666666;
      }
    }

    .btn-wrapper {
      width: 100%;
      height: 45px;
      margin-top: 30px;
      padding: 0 25px;

      .btn {
        height: 45px;
        line-height: 45px;
        border-radius: 25px;
        text-align: center;
        font-family: 'PingFangSC-Medium';
        font-size: 18px;
        color: white;
        background: #F25643;
      }
    }
  }
}
</style>
