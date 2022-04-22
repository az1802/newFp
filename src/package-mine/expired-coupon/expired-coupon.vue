<template>
  <div class="expired-coupon">
    <NavigationBar />
    <div class="tab-wrapper">
      <p
        class="tab"
        :class="{ active: curTabIndex === index }"
        v-for="(item, index) in tabs"
        :key="index"
        @click="switchTab(index)"
      >
        {{ item.text }}({{ couponsCount[item.state] }})
      </p>
      <div
        class="line-wrapper"
        :style="{ transform: 'translate3d(' + 100 * curTabIndex + '%, 0, 0)' }"
      >
        <div class="line"></div>
      </div>
    </div>

    <scroll-view class="scroll-view" scroll-y>
      <div v-if="coupons && coupons.length">
        <div
          class="coupon-wrapper"
          v-for="(coupon, index) in coupons"
          :key="index"
        >
          <UsedCouponInfo
            :coupon="coupon"
            :disabled="TAB_ARR[curTabIndex].state"
          />
        </div>
      </div>
      <div v-if="coupons && !coupons.length">
        <!-- <EmptyStatus type="coupon" :content="emptyContent" /> -->
      </div>
    </scroll-view>
  </div>
</template>
<script>
import { ref, onBeforeMount, computed, unref } from "vue";
import { useTabs, useNavigate } from "@hooks/commonHooks";
import { useUserCoupon } from "@hooks/userHooks";
const TAB_ARR = [
  {
    state: "EXPIRED",
    text: "已过期",
  },
  {
    state: "USED",
    text: "已使用",
  },
];
let merchantId = "";
export default {
  onLoad(opts) {
    merchantId = opts.merchantId;
  },
  setup() {
    let { curTabIndex, switchTab, tabs } = useTabs(TAB_ARR);
    let usedCouponList = ref([]),
      expiredCouponList = ref([]);
    const { requestUsedCouponList, requestExpiredCouponList } = useUserCoupon();

    let couponsCount = computed(() => {
      return {
        EXPIRED: unref(expiredCouponList).length,
        USED: unref(usedCouponList).length,
      };
    });

    let emptyContent = computed(() => {
      return unref(curTabIndex) == 0 ? "暂无已过期券" : "暂无已使用券";
    });

    let coupons = computed(() => {
      return unref(curTabIndex) == 0
        ? unref(expiredCouponList)
        : unref(usedCouponList);
    });

    onBeforeMount(async () => {
      if (merchantId) {
        let merchantCoupons = await useUserMerchantCoupon(merchantId);
        let merchantUsedCoupons = merchantCoupons.filter((couponItem) => {
          return couponItem.state == "USED";
        });
        let merchantExpiredCoupons = merchantCoupons.filter((couponItem) => {
          return couponItem.state == "EXPIRED";
        });
        usedCouponList.value = merchantUsedCoupons;
        expiredCouponList.value = merchantExpiredCoupons;
        coupons.value = merchantUsedCoupons;
      } else {
        let userAllUserdCoupons = await requestUsedCouponList();
        let userAllExpiredCoupons = await requestExpiredCouponList();
        usedCouponList.value = userAllUserdCoupons;
        expiredCouponList.value = userAllExpiredCoupons;
        coupons.value = userAllUserdCoupons;
      }
    });

    return {
      coupons,
      couponsCount,
      curTabIndex,
      switchTab,
      tabs,
      emptyContent,
      usedCouponList,
      expiredCouponList,
      TAB_ARR,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.expired-coupon {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: #F8F8F8;

  .tab-wrapper {
    width: 100%;
    display: flex;
    padding: 21px 0 11px 0;
    position: fixed;
    z-index: 1000;
    background-color: white;

    .tab {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #332E2B;
      font-size: 18px;
      transition: color 0.3s;
      font-weight: bold;

      &.active {
        color: #F25643;
      }
    }

    .line-wrapper {
      position: absolute;
      width: 50%;
      height: 3px;
      bottom: 0px;
      transition: all 0.3s;
      transform: translate3d(0, 0, 0);

      .line {
        width: 36px;
        height: 3px;
        margin: 0 auto;
        background-color: #F25643;
        border-radius: 3px;
      }
    }
  }

  .scroll-view {
    padding-top: 70px;
    height: calc(100vh - 170px);
  }

  .coupon-wrapper {
    padding: 0 12px;
    box-sizing: border-box;
  }
}
</style>
