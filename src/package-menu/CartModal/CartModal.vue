<!--
 * @Author: sunjie
 * @Date: 2022-02-15 15:44:59
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-16 17:51:55
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/CartModal/CartModal.vue
-->
<template>
  <div
    class="modal-wrapper"
    v-show="showCartModal"
    @click="toggleShowCartModal(false)"
  >
    <div class="cart-container" @click.stop="noop">
      <div class="title"><span class="iconfont icon-guanbi1"></span>清空</div>
      <div class="dish-list-wrapper">
        <div
          class="dish-info"
          v-for="(dish, index) in selectedDishes"
          :key="dish.id + index"
        >
          <img :src="dish.thumbImage" alt="" class="img" mode="aspectFill" />
          <div class="info">
            <div class="name">{{ dish.name }}</div>
            <!-- <div v-if="dish.attrs">
            {{ dish.attrs.map((item) => item.name).join("-") }}
          </div>
          <div
            v-if="dish.supplyCondiments"
            v-for="condiment in dish.supplyCondiments"
            :key="condiment.id"
          >
            {{ condiment.name }}---{{ condiment.quantity }}
          </div> -->
            <div class="price">{{ dish.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { noop } from "@utils/common";
import { useState, useMutations } from "@utils/storeHooks";
export default {
  setup() {
    const { showCartModal, selectedDishes } = useState("menu", [
      "selectedDishes",
      "showCartModal",
    ]);
    const { toggleShowCartModal } = useMutations("menu", [
      "toggleShowCartModal",
    ]);
    return {
      showCartModal,
      toggleShowCartModal,
      selectedDishes,
      noop,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.modal-wrapper {
  z-index: 10;
}
.cart-container {
  .box-size(100%,100px,white);
  min-height: 200px;
  max-height: 400px;
  .pos-bl-absolute(0,0);
  border-radius: 10px 10px 0 0;
  padding-bottom: 102px;
  .title {
    .box-size(100%,42px,#f8f8f8);
    .flex-simple(flex-start,center);
    .normal-font(14px,red);
    padding-left: 12px;
  }
  .dish-list-wrapper {
    .dish-info {
      display: flex;
      padding: 7.5px 0;
      .img {
        .box-size(80px,80px,#eee);
        border-radius: 3px;
        overflow: hidden;
        margin-right: 10px;
      }
      .info {
        .flex-between(column);
        .name {
          .bold-font(17px,#333);
        }
        .price {
          .bold-font(17px,#f25643);
          .price-symbol();
        }
      }
    }
  }
}
</style>