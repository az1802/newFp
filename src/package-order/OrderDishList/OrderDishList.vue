<!--
 * @Author: sunjie
 * @Date: 2022-02-18 13:50:02
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 16:22:27
 * @FilePath: /new-fanpiao-uniapp/src/package-order/OrderDishList/OrderDishList.vue
-->
<template>
  <div class="dish-list">
    <div class="dish-item" v-for="(dishItem, index) in dishList" :key="index">
      <div class="left">
        <img class="img" :src="dishItem.image" mode="aspectFill" alt="" />
        <div class="info">
          <div class="name">{{ dishItem.name }}</div>
          <div class="text">{{ genDishDescribeText(dishItem) }}</div>
        </div>
      </div>
      <div class="right">
        <div class="price">{{ fenToYuan(dishItem.price) }}</div>
        <div class="quantity">{{ dishItem.quantity }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { useDish, useSkuDish } from "@hooks/menuHooks";
import { useTransformPrice } from "@hooks/commonHooks";
export default {
  props: {
    dishList: {
      type: [Array],
      default: [],
    },
  },
  components: {},
  setup() {
    const { genDishDescribeText, calcSkuDishPrice } = useSkuDish();
    let { fenToYuan } = useTransformPrice();
    return {
      genDishDescribeText,
      fenToYuan,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.dish-list {
  width: 100%;
  height: 100%;
  .dish-item {
    .flex-between();
    min-height: 40px;
    max-height: 100px;
    margin-bottom: 16px;
    .left {
      flex: 1;
      .flex-simple(flex-start);
      .img {
        .box-size(40px,40px);
        flex-basis: 40px;
        margin-right: 8px;
        border-radius: 2px;
      }
      .info {
        .flex-between(column);
        .name {
          .bold-font(16px,#333130);
          .no-wrap();
        }
        .text {
          .normal-font(12px,#999);
        }
      }
    }
    .right {
      flex-basis: 70px;
      .flex-between(column);
      text-align: right;
      .price {
        .bold-font(17px,#333);
        .price-symbol(12px,#333);
      }
      .quantity {
        .normal-font(14px,#999);
        text-align: right;
        .mul-symbol(10px,#999);
      }
    }
  }
}
</style>