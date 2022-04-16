<!--
 * @Descripttion: 
 * @version: 
 * @Author: xinguangding
 * @Date: 2021-08-10 10:59:13
 * @LastEditors: sunj
 * @LastEditTime: 2021-10-27 14:25:30
-->
<template>
  <div
    class="option-modal"
    :class="isShow ? 'fade-modal-enter-active' : 'hide'"
    :style="hidden && 'z-index: -1'"
    @touchmove.stop="stop"
  >
    <div
      class="modal-wrapper border-bottom-1px"
      :class="isShow ? 'up-modal-enter-active' : 'up-modal-leave-to'"
      @click.stop="stop"
    >
      <div class="content">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-blue-ok.png"
          class="pay-success-icon"
        />
        <div class="pay-text">支付成功</div>
        <div class="order-box">
          <span class="order-text">￥</span>
          <span class="order-amount">{{
            payData.paidFee | normalizePrice
          }}</span>
        </div>
        <div class="province-box" v-if="payData.payMethod != 'MEMBER_ACCOUNT'">
          <span class="province-text">本单已省</span>
          <span class="province-amound"
            >￥{{ (payData.billFee - payData.paidFee) | normalizePrice }}</span
          >
        </div>
      </div>
      <div class="btn-wrapper">
        <div class="btn" @click="selected">关闭</div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    payData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      isShow: false,
      hidden: true,
    };
  },
  computed: {},
  mounted() {
    this.show();
  },
  methods: {
    stop() {
      return "";
    },
    show() {
      this.hidden = false;
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
      setTimeout(() => {
        this.hidden = true;
      }, 500);
    },

    selected() {
      this.hide();
      this.$emit("changePaySuccessmodalShow", false);
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.option-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  background: rgba(0, 0, 0, 0.5);

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide {
    z-index: -100;
    opacity: 0;
    transition: all 0.5s;
  }

  .modal-wrapper {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 17px 0;
    box-sizing: border-box;
    border-radius: 10px 10px 0 0;
    background: white;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .pay-success-icon {
        width: 60px;
        height: 60px;
        margin-top: 20px;
      }

      .order-box {
        margin-top: 22px;
      }

      .province-box {
        margin-top: 8px;
        margin-bottom: 100px;
      }

      .order-text {
        font-size: 18px;
        color: #333;
        font-weight: bold;
      }

      .order-amount {
        font-size: 30px;
        color: #333;
        font-weight: bold;
      }

      .province-text {
        font-size: 14px;
        color: #333;
      }

      .province-amound {
        font-size: 14px;
        color: #f25643;
      }

      .pay-text {
        color: #333;
        font-size: 14px;
        font-weight: 400;
      }
    }

    .btn-wrapper {
      margin-top: 25px;
      padding: 0 12px;

      .btn {
        height: 45px;
        line-height: 45px;
        border-radius: 23px;
        text-align: center;
        font-family: 'PingFangSC-Medium';
        font-size: 19px;
        color: white;
        background: #F25643;
      }
    }
  }
}
</style>
