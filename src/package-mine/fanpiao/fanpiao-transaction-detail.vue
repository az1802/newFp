<!--
 * @Author: your name
 * @Date: 2021-03-24 16:48:35
 * @LastEditTime: 2022-02-24 10:54:35
 * @LastEditors: sunj
 * @Description: In User Settings Edit
 * @FilePath: /fanpiao_uniapp/src/package-mine/fanpiao/fanpiao-transaction-detail.vue
-->
<template>
  <div class="fanpiao-transaction-detail">
    <NavigationBar title="饭票交易记录" />
    <div class="detail-top">
      <div class="info-wrapper">
        <div class="info-left">
          <p class="fanpiao-name">{{ fanpiaoInfo.name }}</p>
          <p class="merchant-name">{{ fanpiaoInfo.merchantName }}</p>
          <p class="buy-time">购买日期: {{ fanpiaoInfo.buyTimeText || "" }}</p>
        </div>
        <div class="info-right">
          <div class="text">余额:</div>
          <div class="amount">{{ parseFloat(fanpiaoInfo.balance / 100) }}</div>
        </div>
      </div>
    </div>
    <div class="detail-bottom">
      <div class="title border-bottom-1px">交易详情</div>
      <div class="detail-wrapper">
        <div
          class="detail-item border-bottom-1px"
          v-for="usageItem in fanpiaoUsageDetail"
          :key="usageItem.transactionId"
        >
          <div class="detail-left">
            <div class="transaction-type">
              {{ usageItem.transactionTypeText }}
            </div>
            <div class="time">{{ usageItem.paidTimeText }}</div>
          </div>
          <div class="detail-right amount">
            {{ usageItem.paidFeeText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatTime } from "@utils";
import { onBeforeMount, ref } from "vue";
import API from "@api";
// import API from "@api";
let fanpiaoId, merchantId;
export default {
  async onLoad(opts) {
    fanpiaoId = opts.fanpiaoId;
    merchantId = opts.merchantId;
  },
  setup() {
    let fanpiaoUsageDetail = ref([]),
      fanpiaoInfo = ref({});
    async function requestFanpiaoTransactionDetail() {
      let res = await API.Merchant.getFanpiaoTransactionDetail(merchantId, {
        fanpiaoId,
      });
      if (res) {
        res.fanpiaoUsageDetail.forEach((item) => {
          item.paidTimeText = formatTime(item.paidTime, "yyyy/MM/dd hh:mm");

          if (item.transactionType == "ORDERING_REFUND") {
            item.transactionTypeText = "退款";
          } else if (item.transactionType == "SELF_DISH_ORDER_PAYMENT") {
            item.transactionTypeText = "消费";
          } else if (item.transactionType == "FANPIAO_BALANCE_WITHDRAW") {
            item.transactionTypeText = "退回微信零钱";
          } else {
            item.transactionTypeText = "消费";
          }

          item.paidFeeText =
            (item.transactionType == "ORDERING_REFUND" ? "+" : "-") +
            parseFloat(item.paidFee / 100);
        });
        res.buyTimeText = formatTime(res.buyTime, "yyyy/MM/dd hh:mm");
      }
      fanpiaoInfo.value = res;
      fanpiaoUsageDetail.value = res.fanpiaoUsageDetail;
    }
    onBeforeMount(() => {
      requestFanpiaoTransactionDetail();
    });

    return {
      fanpiaoUsageDetail,
      fanpiaoInfo,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.fanpiao-transaction-detail {
  box-sizing: border-box;

  .detail-top {
    width: 100%;
    padding: 16px 12px 0 12px;
    box-sizing: border-box;
    background-color: #f8f8f8;

    .info-wrapper {
      width: 100%;
      border-radius: 8px 8px 0 0;
      height: 93px;
      background: linear-gradient(to right, #EB7B3A, #EB4B3A);
      display: flex;
      justify-content: space-between;
      padding: 12px 12px 0px 12px;
      box-sizing: border-box;

      .info-left {
        .fanpiao-name {
          height: 24px;
          line-height: 24px;
          font-size: 16px;
          color: #ffffff;
        }

        .merchant-name {
          height: 21px;
          line-height: 21px;
          margin-top: 2px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
        }

        .buy-time {
          margin-top: 6px;
          height: 16px;
          line-height: 16px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .info-right {
        display: flex;
        align-items: flex-end;
        margin-top: 17.5px;
        height: 34px;
        box-sizing: border-box;

        .text {
          width: 42px;
          font-size: 14px;
          color: white;
          margin-top: 13px;
          line-height: 34px;
        }

        .amount {
          font-size: 24px;
          font-weight: bold;
          color: white;
          display: inline-block;
          line-height: 34px;

          &:before {
            content: '¥';
            font-size: 14px;
            font-weight: 300;
            margin-right: 1px;
          }
        }
      }
    }
  }

  .detail-bottom {
    box-sizing: border-box;
    padding: 0 12px;

    .title {
      height: 45px;
      line-height: 45px;
      color: #666666;
      font-size: 14px;
    }

    .detail-wrapper {
      .detail-item {
        height: 58px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .detail-left {
          .transaction-type {
            height: 24px;
            line-height: 24px;
            font-size: 16px;
            color: #333333;
          }

          .time {
            font-size: 12px;
            color: #666666;
          }
        }

        .detail-right {
          font-size: 18px;
          color: #333333;
        }
      }
    }
  }
}
</style>