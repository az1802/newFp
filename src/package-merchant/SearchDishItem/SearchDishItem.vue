<!--
 * @Author: sunjie
 * @Date: 2022-02-10 16:05:56
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-17 12:08:02
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/DishItem/DishItem.vue
-->
<template>
  <div class="container" @click.stop="showDishDetail">
    <div
      class="sell-out-placeholder"
      v-if="dish.status == 'GUQING' && merchantInfo.enableShowSoldOutDishes"
    >
      <div class="img-wrappper">
        <img
          class="img"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/sell-out_01.png"
          alt=""
          mode="scaleToFill"
        />
      </div>
    </div>
    <div
      class="time-limit-placeholder"
      v-else-if="
        dish.status == 'NOT_IN_TIME_LIMIT_SALE' &&
        merchantInfo.enableShowTimeLimitSale
      "
    >
      <div class="time-limit-sale-text">
        不在可售卖时间
        <text
          class="cuIcon-question"
          @click.stop="showTimeLimitSaleTooltip"
        ></text>
      </div>
    </div>
    <div class="img-wrapper">
      <div class="placeholder" v-if="showPlaceHolder || !dish.thumbImage"></div>
      <img
        :src="dish.thumbImage"
        class="img"
        mode="aspectFill"
        lazy-load
        @load="imgLoaded"
      />
      <div v-if="showRemainQuantity" class="remain-quantity">
        剩余{{ dish.remainQuantity > 999 ? "999+" : dish.remainQuantity }}份
      </div>
    </div>
    <div class="info" @click.stop="navigateTo('MARKETING/BUY_FANPIAO')">
      <div class="name">
        <!-- {{ dish.name }} -->
        <div class="text-wrapper high-light-wrapper" v-if="highLightStr">
          <div class="text">{{ nameFrontStr }}</div>
          <div class="high-light">{{ highLightStr }}</div>
          <div class="text">{{ nameBackStr }}</div>
        </div>
        <div class="text-wrapper" v-else>
          {{ dish.name }}
        </div>

        <div class="sold-num" v-if="!merchantInfo.disableShowSoldNumber">
          月售{{ dish.soldNumber }}份
        </div>
      </div>
      <div class="price" @click.stop="navigateTo('MARKETING/BUY_FANPIAO')">
        <div class="origin">
          <div class="current-price">{{ fenToYuan(currentPrice) }}</div>
          <div
            class="origin-price"
            v-if="dish.discountPrice && !merchantInfo.disableShowDiscountPrice"
          >
            {{ fenToYuan(dish.price) }}
          </div>
        </div>
        <div
          class="fanpiao"
          v-if="
            dish.status !== 'NOT_IN_TIME_LIMIT_SALE' &&
            dish.hasDiscount &&
            !merchantInfo.disableBuyFanpiao
          "
        >
          <span class="text">{{ fenToYuan(minFanpiaoPrice) }}</span>
          <span class="icon">饭票价</span>
        </div>
      </div>
    </div>
    <DishOperation
      v-if="dish.status !== 'NOT_IN_TIME_LIMIT_SALE'"
      :dishId="dish.id"
      :isSku="dish.isSku"
      @add="add"
      @reduce="reduce"
      @selSku="showSkuDish"
      :quantity="dishQuantity"
      :key="dish.id + 'search'"
    />
  </div>
</template>
<script>
import DishOperation from "../Common/DishOperation.vue";
import { ref, onMounted, watch, unref, computed } from "vue";
import { useDish, useSkuDish, useDishDetail } from "@hooks/menuHooks";
import { getDishInfoById, fenToYuan } from "@utils";
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoInfo, useMerchantInfo } from "@hooks/merchantHooks";
export default {
  components: {
    DishOperation,
  },
  props: {
    dish: {
      type: Object,
      default: {},
    },
    highLightStr: {
      type: String,
      default: "",
    },
  },
  setup({ dish, highLightStr }) {
    let showPlaceHolder = ref(true);

    let { merchantInfo } = useMerchantInfo();
    let { addDish, reduceDish, dishCountMap } = useDish();
    let { setCurSkuDish, toggleShowSkuModal } = useSkuDish();
    let { maxDiscountFanpiao, minDiscountFanpiao } = useFanpiaoInfo();
    let { setCurDishDetail, toggleShowDishDetailModal } = useDishDetail();
    const { navigateTo } = useNavigate();

    let minFanpiaoPrice = computed(() => {
      let maxDiscount = unref(maxDiscountFanpiao).discount;
      if (maxDiscount !== undefined) {
        return (dish.price * (100 - maxDiscount)) / 100;
      }
      return dish.price;
    });

    let currentPrice = computed(() => {
      let { disableShowDiscountPrice } = unref(merchantInfo);
      let { price, discountPrice } = dish;
      return !disableShowDiscountPrice ? price - discountPrice : price;
    });

    let showRemainQuantity = computed(() => {
      let { status, enableQuantitySetting, remainQuantity } = dish;
      return status == "NORMAL" && enableQuantitySetting && remainQuantity >= 0;
    });

    const nameFrontStr = computed(() => {
      let { name } = dish;
      if (!highLightStr.trim()) {
        return name;
      }
      let index = name.indexOf(highLightStr);

      if (index == -1) {
        return name;
      } else if (index == 0) {
        return "";
      } else {
        return name.slice(0, index);
      }
    });
    const nameBackStr = computed(() => {
      let { name } = dish;
      if (!highLightStr.trim()) {
        return "";
      }
      let index = name.indexOf(highLightStr);
      if (index == -1) {
        return "";
      } else {
        return name.slice(index + highLightStr.length);
      }
    });

    let dishQuantity = ref(unref(dishCountMap)[dish.id] || 0);

    watch(dishCountMap, (nval) => {
      if (
        (nval[dish.id] !== undefined || dishQuantity.value != 0) &&
        dishQuantity.value != nval[dish.id]
      ) {
        dishQuantity.value = nval[dish.id] || 0;
      }
    });

    return {
      showPlaceHolder,
      showRemainQuantity,
      dishCountMap,
      navigateTo,
      minDiscountFanpiao,
      merchantInfo,
      currentPrice,
      nameFrontStr,
      nameBackStr,
      dishQuantity,
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
        if (dishInfo) {
          setCurSkuDish(dishInfo);
          toggleShowSkuModal(true);
        }
      },
      showDishDetail() {
        if (dish.status != "NORMAL") {
          return;
        }
        setCurDishDetail(dish);
        toggleShowDishDetailModal(true);
      },
      showTimeLimitSaleTooltip() {
        return;
        let limitTimeStr = dish.saleTimeStr;
        uni.showModal({
          icon: "none",
          title: "限时段菜品",
          content: `售卖时间 ${limitTimeStr}`,
          showCancel: false,
          confirmText: "我知道了",
          confirmColor: "#F25643",
        });
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
  .sell-out-placeholder,
  .time-limit-placeholder {
    .fill-box();
    background: white;
    opacity: 0.6;
    z-index: 20;
    .img-wrappper {
      .flex-simple(center,center);
      .box-size(86px,86px);
    }
    .img {
      .box-size(60px,60px);
    }
    .time-limit-sale-text {
      .pos-br-absolute(0,0);
      .normal-font(14px,#999);
      .cuIcon-question {
        margin: 0 5px;
        color: #999;
      }
    }
  }
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
    .remain-quantity {
      .pos-br-absolute(0,0);
      .box-size(100%,24px,#000);
      opacity: 0.5;
      .normal-font(12px,white);
      .line-center(24px);
      text-align: center;
      border-radius: 0 0 3px 3px;
    }
  }
  .info {
    .flex-between(column);
    flex: 1;
    width: calc(100% - 86px);
    .name {
      width: 100%;
      .text-wrapper {
        .line-center(20px);
        .bold-font(16px,#333);
        .no-wrap();
        &.high-light-wrapper {
          .flex-simple(flex-start,center);
        }
        .text {
          .bold-font(16px,#333);
        }
        .high-light {
          .bold-font(16px,#f25643);
        }
      }
      .sold-num {
        .line-center(18px);
        .normal-font(12px,#666);
        margin-top: 4px;
      }
    }
    .price {
      .origin {
        height: 22px;
        .flex-simple(felx-start,flex-end);
        .current-price {
          .bold-font(16px,#f25643);
          .price-symbol(12px,#f25643);
        }
        .origin-price {
          .normal-font(11px,#999);
          .price-symbol(11px,999);
          text-decoration: line-through;
          margin-left: 6px;
          white-space: nowrap;
        }
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
          line-height: 15px;
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
          line-height: 15px;
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