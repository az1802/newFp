<template>
  <div class="coupon-info-wrapper" v-if="couponList.length">
    <div class="coupons">
      <p class="title">特惠券包</p>
      <swiper
        class="swiper-wrapper"
        indicator-dots
        autoplay
        indicator-color="#D8D8D8"
        indicator-active-color="#F25643"
      >
        <swiper-item
          v-for="couponItem in couponList"
          :key="couponItem.originalPrice"
          class="swiper-item"
        >
          <view class="coupon-item">
            <div class="info">
              <p class="text">
                {{ fenToYuan(couponItem.coupons[0].reduceCost)
                }}<span class="small">元</span
                ><span class="connector">&#935;</span>{{ couponItem.number
                }}<span class="small">张</span>
              </p>
              <img
                src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/invite-share-coupon-background_01.png"
                alt=""
                mode="aspectFill"
                class="img"
              />
            </div>
            <div class="detail-wrapper">
              <div class="top-info">
                <div class="name">{{ couponItem.name }}</div>
                <div class="detail">
                  内含{{ couponItem.number }}张{{
                    fenToYuan(couponItem.coupons[0].reduceCost)
                  }}元优惠券
                </div>
              </div>
              <div class="price">
                <span class="company-price">{{
                  fenToYuan(couponItem.price)
                }}</span
                ><span class="no-discount-pirce">{{
                  fenToYuan(couponItem.originalPrice)
                }}</span>
              </div>
            </div>
            <div
              class="operation"
              :class="disableShowCouponPackagePurchaseNumber ? 'only-buy' : ''"
            >
              <div class="buy" @click="buyCoupon(merchantId, couponItem)">
                抢购
              </div>
              <div
                class="sell-count"
                v-if="!disableShowCouponPackagePurchaseNumber"
              >
                {{ couponItem.sellingQuantity }}人已购
              </div>
            </div>
          </view>
        </swiper-item>
      </swiper>
      <!-- #ifdef MP-ALIPAY  -->
      <div class="swiper-bottom-placeholder" style="height: 16px"></div>
      <!-- #endif -->
    </div>
  </div>
</template>
<script>
import { useCouponPay } from "@hooks/payHooks";
import { fenToYuan } from "@utils";
export default {
  props: {
    merchantId: {
      type: String,
      default: "",
    },
    couponList: {
      type: [Object, Array],
      default: [],
    },
    disableShowCouponPackagePurchaseNumber: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  setup() {
    const { buyCoupon } = useCouponPay();
    return {
      fenToYuan,
      buyCoupon,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.coupon-info-wrapper {
  width: 100%;
  height: 148px;
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 12px;

  .coupons {
    width: 100%;
    background-color: white;
    padding: 0 12px;
    box-sizing: border-box;
    border-radius: 8px;

    .title {
      // height 18px
      font-size: 14px;
      color: #333333;
      // font-weight bold
      padding: 12px 0 12px 0;
      border-radius: 8px;
    }

    .swiper-wrapper {
      width: 100%;
      height: 107px;

      // padding-bottom 16px
      .wx-swiper-dot.wx-swiper-dot-active {
        background: red;
        border-radius: 15rpx;
      }

      .wx-swiper-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
      }

      .swiper-item {
        width: 100%;
        height: 100%;

        .coupon-item {
          width: 100%;
          height: 91px;
          border-radius: 8px;
          background-color: #F8F8F8;
          padding: 12px;
          display: flex;
          box-sizing: border-box;

          .info {
            width: 106.5px;
            flex-basis: 106.5px;
            height: 66.5px;
            position: relative;

            .text {
              position: absolute;
              left: 50%;
              top: 20px;
              transform: translateX(-50%);
              z-index: 10;
              font-size: 22px;
              color: #F25643;
              font-weight: bold;
              white-space: nowrap;
              max-width: 100px;

              .small {
                font-size: 12px;
                font-weight: 100;
              }

              .connector {
                font-size: 12px;
                font-weight: 100;
                margin: 0 4px;
                vertical-align: middle;
              }
            }

            .img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }
          }
        }

        .detail-wrapper {
          flex: 1;
          margin-left: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .top-info {
            .name {
              font-size: 14px;
              flex-basis: 16px;
              height: 16px;
              color: #333333;
              font-weight: bold;
              no-wrap();
            }

            .detail {
              font-size: 12px;
              margin-top: 8px;
              color: #666666;
              no-wrap();
            }
          }

          .price {
            // margin-top 17px
            font-size: 18px;
            color: #F25643;

            .company-price {
              company-price();
            }

            .no-discount-pirce {
              font-size: 12px;
              margin-left: 2px;
              color: #999999;
              text-decoration: line-through;
              company-price(#999999);
            }
          }
        }

        .operation {
          flex-basis: 80px;
          width: 80px;
          text-align: center;

          &.only-buy {
            display: flex;
            align-items: center;
          }

          .buy {
            width: 50px;
            height: 25px;
            font-size: 13px;
            color: white;
            background-color: #F25643;
            text-align: center;
            line-height: 25px;
            border-radius: 12.5px;
            display: inline-block;
            margin-top: 11px;
          }

          .sell-count {
            color: #999999;
            font-size: 12px;
            margin-top: 8px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>