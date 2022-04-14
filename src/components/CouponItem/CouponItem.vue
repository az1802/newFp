<template>
  <div class="coupon-item">
    <img
      v-if="!isDisabled"
      class="coupon-bg"
      src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/coupon-package/pic-coupon_click_bg.png"
      alt=""
    />
    <img
      v-if="isDisabled"
      class="coupon-bg"
      src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/coupon-package/pic-coupon_unclick_bg.png"
      alt=""
    />
    <div class="coupon-container" :class="{ disabled: isDisabled }">
      <div class="blank1"></div>
      <div class="money-wrapper">
        <div class="content">
          <span class="icon">¥</span
          ><span class="money">{{ coupon.reduceCost / 100 }}</span>
        </div>
      </div>
      <div class="blank2"></div>
      <div class="detail-wrapper" v-if="!couponType">
        <div class="coupon-name-wrapper">
          <img :src="coupon.logoUrl" alt="" class="logo" />
          <p class="coupon-name">{{ coupon.title }}</p>
        </div>
        <div class="bottom-wrapper">
          <div class="desc-wrapper">
            <p class="store-name">{{ coupon.brandName }}</p>
            <p class="time">{{ validPeriodText }}</p>
          </div>
          <button
            v-if="type === 'checkbox'"
            hover-class="none"
            class="check-wrapper"
            :disabled="isDisabled"
          >
            <CheckBox
              :disabled="isDisabled"
              :checked="coupon.checked"
              @check="check"
            ></CheckBox>
          </button>
        </div>
        <img
          v-if="coupon.state === 'EXPIRED'"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-expired.png"
          alt=""
          class="coupon-status"
        />
        <img
          v-if="coupon.state === 'USED'"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-used.png"
          alt=""
          class="coupon-status"
        />
        <img
          v-if="coupon.state === 'ACCEPTED' && !coupon.isValid"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-ineffective.png"
          alt=""
          class="coupon-status"
        />
      </div>
      <div class="package-wrapper" v-if="couponType === 'package'">
        <div class="detail">
          <p class="least">满{{ coupon.leastCost / 100 }}元可用</p>
          <p class="time">{{ validPeriodText }}</p>
        </div>
        <button
          v-if="type === 'checkbox'"
          hover-class="none"
          class="check-wrapper"
          :disabled="isDisabled"
        >
          <CheckBox
            :disabled="isDisabled"
            :checked="coupon.checked"
            @check="check"
          ></CheckBox>
        </button>
      </div>
      <div class="blank3"></div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { formatDate } from "@utils";
const ACCEPTED = "ACCEPTED";
const DISABLED = ["EXPIRED", "USED"];

export default {
  props: {
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
    showButton: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isDisabled() {
      let { state, isValid } = this.coupon;
      return (
        this.disabled ||
        DISABLED.indexOf(state) > -1 ||
        (state === ACCEPTED && !isValid)
      );
    },
    validPeriodText() {
      const dateFormatter = "yyyy-MM-dd";
      if (this.coupon.expiredTime) {
        const expiredDate = new Date(this.coupon.expiredTime * 1000);
        return `${formatDate(expiredDate, dateFormatter)}到期`;
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
        return `${formatDate(endDate, dateFormatter)}到期`;
      } else if (type === "DATE_TYPE_PERMANENT") {
        return "永久有效";
      } else {
        return "";
      }
    },
  },
  data() {
    return {};
  },
  methods: {
    check() {
      this.$emit("check", this.coupon);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.coupon-item {
  position: relative;
  width: 100%;
  height: 105px;

  .coupon-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .coupon-container {
    position: relative;
    display: flex;
    height: 105px;
    box-sizing: border-box;
    padding-top: 3.5px;
    padding-bottom: 7.5px;

    &.disabled {
      .coupon-name, .store-name {
        color: #888888 !important;
      }

      .btn {
        opacity: 0.4;
      }
    }

    .blank1 {
      flex: 0.021;
    }

    .blank2 {
      flex: 0.055;
    }

    .blank3 {
      flex: 0.019;
    }

    .money-wrapper {
      flex: 0.365;
      display: flex;
      align-items: center;
      justify-content: center;

      .content {
        .icon {
          font-size: 15px;
          color: white;
        }

        .money {
          font-size: 30px;
          color: white;
        }
      }
    }

    .detail-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      padding: 0 10px;
      overflow: hidden;

      .coupon-name-wrapper {
        display: flex;
        align-items: center;
        padding-right: 20px;

        .logo {
          width: 30px;
          height: 30px;
          border-radius: 100%;
          background: #C05C5C;
        }

        .coupon-name {
          flex: 1;
          no-wrap();
          padding-left: 5px;
          font-size: 16px;
          color: #353535;
        }
      }

      .bottom-wrapper {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .desc-wrapper {
          flex: 1;
          overflow: hidden;

          .store-name {
            no-wrap();
            font-size: 13px;
            color: #595959;
          }

          .time {
            margin-top: 5px;
            no-wrap();
            font-size: 11px;
            color: #888888;
          }
        }

        .btn {
          padding: 10px 17px;
          border-radius: 25px;
          font-size: 13px;
          color: white;
          background: #E3513F;

          &.received {
            background: #F36442;
          }
        }

        .check-wrapper {
          background: white;
        }
      }
    }

    .package-wrapper {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 10px;
      overflow: hidden;

      .detail {
        .least {
          font-family: 'PingFangSC-Medium';
          font-size: 18px;
        }

        .time {
          margin-top: 12px;
          font-size: 13px;
          color: #666666;
        }
      }
    }

    .coupon-status {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 60px;
      height: 60px;
    }
  }
}
</style>
