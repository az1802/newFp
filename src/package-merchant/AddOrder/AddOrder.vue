<template>
  <div
    class="add-order-modal"
    :class="showAddOrderModal ? 'fade-modal-enter-active' : 'hide'"
    @touchmove.stop="stop"
  >
    <div class="add-order-wrapper">
      <div class="header">
        <img
          class="header-img"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/menu/header.png"
        />
        <div class="header-text">
          <p class="main-title">— 添加菜品 —</p>
          <p class="sub-title">点击“确认下单”将提交订单并送达后厨</p>
        </div>
      </div>
      <div class="dish-info border-bottom-1px">
        <p class="num">
          <span>共添加</span>
          <span class="dish-count">{{ selectedDishes.length }}</span>
          <span>道菜品</span>
        </p>
        <div class="price-wrapper">
          <p class="price">总计: ¥{{ selectedDishesFinalTotalPrice / 100 }}</p>
          <p
            v-if="selectedDishesTotalPrice > selectedDishesFinalTotalPrice"
            class="origin-price"
          >
            ¥{{ selectedDishesTotalPrice / 100 }}
          </p>
        </div>
      </div>
      <scroll-view scroll-y="true" class="scroll-wrap border-bottom-1px">
        <div
          class="item-wrapper"
          v-for="(item, index) in selectedDishes"
          :key="index"
        >
          <img class="dish-image" :src="item.image" />
          <div class="name-wrapper">
            <p class="name">{{ item.name }}</p>
            <p v-if="item.isSku" class="sku">{{ genDishDescribeText(item) }}</p>
          </div>

          <div class="detail">
            <p class="quantity">X{{ item.quantity }}</p>
            <p class="price">{{ calcSkuDishPrice(item) / 100 }}</p>
          </div>
        </div>
      </scroll-view>
      <div class="actions">
        <div class="btn-cancel" @click="toggleShowAddOrderModal(false)">
          取消
        </div>
        <div class="btn-confirm" @click="addDish">确认下单</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { useModal } from "@hooks/commonHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import { useOrder } from "@hooks/orderHooks";
import { useDish, useSkuDish, useAddOrderModal } from "@hooks/menuHooks";
import { navigateTo, showToast, sleep } from "@utils";
import { unref } from "vue";
import API from "@api";
export default {
  props: {},
  setup() {
    const { showAddOrderModal, toggleShowAddOrderModal } = useAddOrderModal();
    const {
      selectedDishes,
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
      selectedDishesFinalTotalPrice,
      resetSelDishes,
    } = useDish();
    const { addOrder, orderInfo } = useOrder();
    let { merchantInfo } = useMerchantInfo();
    const { genDishDescribeText, calcSkuDishPrice } = useSkuDish();
    let isAdding = false;
    async function addDish() {
      if (isAdding) {
        return;
      }
      isAdding = true;
      let { pendingOrderId } = unref(orderInfo);
      let addRes = await addOrder(pendingOrderId, unref(selectedDishes));
      await showToast(
        addRes.errcode == 0 ? "您已加菜成功" : addRes.errmsg || "加菜失败"
      );
      isAdding = false;
      if (addRes) {
        await sleep(1000);
        resetSelDishes([]);
        toggleShowAddOrderModal(false);
        navigateTo("ORDER/CREATE_ORDER", {
          pendingOrderId,
        });
      }
    }
    return {
      showAddOrderModal,
      toggleShowAddOrderModal,
      stop(e) {
        e.stopPropagation();
        return "";
      },
      addDish,
      selectedDishesTotalPrice,
      selectedDishesFinalTotalPrice,
      selectedDishes,
      genDishDescribeText,
      calcSkuDishPrice,
    };
  },
};
</script>

<style lang="less" scoped>
@import "@design/index.less";

.add-order-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide-modal {
    opacity: 0;
    transition: all 0.5s;
    z-index: -100;
  }
  .add-order-wrapper {
    width: 80%;
    background-color: white;
    border-radius: 10px;
    overflow: hidden;
    .header {
      .box-size(100%,68px);
      position: relative;
      .header-img {
        .box-size(100%,68px);
      }
      .header-text {
        .box-size(100%,68px,transparent);
        .flex-simple(center,center);
        flex-direction: column;
        .pos-tl-absolute(0,0);
        .main-title {
          .normal-font(18px,white);
        }
        .sub-title {
          .normal-font(14px,white);
          margin-top: 10px;
        }
      }
    }
    .dish-info {
      .flex-simple(space-between,center);
      padding: 20px 12px;
      .num {
        .normal-font(18px,#666666);
        .dish-count {
          color: #f25643;
        }
      }
      .price-wrapper {
        display: flex;
        .price {
          margin-left: 12px;
          .normal-font(18px,#F25643);
        }
        .origin-price {
          margin: 4px 0 0 4px;
          .normal-font(13px,#666);
          text-decoration: line-through;
        }
      }
    }
    .scroll-wrap {
      .box-size(100%,unset);
      padding: 0 12px;
      min-height: 200px;
      max-height: 300px;
      border-top: 1px solid #e0e0e0;
      .item-wrapper {
        .flex-simple(space-between,center);
        height: 50px;
        .dish-image {
          .box-size(28px,28px);
          margin-right: 5px;
          border-radius: 3px;
        }
        .name-wrapper {
          flex: 1;
          overflow: hidden;
          .name {
            .no-wrap();
            .normal-font(16px,#333);
          }
          .sku {
            .no-wrap();
            .normal-font(12px,#999);
            margin-top: 7px;
          }
        }
        .detail {
          display: flex;
          align-items: center;
          .quantity {
            width: 30px;
            font-size: 14px;
            text-align: left;
          }
          .price {
            width: 50px;
            text-align: left;
            .normal-font(17px,#F25643);
            .price-symbol(11px);
          }
          .count-wrapper {
            display: flex;
            align-items: center;
            margin-left: 13px;
            .icon {
              .box-size(28px,28px);
            }
            .count {
              width: 30px;
              text-align: center;
            }
          }
        }
      }
    }
    .actions {
      .box-size(100%,50px);
      display: flex;
      border-top: 1px solid #e0e0e0;
      .btn-cancel {
        .flex-simple(center,center);
        .normal-font(18px,#666);
        flex: 1;
        border-right: 1px solid #e0e0e0;
      }
      .btn-confirm {
        flex: 1;
        .flex-simple(center,center);
        .normal-font(18px,#F25643);
      }
    }
  }
}
</style>
