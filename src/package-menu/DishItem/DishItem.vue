<!--
 * @Author: sunjie
 * @Date: 2022-02-10 16:05:56
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 12:08:02
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/DishItem/DishItem.vue
-->
<template>
  <div class="container">
    <div class="img-wrapper">
      <div class="placeholder" v-if="showPlaceHolder || !dish.thumbImage"></div>
      <img
        :src="dish.thumbImage"
        class="img"
        mode="aspectFill"
        lazy-load
        @load="imgLoaded"
      />
    </div>
    <div class="info" @click.stop="navigateTo('MARKETING/BUY_FANPIAO')">
      <div class="name">
        <!-- {{ dish.name }} -->
        <div class="text">{{ dish.name }}</div>
        <div class="sold-num">月售{{ dish.soldNumber + 20 }}份</div>
      </div>
      <div class="price" @click.stop="navigateTo('MARKETING/BUY_FANPIAO')">
        <div class="origin">{{ fenToYuan(dish.price) }}</div>
        <div class="fanpiao">
          <span class="text">{{ fenToYuan(minFanpiaoPrice) }}</span>
          <span class="icon">饭票价</span>
        </div>
      </div>
    </div>
    <DishOperation
      :dishId="dish.id"
      :isSku="dish.isSku"
      @add="add"
      @reduce="reduce"
      @selSku="showSkuDish"
      :quantity="dishCountMap[dish.id]"
    />
  </div>
</template>
<script>
import DishOperation from "../Common/DishOperation.vue";
import { ref, onMounted, watch, unref, computed } from "vue";
import { useTransformPrice } from "@hooks/commonHooks";
import { useDish, useSkuDish } from "@hooks/menuHooks";
import { getDishInfoById } from "@utils";
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoInfo } from "@hooks/merchantHooks";
export default {
  components: {
    DishOperation,
  },
  props: {
    dish: {
      type: Object,
      default: {},
    },
  },
  setup({ dish }) {
    let showPlaceHolder = ref(true);
    let { fenToYuan } = useTransformPrice();

    let { addDish, reduceDish, dishCountMap } = useDish();
    let { setCurSkuDish, toggleShowSkuModal } = useSkuDish();
    let { maxDiscountFanpiao, minDiscountFanpiao } = useFanpiaoInfo();
    const { navigateTo } = useNavigate();

    // watch(minDiscountFanpiao, (nval) => {
    //   console.log(nval);
    // });

    let minFanpiaoPrice = computed(() => {
      let maxDiscount = unref(maxDiscountFanpiao).discount;
      if (maxDiscount !== undefined) {
        return (dish.price * (100 - maxDiscount)) / 100;
      }
      return dish.price;
    });

    return {
      showPlaceHolder,
      dishCountMap,
      navigateTo,
      minDiscountFanpiao,
      imgLoaded(e) {
        showPlaceHolder.value = false;
      },
      fenToYuan,
      minFanpiaoPrice,
      add() {
        let dishInfo = getDishInfoById(dish.id);
        addDish(dishInfo);
      },
      reduce() {
        reduceDish(dish.id);
      },
      showSkuDish() {
        let dishInfo = getDishInfoById(dish.id);
        setCurSkuDish(dishInfo);
        toggleShowSkuModal(true);
      },
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.container {
  display: flex;
  margin-bottom: 24px;
  position: relative;
  .img-wrapper {
    .box-size(86px,86px,#eee);
    position: relative;
    border-radius: 3px;
    overflow: hidden;
    margin-right: 10px;
    .placeholder {
      .box-size(100%,100%,#eee);
      .pos-absolute();
    }
    .img {
      .box-size(100%,100%);
    }
  }
  .info {
    .flex-between(column);
    flex: 1;
    .name {
      .text {
        .bold-font(16px,#333);
        .line-center(20px);
        width: 100%;
      }
      .sold-num {
        .line-center(18px);
        .normal-font(12px,#666);
        margin-top: 4px;
      }
    }
    .price {
      .origin {
        .bold-font(16px,#f25643);
        .price-symbol(12px);
        .line-center(16px);
      }
      .fanpiao {
        .line-center(15px);
        background: rgba(255, 143, 31, 0.2);
        border-radius: 2px;
        margin-top: 4px;
        display: inline-flex;
        padding-left: 5px;
        .text {
          .bold-font(12px,#f25643);
          .price-symbol(12px);
          padding: 0 0 0 5px;
          &::after {
            content: "起";
            font-size: 10px;
            margin-left: 2px;
            margin-right: 2px;
          }
        }
        .icon {
          .box-size(40px,100%);
          .normal-font(11px,white);
          display: inline-block;
          text-align: center;
          background: url("@assets/lowest-price.png");
          background-size: 40px 15px;
        }
      }
    }
  }
}
</style>