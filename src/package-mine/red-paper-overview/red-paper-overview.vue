<template>
  <div class="red-paper">
    <NavigationBar title="红包" />
    <div v-if="list.length == 0" class="no-red-paper-tooltip">
      暂时还未获得红包
    </div>
    <scroll-view scroll-y class="scroll-view" :style="scrollViewStyle">
      <div
        v-for="(item, index) in list"
        :key="index"
        class="paper-wrapper common-card"
      >
        <div class="icon-wrapper">
          <img
            class="img"
            src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/red-packet-background_01.png"
            alt=""
            mode="scaleToFill"
          />
          <p v-if="item.alreadyOpen" class="money">
            {{ parseFloat((item.redPacketValue || 0) / 100).toFixed(2) }}
          </p>
        </div>
        <div class="detail-wrapper">
          <div class="merchant-wrapper">
            <p class="name">{{ item.storeName }}</p>
          </div>
          <p class="type">{{ item.issueSceneText }}</p>
          <p class="time">{{ item.createTimeText }}</p>
        </div>
        <div v-if="item.alreadyOpen && !item.isSendBack" class="status">
          已领取
        </div>
        <div v-if="item.alreadyOpen && item.isSendBack" class="status invalid">
          已退回
        </div>
      </div>
    </scroll-view>
  </div>
</template>
<script>
import API from "@api";
import { onBeforeMount, ref } from "vue";
import { useSystemInfo } from "@hooks/commonHooks";
import { formatTime } from "@utils";
export default {
  setup() {
    let list = ref([]);
    let { statusBarHeight } = useSystemInfo();
    let scrollViewStyle = {
      height: `calc(100vh - ${44 + statusBarHeight}px)`,
    };
    async function _getRedPaperList() {
      let res = await API.User.getRedPaperList();
      let redPacket = res || [];
      redPacket.forEach((item) => {
        item.createTimeText = formatTime(item.createTime, "yyyy/MM/dd hh:mm");
        switch (item.issueScene) {
          case "NEW_MEMBER":
            item.issueSceneText = "新会员红包";
            item.buttonText = "立即领取";
            break;
          case "SCAN_CODE_ORDER":
            item.issueSceneText = "下单返现红包";
            item.buttonText = "立即领取";
            break;
          case "INVITE_SHARE_INVITOR":
            item.issueSceneText = "邀请奖励红包";
            item.buttonText = "立即领取";
            break;
          default:
            item.issueSceneText = "";
            item.buttonText = "立即领取";
            break;
        }
      });
      list.value = redPacket;
    }
    onBeforeMount(async () => {
      uni.showLoading();
      await _getRedPaperList();
      uni.hideLoading();
    });

    return {
      list,
      scrollViewStyle,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.red-paper {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;

  .common-card {
    background: #fff !important;
    box-shadow: 0px 1px 5px 0px rgba(223, 210, 210, 0.5);
    border-radius: 10px !important;
  }

  .no-red-paper-tooltip {
    font-size: 20px;
    color: #666666;
    text-align: center;
    padding-top: 40px;
  }

  .paper-wrapper {
    position: relative;
    display: flex;
    height: 101px;
    box-sizing: border-box;
    margin-top: 10px;
    padding: 10px 5px 0;
    overflow: hidden;
    background: white;

    .icon-wrapper {
      position: relative;
      width: 78px;
      height: 90px;
      display: flex;
      justify-content: center;

      .img {
        width: 100%;
        height: 100%;
      }

      // .icon
      // width: 85px
      // height: 85px
      // &.uncollected
      // width: 75px
      // height: 81px
      .money {
        position: absolute;
        top: 24.5px;
        left: 50%;
        transform: translate(-50%, 0);
        font-size: 18px;
        color: #F25643;
        height: 35px;
        line-height: 35px;

        &::before {
          content: '¥';
          font-size: 15px;
        }
      }
    }

    .detail-wrapper {
      flex: 1;
      overflow: hidden;
      margin-right: 40px;
      padding-left: 7px;

      .merchant-wrapper {
        display: flex;
        align-items: center;
        margin-top: 10px;

        .logo {
          width: 25px;
          height: 25px;
        }

        .name {
          // margin-left: 5px
          no-wrap();
          font-size: 16px;
          color: #333333;
          font-weight: bold;
        }
      }

      .type {
        margin-top: 8px;
        height: 14px;
        font-size: 14px;
        color: #666666;
      }

      .time {
        margin-top: 15px;
        font-size: 12px;
        color: #999999;
      }
    }

    .btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
      width: 86px;
      height: 34px;
      line-height: 34px;
      border-radius: 25px;
      text-align: center;
      font-size: 13px;
      color: white;
      background: #E3513F;
    }

    .status {
      position: absolute;
      top: 12px;
      right: -22px;
      width: 88px;
      line-height: 19px;
      text-align: center;
      font-size: 13px;
      color: white;
      background: #e3513f;
      transform: rotate(45deg);

      &.invalid {
        background: #b2b2b2;
      }
    }
  }
}
</style>
