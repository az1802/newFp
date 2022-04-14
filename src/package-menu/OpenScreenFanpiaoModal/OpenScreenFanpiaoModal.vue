<template>
  <div
    class="open-screen-coupon-modal"
    :class="showFanpiaoOpenScreenModal ? 'fade-modal-enter-active' : 'hide'"
    @touchmove.stop="stop"
  >
    <div
      class="fanpiao-modal-wrapper"
      :class="
        showFanpiaoOpenScreenModal
          ? 'scale-modal-enter-active'
          : 'scale-modal-leave-to'
      "
      @click.stop="stop"
    >
      <div class="content">
        <img
          src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/openScreen/openScreenFanpiaoBackground_10.png"
          class="header-img"
        />
        <div class="coupon-list-wtapper">
          <div v-if="!buyRecordList.length" class="time-counter-wrapper">
            <div class="text">超值饭票限时抢购</div>
            <!-- <TimeCounter customStartText=" " mode="fanpiao" /> -->
          </div>
          <div class="buy-record-list" v-if="buyRecordList.length">
            <div class="record-item">
              <swiper
                class="swiper"
                :autoplay="true"
                :interval="1000"
                :vertical="true"
                :circular="true"
              >
                <swiper-item
                  v-for="(recordItem, index) in buyRecordList"
                  :key="index"
                >
                  <div class="swiper-item">
                    <div class="user-img-wrapper">
                      <img
                        :src="recordItem.headImageUrl"
                        alt=""
                        class="img"
                        mode="aspectFit"
                      />
                    </div>
                    <div class="record-text">
                      <span v-if="recordItem.username.length <= 1">
                        **抢购了{{ recordItem.fanpiaoCategoryName }}
                      </span>
                      <span v-else>
                        {{ recordItem.username.slice(0, 1) }}**抢购了{{
                          recordItem.fanpiaoCategoryName
                        }}
                      </span>
                    </div>
                  </div>
                </swiper-item>
              </swiper>
            </div>
          </div>
          <scroll-view class="coupon-list" scroll-y>
            <div
              class="coupon-item"
              v-for="(fanpiaoItem, index) in fanpiaoList"
              :key="index"
              @click="buyFanpiao(fanpiaoItem)"
            >
              <div class="coupon-item-left">
                <div class="text1">{{ (100 - fanpiaoItem.discount) / 10 }}</div>
                <div class="text2">点餐优惠</div>
              </div>
              <div class="coupon-item-right">
                <div class="text1">{{ fanpiaoItem.name }}</div>
                <!-- <div class='text2'>有效期一年</div> -->
                <div class="text3" v-if="!disableShowFanpiaoPurchaseNumber">
                  已售<span class="num">{{
                    (fanpiaoCountArr[index] || 0) +
                    parseInt(
                      fanpiaoItem.sellingQuantity * fanpiaoSalesBoostFactor
                    )
                  }}</span>
                </div>
                <div class="coupon-item-right-buy">抢购</div>
              </div>
            </div>
          </scroll-view>
          <div class="buy-notes" @click="navigateTo('OTHER/FANPIAO_RULES')">
            购买须知
            <img
              src="@assets/arrow_right_white2.png"
              alt=""
              class="arrow_img"
            />
          </div>
        </div>
      </div>
      <div
        class="close-modal"
        @click.stop="toggleShowFanpiaoOpenScreenModal(false)"
      >
        <img src="@assets/closeIcon_03.svg" alt="关闭" class="img" />
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import API from "@api";
import { useFanpiaoOpenScreen } from "@hooks/merchantHooks";
import { usePay } from "@hooks/payhooks";
import { useNavigate } from "@hooks/commonHooks";
import { computed, watch, ref, onBeforeMount, unref, watchEffect } from "vue";

export default {
  setup() {
    let {
      showFanpiaoOpenScreenModal,
      toggleShowFanpiaoOpenScreenModal,
      fanpiaoList,
      requestBuyFanpiaoRecord,
    } = useFanpiaoOpenScreen();
    let { buyFanpiao } = usePay();
    let { navigateTo } = useNavigate();
    let buyRecordList = ref([]);

    watch(showFanpiaoOpenScreenModal, async (nval) => {
   
      if (nval && unref(buyRecordList).length == 0) {
        let res = await requestBuyFanpiaoRecord();
        buyRecordList.value = res;
      }
    });

    return {
      showFanpiaoOpenScreenModal,
      toggleShowFanpiaoOpenScreenModal,
      buyRecordList,
      fanpiaoList,
      disableShowFanpiaoPurchaseNumber: false,
      fanpiaoCountArr: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      fanpiaoSalesBoostFactor: 1,
      buyFanpiao,
      navigateTo,
    };
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.open-screen-coupon-modal {
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

  .fanpiao-modal-wrapper {
    width: 100vw;
    box-sizing: border-box;

    .content {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-sizing: border-box;
      padding: 0 40px;

      .header-img {
        width: 100%;
        height: 176px;
      }

      .coupon-list-wtapper {
        box-sizing: border-box;
        width: 100%;
        padding: 0 12px 0 12px;
        padding-bottom: 28px;
        background: #F6292A;
        border-bottom-right-radius: 8px;
        border-bottom-left-radius: 8px;
        position: relative;
        border: none;
        margin-top: -1px;

        .buy-notes {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 28px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin-left: -12px;

          .arrow_img {
            width: 5px;
            height: 8px;
            margin-left: 1px;
          }
        }

        .buy-record-list {
          height: 30px;
          line-height: 30px;
          margin-bottom: 2px;
          margin-top: -4px;
          box-sizing: border-box;

          .record-item {
            height: 20px;
            position: relative;

            .swiper {
              height: 20px;

              .swiper-item {
                display: flex;
                height: 20px;
                align-items: center;
                justify-content: center;

                .user-img-wrapper {
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  overflow: hidden;
                  background-color: #cccccc;
                  margin-right: 4px;

                  .img {
                    width: 20px;
                    height: 20px;
                  }
                }

                .record-text {
                  font-size: 14px;
                  color: white;
                }
              }
            }
          }
        }

        .time-counter-wrapper {
          color: rgba(256, 256, 256, 0.8);
          margin-top: -1px;
          margin-bottom: 9px;
          text-align: center;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .text {
            color: #FFFFFF;
            font-size: 14px;
            margin-top: -1px;
            font-weight: bold;
          }
        }

        .coupon-list {
          width: 100%;
          height: 280px;
          box-sizing: border-box;
          position: relative;

          .coupon-item {
            width: 100%;
            height: 80px;
            background-image: url('https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/openScreen/fanpiao-module-item-bg.png'); // shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/openScreen/fanpiao-module-item-bg.png);
            background-size: 100% 100%;
            background-repeat: no-repeat;
            margin-bottom: 8px;
            display: flex;

            .coupon-item-left {
              width: 35.3%;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;

              .text1 {
                font-size: 26px;
                color: #F25643;
                font-weight: bold;

                &:after {
                  content: '折';
                  font-size: 12px;
                  color: #F25643;
                  margin-left: 1px;
                }
              }

              .text2 {
                font-size: 12px;
                color: #FF4C31;
                margin-top: 2px;
              }
            }

            .coupon-item-right {
              flex: 1;
              position: relative;
              padding: 12px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;

              .text1 {
                font-size: 16px;
                color: #333333;
                font-weight: bold;
              }

              .text2 {
                font-size: 10px;
                color: rgba(0, 0, 0, 0.5);
              }

              .text3 {
                font-size: 14px;
                color: #F25643;

                .num {
                  font-size: 14px;
                  color: #F25643;
                  font-weight: bold;
                }
              }

              .coupon-item-right-buy {
                position: absolute;
                bottom: 12px;
                right: 12px;
                width: 60px;
                height: 28px;
                line-height: 28px;
                text-align: center;
                background: linear-gradient(180deg, #F2503D 0%, #FE4653 100%);
                border-radius: 24px;
                color: #FFFFFF;
                font-size: 14px;
                font-weight: bold;
              }
            }
          }
        }
      }
    }
  }

  .close-modal {
    width: 100%;
    height: 33px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 4px;

    .img {
      width: 33px;
      height: 33px;
      opacity: 0.8;
    }
  }
}
</style>
