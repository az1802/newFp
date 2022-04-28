<!--
 * @Author: sunjie
 * @Date: 2022-02-18 15:43:51
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:32:52
 * @FilePath: /new-fanpiao-uniapp/src/package-order/OrderDishInfo/OrderDishInfo.vue
-->
<template>
  <div class="order-list-container">
    <div class="info">
      <span class="name">{{ merchantName }}</span>
      <span class="count" v-if="dishList.length"
        >共{{ dishList.length }}件</span
      >
    </div>
    <div class="dish-list-wrapper">
      <OrderDishList :dishList="dishList" :showBatchNumber="showBatchNumber" />
    </div>
    <CouponReduce :showUseCoupon="showUseCoupon" />
    <SplitLine paddingTop="16" />
    <div class="price-info">
      <div class="discount-price">
        已优惠<span class="num">{{ fenToYuan(discountPrice) }}</span>
      </div>
      <div class="total-price">
        小计<span class="num">{{ fenToYuan(totalPrice - discountPrice) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { useDish, useSkuDish } from "@hooks/menuHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import { fenToYuan } from "@utils";
import OrderDishList from "../OrderDishList/OrderDishList.vue";
import CouponReduce from "../CouponReduce/CouponReduce.vue";

export default {
  components: {
    OrderDishList,
    CouponReduce,
  },
  props: {
    merchantName: {
      type: [String],
      default: "",
    },
    dishList: {
      type: [Array],
      default: [],
    },
    discountPrice: {
      type: [String, Number],
      default: "",
    },
    totalPrice: {
      type: [String, Number],
      default: "",
    },
    showBatchNumber: {
      type: Boolean,
      default: false,
    },
    showCouponInfo: {
      type: Boolean,
      default: false,
    },
    showUseCoupon: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    let { merchantInfo } = useMerchantInfo();

    return {
      merchantInfo,
      fenToYuan,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.order-list-container {
  .box-size(calc(100% - 24px),unset,white);
  margin: 0 auto;
  padding: 0 12px;
  border-radius: 10px;
  .info {
    .flex-simple(space-between,center);
    .box-size(100%,46px);
    .name {
      .normal-font(18px,#333130);
      .no-wrap();
    }
    .count {
      .normal-font(12px,#666);
    }
  }
  .dish-list-wrapper {
  }
  .price-info {
    .flex-simple(flex-end,center);
    padding: 12px 0 16px 0;
    height: 20px;
    .discount-price {
      .normal-font(14px,#333);
      .num {
        .bold-font(14px,#f25643);
        .price-symbol(8px);
        margin-left: 4px;
      }
    }
    .total-price {
      margin-left: 12px;
      align-self: flex-end;
      .normal-font(14px,#333);
      .num {
        .bold-font(20px,#333);
        .price-symbol(12px,#333);
        margin-left: 6px;
      }
    }
  }
}
</style>