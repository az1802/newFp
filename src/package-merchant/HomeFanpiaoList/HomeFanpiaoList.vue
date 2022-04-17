<template>
  <div class="fanpiao-info-wrapper" v-if="fanpiaoList.length">
    <div class="title">
      超值饭票
      <view
        class="view-detail"
        @click="navigateTo('OTHER/FANPIAO_RULES')"
        style="display: inline-block"
        >购买须知 ></view
      >
    </div>
    <div class="fanpiao-list-wrapper">
      <div
        class="fanpiao-item"
        v-for="(fanpiaoItem, index) in fanpiaoList"
        :key="index"
      >
        <div class="info">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/openScreen/fanpiaoBackground_08.png"
            alt=""
            mode="aspectFill"
            class="img"
          />
          <div class="discount-text">
            {{ (100 - fanpiaoItem.discount) / 10 }}
          </div>
          <div class="text">买单优惠</div>
        </div>
        <div class="detail-wrapper">
          <div class="top-info">
            <div class="name">{{ fanpiaoItem.name }}</div>
            <div class="text">长期有效</div>
          </div>
          <div class="price">
            <span class="company-price">{{
              fenToYuan(fanpiaoItem.sellPrice)
            }}</span>
          </div>
        </div>
        <div
          class="operation"
          :class="disableShowFanpiaoPurchaseNumber ? 'only-buy' : ''"
        >
          <div class="buy" @click="buyFanpiao(fanpiaoItem, merchantId)">
            抢购
          </div>
          <div class="sell-count" v-if="!disableShowFanpiaoPurchaseNumber">
            {{
              (fanpiaoCountArr[index] || 0) +
              parseInt(fanpiaoItem.sellingQuantity * fanpiaoSalesBoostFactor)
            }}人已购
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoPay } from "@hooks/payHooks";
import { fenToYuan } from "@utils";
const fanpiaoCountArr = [20, 50, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; //饭票数量初始化
export default {
  props: {
    merchantId: {
      type: String,
      default: "",
    },
    fanpiaoList: {
      type: [Object, Array],
      default: [],
    },
    disableShowFanpiaoPurchaseNumber: {
      type: Boolean,
      default: false,
    },
    fanpiaoSalesBoostFactor: {
      type: Number,
      default: 1,
    },
  },
  components: {},
  setup() {
    const { navigateTo } = useNavigate();
    const { buyFanpiao } = useFanpiaoPay();

    return {
      navigateTo,
      fanpiaoCountArr,
      fenToYuan,
      buyFanpiao,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.fanpiao-info-wrapper {
  margin: 10px 12px 0px 12px;
  box-sizing: border-box;
  background-color: white;
  border-radius: 8px;
  margin-bottom: 17px;

  .title {
    font-size: 14px;
    color: #333333;
    padding: 12px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;

    .view-detail {
      font-size: 12px;
      color: #999999;
      text-align: right;

      float right {
      }
    }
  }

  .fanpiao-list-wrapper {
    width: 100%;

    .fanpiao-item {
      width: 100%;
      height: 95px;
      background-color: white;
      display: flex;
      box-sizing: border-box;
      position: relative;

      &:after {
        content: '';
        position: absolute;
        left: 12px;
        right: 12px;
        height: 1px;
        bottom: 0;
        background: #EEEBE9;
      }

      &:last-child {
        &:after {
          height: 0px;
        }
      }

      .info {
        width: 91.5px;
        flex-basis: 91.5px;
        height: 95px;
        position: relative;
        border-radius: 4px;

        .discount-text {
          position: absolute;
          left: 50%;
          top: 21px;
          transform: translateX(-50%);
          font-size: 26px;
          white-space: nowrap;
          color: #FFFFFF;
          z-index: 100;

          &:after {
            content: '折';
            font-size: 12px;
            color: #FFFFFF;
            margin-left: 1px;
          }
        }

        .text {
          position: absolute;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          z-index: 10;
          font-size: 11px;
          color: #FFFFFF;
          white-space: nowrap;
        }

        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }

      .detail-wrapper {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0 20px 0px;

        .top-info {
          .name {
            font-size: 16px;
            flex-basis: 16px;
            height: 16px;
            color: #333333;
            font-weight: bold;
            no-wrap();
          }

          .text {
            font-size: 11px;
            color: #F25643;
            border-radius: 2px;
            margin-top: 7px;
            background-color: rgba(235, 75, 58, 0.1);
            display: inline-block;
            width: 44px;
            height: 16px;
            line-height: 16px;
            padding: 1px 2px;
          }

          .detail {
            font-size: 11px;
            margin-top: 6px;
            color: #666666;
            no-wrap();
          }

          .info-tooltip {
            font-size: 11px;
            background-image: -webkit-linear-gradient(right, #EB783A, #F25643);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-top: 8px;
          }
        }

        .price {
          margin-top: 6px;
          font-size: 16px;
          color: #F25643;

          .company-price {
            font-weight: bold;
            line-height: 16px;
            company-price();
          }

          .no-discount-pirce {
            font-size: 10px;
            margin-left: 2px;
            color: #999999;
            text-decoration: line-through;
            font-weight: bold;
            company-price(#999999);
          }
        }
      }

      .operation {
        flex-basis: 80px;
        width: 80px;
        display: flex;
        flex-direction: column;
        padding-top: 24.5px;

        &.only-buy {
          justify-content: center;
          padding-top: 0px;
        }

        .buy {
          width: 60px;
          height: 28px;
          font-size: 14px;
          color: white;
          background-color: #F25643;
          text-align: center;
          line-height: 28px;
          border-radius: 14px;
          align-self: center;
        }

        .sell-count {
          color: #999999;
          font-size: 12px;
          margin-top: 8px;
          text-align: center;
          align-self: flex-end;
          width: 100%;
          text-align: center;
        }
      }
    }
  }
}
</style>