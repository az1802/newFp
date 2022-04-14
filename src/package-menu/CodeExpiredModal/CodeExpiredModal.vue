<template>
  <div
    class="code-expired-modal"
    :class="isShow ? 'fade-modal-enter-active' : 'hide-modal'"
    @touchmove.stop="stop"
  >
    <div
      class="expired-message"
      :class="isShow ? 'scale-modal-enter-active' : 'scale-modal-leave-to'"
    >
      <p class="message">该链接已过期失效</p>
      <p class="message">请重新扫桌台二维码进行点餐</p>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { ref } from "vue";
export default {
  setup() {
    let isShow = ref(false);
    return {
      isShow,
      show() {
        isShow.value = true;
      },
      hideModal() {
        isShow.value = false;
      },
      stop() {
        return "";
      },
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.code-expired-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: -100;
  background: rgba(0, 0, 0, 0.6);

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide-modal {
    opacity: 0;
    transition: all 0.5s;
    z-index: -100;
  }

  .expired-message {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 250px;
    background-color: white;
    border-radius: 5px;

    .message {
      font-size: 16px;
      color: #595959;
      padding-bottom: 20px;
    }
  }
}

.hide-popup {
  opacity: 0;
  z-index: -1;
  transition: all 0.2s;
}

.fade-modal-enter-active {
  opacity: 1;
  z-index: 1000;
  transition: all 0.5s;
}
</style>
