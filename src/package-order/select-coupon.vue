<template>
  <div class="select-coupon">
    <NavigationBar title="优惠券" />
    <scroll-view class="coupon-list" scroll-y>
      <div
        v-for="(couponItem, index) in avaiableMerchantCoupons"
        :key="index"
        class="coupon-wrapper"
      >
        <MerchantCouponItem
          type="checkbox"
          couponType="package"
          :coupon="couponItem"
          @check="changeSelCoupon"
          :showUsed="false"
          :showCheck="true"
          :selectedCouponId="selCouponInfo && selCouponInfo.id"
        ></MerchantCouponItem>
      </div>
      <p class="title" v-show="disabledCoupons[0]">不可用券</p>
      <div
        v-for="(couponItem, index) in disabledCoupons"
        :key="index"
        class="coupon-wrapper"
      >
        <MerchantCouponItem
          type="checkbox"
          couponType="package"
          :coupon="couponItem"
          disabled
          :showUsed="false"
          :showCheck="false"
        >
        </MerchantCouponItem>
        <div class="no-use-reason">
          <span class="warn-text">不可用原因 :</span>
          <span>订单金额未满{{ couponItem.leastCost / 100 }}元</span>
        </div>
      </div>
      <div
        class="coupon-placeholder-wrapper"
        v-show="
          avaiableMerchantCoupons.length == 0 && disabledCoupons.length == 0
        "
      >
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/none-tooltip_02.png"
          alt=""
          mode="aspectFit"
          class="img"
        />
      </div>
    </scroll-view>
    <div class="fix-bottom-wrapper">
      <div class="tooltip-text">
        {{
          selCouponInfo && selCouponInfo.reduceCost
            ? "优惠券立减¥" + selCouponInfo.reduceCost / 100
            : ""
        }}
      </div>
      <button class="btn" @click="selectCoupon">确定</button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { onBeforeMount, ref, computed, unref } from "vue";
import { useUserMerchantCoupon } from "@hooks/userHooks";
import { useOrder } from "@hooks/orderHooks";
import { useDish } from "@hooks/menuHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useDirectPaySelCoupon } from "@hooks/directPayHooks";

let merchantId, from, billFee;
export default {
  onLoad(opts) {
    merchantId = opts.merchantId;
    billFee = opts.billFee;
    from = opts.from;
  },
  setup() {
    let { userMerchantCoupons, requestUserMerchantCoupons } =
      useUserMerchantCoupon();
    let { orderInfo, setOrderInfo } = useOrder();
    const { selCoupon, setSelCoupon, toogleAutoSelCoupon } =
      useDirectPaySelCoupon();
    onBeforeMount(async () => {
      requestUserMerchantCoupons(merchantId);
    });

    const { navigateBack } = useNavigate();

    const { selectedDishesFinalTotalPrice } = useDish();

    const avaiableMerchantCoupons = computed(() => {
      let payFee = billFee ? billFee : unref(selectedDishesFinalTotalPrice);
      return unref(userMerchantCoupons).filter((couponItem) => {
        if (couponItem?.leastCost <= payFee && couponItem.state == "ACCEPTED") {
          return true;
        }
      });
    });
    const disabledCoupons = computed(() => {
      let payFee = billFee ? billFee : unref(selectedDishesFinalTotalPrice);
      return unref(userMerchantCoupons).filter((couponItem) => {
        if (couponItem?.leastCost <= payFee && couponItem.state == "ACCEPTED") {
        } else {
          false;
        }
      });
    });

    let selCouponInfo;
    if ((from = "directPay")) {
      selCouponInfo = ref({
        id: unref(selCoupon)?.id || "",
        reduceCost: unref(selCoupon)?.reduceCost || "",
      });
    } else {
      selCouponInfo = ref({
        id: unref(orderInfo)?.selCouponId || "",
        reduceCost: unref(orderInfo)?.selCouponReduceCost || "",
      });
    }

    function changeSelCoupon(coupon) {
      if (!coupon) {
        selCouponInfo.value = "";
      } else {
        selCouponInfo.value = coupon;
      }
    }

    function selectCoupon() {
      let selInfo = unref(selCouponInfo);

      if (!selInfo) {
        if (from == "directPay") {
          setSelCoupon({});
          toogleAutoSelCoupon(false);
        } else {
          setOrderInfo({
            selCouponReduceCost: 0, //使用券包的价格
            selCouponId: "", //使用券包的id
          });
        }
      } else {
        if (from == "directPay") {
          toogleAutoSelCoupon(true);
          setSelCoupon({
            id: selInfo.id,
            reduceCost: selInfo.reduceCost,
          });
        } else {
          setOrderInfo({
            selCouponReduceCost: selInfo.reduceCost, //使用券包的价格
            selCouponId: selInfo.id, //使用券包的id
          });
        }
      }
      navigateBack();
    }
    return {
      selCouponInfo,
      avaiableMerchantCoupons,
      disabledCoupons,
      changeSelCoupon,
      selectCoupon,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.select-coupon {
  width: 100%;
  padding-top: 10px;
  padding-bottom: 50px;
  height: 100vh;
  background-color: #F0F0F0;

  .coupon-list {
    width: 100%;
    height: calc(100vh - 150px);
  }

  .title {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #333130;
    padding: 0 12px;
    box-sizing: border-box;
  }

  .coupon-wrapper {
    padding: 0 12px;

    .no-use-reason {
      background-color: #e6e6e6;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      color: #333333;
      border-radius: 0 0 8px 8px;
      margin-top: -10px;
      margin-bottom: 10px;
      padding: 0 12px;

      .warn-text {
        color: #F25643;
        margin-right: 10px;
      }
    }
  }

  .coupon-placeholder-wrapper {
    padding-top: 40px;
    box-sizing: border-box;
    text-align: center;

    .img {
      width: 315px;
      height: 195px;
    }
  }

  .viewExpiredCoupon {
    text-align: center;
    color: #333333;
    font-size: 14px;
    line-height: 21px;
    padding: 20px 0 80px;
  }

  .fix-bottom-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 49px;
    box-sizing: border-box;
    padding: 0 12px;
    box-shadow: 0px 0px 8px 1px rgba(223, 211, 210, 0.7);
    background: white;

    .tooltip-text {
      font-size: 14px;
      color: #666666;
      align-self: center;
    }

    .btn {
      align-self: center;
      flex-basis: 96px;
      width: 96px;
      height: 40px;
      line-height: 40px;
      border-radius: 25px;
      font-size: 16px;
      color: white;
      background: #F25643;
      margin: 0;
    }
  }
}
</style>
