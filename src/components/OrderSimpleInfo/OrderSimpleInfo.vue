<template>
  <div class="order-item">
    <div class="title">
      <div class="left">
        <div class="tag" v-if="orderType == 'DISH'">{{ mealType }}</div>
        <div
          class="merchant-name"
          v-if="shooMerchantName"
          @click="navigateToMerchantHome"
        >
          {{ orderInfo.merchantName }}
        </div>
      </div>
      <div class="right">{{ statusText }}</div>
    </div>
    <div class="content-wrapper">
      <div class="content">
        <scroll-view
          scroll-x
          class="order-scroll-view"
          v-if="orderType == 'DISH'"
        >
          <div
            v-for="(dishItem, index) in orderInfo.dishes"
            class="dish-item"
            :key="index"
          >
            <img
              class="img"
              :src="dishItem.imageUrl || DEFAULT_DISH_IMG"
              mode="aspectFill"
            />
            <p class="name">{{ dishItem.name }}</p>
          </div>
        </scroll-view>
        <div class="order-scroll-view" v-if="orderType == 'COUPON'">
          <div class="coupon-item">
            <img
              class="img"
              src="@assets/coupon_discount.png"
              alt=""
              mode="aspectFill"
            />
            <p class="name">{{ orderInfo.name }}</p>
          </div>
        </div>
        <div class="order-scroll-view" v-if="orderType == 'FANPIAO'">
          <div class="fanpiao-item">
            <img
              class="img"
              src="@assets/fanpiao_discount.png"
              alt=""
              mode="aspectFill"
            />
            <p class="name">{{ orderInfo.name }}</p>
          </div>
        </div>
      </div>
      <div class="total-price">
        <div class="text">{{ orderInfo.billFee / 100 }}</div>
        <div class="quantity">共{{ orderInfo.dishCount || 1 }}件</div>
      </div>
    </div>
    <div class="bottom">
      <div class="order-id">
        订单号:{{ orderId }} <span class="copy" @click="copyOrderId">复制</span>
      </div>
      <div class="summary">
        <div class="time">
          {{
            formatTme(
              orderInfo.createTime || orderInfo.paidTime,
              "yyyy/MM/dd hh:mm"
            )
          }}
        </div>
        <div class="detail" v-if="orderType == 'DISH'" @click="showDetail">
          查看详情
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, ref, unref } from "vue";
import { useNavigate, useTimeTransform } from "@hooks/commonHooks";
import { copyInfo } from "@utils";
import { DEFAULT_DISH_IMG } from "@utils/constants";
// console.log(
//   "%cconstants: ",
//   "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
//   constants
// );
// const { DEFAULT_DISH_IMG } = constants;
export default {
  props: {
    orderType: {
      type: String,
      default: "DISH",
    },
    shooMerchantName: {
      type: Boolean,
      default: true,
    },
    orderInfo: {
      type: Object,
      default: {},
    },
  },
  components: {},
  setup(props) {
    const { navigateTo } = useNavigate();
    const { formatTme } = useTimeTransform();
    const statusText = computed(() => {
      let { status } = props.orderInfo;
      let { orderType } = props;
      if (orderType == "DISH") {
        switch (status) {
          case "APPROVED":
            return "未完成";
          case "PAID":
            return "已完成";
          case "POS_RETURN":
            return "已退款";
          default:
            return "";
        }
      } else if (orderType == "FANPIAO") {
        switch (status) {
          case "INACTIVE":
            return "已完成";
          case "ACTIVE":
            return "已完成";
          case "REFUND":
            return "已退款";
          default:
            return "";
        }
      } else if (orderType == "COUPON") {
        switch (status) {
          case "NORMAL":
            return "已完成";
          case "REFUND":
            return "已退款";
          default:
            return "";
        }
      }
      return "";
    });
    const orderId = computed(() => {
      let orderInfo = props.orderInfo;
      return orderInfo.id && String(orderInfo.id).slice(0, 18);
    });

    const mealType = computed(() => {
      let { mealType } = props.orderInfo;
      switch (mealType) {
        case "EAT_IN":
          return "堂食";
        case "SELF_PICK_UP":
          return "自提";
        case "TAKE_OUT":
          return "外卖";
        case "KERUYUN_FAST_FOOD":
          return "堂食";
        case "TAKE_AWAY":
          return "外带";
        default:
          return "";
      }
    });
    return {
      formatTme,
      orderId,
      statusText,
      mealType,
      navigateToMerchantHome() {},
      showDetail() {},
      copyOrderId() {
        copyInfo(unref(orderId));
      },
      DEFAULT_DISH_IMG,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.order-item {
  .box-size(100%,unset,white);
  padding: 0 12px 12px 12px;
  margin-top: 12px;
  .title {
    .flex-simple(space-between,center);
    .line-center(40px);
    .border-bottom-1px();
    .left {
      .flex-simple(flex-start,center);
      flex: 1;
      .tag {
        .box-size(36px,20px,#eeedec);
        .line-center(20px);
        .normal-font(12px,#666260);
        text-align: center;
      }
      .merchant-name {
        .bold-font(16px,#333);
        padding-left: 8px;
      }
    }
    .right {
      .box-size(77px,100%);
      .normal-font(14px,#666);
      text-align: right;
    }
  }
  .content-wrapper {
    .box-size(100%,80px);
    .flex-simple(space-between,center);
    .content {
      flex: 1;
      .order-scroll-view {
        .box-size(100%,54px);
        .dish-item {
          .img {
            .box-size(60px,60px);
            border-radius: 4px;
            overflow: hidden;
          }
          .name {
            .line-center(20px);
            .no-wrap();
          }
        }
        .coupon-item,
        .fanpiao-item {
          .flex-simple(flex-start,center);
          .img {
            .box-size(60px,60px);
            border-radius: 4px;
            overflow: hidden;
          }
          .name {
            .line-center(20px);
            .no-wrap();
            margin-left: 8px;
          }
        }
      }
    }
    .total-price {
      .box-size(54px,unset);
      .text {
        .bold-font(14px,#333);
        .price-symbol(8px,#333);
        text-align: right;
      }
      .quantity {
        .normal-font(10px,#666);
        text-align: right;
        margin-top: 7px;
      }
    }
  }
  .bottom {
    .order-id {
      margin-top: 8px;
      .normal-font(12px,#666);
      .copy {
        color: #ed824f;
        margin-left: 7px;
      }
    }
    .summary {
      .flex-simple(space-between,center);
      .time {
        .flex-simple(space-between,center);
        .line-center(32px);
        .normal-font(12px,#666);
      }
      .detail {
        .box-size(80px,28px);
        .line-center(28px);
        .normal-font(14px,#f25643);
        border-radius: (18px);
        border: 1px solid #eb4b3a;
        text-align: center;
      }
    }
  }
}
</style>