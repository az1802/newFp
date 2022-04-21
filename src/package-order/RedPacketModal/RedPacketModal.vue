<template>
  <div
    class="share-red-packet-modal"
    :class="isShow ? 'fade-modal-enter-active' : 'hide'"
    :style="!isShow && 'z-index: -1'"
    @touchmove.stop="stop"
  >
    <div class="content-wrapper">
      <div class="image-wrapper">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-activity/invite-share-background_04.png"
          alt=""
          class="img-item"
          mode="widthFix"
        />
        <div class="price-wrapper">
          <div class="price-wrapper-text1">恭喜您获得提现红包</div>
          <div class="price">{{ redPacketVal / 100 }}</div>
          <div class="price-wrapper-text2">红包已自动存放至"我的-红包"</div>
        </div>
        <div class="item"></div>
      </div>
      <div class="close-wrapper">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-cancel_01.png"
          class="img-item"
          mode="widthFix"
          @click="hide"
        />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { ref, unref } from "vue";
export default {
  props: {
    redPacketVal: {
      type: [Number, String],
      default: 0,
    },
  },
  setup(props) {
    console.log(
      "%cprops: ",
      "color: MidnightBlue; background: Aquamarine; font-size: 20px;",
      props
    );
    const isShow = ref(props.redPacketVal ? true : false);

    return {
      isShow,
      hide() {
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
.share-red-packet-modal {
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
  z-index: -110;
  background: rgba(0, 0, 0, 0.6);

  &.fade-modal-enter-active {
    display: flex;
    z-index: 100;
  }

  &.hide {
    z-index: -100;
    opacity: 0;
    transition: all 0.5s;
  }

  .content-wrapper {
    width: 84%;
    position: relative;

    .image-wrapper {
      top: 25px;
      width: 100%;
      position: relative;

      .img-item {
        width: 100%;
      }

      .price-wrapper {
        position: absolute;
        height: 16vw;
        top: 5vw;
        width: 100%;
        text-align: center;

        .price-wrapper-text1 {
          font-size: 5vw;
          font-weight: bold;
          color: transparent;
          background: linear-gradient(180deg, #D19234 0%, #DE4737 100%);
          -webkit-background-clip: text;
          margin: 2vw 0 6vw 0;
        }

        .price-wrapper-text2 {
          font-size: 3vw;
          font-weight: bold;
          color: transparent;
          background: linear-gradient(180deg, #D19234 0%, #DE4737 100%);
          -webkit-background-clip: text;
          margin-bottom: 0.5vw;
          margin-top: -2vw;
        }

        .price {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, #EBA43A 0%, #EB4B3A 100%);
          -webkit-background-clip: text;
          color: transparent;
          font-weight: bold;
          font-size: 12vw;

          &::before {
            content: '￥';
            font-size: 9vw;
          }
        }
      }

      .item {
        width: 100%;
        box-sizing: border-box;
        padding: 0 12px;
        position: absolute;
        top: 66vw;
      }
    }

    .close-wrapper {
      position: absolute;
      right: 0%;
      top: 0%;
      transform: translateY(-50%);
      width: 8.8vw;
      height: 8.8vw;

      .img-item {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
