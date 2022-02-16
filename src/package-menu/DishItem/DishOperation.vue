<!--
 * @Author: sunjie
 * @Date: 2022-02-11 11:32:44
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 17:15:01
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/DishItem/DishOperation.vue
-->
<template>
  <div class="container">
    <div class="sku" v-if="isSku" @click="showSkuDish">
      选规格
      <div v-show="quantity" class="quantity">{{ quantity }}</div>
    </div>
    <QuantityOperation v-else :num="quantity" @add="add" @reduce="reduce" />
  </div>
</template>
<script>
import { getDishInfoById } from "@utils/common.js";
import { useState, useGetters, useMutations } from "@utils/storeHooks";
import { computed, watch, ref } from "vue";
export default {
  props: {
    dishId: {
      type: String,
      default: "",
    },
    isSku: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, context) {
    let { dishId, isSku } = props;
    let { dishCountMap } = useGetters("menu", ["dishCountMap"]);
    let { addDish, reduceDish, setCurSkuDish, toggleShowSkuModal } =
      useMutations("menu", [
        "addDish",
        "reduceDish",
        "setCurSkuDish",
        "toggleShowSkuModal",
      ]);
    let quantity = ref(0);

    watch(dishCountMap, (nval) => {
      //使用watch,优惠更新当前菜品组件
      quantity.value = (nval && nval[dishId]) || 0;
    });

    return {
      quantity,
      add() {
        let dishInfo = getDishInfoById(dishId);
        addDish(dishInfo);
      },
      reduce() {
        reduceDish(dishId);
      },
      showSkuDish() {
        let dishInfo = getDishInfoById(dishId);
        setCurSkuDish(dishInfo);
        toggleShowSkuModal(true);
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
  .pos-br-absolute(10px,10px);
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