<template>
  <div class="coupon-info-wrapper">
    <div class="angle-mark">
      <div class="title">特惠券包，限时抢购</div>
      <img
        class="title-bg"
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/create-order/icon-title_bg_01.png"
        alt=""
      />
    </div>
    <div class="coupon-info" v-if="recommendedCoupon.id">
      <div class="coupon-price">
        <div class="left">
          本单支付立省<span class="red">{{
            recommendedCoupon.couponCost / 100
          }}</span
          >元
        </div>
        <div class="right">
          <div class="buy-price">
            <div class="discount-price">
              ¥{{ recommendedCoupon.price / 100 }}
            </div>
            <div class="origin-price">
              ¥{{ recommendedCoupon.originalPrice / 100 }}
            </div>
          </div>
          <div
            class="buy"
            v-if="merchantInfo.enableOrderingCouponPackageUnionPay"
          >
            <checkbox-group @change="changeBuyCouponPackage">
              <checkbox
                class="checked red"
                value="1"
                :checked="orderInfo.isBuyCouponPackage"
                color="red"
              ></checkbox>
            </checkbox-group>
          </div>

          <div v-else class="buy-btn">购买</div>
        </div>
      </div>
      <div class="coupon-detail">
        <div class="left">
          <p class="text"><span class="dot"></span>72%的顾客使用优惠券买单</p>
          <p class="text">
            <span class="dot"></span>每单满{{
              recommendedCoupon.availableFee / 100
            }}元即可使用一张
          </p>
          <p class="text">
            <span class="dot"></span>有效期为{{ recommendedCoupon.validDays }}天
          </p>
        </div>
        <div class="right">
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-coupon_bg_01.png"
            alt=""
            class="bg"
          />
          <div class="content">
            <p class="price">
              <span class="num money">{{
                recommendedCoupon.couponCost / 100
              }}</span>
              <span class="connection">X</span>
              <span class="num">{{ recommendedCoupon.coupons.length }}</span
              >张
            </p>
            <p class="limit">
              满{{ recommendedCoupon.availableFee / 100 }}可用
            </p>
            <p class="limit">无门槛优惠券</p>
          </div>
        </div>
      </div>
      <div class="accord">
        <div class="radio-wrapper" @click="toggleIsAgreeCouponAccord">
          <text
            v-if="orderInfo.isAgreeCouponAccord"
            class="text-gray cuIcon-check cuIcon"
          ></text>
        </div>
        <span class="text">阅读并同意</span>
        <div class="accord-text" @click="goToAccordPage">《付费券包协议》</div>
      </div>
    </div>
  </div>
</template>
<script>
import { useCouponInfo } from "@hooks/merchantHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import { useOrder } from "@hooks/orderHooks";
import { useRecommendedCoupon } from "@hooks/payHooks";

export default {
  components: {},
  setup() {
    let { couponInfo } = useCouponInfo();
    let { navigateTo } = useNavigate();
    let { merchantInfo } = useMerchantInfo();
    let { orderInfo, setOrderInfo } = useOrder();
    let { recommendedCoupon } = useRecommendedCoupon();

    // TODO 计算合适的券然后使用
    return {
      isAgreeAccord: false,
      goToAccordPage() {
        navigateTo("OTHER/COUPON_ACCORD_TEXT");
      },
      merchantInfo,
      changeBuyCouponPackage(e) {
        let isBuyCouponPackage = e.detail.value == 1 ? true : false;
        setOrderInfo({
          isBuyCouponPackage,
        });
      },
      toggleIsAgreeCouponAccord() {
        setOrderInfo({
          issAgreeCouponAccord: !unref(orderInfo).issAgreeCouponAccord,
        });
      },
      recommendedCoupon,
      orderInfo,
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.coupon-info-wrapper {
  .box-size(calc(100% - 24px),unset,white);
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  .angle-mark {
    position: relative;
    .title {
      .line-center(27px);
      position: relative;
      z-index: 10;
      text-indent: 10px;
      .bold-font(14px,white);
    }
    .title-bg {
      .box-size(160px,27px);
      .pos-absolute(-2px,0);
    }
  }
  .coupon-info {
    box-sizing: border-box;
    padding: 0 12px 12px 12px;
    .coupon-price {
      height: 42px;
      .flex-simple(space-between,center);
      .left {
        .normal-font(15px,#333);
        .red {
          .bold-font(15px,#F25643);
        }
      }
      .right {
        display: flex;
        align-items: baseline;
        .buy-price {
          display: flex;
          font-size: 19px;
          align-items: baseline;
          margin-right: 10px;
          .price-symbol(12px, #333);
          .discount-price {
            .normal-font(19px,#333);
          }
          .origin-price {
            .normal-font(12px,#999);
            text-decoration: line-through;
            margin-left: 4px;
          }
        }
        .buy-btn {
          .box-size(54px,28px);
          .line-center(28px);
          .normal-font(15px,#f25643);
          text-align: center;
          border-radius: 14px;
          border: 1px solid #f25643;
        }
      }
    }
    .coupon-detail {
      .flex-simple(space-between,center);
      .box-size(100%,98px);
      margin-top: 5px;
      padding: 0 12px;
      border-radius: 2px;
      background: #fef6f5;
      .left {
        .text {
          margin-top: 6px;
          &:first-child {
            margin-top: 0;
          }
          .line-center(18px);
          .normal-font(12px,#333);
          .dot {
            .box-size(4px,4px,#666666);
            display: inline-block;
            margin-right: 6px;
            position: relative;
            border-radius: 50%;
            top: -2px;
          }
        }
      }
      .right {
        .box-size(131.5px,73.77px);
        position: relative;
        .bg {
          .box-size(100%,100%);
          z-index: 10;
        }
        .content {
          .box-size(100%,100%,transparent);
          .pos-absolute(0,0);
          text-align: center;
          .price {
            margin-top: 16.5px;
            font-size: 12px;
            .num {
              display: inline-block;
              .normal-font(22px,#f25643);
              .line-center(27px);
              &.money {
                .price-symbol(14px,#f25643);
              }
            }
            .connection {
              display: inline-block;
              margin: 0 8px;
              .normal-font(10px,#666);
            }
          }
          .limit {
            margin-top: 12px;
            .normal-font(13px,white);
          }
        }
      }
    }
    .accord {
      .line-center(17px);
      margin-top: 9px;
      position: relative;
      padding-left: 18px;
      .radio-wrapper {
        .box-size(12px,12px);
        .pos-absolute(3px,0);
        display: inline-block;
        border: 1px solid #666;
        border-radius: 50%;
        vertical-align: baseline;
        line-height: 9px;
        text-align: center;
        margin-right: 3px;
        .cuIcon {
          .pos-absolute(0.8px,1.3px);
          font-size: 10px;
        }
      }
      .text {
        .normal-font(11px,#333);
      }
      .accord-text {
        display: inline-block;
        .normal-font(11px,#FF0000);
      }
    }
  }
}
</style>