<template>
  <div class="coupon">
    <NavigationBar title="用户优惠券" />
    <!-- <div class="coupou-expired-remind-wrapper">
      <div class="coupou-expired-remind">
        <span class="coupou-expired-remind-text">券过期提醒</span>
        <switch
          class="coupon-expired-remind-switch"
          :checked="expiredRemind"
          color="#F25643"
          @change="switchChange"
        ></switch>
      </div>
    </div> -->
    <div class="tabs-wrapper">
      <div
        v-for="(item, index) in tabs"
        class="tab-item"
        :key="item.value"
        :class="{ active: index === curTabIndex }"
        @click="switchTab(index)"
      >
        {{ item.text }}({{ curTabIndex == 0 ? cashCoupons.length : 0 }})
      </div>
      <div
        class="line-wrapper"
        :style="{ transform: 'translate3d(' + 100 * curTabIndex + '%, 0, 0)' }"
      >
        <div class="line"></div>
      </div>
    </div>
    <div v-if="coupons && coupons.length">
      <div
        class="coupon-wrapper"
        v-for="(coupon, index) in coupons"
        :key="index"
      >
        <CouponItem :coupon="coupon" />
      </div>
    </div>
    <div v-if="coupons && !coupons.length">
      <EmptyStatus type="coupon" :content="emptyContent" />
    </div>
    <div
      class="viewExpiredCoupon"
      @click.stop="navigateTo('MINE/EXPIRED_COUPON')"
    >
      查看过期券和已使用券>>
    </div>
  </div>
</template>
<script>
import { ref, onBeforeMount, computed, unref } from "vue";
import { useTabs, useNavigate } from "@hooks/commonHooks";
import {
  getSettingAsync,
  openSettingAsync,
  judgeSubscriptionsSetting,
  requestSubscribeMessageAsync,
  addSubCountAsync,
} from "@utils/wechat.js";
import CouponItem from "./CouponItem.vue";

import API from "@api";
const TAB_ARR = [
  {
    text: "代金券",
    value: "CASH",
  },
  {
    text: "菜品券",
    value: "DISH",
  },
];
const PAGE = 1;
const SIZE = 50;
export default {
  components: { CouponItem },
  setup() {
    let expiredRemind = ref(false),
      cashCoupons = ref([]),
      dishCoupons = ref([]);
    let { curTabIndex, switchTab, tabs } = useTabs(TAB_ARR);
    let { navigateTo } = useNavigate();
    async function switchChange(e) {
      // console.log(e.target.value);
      // let expiredRemindVal = unref(expiredRemind);
      // expiredRemind.value = e.target.value;
      // if (expiredRemind) {
      //   //打开小程序设置界面让用户选择取消订阅
      //   let [openSettingErr, openSettingRes] = await openSettingAsync();
      //   let [getSettingErr_a, settingRes_a] = await getSettingAsync();
      //   // console.log("设置完成的结果",openSettingRes)
      //   // console.log("设置之后的 订阅配置信息",settingRes_a.subscriptionsSetting)
      //   // console.log("取消订阅的结果",judgeSubscriptionsSetting(settingRes_a.subscriptionsSetting,TMPL_ID))
      //   if (
      //     judgeSubscriptionsSetting(settingRes_a.subscriptionsSetting, TMPL_ID)
      //   ) {
      //     expiredRemind.value = true;
      //   }
      // } else {
      //   //打开弹窗提示用户选择订阅
      //   console.log("取消订阅通知弹窗");
      //   // _t.$refs.couponRemindModal.show()
      // }
    }

    async function getUserCouponList() {
      let acceptData = {
        page: PAGE,
        size: SIZE,
        state: "ACCEPTED",
      };
      let res = await API.User.getUserOwnCouponList(acceptData);
      if (res.errcode == 0) {
        let cashCouponsRes = res.data || [];
        cashCouponsRes = cashCouponsRes.filter((couponItem) => {
          return (
            new Date(parseFloat(couponItem.expiredTime * 1000)) > new Date()
          );
        });
        cashCoupons.value = cashCouponsRes;
      }
    }

    onBeforeMount(async () => {
      await getUserCouponList();
    });

    let coupons = computed(() => {
      return unref(curTabIndex) == 0 ? unref(cashCoupons) : unref(dishCoupons);
    });
    let emptyContent = computed(() => {
      return unref(curTabIndex) == 0 ? "暂无代金券" : "暂无菜品券";
    });

    return {
      expiredRemind,
      coupons,
      cashCoupons,
      dishCoupons,
      emptyContent,
      switchChange,
      curTabIndex,
      switchTab,
      tabs,
      navigateTo,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.coupon {
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  background: #F8F8F8;

  .coupou-expired-remind-wrapper {
    width: 100%;
    box-sizing: border-box;
    padding: 2px 12px 10px 12px;
    background-color: #F8F8F8;

    .coupou-expired-remind {
      width: 100%;
      box-sizing: border-box;
      padding: 0 12px 0 12px;
      display: flex;
      height: 44px;
      line-height: 44px;
      background-color: #FFF;
      justify-content: space-between;
      border-radius: 8px;

      .coupou-expired-remind-text {
        font-size: 14px;
        line-height: 44px;
      }

      .coupon-expired-remind-switch {
        transform: scale(0.75);
      }
    }
  }

  .tabs-wrapper {
    width: 100%;
    display: flex;
    padding: 21px 0 11px 0;
    position: fixed;
    z-index: 1000;
    background-color: white;

    .tab-item {
      flex: 1;
      text-align: center;
      color: #332E2B;
      font-size: 18px;
      position: relative;

      &.active {
        color: #EB4B3A;
        font-weight: bold;

        &:after {
          content: '';
          position: absolute;
          bottom: -8px;
          display: inline-block;
          width: 36px;
          height: 3px;
          background-color: #EB4B3A;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 3px;
        }
      }
    }
  }

  .coupon-wrapper {
    padding: 0 12px;
    box-sizing: border-box;
  }

  .viewExpiredCoupon {
    text-align: center;
    font-size: 12px;
    color: #666666;
    padding: 20px 0 30px;
  }
}
</style>
