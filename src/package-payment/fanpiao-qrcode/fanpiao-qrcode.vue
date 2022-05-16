<template>
  <div class="page-container">
    <NavigationBar backgroundColor="white" title="我的饭票"></NavigationBar>
    <div class="qrcode-wrapper">
      <div class="balance-info">
        {{ merchantInfo.merchantName }}
      </div>
      <div class="img-wrapper">
        <img class="img" :src="scanCodeUrl" alt="" />
      </div>
      <div class="fanpiao-balance">
        <div>
          <div class="amount">
            <span class="amount-icon">¥</span
            >{{ userMerchantFanpiaoBalance / 100 }}
          </div>
          <div class="text">饭票余额</div>
        </div>
      </div>
      <div class="divider"></div>
      <p class="tooltip-text">买单时出示二维码，即可享受优惠呦~</p>
    </div>

    <div class="buy-fanpiao-wrapper">
      <div class="title buy-fanpiao-wrapper-title">
        <div class="text">购买饭票</div>
        <div class="rules" @click="navigateTo('OTHER/FANPIAO_RULES')">
          购买须知
          <img src="@assets/arrow_right_white.png" alt="" class="img" />
        </div>
        <img src="@assets/snow.png" class="snow-img" />
      </div>
      <div class="merchant-fanpiao-wrapper">
        <div
          class="merchant-fanpiao-item"
          v-for="(fanpiaoItem, index) in fanpiaoList"
          :key="index"
          :class="
            index % 2 == 1
              ? 'merchant-fanpiao-item-right'
              : 'merchant-fanpiao-item-left'
          "
          @click="buyFp(fanpiaoItem, merchantId)"
        >
          <div class="price">
            {{ fanpiaoItem.totalValue / 100 }}
          </div>
          <div class="discount">已售{{ fanpiaoItem.sellingQuantity }}份</div>
          <div class="buy-wrapper">
            <span class="buy-wrapper-text"
              >买单享 {{ parseFloat(100 - fanpiaoItem.discount) / 10 }}折</span
            >
            <span class="buy-icon-box"
              ><img src="@assets/buy-icon.png" alt="" class="img"
            /></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { computed, onBeforeMount, ref, unref } from "vue";
import { useMerchantInfo, useFanpiaoInfo } from "@hooks/merchantHooks";
import { useFanpiaoPay } from "@hooks/payHooks";
import { useUserMerchantFanpiaoBalance } from "@hooks/userHooks";
import { navigateTo } from "@utils";
import QrcodeWbsocket from "@utils/qrcodeWebsocket";
import API from "@api";
let merchantId;
export default {
  onLoad(opts) {
    merchantId = opts.merchantId;
  },
  data() {
    return {
      qrcodeWbsocket: "",
      scanCodeUrl: "",
      qrcodeId: "",
    };
  },
  setup() {
    let { merchantInfo, requestMerchantInfo } = useMerchantInfo();
    let { fanpiaoList, requestFanpiaoList } = useFanpiaoInfo();
    const { userMerchantFanpiaoBalance, requestUserMerchantFanpiaoBalance } =
      useUserMerchantFanpiaoBalance();

    const { buyFanpiao } = useFanpiaoPay();

    onBeforeMount(async () => {
      await requestMerchantInfo(merchantId);
      if (!unref(merchantInfo).disableBuyFanpiao) {
        await requestFanpiaoList(merchantId);
      }
      requestUserMerchantFanpiaoBalance(merchantId);
    });

    const scanCodeUrl = ref("");
    return {
      merchantId,
      merchantInfo,
      fanpiaoList,
      navigateTo,
      buyFanpiao,
      userMerchantFanpiaoBalance,
      async buyFp(fanpiaoItem) {
        await buyFanpiao(fanpiaoItem, merchantId);
        await requestUserMerchantFanpiaoBalance(merchantId);
      },
    };
  },
  onHide() {
    this.qrcodeWbsocket && this.qrcodeWbsocket.close();
  },
  onUnload() {
    this.qrcodeWbsocket && this.qrcodeWbsocket.close();
  },
  async onShow() {
    await this.getUserQrcode(); //更新二维码
    this._initQrcodeWebsocket();
  },

  methods: {
    async getUserQrcode() {
      this.userId = uni.getStorageSync("userId");
      if (!this.userId) {
        return;
      }
      let res = await API.User.getUserQrcode();
      if (res) {
        this.scanCodeUrl = res.imageUrl;
        this.qrcodeId = res.id;
        return true;
      } else {
        return false;
      }
    },
    async _initQrcodeWebsocket() {
      //#ifdef MP-ALIPAY
      //重新初始化时支付宝小程序需要移除所有webscoket相关事件
      my.offSocketOpen();
      my.offSocketClose();
      my.offSocketError();
      my.offSocketMessage();
      //#endif
      this.qrcodeWbsocket = new QrcodeWbsocket(
        `/wsfanpiao/pos-fanpiao/${this.userId}`
      );
      await this.qrcodeWbsocket.connect(); //开启连接

      this.qrcodeWbsocket.onOpen(() => {
        this.getScanCodeStatus();
      });
      this.qrcodeWbsocket.onClose(() => {
        this.justReconnect();
      });
      this.qrcodeWbsocket.onError((err) => {
        this.justReconnect();
      });
      this.qrcodeWbsocket.onMessage((data) => {
        let msg = {};
        try {
          msg = JSON.parse(data.data);
        } catch (err) {
          msg = {};
        }
        if (
          msg.command == "FANPIAO_INFO_COMPLETE" &&
          msg.qrcodeId == this.qrcodeId
        ) {
          this.getScanCodeStatus(); //获取二维码状态执行相关操作
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-container {
  width: 100%;
  background: #f8f8f8;
}
.qrcode-wrapper {
  width: calc(100% - 24px);
  margin: 0 12px;
  background: white;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
  margin-top: 12px;
  .balance-info {
    width: 100%;
    position: relative;
    background: #f25844;
    height: 32px;
    padding: 13px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: bold;
    color: white;

    .back-box {
      position: absolute;
      left: 0;
      width: 100px;
      height: 58px;
      display: flex;
      align-items: center;
      margin-left: 12px;
      .back_img {
        height: 12px;
        width: 12px;
        transform: rotate(180deg);
      }
    }
  }

  .img-wrapper {
    text-align: center;

    .img {
      display: inline-block;
      width: 230px;
      height: 230px;
    }
  }

  .fanpiao-balance {
    display: flex;
    justify-content: center;
    color: #333;

    .amount {
      font-weight: bold;
      font-size: 30px;
      text-align: center;
    }

    .amount-icon {
      font-weight: bold;
      font-size: 14px;
    }

    .text {
      font-size: 14px;
      color: #333;
      text-align: center;
      margin: 10px 0 25px 0;
    }
  }

  .divider {
    margin: 0 12px;
    height: 1px;
    background: #eeebe9;
  }

  .tooltip-text {
    padding: 20px 0;
    text-align: center;
    font-size: 14px;
    color: #666666;
  }
}
.buy-fanpiao-wrapper {
  margin: 0 12px;
  box-sizing: border-box;
  padding: 20px 12px 12px 12px;
  background: white;
  margin-top: 12px;
  border-radius: 8px;
  width: calc(100% - 24px);
  .title {
    font-size: 18px;
    color: #333;
    font-weight: bold;
    display: flex;
    justify-content: space-between;

    .rules {
      display: flex;
      font-size: 14px;
      color: #666;
      font-weight: 400;
      align-items: center;

      .img {
        width: 12px;
        height: 12px;
      }
    }
  }

  .fanpiao-list {
    margin-top: 8px;

    .fanpiao-item {
      display: flex;
      padding: 12px 0 16px 0;
      align-items: center;
      border-bottom: 1px solid #eeebe9;
      width: 100%;

      &:last-child {
        border-bottom: 0px;
      }

      .fanpiao-item-content {
        display: flex;
        height: 40px;
        width: 100%;
        align-items: center;

        .img {
          width: 40px;
          height: 100%;
          border-radius: 4px;
          box-sizing: border-box;
          border: 1px solid #eeebe9;
        }

        .item-content {
          flex: 1;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: space-between;
          padding-left: 8px;
          box-sizing: border-box;

          .name {
            font-size: 16px;
            font-weight: bold;
            color: #333333;
          }

          .balance {
            color: #666;
            font-size: 14px;
          }
        }

        .arrow_img {
          width: 12px;
          height: 12px;
        }
      }
    }
  }
}

.buy-fanpiao-wrapper {
  background: linear-gradient(360deg, #f24a44 0%, #f27544 100%);

  .buy-fanpiao-wrapper-title {
    position: relative;

    .text,
    .rules {
      color: #fff;
    }
  }

  .snow-img {
    position: absolute;
    right: 0;
    bottom: -27px;
    width: 44px;
    height: 12px;
  }
}
.merchant-fanpiao-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
}
.merchant-fanpiao-item {
  background-image: url(https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/openScreen/fanpiao-item-bg.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 158px;
  border-radius: 8px;
  margin-bottom: 12px;
  width: calc(50% - 6px);
  .price {
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    margin-top: 32px;
    height: 30px;
    line-height: 1;
    &:before {
      content: "¥";
      font-size: 18px;
    }
  }
  .discount {
    font-size: 12px;
    color: #666;
    text-align: center;
    margin-top: 5px;
  }
  .buy-wrapper {
    height: 42px;
    background: linear-gradient(180deg, #ff6542 0%, #ff4029 100%);
    display: flex;
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
    margin: 25px 8px 12px 8px;
    align-items: center;
    justify-content: space-between;
    .buy-wrapper-text {
      font-size: 14px;
      display: flex;
      align-items: center;
      white-space: nowrap;
      color: #fff;
      padding-left: 8px;
    }
    .buy-icon-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 100%;
      border-radius: 8px;
      background: linear-gradient(180deg, #fee566 0%, #feba33 100%);
      .img {
        width: 27px;
        height: 19px;
      }
    }
  }
}
.merchant-fanpiao-item-left {
  margin-right: 6px;
}
.merchant-fanpiao-item-right {
  margin-left: 6px;
}
</style>