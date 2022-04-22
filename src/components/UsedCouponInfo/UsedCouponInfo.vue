<template>
  <div
    class="coupon-item"
    :class="{ disabled: disabled, 'check-coupon': showCheck }"
    @click="changeSelectedCoupon(coupon)"
  >
    <div class="coup-info">
      <div class="image-wrapper">
        <image
          :src="coupon.logoUrl"
          alt=""
          class="logo"
          mode="image-wrapper"
        ></image>
      </div>
      <div class="dish-info">
        <div class="coupon-type">满减券</div>
        <div class="merchant-name">
          {{ coupon.brandName || coupon.merchantName }}
        </div>
        <div class="time">{{ validPeriodText }}</div>
      </div>
      <div class="coupon-num-wrapper">
        <div class="coupon-num" :class="{ disabled: disabled }">
          ¥<span class="amount">{{ coupon.reduceCost / 100 }}</span>
        </div>
        <div class="coupon-least-cost" :class="{ disabled: disabled }">
          满{{ coupon.leastCost / 100 }}可用
        </div>
      </div>
    </div>
    <div class="coupon-dividing-line">
      <div class="before-semi-circle semi-circle"></div>
      <div class="after-semi-circle semi-circle"></div>
      <div class="dotted-line"></div>
    </div>
    <div class="coupon-use-limit">
      <div class="coupon-use-limit-text">不可与其他活动同享</div>
      <div class="coupon-use-wraper" v-if="!disabled && showUsed">
        <div class="coupon-use" @click.stop="useCoupon">立即使用</div>
      </div>
    </div>
    <div class="expired-identification" v-if="!!disabled">
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/used_01.png"
        alt=""
        v-if="disabled === 'USED'"
      />
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/expired_01.png"
        alt=""
        v-if="disabled === 'EXPIRED'"
      />
    </div>
    <div
      class="coupon-check"
      v-if="showCheck"
      :class="[
        selectedCoupon.id != undefined && selectedCoupon.id == coupon.id
          ? 'checked'
          : 'no-check',
      ]"
    >
      <!-- <text class="cuIcon-check"></text> -->
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/couponChecked_01.png"
        alt=""
        v-if="selectedCoupon.id != undefined && selectedCoupon.id == coupon.id"
        class="img"
      />
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/couponNoChecked_01.png"
        alt=""
        v-else
        class="img"
      />
    </div>
    <slot name="bottom"></slot>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@utils";

const ACCEPTED = "ACCEPTED";
const DISABLED = ["EXPIRED", "USED"];
const ISSUED = "ISSUED";

export default {
  props: {
    disabled: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "default",
    },
    couponType: {
      type: String,
      default: "",
    },
    coupon: {
      type: Object,
      default: {},
    },
    showUsed: {
      type: Boolean,
      default: true,
    },
    showCheck: {
      type: Boolean,
      default: false,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    selectedCoupon: {
      type: Object,
      default: {
        id: -1,
      },
    },
  },
  computed: {
    isDisabled() {
      let { state, isValid } = this.coupon;
      return DISABLED.indexOf(state) > -1 || (state === ACCEPTED && !isValid);
    },
    validPeriodText() {
      const dateFormatter = "yyyy-MM-dd";
      if (this.coupon.expiredTime) {
        const expiredDate = new Date(this.coupon.expiredTime * 1000);
        return `有效期至${formatDate(expiredDate, dateFormatter)}`;
      }

      if (!this.coupon.dateInfo) {
        return "";
      }
      const { type } = this.coupon.dateInfo;
      if (
        type === "DATE_TYPE_FIX_TERM" ||
        type === "DATE_TYPE_FIX_TIME_RANGE"
      ) {
        const { beginTimestamp, endTimestamp } = this.coupon.dateInfo;
        const beginDate = new Date(beginTimestamp * 1000);
        const endDate = new Date(endTimestamp * 1000);
        return `有效期至${formatDate(endDate, dateFormatter)}`;
      } else if (type === "DATE_TYPE_PERMANENT") {
        return "永久有效";
      } else {
        return "";
      }
    },
  },
  data() {
    return {
      clicked: true,
    };
  },
  methods: {
    useCoupon() {
      // 订阅总是允许的情况下添加订阅次数
      this.navigate(
        `/pages/merchant/index?merchantId=${this.coupon.merchantId}`
      );
    },
    changeSelectedCoupon(coupon) {
      // console.log("切换券")
      if (this.showCheck) {
        let selectedCoupon = null;
        if (coupon.id == this.selectedCoupon.id) {
          selectedCoupon = {
            id: -1,
          };
        } else {
          selectedCoupon = JSON.parse(JSON.stringify(coupon));
        }
        this.$emit("check", selectedCoupon);
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.coupon-item {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 10px 10px 12px;
  background-color: white;
  border-radius: 8px 8px 0 0;
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  overflow: hidden;

  &.check-coupon {
    border-radius: 8px;
  }

  &.disabled {
    opacity: 0.5;
    // .image-wrapper {
    // .logo {
    // opacity 0.5
    // }
    // }
    // .dish-info {
    // .coupon-type {
    // color rgba(153,153,153,0.5)
    // }
    // .merchant-name {
    // color rgba(51,51,51,0.5)
    // }
    // .time {
    // color rgba(102,102,102,0.5)
    // }
    // }
    // .coupon-num-wrapper {
    // .coupon-num{
    // color rgba(51,51,51,0.5)
    // }
    // .coupon-least-cost {
    // color rgba(51,51,51,0.5)
    // }
    // }
  }

  .coup-info {
    flex: 0 0 60px;
    height: 60px;
    display: flex;

    .image-wrapper {
      flex: 0 0 60px;
      width: 60px;
      height: 60px;

      image {
        width: 100%;
        height: 100%;
        opacity: 0.8;
        border-radius: 4px;
        background-size: 100% 100%;
      }
    }

    .dish-info {
      flex: 1;
      padding-left: 10px;
      display: flex;
      flex-direction: column;
      overflow: hidden;

      .coupon-type {
        border: 1px solid #cccccc;
        color: #999999;
        width: 38px;
        height: 12px;
        border-radius: 2px;
        height: 12px;
        line-height: 12px;
        font-size: 10px;
        text-align: center;
      }

      .merchant-name {
        color: #333;
        max-width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: bolder;
        height: 24px;
        line-height: 24px;
        margin: 4px 0 4px 0;
        flex-shrink: 0;
      }

      .time {
        color: #666666;
        font-size: 12px;
      }
    }

    .coupon-num-wrapper {
      flex: 0 0 90px;
      width: 90px;
      text-align: center;

      .coupon-num {
        color: F25643;

        .amount {
          line-height: 36px;
        }

        &.disabled {
          color: #333;
        }

        span {
          font-size: 36px;
        }
      }

      .coupon-least-cost {
        margin-top: 6px;
        font-size: 12px;
        color: #666666;
        text-align: center;

        &.disabled {
          color: #333;
        }
      }
    }
  }

  .coupon-dividing-line {
    // padding: 0 12px;
    flex: 0 0 21px;
    height: 21px;
    box-sizing: border-box;
    position: relative;

    .semi-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #f0f0f0;
      position: absolute;
      top: 50%;
      transform: translate(0, -50%);

      &.before-semi-circle {
        left: -18px;
      }

      &.after-semi-circle {
        right: -18px;
      }
    }

    .dotted-line {
      position: absolute;
      top: 50%;
      height: 1px;
      left: 0px;
      right: 0px;
      background: linear-gradient(to right, #CCCCCC, #CCCCCC 2px, transparent 2px, transparent);
      background-size: 4px 100%;
      transform: scaleY(0.5);
    }
  }

  .coupon-use-limit {
    height: 19px;
    flex: 0 0 19px;
    display: flex;
    justify-content: space-between;

    .coupon-use-limit-text {
      color: #999;
      font-size: 12px;
      line-height: 19px;
    }

    .coupon-use-wraper {
      flex: 0 0 90px;
      width: 90px;
      display: flex;
      justify-content: center;

      .coupon-use {
        width: 60px;
        height: 19px;
        line-height: 19px;
        text-align: center;
        font-size: 11px;
        font-weight: 100;
        color: white;
        background-color: #F25643;
        border-radius: 22.5px;
        cursor: pointer;
      }
    }
  }

  .expired-identification {
    position: absolute;
    right: 12px;
    bottom: 0px;
    width: 90px;
    height: 39px;
    text-align: center;

    image {
      width: 60px;
      height: 39px;
    }
  }

  .coupon-check {
    width: 28.5px;
    height: 28.5px;
    // background linear-gradient(45deg,transparent 0%,transparent 50%,#cccccc 50%,#cccccc 100%)
    position: absolute;
    top: 0;
    right: 0;

    .cuIcon-check {
      position: absolute;
      top: 3px;
      right: 2px;
      font-size: 11px;
      color: white;
    }

    .img {
      width: 28.5px;
      height: 28.5px;
    }

    &.checked {
      // background linear-gradient(45deg,transparent 0%,transparent 50%,#F25643 50%,#F25643 100%)
    }
  }
}
</style>
