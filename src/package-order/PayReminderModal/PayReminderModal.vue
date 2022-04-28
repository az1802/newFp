<template>
  <div
    class="pay-reminder-modal"
    :class="show ? 'fade-modal-enter-active ' : 'hide'"
    @touchmove.stop="stop"
  >
    <div class="pay-reminder-wrapper">
      <div class="content">
        <img
          class="bg-img"
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-merchant/create-order/pay-reminder_01.png"
        />

        <div class="header">
          <div class="header-text">
            <p class="main-title">下单成功</p>
            <p class="sub-title">订单已送达后厨, 请耐心等待</p>
          </div>
        </div>

        <div class="main-info">
          <div class="reminder-text">
            <span class="normal-text">— 您已下单成功, 前往支付</span>
            <span class="highlight-text">即享优惠</span>
            <span class="normal-text">—</span>
          </div>
          <div class="btn-pay-now" @click="payNow">前往支付</div>
          <div class="btn-pay-later" @click="payLater">稍后再付</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { navigateTo, redirectTo } from "@utils";
import { useOrder } from "@hooks/orderHooks";
import { unref } from "vue";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    merchantId: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    let { orderInfo } = useOrder();
    function hide() {
      emit("update:show", false);
    }
    return {
      stop() {
        return "";
      },
      hide,
      payNow() {
        navigateTo("ORDER/PAY_ORDER");
        hide();
      },
      payLater() {
        let { orderId } = unref(orderInfo);
        redirectTo("ORDER/CREATE_ORDER", {
          pendingOrderId: orderId,
        });
        hide();
      },
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.pay-reminder-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.6);
  z-index: -100;

  &.fade-modal-enter-active {
    z-index: 100;
    opacity: 1;
    transition: all 0.5s;
  }

  &.hide {
    z-index: -100;
    opacity: 0;
    transition: all 0.5s;
  }

  .pay-reminder-wrapper {
    width: 80vw;
    border-radius: 10px;
    overflow: hidden;
    height: 90.58vw;

    .content {
      width: 100%;
      height: 100%;
      position: relative;

      .bg-img {
        width: 100%;
        height: 100%;
      }

      .header {
        width: 100%;
        height: 68px;
        position: absolute;
        top: 0px;

        .header-text {
          width: 100%;
          height: 68px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;

          .main-title {
            color: white;
            font-size: 22px;
          }

          .sub-title {
            margin-top: 10px;
            color: white;
            font-size: 14px;
          }
        }
      }

      .main-info {
        width: 100%;
        height: 50%;
        position: absolute;
        top: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .reminder-text {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 15px;
          margin-top: 20px;

          .normal-text {
            color: #666;
            margin-left: 5px;
          }

          .highlight-text {
            color: #F25643;
          }
        }

        .btn-pay-now {
          width: 200px;
          height: 36px;
          border-radius: 32px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          background: #F25643;
          margin-top: 15px;
        }

        .btn-pay-later {
          height: 32px;
          color: #666;
          margin-top: 15px;
        }
      }
    }
  }
}
</style>
