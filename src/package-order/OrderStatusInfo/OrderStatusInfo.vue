<template>
  <div class="header" v-if="show">
    <div class="title" v-if="titleText !== undefined">{{ titleText }}</div>
    <div class="code" v-if="codeText !== undefined">{{ codeText }}</div>
    <div class="text" v-if="tooltipText !== undefined">感谢您对本店的支持</div>
    <div v-if="orderInfo.mealType == 'TAKE_OUT'">
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
        <div class="call-merchant" @click="makePhoneCall">联系商家</div>
      </div>
    </div>

    <div class="rider-container" v-if="orderInfo.mealType === 'TAKE_OUT'">
      <div class="rider-wrapper">
        <div class="left-wrapper">
          <p class="name">骑手姓名：{{ orderInfo.riderName }}</p>
          <p class="platform">第三方平台：{{ orderInfo.logisticsPlatform }}</p>
        </div>
        <div class="right-wrapper" @click="makePhoneCall(orderInfo.riderPhone)">
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
      makePhoneCall() {},
    };
  },
};
</script>
<style lang="less" scoped>
@import "@design/index.less";
.header {
  .box-size(100vw,unset,transparent);
  padding: 8px 12px 12px 12px;
  .title {
    .line-center(33px);
    .bold-font(22px,#333130);
    .border-bottom-1px(#EEEBE9);
  }
  .code {
    .line-center(66px);
    .normal-font(44px,#333333);
    margin-top: 12px;
  }
  .text {
    .line-center(21px);
    .normal-font(14px,#666666);
    margin-top: 4px;
  }
}
</style>