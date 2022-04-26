<template>
  <div class="login">
    <NavigationBar title="" :showArrow="false" />
    <div class="alipay-picture-wrapper">
      <img
        src="https://shilai-images.oss-cn-shenzhen.aliyuncs.com/staticImgs/common/alipay-login-background_01.png"
        alt=""
        class="alipay-picture"
        mode="widthFix"
      />
    </div>
    <form action="">
      <div class="alipay-title">授权登录后即可继续点餐</div>
      <div class="alipay-btn-group">
        <LoginBtn @loginSuccess="loginSuccess" />
        <button
          hover-class="none"
          class="alipay-refuse alipay-btn"
          @click="refuseLogin"
        >
          残忍拒绝
        </button>
      </div>
    </form>
  </div>
</template>

<script type="text/ecmascript-6">
import API from "@api";
import {
  getUserInfo,
  showToast,
  switchTab,
  reLaunchUrl,
  sleep,
  navigateBack,
} from "@utils";

let loginTime = 3;
const TAB_BAR = [
  {
    pagePath: "pages/index/index",
  },
  {
    pagePath: "pages/order/order",
  },
  {
    pagePath: "pages/mine/mine",
  },
];

export default {
  data() {
    return {};
  },
  onLoad() {},
  methods: {
    async loginSuccess() {
      await showToast("登录成功");
      await sleep(500);
      this.navigateNextPage();
    },
    navigateNextPage() {
      uni.removeStorageSync("merchantIndexLogin");
      //#ifdef MP-WEIXIN
      let targetPage = uni.getStorageSync("errorUrl");
      if (targetPage) {
        let isTab = TAB_BAR.findIndex((item) =>
          targetPage.includes(item.pagePath)
        );
        // tab页面记录参数
        isTab !== -1
          ? switchTab("/" + targetPage)
          : reLaunchUrl("/" + targetPage);
        return;
      }
      navigateBack();
      // switchTab("/" + TAB_BAR[0].pagePath);
      //#endif

      //#ifdef MP-ALIPAY
      let targetPage = uni.getStorageSync("errorUrl");
      if (targetPage) {
        let isTab = TAB_BAR.findIndex((item) =>
          targetPage.includes(item.pagePath)
        );
        reLaunchUrl("/" + targetPage);
        return;
      }
      navigateBack();
      // reLaunchUrl("/" + targetPage);
      //#endif
    },
    refuseLogin() {
      if (uni.getStorageSync("merchantIndexLogin")) {
        uni.removeStorageSync("merchantIndexLogin");
        this.navigateNextPage();
        return;
      }
      navigateBack();
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  min-height: 100vh;
  text-align: center;
  background: white;

  .alipay-picture-wrapper {
    width: 100vw;
    height: 118.4vw;

    .alipay-picture {
      width: 100vw;
      height: 118.4vw;
    }
  }

  .alipay-title {
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    color: #333333;
    padding: 20px 0;
  }

  .alipay-btn-group {
    padding: 0 12px;
    box-sizing: border-box;

    .alipay-btn {
      width: 100%;
      border-radius: 25px;
      background: #f25643;
      height: 45px;
      line-height: 45px;
      font-size: 18px;
      text-align: center;
      color: white;
      font-weight: bold;

      &.alipay-refuse {
        background: white;
        font-weight: 300;
        color: #f25643;
        margin-top: 8px;
        &::after {
          border-width: 0px;
        }
      }
    }
  }

  .picture {
    display: inline-block;
    width: px2vw(284);
    margin: 0 auto;
  }

  .title {
    margin-top: 40px;
    font-size: 18px;
    color: #353535;
  }

  .desc {
    margin-top: 10px;
    font-size: 14px;
    color: #595959;
  }

  .btn-group {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    margin-top: px2vw(87);
    padding: 0 20px;
    box-sizing: border-box;

    .btn {
      flex: 0.45;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 46px;
      border-radius: 25px;
      font-size: 16px;
      color: white;
      background: #f25643;

      &.refuse {
        border: 1px solid #e0e0e0;
        color: #888888;
        background: white;
      }
    }
  }
}
</style>
