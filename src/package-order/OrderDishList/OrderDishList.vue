<!--
 * @Author: sunjie
 * @Date: 2022-02-18 13:50:02
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 16:22:27
 * @FilePath: /new-fanpiao-uniapp/src/package-order/OrderDishList/OrderDishList.vue
-->
<template>
  <div class="dish-list">
    <div
      class="dish-item"
      v-for="(dishItem, index) in showCurrentDishList"
      :key="index"
    >
      <div
        class="dining-count"
        v-if="
          dishItem.batchNumber && dishItem.batchNumber != -1 && showBatchNumber
        "
      >
        <div class="text">第{{ dishItem.batchNumber }}次</div>
        <div class="time-text">{{ dishItem.createTimeText }}</div>
      </div>
      <div class="dish-info" v-if="!dishItem.isChildDish">
        <div class="left">
          <img class="img" :src="dishItem.image" mode="aspectFill" alt="" />
          <div class="info" @click="changeChildDishes(dishItem)">
            <div class="name">
              {{ dishItem.name }}
              <img
                v-if="
                  dishItem.childDishes &&
                  dishItem.childDishes.length > 0 &&
                  dishItem.isChildDishesShow
                "
                src="@assets/icon-arrow_right.svg"
                alt=""
                class="arrow-right up"
              />
              <img
                v-if="
                  dishItem.childDishes &&
                  dishItem.childDishes.length > 0 &&
                  !dishItem.isChildDishesShow
                "
                src="@assets/icon-arrow_right.svg"
                alt=""
                class="arrow-right down"
              />
            </div>
            <div class="text">
              {{
                dishItem.childDishes && dishItem.childDishes.length > 0
                  ? ""
                  : genDishDescribeText(dishItem)
              }}
            </div>
          </div>
        </div>
        <div class="right">
          <div class="price">
            {{
              fenToYuan(
                dishItem.totalFee || calcSkuDishPrice(dishItem, "origin")
              )
            }}
          </div>
          <div class="quantity">{{ dishItem.quantity }}</div>
        </div>
      </div>
      <div
        class="child-dish-wrapper"
        v-if="
          dishItem.childDishes &&
          dishItem.childDishes.length > 0 &&
          dishItem.isChildDishesShow
        "
      >
        <div class="triangle-box"></div>
        <div
          class="child-dish"
          v-for="(childDish, index) in dishItem.childDishes"
          :key="index"
        >
          <div class="left">
            <div class="name-wrapper">
              <p class="name">{{ childDish.name }}</p>
              <p
                class="sku"
                v-if="
                  (childDish.attrs && childDish.attrs.length != 0) ||
                  (childDish.supplyCondiments &&
                    childDish.supplyCondiments.length != 0)
                "
              >
                {{ genDishDescribeText(childDish) }}
              </p>
            </div>
          </div>
          <div class="right">
            <p class="count">x{{ childDish.quantity }}</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="show-more-dish"
      v-if="showCurrentDishList.length < dishList.length"
      @click="showAllCurrentDishes"
    >
      展开更多<text class="cuIcon-unfold"></text>
    </div>
  </div>
</template>
<script>
import { useDish, useSkuDish } from "@hooks/menuHooks";
import { fenToYuan, calcSkuDishPrice } from "@utils";
import { watch, computed, ref, unref } from "vue";
export default {
  props: {
    dishList: {
      type: [Array],
      default: [],
    },
    showBatchNumber: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  setup(props) {
    const { genDishDescribeText } = useSkuDish();
    const showAllDishes = ref(false);
    watch(props.dishList, (nval) => {
      nval.forEach(() => {});
    });
    const showCurrentDishList = computed(() => {
      let len = 0;
      props.dishList.forEach((item) => {
        if (!item.isChildDish) {
          len += 1;
        }
      });
      if (len > 3 && !showAllDishes.value) {
        return props.dishList.slice(0, 3);
      } else {
        return props.dishList;
      }
    });
    return {
      genDishDescribeText,
      fenToYuan,
      calcSkuDishPrice,
      changeChildDishes(dishItem) {
        dishItem.isChildDishesShow = !dishItem.isChildDishesShow;
      },
      showCurrentDishList,
      showAllCurrentDishes() {
        showAllDishes.value = true;
      },
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
    .dining-count {
      .box-size(100%,46px);
      .flex-simple(space-between,center);
      .text {
        .normal-font(14px,#333);
      }
      .time {
        .normal-font(14px,#999);
      }
    }
    .dish-info {
      .flex-between();
      min-height: 40px;
      max-height: 100px;
      margin-bottom: 16px;
      .left {
        flex: 1;
        .flex-simple(flex-start);
        .img {
          .box-size(40px,40px,#eee);
          flex-basis: 40px;
          margin-right: 8px;
          border-radius: 2px;
        }
        .info {
          .flex-simple(flex-start,flex-start);
          flex-direction: column;
          flex: 1;
          height: 100%;
          .name {
            .bold-font(16px,#333130);
            .line-center(16px);
            .no-wrap();
            max-width: 53vw;
            .arrow-right {
              .box-size(12px,12px,transparent);
              &.down {
                transform: rotate(90deg);
              }
              &.up {
                transform: rotate(-90deg);
              }
            }
          }
          .text {
            .normal-font(12px,#999);
            .line-center(18px);
            .no-wrap-plus(2);
            margin-top: 6px;
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
    .child-dish-wrapper {
      display: flex;
      flex-direction: column;
      background: #f8f8f8;
      border-radius: 4px;
      margin: 0 0 0 50px;
      box-sizing: border-box;
      padding: 12px 14px;
      position: relative;
      margin-top: -5px;
      &:last-child {
        margin-bottom: 16px;
      }
      .child-dish {
        .flex-simple(center,center);
        margin-bottom: 12px;
        &:last-child {
          margin-bottom: 0px;
        }
        .left {
          .flex-simple(flex-start,center);
          flex: 1;
          overflow: hidden;
          .name-wrapper {
            flex: 1;
            overflow: hidden;
            .name {
              .no-wrap();
              .normal-font(14px,#333333);
              .line-center(14px);
            }
            .sku {
              .no-wrap-plus(3);
              .normal-font(12px,#999);
              margin-top: 6px;
              padding-right: 12px;
              line-height: 18px;
            }
            .count {
              margin-top: 6px;
              .normal-font(13px,#999);
            }
          }
        }
        .right {
          flex: 0 0 70px;
          .flex-simple(flex-end,center);
          .line-center(14px);
          align-self: flex-start;
          .count {
            .normal-font(13px,#999);
          }
          .price {
            .bold-font(17px,#999);
            &::before {
              display: inline-block;
              content: "¥";
            }
          }
        }
      }
    }
  }
  .show-more-dish {
    .box-size(100%,35px,#F8F8F8);
    .line-center(35px);
    .normal-font(14px,#333);
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
    .cuIcon-unfold {
      font-size: 10px;
      margin-left: 6px;
    }
  }
}
</style>