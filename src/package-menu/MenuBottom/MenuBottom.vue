<!--
 * @Author: sunjie
 * @Date: 2022-02-16 16:27:12
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:52
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuBottom/MenuBottom.vue
-->
<template>
  <div class="menu-bottom-container">
    <div class="discount-tooltip">
      <!-- <div class="text">
        使用饭票支付,本单可再减
        <div class="price">3.1-3.41元</div>
      </div> -->
      <div class="text">
        再买
        <div class="price">2元</div>
        ,可再减
        <div class="price">1元</div>
      </div>
    </div>
    <div class="cart-wrapper">
      <div class="cart-info">
        <div class="cart-icon" @click="toggleShowCartModal(!showCartModal)">
          <span class="iconfont icon-gouwuchekong"></span>
          <div class="count" v-show="selectedDishesTotalQuantity">
            {{ selectedDishesTotalQuantity }}
          </div>
        </div>
        <div class="total-price">
          ¥{{ fenToYuan(selectedDishesTotalPrice) }}
        </div>
      </div>
      <div
        class="text-wrapper"
        :class="[selectedDishes.length > 0 ? 'has-dish' : '']"
        @click="createOrder"
      >
        {{ selectedDishes.length > 0 ? "去下单" : "请先点菜" }}
      </div>
    </div>
  </div>
</template>
<script>
import { useCart, useDish } from "@hooks/menuHooks";
import { useTransformPrice, useNavigate } from "@hooks/commonHooks";
import { unref } from "vue";

export default {
  setup() {
    const { showCartModal, toggleShowCartModal } = useCart();
    const {
      selectedDishes,
      selectedDishesTotalQuantity,
      selectedDishesTotalPrice,
    } = useDish();
    let { fenToYuan } = useTransformPrice();
    let { navigateTo } = useNavigate();
    function createOrder() {
      if (unref(selectedDishes).length > 0) {
        navigateTo("ORDER/CREATE_ORDER");
      }
    }
    return {
      toggleShowCartModal,
      showCartModal,
      selectedDishes,
      selectedDishesTotalQuantity,
      selectedDishesTotalPrice,
      fenToYuan,
      createOrder,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";

@cartHeight: 50px;

.menu-bottom-container {
  .box-size(100%,50px,transparent);
  flex-shrink: 0;
  padding: 0 12px;
  position: fixed;
  bottom: 48px;
  z-index: 100;

  .discount-tooltip {
    .box-size(calc(100% - 24px),57px,#ffebe9);
    position: absolute;
    border-radius: 8px 8px 0px 0px;
    margin-top: -25px;
    z-index: -1;
    .flex-simple(center,flex-start);
    .text {
      .flex-simple(center,center);
      .line-center(25px);
      .normal-font(12px,#333);
      .price {
        color: #ff4029;
      }
    }
  }
  .cart-wrapper {
    .box-size(calc(100vw - 24px),@cartHeight,#333);
    .flex-simple(space-between,center);
    border-radius: calc(@cartHeight / 2);
    padding-left: calc(@cartHeight / 2);
    overflow: hidden;
    margin: 0 auto;
    .cart-info {
      flex: 1;
      .flex-simple(flex-start,center);
      .cart-icon {
        position: relative;
        .icon-gouwuchekong {
          .normal-font(28px,white);
        }
        .count {
          .circle(16px,#f25643);
          .normal-font(10px,white);
          .pos-tr-absolute(-4px,-8px);
        }
      }
      .total-price {
        .bold-font(18px,white);
        margin-left: 12px;
      }
    }
    .text-wrapper {
      .box-size(108px,100%,#333);
      .line-center(@cartHeight);
      flex-basis: 108px;
      padding-right: calc(@cartHeight / 2);
      .bold-font(16px, rgba(255, 255, 255, 0.5));
      text-align: right;
      &.has-dish {
        background: #ff4029;
        color: white;
      }
    }
  }
}
</style>