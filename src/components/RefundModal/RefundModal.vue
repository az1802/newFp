<template>
  <view class="cu-modal" :class="show ? 'show' : ''">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-end">
        <view class="content text-bold">申请退款</view>
        <view class="action" @tap="hideModal">
          <text class="cuIcon-close text-gray text-bold"></text>
        </view>
      </view>
      <view class="padding-xl bg-white content-wrapper">
        <p class="title"><text class="text-bold">选择退款的原因</text></p>
        <form class="form-wrapper">
          <radio-group class="radio-group" @change="reasonChange">
            <div class="radio-item cu-form-group">
              <span class="text">误买、多买，不想要</span>
              <radio
                class="radio red"
                :class="reason == 'buyMistake' ? 'checked' : ''"
                value="buyMistake"
              ></radio>
            </div>
            <div class="radio-item cu-form-group">
              <span class="text">不划算，与预期不符</span>
              <radio
                class="radio red"
                :class="reason == 'noCost' ? 'checked' : ''"
                value="noCost"
              ></radio>
            </div>
            <div class="radio-item cu-form-group">
              <span class="text">不会用</span>
              <radio
                class="radio red"
                :class="reason == 'notUse' ? 'checked' : ''"
                value="notUse"
              ></radio>
            </div>
            <div class="radio-item cu-form-group">
              <span class="text">其他</span>
              <radio
                class="radio red"
                :class="reason == 'other' ? 'checked' : ''"
                value="other"
              ></radio>
            </div>
            <div class="other-wrapper" v-if="reason == 'other'">
              <textarea
                name=""
                placeholder="请详细填写退款原因"
                v-model="reasonDetail"
                class="reason-detail"
              ></textarea>
            </div>
          </radio-group>
          <p class="title phone-title">
            <text class="text-bold">联系电话</text
            ><text class="small">(选填)</text>
          </p>
          <div class="phone-wrapper">
            <input
              type="text"
              v-model="phone"
              placeholder="请填写电话方便我们联系"
              class="phone-input"
            />
          </div>
        </form>
      </view>
      <view class="cu-bar bg-white">
        <view class="action flex-sub sumbit-btn" @click="sumbitApply"
          >提交申请</view
        >
      </view>
    </view>
  </view>
</template>
<script type="text/ecmascript-6">
const reasons = ["buyMistake", "noCost", "notUse", "other"];
const reasonMap = {
  buyMistake: "误买、多买，不想要",
  noCost: "不划算，与预期不符",
  notUse: "不会用",
};
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      reason: "",
      reasonDetail: "",
      phone: "",
    };
  },
  methods: {
    hideModal() {
      this.$emit("update:show", !this.show);
    },
    reasonChange(e) {
      let res = e.detail.value;
      this.reason = res;
    },
    sumbitApply() {
      let res = {
        reason: "",
        phone: this.phone,
      };
      if (this.reason) {
        res.reason = reasonMap[this.reason];
      }
      if (this.reason == "other") {
        res.reason = this.reasonDetail;
      }
      this.$emit("apply", res);
    },
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.cu-modal {
  .content-wrapper {
    padding: 10px 16px 0 16px;

    .title {
      font-size: 16px;
      color: #333333;
      padding: 10px 0;
      margin-bottom: 10px;
      text-align: left;

      &.phone-title {
        text-align: left;
        margin-top: 14px;
        margin-bottom: 0px;
      }

      .small {
        font-size: 12px;
        color: #666666;
      }
    }

    .form-wrapper {
      width: 100%;
      margin-top: 10px;

      .radio-group {
        width: 100%;

        .radio-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          border-top: 0px solid;
          padding: 0px;
          min-height: 80rpx;

          .text {
            font-size: 14px;
            color: #333333;
          }
        }

        .other-wrapper {
          width: 100%;
          height: 87px;
          margin-top: 2px;

          .reason-detail {
            width: 100%;
            height: 87px;
            background-color: #F8F8F8;
            border-radius: 8px;
            text-align: left;
            font-size: 14px;
            padding: 12px;
            box-sizing: border-box;
          }
        }
      }
    }

    .phone-wrapper {
      .phone-input {
        width: 100%;
        background-color: #F8F8F8;
        border-radius: 8px;
        height: 38px;
        text-align: left;
        margin-top: 12px;
        font-size: 14px;
        padding-left: 10px;
        box-sizing: border-box;
      }
    }
  }

  .cu-bar {
    .sumbit-btn {
      width: 100%;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background-color: #F25643;
      color: white;
      font-weight: bolder;
      font-size: 18px;
      margin: 16px 16px 22px 16px;
      border-radius: 22px;
    }
  }
}
</style>