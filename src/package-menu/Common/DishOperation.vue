<!--
 * @Author: sunjie
 * @Date: 2022-02-11 11:32:44
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 19:29:07
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/DishItem/DishOperation.vue
-->
<template>
  <div class="container">
    <div class="sku" v-if="isSku" @click.stop="showSkuDish">
      选规格
      <div v-show="quantity" class="quantity">{{ quantity }}</div>
    </div>
    <QuantityOperation
      v-else
      :num="quantity"
      @add="add"
      @reduce="reduce"
      :disableAdd="disableAdd"
    />
  </div>
</template>
<script>
import { computed, watch, ref, watchEffect } from "vue";
export default {
  props: {
    isSku: {
      type: Boolean,
      default: false,
    },
    quantity: {
      type: [Number, String],
      default: 0,
    },
    disableAdd: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    return {
      add() {
        emit("add");
      },
      reduce() {
        emit("reduce");
      },
      showSkuDish() {
        emit("selSku");
      },
    };
  },
  updated() {
    // console.log("菜品组件发生更新");
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.container {
  .pos-br-absolute(0px,0px);
  .sku {
    .normal-font(12px,white);
    .btn(28px);
    .quantity {
      .circle(16px,#f25643);
      .normal-font(12px,white);
      .pos-tr-absolute(-8px,0px);
      border: 1px solid white;
    }
  }
}
</style>