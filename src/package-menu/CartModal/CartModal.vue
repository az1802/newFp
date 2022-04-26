<!--
 * @Author: sunjie
 * @Date: 2022-02-15 15:44:59
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 14:42:35
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/CartModal/CartModal.vue
-->
<template>
  <div
    class="modal-wrapper"
    v-show="showCartModal"
    @click="toggleShowCartModal(false)"
  >
    <div class="cart-container" @click.stop="noop">
      <div class="title">
        <div class="text-wrapper" @click="resetSelDishes([])">
          <span class="iconfont icon-shanchu"></span>清空
        </div>
      </div>
      <scroll-view class="dish-list-wrapper" :scroll-y="true">
        <div
          class="dish-info"
          v-for="(dish, index) in selectedDishes"
          :key="dish.id + index"
        >
          <img :src="dish.thumbImage" alt="" class="img" mode="aspectFill" />
          <div class="info">
            <div class="name">
              {{ dish.name }}
              <div v-if="dish.isSku" class="describe-text">
                {{ genDishDescribeText(dish) }}
              </div>
            </div>
            <div class="price">
              <div class="current-price">
                {{ fenToYuan(calcSkuDishPrice(dish)) }}
              </div>
              <div
                class="origin-price"
                v-if="
                  dish.discountPrice && !merchantInfo.disableShowDiscountPrice
                "
              >
                {{ fenToYuan(calcSkuDishPrice(dish, "origin")) }}
              </div>
            </div>
          </div>
          <QuantityOperation
            v-if="dish.quantity"
            :num="dish.quantity"
            class="cart-dish-operation"
            @add="addCartDish(index)"
            @reduce="reduceCartDish(index)"
          />
        </div>
      </scroll-view>
    </div>
  </div>
</template>
<script>
import { noop, fenToYuan } from "@utils";
import { useCart, useDish, useSkuDish } from "@hooks/menuHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
export default {
  setup() {
    const { showCartModal, toggleShowCartModal, addCartDish, reduceCartDish } =
      useCart();
    const { selectedDishes, addDish, reduceDish, resetSelDishes } = useDish();
    const { genDishDescribeText, calcSkuDishPrice } = useSkuDish();
    const { merchantInfo } = useMerchantInfo();
    return {
      toggleShowCartModal,
      showCartModal,
      selectedDishes,
      noop,
      fenToYuan,
      addCartDish,
      reduceCartDish,
      genDishDescribeText,
      resetSelDishes,
      calcSkuDishPrice,
      merchantInfo,
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
  .box-size(100%,unset,white);
  min-height: 200px;
  max-height: 506px;
  .pos-bl-absolute(0,0);
  border-radius: 10px 10px 0 0;
  padding-bottom: 130px;
  overflow: hidden;
  .title {
    .box-size(100%,42px,#f8f8f8);
    .flex-simple(flex-start,center);
    padding-left: 12px;
    .text-wrapper {
      .normal-font(14px,#666);
    }
  }
  .dish-list-wrapper {
    min-height: 200px;
    max-height: 336px;
    .dish-info {
      display: flex;
      padding: 7.5px 12px;
      box-sizing: border-box;
      position: relative;
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
          .describe-text {
            .normal-font(12px,#999);
            .line-center(18px);
            .no-wrap();
          }
        }
        .price {
          .flex-simple(felx-start,flex-end);
          .current-price {
            .bold-font(16px,#f25643);
            .price-symbol(12px,#f25643);
          }
          .origin-price {
            .normal-font(11px,#999);
            .price-symbol(11px,999);
            text-decoration: line-through;
            margin-left: 4px;
            white-space: nowrap;
          }
        }
      }
      .cart-dish-operation {
        .pos-br-absolute(7.5px,12px);
      }
    }
  }
}
</style>