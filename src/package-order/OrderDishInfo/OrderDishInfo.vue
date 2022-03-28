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
      <span class="name">{{ merchantInfo.name }}</span>
      <span class="count" v-if="selectedDishes.length"
        >共{{ selectedDishes.length }}件</span
      >
    </div>
    <div class="dish-list-wrapper">
      <OrderDishList />
    </div>
    <SplitLine paddingTop="16" />
    <div class="price-info">
      <div class="discount-price">有优惠<span class="num">0</span></div>
      <div class="total-price">
        小计<span class="num">{{ fenToYuan(selectedDishesTotalPrice) }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { useDish, useSkuDish } from "@hooks/menuHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import { useTransformPrice } from "@hooks/commonHooks";
import OrderDishList from "../OrderDishList/OrderDishList.vue";

export default {
  components: {
    OrderDishList,
  },
  setup() {
    let { selectedDishes, selectedDishesTotalPrice } = useDish();
    let { merchantInfo } = useMerchantInfo();
    let { genDishDescribeText } = useSkuDish();
    let { fenToYuan } = useTransformPrice();

    return {
      selectedDishes,
      selectedDishesTotalPrice,
      merchantInfo,
      genDishDescribeText,
      fenToYuan,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.order-list-container {
  .box-size(calc(100%-24px),unset,white);
  margin: 0 12px;
  padding: 0 12px;
  border-radius: 10px 10px 0 0;
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