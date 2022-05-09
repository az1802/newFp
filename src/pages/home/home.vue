<!--
 * @Author: sunj
 * @Date: 2020-09-14 11:33:10
 * @LastEditors: sunj
 * @LastEditTime: 2022-01-14 18:35:03
 * @FilePath: /fanpiao_uniapp/src/pages/home/home.vue
-->
<template>
  <div class="home">
    <NavigationBar
      backgroundColor="#F25844"
      titleColor="white"
      :showArrow="false"
      title="时来饭票"
    ></NavigationBar>
    <div class="content">
      <div class="padding-box">
        <div v-if="!userId" class="market-info">
          <div class="title">简介</div>
          <div class="text">
            时来饭票基于大数据及人工智能等先进技术手段，为商家高效搭建私域流量，沉淀会员数据，并提供自动化、个性化的精准营销服务，助力商家提高门店经营效率，优化引流，提升复购，实现可持续的营收增长。
          </div>
        </div>
        <div v-if="!userId" class="login-wrapper">
          <div class="login-tooltip-wrapper">
            <div class="icon-wrapper">
              <img
                src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/icon-tooltip_01.png"
                alt=""
                class="img"
              />
            </div>
            <p class="login-tooltip">为保障您的隐私和权益</p>
            <p class="login-tooltip">请您先进行授权登录</p>
          </div>
          <div class="login-btn-wrapper">
            <LoginBtn
              :codeMsg="codeMsg"
              @loginSuccess="loginSuccess"
            ></LoginBtn>
          </div>
        </div>
        <div class="tabs-wrapper" v-if="userId && scanCodeStatus == 'NULL'">
          <div
            class="tab-item"
            :class="tabActive == 'FANPIAO' ? 'active' : ''"
            @click="tabActive = 'FANPIAO'"
          >
            饭票
          </div>
          <div
            class="tab-item"
            :class="tabActive == 'MEMBER' ? 'active' : ''"
            @click="tabActive = 'MEMBER'"
          >
            储值
            <GetPhoneButton
              class="get-phone-btn"
              @success="getPhoneSuccess"
              v-if="userPhone"
            ></GetPhoneButton>
          </div>
        </div>
        <div class="qrcode-wrapper" v-if="userId">
          <div
            class="balance-info"
            v-if="scanCodeStatus != 'NULL' || merchantFanpiaoListShow"
            @click="backHandel"
          >
            <div class="back-box">
              <img src="@assets/arrow_right_grey.png" alt="" class="back_img" />
            </div>
            {{ merchantName }}
          </div>
          <div class="img-wrapper">
            <img class="img" :src="scanCodeUrl" alt="" />
          </div>
          <div
            class="fanpiao-balance"
            v-if="scanCodeStatus != 'NULL' || merchantFanpiaoListShow"
          >
            <div>
              <div class="amount">
                <span class="amount-icon">¥</span
                >{{
                  (scanPayMethod == "MEMBER_ACCOUNT"
                    ? userMemberCardBalance
                    : userMerchantBalance) / 100
                }}
              </div>
              <div class="text">
                {{
                  scanPayMethod == "MEMBER_ACCOUNT" ? "储值" : "饭票"
                }}余额(元)
              </div>
            </div>
          </div>
          <div class="divider" v-if="scanPayMethod !== 'MEMBER_ACCOUNT'"></div>
          <p class="tooltip-text" v-if="tabActive == 'FANPIAO'">
            买单时出示二维码，即可享受优惠呦~
          </p>
          <p class="tooltip-text" v-else>买单时出示二维码，使用储值付款呦~</p>
        </div>
      </div>
      <div
        class="fanpiao-list-wrapper"
        v-if="
          userId &&
          tabActive != 'MEMBER' &&
          userFanpiaoList.length > 0 &&
          scanCodeStatus == 'NULL' &&
          !merchantFanpiaoListShow
        "
      >
        <div class="title">我的饭票</div>
        <div class="fanpiao-list">
          <div
            class="fanpiao-item"
            v-for="fanpiaoItem in userFanpiaoList"
            :key="fanpiaoItem.merchantId"
          >
            <div
              class="fanpiao-item-content"
              @click="showMerchantFanpiaoList(fanpiaoItem)"
            >
              <img
                :src="fanpiaoItem.merchantLogoUrl"
                class="img"
                show-menu-by-longpress
              />
              <div class="item-content">
                <div class="name">{{ fanpiaoItem.merchantName }}</div>
                <div class="balance">
                  饭票余额：¥{{ fanpiaoItem.balance / 100 }}
                </div>
              </div>
              <img
                src="@assets/arrow_right_grey.png"
                alt=""
                class="arrow_img"
              />
            </div>
          </div>
        </div>
      </div>

      <PaySuccessModal
        v-if="isPaySuccessmodalShow"
        :payData="payData"
        @changePaySuccessmodalShow="changePaySuccessmodalShow"
      ></PaySuccessModal>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
// import * as Helpers from './modules/helpers'
import { sleep, showToast, tipSuccess, navigateTo } from "@utils";
import API from "@api";
import QrcodeWbsocket from "@utils/qrcodeWebsocket";

export default {
  data() {
    return {
      userId: "",
      intervalId: "",
      latitude: "",
      longitude: "",
      scanCodeUrl: "",
      scanCodeStatus: "NULL",
      qrcodeId: "",
      isGettingQrcode: false,
      userPhone: "",
      codeMsg: {},
      merchantId: "",
      merchantName: "",
      userMerchantBalance: "",
      userMemberCardBalance: "", //用户储值余额
      tabActive: "FANPIAO",
      scanPayMethod: "",
      userFanpiaoList: [],
      merchantFanpiaoList: [],
      merchantFanpiaoListShow: false,
      resData: {},
      socketTask: "",
      reconnectCount: 0,
      isReConnecting: false,
      isPaySuccessmodalShow: false,
      scene: "",
      qrcodeWbsocket: "",
      payData: {
        paidFee: 0,
        billFee: 0,
        payMethod: "",
      },
    };
  },
  async onLoad(options) {
    this.codeMsg = await uni.login();
    let { scene, q } = options;
    if (scene) {
      //扫码进入
      this.scene = options.scene;
    } else if (q) {
      let url = decodeURIComponent(q);
      let queryStrs = url.split("?")[1].split("&");
      let queryParams = {};
      queryStrs.forEach((str) => {
        let queryPair = str.split("=");
        queryParams[queryPair[0]] = queryPair[1];
      });
      if ("scene" in queryParams) {
        this.scene = queryParams.scene;
      }
    }
    //#ifdef MP-ALIPAY
    let qrCodeJson = my.getStorageSync({ key: "qrCode" }).data;
    if (qrCodeJson) {
      let { scene } = qrCodeJson;
      this.scene = scene;
    }
    // 清除扫码留下的内容避免后续订单进入仍显示这家店铺
    my.setStorageSync({
      key: "qrCode",
      data: "",
    });
    //#endif
    if (this.scene) {
      await this.getQrcodeInfo(); //获取二维码信息,拿到商户ID
    }
    this.init();
    // this._getLocation();//TODO 是否可以去掉
  },
  async onShow() {
    this.userId = uni.getStorageSync("userId");
    await this.getUserQrcode(); //更新二维码
    if (this.userId) {
      this._initQrcodeWebsocket();
    }
    uni.showTabBar({
      animation: false,
    });
  },
  onHide() {
    this.qrcodeWbsocket && this.qrcodeWbsocket.close();
  },
  onUnload() {
    this.qrcodeWbsocket && this.qrcodeWbsocket.close();
  },
  methods: {
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
    async loginSuccess() {
      this.init(); //初始化二维码等信息
      this._initQrcodeWebsocket();
    },
    async _getUserInfo() {
      let userInfo = await API.User.getUserInfo();
      if (userInfo) {
        this.userPhone = userInfo.mobilePhone;
      }
    },
    async getPhoneSuccess(phone) {
      this.userPhone = phone;
      API.User.updateUserInfo({
        phone: phone,
      });
    },
    async _getLocation() {
      try {
        let location = await uni.getLocation();
        const { latitude, longitude } = location;
        this.latitude = latitude;
        this.longitude = longitude;
      } catch (e) {
        console.warn("获取位置信息失败！");
      }
    },
    async init() {
      //根据用户id来获取更新二维码信息
      let userId = uni.getStorageSync("userId");
      if (userId) {
        this.userId = userId;
        this._getUserInfo();
        await this.getUserQrcode(); //获取用户qrcode
        this.getMerchantFanpiaoList(); //获取商户饭票
        this.getUserFanpiaoList(); //获取用户饭票列表
        this.getScanCodeStatus(); //获取二维码状态
      }
    },
    async getQrcodeInfo() {
      let res = await API.Merchant.getQrcodeInfo(this.scene); //获取二维码信息
      if (res) {
        this.logInfo = res;
        this.merchantId = (res.base && res.base.merchantId) || "";
        this.scanCodeStatus = "NEED_BUY_FANPIAO"; //显示购买饭票页面
        this.navigateToBuyFanpiao();
      } else {
        showToast("服务出错,请尝试重新扫码");
        return;
      }
    },
    viewRules() {
      this.navigate(this.$routes.other.FANPIAO_RULES);
    },
    async buyFanpiao(fanpiaoItem) {
      let data = {
        fanpiaoCategoryId: fanpiaoItem.id,
        billFee: fanpiaoItem.totalValue,
        paidFee: fanpiaoItem.totalValue,
        merchantId: this.merchantId,
        transactionType: "FANPIAO_PURCHASE",
        payMethod: "WECHAT_PAY",
      };

      // #ifdef MP-ALIPAY
      data.payMethod = "ALIPAY";
      // #endif

      // setLogRecord(`fanpiao.banner.buyBtnClickCount`,1,"add");
      let res = (await API.Merchant.pay(data)) || {};
      let transactionId = res.transactionId || "";
      if (!transactionId) {
        await showToast("饭票购买失败，请稍后再试");
        return;
      }
      switch (data.payMethod) {
        case "ALIPAY":
          let transactionId = res.transactionId || "";
          let tradeNo = res.tradeNo || "";
          if (!transactionId && !tradeNo) {
            return;
          }
          let result = await this.tradePay(tradeNo);
          if (result.resultCode === "9000") {
            await tipSuccess("饭票购买成功");
          } else {
            showToast("饭票购买失败，请稍后再试");
          }
          break;
        case "WALLET":
          if (transactionId) {
            await tipSuccess("饭票购买成功");
          }
          break;
        case "WECHAT_PAY":
          if (!res.signData) {
            showToast("饭票购买失败，请稍后再试");
            return;
          }
          const {
            timeStamp,
            nonceStr,
            package: Package,
            signType,
            paySign,
          } = res.signData;
          // 微信支付原生接口
          uni.requestPayment({
            timeStamp: String(timeStamp),
            nonceStr,
            package: Package,
            signType,
            paySign,
            success: () => {
              tipSuccess("饭票购买成功");
            },
            fail: (err) => {
              console.log(err);
              if (err.errMsg !== "requestPayment:fail cancel") {
                showToast("饭票购买失败，请稍后再试");
              }
            },
          });
          break;
        default:
          break;
      }
    },
    async getScanCodeStatus() {
      if (this.qrcodeId) {
        let requestData = {
          qrcodeId: this.qrcodeId,
        };
        if (this.merchantId) {
          //商户id存在则带上商户id
          requestData.merchantId = this.merchantId;
        }
        let res = await API.User.getUserQrcode(requestData);
        if (res) {
          let {
            isPaid,
            remainFee,
            merchantId,
            merchantName,
            balance,
            imageUrl,
            paidFee,
            billFee,
            payMethod,
            userMemberCardBalance,
          } = res;
          this.resData = res;

          if (merchantId) {
            this.merchantId = merchantId;
          }
          this.merchantName = merchantName; //更新商户名
          this.userMerchantBalance = balance; //更新用户的商家饭票余额
          if (this.scanCodeUrl != imageUrl) {
            //更新二维码图片地址
            this.scanCodeUrl = imageUrl;
          }
          if (isPaid == "1") {
            //已经支付之后重新更新qrcode
            this.scanCodeStatus = "PAID";
            this.payData = {
              paidFee: paidFee,
              billFee: billFee,
              payMethod: payMethod,
            };
            this.scanPayMethod = payMethod;
            this.isPaySuccessmodalShow = true;
            this.tabActive =
              payMethod != "MEMBER_ACCOUNT" ? "FANPIAO" : "MEMBER";
            this.userMemberCardBalance = userMemberCardBalance;
            this.getUserQrcode();
            this.getUserFanpiaoList();
            this.getMerchantFanpiaoList(); //获取商户饭票
          } else if (isPaid == "0" && remainFee > 0) {
            this.getMerchantFanpiaoList(); //获取商户饭票
            // 需要购买饭票
            this.scanCodeStatus = "NEED_BUY_FANPIAO"; //跳转到饭票购买页面,不更新二维码
            showToast("饭票余额不足,请购买饭票");
            this.getUserQrcode(); //获取新的用户二维码
          } else {
            //二维码还未被扫
          }
        }
      }
    },
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
    async getUserFanpiaoList() {
      let res = await API.User.getUserFanpiaoRecords();
      let userFanpiaoList = res.fanpiaos || [];
      let merchantMap = {};

      userFanpiaoList.forEach((fanpiaoItem) => {
        let { merchantName, merchantLogoUrl, merchantId, presentValue } =
          fanpiaoItem;
        if (!merchantMap[merchantId]) {
          merchantMap[merchantId] = {
            merchantName,
            merchantLogoUrl,
            merchantId,
            balance: 0,
          };
        }
        merchantMap[merchantId].balance += presentValue;
      });
      this.userFanpiaoList = Object.values(merchantMap);
    },
    async getMerchantFanpiaoList() {
      if (!this.merchantId) {
        return;
      } //避免轮询重复请求
      let res = await API.Merchant.getFanpiaoList(this.merchantId);
      if (res) {
        this.merchantFanpiaoList = res;
      }
    },
    async justReconnect() {
      //如果页面在二维码页面则尝试重连,否则不进行重连
      let pages = getCurrentPages();
      if (
        pages[0] &&
        pages[0].route === "pages/home/home" &&
        !this.isReConnecting
      ) {
        this.isReConnecting = true;
        let time = Math.random() * 10 * 1000; //随机10s内重连避免服务器压力
        await sleep(time);
        console.log("尝试重连", time);
        (await this.qrcodeWbsocket) && this.qrcodeWbsocket.reconnect();
        this.reconnectCount++;
        this.isReConnecting = false;
      }
    },
    changePaySuccessmodalShow(val) {
      this.isPaySuccessmodalShow = val;
    },
    backHandel() {
      this.merchantFanpiaoListShow = false;
      this.scanCodeStatus = "NULL";
      uni.showTabBar({
        animation: false,
      });
      this.getUserFanpiaoList();
    },
    async showMerchantFanpiaoList(fanpiaoItem) {
      let merchantId = fanpiaoItem.merchantId;
      navigateTo("MARKETING/FANPIAO_QRCODE", {
        merchantId,
      });
    },
    async navigateToBuyFanpiao(fanpiaoIndex) {
      // 若userid为空，则不跳转至饭票列表页
      let userId = uni.getStorageSync("userId");
      if (!userId) {
        return;
      }
      let res = await API.User.getUserFanpiaoRecords();
      let arr = [];
      let userMerchantBalance = 0;
      if (res.fanpiaos && res.fanpiaos.length > 0) {
        res.fanpiaos.map((item) => {
          if (item.merchantId === this.merchantId) {
            userMerchantBalance += item.presentValue;
          }
          arr.push(item.merchantId);
        });
      }
      if (!arr.includes(this.merchantId) || userMerchantBalance === 0 || 1) {
        navigateTo("MARKETING/FANPIAO_QRCODE", {
          merchantId: this.merchantId,
        });
        // navigateTo("MARKETING/BUY_FANPIAO", {
        //   merchantId: this.merchantId,
        // });
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.home {
  position: absolute;
  width: 100%;
  min-height: 100%;
  z-index: 100;
  box-sizing: border-box;
  background: #F5F5F5;

  .content {
    padding-bottom: 12px;

    .padding-box {
      padding: 0px 12px;
      box-sizing: border-box;
      background: linear-gradient(to bottom, #F7533E 0%, #F5F5F5 100%);
    }

    .market-info {
      height: 150px;
      border-radius: 4px;
      background-color: white;
      margin-bottom: 12px;
      padding: 20px 12px 0 12px;

      .title {
        font-size: 16px;
        height: 22px;
        line-height: 22px;
      }

      .text {
        font-size: 14px;
        color: #666666;
        height: 22px;
        line-height: 22px;
      }
    }

    .login-wrapper {
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 40px 12px 20px 12px;
      box-sizing: border-box;
      background: white;
      border-radius: 8px;

      .login-tooltip-wrapper {
        width: 191px;
        height: 191px;
        border: 1px solid #EEEBE9;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 8px;

        .icon-wrapper {
          width: 90px;
          height: 75px;
          margin: 38px 0 0px 0;
          margin-bottom: 20px;

          .img {
            width: 100%;
            height: 100%;
          }
        }

        .code-tooltip {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 8px;
        }

        .login-tooltip {
          font-size: 14px;
          text-align: center;
          line-height: 18px;
        }
      }

      .login-btn-wrapper {
        margin-top: 24px;
        width: 100%;
      }
    }

    .tabs-wrapper {
      display: flex;
      background: transparent;
      height: 44px;
      align-items: center;
      margin-bottom: 18px;

      .tab-item {
        flex: 1;
        text-align: center;
        color: white;
        font-size: 16px;
        position: relative;
        height: 44px;
        line-height: 44px;

        .get-phone-btn {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
        }

        &:last-child {
          &:before {
            content: '';
            display: inline-block;
            width: 1px;
            height: 18px;
            background: white;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        &.active {
          font-weight: bold;

          &:after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 4px;
            background: white;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -2px;
          }
        }
      }
    }

    .qrcode-wrapper {
      width: 100%;
      background: white;
      border-radius: 8px;
      box-sizing: border-box;
      overflow: hidden;

      .balance-info {
        width: 100%;
        position: relative;
        background: rgba(247, 79, 57, 0.1);
        height: 32px;
        padding: 13px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        color: #333;

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
        background: #EEEBE9;
      }

      .tooltip-text {
        padding: 20px 0;
        text-align: center;
        font-size: 14px;
        color: #666666;
      }
    }

    .fanpiao-list-wrapper, .buy-fanpiao-wrapper {
      margin: 0 12px;
      box-sizing: border-box;
      padding: 20px 12px 12px 12px;
      background: white;
      margin-top: 12px;
      border-radius: 8px;

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
          border-bottom: 1px solid #EEEBE9;
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
              border: 1px solid #EEEBE9;
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
      background: linear-gradient(360deg, #F24A44 0%, #F27544 100%);

      .buy-fanpiao-wrapper-title {
        position: relative;

        .text, .rules {
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
  }
}
</style>
