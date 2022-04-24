<template>
  <div class="buy-fanpiao-new">
    <NavigationBar
      :title="merchantInfo.merchantName"
      background="white"
      titleColor="black"
    />
    <div class="content">
      <div class="top-content">
        <div class="buy-persons">
          <div class="avatar-list" :class="[animating ? 'animate' : '']">
            <div
              class="avatar-item"
              v-for="avaratItem in showAvaterList"
              :key="avaratItem"
            >
              <img class="img" :src="avaratItem" />
            </div>
          </div>
          <div class="text">{{ fanpiaoUserNum }}人疯抢中</div>
        </div>
      </div>
      <div class="bottom-content">
        <div class="flash-sale">
          <div class="time-limit">
            <div class="text">距结束</div>
            <TimeCounter customStartText=" " :show-day="false" />
          </div>
        </div>
        <div class="buy-fanpiao-page-box">
          <div
            class="buy-fanpiao-page-item"
            v-for="(fanpiaoItem, index) in fanpiaoList"
            :key="index"
            @click="buy(fanpiaoItem, merchantInfo.merchantId)"
          >
            <div class="left">
              <div class="left-box">
                <div class="up">
                  买单享<span class="text">{{
                    parseFloat(100 - fanpiaoItem.discount) / 10
                  }}</span
                  >折
                </div>
                <div class="down">
                  已售<span class="text">{{ fanpiaoItem.sellingQuantity }}</span
                  >份
                </div>
              </div>
            </div>
            <div class="right">
              <div class="btn">
                <div class="text">{{ fanpiaoItem.sellPrice / 100 }}元抢购</div>
              </div>
            </div>
            <div class="buy-fanpiao-page-item-top" v-if="index == 0">
              人气<img
                src="@assets/hot.png"
                class="buy-fanpiao-page-item-header-icon"
              />
            </div>
            <div
              class="buy-fanpiao-page-item-top"
              v-if="index == fanpiaoList.length - 1 && index != 0"
            >
              超值<img
                src="@assets/recommend.png"
                class="buy-fanpiao-page-item-header-icon"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="buy-rule-text" @click="navigateTo('OTHER/FANPIAO_RULES')">
        购买须知<img
          src="@assets/arrow_right_white2.png"
          alt=""
          class="arrow_img"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { useMerchantInfo, useFanpiaoInfo } from "@hooks/merchantHooks";
import { useNavigate } from "@hooks/commonHooks";
import { useFanpiaoPay } from "@hooks/payHooks";
import {
  onBeforeMount,
  onBeforeUnmount,
  onUnmounted,
  watch,
  unref,
  ref,
} from "vue";
export default {
  components: {},
  onLoad() {},
  onShareAppMessage() {
    return {
      title: this.merchantName,
    };
  },
  setup() {
    let { navigateTo, navigateBack } = useNavigate();
    let { merchantInfo } = useMerchantInfo();
    let {
      fanpiaoList,
      requestFanpiaoPlatformRecords,
      fanpiaoUserNum,
      fanpiaoUserAvaterList,
    } = useFanpiaoInfo();
    const { buyFanpiao } = useFanpiaoPay();
    const animating = ref(true),
      curImgIndex = ref(null),
      showAvaterList = ref([]);

    let timeOutId = "";

    onBeforeMount(async () => {
      await requestFanpiaoPlatformRecords();
      timeOutId = setInterval(() => {
        curImgIndex.value += 1;
      }, 2000);
    });
    onBeforeUnmount(() => {
      clearTimeout(timeOutId);
    });
    watch(curImgIndex, (nval) => {
      let allAvaterList = unref(fanpiaoUserAvaterList);
      let temp = [],
        len = allAvaterList.length;
      for (let i = 0; i < 4; i++) {
        if (nval + i < len) {
          temp.push(allAvaterList[nval + i]);
        } else {
          temp.push(allAvaterList[(nval + i) % len]);
        }
      }
      showAvaterList.value = temp;
      animating.value = false;
      setTimeout(() => {
        animating.value = true;
      }, 500);
    });

    async function buy(fanpiaoItem, merchantId) {
      let payRes = await buyFanpiao(fanpiaoItem, merchantId);
      payRes && (getApp().globalData.hasBuyFanpiao = true);
      navigateBack();
    }

    return {
      animating,
      merchantInfo,
      fanpiaoUserNum,
      showAvaterList,
      fanpiaoList,
      buyFanpiao,
      navigateTo,
      buy,
    };
  },
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@keyframes hide {
  0% {
    -webkit-transform: translateX(0px) scale(1);
    transform: translateX(0px) scale(1);
    opacity: 1;
  }

  to {
    -webkit-transform: translateX(10px) scale(0);
    transform: translateX(10px) scale(0);
    opacity: 0;
  }
}

@keyframes translate {
  0% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }

  to {
    -webkit-transform: translateX(-16px);
    transform: translateX(-16px);
  }
}

@keyframes appear {
  0% {
    -webkit-transform: translateX(0) scale(0);
    transform: translateX(0) scale(0);
    opacity: 0;
  }

  to {
    -webkit-transform: translateX(-16px) scale(1);
    transform: translateX(-16px) scale(1);
    opacity: 1;
  }
}

.buy-fanpiao-new {
  width: 100%;

  .content {
    width: 100%;
    position: relative;

    .top-content {
      background-image: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/buyFanpiao/fanpiao-text-background_07.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 305px;
      width: 100%;
      display: flex;
      justify-content: center;

      .buy-persons {
        display: flex;
        background: linear-gradient(180deg, #DB1800 0%, #FC6F40 100%);
        border: 1px solid #FCC56F;
        border-radius: 14px;
        height: 26px;
        align-items: center;
        margin-top: 193px;

        .avatar-list {
          width: 80px;
          padding-left: 12px;
          height: 20px;
          display: inline-block;
          margin-right: -28px;

          &.animate {
            .avatar-item {
              animation: translate 1.5s linear 1;
              animation-fill-mode: both;

              &:first-child {
                animation: hide 1.5s linear 1;
              }

              &:last-child {
                display: inline-block;
                animation: appear 1.5s linear 1;
              }
            }
          }

          .avatar-item {
            width: 19px;
            height: 19px;
            background-color: #666666;
            border: 1px solid white;
            border-radius: 50%;
            display: inline-block;
            overflow: hidden;
            margin-left: -4px;

            &:last-child {
              display: none;
            }

            &:first-child {
              margin-left: 0px;
            }

            .img {
              width: 20px;
              height: 20px;
            }
          }
        }

        .text {
          margin-left: 8px;
          margin-right: 12px;
          height: 20px;
          line-height: 20px;
          font-size: 15px;
          display: inline-block;
          color: #fff;
          white-space: nowrap;
        }
      }
    }

    .bottom-content {
      background: #FB9A51;
      min-height: calc(100vh - 305px);
      box-sizing: border-box;
      padding: 0px 0 8px 0;
      margin-top: -20px;
    }

    .flash-sale {
      height: 62px;
      margin: 0 12px;
      position: relative;
      background-image: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/buyFanpiao/flash-sale-bg_03.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      margin-bottom: 16px;

      .time-limit {
        position: absolute;
        top: 21px;
        right: 24px;
        height: 24px;
        width: 192px;
        border-radius: 4px;
        border: 0px solid #FFEFD5;
        display: flex;
        background: linear-gradient(90deg, #FDB241 0%, #FF8927 99%);
        justify-content: center;
        align-items: center;

        .text {
          display: inline-block;
          color: #FFFFFF;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
  }
}

.buy-fanpiao-page-box {
  margin: 0 12px;
}

.buy-fanpiao-page-item {
  position: relative;
  background-image: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/buyFanpiao/fanpiao-item-bg_01.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100px;
  width: 100%;
  box-shadow: 0px 2px 4px 0px #F25643;
  border-radius: 8px;
  margin-bottom: 8px;
  display: flex;

  .left {
    width: 51.5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .left-box {
      position: absolute;
      top: 6vw;
      left: 7vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      .up {
        font-size: 20px;
        color: #F25643;
        line-height: 26px;
        width: 100%;

        .text {
          font-weight: bold;
        }
      }

      .down {
        font-size: 16px;
        color: #F25643;
        line-height: 24px;
        width: 100%;
        display: flex;
        justify-content: center;

        .text {
          font-weight: bold;
        }
      }
    }
  }

  .right {
    width: 48.5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .btn {
      background-image: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/package-static/package-payment/buyFanpiao/buy-btn.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      height: 39px;
      width: 135px;
      display: flex;
      align-items: center;
      justify-content: center;

      .text {
        color: #8F2420;
        font-weight: 600;
        font-size: 20px;
        margin-top: -4px;
      }
    }
  }
}

.buy-fanpiao-page-item-top {
  position: absolute !important;
  top: 0 !important;
  right: 0 !important;
  width: 69px !important;
  height: 24px !important;
  background: linear-gradient(90deg, #FBB765 0%, #FF903A 100%) !important;
  border-radius: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #FFFFFF !important;
  font-size: 14px !important;
  font-weight: bold !important;

  .buy-fanpiao-page-item-header-icon {
    width: 16px !important;
    height: 16px !important;
    margin-left: 5px;
  }
}

.buy-rule-text {
  position: absolute;
  right: 0;
  top: 20px;
  background: #FAB564;
  height: 24px;
  box-sizing: border-box;
  padding: 8px 6px;
  display: flex;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 100px 0px 0px 100px;

  .arrow_img {
    width: 5px;
    height: 8px;
    margin-left: 2px;
    opacity: 1;
  }
}
</style>