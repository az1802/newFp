<template>
  <div
    class="splash-modal"
    :class="isShow ? 'fade-modal-enter-active' : 'hide'"
    @touchmove.stop="stop"
    @click="hideModal"
  >
    <div
      class="image-modal"
      :class="isShow ? 'scale-modal-enter-active' : 'scale-modal-leave-to'"
      @click.stop="stop"
    >
      <img class="modal-bg" :src="merchantInfo.splashImageUrl" alt="" />
    </div>
    <button
      v-if="1 || merchantInfo.splashMode === 'MEMBER_RECHARGE'"
      class="btn-recharge"
      @click.stop="navigateTo('MARKETING/MAKE_DEPOSIT')"
    >
      去充值
    </button>
    <img
      src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-close_02.svg"
      alt=""
      class="close"
      @click="hideModal"
    />
  </div>
</template>

<script type="text/ecmascript-6">
import { useModal, useNavigate } from "@hooks/commonHooks";
import { useMerchantInfo } from "@hooks/merchantHooks";
import { unref } from "vue";
import API from "@api";
export default {
  setup() {
    let { isShow, showModal, hideModal, stop } = useModal();
    let { navigateTo } = useNavigate();
    let { merchantInfo } = useMerchantInfo();

    return {
      isShow,
      showModal,
      hideModal,
      stop,
      merchantInfo,
      navigateTo,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.splash-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide-modal {
    opacity: 0;
    transition: all 0.5s;
    z-index: -100;
  }

  .image-modal {
    width: 100%;
    max-width: 325px;
    height: 428px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border-radius: 15px;
    text-align: center;
    background: white;

    .modal-bg {
      width: 100%;
      height: 100%;
      border-radius: 15px;
    }
  }

  .btn-recharge {
    position: relative;
    bottom: 55px;
    width: 280px;
    height: 45px;
    line-height: 45px;
    border-radius: 23px;
    text-align: center;
    font-family: 'PingFangSC-Medium';
    font-size: 19px;
    color: white;
    background: #F25643;
  }

  .coupon-modal {
    width: 100%;
    max-width: 325px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    border-radius: 15px;
    text-align: center;
    background: white;
    overflow: hidden;

    .header-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;

      .bg-img {
        width: 100%;
        height: 120px;
      }

      .text-wrapper {
        position: relative;
        top: -100px;

        .sub-title {
          font-size: 16px;
          color: white;
        }

        .main-title {
          font-size: 22px;
          color: white;
          margin-top: 20px;
        }
      }
    }

    .coupon {
      width: 90%;
    }

    .text-wrapper {
      font-size: 18px;

      .text {
        font-size: 18px;
        margin-bottom: 20px;
      }
    }

    .btn-wrapper {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: white;
      margin-top: 30px;

      .btn {
        width: 280px;
        height: 50px;
        line-height: 50px;
        border-radius: 23px;
        text-align: center;
        font-family: 'PingFangSC-Medium';
        font-size: 19px;
        color: white;
        background: #F25643;
      }
    }
  }

  .close {
    width: 32px;
    height: 32px;
    margin-top: 15px;
  }
}
</style>
