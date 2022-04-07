<!--
 * @Author: sunjie
 * @Date: 2022-02-08 11:55:29
 * @LastEditors: sunj
 * @LastEditTime: 2022-02-08 13:54:34
 * @FilePath: /new-fanpiao-uniapp/src/pages/order/order.vue
-->

<template>
  <div class="page">
    <NavigationBar title="订单" :showArrow="false" />
    <div class="tab-wrapper">
      <div
        v-for="(item, index) in tabs"
        class="tab-item"
        :key="item.value"
        :class="{ active: index === curTabIndex }"
        @click="switchTab(index)"
      >
        {{ item.text }}
      </div>
      <div class="line-wrapper" :style="lineStyle">
        <div class="line"></div>
      </div>
    </div>
    <div class="tab-container">
      <scroll-view class="tab-container-scroll-view" scrollY>
        <OrderSimpleInfo
          v-for="item in showOrderList"
          :orderType="orderType"
          :orderInfo="item"
          :key="item.id"
          @openRefundModal="openRefundModal"
        />
      </scroll-view>
    </div>
    <RefundModal v-model:show="showRefundModal" @apply="applyRefund" />
  </div>
</template>

<script>
import { useTabs, useSystemInfo } from "@hooks/commonHooks";
import { useOrderRecord } from "@hooks/orderHooks";
import { computed, unref, onBeforeMount, ref, toRefs } from "vue";

const TAB_ARR = [
  {
    text: "点餐",
    value: "ALL",
  },
  {
    text: "券包",
    value: "COUPON",
  },
  {
    text: "饭票",
    value: "FANPIAO",
  },
];
const PAGE_SIZE = 20;
export default {
  onLoad() {},
  onShow() {
    this.requestAllOrderList();
  },
  setup() {
    let { curTabIndex, switchTab, tabs } = useTabs(TAB_ARR);
    let { statusBarHeight } = useSystemInfo();
    let showRefundModal = ref(false),
      refundInfo;
    let {
      orderList,
      fanpiaoList,
      couponList,
      getOrderList,
      getFanpiaoRecordList,
      getCouponRecordList,
      refundFanpiao,
      refundCoupon,
    } = useOrderRecord();

    let lineStyle = computed(() => {
      return {
        transform: `translate3d(${100 * unref(curTabIndex)}%, 0, 0)`,
      };
    });

    async function requestMoreOrder() {
      if (unref(curTabIndex) == 0) {
        getOrderList(true);
      } else if (unref(curTabIndex) == 1) {
        getCouponRecordList(true);
      } else if (unref(curTabIndex) == 2) {
        getFanpiaoRecordList(true);
      }
    }

    let showOrderList = computed(() => {
      if (unref(curTabIndex) == 0) {
        return unref(orderList);
      } else if (unref(curTabIndex) == 1) {
        return unref(couponList);
      } else if (unref(curTabIndex) == 2) {
        return unref(fanpiaoList);
      }

      return [];
    });

    const orderType = computed(() => {
      if (unref(curTabIndex) == 0) {
        return "DISH";
      } else if (unref(curTabIndex) == 1) {
        return "COUPON";
      } else if (unref(curTabIndex) == 2) {
        return "FANPIAO";
      }
      return "";
    });

    function openRefundModal(orderInfo) {
      showRefundModal.value = true;
      refundInfo = orderInfo;
    }
    async function applyRefund(reasonInfo) {
      let { type, transactionId } = refundInfo;
      uni.showLoading();
      if (type == "FANPIAO") {
        await refundFanpiao(transactionId, { data: reasonInfo });
      } else if (type == "COUPON") {
        await refundCoupon(transactionId, { data: reasonInfo });
      }
      uni.hideLoading();
      showRefundModal.value = false;
    }
    function requestAllOrderList() {
      getOrderList();
      getFanpiaoRecordList();
      getCouponRecordList();
    }
    onBeforeMount(() => {
      requestAllOrderList();
    });

    return {
      tabs,
      curTabIndex,
      switchTab,
      orderType,
      lineStyle,
      showOrderList,
      showRefundModal,
      openRefundModal,
      applyRefund,
      requestAllOrderList,
    };
  },
};
</script>

<style lang="less" scoped>
@import "@design/index.less";
.page {
  .box-size(100vw,100vh,#F8F8F8);
  .tab-wrapper {
    .box-size(100vw,52px,white);
    .flex-simple(center,flex-start);
    position: relative;
    padding-top: 12px;
    .tab-item {
      .flex-simple(center,center);
      .line-center(17px);
      .normal-font(17px,#333);
      position: relative;
      transition: all 0.3s;
      flex: 1;
      &.active {
        font-weight: bold;
      }
    }
    .line-wrapper {
      .box-size(33.33%,3px,transparent);
      .pos-bl-absolute(12px,0);
      transition: all 0.3s;
      transform: translate3d(0, 0, 0);
      .line {
        .box-size(34px,3px,#f25643);
        border-radius: 3px;
        margin: 0 auto;
      }
    }
  }
  .tab-container {
    .box-size(calc(100vw - 24px),calc(100vh - 150px),transparent);
    margin: 0 auto;
    .tab-container-scroll-view {
      .box-size(100%,100%,transparent);
    }
  }
}
</style>
