<template>
  <div class="header" v-if="show">
    <div class="eat-int-header" v-if="orderInfo.mealType === 'EAT_IN'">
      <p class="title">订单已完成</p>
      <p class="text">感谢您对本店的支持,期待您的再次光临</p>
    </div>
    <div
      class="self-pick-up-header"
      v-else-if="orderInfo.mealType === 'SELF_PICK_UP'"
    >
      <p class="title">支付成功</p>
      <p class="code">{{ orderInfo.mealCode }}</p>
      <p class="text">
        请于<span v-if="orderInfo.appointmentTime" class="pick-up-time">
          {{ orderInfo.appointmentTime }} </span
        >至柜台凭取餐号取餐
      </p>
    </div>

    <div
      class="take-away-header"
      v-else-if="orderInfo.mealType === 'TAKE_AWAY'"
    >
      <p class="title">支付成功</p>
      <p class="code">{{ orderInfo.mealCode }}</p>
      <p class="text">请至柜台凭取餐号取餐</p>
    </div>
    <div v-else-if="orderInfo.mealType === 'TAKE_OUT'" class="header-wrapper">
      <div class="takeout-wrapper">
        <div class="left-wrapper">
          <p v-if="orderInfo.shippingStatus === 'SHIPPING'" class="title">
            商家火速配送中
          </p>
          <p v-if="orderInfo.shippingStatus === 'SUCCESS'" class="title">
            订单已完成
          </p>
          <p v-if="orderInfo.shippingStatus === 'SHIPPING'" class="desc">
            商品由商家配送，请耐心等待
          </p>
          <p v-if="orderInfo.shippingStatus === 'SUCCESS'" class="desc">
            感谢您的支持，欢迎下次光临
          </p>
        </div>
        <div class="call-merchant" @click="phoneCall(orderInfo.merchantPhone)">
          联系商家
        </div>
      </div>
    </div>
    <div class="rider-container" v-if="orderInfo.mealType === 'TAKE_OUT'">
      <div class="rider-wrapper">
        <div class="left-wrapper">
          <p class="name">骑手姓名：{{ orderInfo.riderName }}</p>
          <p class="platform">第三方平台：{{ orderInfo.logisticsPlatform }}</p>
        </div>
        <div
          v-if="orderInfo.riderPhone"
          class="right-wrapper"
          @click="phoneCall(orderInfo.riderPhone)"
        >
          <img
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-phone_a.png"
            alt=""
            class="icon"
          />
          <p class="desc">联系骑手</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, unref, ref, toRefs } from "vue";
import { makePhoneCall } from "@utils";
export default {
  props: {
    orderInfo: {
      type: [Object],
      default: {},
    },
  },
  components: {},
  setup(props) {
    let { orderInfo } = toRefs(props);

    let show = computed(() => {
      return Object.keys(unref(orderInfo)).length > 0;
    });
    let titleText = computed(() => {
      let { mealType } = unref(orderInfo),
        textRes = undefined;
      if (mealType == "EAT_IN") {
        textRes = "订单已完成";
      } else if (mealType == "SELF_PICK_UP") {
        textRes = "支付成功";
      } else if (mealType == "TAKE_AWAY") {
        textRes = "支付成功";
      }
      return textRes;
    });

    let codeText = computed(() => {
      let { mealCode, mealType } = unref(orderInfo),
        textRes = undefined;
      if (mealType == "SELF_PICK_UP") {
        textRes = mealCode;
      } else if (mealType == "TAKE_AWAY") {
        textRes = mealCode;
      }
      return textRes;
    });

    let tooltipText = computed(() => {
      let { mealCode, mealType, appointmentTime } = unref(orderInfo),
        textRes = undefined;
      if (mealType == "EAT_IN") {
        textRes = "感谢您对本店的支持,期待您的再次光临";
      } else if (mealType == "SELF_PICK_UP") {
        textRes = `请于<span class="pick-up-time">${appointmentTime}</span>至柜台凭取餐号取餐`;
      } else if (mealType == "TAKE_AWAY") {
        textRes = "请至柜台凭取餐号取餐";
      }
      return textRes;
    });

    return {
      show,
      orderInfo,
      titleText,
      codeText,
      tooltipText,
      phoneCall(phone) {
        console.log("phone: ", phone);
        if (!phone) {
          return;
        }
        makePhoneCall(phone);
      },
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.header {
  width: 100%;
  box-sizing: border-box;

  .eat-int-header {
    padding: 8px 12px 12px 12px;

    .title {
      font-size: 22px;
      line-height: 33px;
      color: #333333;
      font-weight: bold;
    }

    .text {
      font-size: 14px;
      line-height: 21px;
      color: #333130;
      margin-top: 4px;
    }
  }

  .self-pick-up-header, .take-away-header {
    padding: 0 12px 12px 12px;
    text-align: center;
    background-color: white;
    border-radius: 8px;
    margin: 8px 12px;

    .title {
      height: 46px;
      line-height: 46px;
      font-size: 18px;
      color: #333130;
      border-bottom: 1px solid #EEEBE9;
      font-weight: bold;
    }

    .code {
      line-height: 66px;
      margin-top: 12px;
      font-size: 44px;
      color: #333333;
      font-weight: bold;
    }

    .text {
      font-size: 14px;
      color: #666666;

      .pick-up-time {
        color: #F25643;
      }
    }
  }

  .header-wrapper {
    height: 107px;
    margin-bottom: -44px;
    background: #666;

    .content {
      padding: 15px;
      font-size: 30px;
      font-weight: bold;
      color: #333;
      background-color: #F8F8F8;
    }

    .takeout-wrapper {
      display: flex;
      justify-content: space-between;
      padding: 0 12px;

      .left-wrapper {
        margin-top: 5px;

        .title {
          font-weight: bold;
          font-size: 24px;
          color: -white;
        }

        .desc {
          margin-top: 9px;
          font-size: 14px;
          color: white;
        }
      }

      .call-merchant {
        width: 84px;
        height: 28px;
        margin-top: 24px;
        box-sizing: border-box;
        line-height: 26px;
        border-radius: 23px;
        border: 1px solid white;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        color: white;
      }
    }
  }

  .rider-container {
    margin-bottom: 8px;
    padding: 0 8px;

    .rider-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      border-radius: 8px;
      text-align: center;
      background: white;

      .left-wrapper {
        padding: 15px 0;
        text-align: left;

        .name {
          font-weight: bold;
          font-size: 16px;
        }

        .platform {
          margin-top: 9px;
          font-size: 14;
        }
      }

      .right-wrapper {
        .icon {
          width: 27px;
          height: 27px;
        }

        .desc {
          font-size: 10px;
          color: #666;
        }
      }
    }
  }
}
</style>