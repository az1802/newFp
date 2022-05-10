<!--
 * @Author: sunjie
 * @Date: 2022-02-16 16:27:12
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-18 18:18:52
 * @FilePath: /new-fanpiao-uniapp/src/package-menu/MenuBottom/MenuBottom.vue
-->
<template>
  <div class="menu-bottom-container">
    <div
      class="discount-tooltip"
      v-if="
        selectedDishesTotalQuantity &&
        !userMerchantCoupons.length &&
        !merchantInfo.disableBuyFanpiao
      "
    >
      <div class="text">
        使用饭票支付,本单可再减
        <div class="price">{{ priceTooltipText }}元</div>
      </div>
    </div>
    <div
      class="discount-tooltip"
      v-if="
        selectedDishesTotalQuantity &&
        userMerchantCoupons.length &&
        availableUseCoupon.leastCost > selectedDishesTotalPrice
      "
    >
      <div class="text">
        再买
        <div class="price">
          {{
            (availableUseCoupon.leastCost - selectedDishesTotalPrice) / 100
          }}元
        </div>
        ,可减
        <div class="price">{{ availableUseCoupon.reduceCost / 100 }}元</div>
      </div>
    </div>

    <div class="cart-wrapper" @click="toggleShowCartModal(!showCartModal)">
      <div class="cart-info">
        <div class="cart-icon">
          <span class="iconfont icon-gouwuchekong"></span>
          <div class="count" v-show="selectedDishesTotalQuantity">
            {{ selectedDishesTotalQuantity }}
          </div>
        </div>
        <div class="total-price-wrapper">
          <div class="price" v-if="canUsedCoupon">
            <div class="finaly-price">
              ¥{{ fenToYuan(totalPrice - availableUseCoupon.reduceCost) }}
            </div>
            <div class="origin-price">¥{{ fenToYuan(totalPrice) }}</div>
          </div>
          <div class="price" v-else>¥{{ fenToYuan(totalPrice) }}</div>
          <div class="use-coupon-tooltip" v-if="canUsedCoupon">
            本单可使用优惠券
          </div>
        </div>
      </div>
      <div
        v-if="orderInfo.mealType !== 'TAKE_OUT'"
        class="text-wrapper"
        :class="[selectedDishes.length > 0 ? 'has-dish' : '']"
        @click.stop="createOrder"
      >
        {{ selectedDishes.length > 0 ? "去下单" : "请先点菜" }}
      </div>
      <div
        v-else
        class="text-wrapper"
        :class="[canOrder ? 'can-order' : 'disable-order']"
        @click.stop="createOrder"
      >
        {{ canOrder ? "去下单" : `满${orderInfo.minimalBillFee / 100}起送` }}
      </div>
      <div
        class="get-phone-wrapper"
        v-if="merchantInfo.enforcePhoneRegistration && !phone"
        @click.stop="stop"
      >
        <GetPhoneButton
          class="get-phone-btn"
          @success="getPhoneSuccess"
        ></GetPhoneButton>
      </div>
    </div>
  </div>
</template>
<script>
import {
  useCart,
  useDish,
  useScanModal,
  useAddOrderModal,
} from "@hooks/menuHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoInfo, useMerchantInfo } from "@hooks/merchantHooks";
import { useOrder } from "@hooks/orderHooks";
import { useUserMerchantCoupon, useUserPhone } from "@hooks/userHooks";
import { unref, computed } from "vue";
import { fenToYuan, showToast } from "@utils";

export default {
  setup() {
    const { showCartModal, toggleShowCartModal } = useCart();
    const { toggleShowScanModal } = useScanModal();
    const { merchantInfo } = useMerchantInfo();
    const { phone } = useUserPhone();
    const {
      selectedDishes,
      selectedDishesTotalQuantity,
      selectedDishesTotalPrice,
      selectedDishesDiscountPrice,
    } = useDish();
    const { maxDiscountFanpiao, minDiscountFanpiao } = useFanpiaoInfo();
    const { orderInfo, setOrderInfo } = useOrder();
    const { navigateTo } = useNavigate();
    const { userMerchantCoupons } = useUserMerchantCoupon();
    const { showAddOrderModal, toggleShowAddOrderModal } = useAddOrderModal();
    function createOrder() {
      let { mealType } = unref(orderInfo);
      console.log("mealType: ", mealType, unref(canOrder));
      if (unref(selectedDishes).length == 0) {
        showToast("请先点菜");
        return;
      }
      if (!unref(canOrder) && mealType == "TAKE_OUT") {
        return;
      }
      const { tableId, orderId, pendingOrderId } = unref(orderInfo);
      if (pendingOrderId) {
        //后付款的场景
        toggleShowAddOrderModal(true);
        return;
      }

      if (!tableId) {
        toggleShowScanModal(true);
        return;
      }

      // 隐藏购物车
      toggleShowCartModal(false);
      // TODO 多人点餐

      navigateTo("ORDER/CREATE_ORDER");
    }

    const priceTooltipText = computed(() => {
      let max = Number(
        (unref(selectedDishesTotalPrice) / 100) *
          ((unref(maxDiscountFanpiao).discount || 0) / 100)
      ).toFixed(2);
      let min = Number(
        ((unref(selectedDishesTotalPrice) / 100) *
          (unref(minDiscountFanpiao).discount || 0)) /
          100
      ).toFixed(2);

      return max != min ? `${min}-${max}` : `${max}`;
    });

    const availableUseCoupon = computed(() => {
      let res = null;
      unref(userMerchantCoupons).forEach((item) => {
        if (item.leastCost < res || res === null) {
          res = item;
        }
      });
      return res;
    });
    const canUsedCoupon = computed(() => {
      return (
        unref(availableUseCoupon) &&
        unref(availableUseCoupon).leastCost <= unref(selectedDishesTotalPrice)
      );
    });
    const totalPrice = computed(() => {
      return (
        unref(selectedDishesTotalPrice) - unref(selectedDishesDiscountPrice)
      );
    });

    const canOrder = computed(() => {
      return unref(orderInfo).minimalBillFee <= unref(selectedDishesTotalPrice);
    });

    return {
      orderInfo,
      toggleShowCartModal,
      showCartModal,
      selectedDishes,
      selectedDishesTotalQuantity,
      totalPrice,
      fenToYuan,
      createOrder,
      selectedDishesTotalPrice,
      priceTooltipText,
      userMerchantCoupons,
      availableUseCoupon,
      canUsedCoupon,
      canOrder,
      merchantInfo,
      phone,
      stop() {
        return false;
      },
      getPhoneSuccess() {},
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
    position: relative;
    .get-phone-wrapper {
      position: absolute;
      left: 0;
      right: 12px;
      top: 0;
      bottom: 0;
      .get-phone-button {
        .box-size(100%,100%,transparent);
        opacity: 0;
      }
    }
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
      .total-price-wrapper {
        .flex-simple(flex-start,flex-start);
        flex-direction: column;
        margin-left: 12px;
        .price {
          .bold-font(18px,white);
          .flex-simple(flex-start,flex-end);
          .finaly-price {
            .bold-font(18px,white);
          }
          .origin-price {
            .normal-font(14px,#666);
            text-decoration: line-through;
            margin-left: 6px;
          }
        }
        .use-coupon-tooltip {
          .normal-font(12px,white);
        }
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
      &.disable-order {
        background: #ff4029;
        color: white;
        opacity: 0.3;
      }
      &.can-order {
        background: #ff4029;
        color: white;
      }
    }
  }
}
</style>