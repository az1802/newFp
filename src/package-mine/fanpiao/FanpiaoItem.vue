<!--
 * @Author: your name
 * @Date: 2021-03-24 15:17:27
 * @LastEditTime: 2022-03-07 16:07:56
 * @LastEditors: sunj
 * @Description: In User Settings Edit
 * @FilePath: /fanpiao_uniapp/src/package-mine/fanpiao/fanpiaoItem.vue
-->
<template>
  <div class="fanpiao-item">
    <div class="info" :class="fanpiao.presentValue == 0 ? 'disable' : ''">
      <div class="info-left">
        <div class="fanpiao-name">{{ fanpiao.name }}</div>
        <div class="merchant-name">{{ fanpiao.merchantName }}</div>
      </div>
      <div class="info-right">
        <div class="text">余额:</div>
        <div class="amount">
          {{
            fanpiao.presentValue == 0
              ? '已用完'
              : parseFloat(fanpiao.presentValue / 100)
          }}
        </div>
      </div>
    </div>
    <div class="operation">
      <div>
        <div class="id-text">
          饭票ID:{{ fanpiao.id.slice(0, 6) }}
          <div class="copy-btn" @click="copy(fanpiao)">复制</div>
        </div>
        <div class="buy-time">购买日期 : {{ buyTimeText }}</div>
      </div>
      <div class="btn-group">
        <div
          class="refund-btn"
          v-if="
            fanpiao.presentValue !== 0 &&
            fanpiao.enableFanpiaoBalanceRefund &&
            !balanceRefundApply
          "
          @click="applyRefund(fanpiao)"
        >
          申请退款
        </div>
        <div
          class="refund-btn"
          v-else-if="
            fanpiao.presentValue !== 0 &&
            fanpiao.enableFanpiaoBalanceRefund &&
            balanceRefundApply
          "
        >
          退款中
        </div>
        <div class="transaction-details" @click="viewFanpiaoDetail(fanpiao)">
          交易详情
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from '@api';
import { showToast, showConfirmModal, formatTime } from '@utils';
import { useRefund } from '@hooks/merchantHooks';
import { useNavigate } from '@hooks/commonHooks';
import { copyInfo } from '@utils';
import { computed } from 'vue';
export default {
  name: 'fanpiao-item',
  props: {
    fanpiao: {
      type: Object,
      default: {
        name: '',
        buuyTime: '',
        id: '',
        merchantId: '',
        merchantName: '',
        presentValue: '', //余额
        sellPrice: '',
        totalValue: '',
        balanceRefundApply: false,
        enableFanpiaoBalanceRefund: false,
      },
    },
  },
  setup(props) {
    const { refundFanpiaoApply } = useRefund();
    const { navigateTo } = useNavigate();
    const buyTimeText = computed(() => {
      return (
        (props?.fanpiao?.buyTime &&
          formatTime(props.fanpiao.buyTime, 'yyyy/MM/dd hh:mm')) ||
        ''
      );
    });
    const balanceRefundApply = computed(() => {
      return props.fanpiao.balanceRefundApply || false;
    });
    async function applyRefund(fanpiao) {
      let confirm = await showConfirmModal('是否确定申请饭票退款');
      if (confirm) {
        let res = await refundFanpiaoApply({
          fanpiaoId: fanpiao.id,
          merchantId: fanpiao.merchantId,
          userId: 'd4848915-b103-4e1a-abfd-a04886fa61e6',
        });
        res && showToast('饭票退款申请成功');
      }
    }
    function viewFanpiaoDetail(fanpiao) {
      navigateTo('MINE/FANPIAO_TRANSACTION_DETAIL', {
        merchantId: fanpiao.merchantId,
        fanpiaoId: fanpiao.id,
      });
    }
    function copy(fanpiaoInfo) {
      console.log('fanpiaoInfo: ', fanpiaoInfo);
      copyInfo(fanpiaoInfo.id && fanpiaoInfo.id.slice(0, 6));
    }
    return {
      applyRefund,
      viewFanpiaoDetail,
      buyTimeText,
      balanceRefundApply,
      copy,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.fanpiao-item {
  width: 100%;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;

  .info {
    min-height: 69px;
    background: linear-gradient(to right, #EB7B3A, #EB4B3A);
    display: flex;
    justify-content: space-between;
    padding: 12px 12px 0px 12px;
    box-sizing: border-box;

    &.disable {
      opacity: 0.5;
    }

    .info-left {
      .fanpiao-name {
        font-size: 16px;
        height: 24px;
        line-height: 24px;
        font-weight: bold;
        color: white;
      }

      .merchant-name {
        font-size: 14px;
        color: white;
        min-height: 21px;
        line-height: 21px;
        margin-top: 2px;
      }
    }

    .info-right {
      padding-top: 6.5px;
      min-width: 140px;
      text-align: right;

      .text {
        font-size: 14px;
        color: white;
        display: inline-block;
        width: 42px;
        margin-top: 13px;
      }

      .amount {
        font-size: 24px;
        font-weight: bold;
        color: white;
        display: inline-block;
        height: 34px;
        margin-top: 6.5px;

        &:before {
          content: '¥';
          font-size: 14px;
          font-weight: 300;
        }
      }
    }
  }

  .operation {
    height: 52px;
    background-color: white;
    display: flex;
    align-items: center;
    color: #666666;
    justify-content: space-between;
    padding: 0 12px;

    .id-text{
      margin-top:4px;
      font-size:12px;
      color: #666666;
      display flex
      .copy-btn{
       color: #ed824f;
       margin-left:7px;
      }
    }
    .buy-time {
      font-size: 12px;
      color: #666666;
    }

    .btn-group {
      .transaction-details, .refund-btn {
        display: inline-block;
        text-align: center;
        min-width: 64px;
        height: 28px;
        line-height: 28px;
        border-radius: 14px;
        border: 0.5px solid #666666;
        font-size: 12px;
        color: #666666;

        &.refund-btn {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
